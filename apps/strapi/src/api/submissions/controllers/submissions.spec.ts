import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/**
 * Controller-level coverage for the server-authoritative fields on the public
 * intake endpoints: cycle year, status, and submission date are always set
 * from the server — never from the request body — on every path, including
 * `adminOptions.resubmit`.
 */

vi.mock("../../../utils/coerce-to-schema", () => ({
  coerceToSchema: vi.fn((_uid: string, data: Record<string, unknown>) => data),
}));

vi.mock("../../../utils/document-compat", () => ({
  findOneById: vi.fn(async () => null),
  resolveDocumentId: vi.fn(async () => null),
  updateById: vi.fn(async () => ({})),
}));

vi.mock("../../../utils/active-membership", () => ({
  findActiveMembershipWatersystem: vi.fn(async () => ({
    id: 10,
    documentId: "watersystemdoc0000000001",
  })),
}));

vi.mock("../../../utils/nominatable-award-type", () => ({
  checkNominatableAwardType: vi.fn(async (name: string) => ({
    status: "nominatable",
    awardType: { id: 1, documentId: "awardtypedoc00000001", name, nominatable: true },
  })),
}));

vi.mock("../form-email", () => ({
  sendScholarshipApplicationEmails: vi.fn(async () => undefined),
  sendAwardNominationEmails: vi.fn(async () => undefined),
}));

import controllerFactory from "./submissions";
import {
  sendAwardNominationEmails,
  sendScholarshipApplicationEmails,
} from "../form-email";

const NOW = new Date("2026-10-15T12:00:00.000Z");
const EXPECTED_CYCLE_YEAR = 2027;

const SCHOLARSHIP_UID = "api::scholarship-application.scholarship-application";
const AWARD_UID = "api::award-nomination.award-nomination";
const CONTACT_UID = "api::contact.contact";
const WATERSYSTEM_UID = "api::watersystem.watersystem";

type Created = Record<string, Record<string, unknown>[]>;

const buildStrapi = () => {
  const created: Created = {};
  const create = (uid: string) =>
    vi.fn(async ({ data }: { data: Record<string, unknown> }) => {
      (created[uid] ||= []).push(data);
      return { id: 100 + created[uid].length, documentId: `${uid}-doc`, ...data };
    });

  const contactCreate = vi.fn(async ({ data }: { data: Record<string, unknown> }) => ({
    id: 7,
    documentId: "contactdoc000000000001",
    ...data,
  }));

  const strapi = {
    documents: (uid: string) => {
      if (uid === CONTACT_UID) {
        return { findMany: vi.fn(async () => []), create: contactCreate };
      }
      if (uid === WATERSYSTEM_UID) {
        return {
          findOne: vi.fn(async () => ({
            id: 10,
            documentId: "watersystemdoc0000000001",
            name: "Test Water System",
            county: "Pontotoc",
          })),
        };
      }
      if (uid === "api::log.log") {
        return { create: vi.fn(async ({ data }) => ({ id: 1, ...data })) };
      }
      if (uid === SCHOLARSHIP_UID || uid === AWARD_UID) {
        return { create: create(uid) };
      }
      return { findOne: vi.fn(async () => null) };
    },
    db: {
      connection: vi.fn(() => ({ insert: vi.fn(async () => undefined) })),
      query: () => ({ findOne: vi.fn(async () => null) }),
    },
    plugins: {
      "users-permissions": {
        services: {
          user: {
            fetchAll: vi.fn(async () => []),
            add: vi.fn(async () => ({ id: 55 })),
          },
        },
      },
    },
    log: { error: vi.fn() },
  };

  return { strapi, created };
};

const ctx = (body: Record<string, unknown>) =>
  ({
    request: { body },
    status: undefined as number | undefined,
    body: undefined as unknown,
    badRequest: vi.fn(),
  } as any);

const scholarshipBody = (extra: Record<string, unknown> = {}) => ({
  applicant_email: "e2e-seed@e2e-seed.orwa.local",
  applicant_first_name: "Seed",
  applicant_last_name: "Applicant",
  applicant_phone: "(405) 555-0100",
  applicant_street: "1 Test St",
  applicant_city: "Ada",
  applicant_state: "Oklahoma",
  applicant_zip: "74820",
  school_name: "Test HS",
  gpa: 3.5,
  relationship: "Self",
  system_name: "Test Water System",
  watersystem: "watersystemdoc0000000001",
  ...extra,
});

const awardBody = (extra: Record<string, unknown> = {}) => ({
  nominee_name: "Seed Nominee",
  system_name: "Test Water System",
  award_type: "Excellence in Operations",
  justification: "test",
  email: "e2e-seed@e2e-seed.orwa.local",
  nominator_email: "e2e-seed@e2e-seed.orwa.local",
  watersystem: "watersystemdoc0000000001",
  ...extra,
});

const NO_MAIL_RESUBMIT = {
  resubmit: true,
  adminNotification: false,
  registrantNotification: false,
  customEmail: "",
};

