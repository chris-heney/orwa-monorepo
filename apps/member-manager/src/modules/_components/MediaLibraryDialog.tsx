import React, { useEffect, useState } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, CircularProgress, TextField, 
  ImageList, Typography, Box,
  Alert, Chip, Divider, useTheme, useMediaQuery,
  Paper, IconButton, Tooltip, Menu, MenuItem
} from '@mui/material';
import uploadService from '../../services/uploadService/uploadService';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import SortIcon from '@mui/icons-material/Sort';
import RefreshIcon from '@mui/icons-material/Refresh';
import CloseIcon from '@mui/icons-material/Close';
import { format } from 'date-fns';

interface MediaFile {
  id: number;
  name: string;
  url: string;
  mime: string;
  createdAt: string;
}

interface MediaLibraryDialogProps {
  open: boolean;
  onClose: () => void;
    onSelectImage: (id: number) => void;
}

type SortOption = 'newest' | 'oldest' | 'name';

const MediaLibraryDialog: React.FC<MediaLibraryDialogProps> = ({ open, onClose, onSelectImage }) => {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [sortMenuAnchor, setSortMenuAnchor] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (open) {
      loadFiles();
      setSelectedImage(null);
      setSearchQuery('');
    }
  }, [open]);

  useEffect(() => {
    filterAndSortFiles();
  }, [searchQuery, files, sortOption]);

  const loadFiles = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await uploadService.getAllFiles();
      
      // Filter to only include images
      const imageFiles = response.filter((file: MediaFile) => 
        file.mime && file.mime.startsWith('image/')
      );
      
      setFiles(imageFiles);
      filterAndSortFiles(imageFiles);
    } catch (err) {
      setError('Failed to load files. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortFiles = (fileList = files) => {
    // First filter
    let filtered = fileList;
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      filtered = fileList.filter(file => 
        file.name.toLowerCase().includes(lowerCaseQuery)
      );
    }
    
    // Then sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortOption) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
    
    setFilteredFiles(sorted);
  };

  const handleImageClick = (file: MediaFile) => {
    console.log('Selected image:', file);
    setSelectedImage(file.id);
  };

  const handleSelectConfirm = () => {
    if (selectedImage) {
      console.log('Confirming selected image:', selectedImage);
      onSelectImage(selectedImage);
      onClose();
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return 'Unknown date';
    }
  };

  const handleSortMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setSortMenuAnchor(event.currentTarget);
  };

  const handleSortMenuClose = () => {
    setSortMenuAnchor(null);
  };

  const handleSortChange = (option: SortOption) => {
    console.log('Changing sort option to:', option);
    setSortOption(option);
    handleSortMenuClose();
  };

  const getSortLabel = () => {
    switch (sortOption) {
      case 'newest': return 'Newest first';
      case 'oldest': return 'Oldest first';
      case 'name': return 'Name (A-Z)';
      default: return 'Sort by';
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      aria-labelledby="media-library-dialog-title"
      PaperProps={{
        sx: {
          height: '80vh',
          display: 'flex',
          flexDirection: 'column'
        }
      }}
    >
      <DialogTitle id="media-library-dialog-title" sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        pb: 1
      }}>
        <Typography variant="h6" component="div">
          Media Library
        </Typography>
        <IconButton onClick={onClose} size="small" aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <Divider />
      
      <Box sx={{ px: 3, pt: 2, pb: 1, display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search by file name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        
        <Tooltip title="Refresh">
          <IconButton onClick={loadFiles} disabled={loading}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>
      
      <Box sx={{ px: 3, pb: 2, display: 'flex', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          {filteredFiles.length} {filteredFiles.length === 1 ? 'image' : 'images'} found
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Chip 
          icon={<SortIcon fontSize="small" />} 
          label={getSortLabel()} 
          size="small" 
          color="primary" 
          variant="outlined"
          onClick={handleSortMenuOpen}
          sx={{ cursor: 'pointer' }}
        />
        <Menu
          anchorEl={sortMenuAnchor}
          open={Boolean(sortMenuAnchor)}
          onClose={handleSortMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem 
            selected={sortOption === 'newest'}
            onClick={() => handleSortChange('newest')}
          >
            Newest first
          </MenuItem>
          <MenuItem 
            selected={sortOption === 'oldest'}
            onClick={() => handleSortChange('oldest')}
          >
            Oldest first
          </MenuItem>
          <MenuItem 
            selected={sortOption === 'name'}
            onClick={() => handleSortChange('name')}
          >
            Name (A-Z)
          </MenuItem>
        </Menu>
      </Box>
      
      <DialogContent sx={{ p: 2, flexGrow: 1, overflowY: 'auto' }}>
        {loading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box my={3}>
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
            <Button 
              variant="outlined" 
              color="primary" 
              onClick={loadFiles} 
              fullWidth
            >
              Try Again
            </Button>
          </Box>
        ) : filteredFiles.length === 0 ? (
          <Paper elevation={0} sx={{ p: 4, textAlign: 'center', bgcolor: 'background.default' }}>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              {searchQuery 
                ? "No images match your search criteria." 
                : "No images found in the media library."}
            </Typography>
            {!searchQuery && (
              <Typography variant="body2" color="text.secondary">
                Upload images first or clear your search filter.
              </Typography>
            )}
          </Paper>
        ) : (
          <ImageList cols={isMobile ? 2 : 3} gap={16}>
            {filteredFiles.map((file) => {
              const url = `${import.meta.env.VITE_API_ENDPOINT}${file.url}`;
              return (
              <Paper
                key={file.id}
                elevation={1}
                onClick={() => handleImageClick(file)}
                sx={{ 
                  cursor: 'pointer',
                  border: selectedImage === file.id ? `2px solid ${theme.palette.primary.main}` : 'none',
                  borderRadius: 1,
                  overflow: 'hidden',
                  transition: 'all 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3
                  }
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <img
                    src={url}
                    alt={file.name}
                    loading="lazy"
                    style={{ 
                      height: 180,
                      width: '100%',
                      objectFit: 'cover',
                      background: '#f5f5f5'
                    }}
                  />
                  <Box sx={{ 
                    p: 1.5,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.5
                  }}>
                    <Typography 
                      variant="body2" 
                      component="div" 
                      sx={{ 
                        fontWeight: 500,
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {file.name}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                    >
                      {formatDate(file.createdAt)}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            )})}
          </ImageList>
        )}
      </DialogContent>
      
      <Divider />
      
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button 
          onClick={handleSelectConfirm} 
          color="primary" 
          variant="contained"
          disabled={!selectedImage}
        >
          Insert Image
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MediaLibraryDialog; 