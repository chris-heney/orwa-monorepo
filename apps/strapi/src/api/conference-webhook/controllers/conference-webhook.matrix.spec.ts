import { beforeEach, describe, expect, it, vi } from "vitest";
import { createHash } from "node:crypto";

const { findOneById } = vi.hoisted(() => ({
  findOneById: vi.fn(),
}));

vi.mock("../../../utils/document-compat", () => ({
  findOneById,
}));

vi.mock("../../../utils/coerce-to-schema", () => ({
  coerceToSchema: (_uid: string, data: unknown) => data,
}));

import createController from "./conference-webhook";
import contestantLifecycles from "../../conference-contestant/content-types/conference-contestant/lifecycles";

const year = new Date().getFullYear();
const conference = {
  id: 3,
  documentId: "fall-conference",
  name: "Fall Conference",
  booths_available: 100,
  available_contestants: 100,
};
const extras = [
  { id: 11, name: "Lunch", price_online: 25, price_event: 0 },
  { id: 12, name: "Dinner", price_online: 35, price_event: 0 },
  { id: 13, name: "Banquet", price_online: 40, price_event: 40 },
];

const basePayload = (suffix: string) => ({
  booths: [],
  conference: 3,
  organization: `ORWA Matrix ${suffix}`,
  registrant: {
    first: "Matrix",
    last: suffix,
    email: `matrix-${suffix.toLowerCase()}@example.invalid`,
    phone: "4055550100",
  },
  registration_type: "Attendee",
  paymentType: "Invoice",
  paymentData: {
    amount: 100,
    billingAddress: {
      address: "123 Test Street",
      city: "Oklahoma City",
      state: "Oklahoma",
      zip: "73101",
    },
  },
  tickets: [],
  sponsors: [],
  registrationSource: "online",
  nonMemberFee: false,
  registrationAddonIds: [],
  registrationExtrasIds: [],
  accepted_terms: [],
});

