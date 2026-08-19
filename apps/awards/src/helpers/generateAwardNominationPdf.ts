import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { IAwardNominationPayload } from "../types/types";
import { isSystemOfTheYearAward } from "./awardType";

export async function generateAwardNominationPDF(
  payload: IAwardNominationPayload
) {
  const pdfDoc = await PDFDocument.create();
  const regular = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const bold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  let page = pdfDoc.addPage();
  const { height } = page.getSize();
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

  page.drawText("ORWA Award Nomination", {
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

  write("Nominee", { header: true });
  field("Name", payload.nominee_name);
  field("Name as printed on award", payload.award_name_printed || payload.system_name);
  field("Award", payload.award_type);
  field("Year", payload.award_year);
  field("Email", payload.email);
  field("Phone", payload.daytime_phone);
  field(
    "Address",
    [payload.address, payload.city, payload.state, payload.zip]
      .filter(Boolean)
      .join(", ")
  );

  y -= 8;
  write("Nominator", { header: true });
  field(
    "Name",
    [payload.nominator_first_name, payload.nominator_last_name]
      .filter(Boolean)
      .join(" ")
  );
  field("Email", payload.nominator_email);
  field("Phone", payload.nominator_phone);
  field(
    "Address",
    [
      payload.nominator_address,
      payload.nominator_address_2,
      payload.nominator_city,
      payload.nominator_state,
      payload.nominator_zip,
      payload.nominator_country,
    ]
      .filter(Boolean)
      .join(", ")
  );

  y -= 8;
  write("System", { header: true });
  field("System name", payload.system_name);
  field("Date system began operation", payload.operation_start_date);
  field("Date employed", payload.employment_date);
  field("Beginning meter connections", payload.beginning_members);
  field("Current meter connections", payload.current_members);
  if (isSystemOfTheYearAward(payload.award_type)) {
    field("Clerical employees", payload.clerical_employees);
    field("O&M employees", payload.operation_maintenance_employees);
    field("Management employees", payload.management_employees);
  }

  y -= 8;
  write("Nomination", { header: true });
  const description = String(
    payload.justification || payload.nomination_description || ""
  )
    .replace(/\s+/g, " ")
    .trim();
  if (!description) {
    write("—");
  } else {
    for (let i = 0; i < description.length; i += 100) {
      write(description.slice(i, i + 100));
    }
  }

  y -= 8;
  write("Biography", { header: true });
  field("Method", payload.biography_method);
  if (payload.biography_method === "Copy/Paste or Type Biography") {
    const bio = String(payload.biography_text || "")
      .replace(/\s+/g, " ")
      .trim();
    if (!bio) {
      write("—");
    } else {
      for (let i = 0; i < bio.length; i += 100) {
        write(bio.slice(i, i + 100));
      }
    }
  } else {
    field(
      "Biography file",
      Array.isArray(payload.biography_file)
        ? payload.biography_file[0]?.title
        : (payload.biography_file as { title?: string } | null)?.title
    );
  }
  field(
    "Photographs",
    Array.isArray(payload.photographs) ? payload.photographs.length : 0
  );

  const bytes = await pdfDoc.save();
  return new Blob([bytes], { type: "application/pdf" });
}
