import React, { useRef, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField
} from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import LinkIcon from '@mui/icons-material/Link';

interface ImageInsertDialogProps {
  open: boolean;
  onClose: () => void;
  onSelectFromStorage: () => void;
  onUploadNew: (file: File) => void;
  onEnterLink: (url: string) => void;
}

const ImageInsertDialog: React.FC<ImageInsertDialogProps> = ({
  open,
  onClose,
  onSelectFromStorage,
  onUploadNew,
  onEnterLink
}) => {
  const [linkUrl, setLinkUrl] = useState('');
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLinkSubmit = () => {
    if (linkUrl.trim()) {
      onEnterLink(linkUrl.trim());
      setLinkUrl('');
      setLinkDialogOpen(false);
      onClose();
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onUploadNew(file);
      onClose();
    }
    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Insert Image</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, py: 2 }}>
            {/* Upload New Image */}
            <Paper
              sx={{
                p: 3,
                cursor: 'pointer',
                border: '2px dashed #ddd',
                textAlign: 'center',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'action.hover'
                }
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <ImageIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                Upload New Image
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Click to select an image file from your computer
              </Typography>
            </Paper>

            {/* Select from Storage */}
            <Paper
              sx={{
                p: 3,
                cursor: 'pointer',
                border: '2px solid #ddd',
                textAlign: 'center',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'action.hover'
                }
              }}
              onClick={() => {
                onSelectFromStorage();
                onClose();
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                <ImageIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
              </Box>
              <Typography variant="h6" gutterBottom>
                Select from Storage
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Choose from your uploaded images
              </Typography>
            </Paper>

            {/* Enter Link */}
            <Paper
              sx={{
                p: 3,
                cursor: 'pointer',
                border: '2px solid #ddd',
                textAlign: 'center',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'action.hover'
                }
              }}
              onClick={() => setLinkDialogOpen(true)}
            >
              <LinkIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                Enter Image Link
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Insert an image from a URL
              </Typography>
            </Paper>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Link Input Dialog */}
      <Dialog open={linkDialogOpen} onClose={() => setLinkDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Enter Image URL</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Image URL"
            type="url"
            fullWidth
            variant="outlined"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleLinkSubmit();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLinkDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleLinkSubmit} variant="contained" disabled={!linkUrl.trim()}>
            Insert Image
          </Button>
        </DialogActions>
      </Dialog>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />
    </>
  );
};

export default ImageInsertDialog;
