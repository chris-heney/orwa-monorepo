import {
    PlaylistPlay as DeckIcon,
    Link as LinkIcon,
    Launch as LaunchIcon,
    Check as CheckIcon,
} from '@mui/icons-material';
import {
    Alert,
    Box,
    IconButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Snackbar,
    Tooltip,
    Typography,
    Chip,
    Switch,
    FormControlLabel,
} from '@mui/material';
import React, { useState } from 'react';
import { useRecordContext, useGetList } from 'react-admin';

interface OrganizationListActionsProps {
    size?: 'small' | 'medium' | 'large';
    showLabels?: boolean;
}

const OrganizationListActions: React.FC<OrganizationListActionsProps> = ({
    size = 'small',
    showLabels = false,
}) => {
    const record = useRecordContext();
    const [deckMenuAnchorEl, setDeckMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [copyMode, setCopyMode] = useState(true); // true for copy, false for open in new window
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error' | 'warning' | 'info';
    }>({
        open: false,
        message: '',
        severity: 'info',
    });

    // Fetch deck data
    const { data: decks, isLoading: decksLoading } = useGetList('onboarding-deck', {
        pagination: { page: 1, perPage: 100 },
        sort: { field: 'name', order: 'ASC' },
        filter: { isActive: true },
    });

    if (!record) return null;

    const handleDeckMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setDeckMenuAnchorEl(event.currentTarget);
    };

    const handleDeckMenuClose = () => {
        setDeckMenuAnchorEl(null);
    };

    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const showSnackbar = (
        message: string,
        severity: 'success' | 'error' | 'warning' | 'info'
    ) => {
        setSnackbar({ open: true, message, severity });
    };

    // Get the last deck used from onboard saved state
    const getLastDeckUsed = () => {
        try {
            const savedState = record.onboardSavedStoreState;
            return savedState?.lastDeckUsed || null;
        } catch {
            return null;
        }
    };

    // Generate onboard link
    const generateOnboardLink = (deckId: number) => {
        if (window.location.hostname === 'localhost') {
            return `http://localhost:5173/?deckId=${deckId}&organizationId=${record.id}`;
        }
        return `https://onboard.ciwebgroup.com/?deckId=${deckId}&organizationId=${record.id}`;
    };

    // Handle deck selection
    const handleDeckAction = (deckId: number) => {
        const link = generateOnboardLink(deckId);
        
        if (copyMode) {
            navigator.clipboard
                .writeText(link)
                .then(() => {
                    showSnackbar('Onboard link copied to clipboard', 'success');
                })
                .catch(() => {
                    showSnackbar('Failed to copy link', 'error');
                });
        } else {
            window.open(link, '_blank');
            showSnackbar('Opening onboard link in new window', 'info');
        }
        
        handleDeckMenuClose();
    };
    
    // Only deck actions - simplified
    const deckAction = {
        id: 'onboard-decks',
        label: 'Onboard Decks',
        icon: <DeckIcon fontSize={size} />,
        disabled: decksLoading || !decks || decks.length === 0,
        action: (event?: React.MouseEvent<HTMLElement>) => handleDeckMenuOpen(event!),
    };

    if (showLabels) {
        // Expanded view with deck button only
        return (
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Tooltip title={deckAction.label}>
                    <IconButton
                        size={size}
                        onClick={(event) => {
                            event.stopPropagation();
                            deckAction.action(event);
                        }}
                        disabled={deckAction.disabled}
                        sx={{
                            border: 1,
                            borderColor: 'divider',
                            borderRadius: 1,
                            '&:hover': {
                                borderColor: 'primary.main',
                                backgroundColor: 'primary.main',
                                color: 'white',
                            },
                        }}
                    >
                        {deckAction.icon}
                    </IconButton>
                </Tooltip>
            </Box>
        );
    }

    // Compact view with deck button only
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title={deckAction.label}>
                <IconButton
                    size={size}
                    onClick={(event) => {
                        event.stopPropagation();
                        deckAction.action(event);
                    }}
                    disabled={deckAction.disabled}
                    sx={{
                        '&:hover': {
                            backgroundColor: 'primary.light',
                            color: 'primary.main',
                        },
                    }}
                >
                    <DeckIcon />
                </IconButton>
            </Tooltip>

            {/* Deck Selection Submenu */}
            <Menu
                anchorEl={deckMenuAnchorEl}
                open={Boolean(deckMenuAnchorEl)}
                onClose={handleDeckMenuClose}
                onClick={(e) => e.stopPropagation()}
                slotProps={{ backdrop: { onClick: (e) => e.stopPropagation() } }}
                transformOrigin={{ horizontal: 'left', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                sx={{
                    '& .MuiPaper-root': {
                        minWidth: 300,
                        maxHeight: 400,
                        boxShadow: 2,
                    },
                }}
            >
                {/* Header with toggle */}
                <MenuItem sx={{ opacity: 1, borderBottom: 1, borderColor: 'divider' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        <Typography variant="subtitle2" fontWeight={600}>
                            Select Onboard Deck
                        </Typography>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={!copyMode}
                                    onChange={(e) => setCopyMode(!e.target.checked)}
                                    size="small"
                                />
                            }
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    {copyMode ? <LinkIcon fontSize="small" /> : <LaunchIcon fontSize="small" />}
                                    <Typography variant="caption">
                                        {copyMode ? 'Copy' : 'Open'}
                                    </Typography>
                                </Box>
                            }
                            sx={{ margin: 0 }}
                        />
                    </Box>
                </MenuItem>

                {/* Deck list */}
                {decksLoading ? (
                    <MenuItem disabled>
                        <Typography variant="body2">Loading decks...</Typography>
                    </MenuItem>
                ) : !decks || decks.length === 0 ? (
                    <MenuItem disabled>
                        <Typography variant="body2">No active decks available</Typography>
                    </MenuItem>
                ) : (
                    decks.map((deck: any) => {
                        const lastDeckUsed = getLastDeckUsed();
                        const isUsedDeck = lastDeckUsed === deck.id;
                        
                        return (
                            <MenuItem
                                key={deck.id}
                                onClick={() => handleDeckAction(deck.id)}
                                sx={{
                                    py: 1.5,
                                    '&:hover': {
                                        backgroundColor: 'primary.light',
                                    },
                                    backgroundColor: isUsedDeck ? 'action.selected' : 'transparent',
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 36 }}>
                                    <DeckIcon color={isUsedDeck ? 'primary' : 'inherit'} />
                                </ListItemIcon>
                                <ListItemText
                                    primary={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Typography variant="body2" fontWeight={isUsedDeck ? 600 : 400}>
                                                {deck.name}
                                            </Typography>
                                            {isUsedDeck && (
                                                <Chip
                                                    label="Last Used"
                                                    size="small"
                                                    color="primary"
                                                    variant="outlined"
                                                    icon={<CheckIcon />}
                                                    sx={{ height: 20, fontSize: '0.7rem' }}
                                                />
                                            )}
                                        </Box>
                                    }
                                    secondary={deck.description}
                                    secondaryTypographyProps={{
                                        fontSize: '0.75rem',
                                        color: 'text.secondary',
                                    }}
                                />
                            </MenuItem>
                        );
                    })
                )}
            </Menu>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default OrganizationListActions;