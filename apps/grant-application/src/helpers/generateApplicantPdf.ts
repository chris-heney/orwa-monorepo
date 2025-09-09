import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { IGrantApplicationFormPayload } from "../types/types";
import currencyFormatter from "./currencyFormat";

interface GrantApplicationWithId extends IGrantApplicationFormPayload {
  id: string;
}

export async function generatePDF(
  payload: GrantApplicationWithId,
  scoringCriterias: (string | boolean)[][]
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
    const checkboxSize = 12;
    let yPosition = height - margin / 2;

    const checkPageOverflow = () => {
      if (yPosition < margin) {
        page = pdfDoc.addPage();
        yPosition = height - margin;
      }
    };
    
    const dateReceived = new Date().toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const formattedCost = currencyFormatter.format(
      payload.combined_cost_of_projects
    );

    // Header Section
    page.drawText(`Application # ${payload.id}`, {
      x: margin,
      y: height - margin / 2,
      size: fontSize,
      font: timesRomanBoldFont,
    });

    page.drawText(`Date Received: ${dateReceived}`, {
      x: width - margin - 150, // Align with the previous text
      y: height - margin / 2,
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

    yPosition -= lineHeight ;

    // Contact Information Section
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
      `Facility ID #: ${payload.facility_id}`,
      `County: ${payload.county}`,
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

    // Draw a line below the Contact Information section
    
    yPosition = lastContactYPosition - lineHeight * 1.5 ; // Update yPosition for the next section

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
    page.drawText(`Change Order: ${payload.change_order_request}`, {
      x: margin + contactColumnWidth + margin * 3, // Aligns with the right column
      y: yPosition,
      size: fontSize,
      font: timesRomanFont,
    });

    yPosition -= lineHeight ; // Adjust yPosition after adding these two fields

    yPosition = lastContactYPosition - lineHeight; // Update yPosition for the next section
    yPosition -= lineHeight * 2 ; // Add space after the Contact Information section

    // Funding Request Section
    page.drawText(`Funding Request (${payload.drinking_or_wastewater})`, {
      x: margin,
      y: yPosition,
      size: headerFontSize,
      font: timesRomanBoldFont,
    });
    yPosition -= lineHeight;

    const itemsPerColumn = Math.ceil(scoringCriterias.length / 2);
    const columnWidth = (width - 2 * margin) / 2;
    let columnYPosition = yPosition;

    scoringCriterias.forEach(([id, description, checked], index) => {
      // Determine the xPosition based on the column (left or right)
      const columnIndex = Math.floor(index / itemsPerColumn);
      const xPosition = margin + columnIndex * columnWidth;

      // Draw the ID and description
      page.drawText(String(id), {
        x: xPosition,
        y: columnYPosition,
        size: fontSize,
        font: timesRomanFont,
      });
      page.drawText(String(description), {
        x: xPosition + 30,
        y: columnYPosition,
        size: fontSize,
        font: timesRomanFont,
      });

      // Draw checkbox and fill if checked
      const checkboxXPosition = xPosition + 180; // Adjusted xPosition for checkbox alignment

      page.drawRectangle({
        x: checkboxXPosition,
        y: columnYPosition - fontSize / 2 + 5, // Adjusted to align vertically with text
        width: checkboxSize,
        height: checkboxSize,
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
      });

      if (checked) {
        page.drawText("X", {
          x: checkboxXPosition + 2,
          y: columnYPosition - fontSize / 2 + 7,
          size: fontSize,
          color: rgb(0, 0, 0),
        });
      }

      // Adjust yPosition for the next row
      if (index % itemsPerColumn === itemsPerColumn - 1) {
        // Reset columnYPosition for the new column
        columnYPosition = yPosition;
      } else {
        columnYPosition -= lineHeight;
      }
    });

    yPosition = columnYPosition - lineHeight ;

    // Ensure some space between sections
    yPosition -=  lineHeight * (payload.drinking_or_wastewater === "Drinking Water" ? 11 : 1);

    // Sustainability Commitment Section
    // page.drawText("Sustainability Commitment", {
    //   x: margin,
    //   y: yPosition,
    //   size: headerFontSize,
    //   font: timesRomanBoldFont,
    // });

    // yPosition -= lineHeight;

    // const sustainabilityCommitment = [
    //   ["4.1", "Are you working on or have completed an LRSP plan?", payload.lrsp_plan],
    //   ["4.2", "If not, would you like more information?", payload.more_info_lrsp],
    // ];

    // sustainabilityCommitment.forEach(([id, question, answer]) => {
    //   page.drawText(String(id), {
    //     x: margin,
    //     y: yPosition,
    //     size: fontSize,
    //     font: timesRomanFont,
    //   });
    //   page.drawText(String(question), {
    //     x: margin + 40,
    //     y: yPosition,
    //     size: fontSize,
    //     font: timesRomanFont,
    //   });

    //   // Draw checkbox and fill if checked
    //   const checkboxXPosition = margin + 310; // Adjusted xPosition for checkbox alignment

    //   page.drawRectangle({
    //     x: checkboxXPosition,
    //     y: yPosition - fontSize / 2 + 6, // Adjusted to align vertically with text
    //     width: checkboxSize,
    //     height: checkboxSize,
    //     borderColor: rgb(0, 0, 0),
    //     borderWidth: 1,
    //   });

    //   if (answer) {
    //     page.drawText("X", {
    //       x: checkboxXPosition + 2,
    //       y: yPosition - fontSize / 2 + 8,
    //       size: fontSize,
    //       color: rgb(0, 0, 0),
    //     });
    //   }

    //   yPosition -= lineHeight;
    // });

    // Project Status and Impact Section
    page.drawText("Project Status and Impact", {
      x: margin,
      y: yPosition,
      size: headerFontSize,
      font: timesRomanBoldFont,
    });
    yPosition -= lineHeight;

    const projectStatus = [
      [
        "3.1",
        "Has an engineering report been prepared?",
        payload.engineering_report === 'Yes',
      ],
      [
        "3.2",
        "If yes, has report been approved by DEQ?",
        payload.report_approved_by_deq === "Yes",
      ],
      [
        "3.3",
        "Will this project resolve a potential/current violation?",
        payload.resolves_violation === "Yes - a current violation",
      ],
      [
        "3.4",
        "Will project satisfy a task on a DEQ issued order?",
        payload.satisfy_deq_issued_order,
      ],
      [
        "3.5",
        "Is other money/funding set aside for this project?",
        payload.money_set_aside,
      ],
      [
        "3.6",
        "Have you applied for other loans/grants for this?",
        payload.applied_to_other_loans,
      ],
    ];

    const projectItemsPerColumn = Math.ceil(projectStatus.length / 2);
    const projectColumnWidth = (width - 2 * margin) / 2;
    let projectColumnYPosition = yPosition;
    let lastProjectYPosition = yPosition; // Track the last yPosition used in the Project Status section

    projectStatus.forEach(([id, question, answer], index) => {
      // Determine the xPosition based on the column (left or right)
      const projectColumnIndex = Math.floor(index / projectItemsPerColumn);
      const xPosition = margin + projectColumnIndex * projectColumnWidth;

      if (projectColumnIndex === 0) {
        // Left column with line wrapping
        const maxWidth = projectColumnWidth - 50; // Adjust the width to prevent overlap
        const words = typeof question === "string" ? question.split(" ") : [];
        let line = "";
        let y = projectColumnYPosition;

        words.forEach((word, i) => {
          const testLine = line + word + " ";
          const testWidth = timesRomanFont.widthOfTextAtSize(
            testLine,
            fontSize
          );
          if (testWidth > maxWidth && i > 0) {
            // Draw the line
            page.drawText(line, {
              x: xPosition + 20,
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
          x: xPosition + 20,
          y: y,
          size: fontSize,
          font: timesRomanFont,
        });

        // Draw the ID and checkbox
        page.drawText(String(id), {
          x: xPosition,
          y: projectColumnYPosition,
          size: fontSize,
          font: timesRomanFont,
        });

        const checkboxXPosition = xPosition + 220; // Adjust the checkbox position for the left column

        page.drawRectangle({
          x: checkboxXPosition,
          y: projectColumnYPosition - fontSize / 2 + 6,
          width: checkboxSize,
          height: checkboxSize,
          borderColor: rgb(0, 0, 0),
          borderWidth: 1,
        });

        if (answer) {
          page.drawText("X", {
            x: checkboxXPosition + 2,
            y: projectColumnYPosition - fontSize / 2 + 8,
            size: fontSize,
            color: rgb(0, 0, 0),
          });
        }

        // Update lastProjectYPosition to the lowest point reached by the text
        lastProjectYPosition = Math.min(y, projectColumnYPosition);
      } else {
        // Right column without line wrapping
        page.drawText(String(id), {
          x: xPosition,
          y: projectColumnYPosition,
          size: fontSize,
          font: timesRomanFont,
        });

        page.drawText(question as string, {
          x: xPosition + 20,
          y: projectColumnYPosition,
          size: fontSize,
          font: timesRomanFont,
        });

        const checkboxXPosition = xPosition + 250; // Adjust the checkbox position for the right column

        page.drawRectangle({
          x: checkboxXPosition,
          y: projectColumnYPosition - fontSize / 2 + 6,
          width: checkboxSize,
          height: checkboxSize,
          borderColor: rgb(0, 0, 0),
          borderWidth: 1,
        });

        if (answer) {
          page.drawText("X", {
            x: checkboxXPosition + 2,
            y: projectColumnYPosition - fontSize / 2 + 8,
            size: fontSize,
            color: rgb(0, 0, 0),
          });
        }

        lastProjectYPosition = projectColumnYPosition;
      }

      // Adjust yPosition for the next row
      if (index % projectItemsPerColumn === projectItemsPerColumn - 1) {
        // For the new column, reset the yPosition
        projectColumnYPosition = yPosition;
      } else {
        projectColumnYPosition = lastProjectYPosition - lineHeight;
      }
    });

    yPosition = lastProjectYPosition - lineHeight; // Update yPosition for the next section

    yPosition -= lineHeight * 1.5;

    // Make bold the estimated cost
    page.drawText(`Estimated Cost: ${formattedCost.replace(/\.00$/, "")}`, {
      x: margin,
      y: yPosition,
      size: fontSize,
      font: timesRomanBoldFont,
    });

    yPosition -= lineHeight * 1.5;

    // Project Cost Section
    page.drawText("Project Cost/Description:", {
      x: margin,
      y: yPosition,
      size: headerFontSize,
      font: timesRomanBoldFont,
    });

    const description = payload.description_justification_estimated_cost;

    // Split the description by newline characters
    const lines = description.split("\n");

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

    checkPageOverflow();

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

    checkPageOverflow();


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
