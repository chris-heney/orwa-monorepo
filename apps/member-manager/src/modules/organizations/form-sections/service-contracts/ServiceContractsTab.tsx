import AddIcon from '@mui/icons-material/Add';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import {
    Alert,
    Box,
    Card,
    CardContent,
    CardHeader,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid2,
    IconButton,
    Tooltip,
    Typography,
} from '@mui/material';
import { useState } from 'react';
import { Button, DateInput, NumberInput, useNotify } from 'react-admin';
import { useFormContext } from 'react-hook-form';
import ContractSummary from './components/ContractSummary';
import ServiceContractItems from './components/ServiceContractItems';
import { styles } from './styles';

interface ServiceContract {
    id?: number;
    qty: number;
    oneTimeInvestment: number;
    endDate: string;
    items: any[];
    createdAt?: string;
    updatedAt?: string;
}

const ServiceContractsTab = () => {
    const { getValues, setValue } = useFormContext();
    const notify = useNotify();

    // Dialog state
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editIndex, setEditIndex] = useState(-1);

    // Format date for display
    const formatDate = (dateString: string): string => {
        if (!dateString) return 'No end date';
        try {
            return new Date(dateString).toLocaleDateString();
        } catch (e) {
            return dateString;
        }
    };

    // Format currency for display
    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
        }).format(amount || 0);
    };

    // Handle dialog open for adding new contract
    const handleAddContract = () => {
        setEditIndex(-1);

        setDialogOpen(true);
    };

    // Handle dialog open for editing contract
    const handleEditContract = (index: number) => {
        setEditIndex(index);

        setDialogOpen(true);
    };

    // Handle dialog close
    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    // Handle contract save
    const handleContractSave = () => {
        const updatedContracts = [...getValues('organizationServiceContract')];

        if (editIndex >= 0) {
            // Edit existing contract
            updatedContracts[editIndex] = getValues(
                `organizationServiceContract[${editIndex}]`
            );
        } else {
            // Add new contract
            updatedContracts.push(
                getValues(`organizationServiceContract[${editIndex}]`)
            );
        }

        setValue('organizationServiceContract', updatedContracts);

        setDialogOpen(false);
        notify('Contract saved successfully', { type: 'success' });
    };

    // Handle contract delete
    const handleDeleteContract = (index: number) => {
        const updatedContracts = [...getValues('organizationServiceContract')];
        updatedContracts.splice(index, 1);
        setValue('organizationServiceContract', updatedContracts);
        notify('Contract removed', { type: 'info' });
    };

    return (
        <Grid2
            container
            spacing={3}
            sx={{
                width: '100%',
                maxWidth: '100%',
            }}
        >
            <Grid2 size={12}>
                <Box sx={styles.highlight}>
                    <Typography variant="body1">
                        Manage service contracts for this organization,
                        including packages, features, and add-ons with their
                        respective investment details.
                    </Typography>
                </Box>
            </Grid2>

            <Grid2 size={12}>
                <Card>
                    <CardHeader
                        title={
                            <Box sx={styles.sectionTitle}>
                                <AssignmentIcon sx={styles.icon} />
                                <Typography variant="h6">
                                    Service Contracts
                                </Typography>
                            </Box>
                        }
                        action={
                            <Button
                                label="Add Contract"
                                onClick={handleAddContract}
                                startIcon={<AddIcon />}
                            />
                        }
                        subheader="Add and manage multiple service contracts for this organization."
                    />
                    <Divider />
                    <CardContent>
                        {getValues('organizationServiceContract')?.length >
                        0 ? (
                            getValues('organizationServiceContract').map(
                                (contract: ServiceContract, index: number) => (
                                    <Box key={index} sx={{ p: 3, mb: 3 }}>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                mb: 2,
                                            }}
                                        >
                                            <Box sx={styles.sectionTitle}>
                                                <ReceiptLongIcon
                                                    sx={styles.icon}
                                                />
                                                <Typography variant="subtitle1">
                                                    Contract #{index + 1}
                                                </Typography>
                                            </Box>
                                            <Box>
                                                <Tooltip title="Edit contract details">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() =>
                                                            handleEditContract(
                                                                index
                                                            )
                                                        }
                                                        sx={{ mr: 1 }}
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete contract">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() =>
                                                            handleDeleteContract(
                                                                index
                                                            )
                                                        }
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </Box>
                                        <Divider sx={styles.divider} />

                                        <Grid2
                                            container
                                            spacing={2}
                                            sx={{ mb: 3 }}
                                        >
                                            <Grid2 size={{ xs: 12, md: 4 }}>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    Quantity
                                                </Typography>
                                                <Typography variant="body1">
                                                    {contract.qty}
                                                </Typography>
                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                >
                                                    Total number of items
                                                </Typography>
                                            </Grid2>
                                            <Grid2 size={{ xs: 12, md: 4 }}>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    One-Time Investment
                                                </Typography>
                                                <Typography variant="body1">
                                                    {formatCurrency(
                                                        contract.oneTimeInvestment
                                                    )}
                                                </Typography>
                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                >
                                                    Total one-time investment
                                                    amount
                                                </Typography>
                                            </Grid2>
                                            <Grid2 size={{ xs: 12, md: 4 }}>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    End Date
                                                </Typography>
                                                <Typography variant="body1">
                                                    {formatDate(
                                                        contract.endDate
                                                    )}
                                                </Typography>
                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                >
                                                    When this contract expires
                                                </Typography>
                                            </Grid2>
                                        </Grid2>

                                        <Grid2 container spacing={3}>
                                            <Grid2 size={{ xs: 12, md: 8 }}>
                                                <ServiceContractItems
                                                    contractIndex={index}
                                                />
                                            </Grid2>
                                            <Grid2 size={{ xs: 12, md: 4 }}>
                                                <ContractSummary
                                                    contractIndex={index}
                                                />
                                            </Grid2>
                                        </Grid2>
                                    </Box>
                                )
                            )
                        ) : (
                            <Alert severity="info" sx={{ mt: 2 }}>
                                No service contracts have been added yet. Click
                                "Add Contract" to create a new service contract.
                            </Alert>
                        )}
                    </CardContent>
                </Card>
            </Grid2>

            {/* Contract Dialog */}
            <Dialog
                open={dialogOpen}
                onClose={handleDialogClose}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    {editIndex >= 0 ? 'Edit Contract' : 'Add Contract'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <Grid2 container spacing={2}>
                            <Grid2 size={{ xs: 12, md: 4 }}>
                                <NumberInput
                                    source={`organizationServiceContract[${editIndex}].qty`}
                                    label="Quantity"
                                    helperText="Total number of items"
                                    min={1}
                                    fullWidth
                                />
                            </Grid2>
                            <Grid2 size={{ xs: 12, md: 4 }}>
                                <NumberInput
                                    source={`organizationServiceContract[${editIndex}].oneTimeInvestment`}
                                    label="One-Time Investment"
                                    helperText="Total one-time investment amount"
                                    min={0}
                                    fullWidth
                                />
                            </Grid2>
                            <Grid2 size={{ xs: 12, md: 4 }}>
                                <DateInput
                                    source={`organizationServiceContract[${editIndex}].endDate`}
                                    label="End Date"
                                    helperText="When this contract expires"
                                    fullWidth
                                />
                            </Grid2>
                        </Grid2>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button label="Cancel" onClick={handleDialogClose} />
                    <Button label="Save" onClick={handleContractSave} />
                </DialogActions>
            </Dialog>
        </Grid2>
    );
};

export default ServiceContractsTab;
