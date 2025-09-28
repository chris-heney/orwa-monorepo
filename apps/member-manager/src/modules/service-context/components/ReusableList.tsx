import React from 'react';
import {
    DatagridConfigurable,
    FunctionField,
    TextField,
    useRecordContext,
    List,
} from 'react-admin';
import DatagridActionsField from '../../../_components/DatagridActionsField';
import { Checkbox, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SimpleToolbar from '../../../_components/SimpleToolbar';
import EmptyList from '../../../_components/EmptyList';
import { customDatagridStyle } from '../../../themes/customDatagridStyles';
import AddIcon from '@mui/icons-material/Add';
import { useUserPermissions, Resource } from '../../../rbac';
import { RaRecord } from 'react-admin';

// Field configuration interface
interface FieldConfig {
    source: string;
    label?: string;
}

// Props interface for the reusable list
interface ServiceContextReusableListProps {
    resource: Resource;
    raResource: string; // React Admin resource name
    fields: FieldConfig[];
    
    // Selection state from ServiceContext
    selectedIds: number[];
    setSelectedIds: (ids: number[]) => void;
    
    // Modal management
    setModalOpen: (state: { open: boolean; record?: RaRecord }) => void;
    
    // Display configuration
    title: string;
    emptyTitle?: string;
    createButtonText?: string;
    
    // Optional filter
    filter?: Record<string, any>;
}

const ServiceContextReusableList: React.FC<ServiceContextReusableListProps> = ({
    resource,
    raResource,
    fields,
    selectedIds,
    setSelectedIds,
    setModalOpen,
    title,
    emptyTitle = `No ${title.toLowerCase()} found.`,
    createButtonText = `Create ${title}`,
    filter = {},
}) => {
    const { hasResourcePermission } = useUserPermissions();

    // Check permissions
    const canCreate = hasResourcePermission(resource, 'create');
    const canEdit = hasResourcePermission(resource, 'edit');
    const canDelete = hasResourcePermission(resource, 'delete');
    const canView = hasResourcePermission(resource, 'view');
    
    // Show actions column only if user has edit or delete permissions
    const showActionsColumn = canEdit || canDelete;

    // Access control - hide entire list if no view permission
    if (!canView) {
        return (
            <div style={{ padding: '16px', textAlign: 'center', color: '#666' }}>
                <p>You don't have permission to view {title.toLowerCase()}.</p>
            </div>
        );
    }

    const SelectionField = () => {
        const record = useRecordContext();
        if (!record) return null;

        return (
            <Checkbox
                sx={{ p: 0, m: 0, maxWidth: 10 }}
                checked={selectedIds.includes(Number(record.id))}
            />
        );
    };

    const handleSelect = (recordId: any) => {
        const id = Number(recordId);
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter((itemId: number) => itemId !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const ActionsField = () => {
        const record = useRecordContext();
        if (!record) return null;

        return (
            <DatagridActionsField hasEdit={false}>
                {canEdit && (
                    <IconButton
                        size="small"
                        color="info"
                        onClick={() => {
                            setModalOpen({
                                open: true,
                                record: record,
                            });
                        }}
                    >
                        <EditIcon fontSize="small" />
                    </IconButton>
                )}
                {/* Add delete button here if needed */}
            </DatagridActionsField>
        );
    };

    return (
        <List
            sx={{ px: 2 }}
            disableSyncWithLocation
            resource={raResource}
            component="div"
            filter={filter}
            actions={
                <SimpleToolbar
                    selectedIds={selectedIds}
                    setSelectedIds={setSelectedIds}
                    hasCreateButton={false}
                >
                    {canCreate && (
                        <IconButton
                            color="primary"
                            size="medium"
                            onClick={() =>
                                setModalOpen({ open: true, record: undefined })
                            }
                        >
                            <AddIcon fontSize="small" />
                        </IconButton>
                    )}
                </SimpleToolbar>
            }
            empty={
                canCreate ? (
                    <EmptyList
                        title={emptyTitle}
                        buttonText={createButtonText}
                        onClick={() =>
                            setModalOpen({ open: true, record: undefined })
                        }
                    />
                ) : (
                    <div style={{ padding: '16px', textAlign: 'center', color: '#666' }}>
                        <p>{emptyTitle}</p>
                    </div>
                )
            }
        >
            <DatagridConfigurable
                bulkActionButtons={false}
                sx={customDatagridStyle}
                rowClick={record => {
                    handleSelect(record);
                    return false;
                }}
                selectedIds={selectedIds}
            >
                <FunctionField label="Selection" render={SelectionField} />
                
                {/* Render fields dynamically */}
                {fields.map((field) => (
                    <TextField
                        key={field.source}
                        source={field.source}
                        label={field.label}
                    />
                ))}
                
                {/* Only show Actions column if user has edit or delete permissions */}
                {showActionsColumn && (
                    <FunctionField
                        label="Actions"
                        headerClassName="text-right"
                        render={ActionsField}
                    />
                )}
            </DatagridConfigurable>
        </List>
    );
};

export default ServiceContextReusableList; 