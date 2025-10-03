// import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
// import { IAwardNominationPayload } from '../types/types';

// export const generateAwardNominationPdf = async (data: IAwardNominationPayload): Promise<Blob> => {
//   const pdfDoc = await PDFDocument.create();
//   const page = pdfDoc.addPage([612, 792]); // Letter size
//   const { width, height } = page.getSize();
  
//   const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
//   const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  
//   let yPosition = height - 50;
//   const leftMargin = 50;
//   const lineHeight = 20;
//   const sectionSpacing = 30;
  
//   // Helper function to add text
//   const addText = (text: string, x: number, y: number, font = helvetica, size = 12, color = rgb(0, 0, 0)) => {
//     page.drawText(text, {
//       x,
//       y,
//       size,
//       font,
//       color,
//     });
//   };
  
//   // Helper function to add a section
//   const addSection = (title: string, content: Array<{ label: string; value: any }>) => {
//     // Section title
//     addText(title, leftMargin, yPosition, helveticaBold, 14, rgb(0, 0.4, 0.8));
//     yPosition -= lineHeight + 5;
    
//     // Section content
//     content.forEach(item => {
//       if (item.value && item.value !== '' && item.value !== 0) {
//         const text = `${item.label}: ${item.value}`;
//         // Handle long text by wrapping
//         const maxWidth = width - leftMargin * 2;
//         const words = text.split(' ');
//         let line = '';
        
//         words.forEach((word, index) => {
//           const testLine = line + word + ' ';
//           const textWidth = helvetica.widthOfTextAtSize(testLine, 11);
          
//           if (textWidth > maxWidth && line !== '') {
//             addText(line.trim(), leftMargin + 20, yPosition, helvetica, 11);
//             yPosition -= lineHeight;
//             line = word + ' ';
//           } else {
//             line = testLine;
//           }
          
//           if (index === words.length - 1) {
//             addText(line.trim(), leftMargin + 20, yPosition, helvetica, 11);
//             yPosition -= lineHeight;
//           }
//         });
//       }
//     });
    
//     yPosition -= sectionSpacing;
    
//     // Check if we need a new page
//     if (yPosition < 100) {
//       const newPage = pdfDoc.addPage([612, 792]);
//       yPosition = height - 50;
//       return newPage;
//     }
//     return page;
//   };
  
//   // Title
//   addText('ORWA AWARD NOMINATION', width / 2 - 120, yPosition, helveticaBold, 18, rgb(0, 0.4, 0.8));
//   yPosition -= lineHeight * 2;
  
//   // Award Type
//   addText(data.award_type || 'Award Nomination', width / 2 - 100, yPosition, helveticaBold, 16);
//   yPosition -= lineHeight * 2;
  
//   // Submission Date
//   const submissionDate = new Date().toLocaleDateString();
//   addText(`Submission Date: ${submissionDate}`, leftMargin, yPosition, helvetica, 10);
//   yPosition -= sectionSpacing;
  
//   // Nominee Information
//   addSection('NOMINEE INFORMATION', [
//     { label: 'Name', value: data.nominee_name },
//     { label: 'Email', value: data.email },
//     { label: 'Phone', value: data.daytime_phone },
//     { label: 'Address', value: `${data.address}, ${data.city}, ${data.state} ${data.zip}` },
//     { label: 'County', value: data.county },
//     { label: 'Award Year', value: data.award_year },
//   ]);
  
//   // System Information
//   addSection('SYSTEM INFORMATION', [
//     { label: 'System Name', value: data.system_name },
//     { label: 'Water System ID', value: data.watersystem },
//     { label: 'Operation Start Date', value: data.operation_start_date },
//     { label: 'Employment Date', value: data.employment_date },
//     { label: 'Current Members', value: data.current_members },
//     { label: 'Beginning Members', value: data.beginning_members },
//   ]);
  
//   // Employee Counts
//   addSection('EMPLOYEE COUNTS', [
//     { label: 'Clerical Employees', value: data.clerical_employees },
//     { label: 'Operation & Maintenance', value: data.operation_maintenance_employees },
//     { label: 'Management Employees', value: data.management_employees },
//     { 
//       label: 'Total Employees', 
//       value: (data.clerical_employees || 0) + 
//              (data.operation_maintenance_employees || 0) + 
//              (data.management_employees || 0) 
//     },
//   ]);
  
//   // Nomination Description (may need multiple pages)
//   if (data.nomination_description) {
//     addText('NOMINATION DESCRIPTION', leftMargin, yPosition, helveticaBold, 14, rgb(0, 0.4, 0.8));
//     yPosition -= lineHeight + 5;
    
//     // Split description into lines
//     const descriptionLines = data.nomination_description.split('\n');
//     const maxWidth = width - leftMargin * 2;
    
//     descriptionLines.forEach(paragraph => {
//       if (paragraph.trim()) {
//         const words = paragraph.split(' ');
//         let line = '';
        
//         words.forEach((word, index) => {
//           const testLine = line + word + ' ';
//           const textWidth = helvetica.widthOfTextAtSize(testLine, 11);
          
//           if (textWidth > maxWidth && line !== '') {
//             addText(line.trim(), leftMargin + 20, yPosition, helvetica, 11);
//             yPosition -= lineHeight;
            
//             // Check for new page
//             if (yPosition < 50) {
//               pdfDoc.addPage([612, 792]);
//               yPosition = height - 50;
//             }
            
//             line = word + ' ';
//           } else {
//             line = testLine;
//           }
          
//           if (index === words.length - 1 && line.trim()) {
//             addText(line.trim(), leftMargin + 20, yPosition, helvetica, 11);
//             yPosition -= lineHeight;
//           }
//         });
        
//         yPosition -= 10; // Extra space between paragraphs
//       }
//     });
//   }
  
//   // Supporting Documents
//   if (data.supporting_documents && data.supporting_documents.length > 0) {
//     yPosition -= sectionSpacing;
    
//     // Check for new page
//     if (yPosition < 150) {
//       pdfDoc.addPage([612, 792]);
//       yPosition = height - 50;
//     }
    
//     addText('SUPPORTING DOCUMENTS', leftMargin, yPosition, helveticaBold, 14, rgb(0, 0.4, 0.8));
//     yPosition -= lineHeight + 5;
    
//     data.supporting_documents.forEach(doc => {
//       addText(`• ${doc.title}`, leftMargin + 20, yPosition, helvetica, 11);
//       yPosition -= lineHeight;
//     });
//   }
  
//   // Footer on last page
//   const pages = pdfDoc.getPages();
//   const lastPage = pages[pages.length - 1];
//   lastPage.drawText('Generated by ORWA Award Nomination System', {
//     x: leftMargin,
//     y: 30,
//     size: 8,
//     font: helvetica,
//     color: rgb(0.5, 0.5, 0.5),
//   });
  
//   // Serialize the PDFDocument to bytes
//   const pdfBytes = await pdfDoc.save();
  
//   // Convert to Blob
//   return new Blob([pdfBytes], { type: 'application/pdf' });
// };
