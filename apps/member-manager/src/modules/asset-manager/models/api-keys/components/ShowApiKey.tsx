import ModalHeader from '../../../../../_components/ModalHeader';
import { useAssetManagerContext } from '../../../AssetManagerContext';
import { CopyableField } from '../../../components';
import { Alert, Box, Chip, Grid, Snackbar, Typography } from '@mui/material';
import React from 'react';
import {
    FunctionField,
    RaRecord,
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

export const ShowApiKey = () => {
    const { copyToClipboard, copySuccess, setCopySuccess } =
        useAssetManagerContext();

    return (
        <>
            <Show actions={false} title="API Key Details">
                <ModalHeader
                    title="API Key Details"
                    redirect="/api-key"
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
                                    Basic Information
                                </Typography>
                                <Box sx={{ mb: 2 }}>
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                    >
                                        Name
                                    </Typography>
                                    <TextField source="name" />
                                </Box>
                                <Box sx={{ mb: 2 }}>
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                    >
                                        Owner
                                    </Typography>
                                    <TextField source="owner" />
                                </Box>
                                <Box sx={{ mb: 2 }}>
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                    >
                                        Description
                                    </Typography>
                                    <TextField source="description" />
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
                                    API Configuration
                                </Typography>
                                <Box sx={{ mb: 2 }}>
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                    >
                                        API Key
                                    </Typography>
                                    <FunctionField
                                        render={(record: RaRecord) => (
                                            <CopyableField
                                                value={record.key}
                                                type="API Key"
                                                copyToClipboard={
                                                    copyToClipboard
                                                }
                                            />
                                        )}
                                    />
                                </Box>
                                <FunctionField
                                    render={(record: RaRecord) =>
                                        record.url ? (
                                            <Box sx={{ mb: 2 }}>
                                                <Typography
                                                    variant="body2"
                                                    color="textSecondary"
                                                >
                                                    URL
                                                </Typography>
                                                <CopyableField
                                                    value={record.url}
                                                    type="URL"
                                                    copyToClipboard={
                                                        copyToClipboard
                                                    }
                                                />
                                            </Box>
                                        ) : null
                                    }
                                />
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
