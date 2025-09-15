import React from "react";
import { Box } from "@mui/material";
import { required } from "react-admin";
import TinyMCEEditor from "../../../_components/TinyMCEEditor";

interface EnhancedRichTextEditorProps {
  onInsertFieldClick: () => void;
}

/**
 * Enhanced rich text editor component for email templates
 * Uses TinyMCE for advanced HTML editing capabilities
 */
const EnhancedRichTextEditor = ({ onInsertFieldClick }: EnhancedRichTextEditorProps) => {
  return (
    <Box sx={{ width: '100%' }}>
      <TinyMCEEditor
        source="body"
        validate={required("Body is required")}
        onInsertFieldClick={onInsertFieldClick}
        height={500}        
      />
    </Box>
  );
};

export default EnhancedRichTextEditor; 