describe("submissions controller — server-authoritative fields", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("createScholarshipApplication", () => {
    it("ignores a future client year (2031) and stores the cycle year", async () => {
      const { strapi, created } = buildStrapi();
      const request = ctx(scholarshipBody({ scholarship_year: 2031 }));

      await controllerFactory({ strapi }).createScholarshipApplication(request);

      expect(request.status).toBe(200);
      expect(created[SCHOLARSHIP_UID]).toHaveLength(1);
      expect(created[SCHOLARSHIP_UID][0].scholarship_year).toBe(EXPECTED_CYCLE_YEAR);
    });

    it("stores the cycle year when the client omits it", async () => {
      const { strapi, created } = buildStrapi();
      const request = ctx(scholarshipBody());

      await controllerFactory({ strapi }).createScholarshipApplication(request);

      expect(request.status).toBe(200);
      expect(created[SCHOLARSHIP_UID][0].scholarship_year).toBe(EXPECTED_CYCLE_YEAR);
    });

    it("has no admin override: adminOptions.resubmit still stores the cycle year", async () => {
      const { strapi, created } = buildStrapi();
      const request = ctx(
        scholarshipBody({ scholarship_year: 2019, adminOptions: NO_MAIL_RESUBMIT })
      );

      await controllerFactory({ strapi }).createScholarshipApplication(request);

      expect(request.status).toBe(200);
      expect(created[SCHOLARSHIP_UID][0].scholarship_year).toBe(EXPECTED_CYCLE_YEAR);
    });

    it("hardcodes application_status=Submitted and submission_date=server time", async () => {
      const { strapi, created } = buildStrapi();
      const request = ctx(
        scholarshipBody({
          application_status: "Approved",
          submission_date: "2019-01-01T00:00:00.000Z",
        })
      );

      await controllerFactory({ strapi }).createScholarshipApplication(request);

      const data = created[SCHOLARSHIP_UID][0];
      expect(data.application_status).toBe("Submitted");
      expect(data.submission_date).toBe(NOW.toISOString());
    });

    it("sends emails with the stored year, not the client year", async () => {
      const { strapi } = buildStrapi();
      const request = ctx(scholarshipBody({ scholarship_year: 2031 }));

      await controllerFactory({ strapi }).createScholarshipApplication(request);

      expect(sendScholarshipApplicationEmails).toHaveBeenCalledTimes(1);
      const [, options] = vi.mocked(sendScholarshipApplicationEmails).mock.calls[0];
      expect(options.payload.scholarship_year).toBe(EXPECTED_CYCLE_YEAR);
    });
  });

  describe("createAwardNomination", () => {
    it("ignores a past client year (1999) and stores the cycle year", async () => {
      const { strapi, created } = buildStrapi();
      const request = ctx(awardBody({ award_year: 1999 }));

      await controllerFactory({ strapi }).createAwardNomination(request);

      expect(request.status).toBe(200);
      expect(created[AWARD_UID]).toHaveLength(1);
      expect(created[AWARD_UID][0].award_year).toBe(EXPECTED_CYCLE_YEAR);
    });

    it("stores the cycle year when the client omits it", async () => {
      const { strapi, created } = buildStrapi();
      const request = ctx(awardBody());

      await controllerFactory({ strapi }).createAwardNomination(request);

      expect(request.status).toBe(200);
      expect(created[AWARD_UID][0].award_year).toBe(EXPECTED_CYCLE_YEAR);
    });

    it("has no admin override: adminOptions.resubmit still stores the cycle year", async () => {
      const { strapi, created } = buildStrapi();
      const request = ctx(
        awardBody({ award_year: 2031, adminOptions: NO_MAIL_RESUBMIT })
      );

      await controllerFactory({ strapi }).createAwardNomination(request);

      expect(request.status).toBe(200);
      expect(created[AWARD_UID][0].award_year).toBe(EXPECTED_CYCLE_YEAR);
    });

    it("hardcodes nomination_status=Submitted and submission_date=server time", async () => {
      const { strapi, created } = buildStrapi();
      const request = ctx(
        awardBody({
          nomination_status: "Winner",
          submission_date: "2019-01-01T00:00:00.000Z",
        })
      );

      await controllerFactory({ strapi }).createAwardNomination(request);

      const data = created[AWARD_UID][0];
      expect(data.nomination_status).toBe("Submitted");
      expect(data.submission_date).toBe(NOW.toISOString());
    });

    it("sends emails with the stored year, not the client year", async () => {
      const { strapi } = buildStrapi();
      const request = ctx(awardBody({ award_year: 1999 }));

      await controllerFactory({ strapi }).createAwardNomination(request);

      expect(sendAwardNominationEmails).toHaveBeenCalledTimes(1);
      const [, options] = vi.mocked(sendAwardNominationEmails).mock.calls[0];
      expect(options.payload.award_year).toBe(EXPECTED_CYCLE_YEAR);
    });
  });
});
