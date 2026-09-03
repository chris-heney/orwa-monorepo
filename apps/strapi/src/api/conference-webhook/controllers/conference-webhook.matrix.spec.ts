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

  beforeEach(() => {
    created = {};
    updated = {};
    nextId = 1000;
    emailSend = vi.fn(async () => undefined);
    findOneById.mockReset();
    findOneById.mockImplementation(async (uid: string, id: number | string) => {
      if (uid === "api::conference.conference") return conference;
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

    const strapi = {
      config: { environment: "test" },
      service: () => service,
      documents: (uid: string) => ({
        create: vi.fn(async ({ data }: { data: any }) => {
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
});
