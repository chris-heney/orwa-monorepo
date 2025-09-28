import React, { useCallback, useEffect, useState } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, CircularProgress, TextField, 
  ImageList, Typography, Box,
  Alert, Chip, Divider, useTheme, useMediaQuery,
  Paper, IconButton, Menu, MenuItem,
  Select, FormControl, InputLabel, Grid2
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import SortIcon from '@mui/icons-material/Sort';
import CloseIcon from '@mui/icons-material/Close';
import { format } from 'date-fns';
import { useDataProvider } from 'react-admin';
import { Content } from '@ci-connect/types';
import { config } from '../config';

interface AssetLibraryDialogProps {
  open: boolean;
  onClose: () => void;
  onSelectImageByUrl?: (fileUrl: string) => void;
  onSelectImageById?: (fileId: number) => void;
}

type SortOption = 'newest' | 'oldest' | 'name';

interface Bucket {
  name: string;
  objectCount: number;
}

const AssetLibraryDialog: React.FC<AssetLibraryDialogProps> = ({ open, onClose, onSelectImageByUrl, onSelectImageById }) => {
  const [files, setFiles] = useState<Content[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<Content[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [sortMenuAnchor, setSortMenuAnchor] = useState<null | HTMLElement>(null);
  const [buckets, setBuckets] = useState<Bucket[]>([]);
  const [selectedBucket, setSelectedBucket] = useState<string>('all');
  const [loadingBuckets, setLoadingBuckets] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const dataProvider = useDataProvider();

  // Load buckets
  const loadBuckets = useCallback(async () => {
    setLoadingBuckets(true);
    try {
      const response = await fetch(`${config.VITE_ASSET_API_URL}/buckets`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch buckets');
      }

      const data = await response.json();
      setBuckets(data.data || []);
    } catch (error) {
      console.error('Failed to fetch buckets:', error);
    } finally {
      setLoadingBuckets(false);
    }
  }, []);

  const filterAndSortFiles = useCallback((fileList = files) => {
    // First filter by bucket
    let filtered = fileList;
    if (selectedBucket !== 'all') {
      filtered = fileList.filter(file => file.bucketName === selectedBucket);
    }
    
    // Then filter by search query
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(file => 
        file.originalName.toLowerCase().includes(lowerCaseQuery)
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
          return a.originalName.localeCompare(b.originalName);
        default:
          return 0;
      }
    });
    
    setFilteredFiles(sorted);
  }, [files, searchQuery, sortOption, selectedBucket]);

  const loadFiles = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await dataProvider.getList('asset', {
        pagination: { page: 1, perPage: 100 },
        sort: { field: 'createdAt', order: 'DESC' },
        filter: { mimeType: { $startsWith: 'image/' } }
      });
      
      // Filter to only include images
      const imageFiles = response.data?.filter((file: Content) => 
        file.mimeType && file.mimeType.startsWith('image/')
      ) || [];
      
      setFiles(imageFiles);
      filterAndSortFiles(imageFiles);
    } catch (err) {
      setError('Failed to load files. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [dataProvider, filterAndSortFiles]);

  useEffect(() => {
    if (open) {
      loadBuckets();
      loadFiles();
      setSelectedImage(null);
      setSearchQuery('');
      setSelectedBucket('all');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    filterAndSortFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, files, sortOption, selectedBucket]);

  const handleImageClick = (file: Content) => {
    setSelectedImage(file.id);
  };

  const handleSelectConfirm = () => {
    if (selectedImage) {
      const selectedFile = files.find(f => f.id === selectedImage);
      
      if (selectedFile) {
        // Call the appropriate callback based on what's provided
        if (onSelectImageByUrl) {
          onSelectImageByUrl(selectedFile.fileUrl);
        }
        if (onSelectImageById) {
          onSelectImageById(selectedFile.id);
        }
      }
      
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
          Asset Library
        </Typography>
        <IconButton onClick={onClose} size="small" aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <Divider />
      
      <Grid2 container spacing={2} sx={{ px: 3, pt: 2, pb: 1 }}>
        <Grid2 size={6}>
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
        </Grid2>
        <Grid2 size={6}>       
        <FormControl size="small">
          <InputLabel>Bucket</InputLabel>
          <Select
            value={selectedBucket}
            label="Bucket"
            onChange={(e) => setSelectedBucket(e.target.value)}
            disabled={loadingBuckets}
          >
            <MenuItem value="all">All Buckets</MenuItem>
            {buckets.map((bucket) => (
              <MenuItem key={bucket.name} value={bucket.name}>
                {bucket.name} ({bucket.objectCount})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        </Grid2>
        
        
      </Grid2>
      
      <Box sx={{ px: 3, pb: 2, display: 'flex', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          {filteredFiles.length} {filteredFiles.length === 1 ? 'image' : 'images'} found
          {selectedBucket !== 'all' && ` in ${selectedBucket}`}
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
                : selectedBucket !== 'all'
                ? `No images found in ${selectedBucket} bucket.`
                : "No images found in the asset library."}
            </Typography>
            {!searchQuery && selectedBucket === 'all' && (
              <Typography variant="body2" color="text.secondary">
                Upload images first or clear your search filter.
              </Typography>
            )}
          </Paper>
        ) : (
          <ImageList cols={isMobile ? 2 : 3} gap={16}>
            {filteredFiles.map((file) => {
              const url = file.fileUrl; // URLs are already complete from the API
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
                    alt={file.originalName}
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
                      {file.originalName}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                    >
                      {formatDate(file.createdAt as string)}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      sx={{ 
                        backgroundColor: theme.palette.grey[100],
                        px: 1,
                        py: 0.5,
                        borderRadius: 0.5,
                        display: 'inline-block',
                        fontSize: '0.7rem'
                      }}
                    >
                      {file.bucketName}
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

export default AssetLibraryDialog;