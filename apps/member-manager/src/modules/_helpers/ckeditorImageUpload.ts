import { getFullUrl } from './imageUtils';

/**
 * Uploads an image to the server for CKEditor
 * 
 * @param file The file to upload
 * @returns A promise that resolves with the URL of the uploaded image
 */
export const uploadImage = async (file: File): Promise<string> => {
  try {
    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append('files', file);

    // Send the file to the server
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/upload`, {
      method: 'POST',
      headers: {
        // No Content-Type header as it's automatically set with FormData
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
    });

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
 * @param file The file to convert to base64
 * @returns A promise that resolves with the base64 data URL of the image
 */
export const imageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      
      reader.onload = () => {
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
      reader.readAsDataURL(file);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Creates a CKEditor image upload adapter
 * This is used by CKEditor to handle image uploads
 */
export class UploadAdapter {
  private loader: any;
  
  constructor(loader: any) {
    this.loader = loader;
  }

  // Starts the upload process
  upload(): Promise<{ default: string }> {
    return new Promise((resolve, reject) => {
      this.loader.file
        .then(async (file: File) => {
          try {
            // First try to upload to the server
            const url = await uploadImage(file);
            resolve({ default: url });
          } catch (error) {
            console.warn('Server upload failed, falling back to base64:', error);
            // Fall back to base64 if server upload fails
            try {
              const base64 = await imageToBase64(file);
              resolve({ default: base64 });
            } catch (base64Error) {
              reject(base64Error);
            }
          }
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }

  // Aborts the upload process
  abort(): void {
    // This method is required but we don't need to implement it
    console.log('Upload aborted');
  }
}

/**
 * Creates a function that initializes the CKEditor image upload adapter
 * This function is used in the CKEditor configuration
 */
export function createUploadAdapterPlugin(editor: any) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
    return new UploadAdapter(loader);
  };
} 