import React, { useRef, useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Box, Paper, Tooltip, IconButton, CircularProgress } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useInput } from 'react-admin';
import ContentLibraryDialog from './AssetLibraryDialog';
import uploadService from '../services/uploadService';

interface TinyMCEEditorProps {
  source: string;
  label?: string;
  fullWidth?: boolean;
  validate?: any;
  onInsertFieldClick?: () => void;
  placeholder?: string;
  height?: number;
  disabled?: boolean;
  apiKey?: string;
  imagesUploadHandler?: (file: File) => Promise<{ url: string }>;
}

/**
 * A rich text editor component using TinyMCE, specifically designed for email templates
 */
const TinyMCEEditor = (props: TinyMCEEditorProps) => {
  const {
    source,
    fullWidth = true,
    validate,
    onInsertFieldClick,
    placeholder,
    height = 500,
    disabled = false,
    apiKey = import.meta.env.VITE_TINYMCE_API_KEY || "7mhg9z9cvwrxmvhvaqztnn98jcbpqjf3lzlnngvsotvlgnyi",
    imagesUploadHandler,
  } = props;
  
  const editorRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mediaLibraryOpen, setMediaLibraryOpen] = useState(false);
  
  // Use the useInput hook to handle form integration
  const {
    field,
    fieldState: { error, invalid, isTouched },
    formState: { isSubmitted }
  } = useInput({
    source,
    validate,
  });
  
  // Handle editor initialization
  const handleEditorInit = (_evt: any, editor: any) => {
    editorRef.current = editor;
    setIsLoading(false);
    
    // Listen for merge tag insertion events
    const handleInsertTag = (event: CustomEvent) => {
      const { field: targetField, tag } = event.detail;
      if (targetField === source && editor) {
        // Insert the merge tag at the current cursor position
        editor.insertContent(tag);
      }
    };

    window.addEventListener('insertMergeTag', handleInsertTag as EventListener);
    
    // Store cleanup function
    editor.mergeTagCleanup = () => {
      window.removeEventListener('insertMergeTag', handleInsertTag as EventListener);
    };
  };

  // Cleanup event listeners when component unmounts
  useEffect(() => {
    return () => {
      if (editorRef.current && editorRef.current.mergeTagCleanup) {
        editorRef.current.mergeTagCleanup();
      }
    };
  }, []);

  // Set active field when editor is focused
  const handleEditorFocus = () => {
    // Trigger custom event to set active field for merge tag insertion
    const event = new CustomEvent('setActiveField', {
      detail: { field: source }
    });
    window.dispatchEvent(event);
  };

  // Create default upload handler if none provided
  const defaultUploadHandler = async (file: File): Promise<{ url: string }> => {
    try {
      const fileId = await uploadService.uploadFile(file);
      // For now, return a placeholder URL - this should be updated to get actual file URL
      return { url: `/api/content/${fileId}` };
    } catch (error) {
      console.error('Upload failed:', error);
      throw error;
    }
  };

  // Handle image selection from media library
  const handleImageSelect = (imageId: number) => {
    if (editorRef.current) {
      // Insert the image using the content API URL structure
      const imageUrl = `/api/content/${imageId}`;
      editorRef.current.insertContent(`<img src="${imageUrl}" alt="Image" style="max-width: 100%; height: auto;" />`);
    }
  };

  // Create TinyMCE upload handler
  const createUploadHandler = () => {
    const uploadHandler = imagesUploadHandler || defaultUploadHandler;
    return (blobInfo: any, progress: (percent: number) => void) => {
      return new Promise<string>((resolve, reject) => {
        const file = blobInfo.blob() as File;
        uploadHandler(file)
          .then((result) => {
            resolve(result.url);
          })
          .catch((error) => {
            reject(error);
          });
      });
    };
  };

  return (
    <Paper
      sx={{
        p: 0,
        borderRadius: 0,
        boxShadow: "none",
        width: fullWidth ? '100%' : 'auto',
        position: 'relative'
      }}
    >
      {onInsertFieldClick && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mb: 1
          }}
        >
          <Tooltip title="Insert template field">
            <IconButton onClick={onInsertFieldClick}>
              <AddCircleOutlineIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )}
      
      {isLoading && (
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            height: 100
          }}
        >
          <CircularProgress size={40} />
        </Box>
      )}
      
      {/* @ts-ignore - Ignoring TypeScript errors for TinyMCE Editor component */}
      <Editor
        apiKey={apiKey}
        onInit={handleEditorInit}
        value={field.value}
        onEditorChange={(newValue) => field.onChange(newValue)}
        init={{
          height,
          menubar: true,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount',
            'emoticons', 'template', 'paste', 'hr', 'directionality', 'nonbreaking'
          ],
          toolbar: 'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | image media_library link | table emoticons | code fullscreen',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
          placeholder: placeholder,
          images_upload_handler: createUploadHandler(),
          setup: (editor: any) => {
            // Add custom button for media library
            editor.ui.registry.addButton('media_library', {
              text: 'Select from Library',
              tooltip: 'Select image from media library',
              icon: 'gallery',
              onAction: () => {
                setMediaLibraryOpen(true);
              }
            });

            // Add custom buttons or functionality here
            editor.on('init', () => {
              if (disabled) {
                editor.setMode('readonly');
              }
            });

            // Set active field when editor is focused
            editor.on('focus', () => {
              handleEditorFocus();
            });
          },
          // Email specific settings
          convert_urls: false,
          relative_urls: false,
          remove_script_host: false,
          document_base_url: window.location.origin,
          templates: [
            {
              title: 'Basic Email Template',
              description: 'A basic email template with header, content, and footer',
              content: `
                <div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: 0 auto;">
                  <div style="background-color: #2a5885; color: white; padding: 20px; text-align: center;">
                    <h1>Email Header</h1>
                  </div>
                  <div style="padding: 20px; background-color: #f9f9f9;">
                    <p>Hello {recipient_name},</p>
                    <p>Your email content goes here.</p>
                    <p>Best regards,<br>Your Organization</p>
                  </div>
                  <div style="background-color: #333; color: white; padding: 10px; text-align: center;">
                    <p>&copy; 2023 Your Organization. All rights reserved.</p>
                  </div>
                </div>
              `
            }
          ],
          content_css: [
            '//fonts.googleapis.com/css?family=Lato:300,300i,400,400i',
            '//www.tiny.cloud/css/codepen.min.css'
          ]
        }}
      />
      
      {invalid && isTouched && isSubmitted && error && (
        <Box sx={{ color: 'error.main', mt: 1, fontSize: '0.75rem' }}>
          {error.message}
        </Box>
      )}

      {/* Content Library Dialog */}
      <ContentLibraryDialog
        open={mediaLibraryOpen}
        onClose={() => setMediaLibraryOpen(false)}
        onSelectImageById={handleImageSelect}
      />
    </Paper>
  );
};

export default TinyMCEEditor; 