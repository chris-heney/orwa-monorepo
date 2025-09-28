import React, { useState } from 'react';
import {
    IconButton,
    Menu,
    MenuItem,
    Typography,
    Box,
    useTheme,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
} from '@mui/material';
import {
    Bookmark as BookmarkIcon,
    BookmarkBorder as BookmarkBorderIcon,
    Add as AddIcon,
} from '@mui/icons-material';
import { useStoreContext, useResourceContext, useRefresh, useListContext } from 'react-admin';

export const DomainMobileSavedViews: React.FC = () => {
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [saveDialogOpen, setSaveDialogOpen] = useState(false);
    const [viewName, setViewName] = useState('');
    const { setFilters, filterValues } = useListContext();
    const store = useStoreContext();
    const resource = useResourceContext();
    const refresh = useRefresh();

    const viewsKey = `RaViews.${resource}`;
    const activeViewKey = `${viewsKey}.__active`;
    const views = store.getItem(viewsKey) || {};
    const activeView = store.getItem(activeViewKey);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSaveClick = () => {
        setAnchorEl(null);
        setSaveDialogOpen(true);
    };

    const handleSaveCancel = () => {
        setSaveDialogOpen(false);
        setViewName('');
    };

    const handleSaveConfirm = () => {
        try {
            // Collect keys for this resource under the RA store namespace (same as desktop)
            const namespace = 'Config';
            const prefix = `RaStore${namespace}.`;
            const snapshot: Record<string, any> = {};
            
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (!key || !key.startsWith(prefix)) continue;
                // only keep entries that include the current resource
                if (!key.includes(`.${resource}.`)) continue;
                const subKey = key.substring(prefix.length);
                const raw = localStorage.getItem(key) || '';
                try {
                    snapshot[subKey] = JSON.parse(raw);
                } catch {
                    snapshot[subKey] = raw;
                }
            }
            
            // Also record current list filter values (same as desktop)
            snapshot[`preferences.${resource}.list.filterValues`] = filterValues || {};
            
            // Store under RaViews (same key structure as desktop)
            const existing = (store.getItem(viewsKey) as any) || {};
            const named = viewName.trim() || `View ${new Date().toLocaleString()}`;
            const next = { ...existing, [named]: snapshot };
            
            store.setItem(viewsKey, next);
            store.setItem(activeViewKey, named);
            
            setSaveDialogOpen(false);
            setViewName('');
            refresh();
        } catch (error) {
            console.error('Error saving view:', error);
        }
    };

    const applyView = (name: string) => {
        try {
            const snapshot = views?.[name];
            if (!snapshot) return;

            // Collect all unique keys from all saved views to know what needs to be cleared
            const allKeysFromViews = new Set<string>();
            Object.values(views).forEach(view => {
                Object.keys(view).forEach(key => allKeysFromViews.add(key));
            });

            // Clear all keys that appear in any view (this ensures clean state)
            allKeysFromViews.forEach(key => {
                store.removeItem(key);
            });

            // Clear filters in React Admin context
            setFilters({}, []);

            // Apply all saved settings from the current snapshot
            Object.entries(snapshot).forEach(([subKey, value]) => {
                store.setItem(subKey, value as any);
            });

            // Handle React Admin specific filters if they exist in the snapshot
            const raFilterKey = `RaStore.${resource}.listParams.filter`;
            if (snapshot[raFilterKey]) {
                setFilters(snapshot[raFilterKey], []);
            }

            // Save the active view and update UI state
            store.setItem(activeViewKey, name);

            // Refresh the list to apply changes
            refresh();

            handleClose();
        } catch (error) {
            console.error('Error applying view:', error);
        }
    };

    const viewNames = Object.keys(views);
    const hasViews = viewNames.length > 0;

    return (
        <>
            <IconButton
                onClick={handleClick}
                size="small"
                sx={{
                    backgroundColor: activeView ? 'primary.main' : 'transparent',
                    color: activeView ? 'primary.contrastText' : 'text.secondary',
                    border: `1px solid ${theme.palette.divider}`,
                    '&:hover': {
                        backgroundColor: activeView ? 'primary.dark' : 'action.hover',
                        borderColor: 'primary.main',
                    },
                }}
            >
                {activeView ? (
                    <BookmarkIcon fontSize="small" />
                ) : (
                    <BookmarkBorderIcon fontSize="small" />
                )}
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                PaperProps={{
                    sx: {
                        mt: 1,
                        minWidth: 200,
                        maxHeight: 300,
                        border: `1px solid ${theme.palette.divider}`,
                        boxShadow: `0 8px 24px ${theme.palette.primary.main}15`,
                    },
                }}
            >
                <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="subtitle2" fontWeight={600} color="text.primary">
                        Saved Views
                    </Typography>
                </Box>
                <Divider />

                {/* Save current view option */}
                <MenuItem
                    onClick={handleSaveClick}
                    sx={{
                        py: 1.5,
                        color: 'primary.main',
                        '&:hover': {
                            backgroundColor: `${theme.palette.primary.main}08`,
                        },
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AddIcon fontSize="small" />
                        <Box>
                            <Typography variant="body2" fontWeight={500}>
                                Save Current View
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Save current filters and settings
                            </Typography>
                        </Box>
                    </Box>
                </MenuItem>

                <Divider />
                
                {/* Clear all filters option */}
                <MenuItem
                    onClick={() => {
                        // Clear all filters and active view
                        const allKeysFromViews = new Set<string>();
                        Object.values(views).forEach(view => {
                            Object.keys(view).forEach(key => allKeysFromViews.add(key));
                        });

                        allKeysFromViews.forEach(key => {
                            store.removeItem(key);
                        });

                        setFilters({}, []);
                        store.removeItem(activeViewKey);
                        refresh();
                        handleClose();
                    }}
                    selected={!activeView}
                    sx={{
                        py: 1.5,
                        '&.Mui-selected': {
                            backgroundColor: `${theme.palette.primary.main}08`,
                            borderLeft: `3px solid ${theme.palette.primary.main}`,
                        },
                    }}
                >
                    <Box>
                        <Typography variant="body2" fontWeight={500}>
                            All Domains
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            No filters applied
                        </Typography>
                    </Box>
                </MenuItem>

                <Divider />

                {/* Saved views */}
                {hasViews ? (
                    viewNames.map((name) => (
                        <MenuItem
                            key={name}
                            onClick={() => applyView(name)}
                            selected={activeView === name}
                            sx={{
                                py: 1.5,
                                '&.Mui-selected': {
                                    backgroundColor: `${theme.palette.primary.main}08`,
                                    borderLeft: `3px solid ${theme.palette.primary.main}`,
                                },
                            }}
                        >
                            <Box>
                                <Typography variant="body2" fontWeight={500}>
                                    {name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Saved view
                                </Typography>
                            </Box>
                        </MenuItem>
                    ))
                ) : (
                    <Box sx={{ px: 2, py: 3, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            No saved views yet
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Apply filters, then tap "Save Current View" above
                        </Typography>
                    </Box>
                )}
            </Menu>

            {/* Save Dialog */}
            <Dialog 
                open={saveDialogOpen} 
                onClose={handleSaveCancel}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        mx: 2,
                    },
                }}
            >
                <DialogTitle sx={{ pb: 1 }}>
                    <Typography variant="h6" fontWeight={600}>
                        Save Current View
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Give your current filters and settings a name
                    </Typography>
                </DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    <TextField
                        autoFocus
                        fullWidth
                        label="View Name"
                        placeholder="e.g., WordPress Sites, Production Domains..."
                        value={viewName}
                        onChange={(e) => setViewName(e.target.value)}
                        variant="outlined"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                            },
                        }}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter' && viewName.trim()) {
                                handleSaveConfirm();
                            }
                        }}
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3, pt: 1, gap: 1 }}>
                    <Button
                        onClick={handleSaveCancel}
                        variant="outlined"
                        sx={{
                            borderRadius: 2,
                            minWidth: 100,
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSaveConfirm}
                        variant="contained"
                        disabled={!viewName.trim()}
                        sx={{
                            borderRadius: 2,
                            minWidth: 100,
                            boxShadow: `0 4px 12px ${theme.palette.primary.main}30`,
                            '&:not(.Mui-disabled):hover': {
                                boxShadow: `0 6px 16px ${theme.palette.primary.main}40`,
                            },
                        }}
                    >
                        Save View
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
