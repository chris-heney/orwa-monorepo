import { CIWebHeader } from '../../../../../_components';
import { Logo } from '../../../../../layout/Logo';
import { useAssetManagerContext } from '../../../AssetManagerContext';
import { Alert, Box, Chip, Snackbar } from '@mui/material';
import React from 'react';
import {
    CreateButton,
    DatagridConfigurable,
    ExportButton,
    FunctionField,
    List,
    NumberField,
    RaRecord,
    ReferenceField,
    TextField,
    TopToolbar,
    useRecordContext,
} from 'react-admin';
import { customDatagridStyle } from '../../../../../themes/customDatagridStyles';

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

// Enhanced Actions Toolbar
const ServerActions = () => (
    <TopToolbar>
        <CreateButton />
        <ExportButton />
    </TopToolbar>
);

// Enhanced List Component
export const ListServers = () => {
    const { copySuccess, setCopySuccess } = useAssetManagerContext();

    return (
        <>
            <CIWebHeader title="SERVERS" icon={<Logo />} />
            <List
                queryOptions={{
                    meta: {
                        populate: ['hostingProvider'],
                    },
                }}
                actions={<ServerActions />}
                title="Servers"
                perPage={25}
                sort={{ field: 'hostname', order: 'ASC' }}
            >
                <DatagridConfigurable
                    sx={customDatagridStyle}
                    rowClick="show"
                    bulkActionButtons={false}
                >
                    <TextField source="hostname" sortable />
                    <FunctionField
                        label="IP Addresses"
                        render={(record: RaRecord) => (
                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: 0.5,
                                    flexWrap: 'wrap',
                                    maxWidth: 200,
                                }}
                            >
                                {record?.ips
                                    ?.slice(0, 2)
                                    .map((ip: string, index: number) => (
                                        <Chip
                                            key={index + ip}
                                            label={ip}
                                            size="small"
                                            variant="outlined"
                                        />
                                    ))}
                                {record?.ips?.length > 2 && (
                                    <Chip
                                        label={`+${record.ips.length - 2}`}
                                        size="small"
                                        variant="outlined"
                                        color="secondary"
                                    />
                                )}
                            </Box>
                        )}
                    />
                    <FunctionField
                        label="Tags"
                        render={(record: RaRecord) => (
                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: 0.5,
                                    flexWrap: 'wrap',
                                    maxWidth: 200,
                                }}
                            >
                                {record?.tags
                                    ?.slice(0, 2)
                                    .map((tag: string) => (
                                        <Chip
                                            key={tag}
                                            size="small"
                                            label={tag}
                                            color="primary"
                                            variant="outlined"
                                        />
                                    ))}
                                {record?.tags?.length > 2 && (
                                    <Chip
                                        label={`+${record.tags.length - 2}`}
                                        size="small"
                                        variant="outlined"
                                        color="secondary"
                                    />
                                )}
                            </Box>
                        )}
                    />
                    <ReferenceField
                        source="hostingProviderId"
                        reference="hosting-provider"
                        sortable
                    >
                        <TextField source="name" />
                    </ReferenceField>
                    <NumberField
                        source="cost"
                        sortable
                        options={{
                            style: 'currency',
                            currency: 'USD',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                        }}
                    />
                    <FunctionField
                        label="Status"
                        render={(record: RaRecord) => (
                            <StatusField source="active" />
                        )}
                        sortable
                    />
                    <TextField source="createdAt" sortable />
                    <TextField source="updatedAt" sortable />
                </DatagridConfigurable>
            </List>

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
