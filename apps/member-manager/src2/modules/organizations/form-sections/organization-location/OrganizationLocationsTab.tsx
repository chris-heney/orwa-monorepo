import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Box, Card, IconButton, Paper, Typography } from '@mui/material';
import { useState } from 'react';
import { Button } from 'react-admin';
import { useFieldArray, useFormContext } from 'react-hook-form';
import CreateLocationModal from './CreateOrganizationLocationModal';
import EditLocationModal from './EditOrganizationLocationModal';

const OrganizationLocationsTab = () => {
    const [modalState, setModalState] = useState<{
        open: boolean;
        locationId: string | null;
    }>({
        open: false,
        locationId: null,
    });

    const { control } = useFormContext();

    const { fields, remove } = useFieldArray({
        control: control,
        name: 'organizationLocations',
    });

    const handleEditLocation = (locationId: string) => {
        setModalState({
            open: true,
            locationId: locationId,
        });
    };

    const handleRemoveLocation = (index: number) => {
        if (window.confirm('Are you sure you want to remove this location?')) {
            remove(index);
        }
    };

    return (
        <Paper
            sx={{
                height: '100%',
                p: 2,
                border: 'none',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                    pb: 1,
                    borderBottom: '1px solid #f0f0f0',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocationOnIcon sx={{ color: 'primary.main', mr: 1 }} />
                    <Typography variant="h6">Business Locations</Typography>
                </Box>
                <Button
                    variant="contained"
                    size="small"
                    startIcon={<AddCircleIcon />}
                    onClick={() =>
                        setModalState({ open: true, locationId: null })
                    }
                >
                    Add
                </Button>
            </Box>

            <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
                {!fields || fields.length === 0 ? (
                    <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ py: 2 }}
                    >
                        No addresses added yet. Click the button above to add an
                        address.
                    </Typography>
                ) : (
                    fields.map((location: any, index: number) => (
                        <Card
                            key={location.id}
                            sx={{
                                p: 1.5,
                                mb: 1.5,
                                boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
                            }}
                        >
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                            >
                                <Box>
                                    <Typography
                                        variant="body1"
                                        sx={{ fontWeight: 'bold' }}
                                    >
                                        {location.location?.city?.name}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                    >
                                        {location.location?.address}
                                    </Typography>
                                </Box>
                                <Box>
                                    <IconButton
                                        size="small"
                                        onClick={() =>
                                            handleEditLocation(location.id)
                                        }
                                    >
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() =>
                                            handleRemoveLocation(index)
                                        }
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            </Box>
                        </Card>
                    ))
                )}
            </Box>

            <CreateLocationModal open={modalState} setOpen={setModalState} />

            <EditLocationModal open={modalState} setOpen={setModalState} />
        </Paper>
    );
};

export default OrganizationLocationsTab;
