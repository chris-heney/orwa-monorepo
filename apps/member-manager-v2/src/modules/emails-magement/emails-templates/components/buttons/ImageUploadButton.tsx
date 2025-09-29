import React, { useState, useRef, useEffect } from 'react';
import { IconButton, Tooltip, Menu, MenuItem } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import { Editor } from '@tiptap/react';
import { getFullUrl } from '../../../../_helpers/imageUtils';
import uploadService from '../src/services/uploadService';
import MediaLibraryDialog from '../../../../_components/MediaLibraryDialog';

interface ImageUploadButtonProps {
  editor: Editor | null;
  size?: 'small' | 'medium' | 'large';
}

const ImageUploadButton: React.FC<ImageUploadButtonProps> = ({ editor, size = 'medium' }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [loading, setLoading] = useState(false);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Debug logging
  useEffect(() => {
    console.log("Editor instance:", editor);
  }, [editor]);

  useEffect(() => {
    console.log("Media library dialog state:", showMediaLibrary);
  }, [showMediaLibrary]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log("Image button clicked");
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    console.log("Menu closed");
    setAnchorEl(null);
  };

  const handleUploadClick = () => {
    console.log("Upload option clicked");
    handleClose();
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleMediaLibraryClick = () => {
    console.log("Media library option clicked");
    handleClose();
    setShowMediaLibrary(true);
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("File selected:", event.target.files);
    const files = event.target.files;
    if (!files || !files.length || !editor) return;

    setLoading(true);
    try {
      const file = files[0];
      
      // Upload the file
      console.log("Uploading file:", file.name);
      const response = await uploadService.uploadFile(file, true);
      console.log("Upload response:", response);
      
      // Get the URL from the response
      const url = response.url;
      
      if (url) {
        // Add the image to the editor with the full URL
        const fullUrl = getFullUrl(url);
        console.log("Inserting image with URL:", fullUrl);
        editor.chain().focus().setImage({ src: fullUrl }).run();
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      // Optionally show an error message
    } finally {
      setLoading(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSelectImage = (url: string) => {
    console.log("Image selected from library:", url);
    if (editor) {
      const fullUrl = getFullUrl(url);
      console.log("Inserting image with URL:", fullUrl);
      editor.chain().focus().setImage({ src: fullUrl }).run();
    }
    setShowMediaLibrary(false);
  };

  // Check if editor can accept images
  const canInsertImage = Boolean(editor) && editor?.isEditable;

  return (
    <>
      <Tooltip title="Insert image">
        <span>
          <IconButton 
            onClick={handleClick}
            size={size}
            disabled={!canInsertImage || loading}
          >
            <ImageIcon fontSize={size === 'small' ? 'small' : 'medium'} />
          </IconButton>
        </span>
      </Tooltip>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'image-upload-button',
        }}
      >
        <MenuItem onClick={handleUploadClick} disabled={loading}>
          Upload new image
        </MenuItem>
        <MenuItem onClick={handleMediaLibraryClick} disabled={loading}>
          Choose from media library
        </MenuItem>
      </Menu>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />
      
      <MediaLibraryDialog
        open={showMediaLibrary}
        onClose={() => {
          console.log("Closing media library dialog");
          setShowMediaLibrary(false);
        }}
        onSelectImage={handleSelectImage}
      />
    </>
  );
};

export default ImageUploadButton; 