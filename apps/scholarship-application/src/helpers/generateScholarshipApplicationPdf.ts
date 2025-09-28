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
    const timesRomanBoldFont = await pdfDoc.embedFont(
      StandardFonts.TimesRomanBold
    );
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    let page = pdfDoc.addPage();
    const { width, height } = page.getSize();

    const fontSize = 10;
    const headerFontSize = 12;
    const titleFontSize = 16;
    const lineHeight = fontSize * 1.4;
    const margin = 50;
    let yPosition = height - margin;

    const checkPageOverflow = () => {
      if (yPosition < margin + 100) {
        page = pdfDoc.addPage();
        yPosition = height - margin;
      }
    };

    const drawSectionHeader = (title: string) => {
      checkPageOverflow();
      page.drawRectangle({
        x: margin,
        y: yPosition - 25,
        width: width - 2 * margin,
        height: 25,
        color: rgb(0.9, 0.9, 0.9),
        borderColor: rgb(0.8, 0.8, 0.8),
        borderWidth: 1,
      });
      page.drawText(title, {
        x: margin + 10,
        y: yPosition - 20,
        size: headerFontSize,
        font: helveticaBoldFont,
        color: rgb(0, 0, 0),
      });
      yPosition -= 40;
    };

    const drawField = (label: string, value: string, isBold = false) => {
      checkPageOverflow();
      // Label
      page.drawRectangle({
        x: margin,
        y: yPosition - 20,
        width: width - 2 * margin,
        height: 20,
        color: rgb(0.9, 0.95, 0.98),
        borderColor: rgb(0.8, 0.8, 0.8),
        borderWidth: 1,
      });
      page.drawText(label, {
        x: margin + 10,
        y: yPosition - 15,
        size: fontSize,
        font: helveticaBoldFont,
        color: rgb(0, 0, 0),
      });
      yPosition -= 25;
      
      // Value
      page.drawRectangle({
        x: margin,
        y: yPosition - 20,
        width: width - 2 * margin,
        height: 20,
        color: rgb(1, 1, 1),
        borderColor: rgb(0.8, 0.8, 0.8),
        borderWidth: 1,
      });
      page.drawText(value, {
        x: margin + 20,
        y: yPosition - 15,
        size: fontSize,
        font: isBold ? helveticaBoldFont : helveticaFont,
        color: rgb(0, 0, 0),
      });
      yPosition -= 30;
    };

    // Header Section
    page.drawRectangle({
      x: margin,
      y: yPosition - 60,
      width: width - 2 * margin,
      height: 60,
      color: rgb(0.06, 0.06, 0.48), // Dark blue background
    });
    
    page.drawText("ORWEF Scholarship Application", {
      x: margin + 20,
      y: yPosition - 30,
      size: titleFontSize,
      font: helveticaBoldFont,
      color: rgb(1, 1, 1),
    });
    
    page.drawText("2025-2026", {
      x: margin + 20,
      y: yPosition - 50,
      size: fontSize,
      font: helveticaFont,
      color: rgb(1, 1, 1),
    });
    
    page.drawText("Oklahoma Rural Water Enrichment Foundation", {
      x: margin + 20,
      y: yPosition - 80,
      size: fontSize,
      font: helveticaBoldFont,
      color: rgb(0.06, 0.06, 0.48),
    });
    
    page.drawText("1410 S.E. 15th Street, Oklahoma City, OK 73129", {
      x: margin + 20,
      y: yPosition - 100,
      size: fontSize,
      font: helveticaFont,
      color: rgb(0.06, 0.06, 0.48),
    });
    
    page.drawText("(405) 672-8925", {
      x: margin + 20,
      y: yPosition - 120,
      size: fontSize,
      font: helveticaFont,
      color: rgb(0.06, 0.06, 0.48),
    });
    
    yPosition -= 150;

    // Personal Data Section
    drawSectionHeader("Personal Data (The individual applying for Scholarship)");
    
    drawField("Applicant Name: (Individual applying for Scholarship)", 
      `${payload.applicant_first_name} ${payload.applicant_middle_name ? payload.applicant_middle_name + ' ' : ''}${payload.applicant_last_name}`);
    
    drawField("Applicant Phone", payload.applicant_phone || '');
    drawField("Applicant Email", payload.applicant_email || '');
    drawField("Applicant Address: (Individual applying for Scholarship)", 
      `${payload.applicant_street}, ${payload.applicant_city}, ${payload.applicant_state} ${payload.applicant_zip}`);

    // Eligibility Criteria Section
    drawSectionHeader("Eligibility Criteria (refer to official rules)");
    
    const watersystemInfo = `Id: ${payload.watersystem || 'N/A'}`;
    
    drawField("System Name", watersystemInfo);
    drawField("Eligible Participant's Relationship to Applicant:", payload.relationship || '');
    drawField("Eligible Participant Name: (member system director or employee)", 
      payload.eligible_participant_name ? `${payload.eligible_participant_name.first} ${payload.eligible_participant_name.last}` : '');
    drawField("Eligible Participant Title: (member system director or employee)", payload.eligible_participant_title || '');
    drawField("Eligible Participant Address: (member system director or employee)", 
      payload.eligible_participant_address ? `${payload.eligible_participant_address.street}, ${payload.eligible_participant_address.city}, ${payload.eligible_participant_address.state} ${payload.eligible_participant_address.zip}` : '');
    drawField("Eligible Participant Phone Number:", payload.eligible_participant_phone || '');
    drawField("Eligible Participant Email:", payload.eligible_participant_email || '');

    // High School Data Section
    drawSectionHeader("High School Data");
    
    drawField("School Name:", payload.school_name || '');
    drawField("Graduation Date:", payload.graduation_date || '');
    drawField("School Address:", 
      payload.school_address ? `${payload.school_address.street}, ${payload.school_address.city}, ${payload.school_address.state} ${payload.school_address.zip}` : '');
    drawField("Grade Point Average:", payload.high_school_gpa?.toString() || '');
    drawField("SAT Test Score:", payload.sat_score?.toString() || 'n/a');
    drawField("ACT Test Score:", payload.act_score?.toString() || 'n/a');
    drawField("Please Upload Your Highschool Transcript.", "See attached files");
    drawField("Please Upload Your ACT/SAT Scores.", "See attached files");

    // College/University Data Section
    drawSectionHeader("College/University Data");
    
    drawField("Is this your first year of high education?", payload.first_year || '');
    drawField("Number of credit hours required to graduate:", payload.credits_required?.toString() || '');
    drawField("Grade Point Average:", payload.college_gpa?.toString() || '');
    drawField("Please indicate your education:", payload.education_type || '');
    drawField("Major Course of Study:", payload.major || '');

    // Letter of Recommendations Section
    drawSectionHeader("Letter of Recommendations");
    
    drawField("First Recommenders Name:", 
      payload.recommender1_name ? `${payload.recommender1_name.first} ${payload.recommender1_name.last}` : '');
    drawField("Email:", payload.recommender1_email || '');
    drawField("Phone Number:", payload.recommender1_phone || '');
    drawField("Please Submit Your First Letter of Recommendation.", "See attached files");
    
    drawField("Second Recommenders Name:", 
      payload.recommender2_name ? `${payload.recommender2_name.first} ${payload.recommender2_name.last}` : '');
    drawField("Email:", payload.recommender2_email || '');
    drawField("Phone Number:", payload.recommender2_phone || '');
    drawField("Please Submit Your Second Letter of Recommendation.", "See attached files");

    // Financial Data Section
    drawSectionHeader("Financial Data");
    
    drawField("Institution:", payload.financial1_institution || '');
    drawField("Amount:", payload.financial1_amount?.toString() || '');
    
    if (payload.financial2_institution) {
      drawField("Institution:", payload.financial2_institution);
      drawField("Amount:", payload.financial2_amount?.toString() || '');
    }

    // Essay Section
    drawSectionHeader("Essay");
    drawField("Please Upload Your Essay.", "See attached files");

    // Biography Section
    drawSectionHeader("Biography");
    drawField("Please Upload Your Biography.", "See attached files");

    // High Quality Photograph Section
    drawSectionHeader("High Quality Photograph");
    drawField("Please Upload Your High Quality Photograph.", "See attached files");

    // Scholarship Application Certification Section
    drawSectionHeader("Scholarship Application Certification");
    
    drawField("Please indicate the following:", payload.age_confirm || '');
    drawField("Scholarship Applicant Certification", payload.applicant_certification ? "I agree" : "I do not agree");
    drawField("Date", payload.applicant_certification_date || new Date().toLocaleDateString());
    
    if (payload.guardian_name) {
      drawField("Name of Guardian", `${payload.guardian_name.first} ${payload.guardian_name.last}`);
      drawField("Applicant's Guardian Certification (If applicant is under 18)", 
        payload.guardian_certification ? "I/We Certify" : "I/We do not certify");
      drawField("Date", payload.guardian_certification_date || '');
    }

    // Save the PDF
    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
}
