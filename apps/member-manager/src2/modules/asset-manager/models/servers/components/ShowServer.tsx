import ModalHeader from '../../../../../_components/ModalHeader';
import { useAssetManagerContext } from '../../../AssetManagerContext';
import { CopyableField } from '../../../components';
import { Alert, Box, Chip, Grid, Snackbar, Typography } from '@mui/material';
import React from 'react';
import {
    FunctionField,
    NumberField,
    RaRecord,
    ReferenceField,
    Show,
    SimpleShowLayout,
    TextField,
    useRecordContext,
} from 'react-admin';

// Enhanced Status Field with better visual feedback
const StatusField: React.FC<{ source: string }> = ({ source }) => {
    const record = useRecordContext();
    const isActive = record?.[source];

    return (
        <Chip
            label={isActive ? 'Active' : 'Inactive'}
            color={isActive ? 'success' : 'default'}
            variant={isActive ? 'filled' : 'outlined'}
            size="small"
        />
    );
};

export const ShowServer = () => {
    const { copyToClipboard, copySuccess, setCopySuccess } =
        useAssetManagerContext();

    return (
        <>
            <Show title="Server Details" actions={false}>
                <ModalHeader
                    title="Server Details"
                    redirect="/server"
                    backButton
                    editButton
                />
                <SimpleShowLayout>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Box
                                sx={{
                                    p: 3,
                                    backgroundColor: 'background.paper',
                                    borderRadius: 1,
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    gutterBottom
                                    color="primary"
                                >
                                    Server Information
                                </Typography>
                                <Box sx={{ mb: 2 }}>
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                    >
                                        Hostname
                                    </Typography>
                                    <TextField source="hostname" />
                                </Box>
                                <Box sx={{ mb: 2 }}>
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                    >
                                        Hosting Provider
                                    </Typography>
                                    <ReferenceField
                                        source="hostingProviderId"
                                        reference="hosting-provider"
                                    >
                                        <TextField source="name" />
                                    </ReferenceField>
                                </Box>
                                <Box sx={{ mb: 2 }}>
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                    >
                                        Monthly Cost
                                    </Typography>
                                    <NumberField
                                        source="cost"
                                        options={{
                                            style: 'currency',
                                            currency: 'USD',
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 0,
                                        }}
                                    />
                                </Box>
                                <Box sx={{ mb: 2 }}>
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                    >
                                        Status
                                    </Typography>
                                    <FunctionField
                                        render={(record: RaRecord) => (
                                            <StatusField source="active" />
                                        )}
                                    />
                                </Box>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Box
                                sx={{
                                    p: 3,
                                    backgroundColor: 'background.paper',
                                    borderRadius: 1,
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    gutterBottom
                                    color="primary"
                                >
                                    Network Configuration
                                </Typography>
                                <Box sx={{ mb: 2 }}>
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                        gutterBottom
                                    >
                                        IP Addresses
                                    </Typography>
                                    <FunctionField
                                        render={(record: RaRecord) => (
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: 1,
                                                }}
                                            >
                                                {record.ips &&
                                                    record.ips.map(
                                                        (
                                                            ip: string,
                                                            index: number
                                                        ) => (
                                                            <CopyableField
                                                                key={index}
                                                                value={ip}
                                                                type="IP Address"
                                                                copyToClipboard={
                                                                    copyToClipboard
                                                                }
                                                            />
                                                        )
                                                    )}
                                            </Box>
                                        )}
                                    />
                                </Box>
                                <Box sx={{ mb: 2 }}>
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                        gutterBottom
                                    >
                                        Tags
                                    </Typography>

                                    <FunctionField
                                        render={(record: RaRecord) => (
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: 1,
                                                }}
                                            >
                                                {record?.tags &&
                                                    record?.tags.map(
                                                        (
                                                            tag: string,
                                                            index: number
                                                        ) => (
                                                            <CopyableField
                                                                key={index}
                                                                value={tag}
                                                                type="Tag"
                                                                copyToClipboard={
                                                                    copyToClipboard
                                                                }
                                                            />
                                                        )
                                                    )}
                                            </Box>
                                        )}
                                    />
                                </Box>
                            </Box>
                        </Grid>

                        <Grid item xs={12}>
                            <Box
                                sx={{
                                    p: 3,
                                    backgroundColor: 'background.paper',
                                    borderRadius: 1,
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    gutterBottom
                                    color="primary"
                                >
                                    Timestamps
                                </Typography>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        gap: 4,
                                        flexWrap: 'wrap',
                                    }}
                                >
                                    <Box>
                                        <Typography
                                            variant="body2"
                                            color="textSecondary"
                                        >
                                            Created
                                        </Typography>
                                        <TextField source="createdAt" />
                                    </Box>
                                    <Box>
                                        <Typography
                                            variant="body2"
                                            color="textSecondary"
                                        >
                                            Last Updated
                                        </Typography>
                                        <TextField source="updatedAt" />
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </SimpleShowLayout>
            </Show>

            <Snackbar
                open={!!copySuccess}
                autoHideDuration={2000}
                onClose={() => setCopySuccess('')}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setCopySuccess('')} severity="success">
                    {copySuccess}
                </Alert>
            </Snackbar>
        </>
    );
};