describe("conference registration matrix", () => {
  let created: Record<string, any[]>;
  let updated: Record<string, any[]>;
  let nextId: number;
  let service: Record<string, any>;
  let emailSend: ReturnType<typeof vi.fn>;
  let controller: ReturnType<typeof createController>;
  let dbDecrement: ReturnType<typeof vi.fn>;
  let dbIncrement: ReturnType<typeof vi.fn>;
  let availableContestants: number | null;
  let failContestantCreate: boolean;

  beforeEach(() => {
    created = {};
    updated = {};
    nextId = 1000;
    emailSend = vi.fn(async () => undefined);
    availableContestants = 100;
    failContestantCreate = false;
    findOneById.mockReset();
    findOneById.mockImplementation(async (uid: string, id: number | string) => {
      if (uid === "api::conference.conference")
        return { ...conference, available_contestants: availableContestants };
      if (
        uid ===
          "api::conference-registration.conference-registration" &&
        Number(id) === 500
      ) {
        return {
          id: 500,
          documentId: "existing-vendor",
          conference: { id: 3 },
          year,
          type: "Vendor",
          organization: "ORWA Matrix Vendor",
          total: "400.00",
          items: [],
          attendees: [
            {
              id: 901,
              first: "Linked",
              last: "Fisher",
              email: "linked-fisher@example.invalid",
            },
          ],
        };
      }
      if (
        uid ===
          "api::conference-registration.conference-registration" &&
        Number(id) === 501
      ) {
        return {
          id: 501,
          documentId: "existing-attendee",
          conference: { id: 3 },
          year,
          type: "Attendee",
          organization: "ORWA Matrix Attendee Org",
          total: "200.00",
          items: [],
          attendees: [
            {
              id: 902,
              first: "Other",
              last: "Fisher",
              email: "other-fisher@example.invalid",
            },
          ],
        };
      }
      if (
        uid === "api::conference-sponsorship.conference-sponsorship" &&
        (Number(id) === 19 || String(id) === "19")
      ) {
        return {
          id: 19,
          documentId: "golf-hole",
          name: "Golf Hole",
          amount: 150,
          available: 16,
          allow_custom_amount: false,
        };
      }
      return null;
    });

    service = {
      logFormData: vi.fn(),
      reportWebhookFailure: vi.fn(),
      processPayment: vi.fn(async () => ({
        messages: { resultCode: "Ok", message: [] },
        transactionResponse: {
          authCode: "test-auth",
          transId: "test-transaction",
          networkTransId: "test-network",
        },
      })),
      getConstants: () => ({ user_base: {} }),
      getContact: vi.fn(async () => ({ id: 700 })),
      fetchRegistrationAddonData: vi.fn(async () => []),
      fetchExtrasData: vi.fn(async (_conference: number, ids: number[] = []) =>
        extras.filter((extra) => ids.includes(extra.id))
      ),
      handleSubractRegistrationAddonsAvailable: vi.fn(),
      handleSubractExtrasAvailable: vi.fn(),
      generateEmailHTML: vi.fn(async () => "<p>matrix</p>"),
    };

    dbDecrement = vi.fn(async (_column: string, amount = 1) => {
      if (availableContestants == null) return 0;
      if (availableContestants < amount) return 0;
      availableContestants -= amount;
      return 1;
    });
    dbIncrement = vi.fn(async (_column: string, amount = 1) => {
      if (availableContestants == null) return 0;
      availableContestants += amount;
      return 1;
    });

    const strapi = {
      config: { environment: "test" },
      service: () => service,
      db: {
        connection: (_table: string) => {
          const builder = {
            where: vi.fn(() => builder),
            decrement: dbDecrement,
            increment: dbIncrement,
          };
          return builder;
        },
      },
      documents: (uid: string) => ({
        create: vi.fn(async ({ data }: { data: any }) => {
          if (uid === "api::conference-contestant.conference-contestant") {
            await contestantLifecycles.beforeCreate({ params: { data } });
            if (failContestantCreate) {
              throw new Error("contestant lifecycle create failed");
            }
          }
          const entity = {
            ...data,
            id: nextId++,
            documentId: `${uid}-${nextId}`,
          };
          (created[uid] ??= []).push(entity);
          return entity;
        }),
        update: vi.fn(
          async ({ documentId, data }: { documentId: string; data: any }) => {
            const entity = { ...data, documentId, id: 500 };
            (updated[uid] ??= []).push(entity);
            return entity;
          }
        ),
        findMany: vi.fn(async () => []),
      }),
      plugins: {
        email: { services: { email: { send: emailSend } } },
      },
    };

    controller = createController({ strapi } as any);
  });

  const submit = async (body: Record<string, any>) => {
    const ctx = { request: { body }, body: undefined as any };
    await controller.registration(ctx, vi.fn());
    expect(ctx.body).toMatchObject({ result: "success" });
  };

  it("creates a Sponsor-only invoice even when the logo is an un-uploaded blob", async () => {
    await submit({
      ...basePayload("Sponsor"),
      registration_type: "Sponsor",
      paymentType: "Invoice",
      organization: "BancFirst",
      sponsors: [{ id: 19, name: "Golf Hole", amount: 150 }],
      logo: [
        {
          src: "blob:https://orwa.org/35a2b7cc-2a8e-4f75-af63-7d6733400da6",
          title: "BF TrustInvesment logo Blue.jpg",
          rawFile: {},
        },
      ],
      paymentData: {
        ...basePayload("Sponsor").paymentData,
        amount: 150,
        billingAddress: {
          ...basePayload("Sponsor").paymentData.billingAddress,
          email: "randy.mcdaniel@bancfirst.bank",
        },
      },
    });

    const sponsor = created["api::conference-sponsor.conference-sponsor"][0];
    expect(sponsor).toMatchObject({
      organization: "BancFirst",
      email: "matrix-sponsor@example.invalid",
      amount: 150,
    });
    expect(sponsor.logo).toBeUndefined();
    expect(created["api::invoice.invoice"][0]).toMatchObject({
      context: "conference-registration",
      resource: "conference-registrations",
      company: "BancFirst",
      payment_method: "Invoice",
      amount: 150,
    });
    expect(emailSend).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: "ORWA Fall Conference Sponsorship Invoice — BancFirst",
      })
    );
  });

  it("creates one Vendor registration with its booth relation", async () => {
    await submit({
      ...basePayload("Vendor"),
      registration_type: "Vendor",
      booths: [{ subtotal: 300, extras: [] }],
      tickets: [
        {
          first: "Vendor",
          last: "Rep",
          email: "vendor-rep@example.invalid",
          phone: "4055550101",
          type: "Vendor",
          price: 0,
          extras: [],
          ticket_type: { id: 21, name: "Vendor", context: "Vendor" },
        },
      ],
      paymentData: {
        ...basePayload("Vendor").paymentData,
        amount: 300,
      },
    });

    expect(created["api::conference-registration.conference-registration"]).toHaveLength(1);
    expect(created["api::conference-booth.conference-booth"]).toHaveLength(1);
    expect(created["api::conference-attendee.conference-attendee"][0].registration).toBe(
      created["api::conference-registration.conference-registration"][0].id
    );
  });

  it("creates one Attendee registration and persists every selected extra", async () => {
    await submit({
      ...basePayload("Attendee"),
      registrationExtrasIds: [13],
      tickets: [
        {
          first: "Attendee",
          last: "Person",
          email: "attendee-person@example.invalid",
          phone: "4055550102",
          type: "Attendee",
          price: 100,
          extras: [11, 12],
          ticket_type: { id: 22, name: "Attendee", context: "Attendee" },
        },
      ],
      paymentData: {
        ...basePayload("Attendee").paymentData,
        amount: 200,
      },
    });

    expect(created["api::conference-registration.conference-registration"]).toHaveLength(1);
    expect(created["api::conference-registration.conference-registration"][0].items).toHaveLength(1);
    expect(created["api::conference-attendee.conference-attendee"][0].items).toHaveLength(2);
  });

  it("creates a unique standalone Contestant registration", async () => {
    await submit({
      ...basePayload("Contestant"),
      registration_type: "Contestant",
      contestant_already_registered: "No",
      tickets: [
        {
          first: "Standalone",
          last: "Fisher",
          email: "standalone-fisher@example.invalid",
          phone: "4055550103",
          type: "Contestant",
          price: 150,
          extras: [],
          ticket_type: {
            id: 23,
            name: "Fishing Tournament - Contestant Only",
            context: "Contestant",
          },
        },
      ],
      paymentData: {
        ...basePayload("Contestant").paymentData,
        amount: 150,
      },
    });

    const registration =
      created["api::conference-registration.conference-registration"][0];
    expect(registration.type).toBe("Contestant");
    expect(created["api::conference-contestant.conference-contestant"][0]).toMatchObject({
      registration: registration.id,
      fee: 150,
    });
  });

  it("attaches reduced fishing to the exact Vendor without a duplicate registration", async () => {
    await submit({
      ...basePayload("Linked"),
      registration_type: "Contestant",
      tickets: [
        {
          first: "Linked",
          last: "Fisher",
          email: "linked-fisher@example.invalid",
          phone: "4055550104",
          type: "Contestant",
          price: 75,
          extras: [],
          previous_registration_id: 500,
          source_ticket_id: 901,
          ticket_type: {
            id: 24,
            name: "Fishing Tournament",
            context: "Contestant",
          },
        },
      ],
      paymentData: {
        ...basePayload("Linked").paymentData,
        amount: 75,
      },
    });

    expect(created["api::conference-registration.conference-registration"]).toBeUndefined();
    expect(updated["api::conference-registration.conference-registration"][0]).toMatchObject({
      documentId: "existing-vendor",
      id: 500,
      total: 475,
    });
    expect(created["api::conference-contestant.conference-contestant"][0].registration).toBe(
      500
    );
  });

  it("fans out a mixed cart across two orgs plus a standalone contestant", async () => {
    await submit({
      ...basePayload("Mixed"),
      registration_type: "Contestant",
      tickets: [
        {
          first: "Linked",
          last: "Fisher",
          email: "linked-fisher@example.invalid",
          phone: "4055550104",
          type: "Contestant",
          price: 75,
          extras: [],
          previous_registration_id: 500,
          source_ticket_id: 901,
          ticket_type: {
            id: 24,
            name: "Fishing Tournament",
            context: "Contestant",
          },
        },
        {
          first: "Other",
          last: "Fisher",
          email: "other-fisher@example.invalid",
          phone: "4055550105",
          type: "Contestant",
          price: 75,
          extras: [],
          previous_registration_id: 501,
          source_ticket_id: 902,
          ticket_type: {
            id: 24,
            name: "Fishing Tournament",
            context: "Contestant",
          },
        },
        {
          first: "Solo",
          last: "Golfer",
          email: "solo-golfer@example.invalid",
          phone: "4055550106",
          type: "Contestant",
          price: 125,
          extras: [],
          ticket_type: {
            id: 37,
            name: "Golfer",
            context: "Contestant",
          },
        },
      ],
      paymentData: {
        ...basePayload("Mixed").paymentData,
        amount: 275,
      },
    });

    expect(updated["api::conference-registration.conference-registration"]).toHaveLength(2);
    expect(
      created["api::conference-registration.conference-registration"]
    ).toHaveLength(1);
    expect(
      created["api::conference-registration.conference-registration"][0]
    ).toMatchObject({ type: "Contestant", total: 125 });
    expect(
      created["api::conference-contestant.conference-contestant"]
    ).toHaveLength(3);
  });

  it("does not swallow post-charge contestant create failures in mixed carts", async () => {
    failContestantCreate = true;
    const body = {
      ...basePayload("MixedFail"),
      registration_type: "Attendee",
      paymentType: "Card",
      tickets: [
        {
          first: "Attendee",
          last: "Person",
          email: "attendee-person@example.invalid",
          phone: "4055550102",
          type: "Attendee",
          price: 100,
          extras: [],
          ticket_type: {
            id: 22,
            name: "Attendee",
            context: "Attendee",
          },
        },
        {
          first: "Solo",
          last: "Golfer",
          email: "solo-golfer@example.invalid",
          phone: "4055550106",
          type: "Contestant",
          price: 125,
          extras: [],
          ticket_type: {
            id: 37,
            name: "Golfer",
            context: "Contestant",
          },
        },
      ],
      paymentData: {
        ...basePayload("MixedFail").paymentData,
        amount: 125,
      },
    };

    const request = { request: { body }, body: undefined as any };
    await controller.registration(request, vi.fn());

    expect(service.processPayment).toHaveBeenCalled();
    expect(request.body).not.toMatchObject({ result: "success" });
    expect(service.reportWebhookFailure).toHaveBeenCalledWith(
      body,
      expect.any(Error),
      expect.stringMatching(/registration/i)
    );
  });

  it("reserves golf capacity atomically before payment so concurrent requests cannot oversell", async () => {
    availableContestants = 1;
    const one = submitRaw({
      ...basePayload("RaceOne"),
      registration_type: "Contestant",
      paymentType: "Card",
      tickets: [golferLine("RaceOne")],
      paymentData: { ...basePayload("RaceOne").paymentData, amount: 125 },
    });
    const two = submitRaw({
      ...basePayload("RaceTwo"),
      registration_type: "Contestant",
      paymentType: "Card",
      tickets: [golferLine("RaceTwo")],
      paymentData: { ...basePayload("RaceTwo").paymentData, amount: 125 },
    });

    const results = await Promise.all([one, two]);

    expect(results.filter((body) => body?.result === "success")).toHaveLength(1);
    expect(results.filter((body) => body?.result === "error")).toHaveLength(1);
    expect(service.processPayment).toHaveBeenCalledTimes(1);
    expect(dbDecrement).toHaveBeenCalledTimes(2);
    expect(availableContestants).toBe(0);
  });

  it("releases a reserved golf slot exactly once when payment fails", async () => {
    availableContestants = 1;
    service.processPayment = vi.fn(async () => ({
      messages: { resultCode: "Error", message: [{ text: "Card declined" }] },
    }));

    const body = await submitRaw({
      ...basePayload("PaymentFail"),
      registration_type: "Contestant",
      paymentType: "Card",
      tickets: [golferLine("PaymentFail")],
      paymentData: { ...basePayload("PaymentFail").paymentData, amount: 125 },
    });

    expect(body).toMatchObject({ result: "error" });
    expect(dbDecrement).toHaveBeenCalledTimes(1);
    expect(dbIncrement).toHaveBeenCalledTimes(1);
    expect(availableContestants).toBe(1);
    expect(created["api::conference-contestant.conference-contestant"]).toBeUndefined();
  });

  it("releases a reserved golf slot exactly once when contestant creation fails", async () => {
    availableContestants = 1;
    failContestantCreate = true;

    const body = await submitRaw({
      ...basePayload("CreateFail"),
      registration_type: "Contestant",
      paymentType: "Card",
      tickets: [golferLine("CreateFail")],
      paymentData: { ...basePayload("CreateFail").paymentData, amount: 125 },
    });

    expect(body).not.toMatchObject({ result: "success" });
    expect(dbDecrement).toHaveBeenCalledTimes(1);
    expect(dbIncrement).toHaveBeenCalledTimes(1);
    expect(availableContestants).toBe(1);
  });

  it("consumes reserved golf capacity only once on success", async () => {
    availableContestants = 2;

    await submit({
      ...basePayload("ReserveSuccess"),
      registration_type: "Contestant",
      tickets: [golferLine("ReserveSuccess")],
      paymentData: { ...basePayload("ReserveSuccess").paymentData, amount: 125 },
    });

    expect(dbDecrement).toHaveBeenCalledTimes(1);
    expect(dbIncrement).not.toHaveBeenCalled();
    expect(availableContestants).toBe(1);
  });

  it.each([
    {
      label: "matching normalized-email token",
      test: createHash("md5")
        .update("matrix-card@example.invalid")
        .digest("hex"),
      expected: true,
    },
    { label: "malformed token", test: "invalid", expected: false },
    { label: "missing token", test: undefined, expected: false },
  ])(
    "passes testMode=$expected to payment processing for $label",
    async ({ test, expected }) => {
      const payload = {
        ...basePayload("Card"),
        registrant: {
          ...basePayload("Card").registrant,
          email: " Matrix-Card@Example.Invalid ",
        },
        paymentType: "Card",
        test,
      };

      await submit(payload);

      expect(service.processPayment).toHaveBeenCalledWith(
        payload.paymentData,
        payload.registrant,
        payload.organization,
        expected
      );
    }
  );

  const golferLine = (suffix: string) => ({
    first: "Cap",
    last: suffix,
    email: `cap-${suffix.toLowerCase()}@example.invalid`,
    phone: "4055550107",
    type: "Contestant",
    price: 125,
    extras: [],
    ticket_type: { id: 37, name: "Golfer", context: "Contestant" },
  });

  const submitRaw = async (body: Record<string, any>) => {
    const ctx = { request: { body }, body: undefined as any };
    await controller.registration(ctx, vi.fn());
    return ctx.body;
  };

  it("rejects golfers before charging when the golf tournament is sold out", async () => {
    availableContestants = 0;
    const body = await submitRaw({
      ...basePayload("SoldOut"),
      registration_type: "Contestant",
      paymentType: "Card",
      tickets: [golferLine("SoldOut")],
      paymentData: { ...basePayload("SoldOut").paymentData, amount: 125 },
    });

    expect(body).toMatchObject({ result: "error" });
    expect(String(body.message)).toMatch(/sold out/i);
    expect(service.processPayment).not.toHaveBeenCalled();
    expect(service.logFormData).not.toHaveBeenCalled();
    expect(created["api::conference-contestant.conference-contestant"]).toBeUndefined();
    expect(dbDecrement).not.toHaveBeenCalled();
  });

  it("rejects golfers when availability is already negative (oversold)", async () => {
    availableContestants = -20;
    const body = await submitRaw({
      ...basePayload("Negative"),
      registration_type: "Contestant",
      tickets: [golferLine("Negative")],
    });

    expect(body).toMatchObject({ result: "error" });
    expect(String(body.message)).toMatch(/sold out/i);
  });

  it("rejects when the cart holds more golfers than remaining spots", async () => {
    availableContestants = 1;
    const body = await submitRaw({
      ...basePayload("Partial"),
      registration_type: "Contestant",
      tickets: [golferLine("One"), golferLine("Two")],
    });

    expect(body).toMatchObject({ result: "error" });
    expect(String(body.message)).toMatch(/Only 1 golfer spot remains/);
  });

  it("still sells the last golf spots and decrements atomically", async () => {
    availableContestants = 2;
    await submit({
      ...basePayload("LastSpots"),
      registration_type: "Contestant",
      tickets: [golferLine("Three"), golferLine("Four")],
      team: "Last Team",
    });

    expect(created["api::conference-contestant.conference-contestant"]).toHaveLength(2);
    expect(dbDecrement).toHaveBeenCalledWith("available_contestants", 2);
    // No stale read-modify-write documents().update on the conference row.
    expect(updated["api::conference.conference"]).toBeUndefined();
  });

  it("counts 'Golfer - Contestant Only' against golf capacity (contains-'Golfer' rule) and rejects when sold out", async () => {
    availableContestants = 0;
    const body = await submitRaw({
      ...basePayload("ContestantOnly"),
      registration_type: "Contestant",
      contestant_already_registered: "No",
      tickets: [
        {
          ...golferLine("Standalone"),
          price: 150,
          ticket_type: {
            id: 47,
            name: "Golfer - Contestant Only",
            context: "Contestant",
          },
        },
      ],
    });

    expect(body).toMatchObject({ result: "error" });
    expect(String(body.message)).toMatch(/sold out/i);
    expect(created["api::conference-contestant.conference-contestant"]).toBeUndefined();
    expect(dbDecrement).not.toHaveBeenCalled();
  });

  it("sells and decrements for 'Golfer - Contestant Only' while capacity remains", async () => {
    availableContestants = 1;
    await submit({
      ...basePayload("ContestantOnlyOk"),
      registration_type: "Contestant",
      contestant_already_registered: "No",
      tickets: [
        {
          ...golferLine("StandaloneOk"),
          price: 150,
          ticket_type: {
            id: 47,
            name: "Golfer - Contestant Only",
            context: "Contestant",
          },
        },
      ],
    });

    expect(created["api::conference-contestant.conference-contestant"]).toHaveLength(1);
    expect(dbDecrement).toHaveBeenCalledWith("available_contestants", 1);
  });

  it("routes, gates, and decrements null-context 'Golfer - Contestant Only'", async () => {
    availableContestants = 1;
    await submit({
      ...basePayload("ContestantOnlyNullContext"),
      registration_type: "Contestant",
      contestant_already_registered: "No",
      tickets: [
        {
          ...golferLine("StandaloneNullContext"),
          price: 150,
          ticket_type: {
            id: 47,
            name: "Golfer - Contestant Only",
            context: null,
          },
        },
      ],
    });

    expect(created["api::conference-contestant.conference-contestant"]).toHaveLength(1);
    expect(created["api::conference-attendee.conference-attendee"]).toBeUndefined();
    expect(dbDecrement).toHaveBeenCalledWith("available_contestants", 1);
  });

  it("matches the capacity substring case-insensitively", async () => {
    availableContestants = 0;
    const body = await submitRaw({
      ...basePayload("CaseInsensitive"),
      registration_type: "Contestant",
      tickets: [
        {
          ...golferLine("Case"),
          ticket_type: { id: 48, name: "GOLFER (late entry)", context: "Contestant" },
        },
      ],
    });

    expect(body).toMatchObject({ result: "error" });
    expect(String(body.message)).toMatch(/sold out/i);
  });

  it("ignores the cap when available_contestants is not configured", async () => {
    availableContestants = null;
    await submit({
      ...basePayload("NoCap"),
      registration_type: "Contestant",
      tickets: [golferLine("Five")],
    });

    expect(created["api::conference-contestant.conference-contestant"]).toHaveLength(1);
    expect(dbDecrement).not.toHaveBeenCalled();
  });
});
