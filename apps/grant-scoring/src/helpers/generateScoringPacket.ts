import { PDFDocument, PDFFont, StandardFonts } from "pdf-lib";
import { IGrantApplication } from "../grant-scoring/types";
import currencyFormatter from "./currencyFormator";

// Helper function to sanitize text for PDF generation
const sanitizeText = (text: string | number | undefined | null): string => {
  if (text === undefined || text === null) return '';
  // Convert to string if it's not already
  const textStr = typeof text === 'string' ? text : String(text);
  // Replace tabs, form feeds, and other control characters
  return textStr.replace(/[\t\v\f\r]/g, ' ');
};

export async function generatePDF(
  payload: IGrantApplication,
  scoringCriterias: (string | number)[][]
) {

  try {
    const pdfDoc = await PDFDocument.create();
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const timesRomanBoldFont = await pdfDoc.embedFont(
      StandardFonts.TimesRomanBold
    );
    let page = pdfDoc.addPage();
    const { width, height } = page.getSize();


    const fontSize = 11;
    const headerFontSize = 14;
    const lineHeight = fontSize * 1.5;
    const margin = 50;
    let yPosition = height - margin;

    const originalDate = new Date(payload.application_date);

    // Add one day
    const nextDay = new Date(originalDate);
    nextDay.setDate(originalDate.getDate() + 1);


    const checkPageOverflow = () => {
      if (yPosition < margin) {
        page = pdfDoc.addPage();
        yPosition = height - margin;
      }
    };
    
    // Format the new date
    const dateReceived = nextDay.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    

    const formattedProjectCost = currencyFormatter.format(
      payload.approved_project_cost
    );

    // Header Section
    page.drawText(`Application # ${sanitizeText(payload.application_id)}`, {
      x: margin,
      y: height - margin,
      size: fontSize,
      font: timesRomanBoldFont,
    });

    page.drawText(`Date Recieved: ${dateReceived}`, {
      x: width - margin - 150, // Align with the previous text
      y: height - margin,
      size: fontSize,
      font: timesRomanFont,
    });

    yPosition -= lineHeight * 2.5; // Adjust the yPosition after the header

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

    const subTitleText = "Ranking Packet";
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

    yPosition -= lineHeight;

    // Contact Information Section
    page.drawText("Contact Information", {
      x: margin,
      y: yPosition,
      size: headerFontSize,
      font: timesRomanBoldFont,
    });

    yPosition -= lineHeight;

    const contactInfo = [
      `System Name: ${sanitizeText(payload.legal_entity_name)}`,
      `Facility ID #: ${sanitizeText(payload.facility_id)}`,
      `County: ${sanitizeText(payload.county)}`,
      `Legal Contact Name: ${sanitizeText(payload.point_of_contact.data.first)} ${sanitizeText(payload.point_of_contact.data.last)}`,
      `Title: ${sanitizeText(payload.signatory_title)}`,
      `Phone #: ${sanitizeText(payload.point_of_contact.data.phone)}`,
      `Email Address: ${sanitizeText(payload.point_of_contact.data.email)}`,
      `Street Address: ${sanitizeText(payload.physical_address_street)}, ${sanitizeText(payload.physical_address_city)}, ${sanitizeText(payload.physical_address_state)} ${sanitizeText(payload.physical_address_zip)}`,
      `Population Served: ${String(payload.population_served)}`,
    ];

    const contactItemsPerColumn = Math.ceil(contactInfo.length / 2);
    const contactColumnWidth = (width - 2 * margin) / 2;
    let contactColumnYPosition = yPosition;
    let lastContactYPosition = yPosition * 2; // Track the last yPosition used in the Contact Information section

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

    // Draw a line below the Contact Information section

    yPosition = lastContactYPosition - lineHeight * 3; // Update yPosition for the next section

    // "Do you have an engineer?" on the left below the contact information
    page.drawText(
      `Do you have an engineer?: ${payload.has_engineer ? "Yes" : "No"}`,
      {
        x: margin,
        y: yPosition,
        size: fontSize,
        font: timesRomanFont,
      }
    );

    // "Change Order Request" on the right below the contact information
    page.drawText(`Change Order: ${sanitizeText(payload.change_order_request)}`, {
      x: margin + contactColumnWidth + margin * 3, // Aligns with the right column
      y: yPosition,
      size: fontSize,
      font: timesRomanFont,
    });

    yPosition -= lineHeight * 2; // Adjust yPosition after adding these two fields

    // Funding Request Section
    page.drawText(`Funding Request (${sanitizeText(payload.drinking_or_wastewater)})`, {
      x: margin,
      y: yPosition,
      size: headerFontSize,
      font: timesRomanBoldFont,
    });

    yPosition -= lineHeight * 2;

    const itemsPerColumn = Math.ceil(scoringCriterias.length / 2);
    const columnWidth = (width - 2 * margin) / 2;
    let columnYPosition = yPosition;

    const maxLineWidth = 180; // Set the maximum width before wrapping
    const wrapText = (text: string, font: PDFFont, fontSize: number, maxWidth: number) => {
      let lines = [];
      text = sanitizeText(text);
      let words = text.split(" ");
      let currentLine = words[0];

      for (let i = 1; i < words.length; i++) {
        let width = font.widthOfTextAtSize(
          currentLine + " " + words[i],
          fontSize
        );
        if (width < maxWidth) {
          currentLine += " " + words[i];
        } else {
          lines.push(currentLine);
          currentLine = words[i];
          yPosition -= lineHeight
        }
      }
      lines.push(currentLine);
      return lines;
    };

    scoringCriterias.forEach(([order, label, score], index) => {
      const columnIndex = Math.floor(index / itemsPerColumn);
      const xPosition = margin + columnIndex * columnWidth;

      const rowIndex = index % itemsPerColumn;
      const columnYPosition = yPosition - lineHeight * rowIndex;

      // Draw the ID
      page.drawText(String(order), {
        x: xPosition,
        y: columnYPosition,
        size: fontSize,
        font: timesRomanFont,
      });

      // Wrap the label text and draw it across multiple lines if necessary
      const wrappedTextLines = wrapText(
        label.toString(),
        timesRomanFont,
        fontSize,
        maxLineWidth
      );

      wrappedTextLines.forEach((line, i) => {
        page.drawText(line, {
          x: xPosition + 30, // Adjust the label position
          y: columnYPosition - i * lineHeight, // Move subsequent lines down
          size: fontSize,
          font: timesRomanFont,
        });
      });

      // Draw the score
      page.drawText(String(score), {
        x: xPosition + 200,
        y: columnYPosition,
        size: fontSize,
        font: timesRomanFont,
      });
    });

    yPosition = columnYPosition - lineHeight * Math.ceil(scoringCriterias.length / 2) - 30; // Adjust yPosition after the funding request section

    // Project Cost Section
    page.drawText("Project Cost/Description:", {
      x: margin,
      y: yPosition,
      size: headerFontSize,
      font: timesRomanBoldFont,
    });

    const description = sanitizeText(payload.description_justification_estimated_cost);

    // Split the description by newline characters
    const normalizedDescription = description
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n");
    const lines = normalizedDescription.split("\n");

    lines.forEach((lineText) => {
      const words = lineText.split(" ");
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
          yPosition -= lineHeight; // Only decrease yPosition once the line is drawn
        } else {
          line = testLine;
        }
        checkPageOverflow(); // Check if a new page is needed

      });

      // Draw the last line
      page.drawText(line, {
        x: margin,
        y: yPosition,
        size: fontSize,
        font: timesRomanFont,
      });
    });

    yPosition -= lineHeight * 1.5; // Apply spacing after the last line

    // Make bold the estimated cost
    page.drawText(
      `Project Cost: ${formattedProjectCost.replace(/\.00$/, "")}`,
      {
        x: margin,
        y: yPosition,
        size: fontSize,
        font: timesRomanFont,
      }
    );

    // to the right display award amount and a line below with protion matched by recipient

    page.drawText(
      `Award Amount: ${currencyFormatter.format(payload.award_amount)}`,
      {
        x: width - margin - 150,
        y: yPosition,
        size: fontSize,
        font: timesRomanFont,
      }
    );

    yPosition -= lineHeight;

    page.drawText(
      `Portion Matched by Recipient: ${currencyFormatter.format(
        payload.expected_utility_match || payload.portion_matched_by_recipient || 0
      )}`,
      {
        x: width - margin - 150,
        y: yPosition,
        size: fontSize,
        font: timesRomanFont,
      }
    );

    yPosition -= lineHeight;

    page.drawText(
      `Overall Project Score: ${payload.grant_application_score.data.score}`,
      {
        x: width - margin - 150,
        y: yPosition,
        size: fontSize,
        font: timesRomanFont,
      }
    );

    // Set up constants for spacing and dimensions
    const lineThickness = 1;
    const lineLength = 150; // Length of the signature, name, and date lines

    // Set up positions for ORWA and DEQ sections
    const orwaXPosition = margin * 2; // Left side for ORWA
    const deqXPosition = width / 2 + margin; // Right side for DEQ, next to ORWA

    const initialYPosition = yPosition ;
    // Reset yPosition for both sections
    yPosition = initialYPosition - lineHeight * 2; // This ensures both sections are aligned

    // Draw lines and content for ORWA (left side)
    // ORWA Approval
    page.drawText("ORWA Approval", {
      x: orwaXPosition,
      y: yPosition,
      size: fontSize,
      font: timesRomanFont,
    });

    // Adjust Y position for the signature to appear directly under the approval label
    yPosition -= lineHeight * 1.5;

    // Draw the ORWA signature image (if any)
    if (payload.grant_application_score.data.orwa_signature) {
      const orwaSignatureImage = await pdfDoc.embedPng(
        payload.grant_application_score.data.orwa_signature
      );
      const orwaSignatureDims = orwaSignatureImage.scale(0.15); // Scale as needed
      page.drawImage(orwaSignatureImage, {
        x: orwaXPosition,
        y: yPosition - 50,
        width: orwaSignatureDims.width,
        height: orwaSignatureDims.height,
      });
    }

    // Draw a line for the ORWA signature
    page.drawLine({
      start: { x: orwaXPosition, y: yPosition - lineHeight * 2 },
      end: { x: orwaXPosition + lineLength, y: yPosition - lineHeight * 2 },
      thickness: lineThickness,
    });

    // Label below the signature line
    page.drawText("Signature", {
      x: orwaXPosition,
      y: yPosition - lineHeight * 3,
      size: fontSize,
      font: timesRomanFont,
    });

    // Adjust Y position for name and date
    yPosition -= lineHeight * 5;

    // ORWA Printed Name (above the line)
    page.drawText(
      sanitizeText(payload.grant_application_score.data.orwa_member_name),
      {
        x: orwaXPosition,
        y: yPosition,
        size: fontSize,
        font: timesRomanFont,
      }
    );

    // Draw a line for the ORWA name
    page.drawLine({
      start: { x: orwaXPosition, y: yPosition - lineHeight / 2 },
      end: { x: orwaXPosition + lineLength, y: yPosition - lineHeight / 2 },
      thickness: lineThickness,
    });

    // Label below the name line
    page.drawText("Name", {
      x: orwaXPosition,
      y: yPosition - lineHeight * 1.5,
      size: fontSize,
      font: timesRomanFont,
    });

    // Adjust Y position for date
    yPosition -= lineHeight * 3;

    // ORWA Date (above the line)
    page.drawText(
      new Date(
        payload.grant_application_score.data.createdAt
      ).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      {
        x: orwaXPosition,
        y: yPosition,
        size: fontSize,
        font: timesRomanFont,
      }
    );

    // Draw a line for the ORWA date
    page.drawLine({
      start: { x: orwaXPosition, y: yPosition - lineHeight / 2 },
      end: { x: orwaXPosition + lineLength, y: yPosition - lineHeight / 2 },
      thickness: lineThickness,
    });

    // Label below the date line
    page.drawText("Date", {
      x: orwaXPosition,
      y: yPosition - lineHeight * 1.5,
      size: fontSize,
      font: timesRomanFont,
    });

    // Reset Y position for DEQ to match ORWA's start
    yPosition = initialYPosition - lineHeight * 2; // This ensures both sections are aligned

    // DEQ Approval
    page.drawText("DEQ Approval", {
      x: deqXPosition,
      y: yPosition,
      size: fontSize,
      font: timesRomanFont,
    });

    // Adjust Y position for the signature to appear directly under the approval label
    yPosition -= lineHeight * 1.5;

    // Draw the DEQ signature image
    const deqSignatureImage = await pdfDoc.embedPng(
      payload.grant_application_score.data.deq_signature
    );
    const deqSignatureDims = deqSignatureImage.scale(0.15); // Scale as needed
    page.drawImage(deqSignatureImage, {
      x: deqXPosition,
      y: yPosition - 50,
      width: deqSignatureDims.width,
      height: deqSignatureDims.height,
    });

    // Draw a line for the DEQ signature
    page.drawLine({
      start: { x: deqXPosition, y: yPosition - lineHeight * 2 },
      end: { x: deqXPosition + lineLength, y: yPosition - lineHeight * 2 },
      thickness: lineThickness,
    });

    // Label below the signature line
    page.drawText("Signature", {
      x: deqXPosition,
      y: yPosition - lineHeight * 3,
      size: fontSize,
      font: timesRomanFont,
    });

    // Adjust Y position for name and date
    yPosition -= lineHeight * 5;

    // DEQ Printed Name (above the line)
    page.drawText(
      sanitizeText(payload.grant_application_score.data.deq_member_name),
      {
        x: deqXPosition,
        y: yPosition,
        size: fontSize,
        font: timesRomanFont,
      }
    );

    // Draw a line for the DEQ name
    page.drawLine({
      start: { x: deqXPosition, y: yPosition - lineHeight / 2 },
      end: { x: deqXPosition + lineLength, y: yPosition - lineHeight / 2 },
      thickness: lineThickness,
    });

    // Label below the name line
    page.drawText("Name", {
      x: deqXPosition,
      y: yPosition - lineHeight * 1.5,
      size: fontSize,
      font: timesRomanFont,
    });

    // Adjust Y position for date
    yPosition -= lineHeight * 3;

    // DEQ Date (above the line)
    page.drawText(
      new Date(
        payload.grant_application_score.data.createdAt
      ).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      {
        x: deqXPosition,
        y: yPosition,
        size: fontSize,
        font: timesRomanFont,
      }
    );

    // Draw a line for the DEQ date
    page.drawLine({
      start: { x: deqXPosition, y: yPosition - lineHeight / 2 },
      end: { x: deqXPosition + lineLength, y: yPosition - lineHeight / 2 },
      thickness: lineThickness,
    });

    // Label below the date line
    page.drawText("Date", {
      x: deqXPosition,
      y: yPosition - lineHeight * 1.5,
      size: fontSize,
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
