import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { IScholarshipApplicationPayload } from "../types/types";
import { asFinancialResources } from "./mapScholarshipPayload";

const fullName = (name?: { first?: string; last?: string }) =>
  [name?.first, name?.last].filter(Boolean).join(" ").trim();

const addressLine = (address?: {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
}) =>
  [address?.street, address?.city, address?.state, address?.zip]
    .filter(Boolean)
    .join(", ");

export async function generateScholarshipApplicationPDF(
  payload: IScholarshipApplicationPayload
) {
  const pdfDoc = await PDFDocument.create();
  const regular = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const bold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  let page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  const margin = 50;
  const size = 11;
  const line = 16;
  let y = height - margin;

  const ensureSpace = (needed = line) => {
    if (y - needed < margin) {
      page = pdfDoc.addPage();
      y = height - margin;
    }
  };

  const write = (text: string, options: { header?: boolean } = {}) => {
    const font = options.header ? bold : regular;
    const fontSize = options.header ? 13 : size;
    ensureSpace(fontSize + 6);
    page.drawText(text.slice(0, 110), {
      x: margin,
      y,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });
    y -= options.header ? line + 4 : line;
  };

  const field = (label: string, value: unknown) => {
    const display =
      value === undefined || value === null || value === ""
        ? "—"
        : String(value);
    write(`${label}: ${display}`);
  };

  page.drawText("ORWEF Scholarship Application", {
    x: margin,
    y,
    size: 18,
    font: bold,
  });
  y -= 22;
  page.drawText(
    `Submitted ${new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })}`,
    { x: margin, y, size, font: regular }
  );
  y -= 28;

  write("Applicant", { header: true });
  field(
    "Name",
    [
      payload.applicant_first_name,
      payload.applicant_middle_name,
      payload.applicant_last_name,
    ]
      .filter(Boolean)
      .join(" ")
  );
  field("Email", payload.applicant_email);
  field("Phone", payload.applicant_phone);
  field(
    "Address",
    [
      payload.applicant_street,
      payload.applicant_city,
      payload.applicant_state,
      payload.applicant_zip,
    ]
      .filter(Boolean)
      .join(", ")
  );

  write("Eligibility", { header: true });
  field("Water system", payload.system_name);
  field("Relationship", payload.relationship);
  field("Eligible participant", fullName(payload.eligible_participant_name));
  field("Title", payload.eligible_participant_title);
  field("Participant email", payload.eligible_participant_email);
  field("Participant phone", payload.eligible_participant_phone);
  field(
    "Participant address",
    addressLine(payload.eligible_participant_address)
  );

  write("High School", { header: true });
  field("School", payload.school_name);
  field("Graduation date", payload.graduation_date);
  field("School address", addressLine(payload.school_address));
  field("GPA", payload.gpa);
  field("SAT", payload.sat_score);
  field("ACT", payload.act_score);

  write("College / University", { header: true });
  field("First year", payload.first_year);
  field("Credits completed", payload.credits_completed);
  field("Credits required", payload.credits_required);
  field("College GPA", payload.college_gpa);
  field("Education type", payload.education_type);
  field("Major", payload.major);

  write("Recommendations", { header: true });
  field("Recommender 1", fullName(payload.recommender1_name));
  field("Recommender 1 email", payload.recommender1_email);
  field("Recommender 2", fullName(payload.recommender2_name));
  field("Recommender 2 email", payload.recommender2_email);

  write("Financial aid", { header: true });
  const financialResources = asFinancialResources(
    payload as IScholarshipApplicationPayload & Record<string, unknown>
  );
  if (financialResources.length === 0) {
    field("Financial aid", "—");
  } else {
    financialResources.forEach((row, index) => {
      field(`Institution ${index + 1}`, row.institution);
      field(`Amount ${index + 1}`, row.amount);
    });
  }

  write("Certification", { header: true });
  field("Age confirmation", payload.age_confirm);
  field("Applicant certified", payload.applicant_certification ? "Yes" : "No");
  field("Certification date", payload.applicant_certification_date);
  field("Guardian", fullName(payload.guardian_name));

  if (payload.awards) {
    write("Awards", { header: true });
    String(payload.awards)
      .split("\n")
      .forEach((row) => write(row));
  }

  const bytes = await pdfDoc.save();
  return new Blob([bytes], { type: "application/pdf" });
}
