import { CIWebHeader } from '../../../../../_components';
import { Logo } from '../../../../../layout/Logo';
import { useAssetManagerContext } from '../../../AssetManagerContext';
import { CopyableField } from '../../../components';
import { Alert, Chip, Snackbar } from '@mui/material';
import React from 'react';
import {
    CreateButton,
    DatagridConfigurable,
    ExportButton,
    FunctionField,
    List,
    RaRecord,
    TextField,
    TopToolbar,
    useRecordContext,
} from 'react-admin';
import { customDatagridStyle } from '../../../../../themes/customDatagridStyles';

// Enhanced CopyableFieldComponent for the datagrid
const CopyableFieldComponent: React.FC<{ source: string; type: string }> = ({
    source,
    type,
}) => {
    const record = useRecordContext();
    const { copyToClipboard } = useAssetManagerContext();

    if (!record || !record[source]) return null;

    return (
        <CopyableField
            value={record[source]}
            type={type}
            copyToClipboard={copyToClipboard}
        />
    );
};

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
const ApiKeyActions = () => (
    <TopToolbar>
        <CreateButton />
        <ExportButton />
    </TopToolbar>
);

// Enhanced List Component
export const ListApiKeys = () => {
    const { copySuccess, setCopySuccess } = useAssetManagerContext();

    return (
        <>
            <CIWebHeader title="API KEYS" icon={<Logo />} />
            <List
                actions={<ApiKeyActions />}
                title="API Keys"
                perPage={25}
                sort={{ field: 'name', order: 'ASC' }}
            >
                <DatagridConfigurable
                    sx={customDatagridStyle}
                    rowClick="show"
                    bulkActionButtons={false}
                >
                    <TextField source="name" sortable />
                    <TextField source="description" sortable />
                    <TextField source="owner" sortable />
                    <FunctionField
                        label="Key"
                        render={(record: RaRecord) => (
                            <CopyableFieldComponent
                                source="key"
                                type="API Key"
                            />
                        )}
                    />
                    <FunctionField
                        label="URL"
                        render={(record: RaRecord) =>
                            record.url ? (
                                <CopyableFieldComponent
                                    source="url"
                                    type="URL"
                                />
                            ) : (
                                <span style={{ color: '#999' }}>-</span>
                            )
                        }
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
