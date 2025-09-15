/**
 * Helper functions for working with images
 */

/**
 * Get the full URL for an image
 * @param url The relative URL of the image
 * @returns The full URL of the image
 */
export const getFullUrl = (url: string): string => {
  // If the URL already includes http:// or https://, return it as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // Get the base API URL from environment variables or use a default
  const apiUrl = import.meta.env.VITE_API_URL || '';
  
  // If the URL starts with a slash, append it to the API URL
  // Otherwise, add a slash between API URL and the provided URL
  return url.startsWith('/') 
    ? `${apiUrl}${url}` 
    : `${apiUrl}/${url}`;
};

/**
 * Get the file extension from a file name
 * @param fileName The file name
 * @returns The file extension (without the dot)
 */
export const getFileExtension = (fileName: string): string => {
  const parts = fileName.split('.');
  return parts.length > 1 ? parts.pop()?.toLowerCase() || '' : '';
};

/**
 * Check if a file is an image based on its MIME type or extension
 * @param file The file to check
 * @returns True if the file is an image, false otherwise
 */
export const isImageFile = (file: File): boolean => {
  // Check MIME type first
  if (file.type.startsWith('image/')) {
    return true;
  }
  
  // Fallback to extension check
  const extension = getFileExtension(file.name);
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
  
  return imageExtensions.includes(extension);
};

/**
 * Format a file size in bytes to a human-readable string
 * @param bytes The file size in bytes
 * @returns A human-readable file size string
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Generate the JavaScript for image resize functionality
 * @returns JavaScript code as a string
 */
export const getResizeScript = (): string => {
  return `
  document.addEventListener('DOMContentLoaded', function() {
    function initializeImageResizing() {
      const editor = document.querySelector('.ProseMirror');
      if (!editor) {
        // If editor not found, retry after a delay
        setTimeout(initializeImageResizing, 500);
        return;
      }
      
      // Variables to track resize state
      let isResizing = false;
      let currentImage = null;
      let startX, startY, startWidth, startHeight;
      let resizeHandle = null;
      
      // Create and inject resize handles for all images
      function createResizeHandles() {
        const images = editor.querySelectorAll('img');
        images.forEach(img => {
          // Only add handle if it doesn't already have one
          if (!img.nextElementSibling || !img.nextElementSibling.classList.contains('resize-handle')) {
            // Create a handle div
            const handle = document.createElement('div');
            handle.className = 'resize-handle';
            handle.style.position = 'absolute';
            handle.style.width = '10px';
            handle.style.height = '10px';
            handle.style.bottom = '0';
            handle.style.right = '0';
            handle.style.cursor = 'nwse-resize';
            handle.style.borderRight = '2px solid #4096ff';
            handle.style.borderBottom = '2px solid #4096ff';
            handle.style.zIndex = '999';
            
            // Create a wrapper if needed
            if (!img.parentElement.classList.contains('image-wrapper')) {
              const wrapper = document.createElement('div');
              wrapper.className = 'image-wrapper';
              wrapper.style.position = 'relative';
              wrapper.style.display = 'inline-block';
              wrapper.style.maxWidth = '100%';
              
              // Add the image to the wrapper
              img.parentNode.insertBefore(wrapper, img);
              wrapper.appendChild(img);
              wrapper.appendChild(handle);
            } else {
              img.parentElement.appendChild(handle);
            }
          }
        });
      }
      
      // Initialize resize handles on load and whenever content changes
      createResizeHandles();
      
      // Periodically check for new images
      setInterval(createResizeHandles, 2000);
      
      // Add event listener to handle resize start
      editor.addEventListener('mousedown', function(e) {
        // Check if click is on a resize handle
        if (e.target.classList && e.target.classList.contains('resize-handle')) {
          e.preventDefault();
          e.stopPropagation();
          
          isResizing = true;
          resizeHandle = e.target;
          currentImage = resizeHandle.parentElement.querySelector('img');
          
          if (!currentImage) return;
          
          const rect = currentImage.getBoundingClientRect();
          startX = e.clientX;
          startY = e.clientY;
          startWidth = rect.width;
          startHeight = rect.height;
          
          // Add resize handlers
          document.addEventListener('mousemove', handleMouseMove);
          document.addEventListener('mouseup', handleMouseUp);
        }
      });
      
      function handleMouseMove(e) {
        if (!isResizing || !currentImage) return;
        
        // Calculate width/height change while maintaining aspect ratio
        const deltaX = e.clientX - startX;
        
        // Calculate new size with minimum constraint
        let newWidth = Math.max(50, startWidth + deltaX);
        
        // Calculate new height based on aspect ratio
        const aspectRatio = startWidth / startHeight;
        let newHeight = newWidth / aspectRatio;
        
        // Apply new size
        currentImage.style.width = newWidth + 'px';
        currentImage.style.height = newHeight + 'px';
        
        // Force a layout update
        currentImage.parentElement.style.width = newWidth + 'px';
        currentImage.parentElement.style.height = 'auto';
      }
      
      function handleMouseUp() {
        if (isResizing && currentImage) {
          isResizing = false;
          
          // Cleanup
          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);
          
          // Store the final dimensions as attributes for persistence
          const editor = document.querySelector('.ProseMirror-editor');
          if (editor && editor.editor) {
            try {
              const width = currentImage.style.width;
              const height = currentImage.style.height;
              
              // Update the image attributes in the editor state
              if (width && height) {
                // This is just a fallback in case the editor provides a way to update
                // The actual update is typically done through the ProseMirror model
                currentImage.setAttribute('width', width);
                currentImage.setAttribute('height', height);
              }
            } catch (e) {
              console.error('Error updating image attributes:', e);
            }
          }
        }
      }
    }
    
    // Start initialization
    initializeImageResizing();
  });
  `;
};

/**
 * Custom CSS for the rich text editor
 * @returns CSS styles as a string
 */
export const getCustomStyles = (): string => {
  return `
  .ProseMirror {
    min-height: 300px;
  }
  
  .ProseMirror img {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 1em auto;
    border-radius: 4px;
    cursor: pointer;
    position: relative;
  }
  
  .ProseMirror img.ProseMirror-selectednode {
    outline: 2px solid #4096ff;
  }
  
  /* CSS for resizable images */
  .ProseMirror .image-wrapper {
    position: relative;
    display: inline-block;
    max-width: 100%;
    margin: 1em auto;
  }
  
  .ProseMirror .resize-handle {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 10px;
    height: 10px;
    border-right: 2px solid #4096ff;
    border-bottom: 2px solid #4096ff;
    cursor: nwse-resize;
    opacity: 0;
    transition: opacity 0.3s;
  }
  
  .ProseMirror .image-wrapper:hover .resize-handle,
  .ProseMirror .image-wrapper:focus .resize-handle {
    opacity: 1;
  }
  
  .ProseMirror p {
    margin: 1em 0;
  }
  
  /* Visible line spacing styles */
  .ProseMirror p[style*="line-height"] {
    display: block;
    background-color: rgba(242, 245, 255, 0.2);
    position: relative;
  }
  
  .ProseMirror p[style*="line-height"]::before {
    content: attr(style);
    position: absolute;
    right: 0;
    top: -15px;
    font-size: 10px;
    background: #f8f9fa;
    padding: 2px 4px;
    border-radius: 2px;
    color: #818890;
    opacity: 0;
    transition: opacity 0.2s;
  }
  
  .ProseMirror p[style*="line-height"]:hover::before {
    opacity: 1;
  }
  `;
}; 