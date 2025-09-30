import { uploadFile } from '../data/API';

export const uploadNominationPdf = async (pdfBlob: Blob, nomineeName: string) => {
  // Create a File object from the Blob
  const fileName = `${nomineeName.replace(/\s+/g, '_')}_award_nomination_${Date.now()}.pdf`;
  const file = new File([pdfBlob], fileName, { type: 'application/pdf' });
  
  try {
    // Upload the file
    const response = await uploadFile(file);
    
    // Return the file ID or URL based on Strapi response
    if (response && response[0]) {
      return response[0].id || response[0].documentId || response[0];
    }
    
    throw new Error('Failed to upload nomination PDF');
  } catch (error) {
    console.error('Error uploading nomination PDF:', error);
    throw error;
  }
};
