import React from 'react';
import { 
    List, 
    Datagrid, 
    CreateButton, 
    TopToolbar, 
    TextField,
    DateField,
    NumberField,
    BooleanField,
    ArrayField,
    ChipField,
    SingleFieldList,
    FunctionField,
    useRecordContext,
    ListProps,
    DatagridProps,
    CreateButtonProps,
    RaRecord,
} from 'react-admin';
import { Box, Typography, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Resource } from './permissions';
import { useUserPermissions } from './usePermissions';

// Field configuration type
export interface FieldConfig {
    source: string;
    label?: string;
    type?: 'text' | 'date' | 'number' | 'boolean' | 'array' | 'chip' | 'custom';
    component?: React.ComponentType<any>;
    render?: (record: RaRecord) => React.ReactNode;
    sortable?: boolean;
    hidden?: boolean;
}

// Component props
interface PermissionBasedListProps extends Omit<ListProps, 'children'> {
    resource: Resource;
    fields: FieldConfig[];
    onCreate?: () => void;
    onEdit?: (record: RaRecord) => void;
    onDelete?: (record: RaRecord) => void;
    title?: string;
    emptyText?: string;
    emptySubtext?: string;
    createButtonLabel?: string;
    showCreateButton?: boolean;
    datagridProps?: Partial<DatagridProps>;
    createButtonProps?: Partial<CreateButtonProps>;
}

// Default field components mapping
const getFieldComponent = (type: string = 'text') => {
    switch (type) {
        case 'date':
            return DateField;
        case 'number':
            return NumberField;
        case 'boolean':
            return BooleanField;
        case 'text':
        default:
            return TextField;
    }
};

// Array field renderer
const ArrayFieldRenderer: React.FC<{ source: string; label?: string }> = ({ source, label }) => (
    <ArrayField source={source} label={label}>
        <SingleFieldList>
            <ChipField source="name" />
        </SingleFieldList>
    </ArrayField>
);

// Chip field renderer for single values
const ChipFieldRenderer: React.FC<{ source: string; label?: string }> = ({ source, label }) => (
    <ChipField source={source} label={label} />
);

// Actions column component
const ActionsField: React.FC<{
    resource: Resource;
    onEdit?: (record: RaRecord) => void;
    onDelete?: (record: RaRecord) => void;
}> = ({ resource, onEdit, onDelete }) => {
    const { hasResourcePermission } = useUserPermissions();
    const record = useRecordContext();

    const hasEditPermission = hasResourcePermission(resource, 'edit');
    const hasDeletePermission = hasResourcePermission(resource, 'delete');

    // If no permissions, return null to hide the column
    if (!hasEditPermission && !hasDeletePermission) {
        return null;
    }

    if (!record) return null;

    return (
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            {hasEditPermission && onEdit && (
                <IconButton
                    size="small"
                    color="info"
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit(record);
                    }}
                >
                    <EditIcon fontSize="small" />
                </IconButton>
            )}
            {hasDeletePermission && onDelete && (
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
        </Box>
    );
};

// List actions component
const ListActions: React.FC<{
    resource: Resource;
    onCreate?: () => void;
    createButtonLabel?: string;
    showCreateButton?: boolean;
    createButtonProps?: Partial<CreateButtonProps>;
}> = ({ 
    resource, 
    onCreate, 
    createButtonLabel = 'Create', 
    showCreateButton = true,
    createButtonProps = {}
}) => {
    const { hasResourcePermission } = useUserPermissions();

    if (!showCreateButton || !hasResourcePermission(resource, 'create')) {
        return null;
    }

    return (
        <TopToolbar>
            <CreateButton 
                {...createButtonProps}
                label={createButtonLabel}
                onClick={onCreate}
            />
        </TopToolbar>
    );
};

// Empty state component
const EmptyState: React.FC<{
    resource: Resource;
    emptyText?: string;
    emptySubtext?: string;
    onCreate?: () => void;
    createButtonLabel?: string;
}> = ({ 
    resource, 
    emptyText = 'No items found', 
    emptySubtext = 'Get started by creating a new item',
    onCreate,
    createButtonLabel = 'Create'
}) => {
    const { hasResourcePermission } = useUserPermissions();

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 200,
                textAlign: 'center',
                p: 3
            }}
        >
            <Typography variant="h6" color="text.secondary" gutterBottom>
                {emptyText}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
                {emptySubtext}
            </Typography>
            {hasResourcePermission(resource, 'create') && onCreate && (
                <CreateButton 
                    label={createButtonLabel}
                    onClick={onCreate}
                />
            )}
        </Box>
    );
};

// Main component
export const PermissionBasedList: React.FC<PermissionBasedListProps> = ({
    resource,
    fields,
    onCreate,
    onEdit,
    onDelete,
    title,
    emptyText,
    emptySubtext,
    createButtonLabel,
    showCreateButton = true,
    datagridProps = {},
    createButtonProps = {},
    ...listProps
}) => {
    const { hasResourcePermission } = useUserPermissions();

    // Check if user has view permission
    if (!hasResourcePermission(resource, 'view')) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" color="error">
                    Access Denied
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    You don't have permission to view this resource.
                </Typography>
            </Box>
        );
    }

    // Check if we should show actions column
    const showActionsColumn = hasResourcePermission(resource, 'edit') || hasResourcePermission(resource, 'delete');

    // Filter visible fields
    const visibleFields = fields.filter(field => !field.hidden);

    return (
        <List
            {...listProps}
            title={title}
            actions={
                <ListActions
                    resource={resource}
                    onCreate={onCreate}
                    createButtonLabel={createButtonLabel}
                    showCreateButton={showCreateButton}
                    createButtonProps={createButtonProps}
                />
            }
            empty={
                <EmptyState
                    resource={resource}
                    emptyText={emptyText}
                    emptySubtext={emptySubtext}
                    onCreate={onCreate}
                    createButtonLabel={createButtonLabel}
                />
            }
        >
            <Datagrid 
                {...datagridProps}
                rowClick={onEdit ? "edit" : undefined}
            >
                {visibleFields.map((field) => {
                    if (field.component) {
                        return React.createElement(field.component, {
                            key: field.source,
                            source: field.source,
                            label: field.label
                        });
                    }

                    if (field.render) {
                        // Use FunctionField for custom render functions
                        return (
                            <FunctionField 
                                key={field.source} 
                                label={field.label || field.source}
                                render={field.render}
                            />
                        );
                    }

                    switch (field.type) {
                        case 'array':
                            return (
                                <ArrayFieldRenderer
                                    key={field.source}
                                    source={field.source}
                                    label={field.label}
                                />
                            );
                        case 'chip':
                            return (
                                <ChipFieldRenderer
                                    key={field.source}
                                    source={field.source}
                                    label={field.label}
                                />
                            );
                        case 'custom':
                            // For custom fields, expect the component to be provided
                            if (field.component) {
                                return React.createElement(field.component, {
                                    key: field.source,
                                    source: field.source,
                                    label: field.label
                                });
                            }
                            return null;
                        default:
                            const FieldComponent = getFieldComponent(field.type);
                            return (
                                <FieldComponent
                                    key={field.source}
                                    source={field.source}
                                    label={field.label}
                                    sortable={field.sortable}
                                />
                            );
                    }
                })}
                
                {showActionsColumn && (onEdit || onDelete) && (
                    <ActionsField
                        resource={resource}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                )}
            </Datagrid>
        </List>
    );
}; 