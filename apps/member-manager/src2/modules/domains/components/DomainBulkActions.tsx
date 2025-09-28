import {
    CheckCircle as CheckIcon,
    Close as CloseIcon,
    Delete as DeleteIcon,
    Dns as DnsIcon,
    Edit as EditIcon,
    FileDownload as ExportIcon,
    Warning as WarningIcon,
} from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    Checkbox,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    IconButton,
    InputLabel,
    LinearProgress,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useListContext, useNotify, useRefresh } from 'react-admin';

interface BulkActionDialogProps {
    open: boolean;
    onClose: () => void;
    selectedIds: any[];
    actionType: 'edit' | 'delete' | 'export' | 'dns';
    records: any[];
}

const BulkActionDialog: React.FC<BulkActionDialogProps> = ({
    open,
    onClose,
    selectedIds,
    actionType,
    records,
}) => {
    const [processing, setProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [bulkEditData, setBulkEditData] = useState({
        technology: '',
        updateTechnology: false,
        hostingProviderId: '',
        updateHostingProvider: false,
        serverId: '',
        updateServer: false,
    });
    const [dnsAction, setDnsAction] = useState('');
    const [dnsRecordValue, setDnsRecordValue] = useState('');
    const notify = useNotify();
    const refresh = useRefresh();

    const selectedRecords = records.filter(record =>
        selectedIds.includes(record.id)
    );

    const handleBulkEdit = async () => {
        setProcessing(true);
        setProgress(0);

        try {
            const updateData: any = {};
            if (bulkEditData.updateTechnology)
                updateData.technology = bulkEditData.technology;
            if (bulkEditData.updateHostingProvider)
                updateData.hostingProviderId = bulkEditData.hostingProviderId;
            if (bulkEditData.updateServer)
                updateData.serverId = bulkEditData.serverId;

            // Simulate API calls with progress
            for (let i = 0; i < selectedIds.length; i++) {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 200));
                setProgress(((i + 1) / selectedIds.length) * 100);
            }

            notify(`Successfully updated ${selectedIds.length} domains`, {
                type: 'success',
            });
            refresh();
            onClose();
        } catch (error) {
            notify('Error updating domains', { type: 'error' });
        } finally {
            setProcessing(false);
        }
    };

    const handleBulkDelete = async () => {
        setProcessing(true);
        setProgress(0);

        try {
            // Simulate API calls with progress
            for (let i = 0; i < selectedIds.length; i++) {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 300));
                setProgress(((i + 1) / selectedIds.length) * 100);
            }

            notify(`Successfully deleted ${selectedIds.length} domains`, {
                type: 'success',
            });
            refresh();
            onClose();
        } catch (error) {
            notify('Error deleting domains', { type: 'error' });
        } finally {
            setProcessing(false);
        }
    };

    const handleBulkExport = async () => {
        setProcessing(true);
        setProgress(0);

        try {
            // Simulate export preparation
            for (let i = 0; i < selectedIds.length; i++) {
                await new Promise(resolve => setTimeout(resolve, 100));
                setProgress(((i + 1) / selectedIds.length) * 100);
            }

            // Create CSV content
            const csvContent = [
                'Domain,URL,Technology,Hosting Provider,Server,DNS Records Count',
                ...selectedRecords.map(record =>
                    [
                        record.domain,
                        record.url || '',
                        record.technology || '',
                        record.hostingProvider?.name || '',
                        record.server?.name || '',
                        (record.aRecords?.length || 0) +
                            (record.cnameRecords?.length || 0) +
                            (record.mxRecords?.length || 0) +
                            (record.txtRecords?.length || 0) +
                            (record.nsRecords?.length || 0),
                    ].join(',')
                ),
            ].join('\n');

            // Download CSV
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `domains_export_${
                new Date().toISOString().split('T')[0]
            }.csv`;
            a.click();
            window.URL.revokeObjectURL(url);

            notify(`Successfully exported ${selectedIds.length} domains`, {
                type: 'success',
            });
            onClose();
        } catch (error) {
            notify('Error exporting domains', { type: 'error' });
        } finally {
            setProcessing(false);
        }
    };

    const handleBulkDns = async () => {
        setProcessing(true);
        setProgress(0);

        try {
            // Simulate DNS operations
            for (let i = 0; i < selectedIds.length; i++) {
                await new Promise(resolve => setTimeout(resolve, 250));
                setProgress(((i + 1) / selectedIds.length) * 100);
            }

            notify(
                `Successfully performed DNS action on ${selectedIds.length} domains`,
                { type: 'success' }
            );
            refresh();
            onClose();
        } catch (error) {
            notify('Error performing DNS action', { type: 'error' });
        } finally {
            setProcessing(false);
        }
    };

    const getDialogTitle = () => {
        switch (actionType) {
            case 'edit':
                return 'Bulk Edit Domains';
            case 'delete':
                return 'Bulk Delete Domains';
            case 'export':
                return 'Export Domains';
            case 'dns':
                return 'Bulk DNS Operations';
            default:
                return 'Bulk Action';
        }
    };

    const getDialogContent = () => {
        switch (actionType) {
            case 'edit':
                return (
                    <Box sx={{ minWidth: 500 }}>
                        <Alert severity="info" sx={{ mb: 2 }}>
                            Select which fields to update for{' '}
                            {selectedIds.length} selected domains
                        </Alert>

                        <Stack spacing={2}>
                            <Box>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={
                                                bulkEditData.updateTechnology
                                            }
                                            onChange={e =>
                                                setBulkEditData({
                                                    ...bulkEditData,
                                                    updateTechnology:
                                                        e.target.checked,
                                                })
                                            }
                                        />
                                    }
                                    label="Update Technology"
                                />
                                {bulkEditData.updateTechnology && (
                                    <FormControl fullWidth sx={{ mt: 1 }}>
                                        <InputLabel>Technology</InputLabel>
                                        <Select
                                            value={bulkEditData.technology}
                                            onChange={e =>
                                                setBulkEditData({
                                                    ...bulkEditData,
                                                    technology: e.target.value,
                                                })
                                            }
                                        >
                                            <MenuItem value="WordPress">
                                                WordPress
                                            </MenuItem>
                                            <MenuItem value="Webflow">
                                                Webflow
                                            </MenuItem>
                                            <MenuItem value="Static">
                                                Static HTML
                                            </MenuItem>
                                            <MenuItem value="React">
                                                React
                                            </MenuItem>
                                            <MenuItem value="Vue">
                                                Vue.js
                                            </MenuItem>
                                            <MenuItem value="Angular">
                                                Angular
                                            </MenuItem>
                                            <MenuItem value="Other">
                                                Other
                                            </MenuItem>
                                        </Select>
                                    </FormControl>
                                )}
                            </Box>

                            <Box>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={
                                                bulkEditData.updateHostingProvider
                                            }
                                            onChange={e =>
                                                setBulkEditData({
                                                    ...bulkEditData,
                                                    updateHostingProvider:
                                                        e.target.checked,
                                                })
                                            }
                                        />
                                    }
                                    label="Update Hosting Provider"
                                />
                                {bulkEditData.updateHostingProvider && (
                                    <TextField
                                        fullWidth
                                        label="Hosting Provider ID"
                                        value={bulkEditData.hostingProviderId}
                                        onChange={e =>
                                            setBulkEditData({
                                                ...bulkEditData,
                                                hostingProviderId:
                                                    e.target.value,
                                            })
                                        }
                                        sx={{ mt: 1 }}
                                    />
                                )}
                            </Box>

                            <Box>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={bulkEditData.updateServer}
                                            onChange={e =>
                                                setBulkEditData({
                                                    ...bulkEditData,
                                                    updateServer:
                                                        e.target.checked,
                                                })
                                            }
                                        />
                                    }
                                    label="Update Server"
                                />
                                {bulkEditData.updateServer && (
                                    <TextField
                                        fullWidth
                                        label="Server ID"
                                        value={bulkEditData.serverId}
                                        onChange={e =>
                                            setBulkEditData({
                                                ...bulkEditData,
                                                serverId: e.target.value,
                                            })
                                        }
                                        sx={{ mt: 1 }}
                                    />
                                )}
                            </Box>
                        </Stack>
                    </Box>
                );

            case 'delete':
                return (
                    <Box>
                        <Alert severity="warning" sx={{ mb: 2 }}>
                            This will permanently delete {selectedIds.length}{' '}
                            domains. This action cannot be undone.
                        </Alert>

                        <Typography variant="h6" gutterBottom>
                            Domains to be deleted:
                        </Typography>

                        <List dense sx={{ maxHeight: 200, overflow: 'auto' }}>
                            {selectedRecords.map(record => (
                                <ListItem key={record.id}>
                                    <ListItemIcon>
                                        <WarningIcon color="warning" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={record.domain}
                                        secondary={record.url || 'No URL'}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                );

            case 'export':
                return (
                    <Box>
                        <Alert severity="info" sx={{ mb: 2 }}>
                            Export {selectedIds.length} domains to CSV format
                        </Alert>

                        <Typography variant="body2" color="text.secondary">
                            The export will include: Domain name, URL,
                            Technology, Hosting Provider, Server, and DNS
                            Records count.
                        </Typography>

                        <List
                            dense
                            sx={{ mt: 2, maxHeight: 200, overflow: 'auto' }}
                        >
                            {selectedRecords.map(record => (
                                <ListItem key={record.id}>
                                    <ListItemIcon>
                                        <CheckIcon color="success" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={record.domain}
                                        secondary={
                                            record.technology ||
                                            'No technology set'
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                );

            case 'dns':
                return (
                    <Box sx={{ minWidth: 500 }}>
                        <Alert severity="info" sx={{ mb: 2 }}>
                            Perform DNS operations on {selectedIds.length}{' '}
                            selected domains
                        </Alert>

                        <Stack spacing={2}>
                            <FormControl fullWidth>
                                <InputLabel>DNS Action</InputLabel>
                                <Select
                                    value={dnsAction}
                                    onChange={e => setDnsAction(e.target.value)}
                                >
                                    <MenuItem value="add-a">
                                        Add A Record
                                    </MenuItem>
                                    <MenuItem value="add-cname">
                                        Add CNAME Record
                                    </MenuItem>
                                    <MenuItem value="add-mx">
                                        Add MX Record
                                    </MenuItem>
                                    <MenuItem value="add-txt">
                                        Add TXT Record
                                    </MenuItem>
                                    <MenuItem value="clear-all">
                                        Clear All Records
                                    </MenuItem>
                                </Select>
                            </FormControl>

                            {dnsAction && !dnsAction.includes('clear') && (
                                <TextField
                                    fullWidth
                                    label="Record Value"
                                    value={dnsRecordValue}
                                    onChange={e =>
                                        setDnsRecordValue(e.target.value)
                                    }
                                    placeholder="Enter the DNS record value"
                                />
                            )}
                        </Stack>
                    </Box>
                );

            default:
                return null;
        }
    };

    const getActionButton = () => {
        switch (actionType) {
            case 'edit':
                return (
                    <Button
                        onClick={handleBulkEdit}
                        disabled={processing}
                        variant="contained"
                        startIcon={<EditIcon />}
                    >
                        {processing ? 'Updating...' : 'Update Domains'}
                    </Button>
                );
            case 'delete':
                return (
                    <Button
                        onClick={handleBulkDelete}
                        disabled={processing}
                        variant="contained"
                        color="error"
                        startIcon={<DeleteIcon />}
                    >
                        {processing ? 'Deleting...' : 'Delete Domains'}
                    </Button>
                );
            case 'export':
                return (
                    <Button
                        onClick={handleBulkExport}
                        disabled={processing}
                        variant="contained"
                        startIcon={<ExportIcon />}
                    >
                        {processing ? 'Exporting...' : 'Export Domains'}
                    </Button>
                );
            case 'dns':
                return (
                    <Button
                        onClick={handleBulkDns}
                        disabled={processing || !dnsAction}
                        variant="contained"
                        startIcon={<DnsIcon />}
                    >
                        {processing ? 'Processing...' : 'Apply DNS Changes'}
                    </Button>
                );
            default:
                return null;
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <Typography variant="h6">{getDialogTitle()}</Typography>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                {getDialogContent()}

                {processing && (
                    <Box sx={{ mt: 2 }}>
                        <LinearProgress
                            variant="determinate"
                            value={progress}
                        />
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            Processing... {Math.round(progress)}%
                        </Typography>
                    </Box>
                )}
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} disabled={processing}>
                    Cancel
                </Button>
                {getActionButton()}
            </DialogActions>
        </Dialog>
    );
};

export const DomainBulkActions: React.FC = () => {
    const { selectedIds, data } = useListContext();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [actionType, setActionType] = useState<
        'edit' | 'delete' | 'export' | 'dns'
    >('edit');

    if (!selectedIds || selectedIds.length === 0) {
        return null;
    }

    const handleActionClick = (type: 'edit' | 'delete' | 'export' | 'dns') => {
        setActionType(type);
        setDialogOpen(true);
    };

    return (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', p: 1 }}>
            <Chip
                label={`${selectedIds.length} selected`}
                color="primary"
                size="small"
                variant="outlined"
            />

            <Button
                size="small"
                startIcon={<EditIcon />}
                onClick={() => handleActionClick('edit')}
            >
                Edit
            </Button>

            <Button
                size="small"
                startIcon={<DnsIcon />}
                onClick={() => handleActionClick('dns')}
            >
                DNS
            </Button>

            <Button
                size="small"
                startIcon={<ExportIcon />}
                onClick={() => handleActionClick('export')}
            >
                Export
            </Button>

            <Button
                size="small"
                startIcon={<DeleteIcon />}
                onClick={() => handleActionClick('delete')}
                color="error"
            >
                Delete
            </Button>

            <BulkActionDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                selectedIds={selectedIds}
                actionType={actionType}
                records={data || []}
            />
        </Box>
    );
};
