import { getFullUrl } from './imageUtils';

/**
 * Interface for TinyMCE's BlobInfo object
 */
export interface BlobInfo {
  id: () => string;
  name: () => string;
  filename: () => string;
  blob: () => Blob;
  base64: () => string;
  blobUri: () => string;
  uri: () => string | undefined;
}

/**
 * Uploads an image to the server and returns the URL
 * 
 * @param blobInfo The TinyMCE BlobInfo object containing the image data
 * @param progress A callback function to report upload progress
 * @returns A promise that resolves with the URL of the uploaded image
 */
export const uploadImage = async (
  blobInfo: BlobInfo, 
  progress: (percent: number) => void
): Promise<string> => {
  try {
    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append('files', blobInfo.blob(), blobInfo.filename());

    // Report initial progress
    progress(0);

    // Send the file to the server
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/upload`, {
      method: 'POST',
      headers: {
        // No Content-Type header as it's automatically set with FormData
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
    });

    // Report completion
    progress(100);

    if (!response.ok) {
      throw new Error(`Upload failed with status: ${response.status}`);
    }

    // Parse the response to get the file URL
    const data = await response.json();
    
    // The response should contain an array of uploaded files
    if (Array.isArray(data) && data.length > 0) {
      // Return the full URL of the first uploaded file
      return getFullUrl(data[0].url);
    } else {
      throw new Error('Invalid response format from server');
    }
  } catch (error) {
    console.error('Image upload failed:', error);
    throw error;
  }
};

/**
 * Fallback function to handle image uploads when the server is not available
 * This converts the image to a base64 data URL
 * 
 * @param blobInfo The TinyMCE BlobInfo object containing the image data
 * @param progress A callback function to report upload progress
 * @returns A promise that resolves with the base64 data URL of the image
 */
export const uploadImageAsBase64 = (
  blobInfo: BlobInfo, 
  progress: (percent: number) => void
): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      // Report start
      progress(0);
      
      const reader = new FileReader();
      
      reader.onload = () => {
        // Report completion
        progress(100);
        
        if (reader.result && typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert image to base64'));
        }
      };
      
      reader.onerror = () => {
        reject(reader.error || new Error('Failed to read file'));
      };
      
      // Read the file as a data URL (base64)
      reader.readAsDataURL(blobInfo.blob());
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Creates a TinyMCE image upload handler that attempts to upload to the server
 * and falls back to base64 encoding if that fails
 * 
 * @returns A function that handles image uploads for TinyMCE
 */
export const createImageUploadHandler = () => {
  return async (blobInfo: BlobInfo, progress: (percent: number) => void): Promise<string> => {
    try {
      // First try to upload to the server
      return await uploadImage(blobInfo, progress);
    } catch (error) {
      console.warn('Server upload failed, falling back to base64:', error);
      // Fall back to base64 if server upload fails
      return await uploadImageAsBase64(blobInfo, progress);
    }
  };
}; 