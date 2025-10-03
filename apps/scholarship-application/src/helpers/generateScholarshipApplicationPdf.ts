import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { IScholarshipApplicationPayload } from "../types/types";

interface ScholarshipApplicationWithId extends IScholarshipApplicationPayload {
  id: string;
}

export async function generateScholarshipApplicationPDF(
  payload: ScholarshipApplicationWithId
) {
  try {
    const pdfDoc = await PDFDocument.create();
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const timesRomanBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
    
    let page = pdfDoc.addPage();
    const { width, height } = page.getSize();

    const fontSize = 11;
    const headerFontSize = 14;
    const titleFontSize = 18;
    const lineHeight = fontSize * 1.4;
    const margin = 50;
    const photoSize = 100;
    let yPosition = height - margin;

    // Helper function to check page overflow and create new page if needed
    const checkPageOverflow = () => {
      if (yPosition < margin + 50) {
        page = pdfDoc.addPage();
        yPosition = height - margin;
      }
    };

    // Helper function to draw wrapped text with proper line breaks
    const drawWrappedText = (text: string, x: number, y: number, maxWidth: number, font = timesRomanFont, size = fontSize) => {
      const words = text.split(' ');
      let line = '';
      let currentY = y;
      
      words.forEach((word, i) => {
        const testLine = line + word + ' ';
        const testWidth = font.widthOfTextAtSize(testLine, size);
        
        if (testWidth > maxWidth && i > 0) {
          // Draw the current line
          page.drawText(line.trim(), {
            x,
            y: currentY,
            size,
            font,
            color: rgb(0, 0, 0),
          });
          line = word + ' ';
          currentY -= lineHeight;
          
          // Check for page overflow but don't reset position for columns
          if (currentY < margin + 50) {
            page = pdfDoc.addPage();
            currentY = height - margin;
          }
        } else {
          line = testLine;
        }
      });
      
      // Draw the last line
      if (line.trim()) {
        page.drawText(line.trim(), {
          x,
          y: currentY,
          size,
          font,
        color: rgb(0, 0, 0),
      });
        currentY -= lineHeight;
      }
      
      return currentY;
    };

    // Helper function to draw a field with label and value
    const drawField = (label: string, value: string, x: number, y: number, maxWidth: number) => {
      // Draw label
      page.drawText(`${label}: ${value}`, {
        x,
        y,
        size: fontSize,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      });
      
      // Draw underline
      const textWidth = timesRomanFont.widthOfTextAtSize(`${label}: ${value}`, fontSize);
      const underlineWidth = Math.min(textWidth, maxWidth);
      
      page.drawLine({
        start: { x, y: y - 3 },
        end: { x: x + underlineWidth, y: y - 3 },
        thickness: 0.5,
        color: rgb(0, 0, 0),
      });
    };

    // Helper function to draw a section header
    const drawSectionHeader = (title: string) => {
      checkPageOverflow();
      yPosition -= lineHeight;
      
      page.drawText(title, {
        x: margin,
        y: yPosition,
        size: headerFontSize,
        font: timesRomanBoldFont,
        color: rgb(0, 0, 0),
      });
      
      yPosition -= lineHeight;
    };

    // Helper function to embed photograph if available
    const embedPhotograph = async () => {
      if (payload.photograph) {
        try {
          let imageBytes;
          
          // Handle different file types - simplified approach
          if (payload.photograph.rawFile) {
            try {
              // Convert the image file to bytes
              const file = payload.photograph.rawFile;
              console.log("Found photograph.rawFile:", file);
              
              // Use fetch to get the image data from the file or URL
              const response = await fetch('/orwa.webp');
              imageBytes = await response.arrayBuffer();
              console.log("Successfully loaded image data from fetch");
            } catch (fetchError) {
              console.warn("Error fetching image:", fetchError);
              return null;
            }
          } else {
            console.warn("Photograph format not supported:", payload.photograph);
            return null;
          }
          
          // Try to embed as PNG first, then JPEG
          try {
            const image = await pdfDoc.embedPng(imageBytes);
            console.log("Successfully embedded photograph as PNG");
            return image;
          } catch (pngError) {
            try {
              const image = await pdfDoc.embedJpg(imageBytes);
              console.log("Successfully embedded photograph as JPEG");
              return image;
            } catch (jpgError) {
              console.warn("Could not embed photograph as PNG or JPEG:", pngError, jpgError);
              return null;
            }
          }
        } catch (error) {
          console.warn("Could not embed photograph:", error);
          return null;
        }
      }
      console.log("No photograph provided in payload");
      return null;
    };


    // Embed photograph
    const photograph = await embedPhotograph();

    // Header Section
    const dateReceived = new Date().toLocaleDateString("en-US", {
      day: "numeric", 
      month: "long",
      year: "numeric",
    });

    // Add ORWA logo to top left - aligned with date received
    try {
      const logoResponse = await fetch('/orwa-black.png');
      if (logoResponse.ok) {
        const logoBytes = await logoResponse.arrayBuffer();
        const logoImage = await pdfDoc.embedPng(logoBytes);
        
        // Scale logo to appropriate size (max 50px height)
        const logoHeight = 50;
        const logoWidth = (logoImage.width / logoImage.height) * logoHeight;
        
        page.drawImage(logoImage, {
          x: margin - 20, // Move further left
          y: yPosition - 20, // Align with date received text
          width: logoWidth,
          height: logoHeight,
        });
      }
    } catch (logoError) {
      console.warn('Could not load ORWA logo:', logoError);
    }
        
    page.drawText(`Date Received: ${dateReceived}`, {
      x: width - margin - 150,
      y: yPosition,
      size: fontSize,
      font: timesRomanFont,
    });
    
    yPosition -= lineHeight * 2;
    
    // Title Section
    const titleText = "ORWEF Scholarship Application Form";
    const titleTextWidth = timesRomanBoldFont.widthOfTextAtSize(titleText, titleFontSize);
    page.drawText(titleText, {
      x: (width - titleTextWidth) / 2,
      y: yPosition,
      size: titleFontSize,
      font: timesRomanBoldFont,
    });
    
    yPosition -= lineHeight;
    
    // Organization info centered
    const orgText = "Oklahoma Rural Water Enrichment Foundation";
    const orgTextWidth = timesRomanBoldFont.widthOfTextAtSize(orgText, headerFontSize);
    page.drawText(orgText, {
      x: (width - orgTextWidth) / 2,
      y: yPosition,
      size: headerFontSize,
      font: timesRomanBoldFont,
    });
    
    yPosition -= lineHeight;
    
    const addressText = "1410 S.E. 15th Street, Oklahoma City, OK 73129 (405) 672-8925"
    const addressTextWidth = timesRomanFont.widthOfTextAtSize(addressText, fontSize);
    page.drawText(addressText, {
      x: (width - addressTextWidth) / 2,
      y: yPosition,
      size: fontSize,
      font: timesRomanFont,
    });
    
    // Add photograph if available
    if (photograph) {
      page.drawImage(photograph, {
        x: width - margin - photoSize,
        y: yPosition + 20,
        width: photoSize,
        height: photoSize,
      });
    }
    
    yPosition -= lineHeight ;

    // Contact Information Section
    drawSectionHeader("Contact Information");
    
    const fullName = `${payload.applicant_first_name} ${payload.applicant_middle_name ? payload.applicant_middle_name + ' ' : ''}${payload.applicant_last_name}`;
    const contactInfo = [
      `Applicant Name: ${fullName}`,
      `Phone #: ${payload.applicant_phone || ''}`,
      `Email Address: ${payload.applicant_email || ''}`,
      `Street Address: ${payload.applicant_street || ''}, ${payload.applicant_city || ''}, ${payload.applicant_state || ''} ${payload.applicant_zip || ''}`,
    ];

    const contactItemsPerColumn = Math.ceil(contactInfo.length / 2);
    const contactColumnWidth = (width - 2 * margin) / 2;
    let contactColumnYPosition = yPosition;
    let lastContactYPosition = yPosition;

    contactInfo.forEach((text, index) => {
      const contactColumnIndex = Math.floor(index / contactItemsPerColumn);
      const xPosition = margin + contactColumnIndex * contactColumnWidth;
      const maxWidth = contactColumnWidth - 20;

      const words = text.split(" ");
      let line = "";
      let y = contactColumnYPosition;

      words.forEach((word, i) => {
        const testLine = line + word + " ";
        const testWidth = timesRomanFont.widthOfTextAtSize(testLine, fontSize);
        if (testWidth > maxWidth && i > 0) {
          page.drawText(line, {
            x: xPosition,
            y: y,
      size: fontSize,
            font: timesRomanFont,
            });
            line = word + " ";
            y -= lineHeight;
            checkPageOverflow();
        } else {
          line = testLine;
        }
      });

      page.drawText(line, {
        x: xPosition,
        y: y,
      size: fontSize,
        font: timesRomanFont,
      });

      lastContactYPosition = Math.min(y, lastContactYPosition);

      if (index % contactItemsPerColumn === contactItemsPerColumn - 1) {
        contactColumnYPosition = yPosition;
      } else {
        contactColumnYPosition = lastContactYPosition - lineHeight * 0.7;
      }
    });

    yPosition = lastContactYPosition - lineHeight;

    // Two-column layout: Academic Information (left) and Eligibility Criteria (right)
    const columnWidth = (width - 2 * margin - 10) / 2; // 10px gap between columns
    const leftColumnX = margin;
    const rightColumnX = margin + columnWidth + 20;
    
    // Save starting Y position for both columns
    const startingY = yPosition - 10; // Move both columns down by 10px
    
    // Left Column - Academic Information
    let leftColumnY = startingY;
    page.drawText("Academic Information", {
      x: leftColumnX,
      y: leftColumnY,
      size: headerFontSize,
      font: timesRomanBoldFont,
    });
    leftColumnY -= lineHeight;
    
    const academicInfo = [
      `High School: ${payload.school_name || ''}`,
      `Graduation Date: ${payload.graduation_date || ''}`,
      `High School GPA: ${payload.high_school_gpa?.toString() || ''}`,
      `SAT Score: ${payload.sat_score?.toString() || 'N/A'}`,
      `ACT Score: ${payload.act_score?.toString() || 'N/A'}`,
      `College GPA: ${payload.college_gpa?.toString() || 'N/A'}`,
      `Education Type: ${payload.education_type || ''}`,
      `Major: ${payload.major || ''}`,
      `Credits Required: ${payload.credits_required?.toString() || ''}`,
    ];

    academicInfo.forEach((text) => {
      leftColumnY = drawWrappedText(text, leftColumnX, leftColumnY, columnWidth) - lineHeight * 0.2;
    });

    // Right Column - Eligibility Criteria
    let rightColumnY = startingY;
    page.drawText("Eligibility Criteria", {
      x: rightColumnX,
      y: rightColumnY,
      size: headerFontSize,
      font: timesRomanBoldFont,
    });
    rightColumnY -= lineHeight;
    
    const eligibleName = payload.eligible_participant_name ? 
      `${payload.eligible_participant_name.first} ${payload.eligible_participant_name.last}` : '';
    const eligibleAddress = payload.eligible_participant_address ? 
      `${payload.eligible_participant_address.street}, ${payload.eligible_participant_address.city}, ${payload.eligible_participant_address.state} ${payload.eligible_participant_address.zip}` : '';
    
    const eligibilityInfo = [
      `System Name: ID ${payload.watersystem || 'N/A'}`,
      `Relationship to Applicant: ${payload.relationship || ''}`,
      `Eligible Participant Name: ${eligibleName}`,
      `Eligible Participant Title: ${payload.eligible_participant_title || ''}`,
      `Eligible Participant Phone: ${payload.eligible_participant_phone || ''}`,
      `Eligible Participant Email: ${payload.eligible_participant_email || ''}`,
    ];

    eligibilityInfo.forEach((text) => {
      rightColumnY = drawWrappedText(text, rightColumnX, rightColumnY, columnWidth) - lineHeight * 0.2;
    });
    
    // Handle the long address separately with more careful wrapping
    if (eligibleAddress) {
      rightColumnY = drawWrappedText(`Eligible Participant Address: ${eligibleAddress}`, rightColumnX, rightColumnY, columnWidth) - lineHeight * 0.2;
    }

    // Set yPosition to the lower of the two columns
    yPosition = Math.min(leftColumnY, rightColumnY) - lineHeight * 0.3;

    // Awards & Achievements Section (with proper text wrapping)
    if (payload.awards) {
      drawSectionHeader("Awards & Achievements");
      yPosition = drawWrappedText(payload.awards, margin, yPosition, width - 2 * margin) - lineHeight * 0.5;
    }

    // Two-column layout: Letter of Recommendations (left) and Financial Data (right)
    const startingY2 = yPosition;
    
    // Left Column - Letter of Recommendations
    let leftColumnY2 = startingY2;
    page.drawText("Letter of Recommendations", {
      x: leftColumnX,
      y: leftColumnY2,
      size: headerFontSize,
      font: timesRomanBoldFont,
    });
    leftColumnY2 -= lineHeight;
    
    const recommender1Name = payload.recommender1_name ? 
      `${payload.recommender1_name.first} ${payload.recommender1_name.last}` : '';
    const recommender2Name = payload.recommender2_name ? 
      `${payload.recommender2_name.first} ${payload.recommender2_name.last}` : '';
    
    const recommendationInfo = [
      `First Recommender: ${recommender1Name}`,
      `Email: ${payload.recommender1_email || ''}`,
      `Phone: ${payload.recommender1_phone || ''}`,
      `Second Recommender: ${recommender2Name}`,
      `Email: ${payload.recommender2_email || ''}`,
      `Phone: ${payload.recommender2_phone || ''}`,
    ];

    recommendationInfo.forEach((text) => {
      leftColumnY2 = drawWrappedText(text, leftColumnX, leftColumnY2, columnWidth) - lineHeight * 0.2;
    });

    // Right Column - Financial Data
    let rightColumnY2 = startingY2;
    page.drawText("Financial Data", {
      x: rightColumnX,
      y: rightColumnY2,
      size: headerFontSize,
      font: timesRomanBoldFont,
    });
    rightColumnY2 -= lineHeight;
    
    const financialInfo = [
      `Institution 1: ${payload.financial1_institution || ''}`,
      `Amount 1: ${payload.financial1_amount?.toString() || ''}`,
    ];
    
    if (payload.financial2_institution) {
      financialInfo.push(
        `Institution 2: ${payload.financial2_institution}`,
        `Amount 2: ${payload.financial2_amount?.toString() || ''}`
      );
    }

    financialInfo.forEach((text) => {
      rightColumnY2 = drawWrappedText(text, rightColumnX, rightColumnY2, columnWidth) - lineHeight * 0.2;
    });

    // Set yPosition to the lower of the two columns
    yPosition = Math.min(leftColumnY2, rightColumnY2) - lineHeight * 0.3;

    // Certification Section
    drawSectionHeader("Certification");
    
    checkPageOverflow();
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
    
    page.drawText("of the Scholarship program.", {
      x: margin,
      y: yPosition,
      size: fontSize,
      font: timesRomanFont,
    });
    
    yPosition -= lineHeight;
    
    checkPageOverflow();
    
    // Left side - Printed Name and Date
    page.drawText("Printed Name:", {
      x: margin,
      y: yPosition,
      size: fontSize,
      font: timesRomanFont,
    });
    page.drawText(fullName, {
      x: margin + 100,
      y: yPosition,
      size: fontSize,
      font: timesRomanFont,
    });
    
    // Right side - Guardian info if applicable
    if (payload.guardian_name) {
      const guardianName = `${payload.guardian_name.first} ${payload.guardian_name.last}`;
      page.drawText("Guardian Name:", {
        x: rightColumnX,
        y: yPosition,
        size: fontSize,
        font: timesRomanFont,
      });
      page.drawText(guardianName, {
        x: rightColumnX + 100,
        y: yPosition,
        size: fontSize,
        font: timesRomanFont,
      });
    }
    
    yPosition -= lineHeight;
    
    // Left side - Date
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
    
    // Save the PDF
    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
}
