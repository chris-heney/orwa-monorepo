import React, { useState } from 'react';
import {
    IconButton,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Tooltip,
    Box,
    Divider,
    Snackbar,
    Alert,
} from '@mui/material';
import {
    MoreVert as MoreIcon,
    Edit as EditIcon,
    Visibility as ViewIcon,
    ContentCopy as CopyIcon,
    PlayArrow as ActivateIcon,
    Stop as DeactivateIcon,
    Refresh as TestIcon,
} from '@mui/icons-material';
import { useRecordContext, useRedirect, useUpdate, useNotify } from 'react-admin';

interface SubscriberQuickActionsProps {
    size?: 'small' | 'medium' | 'large';
}

export const SubscriberQuickActions: React.FC<SubscriberQuickActionsProps> = ({
    size = 'small',
}) => {
    const record = useRecordContext();
    const redirect = useRedirect();
    const [update] = useUpdate();
    const notify = useNotify();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error' | 'warning' | 'info';
    }>({
        open: false,
        message: '',
        severity: 'info',
    });

    if (!record) return null;

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
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

    const handleToggleActive = async () => {
        try {
            await update('pub-sub-subscriber', {
                id: record.id,
                data: { isActive: !record.isActive }
            });
            
            const action = record.isActive ? 'deactivated' : 'activated';
            showSnackbar(`Subscriber ${action} successfully`, 'success');
            notify(`Subscriber ${action}`, { type: 'success' });
        } catch (error) {
            showSnackbar('Failed to update subscriber status', 'error');
            notify('Failed to update subscriber', { type: 'error' });
        }
        handleMenuClose();
    };

    const handleCopyEndpoint = () => {
        if (record.endpoint) {
            navigator.clipboard
                .writeText(record.endpoint)
                .then(() => {
                    showSnackbar('Endpoint copied to clipboard', 'success');
                })
                .catch(() => {
                    showSnackbar('Failed to copy endpoint', 'error');
                });
        } else {
            showSnackbar('No endpoint to copy', 'warning');
        }
        handleMenuClose();
    };

    const handleTestSubscriber = () => {
        // In a real implementation, this would trigger a test event
        showSnackbar('Test event sent to subscriber', 'info');
        notify('Test event sent', { type: 'info' });
        handleMenuClose();
    };

    const actions = [
        {
            id: 'view',
            label: 'View Details',
            icon: <ViewIcon fontSize={size} />,
            action: () => {
                redirect('show', 'pub-sub-subscriber', record.id);
                handleMenuClose();
            },
        },
        {
            id: 'edit',
            label: 'Edit Subscriber',
            icon: <EditIcon fontSize={size} />,
            action: () => {
                redirect('edit', 'pub-sub-subscriber', record.id);
                handleMenuClose();
            },
        },
        {
            id: 'divider-1',
            type: 'divider',
        },
        {
            id: 'copy-endpoint',
            label: 'Copy Endpoint',
            icon: <CopyIcon fontSize={size} />,
            action: handleCopyEndpoint,
            disabled: !record.endpoint,
        },
        {
            id: 'test-subscriber',
            label: 'Send Test Event',
            icon: <TestIcon fontSize={size} />,
            action: handleTestSubscriber,
            disabled: !record.isActive,
        },
        {
            id: 'divider-2',
            type: 'divider',
        },
        {
            id: 'toggle-active',
            label: record.isActive ? 'Deactivate' : 'Activate',
            icon: record.isActive ? <DeactivateIcon fontSize={size} /> : <ActivateIcon fontSize={size} />,
            action: handleToggleActive,
        },
    ];

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Subscriber actions">
                <IconButton
                    size={size}
                    onClick={handleMenuOpen}
                    sx={{
                        '&:hover': {
                            backgroundColor: 'primary.light',
                            color: 'primary.main',
                        },
                    }}
                >
                    <MoreIcon />
                </IconButton>
            </Tooltip>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                onClick={(e) => e.stopPropagation()}
                slotProps={{ backdrop: { onClick: (e) => e.stopPropagation() } }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                sx={{
                    '& .MuiPaper-root': {
                        minWidth: 200,
                        boxShadow: 2,
                    },
                }}
            >
                {actions.map(action => {
                    if (action.type === 'divider') {
                        return <Divider key={action.id} sx={{ my: 1 }} />;
                    }

                    return (
                        <MenuItem
                            key={action.id}
                            onClick={(e) => {
                                e.stopPropagation();
                                action.action();
                            }}
                            disabled={action.disabled}
                            sx={{
                                py: 1,
                                '&:hover': {
                                    backgroundColor: 'primary.light',
                                },
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 36 }}>
                                {action.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={action.label}
                                primaryTypographyProps={{
                                    fontSize: '0.875rem',
                                }}
                            />
                        </MenuItem>
                    );
                })}
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
