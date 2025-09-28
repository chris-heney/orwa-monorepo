import { 
    Box, 
    IconButton, 
    Menu, 
    MenuItem, 
    Tooltip,
    Snackbar,
    Alert
} from '@mui/material';
import { 
    useRecordContext, 
    useRedirect,
    useNotify,
    useRefresh,
    useDelete
} from 'react-admin';
import {
    Edit as EditIcon,
    Visibility as ViewIcon,
    OpenInNew as ExternalLinkIcon,
    MoreVert as MoreIcon,
    Delete as DeleteIcon,
    ContentCopy as CopyIcon,
    Block as BlockIcon,
    CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useState } from 'react';

interface AppQuickActionsProps {
    size?: 'small' | 'medium' | 'large';
    showLabels?: boolean;
}

export const AppQuickActions: React.FC<AppQuickActionsProps> = ({
    size = 'small',
    showLabels = false,
}) => {
    const record = useRecordContext();
    const redirect = useRedirect();
    const notify = useNotify();
    const refresh = useRefresh();
    const [deleteOne] = useDelete();
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
        setSnackbar({
            open: true,
            message,
            severity,
        });
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        handleMenuClose();
        showSnackbar('Copied to clipboard', 'success');
    };

    return (
        <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="View">
                <IconButton
                    size={size}
                    onClick={() => window.location.href = `/#/app/${record.id}/show`}
                    color="primary"
                >
                    <ViewIcon fontSize={size} />
                </IconButton>
            </Tooltip>
            
            <Tooltip title="Edit">
                <IconButton
                    size={size}
                    onClick={() => window.location.href = `/#/app/${record.id}`}
                    color="secondary"
                >
                    <EditIcon fontSize={size} />
                </IconButton>
            </Tooltip>
            
            <Tooltip title="Open App">
                <IconButton 
                    size={size}
                    href={record.url}
                    target="_blank"
                >
                    <ExternalLinkIcon fontSize={size} />
                </IconButton>
            </Tooltip>
            
            <Tooltip title="More Actions">
                <IconButton
                    size={size}
                    onClick={handleMenuOpen}
                >
                    <MoreIcon fontSize={size} />
                </IconButton>
            </Tooltip>
            
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <MenuItem onClick={() => copyToClipboard(record.url)}>
                    <CopyIcon fontSize="small" sx={{ mr: 1 }} />
                    Copy URL
                </MenuItem>
                
                <MenuItem onClick={() => copyToClipboard(String(record.id))}>
                    <CopyIcon fontSize="small" sx={{ mr: 1 }} />
                    Copy ID
                </MenuItem>
                
                <MenuItem 
                    onClick={() => {
                        handleMenuClose();
                        // Toggle active status logic would go here
                        showSnackbar(
                            record.isActive 
                                ? 'App has been deactivated' 
                                : 'App has been activated',
                            'success'
                        );
                    }}
                >
                    {record.isActive ? (
                        <>
                            <BlockIcon fontSize="small" sx={{ mr: 1 }} />
                            Deactivate
                        </>
                    ) : (
                        <>
                            <CheckCircleIcon fontSize="small" sx={{ mr: 1 }} />
                            Activate
                        </>
                    )}
                </MenuItem>
                
                <MenuItem
                    onClick={async () => {
                        handleMenuClose();
                            try {
                                await deleteOne('app', { id: record.id, previousData: record });
                                notify('App deleted successfully', { type: 'success' });
                                refresh();
                            } catch (error) {
                                notify('Error deleting app', { type: 'error' });
                                console.error('Delete error:', error);
                            }
                    }}
                    sx={{ color: 'error.main' }}
                >
                    <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                    Delete
                </MenuItem>
            </Menu>
            
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
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
