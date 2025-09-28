import React, { useState } from 'react';
import { 
    ArrayInput, 
    NumberInput, 
    SimpleFormIterator, 
    TextInput,
    SelectInput,
    useNotify,
    Button,
} from 'react-admin';
import { 
    Paper, 
    Typography, 
    Box,
    Divider,
    Grid2,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Chip,
    Alert
} from '@mui/material';
import { styles } from '../styles';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useFormContext } from 'react-hook-form';
import { OrganizationServiceContractItem } from '@ci-connect/types';

interface ServiceContractItemsProps {
    contractIndex: number;
}

const ServiceContractItems: React.FC<ServiceContractItemsProps> = ({ contractIndex }) => {

    
    const { getValues, setValue } = useFormContext();
    const notify = useNotify();
    
    const contractItemTypes = [
        { id: 'PACKAGE', name: 'Package' },
        { id: 'FEATURE', name: 'Feature' },
        { id: 'ADDON', name: 'Add-on' }
    ];

    const frequencyOptions = [
        { id: 'DAILY', name: 'Daily' },
        { id: 'SEMIWEEKLY', name: 'Semi-Weekly' },
        { id: 'WEEKLY', name: 'Weekly' },
        { id: 'BIWEEKLY', name: 'Bi-Weekly' },
        { id: 'SEMIMONTHLY', name: 'Semi-Monthly' },
        { id: 'MONTHLY', name: 'Monthly' },
        { id: 'BIMONTHLY', name: 'Bi-Monthly' },
        { id: 'QUARTERLY', name: 'Quarterly' },
        { id: 'SEMIANNUALLY', name: 'Semi-Annually' },
        { id: 'ANNUALLY', name: 'Annually' }
    ];

    
    // Dialog state
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editIndex, setEditIndex] = useState(-1);

    // Format currency for display
    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(amount || 0);
    };

    // Get type label
    const getTypeLabel = (typeId: string): string => {
        const type = contractItemTypes.find(t => t.id === typeId);
        return type ? type.name : typeId;
    };

    // Get frequency label
    const getFrequencyLabel = (frequencyId: string): string => {
        const frequency = frequencyOptions.find(f => f.id === frequencyId);
        return frequency ? frequency.name : frequencyId;
    };

    // Handle dialog open for adding new item
    const handleAddItem = () => {
        setEditIndex(-1);
        setDialogOpen(true);
    };

    // Handle dialog open for editing item
    const handleEditItem = (index: number) => {
        setEditIndex(index);
        setDialogOpen(true);
    };

    // Handle dialog close
    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    // Handle item save
    const handleItemSave = () => {
        const currentItem = getValues(`organizationServiceContract[${contractIndex}].items[${editIndex}]`);
        
        if (!currentItem.name) {
            notify('Item name is required', { type: 'warning' });
            return;
        }

        const contracts = [...(getValues('organizationServiceContract') || [])];
        
        if (!contracts[contractIndex]) {
            notify('Contract not found', { type: 'error' });
            return;
        }

        const updatedItems = [...(contracts[contractIndex].items || [])];
        
        if (editIndex >= 0) {
            // Edit existing item
            updatedItems[editIndex] = currentItem;
        } else {
            // Add new item
            updatedItems.push(currentItem);
        }

        // Update the contract items
        contracts[contractIndex].items = updatedItems;
        
        // Update the form value
        setValue('organizationServiceContract', contracts);
        
        // Update local state
        setDialogOpen(false);
        notify('Contract item saved successfully', { type: 'success' });
    };

    // Handle item delete
    const handleDeleteItem = (index: number) => {
        const contracts = [...(getValues('organizationServiceContract') || [])];
        
        if (!contracts[contractIndex]) {
            notify('Contract not found', { type: 'error' });
            return;
        }

        const updatedItems = [...(contracts[contractIndex].items || [])];
        updatedItems.splice(index, 1);
        
        // Update the contract items
        contracts[contractIndex].items = updatedItems;
        
        // Update the form value
        setValue('organizationServiceContract', contracts);
        
        // Update local state
        notify('Contract item removed', { type: 'info' });
    };

    // Calculate total setup cost for an item
    const calculateSetupCost = (item: OrganizationServiceContractItem): number => {
        return (item.investmentSetup || item.investmentEa || 0)
    };

    // Calculate total recurring cost for an item
    const calculateRecurringCost = (item: OrganizationServiceContractItem): number => {
        const recurringCost = item.investmentRecurring || 0;        
        return recurringCost
    };

    return (
        <Box>
            <Box sx={styles.sectionTitle}>
                <ListAltIcon sx={styles.icon} />
                <Typography variant="subtitle1">Contract Items</Typography>
                <Box sx={{ flexGrow: 1 }} />
                <Button
                    label="Add Item"
                    onClick={handleAddItem}
                    startIcon={<AddIcon />}
                />
            </Box>
            <Typography variant="body2" color="text.secondary" paragraph>
                Add packages, features, and add-ons to this contract with their specific investment details.
            </Typography>
            <Divider sx={styles.divider} />

            <Box sx={styles.inputWrapper}>
                {getValues(`organizationServiceContract[${contractIndex}].items`)?.length > 0 ? (
                    <TableContainer component={Paper} variant="outlined">
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Item Name</TableCell>
                                    <TableCell>Type</TableCell>
                                    <TableCell>Core Service</TableCell>
                                    <TableCell align="right">Qty</TableCell>
                                    <TableCell align="right">Setup</TableCell>
                                    <TableCell align="right">Ea</TableCell>
                                    <TableCell align="right">Recurring</TableCell>
                                    <TableCell align="right">Frequency</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {getValues(`organizationServiceContract[${contractIndex}].items`)?.map((item: OrganizationServiceContractItem, index: number) => (
                                    <TableRow key={index} sx={{ 
                                        '&:nth-of-type(odd)': { backgroundColor: 'action.hover' }
                                    }}>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={getTypeLabel(item.type)} 
                                                size="small"
                                                color={
                                                    item.type === 'PACKAGE' ? 'primary' : 
                                                    item.type === 'FEATURE' ? 'secondary' : 'default'
                                                }
                                            />
                                        </TableCell>
                                        <TableCell>{item.coreServiceName || '-'}</TableCell>
                                        <TableCell align="right">{item.quantity}</TableCell>
                                        <TableCell align="right">{formatCurrency(calculateSetupCost(item))}</TableCell>
                                        <TableCell align="right">{formatCurrency(item.investmentEa || 0)}</TableCell>
                                        <TableCell align="right">{formatCurrency(calculateRecurringCost(item))}</TableCell>
                                        <TableCell align="right">{getFrequencyLabel(item.frequency)}</TableCell>
                                        <TableCell align="right">
                                            <IconButton size="small" onClick={() => handleEditItem(index)}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton size="small" onClick={() => handleDeleteItem(index)}>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Alert severity="info" sx={{ mt: 2 }}>
                        No contract items have been added yet. Click "Add Item" to add packages, features, or add-ons.
                    </Alert>
                )}
                
                {/* Hidden ArrayInput for form submission */}
                <Box sx={{ display: 'none' }}>
                    <ArrayInput source={`organizationServiceContract[${contractIndex}].items`}>
                        <SimpleFormIterator>
                            <></>
                        </SimpleFormIterator>
                    </ArrayInput>
                </Box>
            </Box>

            {/* Item Dialog */}
            <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="md" fullWidth>
                <DialogTitle>{editIndex >= 0 ? 'Edit Contract Item' : 'Add Contract Item'}</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <Grid2 container spacing={2}>
                            <Grid2 size={{ xs: 12, md: 8 }}>
                                <TextInput
                                    source={`organizationServiceContract[${contractIndex}].items[${editIndex}].name`}
                                    label="Item Name"
                                    fullWidth
                                    helperText="Name of the service item"                                   
                                />
                            </Grid2>
                            <Grid2 size={{ xs: 12, md: 4 }}>
                                <SelectInput
                                    source={`organizationServiceContract[${contractIndex}].items[${editIndex}].type`}
                                    label="Item Type"
                                    choices={contractItemTypes}
                                    fullWidth
                                    helperText="Type of service item"                                   
                                />
                            </Grid2>
                            <Grid2 size={{ xs: 12, md: 8 }}>
                                <TextInput
                                    source={`organizationServiceContract[${contractIndex}].items[${editIndex}].coreServiceName`}
                                    label="Core Service Name"
                                    fullWidth
                                    helperText="Optional: Associated core service"                                   
                                />
                            </Grid2>
                            <Grid2 size={{ xs: 12, md: 4 }}>
                                <NumberInput
                                    source={`organizationServiceContract[${contractIndex}].items[${editIndex}].quantity`}
                                    label="Quantity"
                                    min={1}
                                    fullWidth
                                    helperText="Number of units"                                   
                                />
                            </Grid2>
                            <Grid2 size={{ xs: 12 }}>
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="subtitle2" gutterBottom>Investment Details</Typography>
                            </Grid2>
                            <Grid2 size={{ xs: 12, md: 4 }}>
                                <NumberInput
                                    source={`organizationServiceContract[${contractIndex}].items[${editIndex}].investmentSetup`}
                                    label="Setup Investment"
                                    min={0}
                                    fullWidth
                                    helperText="One-time setup cost"
                                   
                                />
                            </Grid2>
                            <Grid2 size={{ xs: 12, md: 4 }}>
                                <NumberInput
                                    source={`organizationServiceContract[${contractIndex}].items[${editIndex}].investmentRecurring`}
                                    label="Recurring Investment"
                                    min={0}
                                    fullWidth
                                    helperText="Recurring cost per frequency"
                                />
                            </Grid2>
                            <Grid2 size={{ xs: 12, md: 4 }}>
                                <NumberInput
                                    source={`organizationServiceContract[${contractIndex}].items[${editIndex}].investmentEa`}
                                    label="Per-Unit Investment"
                                    min={0}
                                    fullWidth
                                    helperText="Cost per individual unit"                                   
                                />
                            </Grid2>
                            <Grid2 size={{ xs: 12, md: 6 }}>
                                <SelectInput
                                    source={`organizationServiceContract[${contractIndex}].items[${editIndex}].frequency`}
                                    label="Billing Frequency"
                                    choices={frequencyOptions}
                                    fullWidth
                                    helperText="How often this item is billed"                                   
                                />
                            </Grid2>
                        </Grid2>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button label="Cancel" onClick={handleDialogClose} />
                    <Button label="Save" onClick={handleItemSave} />
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ServiceContractItems; 