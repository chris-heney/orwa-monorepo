import AddIcon from '@mui/icons-material/Add';
import BuildIcon from '@mui/icons-material/Build';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import HandymanIcon from '@mui/icons-material/Handyman';
import {
    Alert,
    Box,
    Card,
    CardContent,
    CardHeader,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControlLabel,
    Grid2,
    IconButton,
    Paper,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import {
    ArrayInput,
    AutocompleteInput,
    Button,
    ReferenceArrayInput,
    ReferenceInput,
    required,
    SelectArrayInput,
    useGetList,
    useNotify,
} from 'react-admin';
import { useFormContext } from 'react-hook-form';

// Define interfaces for our data structures
interface ServiceItem {
    serviceId: number | null;
    serviceContextId: number | null;
    isActive: boolean;
}

interface ServiceData {
    id: number;
    name: string;
}

interface ServiceContextData {
    id: number;
    name: string;
}

interface DialogFormValues {
    serviceId?: number;
    serviceContextId?: number;
    isActive: boolean;
}

const TradeServicesTab = () => {
    const { setValue, getValues, watch } = useFormContext();
    const notify = useNotify();

    // State for services data
    const [services, setServices] = useState<ServiceItem[]>(
        getValues('services') || []
    );
    const [trades, setTrades] = useState<number[]>(getValues('trades') || []);

    // Dialog state
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editIndex, setEditIndex] = useState(-1);
    const [dialogFormValues, setDialogFormValues] = useState<DialogFormValues>({
        serviceId: undefined,
        serviceContextId: undefined,
        isActive: true,
    });

    // Fetch services data
    const { data: servicesData, isLoading: servicesLoading } =
        useGetList<ServiceData>('service', {
            pagination: { page: 1, perPage: 100 },
            sort: { field: 'name', order: 'ASC' },
        });

    // Fetch service contexts data
    const { data: serviceContextsData, isLoading: serviceContextsLoading } =
        useGetList<ServiceContextData>('serviceContext', {
            pagination: { page: 1, perPage: 100 },
            sort: { field: 'name', order: 'ASC' },
        });

    // Watch for changes in the form values
    const servicesWatch = watch('services');
    const tradesWatch = watch('trades');

    useEffect(() => {
        if (servicesWatch) {
            setServices(servicesWatch);
        }
    }, [servicesWatch]);

    useEffect(() => {
        if (tradesWatch) {
            setTrades(tradesWatch);
        }
    }, [tradesWatch]);

    // Get service and service context names by ID
    const getServiceName = (id: number | null): string => {
        if (!servicesData || !id) return 'Loading...';
        const service = servicesData.find(s => s.id === id);
        return service ? service.name : 'Unknown Service';
    };

    const getServiceContextName = (id: number | null): string => {
        if (!serviceContextsData || !id) return 'Loading...';
        const context = serviceContextsData.find(c => c.id === id);
        return context ? context.name : 'Unknown Context';
    };

    // Handle dialog open for adding new service
    const handleAddService = () => {
        setEditIndex(-1);
        setDialogFormValues({
            serviceId: undefined,
            serviceContextId: undefined,
            isActive: true,
        });
        setDialogOpen(true);
    };

    // Handle dialog open for editing service
    const handleEditService = (index: number) => {
        setEditIndex(index);
        const serviceToEdit = services[index];
        setDialogFormValues({
            serviceId: serviceToEdit.serviceId || undefined,
            serviceContextId: serviceToEdit.serviceContextId || undefined,
            isActive: serviceToEdit.isActive,
        });
        setDialogOpen(true);
    };

    // Handle dialog close
    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    // Handle service save
    const handleServiceSave = () => {
        if (!dialogFormValues.serviceId || !dialogFormValues.serviceContextId) {
            notify('Service and Context are required', { type: 'warning' });
            return;
        }

        const serviceItem: ServiceItem = {
            serviceId: dialogFormValues.serviceId,
            serviceContextId: dialogFormValues.serviceContextId,
            isActive: dialogFormValues.isActive,
        };

        const updatedServices = [...services];

        if (editIndex >= 0) {
            // Edit existing service
            updatedServices[editIndex] = serviceItem;
        } else {
            // Add new service
            updatedServices.push(serviceItem);
        }

        setValue('services', updatedServices);
        setServices(updatedServices);
        setDialogOpen(false);
        notify('Service saved successfully', { type: 'success' });
    };

    // Handle service delete
    const handleDeleteService = (index: number) => {
        const updatedServices = [...services];
        updatedServices.splice(index, 1);
        setValue('services', updatedServices);
        setServices(updatedServices);
        notify('Service removed', { type: 'info' });
    };

    // Handle toggle service active status
    const handleToggleActive = (index: number) => {
        const updatedServices = [...services];
        updatedServices[index].isActive = !updatedServices[index].isActive;
        setValue('services', updatedServices);
        setServices(updatedServices);
    };

    const isLoading = servicesLoading || serviceContextsLoading;

    // TODO: Add a way to add a new trade
    // ADD validation to adding a new service
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
                <Paper sx={{ p: 3, mb: 3 }}>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 2,
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <HandymanIcon
                                sx={{ mr: 1, color: 'primary.main' }}
                            />
                            <Typography variant="h6">Trades</Typography>
                        </Box>
                        <Tooltip title="Select trades that this organization specializes in">
                            <Typography variant="body2" color="text.secondary">
                                {trades?.length || 0} trades selected
                            </Typography>
                        </Tooltip>
                    </Box>

                    <ReferenceArrayInput source="trades" reference="trade">
                        <SelectArrayInput optionText="name" fullWidth />
                    </ReferenceArrayInput>
                </Paper>
            </Grid2>

            <Grid2 size={12}>
                <Card>
                    <CardHeader
                        title={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <BuildIcon
                                    sx={{ mr: 1, color: 'primary.main' }}
                                />
                                <Typography variant="h6">Services</Typography>
                            </Box>
                        }
                        action={
                            <Button
                                label="Add Service"
                                onClick={handleAddService}
                                disabled={isLoading}
                                startIcon={<AddIcon />}
                            />
                        }
                    />
                    <Divider />
                    <CardContent>
                        {services?.length > 0 ? (
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Service</TableCell>
                                            <TableCell>Context</TableCell>
                                            <TableCell align="center">
                                                Status
                                            </TableCell>
                                            <TableCell align="right">
                                                Actions
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {services.map(
                                            (
                                                service: ServiceItem,
                                                index: number
                                            ) => (
                                                <TableRow
                                                    key={index}
                                                    sx={{
                                                        '&:nth-of-type(odd)': {
                                                            backgroundColor:
                                                                'action.hover',
                                                        },
                                                        opacity:
                                                            service.isActive
                                                                ? 1
                                                                : 0.6,
                                                    }}
                                                >
                                                    <TableCell>
                                                        {getServiceName(
                                                            service.serviceId
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {getServiceContextName(
                                                            service.serviceContextId
                                                        )}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Chip
                                                            label={
                                                                service.isActive
                                                                    ? 'Active'
                                                                    : 'Inactive'
                                                            }
                                                            color={
                                                                service.isActive
                                                                    ? 'success'
                                                                    : 'default'
                                                            }
                                                            size="small"
                                                            onClick={() =>
                                                                handleToggleActive(
                                                                    index
                                                                )
                                                            }
                                                        />
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() =>
                                                                handleEditService(
                                                                    index
                                                                )
                                                            }
                                                        >
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() =>
                                                                handleDeleteService(
                                                                    index
                                                                )
                                                            }
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : (
                            <Alert severity="info" sx={{ mt: 2 }}>
                                No services have been added yet. Click "Add
                                Service" to add services for this organization.
                            </Alert>
                        )}

                        {/* Hidden ArrayInput for form submission */}
                        <Box sx={{ display: 'none' }}>
                            <ArrayInput source="services">
                                <></>
                            </ArrayInput>
                        </Box>
                    </CardContent>
                </Card>
            </Grid2>

            {/* Service Dialog */}
            <Dialog
                open={dialogOpen}
                onClose={handleDialogClose}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    {editIndex >= 0 ? 'Edit Service' : 'Add Service'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 1 }}>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" gutterBottom>
                                Service
                            </Typography>
                            <ReferenceInput
                                source={`services[${editIndex}].serviceId`}
                                reference="service"
                            >
                                <AutocompleteInput
                                    optionText="name"
                                    fullWidth
                                    label="Select Service"
                                    validate={[required()]}
                                    defaultValue={dialogFormValues.serviceId}
                                    onChange={value => {
                                        if (value) {
                                            setDialogFormValues({
                                                ...dialogFormValues,
                                                serviceId: value as number,
                                            });
                                        }
                                    }}
                                />
                            </ReferenceInput>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" gutterBottom>
                                Service Context
                            </Typography>
                            <ReferenceInput
                                source={`services[${editIndex}].serviceContextId`}
                                reference="serviceContext"
                            >
                                <AutocompleteInput
                                    optionText="name"
                                    fullWidth
                                    label="Select Context"
                                    validate={[required()]}
                                    defaultValue={
                                        dialogFormValues.serviceContextId
                                    }
                                    onChange={value => {
                                        if (value) {
                                            setDialogFormValues({
                                                ...dialogFormValues,
                                                serviceContextId:
                                                    value as number,
                                            });
                                        }
                                    }}
                                />
                            </ReferenceInput>
                        </Box>

                        <Box sx={{ mt: 2 }}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={dialogFormValues.isActive}
                                        onChange={e =>
                                            setDialogFormValues({
                                                ...dialogFormValues,
                                                isActive: e.target.checked,
                                            })
                                        }
                                        color="primary"
                                    />
                                }
                                label="Active"
                            />
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button label="Cancel" onClick={handleDialogClose} />
                    <Button label="Save" onClick={handleServiceSave} />
                </DialogActions>
            </Dialog>
        </Grid2>
    );
};

export default TradeServicesTab;
