import React from 'react';
import {
    DatagridConfigurable,
    FunctionField,
    TextField,
    NumberField,
    useRecordContext,
    List,
    useRedirect,
} from 'react-admin';
import { Checkbox, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SimpleToolbar from '../../../_components/SimpleToolbar';
import EmptyList from '../../../_components/EmptyList';
import { customDatagridStyle } from '../../../themes/customDatagridStyles';
import AddIcon from '@mui/icons-material/Add';
import { useUserPermissions, Resource } from '../../../rbac';
import { RaRecord } from 'react-admin';
import FileCopyIcon from '@mui/icons-material/FileCopy';

// Field configuration interface
interface FieldConfig {
    source: string;
    label?: string;
    component?: React.ComponentType<any>;
    render?: (record: RaRecord) => React.ReactNode;
}

// Props interface for the reusable list
interface CoreServiceReusableListProps {
    resource: Resource;
    raResource: string; // React Admin resource name
    fields: FieldConfig[];
    
    // Selection state from CoreServiceContext
    selectedIds: number[];
    setSelectedIds: (ids: number[]) => void;
    
    // Modal management
    setModalOpen: (state: { open: boolean; record?: RaRecord }) => void;
    
    // Display configuration
    title: string;
    emptyTitle?: string;
    createButtonText?: string;
    hasDuplicate?: boolean;
    // Optional filter
    filter?: Record<string, any>;
    
    // Optional custom handlers
    onEdit?: (record: RaRecord) => void;
    onDelete?: (record: RaRecord) => void;
    
    // Query options
    queryOptions?: any;
}

// Move components outside to avoid hooks violations
const SelectionField: React.FC<{ selectedIds: number[]; onSelect: (recordId: any) => void }> = ({ selectedIds, onSelect }) => {
    const record = useRecordContext();
    if (!record) return null;

    return (
        <Checkbox
            sx={{ p: 0, m: 0, maxWidth: 10 }}
            checked={selectedIds.includes(Number(record.id))}
            onChange={() => onSelect(record.id)}
        />
    );
};

const ActionsField: React.FC<{
    canEdit: boolean;
    canDelete: boolean;
    onEdit?: (record: RaRecord) => void;
    onDelete?: (record: RaRecord) => void;
    setModalOpen: (state: { open: boolean; record?: RaRecord }) => void;
    raResource: string;
    hasDuplicate?: boolean;
}> = ({ canEdit, canDelete, onEdit, onDelete, setModalOpen, raResource, hasDuplicate }) => {
    const record = useRecordContext();
    const redirect = useRedirect();
    if (!record) return null;

    return (
        <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
            {canEdit && (
                <IconButton
                    size="small"
                    color="info"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (onEdit) {
                            onEdit(record);
                        } else {
                            // Navigate to edit route instead of opening modal
                            redirect('edit', raResource, record.id);
                        }
                    }}
                >
                    <EditIcon fontSize="small" />
                </IconButton>
            )}
            {/* Duplicate Button */}
            {(canEdit  && hasDuplicate) && (
                <IconButton
                    size="small"
                    color="primary"
                    onClick={(e) => {
                        e.stopPropagation();
                        // Duplicate logic: clear id, append (Copy) to name
                        const { id, ...rest } = record;
                        setModalOpen({
                            open: true,
                            record: {
                                ...rest,
                                id: undefined, // Explicitly set id to undefined for type safety
                                name: rest.name ? rest.name + ' (Copy)' : undefined,
                            },
                        });
                    }}
                    title="Duplicate"
                >
                    <FileCopyIcon fontSize="small" />
                </IconButton>
            )}
            {canDelete && onDelete && (
                <IconButton
                    size="small"
                    color="error"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(record);
                    }}
                >
                    <DeleteIcon fontSize="small" />
                </IconButton>
            )}
        </div>
    );
};

const CoreServiceReusableList: React.FC<CoreServiceReusableListProps> = ({
    resource,
    raResource,
    fields,
    selectedIds,
    setSelectedIds,
    setModalOpen,
    title,
    emptyTitle = `No ${title.toLowerCase()} found.`,
    createButtonText = `Create ${title}`,
    hasDuplicate = false,
    filter = {},
    onEdit,
    onDelete,
    queryOptions,
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

    const handleSelect = (recordId: any) => {
        const id = Number(recordId);
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter((itemId: number) => itemId !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    return (
        <List
            sx={{ mx: 2 }}
            disableSyncWithLocation
            resource={raResource}
            component="div"
            filter={filter}
            queryOptions={queryOptions}
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
                <FunctionField
                    align="right"
                    label="Selected"
                    render={() => <SelectionField selectedIds={selectedIds} onSelect={handleSelect} />}
                />
                
                {/* Render fields dynamically */}
                {fields.map((field) => {
                    if (field.component) {
                        const props: any = {
                            key: field.source,
                            source: field.source,
                            label: field.label
                        };
                        
                        // Add currency formatting for financial fields
                        if (field.component === NumberField && 
                            (field.source.includes('investment') || 
                             field.source.includes('revenue') || 
                             field.source.includes('Cost'))) {
                            props.options = { 
                                style: 'currency', 
                                currency: 'USD', 
                                minimumFractionDigits: 0, 
                                maximumFractionDigits: 0 
                            };
                        }
                        
                        return React.createElement(field.component, props);
                    }

                    if (field.render) {
                        return (
                            <FunctionField
                                key={field.source}
                                label={field.label || field.source}
                                render={field.render}
                            />
                        );
                    }

                    return (
                        <TextField
                            key={field.source}
                            source={field.source}
                            label={field.label}
                        />
                    );
                })}
                
                {/* Only show Actions column if user has edit or delete permissions */}
                {showActionsColumn && (
                    <FunctionField
                        label="Actions"
                        headerClassName="text-right"
                        render={() => (
                            <ActionsField
                                canEdit={canEdit}
                                canDelete={canDelete}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                setModalOpen={setModalOpen}
                                raResource={raResource}
                                hasDuplicate={hasDuplicate}
                            />
                        )}
                    />
                )}
            </DatagridConfigurable>
        </List>
    );
};

export default CoreServiceReusableList; 