import React, { useState } from 'react';
import { IconButton, Tooltip, Menu, MenuItem } from '@mui/material';
import FormatLineSpacingIcon from '@mui/icons-material/FormatLineSpacing';
import { useTiptapEditor } from 'ra-input-rich-text';

interface SizeProps {
  size?: 'small' | 'medium' | 'large';
}

const LineSpacingButton: React.FC<SizeProps> = ({ size = 'medium' }) => {
  const editor = useTiptapEditor();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const applyLineSpacing = (spacing: string) => {
    if (!editor) return;
    
    try {
      // Select the current paragraph or block
      const { from, to } = editor.state.selection;
      
      // Apply line height to paragraphs within selection
      editor.state.doc.descendants((node, pos) => {
        if (node.type.name === 'paragraph' && pos >= from && pos <= to) {
          editor.chain()
            .setNodeSelection(pos)
            .updateAttributes('paragraph', { 'style': `line-height: ${spacing};` })
            .run();
        }
        return true;
      });
      
      // Also apply as a mark for backward compatibility
      editor.chain()
        .focus()
        .setMark('textStyle', { 'line-height': spacing })
        .run();
    } catch (error) {
      console.error("Error applying line spacing:", error);
    }
    
    handleClose();
  };
  
  return (
    <>
      <Tooltip title="Line spacing">
        <IconButton 
          onClick={handleClick}
          size={size}
          aria-controls={open ? 'line-spacing-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <FormatLineSpacingIcon fontSize="inherit" />
        </IconButton>
      </Tooltip>
      <Menu
        id="line-spacing-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'line-spacing-button',
        }}
      >
        <MenuItem onClick={() => applyLineSpacing('1')}>Single (1.0)</MenuItem>
        <MenuItem onClick={() => applyLineSpacing('1.15')}>Relaxed (1.15)</MenuItem>
        <MenuItem onClick={() => applyLineSpacing('1.5')}>1.5 Lines</MenuItem>
        <MenuItem onClick={() => applyLineSpacing('2')}>Double (2.0)</MenuItem>
        <MenuItem onClick={() => applyLineSpacing('2.5')}>2.5 Lines</MenuItem>
        <MenuItem onClick={() => applyLineSpacing('3')}>Triple (3.0)</MenuItem>
      </Menu>
    </>
  );
};

export default LineSpacingButton; 