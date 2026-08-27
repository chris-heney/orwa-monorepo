import { describe, expect, it, vi } from "vitest";
import {
  AWARD_ADMIN_EMAIL_NAME,
  AWARD_FORM_TITLE,
  OFFICE_EMAIL,
  ORWEF_EMAIL_TEMPLATE_SEEDS,
  SCHOLARSHIP_APPLICANT_EMAIL_NAME,
  SCHOLARSHIP_ELIGIBLE_EMAIL_NAME,
  SCHOLARSHIP_OFFICE_EMAIL_NAME,
  buildAllFieldsHtml,
  buildAwardVariables,
  buildScholarshipVariables,
  interpolate,
  resolveNotificationPlan,
  sendAwardNominationEmails,
  sendScholarshipApplicationEmails,
  shouldSendEligibleParticipantEmail,
} from "./form-email";

const scholarshipPayload = {
  applicant_first_name: "Jane",
  applicant_last_name: "Doe",
  applicant_email: "jane@example.org",
  applicant_phone: "405-555-0100",
  applicant_street: "1 Main St",
  applicant_city: "Norman",
  applicant_state: "OK",
  applicant_zip: "73069",
  system_name: "Rural Water District #1",
  relationship: "DependentChild",
  eligible_participant_name: { first: "Pat", last: "Smith" },
  eligible_participant_email: "pat@example.org",
  eligible_participant_title: "Operator",
  school_name: "Norman High",
  gpa: 3.6,
  essay: 44,
  awards: "Honor roll\nBand",
  applicant_certification: true,
};

describe("interpolate", () => {
  it("replaces currentYear, all_fields, and Gravity Forms name tags", () => {
    const html = interpolate(
      "{Applicant first name} / {all_fields} / {currentYear} / {unknown}",
      {
        "Applicant first name": "Jane",
        all_fields: "<table>fields</table>",
        currentYear: "2026",
      }
    );
    expect(html).toBe("Jane / <table>fields</table> / 2026 / {unknown}");
  });

  it("fills the seeded applicant and eligible bodies", () => {
    const variables = buildScholarshipVariables(scholarshipPayload, {
      currentYear: 2026,
    });
    const applicant = interpolate(
      "<p>{Applicant first name},</p>{all_fields}",
      variables
    );
    const eligible = interpolate(
      "<p>{Eligible Participant first name},</p><p>from {Applicant first} {Applicant last}</p>",
      variables
    );
    expect(applicant.startsWith("<p>Jane,</p>")).toBe(true);
    expect(applicant).toContain("Rural Water District #1");
    expect(eligible).toContain("<p>Pat,</p>");
    expect(eligible).toContain("from Jane Doe");
  });
});

