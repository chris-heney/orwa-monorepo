import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { wrapAndDrawText } from "../../../../services/uploadService";
import { IGrantApplication } from "../GrantApplicationTypes";
import { formatNumber } from "../../../../helpers/Formators";

export async function generateAwardLetter(application: IGrantApplication) {
  try {
    const pdfDoc = await PDFDocument.create();
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();

    const fontSize = 11;
    const headerFontSize = 14;
    const lineHeight = fontSize * 1;
    const margin = 50;
    let yPosition = height - margin;

    // Header Section
    const headerText =
      "OKLAHOMA DEPARTMENT OF ENVIRONMENTAL QUALITY\nOKLAHOMA RURAL WATER ASSOCIATION";
    headerText.split("\n").forEach((line) => {
      page.drawText(line, {
        // Center align the text
        x: (width - timesRomanFont.widthOfTextAtSize(line, headerFontSize)) / 2,
        y: yPosition,
        size: headerFontSize,
        font: timesRomanFont,
      });
      yPosition -= lineHeight;
    });

    yPosition -= lineHeight;

    // Title Section
    const titleText = `RIG RECIPIENT\n ${application.legal_entity_name}`;
    titleText.split("\n").forEach((line) => {
      page.drawText(line, {
        x: (width -timesRomanFont.widthOfTextAtSize(line, headerFontSize)) / 2,
        y: yPosition,
        size: headerFontSize,
        font: timesRomanFont,
      });
      yPosition -= lineHeight;
    });

    yPosition -= lineHeight;

    const subtitleText = `RIG AGREEMENT\nbetween ${application.legal_entity_name} \nand the Oklahoma Rural Water Association`;
    subtitleText.split("\n").forEach((line) => {
      page.drawText(line, {
        x: (width - timesRomanFont.widthOfTextAtSize(line, headerFontSize)) / 2,
        y: yPosition,
        size: headerFontSize,
        font: timesRomanFont,
      });
      yPosition -= lineHeight;
    });

    yPosition -= lineHeight;

    // Agreement Section
    const agreementText = `I, ${
      application.chairman.first + " " + application.chairman.last
    }, duly authorized Chairman of the ${
      application.legal_entity_name
    } (hereinafter "Applicant"), do hereby accept and acknowledge said grant according to the terms of this Rural Infrastructure Grant (hereinafter "RIG") Agreement. Receipt of the subject grant funds shall be acknowledged by separate receipt instrument at the time the same shall be received by an authorized representative of Applicant.

In accepting said grant, applicant duly acknowledges and agrees that in all regards and respects, Applicant must and shall comply with the requirements of all applicable federal and state statutory provisions and all terms of this RIG Grant Agreement. Without limiting the generality of the foregoing, the applicant agrees as follows:
`;
    yPosition = wrapAndDrawText(
      page,
      agreementText,
      timesRomanFont,
      fontSize,
      lineHeight,
      margin,
      width,
      yPosition
    );

    // Agreement Points
    const points = [
      `1. Description of approved project. This grant has been approved by the RIG Committee for the Applicant's project which shall be as described in the approved RIG Application as well as other related construction and appurtenances (the \\"Project\\"), as provided in the Approved RIG Application attached hereto as \\"Application #${application.application_id}\\" and incorporated by reference herein. Authorized Project costs include project construction labor pursuant to contract (except force account labor), construction materials, soil testing, engineering, and inspections.`,
      `2. Determination of amount of grant. The amount of this grant shall not exceed ${formatNumber(
        application.award_amount
      )}.`,
      `3. Submission of invoices and proof of project completion. Applicant shall maintain proper books, records, and supporting documentation such as invoices, billing statements, and canceled checks for approved Project Costs showing to the satisfaction of the Oklahoma Rural Water Association (ORWA) the amounts and purposes of all expenditures expected to be reimbursed by the RIG, and shall forward the same to ORWA for inspection and examination by the RIG Committee. As a prerequisite to receiving grant money from the ORWA, Applicant shall submit to ORWA copies of invoices for Project Costs. Additionally, Applicant shall submit to on-premises inspection by ORWA of invoiced projects. For projects which are inaccessible for inspection upon completion (i.e. infrastructure buried below ground), Applicant shall provide to ORWA digital photographs showing work progress of completed projects before they are buried. Any disbursement for Project Costs made without adequate supporting documentation and inspection shall be deemed to be an unauthorized expenditure for which Applicant may not be reimbursed. The Applicant shall direct any and all questions regarding whether an expenditure is authorized to the ORWA prior to making the expenditure. Upon review and approval of such documentation of paid Project Costs, ORWA will request funds from DEQ and upon receipt of such funds, ORWA will release the grant money to Applicant"`,
      `4. Twenty percent match requirement. The Applicant is required to match at least 20% of the final invoiced Project costs and is responsible for paying all Project costs in excess of the award amount listed in paragraph 2 above.`,
    ];

    points.forEach((point) => {
      yPosition = wrapAndDrawText(
        page,
        point,
        timesRomanFont,
        fontSize,
        lineHeight,
        // align right
        margin + 25,
        width + 25,
        yPosition
      );
      yPosition -= lineHeight;
    });

    // Signature Section
    const signatureText = `
In consideration of the applicant's agreement to these terms and conditions, applicant has entered into and signed this RIG Agreement this _____ day of ________, 20__.
`;
    yPosition = wrapAndDrawText(
      page,
      signatureText,
      timesRomanFont,
      fontSize,
      lineHeight,
      margin,
      width,
      yPosition
    );

    // Signature Section

    yPosition -= lineHeight * 2;

    yPosition -= lineHeight;

    yPosition = wrapAndDrawText(
      page,
      // `\n${application.physical_address_street}\n${application.physical_address_city}, ${application.physical_address_state} ${application.physical_address_zip}`,
      `${application.legal_entity_name}, ${application.county} County, ${application.physical_address_state}`,
      timesRomanFont,
      fontSize,
      lineHeight,
      margin + 250,
      width + 300,
      yPosition
    );

    page.drawText("Attest: ", {
      x: margin,
      y: yPosition + lineHeight,
      size: fontSize,
      font: timesRomanFont,
    });

    yPosition -= lineHeight * 2;

    page.drawLine({
      start: { x: margin + 30, y: yPosition },
      end: { x: margin + 200, y: yPosition },
      thickness: 1,
      color: rgb(0, 0, 0),
    });

    page.drawText("Title: ", {
      x: margin,
      y: yPosition,
      size: fontSize,
      font: timesRomanFont,
    });

    yPosition -= lineHeight * 2;

    page.drawText("By: ", {
      x: margin,
      y: yPosition,
      size: fontSize,
      font: timesRomanFont,
    });

    page.drawLine({
      start: { x: margin + 30, y: yPosition },
      end: { x: margin + 200, y: yPosition },
      thickness: 1,
      color: rgb(0, 0, 0),
    });

    yPosition -= lineHeight * 2;

    page.drawLine({
      start: { x: margin + 250, y: yPosition },
      end: { x: margin + 500, y: yPosition },
      thickness: 1,
      color: rgb(0, 0, 0),
    });

    yPosition -= lineHeight;

    page.drawText("(BOARD SEAL)", {
      x: margin,
      y: yPosition,
      size: fontSize,
      font: timesRomanFont,
    });

    {
      application.chairman &&
        page.drawText(
          `By: ${
            application.chairman.first + " " + application.chairman.last
          } `,
          {
            x: margin + 250,
            y: yPosition,
            size: fontSize,
            font: timesRomanFont,
          }
        );
    }

    // Save the PDF
    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
}
