import React, { useState } from 'react';
import { IconButton, Tooltip, Menu, MenuItem } from '@mui/material';
import { useTiptapEditor } from 'ra-input-rich-text';
import AlignHorizontalLeftIcon from '@mui/icons-material/AlignHorizontalLeft';
import AlignHorizontalCenterIcon from '@mui/icons-material/AlignHorizontalCenter';
import AlignHorizontalRightIcon from '@mui/icons-material/AlignHorizontalRight';
import { Editor } from '@tiptap/react';

interface ImageAlignButtonProps {
  size?: 'small' | 'medium' | 'large';
  editor?: Editor | null;
}

const ImageAlignButton: React.FC<ImageAlignButtonProps> = ({ size = 'medium', editor: propEditor }) => {
  const contextEditor = useTiptapEditor();
  const editor = propEditor || contextEditor;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!editor) return;
    
    // Check if either image or resizableImage is active
    const isImageActive = editor.isActive('image') || editor.isActive('resizableImage');
    if (!isImageActive) return;
    
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const applyImageAlign = (align: string) => {
    if (!editor) return;
    
    try {
      // Apply to both image and resizableImage if they exist
      if (editor.isActive('image')) {
        editor.chain()
          .focus()
          .updateAttributes('image', { 
            style: `display: block; margin: ${align === 'center' ? '1em auto' : align === 'left' ? '1em 1em 1em 0' : '1em 0 1em 1em'}; float: ${align === 'center' ? 'none' : align};`
          })
          .run();
      }
      
      if (editor.isActive('resizableImage')) {
        editor.chain()
          .focus()
          .updateAttributes('resizableImage', { 
            style: `display: block; margin: ${align === 'center' ? '1em auto' : align === 'left' ? '1em 1em 1em 0' : '1em 0 1em 1em'}; float: ${align === 'center' ? 'none' : align};`
          })
          .run();
      }
    } catch (error) {
      console.error("Error aligning image:", error);
    }
    
    handleClose();
  };
  
  // Enable the button if an image is selected (either type)
  const isImageActive = editor && (editor.isActive('image') || editor.isActive('resizableImage'));
  
  return (
    <>
      <Tooltip title="Image alignment">
        <span>
          <IconButton 
            onClick={handleClick}
            size={size}
            aria-controls={open ? 'image-align-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            disabled={!isImageActive}
            sx={{
              color: isImageActive ? 'primary.main' : 'action.disabled'
            }}
          >
            <AlignHorizontalCenterIcon fontSize={size === 'small' ? 'small' : 'medium'} />
          </IconButton>
        </span>
      </Tooltip>
      <Menu
        id="image-align-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'image-align-button',
        }}
      >
        <MenuItem onClick={() => applyImageAlign('left')}>
          <AlignHorizontalLeftIcon sx={{ mr: 1 }} /> Align Left
        </MenuItem>
        <MenuItem onClick={() => applyImageAlign('center')}>
          <AlignHorizontalCenterIcon sx={{ mr: 1 }} /> Align Center
        </MenuItem>
        <MenuItem onClick={() => applyImageAlign('right')}>
          <AlignHorizontalRightIcon sx={{ mr: 1 }} /> Align Right
        </MenuItem>
      </Menu>
    </>
  );
};

export default ImageAlignButton; 