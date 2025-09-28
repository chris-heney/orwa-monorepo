import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Chip,
  Typography,
  Paper,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
  VideoFile as VideoIcon,
  AudioFile as AudioIcon,
  InsertDriveFile as FileIcon,
} from '@mui/icons-material';
import { useInput, useDataProvider } from 'react-admin';
import ContentLibraryDialog from '../../../../_components/AssetLibraryDialog';

interface ContentSelectorProps {
  source: string;
  label: string;
  helperText?: string;
  accept?: string; // File types to accept (e.g., "image/*", "video/*")
  multiple?: boolean;
}

type SelectedItem = {
  url: string;
  name?: string;
  mimeType?: string;
  bucketName?: string;
};

const ContentSelector: React.FC<ContentSelectorProps> = ({
  source,
  label,
  helperText,
  accept = "*/*",
  multiple = true,
}) => {
  const { field } = useInput({ source });
  const [contentLibraryOpen, setContentLibraryOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<SelectedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const dataProvider = useDataProvider();

  // Normalize field value to URLs; resolve legacy numeric IDs to URLs
  useEffect(() => {
    const normalize = async () => {
      if (!field.value) {
        setSelectedFiles([]);
        return;
      }

      const raw = Array.isArray(field.value) ? field.value : [field.value];
      if (raw.length === 0) {
        setSelectedFiles([]);
        return;
      }

      setLoading(true);
      try {
        const items: SelectedItem[] = [];
        const urls: string[] = [];

        for (const entry of raw) {
          if (typeof entry === 'string') {
            items.push({ url: entry });
            urls.push(entry);
          } else if (typeof entry === 'number') {
            try {
              const res = await dataProvider.getOne('content', { id: entry });
              const file: any = res.data;
              if (file?.fileUrl) {
                items.push({ url: file.fileUrl, name: file.originalName, mimeType: file.mimeType, bucketName: file.bucketName });
                urls.push(file.fileUrl);
              }
            } catch (_e) {
              // ignore individual lookup failure
            }
          }
        }

        setSelectedFiles(items);

        // Migrate legacy IDs to URLs in form state
        if (raw.some(v => typeof v === 'number')) {
          field.onChange(urls);
        }
      } finally {
        setLoading(false);
      }
    };

    normalize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field.value, dataProvider]);

  const handleSelectContent = async (id: number) => {
    try {
      const res = await dataProvider.getOne('content', { id });
      const file: any = res.data;
      const url = file?.fileUrl;
      if (!url) return setContentLibraryOpen(false);

      const current = Array.isArray(field.value) ? field.value : field.value ? [field.value] : [];
      const newValue = multiple ? [...current, url] : [url];
      field.onChange(newValue);

      setSelectedFiles(prev => (
        multiple
          ? [...prev, { url, name: file.originalName, mimeType: file.mimeType, bucketName: file.bucketName }]
          : [{ url, name: file.originalName, mimeType: file.mimeType, bucketName: file.bucketName }]
      ));
    } finally {
      setContentLibraryOpen(false);
    }
  };

  const handleRemoveFile = (url: string) => {
    const current = Array.isArray(field.value) ? field.value : field.value ? [field.value] : [];
    const newValue = current.filter((u: any) => u !== url);
    field.onChange(newValue);
    setSelectedFiles(prev => prev.filter(f => f.url !== url));
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <ImageIcon />;
    if (mimeType.startsWith('video/')) return <VideoIcon />;
    if (mimeType.startsWith('audio/')) return <AudioIcon />;
    return <FileIcon />;
  };

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        {label}
      </Typography>
      
      {helperText && (
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {helperText}
        </Typography>
      )}

      {/* Add Content Button */}
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={() => setContentLibraryOpen(true)}
        sx={{ mb: 2 }}
      >
        Add {multiple ? 'Files' : 'File'}
      </Button>

      {/* Selected Files Display */}
      {loading ? (
        <Typography variant="body2" color="text.secondary">
          Loading files...
        </Typography>
      ) : selectedFiles.length > 0 ? (
        <Paper variant="outlined" sx={{ p: 1 }}>
          <List dense>
            {selectedFiles.map((file) => (
              <ListItem key={file.url}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.light' }}>
                    {getFileIcon(file.mimeType || 'application/octet-stream')}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={file.name || file.url}
                  secondary={
                    <Box>
                      <Typography variant="caption" display="block">
                        {file.mimeType || 'file'}
                      </Typography>
                      {file.bucketName && (
                        <Chip 
                          label={file.bucketName} 
                          size="small" 
                          variant="outlined"
                          sx={{ mr: 1, mt: 0.5 }}
                        />
                      )}
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={() => handleRemoveFile(file.url)}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
          No files selected
        </Typography>
      )}

      {/* Content Library Dialog */}
      <ContentLibraryDialog
        open={contentLibraryOpen}
        onClose={() => setContentLibraryOpen(false)}
        onSelectImageById={handleSelectContent}
      />
    </Box>
  );
};

export default ContentSelector;