describe("all_fields HTML", () => {
  it("renders a readable table instead of raw JSON", () => {
    const html = buildAllFieldsHtml([
      { section: "Applicant", label: "First name", value: "Jane" },
      { section: "Applicant", label: "Last name", value: "Doe" },
    ]);
    expect(html).toContain("<table");
    expect(html).toContain("Applicant");
    expect(html).toContain("First name");
    expect(html).toContain("Jane");
    expect(html).not.toContain("{");
    expect(html).not.toContain('"applicant_first_name"');
  });

  it("puts the section rule between groups, not under the heading", () => {
    const html = buildAllFieldsHtml([
      { section: "Nominee", label: "Name", value: "Alex" },
      { section: "Nominee", label: "Address", value: "1 Main St" },
      { section: "Nominator", label: "Name", value: "Sam" },
    ]);
    const nomineeIdx = html.indexOf("Nominee");
    const nominatorIdx = html.indexOf("Nominator");
    const ruleIdx = html.indexOf("border-top:2px solid #1a4a7a");
    expect(nomineeIdx).toBeGreaterThan(-1);
    expect(nominatorIdx).toBeGreaterThan(nomineeIdx);
    expect(ruleIdx).toBeGreaterThan(nomineeIdx);
    expect(ruleIdx).toBeLessThan(nominatorIdx);
    expect(html).not.toMatch(/border-bottom:2px solid #1a4a7a/);
    expect(html).toContain("mso-line-height-rule:exactly");
    expect(html.indexOf("border-top:2px solid #1a4a7a")).toBe(ruleIdx);
    expect(html.indexOf("border-top:2px solid #1a4a7a", ruleIdx + 1)).toBe(-1);
  });

  it("escapes HTML and marks media as Attached", () => {
    const html = buildScholarshipVariables({
      applicant_first_name: "<b>Jane</b>",
      essay: 12,
    }).all_fields;
    expect(html).toContain("&lt;b&gt;Jane&lt;/b&gt;");
    expect(html).not.toContain("<b>Jane</b>");
    expect(html).toContain("Attached");
    expect(html).not.toContain("12");
  });

  it("builds award nomination fields with the Gravity Forms form title", () => {
    const variables = buildAwardVariables(
      {
        nominee_name: "Alex Rivera",
        award_type: "Excellence in Operations",
        email: "alex@example.org",
        nominator_first_name: "Sam",
        nominator_last_name: "Cole",
        nominator_email: "sam@example.org",
        system_name: "City of Edmond",
        award_name_printed: "Alex Rivera",
        justification: "Outstanding operator.",
      },
      { currentYear: 2026 }
    );
    expect(variables.form_title).toBe(AWARD_FORM_TITLE);
    expect(variables.all_fields).toContain("Alex Rivera");
    expect(variables.all_fields).toContain("Name as printed on award");
    expect(variables.all_fields).toContain("Sam Cole");
    expect(variables.all_fields).toContain("Excellence in Operations");
    expect(variables.all_fields).toContain("Outstanding operator.");
    expect(variables.all_fields).not.toContain("{");
    expect(
      interpolate("New submission from {form_title}", variables)
    ).toBe("New submission from ORWA Awards Nomination");
  });
});

describe("shouldSendEligibleParticipantEmail", () => {
  it("skips when the applicant is the eligible participant (Self)", () => {
    expect(
      shouldSendEligibleParticipantEmail({
        relationship: "Self",
        eligible_participant_email: "jane@example.org",
      })
    ).toBe(false);
  });

  it("skips when the eligible participant email is missing", () => {
    expect(
      shouldSendEligibleParticipantEmail({
        relationship: "DependentChild",
        eligible_participant_email: "  ",
      })
    ).toBe(false);
    expect(
      shouldSendEligibleParticipantEmail({
        relationship: "DependentGrandchild",
      })
    ).toBe(false);
  });

  it("sends when a dependent has an email", () => {
    expect(
      shouldSendEligibleParticipantEmail({
        relationship: "DependentChild",
        eligible_participant_email: "pat@example.org",
      })
    ).toBe(true);
  });
});

describe("resolveNotificationPlan", () => {
  it("sends office, applicant, and eligible on a public submit", () => {
    expect(resolveNotificationPlan()).toEqual({
      sendOffice: true,
      sendApplicant: true,
      sendEligible: true,
      customEmails: [],
    });
  });

  it("honors admin notification flags and custom test recipients", () => {
    expect(
      resolveNotificationPlan({
        adminNotification: true,
        registrantNotification: false,
      })
    ).toMatchObject({ sendOffice: true, sendApplicant: false });
    expect(
      resolveNotificationPlan({
        customEmail: "qa@orwa.org, staff@orwa.org",
        adminNotification: true,
        registrantNotification: true,
      }).customEmails
    ).toEqual(["qa@orwa.org", "staff@orwa.org"]);
  });
});

describe("template names", () => {
  it("uses distinct Email Manager email_name values", () => {
    const names = [
      SCHOLARSHIP_OFFICE_EMAIL_NAME,
      SCHOLARSHIP_APPLICANT_EMAIL_NAME,
      SCHOLARSHIP_ELIGIBLE_EMAIL_NAME,
      AWARD_ADMIN_EMAIL_NAME,
    ];
    expect(new Set(names).size).toBe(4);
    expect(ORWEF_EMAIL_TEMPLATE_SEEDS.map((row) => row.email_name)).toEqual(
      names
    );
  });
});

const mockStrapi = (templates: Record<string, { to?: string; body: string; subject: string }>) => {
  const sent: Array<Record<string, unknown>> = [];
  return {
    sent,
    strapi: {
      log: { warn: vi.fn(), info: vi.fn() },
      documents: () => ({
        findMany: async ({ filters }: { filters: { email_name: string } }) => {
          const template = templates[filters.email_name];
          return template
            ? [
                {
                  email_name: filters.email_name,
                  from_name: "ORWA",
                  from_email: "website@orwa.org",
                  ...template,
                },
              ]
            : [];
        },
      }),
      plugins: {
        email: {
          services: {
            email: {
              send: async (payload: Record<string, unknown>) => {
                sent.push(payload);
              },
            },
          },
        },
      },
    },
  };
};

describe("sendScholarshipApplicationEmails", () => {
  const templates = {
    [SCHOLARSHIP_OFFICE_EMAIL_NAME]: {
      to: OFFICE_EMAIL,
      subject: "New Scholarship Application - {currentYear}",
      body: "{all_fields}",
    },
    [SCHOLARSHIP_APPLICANT_EMAIL_NAME]: {
      subject: "Application Received",
      body: "<p>{Applicant first name},</p>{all_fields}",
    },
    [SCHOLARSHIP_ELIGIBLE_EMAIL_NAME]: {
      subject: "Application Received",
      body: "<p>{Eligible Participant first name},</p>{all_fields}",
    },
  };

  it("sends office + applicant + eligible on a public dependent submit", async () => {
    const { strapi, sent } = mockStrapi(templates);
    await sendScholarshipApplicationEmails(strapi, {
      payload: scholarshipPayload,
      attachment: {
        name: "Jane_Doe_scholarship_application.pdf",
        url: "https://admin.orwa.org/uploads/app.pdf",
      },
    });
    expect(sent.map((row) => row.to)).toEqual([
      OFFICE_EMAIL,
      "jane@example.org",
      "pat@example.org",
    ]);
    expect(sent[0].subject).toMatch(/^New Scholarship Application - \d{4}$/);
    expect(String(sent[1].html)).toContain("<p>Jane,</p>");
    expect(String(sent[2].html)).toContain("<p>Pat,</p>");
    expect(sent[0].attachment).toEqual([
      {
        name: "Jane_Doe_scholarship_application.pdf",
        url: "https://admin.orwa.org/uploads/app.pdf",
      },
    ]);
  });

  it("skips the eligible-participant email when relationship is Self", async () => {
    const { strapi, sent } = mockStrapi(templates);
    await sendScholarshipApplicationEmails(strapi, {
      payload: {
        ...scholarshipPayload,
        relationship: "Self",
        eligible_participant_email: "jane@example.org",
      },
    });
    expect(sent.map((row) => row.to)).toEqual([
      OFFICE_EMAIL,
      "jane@example.org",
    ]);
  });
});

describe("sendAwardNominationEmails", () => {
  it("sends only the admin notification with all_fields", async () => {
    const { strapi, sent } = mockStrapi({
      [AWARD_ADMIN_EMAIL_NAME]: {
        to: OFFICE_EMAIL,
        subject: "New submission from {form_title}",
        body: "{all_fields}",
      },
    });
    await sendAwardNominationEmails(strapi, {
      payload: {
        nominee_name: "Alex Rivera",
        award_type: "Excellence in Operations",
        email: "alex@example.org",
      },
    });
    expect(sent).toHaveLength(1);
    expect(sent[0].to).toBe(OFFICE_EMAIL);
    expect(sent[0].subject).toBe("New submission from ORWA Awards Nomination");
    expect(String(sent[0].html)).toContain("Alex Rivera");
    expect(String(sent[0].from)).not.toContain("marcosje");
  });
});
