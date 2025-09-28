import React, { useState, useEffect } from 'react';
import {
    TopToolbar,
    ExportButton,
    SelectColumnsButton,
    useListContext,
    useStoreContext,
    useResourceContext,
    useRefresh,
} from 'react-admin';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Select,
    MenuItem,
    useTheme,
    useMediaQuery,
    Tooltip,
    Typography,
    Divider,
    Stack,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ViewListIcon from '@mui/icons-material/ViewList';

interface ListActionsToolbarProps {
    filterButton?: boolean;
    columnsButton?: boolean;
    exportButton?: boolean;
}

const ListActionsToolbar: React.FC<ListActionsToolbarProps> = ({
    filterButton = true,
    columnsButton = true,
    exportButton = true,
}) => {

    const { filterValues, setFilters } = useListContext();
    const store = useStoreContext();
    const resource = useResourceContext();
    const refresh = useRefresh();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

    const [saveOpen, setSaveOpen] = useState(false);
    const [viewName, setViewName] = useState('');
    const [views, setViews] = useState<Record<string, any>>({});
    const [selectedView, setSelectedView] = useState('');

    const viewsKey = `RaViews.${resource}`;
    const activeViewKey = `${viewsKey}.__active`;

    useEffect(() => {
        try {
            const existing = (store.getItem(viewsKey) as any) || {};
            setViews(existing);
            const active = (store.getItem(activeViewKey) as any) || '';
            if (typeof active === 'string') setSelectedView(active);
        } catch {}
    }, [store, viewsKey, activeViewKey]);

    const handleSaveView = () => setSaveOpen(true);
    const handleCancel = () => setSaveOpen(false);
    const handleConfirm = () => {
        // Collect keys for this resource under the RA store namespace
        // We persist a single object per view name: RaViews.<resource>.<viewName>
        try {
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
            // Also record current list filter values and some UI hints
            snapshot[`preferences.${resource}.list.filterValues`] =
                filterValues || {};
            // Store under RaViews
            const existing = (store.getItem(viewsKey) as any) || {};
            const named = viewName || `View ${new Date().toLocaleString()}`;
            const next = { ...existing, [named]: snapshot };
            store.setItem(viewsKey, next);
            store.setItem(activeViewKey, named);
            setViews(next);
            setSelectedView(named);
        } catch {}
        setSaveOpen(false);
        setViewName('');
    };

    const applyView = (name: string) => {
        try {
            // Handle special "default" view
            if (name === '__default__') {
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

                // Clear the active view
                store.removeItem(activeViewKey);
                setSelectedView('');

                // Refresh the list to apply changes
                refresh();
                return;
            }

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
            setSelectedView(name);

            // Refresh the list to apply changes
            refresh();

        } catch (error) {
            console.error('Error applying view:', error);
        }
    };

    return (
        <>
            <TopToolbar
                sx={{
                    display: 'flex',
                    alignItems: 'center',
    
                    py: 1,
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    overflow: 'hidden',
                    flexWrap: 'wrap',
                    justifyContent: 'flex-end',
                    width: '100%',
                }}
            >
                <Stack
                    direction="row"
                    spacing={{ xs: 0.5, sm: 1 }}
                    sx={{
                        flexGrow: 0,
                        flexBasis: 'auto',
                        order: 1,
                        justifyContent: 'flex-end',
                    }}
                >
                    {filterButton &&
                        /* Removed FilterButton since it requires List filters which might not be defined */
                        /* Uncomment and reimplement if needed with proper filters
                        <Tooltip title="Filter list">
                            <div>
                                <FilterButton
                                    size={isSmall ? 'small' : 'medium'}
                                    color="primary"
                                    sx={{
                                        bgcolor: theme.palette.background.paper,
                                        boxShadow: `0 2px 8px ${theme.palette.primary.main}15`,
                                        '&:hover': {
                                            bgcolor: theme.palette.primary.main,
                                            color: theme.palette.primary
                                                .contrastText,
                                            transform: 'translateY(-2px)',
                                        },
                                        transition: 'all 0.2s',
                                    }}
                                />
                            </div>
                        </Tooltip>
                        */
                        null}

                    {columnsButton && (
                        <Tooltip title="Customize columns">
                                <SelectColumnsButton
                                    sx={{
                                        position: 'relative',
                                        overflow: 'hidden',
                                        textIndent: '-9999px',
                                    }}
                                    size={isSmall ? 'small' : 'medium'}
                                    color="primary"
                                    
                                />
                        </Tooltip>
                    )}

                    {exportButton && (
                        <Tooltip title="Export data">
                            <div>
                                <ExportButton
                                    size={isSmall ? 'small' : 'medium'}
                                    color="primary"
                                    label=""
                                    
                                />
                            </div>
                        </Tooltip>
                    )}

                    {!isMobile && (
                        <Tooltip title="Save current view">
                            <Button
                                size="small"
                                onClick={handleSaveView}
                                startIcon={<SaveIcon />}
                                color="primary"
                            >
                            </Button>
                        </Tooltip>
                    )}
                </Stack>

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        order: 2,
                        ml: { xs: 0, md: 1 },
                    }}
                >
                    {!isMobile && (
                        <Tooltip title="Apply saved view">
                            <Select
                                labelId={`views-select-${resource}`}
                                displayEmpty
                                value={selectedView}
                                onChange={e =>
                                    applyView(e.target.value as string)
                                }
                                disabled={false}
                                size="small"
                                renderValue={(selected) => {
                                    if (!selected) {
                                        return (
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1,
                                                    minWidth: 120,
                                                }}
                                            >
                                                <ViewListIcon fontSize="small" color="primary" />
                                                <Typography variant="body2">
                                                    Default View
                                                </Typography>
                                            </Box>
                                        );
                                    }
                                    return (
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1,
                                                minWidth: 120,
                                            }}
                                        >
                                            <BookmarkIcon fontSize="small" color="primary" />
                                            <Typography variant="body2" noWrap>
                                                {selected}
                                            </Typography>
                                        </Box>
                                    );
                                }}
                                sx={{
                                    minWidth: 140,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        backgroundColor: theme.palette.background.paper,
                                        border: `1px solid ${theme.palette.divider}`,
                                        '&:hover': {
                                            borderColor: theme.palette.primary.main,
                                            backgroundColor: theme.palette.action.hover,
                                        },
                                        '&.Mui-focused': {
                                            borderColor: theme.palette.primary.main,
                                            boxShadow: `0 0 0 2px ${theme.palette.primary.main}20`,
                                        },
                                        '&.Mui-disabled': {
                                            backgroundColor: theme.palette.action.disabledBackground,
                                            opacity: 0.6,
                                        },
                                    },
                                    '& .MuiSelect-select': {
                                        py: 1,
                                        px: 1.5,
                                    },
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        border: 'none',
                                    },
                                }}
                                MenuProps={{
                                    PaperProps: {
                                        sx: {
                                            mt: 0.5,
                                            borderRadius: 2,
                                            boxShadow: `0 8px 24px ${theme.palette.primary.main}15`,
                                            border: `1px solid ${theme.palette.divider}`,
                                            maxHeight: 300,
                                        },
                                    },
                                }}
                            >
                                {/* Default View Option */}
                                <MenuItem 
                                    value="__default__"
                                    sx={{
                                        py: 1.5,
                                        px: 2,
                                        '&:hover': {
                                            backgroundColor: `${theme.palette.primary.main}10`,
                                        },
                                        '&.Mui-selected': {
                                            backgroundColor: `${theme.palette.primary.main}15`,
                                            '&:hover': {
                                                backgroundColor: `${theme.palette.primary.main}20`,
                                            },
                                        },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1.5,
                                        }}
                                    >
                                        <ViewListIcon
                                            fontSize="small"
                                            color={selectedView === '' ? "primary" : "action"}
                                        />
                                        <Typography 
                                            variant="body2"
                                            sx={{ 
                                                fontWeight: selectedView === '' ? 600 : 400,
                                                color: selectedView === '' ? 'primary.main' : 'text.primary',
                                            }}
                                        >
                                            Default View
                                        </Typography>
                                    </Box>
                                </MenuItem>
                                
                                {Object.keys(views || {}).length === 0 ? (
                                    <MenuItem value="" disabled>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1,
                                                color: 'text.secondary',
                                                py: 1,
                                            }}
                                        >
                                            <BookmarkIcon fontSize="small" />
                                            <Typography variant="body2">
                                                No saved views
                                            </Typography>
                                        </Box>
                                    </MenuItem>
                                ) : (
                                    Object.keys(views).map(name => (
                                        <MenuItem 
                                            key={name} 
                                            value={name}
                                            sx={{
                                                py: 1.5,
                                                px: 2,
                                                '&:hover': {
                                                    backgroundColor: `${theme.palette.primary.main}10`,
                                                },
                                                '&.Mui-selected': {
                                                    backgroundColor: `${theme.palette.primary.main}15`,
                                                    '&:hover': {
                                                        backgroundColor: `${theme.palette.primary.main}20`,
                                                    },
                                                },
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1.5,
                                                }}
                                            >
                                                <BookmarkIcon
                                                    fontSize="small"
                                                    color="primary"
                                                />
                                                <Typography 
                                                    variant="body2"
                                                    sx={{ 
                                                        fontWeight: selectedView === name ? 600 : 400,
                                                        color: selectedView === name ? 'primary.main' : 'text.primary',
                                                    }}
                                                >
                                                    {name}
                                                </Typography>
                                            </Box>
                                        </MenuItem>
                                    ))
                                )}
                            </Select>
                        </Tooltip>
                    )}
                </Box>
            </TopToolbar>

            <Dialog
                open={saveOpen}
                onClose={handleCancel}
                maxWidth="xs"
                fullWidth
                PaperProps={{
                    elevation: 8,
                    sx: {
                        borderRadius: 3,
                        p: 1,
                        boxShadow: `0 8px 32px ${theme.palette.primary.main}20`,
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        pb: 1,
                    }}
                >
                    <SaveIcon color="primary" />
                    <Typography variant="h6">Save Current View</Typography>
                </DialogTitle>
                <Divider />
                <DialogContent sx={{ mt: 2 }}>
                    <TextField
                        fullWidth
                        autoFocus
                        label="View name"
                        value={viewName}
                        onChange={e => setViewName(e.target.value)}
                        placeholder="e.g. Domains – Ops View"
                        variant="outlined"
                        InputProps={{
                            sx: {
                                borderRadius: 2,
                                '&:hover': {
                                    boxShadow: `0 4px 12px ${theme.palette.primary.main}15`,
                                },
                            },
                        }}
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
                    <Button
                        onClick={handleCancel}
                        variant="outlined"
                        sx={{
                            borderRadius: 2,
                            minWidth: 100,
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirm}
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
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export { ListActionsToolbar };
export default ListActionsToolbar;
