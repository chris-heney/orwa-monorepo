import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { IGrantApplicationFormPayload } from "../../types";

export async function generatePDF(
  payload: IGrantApplicationFormPayload,
) {
  try {
    const pdfDoc = await PDFDocument.create();
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const timesRomanBoldFont = await pdfDoc.embedFont(
      StandardFonts.TimesRomanBold
    );
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();

    const fontSize = 11;
    const headerFontSize = 14;
    const lineHeight = fontSize * 1.5;
    const margin = 50;
    const checkboxSize = 12;
    let yPosition = height - margin;

    const applicationNumber = "13605";
    const dateReceived = new Date().toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    // Header Section
    page.drawText(`Application # ${applicationNumber}`, {
      x: margin,
      y: height - margin,
      size: fontSize,
      font: timesRomanBoldFont,
    });

    page.drawText(`Date Received: ${dateReceived}`, {
      x: width - margin - 150, // Align with the previous text
      y: height - margin,
      size: fontSize,
      font: timesRomanFont,
    });

    yPosition -= lineHeight * 2; // Adjust the yPosition after the header

    // Title Section
    const titleText = "DEQ/ORWA Rural Infrastructure Grant (RIG)";
    const titleTextWidth = timesRomanBoldFont.widthOfTextAtSize(titleText, 18);
    page.drawText(titleText, {
      x: (width - titleTextWidth) / 2, // Center align
      y: yPosition,
      size: 18,
      font: timesRomanBoldFont,
    });
    yPosition -= lineHeight;

    const subTitleText = "Application Form";
    const subTitleTextWidth = timesRomanBoldFont.widthOfTextAtSize(
      subTitleText,
      headerFontSize
    );
    page.drawText(subTitleText, {
      x: (width - subTitleTextWidth) / 2, // Center align
      y: yPosition,
      size: headerFontSize,
      font: timesRomanBoldFont,
    });
    yPosition -= lineHeight * 2;

    // Contact Information Section
    page.drawText("Contact Information", {
      x: margin,
      y: yPosition,
      size: headerFontSize,
      font: timesRomanBoldFont,
    });
    yPosition -= lineHeight;

    const contactInfo = [
      `System Name: ${payload.legal_entity_name}`,
      `Facility ID #: ${payload.legal_entity_name}`,
      `County: ${payload.legal_entity_name}`,
      `Legal Contact Name: ${payload.point_of_contact.first} ${payload.point_of_contact.last}`,
      `Title: ${payload.signatory_title}`,
      `Phone #: ${payload.point_of_contact.phone}`,
      `Email Address: ${payload.point_of_contact.email}`,
      `Street Address: ${payload.physical_address_street}, ${payload.physical_address_city}, ${payload.physical_address_state} ${payload.physical_address_zip}`,
      `Population Served: ${payload.population_served}`,
    ];

    const contactItemsPerColumn = Math.ceil(contactInfo.length / 2);
    const contactColumnWidth = (width - 2 * margin) / 2;
    let contactColumnYPosition = yPosition;
    let lastContactYPosition = yPosition; // Track the last yPosition used in the Contact Information section

    contactInfo.forEach((text, index) => {
      // Determine the xPosition based on the column (left or right)
      const contactColumnIndex = Math.floor(index / contactItemsPerColumn);
      const xPosition = margin + contactColumnIndex * contactColumnWidth;

      // Calculate the maximum width for the text
      const maxWidth = contactColumnWidth - 10; // Slight padding from the column edge

      // Check if the text exceeds the maximum width and needs wrapping
      const words = text.split(" ");
      let line = "";
      let y = contactColumnYPosition;

      words.forEach((word, i) => {
        const testLine = line + word + " ";
        const testWidth = timesRomanFont.widthOfTextAtSize(testLine, fontSize);
        if (testWidth > maxWidth && i > 0) {
          // Draw the line
          page.drawText(line, {
            x: xPosition,
            y: y,
            size: fontSize,
            font: timesRomanFont,
          });
          line = word + " ";
          y -= lineHeight;
        } else {
          line = testLine;
        }
      });

      // Draw the last line
      page.drawText(line, {
        x: xPosition,
        y: y,
        size: fontSize,
        font: timesRomanFont,
      });

      // Update lastContactYPosition to the lowest point reached by the text
      lastContactYPosition = y;

      // Adjust yPosition for the next row
      if (index % contactItemsPerColumn === contactItemsPerColumn - 1) {
        // For the new column, reset the yPosition
        contactColumnYPosition = yPosition;
      } else {
        contactColumnYPosition = lastContactYPosition - lineHeight;
      }
    });

    yPosition = lastContactYPosition - lineHeight; // Update yPosition for the next section
    yPosition -= lineHeight; // Add space after the Contact Information section

    // Project Cost Section
    page.drawText("Project Cost/Description:", {
      x: margin,
      y: yPosition,
      size: headerFontSize,
      font: timesRomanBoldFont,
    });

    const description = payload.description_justification_estimated_cost;

    const words = description.split(" ");

    let line = "";
    yPosition -= lineHeight;

    words.forEach((word, i) => {
      const testLine = line + word + " ";
      const testWidth = timesRomanFont.widthOfTextAtSize(testLine, fontSize);
      if (testWidth > width - 2 * margin && i > 0) {
        // Draw the line
        page.drawText(line, {
          x: margin,
          y: yPosition,
          size: fontSize,
          font: timesRomanFont,
        });
        line = word + " ";
        yPosition -= lineHeight;
      } else {
        line = testLine;
      }
    });

    // Draw the last line

    page.drawText(line, {
      x: margin,
      y: yPosition,
      size: fontSize,
      font: timesRomanFont,
    });

    yPosition -= lineHeight * 1.5;

    page.drawText("Estimated Cost: $100,000", {
      x: margin,
      y: yPosition,
      size: fontSize,
      font: timesRomanFont,
    });
    yPosition -= lineHeight * 2;

    // Certification Section
    page.drawText("Certification: ", {
      x: margin,
      y: yPosition,
      size: headerFontSize,
      font: timesRomanBoldFont,
    });

    yPosition -= lineHeight;

    page.drawText(
      "I certify that, to the best of my knowledge and belief, the information included on and with this Application,",
      {
        x: margin,
        y: yPosition,
        size: fontSize,
        font: timesRomanFont,
      }
    );
    yPosition -= lineHeight;

    page.drawText(
      "including all attachments, are true and correct, and that I agreed to abide by the qualifying conditions",
      {
        x: margin,
        y: yPosition,
        size: fontSize,
        font: timesRomanFont,
      }
    );

    yPosition -= lineHeight;

    page.drawText("of the Rural Infrastructure Grant (RIG) program.", {
      x: margin,
      y: yPosition,
      size: fontSize,
      font: timesRomanFont,
    });

    yPosition -= lineHeight * 2;

    page.drawText("Printed Name:", {
      x: margin,
      y: yPosition,
      size: fontSize,
      font: timesRomanFont,
    });
    page.drawText(payload.signatory_name, {
      x: margin + 100,
      y: yPosition,
      size: fontSize,
      font: timesRomanFont,
    });

    yPosition -= lineHeight;

    page.drawText("Title:", {
      x: margin,
      y: yPosition,
      size: fontSize,
      font: timesRomanFont,
    });
    page.drawText(payload.signatory_title, {
      x: margin + 100,
      y: yPosition,
      size: fontSize,
      font: timesRomanFont,
    });

    yPosition -= lineHeight;

    page.drawText("Date:", {
      x: margin,
      y: yPosition,
      size: fontSize,
      font: timesRomanFont,
    });

    page.drawText(new Date().toLocaleDateString(), {
      x: margin + 100,
      y: yPosition,
      size: fontSize,
      font: timesRomanFont,
    });

    // Draw signature image
    const signatureImage = await pdfDoc.embedPng(payload.signature);
    const signatureDims = signatureImage.scale(0.2); // Scale the image size as needed

    page.drawImage(signatureImage, {
      x: margin + 250,
      y: yPosition - lineHeight, // Adjust vertical position as needed
      width: signatureDims.width,
      height: signatureDims.height,
    });

    // Draw the line for the signature
    page.drawLine({
      start: { x: margin + 250, y: yPosition },
      end: { x: margin + 450, y: yPosition },
      thickness: 1,
      color: rgb(0, 0, 0),
    });

    page.drawText("Signature", {
      x: margin + 255,
      y: yPosition - lineHeight,
      size: fontSize * 0.75,
      font: timesRomanFont,
    });

    // Save the PDF
    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
}
