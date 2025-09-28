import {
    CheckCircle as CheckIcon,
    ContentCopy as CopyIcon,
    Dns as DnsIcon,
    Edit as EditIcon,
    MoreVert as MoreIcon,
    OpenInNew as OpenIcon,
    Refresh as RefreshIcon,
    Security as SecurityIcon,
    Share as ShareIcon,
    Visibility as VisibilityIcon,
    Warning as WarningIcon,
} from '@mui/icons-material';
import {
    Alert,
    Box,
    Divider,
    IconButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Snackbar,
    Tooltip,
} from '@mui/material';
import React, { useState } from 'react';
import { useRecordContext, useRedirect } from 'react-admin';

interface DomainQuickActionsProps {
    size?: 'small' | 'medium' | 'large';
    showLabels?: boolean;
}

export const DomainQuickActions: React.FC<DomainQuickActionsProps> = ({
    size = 'small',
    showLabels = false,
}) => {
    const record = useRecordContext();
    const redirect = useRedirect();
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

    const actions = [
        {
            id: 'open-url',
            label: 'Open Website',
            icon: <OpenIcon fontSize={size} />,
            disabled: !record.url,
            action: () => {
                if (record.url) {
                    window.open(record.url, '_blank');
                    showSnackbar('Opening website in new tab', 'info');
                } else {
                    showSnackbar(
                        'No URL configured for this domain',
                        'warning'
                    );
                }
            },
        },
        {
            id: 'edit-domain',
            label: 'Edit Domain',
            icon: <EditIcon fontSize={size} />,
            disabled: false,
            action: () => {
                redirect('edit', 'domain', record.id);
            },
        },
        {
            id: 'view-domain',
            label: 'View Domain',
            icon: <VisibilityIcon fontSize={size} />,
            disabled: false,
            action: () => {
                redirect('show', 'domain', record.id);
            },
        },

        {
            id: 'copy-domain',
            label: 'Copy Domain Name',
            icon: <CopyIcon fontSize={size} />,
            disabled: false,
            action: () => {
                navigator.clipboard
                    .writeText(record.domain)
                    .then(() => {
                        showSnackbar(
                            'Domain name copied to clipboard',
                            'success'
                        );
                    })
                    .catch(() => {
                        showSnackbar('Failed to copy domain name', 'error');
                    });
            },
        },
        {
            id: 'divider-1',
            type: 'divider',
        },
        {
            id: 'dns-check',
            label: 'Check DNS Records',
            icon: <DnsIcon fontSize={size} />,
            disabled: false,
            action: () => {
                const dnsRecords = [
                    ...(record.aRecords || []),
                    ...(record.cnameRecords || []),
                    ...(record.mxRecords || []),
                    ...(record.txtRecords || []),
                    ...(record.nsRecords || []),
                ];

                if (dnsRecords.length > 0) {
                    showSnackbar(
                        `Found ${dnsRecords.length} DNS records`,
                        'info'
                    );
                } else {
                    showSnackbar('No DNS records configured', 'warning');
                }
            },
        },
        {
            id: 'security-check',
            label: 'Security Status',
            icon: <SecurityIcon fontSize={size} />,
            disabled: false,
            action: () => {
                const hasTxtRecords =
                    record.txtRecords && record.txtRecords.length > 0;
                const hasBasicRecords =
                    (record.aRecords && record.aRecords.length > 0) ||
                    (record.cnameRecords && record.cnameRecords.length > 0);

                if (hasTxtRecords && hasBasicRecords) {
                    showSnackbar(
                        'Domain has basic security configuration',
                        'success'
                    );
                } else if (hasBasicRecords) {
                    showSnackbar(
                        'Consider adding TXT records for security',
                        'warning'
                    );
                } else {
                    showSnackbar('Domain needs DNS configuration', 'error');
                }
            },
        },
        {
            id: 'refresh-status',
            label: 'Refresh Status',
            icon: <RefreshIcon fontSize={size} />,
            disabled: false,
            action: () => {
                showSnackbar('Status refreshed', 'info');
                // In a real implementation, this would trigger a data refresh
            },
        },
        {
            id: 'divider-2',
            type: 'divider',
        },
        {
            id: 'share-domain',
            label: 'Share Domain Info',
            icon: <ShareIcon fontSize={size} />,
            disabled: false,
            action: () => {
                const shareText = `Domain: ${record.domain}\nURL: ${
                    record.url || 'Not set'
                }\nTechnology: ${record.technology || 'Not set'}`;
                navigator.clipboard
                    .writeText(shareText)
                    .then(() => {
                        showSnackbar(
                            'Domain info copied to clipboard',
                            'success'
                        );
                    })
                    .catch(() => {
                        showSnackbar('Failed to copy domain info', 'error');
                    });
            },
        },
    ];

    // Calculate domain health for quick visual feedback
    const hasUrl = Boolean(record.url);
    const hasTechnology = Boolean(record.technology);
    const hasServer = Boolean(record.serverId);
    const hasDnsRecords = Boolean(
        record.aRecords?.length ||
            record.cnameRecords?.length ||
            record.mxRecords?.length ||
            record.txtRecords?.length ||
            record.nsRecords?.length
    );

    const healthScore = [
        hasUrl,
        hasTechnology,
        hasServer,
        hasDnsRecords,
    ].filter(Boolean).length;
    const isHealthy = healthScore >= 3;

    if (showLabels) {
        // Expanded view with label buttons
        return (
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {actions
                    .filter(
                        action =>
                            action.type !== 'divider' &&
                            action.id !== 'edit-domain'
                    )
                    .slice(0, 3)
                    .map(action => (
                        <Tooltip key={action.id} title={action.label}>
                            <IconButton
                                size={size}
                                onClick={action.action}
                                disabled={action.disabled}
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
                                {action.icon}
                            </IconButton>
                        </Tooltip>
                    ))}
                <Tooltip title="More actions">
                    <IconButton
                        size={size}
                        onClick={handleMenuOpen}
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
                        <MoreIcon />
                    </IconButton>
                </Tooltip>
            </Box>
        );
    }

    // Compact view with dropdown menu
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title={`Domain health: ${healthScore}/4`}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {isHealthy ? (
                        <CheckIcon fontSize="small" color="success" />
                    ) : (
                        <WarningIcon fontSize="small" color="warning" />
                    )}
                </Box>
            </Tooltip>

            <Tooltip title="Domain actions">
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
                                handleMenuClose();
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
