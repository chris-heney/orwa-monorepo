import {
    Add as AddIcon,
    Delete as DeleteIcon,
    FolderOutlined as BucketIcon,
    Refresh as RefreshIcon,
    Storage as StorageIcon,
} from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    TextField,
    Tooltip,
    Typography,
    keyframes,
} from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNotify } from 'react-admin';
import { config } from '../../../config';
import { useAssetProvider } from '../context/AssetProvider';

interface Bucket {
    name: string;
    creationDate: string;
    objectCount?: number;
    fileCount?: number;
    folderCount?: number;
}

const LONG_PRESS_DURATION = 500; // 500ms for long press

// Shake animation keyframes
const shake = keyframes`
  0% { transform: translateX(0); }
  25% { transform: translateX(-2px); }
  50% { transform: translateX(2px); }
  75% { transform: translateX(-1px); }
  100% { transform: translateX(0); }
`;

export const BucketSidebar: React.FC = () => {
    const { selectedBucket, setSelectedBucket, sidebarOpen, sidebarWidth, setCurrentPath } = useAssetProvider();
    const open = sidebarOpen;
    const width = sidebarWidth;
    const [buckets, setBuckets] = useState<Bucket[]>([]);
    const [loading, setLoading] = useState(false);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [newBucketName, setNewBucketName] = useState('');
    const [error, setError] = useState<string | null>(null);
    
    // Selection state for bulk delete
    const [selectionMode, setSelectionMode] = useState(false);
    const [selectedBuckets, setSelectedBuckets] = useState<Set<string>>(new Set());
    const [shakingBucket, setShakingBucket] = useState<string | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    
    // Long press detection
    const longPressTimers = useRef<Map<string, NodeJS.Timeout>>(new Map());
    
    const notify = useNotify();

    const fetchBuckets = async () => {
        setLoading(true);
        try {
            // Since user only has access to 'synapse' bucket, return a fixed bucket list
            setBuckets([{
                name: 'synapse',
                creationDate: new Date().toISOString(),
                objectCount: 0,
                fileCount: 0,
                folderCount: 0
            }]);
        } catch (error) {
            console.error('Failed to fetch buckets:', error);
            notify('Failed to fetch buckets', { type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const createBucket = async () => {
        // User only has access to 'synapse' bucket, cannot create new buckets
        setError('You do not have permission to create new buckets. You only have access to the "synapse" bucket.');
        return;
    };

    const deleteBuckets = async (bucketNames: string[]) => {
        // User only has access to 'synapse' bucket, cannot delete buckets
        notify('You do not have permission to delete buckets. You only have access to the "synapse" bucket.', { type: 'error' });
        setSelectedBuckets(new Set());
        setSelectionMode(false);
        setDeleteDialogOpen(false);
        return;
    };

    const handleLongPressStart = useCallback((bucketName: string) => {
        const timer = setTimeout(() => {
            setShakingBucket(bucketName);
            setSelectionMode(true);
            
            // Clear shake animation after animation duration
            setTimeout(() => {
                setShakingBucket(null);
            }, 600);
        }, LONG_PRESS_DURATION);
        
        longPressTimers.current.set(bucketName, timer);
    }, []);

    const handleLongPressEnd = useCallback((bucketName: string) => {
        const timer = longPressTimers.current.get(bucketName);
        if (timer) {
            clearTimeout(timer);
            longPressTimers.current.delete(bucketName);
        }
    }, []);

    const handleBucketClick = useCallback((bucketName: string) => {
        if (selectionMode) {
            const newSelected = new Set(selectedBuckets);
            if (newSelected.has(bucketName)) {
                newSelected.delete(bucketName);
            } else {
                newSelected.add(bucketName);
            }
            setSelectedBuckets(newSelected);
        } else {
            // Reset current folder path when changing buckets
            setCurrentPath('');
            setSelectedBucket(bucketName);
        }
    }, [selectionMode, selectedBuckets, setSelectedBucket, setCurrentPath]);

    const handleExitSelectionMode = () => {
        setSelectionMode(false);
        setSelectedBuckets(new Set());
    };

    const handleDeleteSelected = () => {
        if (selectedBuckets.size > 0) {
            setDeleteDialogOpen(true);
        }
    };

    const handleSelectAll = () => {
        if (selectedBuckets.size === buckets.length) {
            // Deselect all
            setSelectedBuckets(new Set());
        } else {
            // Select all
            setSelectedBuckets(new Set(buckets.map(b => b.name)));
        }
    };

    useEffect(() => {
        fetchBuckets();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Cleanup timers on unmount
    useEffect(() => {
        return () => {
            longPressTimers.current.forEach(timer => clearTimeout(timer));
            // eslint-disable-next-line react-hooks/exhaustive-deps
            longPressTimers.current.clear();
        };
    }, []);

    if (!open) return null;

    const isAllSelected = buckets.length > 0 && selectedBuckets.size === buckets.length;

    return (
        <>
            <Box
                sx={{
                    width: width,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRight: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                }}
            >
                {/* Header */}
                <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={1}
                    >
                        <Typography variant="h6" fontWeight={600}>
                            Buckets
                        </Typography>
                        <Box display="flex" gap={1} alignItems="center">
                            {selectionMode ? (
                                <>
                                    <Tooltip title="Select All">
                                        <IconButton
                                            size="small"
                                            onClick={handleSelectAll}
                                            sx={{
                                                color: isAllSelected ? 'primary.main' : 'action.active',
                                                '&:hover': {
                                                    bgcolor: 'primary.light',
                                                    color: 'primary.contrastText',
                                                },
                                            }}
                                        >
                                            <Checkbox 
                                                checked={isAllSelected}
                                                indeterminate={selectedBuckets.size > 0 && selectedBuckets.size < buckets.length}
                                                size="small"
                                                sx={{ p: 0 }}
                                            />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title={`Delete ${selectedBuckets.size} bucket${selectedBuckets.size > 1 ? 's' : ''}`}>
                                        <span>
                                            <IconButton
                                                size="small"
                                                onClick={handleDeleteSelected}
                                                disabled={selectedBuckets.size === 0}
                                                sx={{
                                                    color: selectedBuckets.size > 0 ? 'error.main' : 'action.disabled',
                                                    '&:hover': {
                                                        bgcolor: selectedBuckets.size > 0 ? 'error.light' : 'transparent',
                                                        color: selectedBuckets.size > 0 ? 'error.contrastText' : 'action.disabled',
                                                    },
                                                    '&:disabled': {
                                                        color: 'action.disabled',
                                                    }
                                                }}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </span>
                                    </Tooltip>
                                    <Button
                                        size="small"
                                        onClick={handleExitSelectionMode}
                                        variant="outlined"
                                        sx={{ 
                                            minWidth: 'auto', 
                                            px: 1.5,
                                            fontSize: '0.75rem',
                                            borderColor: 'grey.400',
                                            color: 'text.primary',
                                            '&:hover': {
                                                borderColor: 'grey.600',
                                                bgcolor: 'grey.50',
                                            }
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Tooltip title="Refresh Buckets">
                                        <IconButton
                                            size="small"
                                            onClick={fetchBuckets}
                                            disabled={loading}
                                            sx={{
                                                color: 'action.active',
                                                '&:hover': {
                                                    bgcolor: 'action.hover',
                                                    color: 'primary.main',
                                                },
                                                '&:disabled': {
                                                    color: 'action.disabled',
                                                }
                                            }}
                                        >
                                            <RefreshIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    {/* Create bucket button hidden - user only has access to 'synapse' bucket */}
                                </>
                            )}
                        </Box>
                    </Box>

                    {selectionMode && (
                        <Typography variant="caption" color="text.secondary">
                            {selectedBuckets.size} bucket{selectedBuckets.size > 1 ? 's' : ''} selected
                        </Typography>
                    )}
                </Box>

                <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    {!selectionMode && (
                        <>
                            {/* All Files Option */}
                            <List sx={{ pt: 1 }}>
                                <ListItem disablePadding>
                                    <ListItemButton
                                        selected={selectedBucket === ''}
                                        onClick={() => { setCurrentPath(''); setSelectedBucket(''); }}
                                        sx={{
                                            mx: 1,
                                            borderRadius: 1,
                                            '&.Mui-selected': {
                                                bgcolor: 'primary.light',
                                                color: 'primary.contrastText',
                                                '&:hover': {
                                                    bgcolor: 'primary.main',
                                                },
                                            },
                                        }}
                                    >
                                        <ListItemIcon sx={{ minWidth: 36 }}>
                                            <StorageIcon
                                                fontSize="small"
                                                color={
                                                    selectedBucket === ''
                                                        ? 'inherit'
                                                        : 'action'
                                                }
                                            />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="All Files"
                                            primaryTypographyProps={{
                                                fontSize: '0.875rem',
                                                fontWeight:
                                                    selectedBucket === '' ? 600 : 400,
                                            }}
                                        />
                                    </ListItemButton>
                                </ListItem>
                            </List>

                            <Divider sx={{ mx: 2 }} />
                        </>
                    )}

                    {/* Bucket List */}
                    <Box sx={{ flex: 1, overflow: 'auto' }}>
                        <List sx={{ pt: 1 }}>
                            {buckets.map(bucket => {
                                const isSelected = selectedBuckets.has(bucket.name);
                                const isShaking = shakingBucket === bucket.name;
                                
                                return (
                                    <ListItem key={bucket.name} disablePadding>
                                        <ListItemButton
                                            selected={!selectionMode && selectedBucket === bucket.name}
                                            onClick={() => handleBucketClick(bucket.name)}
                                            onMouseDown={() => handleLongPressStart(bucket.name)}
                                            onMouseUp={() => handleLongPressEnd(bucket.name)}
                                            onMouseLeave={() => handleLongPressEnd(bucket.name)}
                                            onTouchStart={() => handleLongPressStart(bucket.name)}
                                            onTouchEnd={() => handleLongPressEnd(bucket.name)}
                                            sx={{
                                                mx: 1,
                                                borderRadius: 1,
                                                '&.Mui-selected': {
                                                    bgcolor: 'primary.light',
                                                    color: 'primary.contrastText',
                                                    '&:hover': {
                                                        bgcolor: 'primary.main',
                                                    },
                                                },
                                                ...(isShaking && {
                                                    animation: `${shake} 0.6s ease-in-out`,
                                                }),
                                                ...(selectionMode && isSelected && {
                                                    bgcolor: 'action.selected',
                                                    '&:hover': {
                                                        bgcolor: 'action.hover',
                                                    },
                                                }),
                                            }}
                                        >
                                            {selectionMode && (
                                                <ListItemIcon sx={{ minWidth: 36 }}>
                                                    <Checkbox
                                                        checked={isSelected}
                                                        size="small"
                                                        color="primary"
                                                    />
                                                </ListItemIcon>
                                            )}
                                            <ListItemIcon sx={{ minWidth: 36 }}>
                                                <BucketIcon
                                                    fontSize="small"
                                                    color={
                                                        (!selectionMode && selectedBucket === bucket.name) ||
                                                        (selectionMode && isSelected)
                                                            ? 'inherit'
                                                            : 'action'
                                                    }
                                                />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={bucket.name}
                                                secondary={(() => {
                                                    if (bucket.objectCount !== undefined) {
                                                        const files = bucket.fileCount ?? bucket.objectCount
                                                        const folders = bucket.folderCount ?? 0
                                                        return `${folders} folder${folders === 1 ? '' : 's'} • ${files} file${files === 1 ? '' : 's'}`
                                                    }
                                                    return new Date(bucket.creationDate).toLocaleDateString()
                                                })()}
                                                primaryTypographyProps={{
                                                    fontSize: '0.875rem',
                                                    fontWeight:
                                                        (!selectionMode && selectedBucket === bucket.name) ||
                                                        (selectionMode && isSelected)
                                                            ? 600
                                                            : 400,
                                                    noWrap: true,
                                                }}
                                                secondaryTypographyProps={{
                                                    fontSize: '0.75rem',
                                                    color:
                                                        (!selectionMode && selectedBucket === bucket.name) ||
                                                        (selectionMode && isSelected)
                                                            ? 'inherit'
                                                            : 'text.secondary',
                                                    fontWeight: bucket.objectCount > 0 ? 500 : 400,
                                                }}
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                );
                            })}
                        </List>

                        {buckets.length === 0 && !loading && (
                            <Box
                                sx={{
                                    p: 3,
                                    textAlign: 'center',
                                    color: 'text.secondary',
                                }}
                            >
                                <BucketIcon
                                    sx={{ fontSize: 48, mb: 1, opacity: 0.5 }}
                                />
                                <Typography variant="body2">
                                    No buckets found
                                </Typography>
                                <Typography variant="caption">
                                    Click the + icon to create one
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Box>
            </Box>

            {/* Create Bucket Dialog */}
            <Dialog
                open={createDialogOpen}
                onClose={() => {
                    setCreateDialogOpen(false);
                    setError(null);
                    setNewBucketName('');
                }}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Create New Bucket</DialogTitle>
                <DialogContent>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Bucket Name"
                        fullWidth
                        variant="outlined"
                        value={newBucketName}
                        onChange={e =>
                            setNewBucketName(e.target.value.toLowerCase())
                        }
                        helperText="3-63 characters, lowercase letters, numbers, dots, and hyphens only"
                        onKeyPress={e => {
                            if (e.key === 'Enter') {
                                createBucket();
                            }
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            setCreateDialogOpen(false);
                            setError(null);
                            setNewBucketName('');
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={createBucket}
                        variant="contained"
                        disabled={!newBucketName.trim()}
                    >
                        Create
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ pb: 1 }}>
                    <Box display="flex" alignItems="center" gap={1}>
                        <DeleteIcon color="error" />
                        <Typography variant="h6" component="span">
                            Delete Bucket{selectedBuckets.size > 1 ? 's' : ''}
                        </Typography>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1" gutterBottom>
                        Are you sure you want to permanently delete the following bucket{selectedBuckets.size > 1 ? 's' : ''}?
                    </Typography>
                    
                    <Box sx={{ 
                        mt: 2, 
                        mb: 2, 
                        p: 2, 
                        bgcolor: 'grey.50', 
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: 'grey.200'
                    }}>
                        {Array.from(selectedBuckets).map(bucketName => {
                            const bucket = buckets.find(b => b.name === bucketName);
                            const fileCount = bucket?.objectCount || 0;
                            return (
                                <Box 
                                    key={bucketName}
                                    sx={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        alignItems: 'center',
                                        py: 0.5
                                    }}
                                >
                                    <Typography 
                                        variant="body2" 
                                        sx={{ 
                                            fontFamily: 'monospace', 
                                            color: 'text.primary',
                                            fontWeight: 500
                                        }}
                                    >
                                        🗑️ {bucketName}
                                    </Typography>
                                    <Typography 
                                        variant="caption" 
                                        sx={{ 
                                            color: fileCount > 0 ? 'error.main' : 'text.secondary',
                                            fontWeight: fileCount > 0 ? 600 : 400,
                                            bgcolor: fileCount > 0 ? 'error.light' : 'transparent',
                                            px: fileCount > 0 ? 1 : 0,
                                            py: fileCount > 0 ? 0.25 : 0,
                                            borderRadius: 1,
                                        }}
                                    >
                                        {fileCount} file{fileCount === 1 ? '' : 's'}
                                    </Typography>
                                </Box>
                            );
                        })}
                    </Box>
                    
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        <Typography variant="body2" fontWeight={500}>
                            ⚠️ This action cannot be undone!
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            {(() => {
                                const totalFiles = Array.from(selectedBuckets).reduce((total, bucketName) => {
                                    const bucket = buckets.find(b => b.name === bucketName);
                                    return total + (bucket?.objectCount || 0);
                                }, 0);
                                
                                if (totalFiles === 0) {
                                    return `${selectedBuckets.size > 1 ? 'These buckets are' : 'This bucket is'} empty and will be deleted.`;
                                }
                                
                                return `All ${totalFiles} file${totalFiles === 1 ? '' : 's'} and data stored in ${selectedBuckets.size > 1 ? 'these buckets' : 'this bucket'} will be permanently deleted from MinIO storage.`;
                            })()}
                        </Typography>
                    </Alert>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button 
                        onClick={() => setDeleteDialogOpen(false)}
                        variant="outlined"
                        sx={{ mr: 1 }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => deleteBuckets(Array.from(selectedBuckets))}
                        variant="contained"
                        color="error"
                        startIcon={<DeleteIcon />}
                        sx={{
                            '&:hover': {
                                bgcolor: 'error.dark',
                            }
                        }}
                    >
                        Delete {selectedBuckets.size} Bucket{selectedBuckets.size > 1 ? 's' : ''}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};