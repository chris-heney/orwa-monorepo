import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Typography,
  Box,
} from '@mui/material';

interface TemplateFieldDialogProps {
  open: boolean;
  onClose: () => void;
  fields: string[];
  onFieldSelect: (field: string) => void;
}

/**
 * A dialog component for selecting template fields to insert into the email editor
 */
const TemplateFieldDialog = ({
  open,
  onClose,
  fields,
  onFieldSelect,
}: TemplateFieldDialogProps) => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter fields based on search query
  const filteredFields = fields.filter((field) =>
    field.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group fields by category for better organization
  const groupedFields: Record<string, string[]> = {};
  
  filteredFields.forEach((field) => {
    // Extract category from field name (e.g., "user.name" -> "user")
    const category = field.split('.')[0];
    
    if (!groupedFields[category]) {
      groupedFields[category] = [];
    }
    
    groupedFields[category].push(field);
  });

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: { maxHeight: '80vh' }
      }}
      
    >
      <DialogTitle>Insert Template Field</DialogTitle>
      
      <DialogContent dividers>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search fields..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ mb: 2 }}
        />
        
        {Object.keys(groupedFields).length === 0 ? (
          <Typography variant="body2" color="text.secondary" align="center">
            No fields match your search
          </Typography>
        ) : (
          Object.entries(groupedFields).map(([category, categoryFields]) => (
            <Box key={category} sx={{ mb: 2 }}>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  fontWeight: 'bold', 
                  bgcolor: 'action.hover', 
                  p: 1,
                  borderRadius: 1
                }}
              >
                {category.toUpperCase()}
              </Typography>
              
              <List dense disablePadding>
                {categoryFields.map((field) => (
                  <ListItemButton
                    key={field}
                    onClick={() => {
                      onFieldSelect(field);
                      onClose();
                    }}
                    sx={{ py: 0.5 }}
                  >
                    <ListItemText 
                      primary={field} 
                      primaryTypographyProps={{
                        sx: { fontFamily: 'monospace' }
                      }}
                    />
                  </ListItemButton>
                ))}
              </List>
              <Divider />
            </Box>
          ))
        )}
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TemplateFieldDialog; 