import {
    CheckCircle as ActiveIcon,
    Add as AddIcon,
    Delete as DeleteIcon,
    FileCopy as DuplicateIcon,
    Edit as EditIcon,
    Block as InactiveIcon,
    Layers as TechIcon,
} from '@mui/icons-material';
import {
    Alert,
    Avatar,
    Box,
    Checkbox,
    Chip,
    IconButton,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import {
    DatagridConfigurable,
    FunctionField,
    List,
    RaRecord,
    ReferenceField,
    SimpleList,
    TextField,
    useDelete,
    useNotify,
    useRecordContext,
    useRefresh,
} from 'react-admin';
import EmptyList from '../../../../_components/EmptyList';
import SimpleToolbar from '../../../../_components/SimpleToolbar';
import { useUserPermissions } from '../../../../rbac';
import { customDatagridStyle } from '../../../../themes/customDatagridStyles';
import { MobilePlatformCard } from '../../components/MobilePlatformCards';
import { usePlatformContext } from '../../PlatformContext';

// Selection Field Component for Desktop
const SelectionField = ({
    selectedIds,
    onSelect,
}: {
    selectedIds: number[];
    onSelect: (recordId: any) => void;
}) => {
    const record = useRecordContext();
    if (!record) return null;

    return (
        <Checkbox
            sx={{ p: 0, m: 0, maxWidth: 40 }}
            checked={selectedIds?.includes(Number(record.id)) || false}
            onChange={() => onSelect(record.id)}
        />
    );
};

// Desktop Actions Component
const DesktopActionsField = ({
    canEdit,
    canDelete,
    onEdit,
    onDelete,
    onDuplicate,
}: {
    canEdit: boolean;
    canDelete: boolean;
    onEdit: (record: RaRecord) => void;
    onDelete: (record: RaRecord) => void;
    onDuplicate: (record: RaRecord) => void;
}) => {
    const record = useRecordContext();
    if (!record) return null;

    return (
        <Box display="flex" gap={0.5} justifyContent="flex-end">
            {canEdit && (
                <IconButton
                    size="small"
                    color="primary"
                    onClick={e => {
                        e.stopPropagation();
                        onDuplicate(record);
                    }}
                    title="Duplicate"
                >
                    <DuplicateIcon fontSize="small" />
                </IconButton>
            )}
            {canEdit && (
                <IconButton
                    size="small"
                    color="info"
                    onClick={e => {
                        e.stopPropagation();
                        onEdit(record);
                    }}
                >
                    <EditIcon fontSize="small" />
                </IconButton>
            )}
            {canDelete && (
                <IconButton
                    size="small"
                    color="error"
                    onClick={e => {
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

// Desktop DataGrid Component
const DesktopPlatformsList = ({
    handleEdit,
    handleDelete,
    handleDuplicate,
    hasResourcePermission,
    platformIds,
    setPlatformIds,
}: {
    handleEdit: (record: RaRecord) => void;
    handleDelete: (record: RaRecord) => void;
    handleDuplicate: (record: RaRecord) => void;
    hasResourcePermission: (resource: string, action: string) => boolean;
    platformIds: number[];
    setPlatformIds: (ids: number[]) => void;
}) => {
    const theme = useTheme();

    const canEdit = hasResourcePermission('platforms', 'edit');
    const canDelete = hasResourcePermission('platforms', 'delete');

    const handleSelect = (recordId: any) => {
        const id = Number(recordId);
        if (platformIds?.includes(id)) {
            setPlatformIds(
                platformIds?.filter((itemId: number) => itemId !== id)
            );
        } else {
            setPlatformIds([...(platformIds || []), id]);
        }
    };

    return (
        <DatagridConfigurable
            bulkActionButtons={false}
            sx={{
                ...customDatagridStyle,
                '& .RaDatagrid-table': {
                    backgroundColor: 'transparent',
                },
                '& .RaDatagrid-headerRow': {
                    backgroundColor: theme.palette.background.default,
                    '& .RaDatagrid-headerCell': {
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                        borderBottom: `2px solid ${theme.palette.divider}`,
                    },
                },
                '& .RaDatagrid-row': {
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                    },
                },
            }}
            rowClick={(id, _resource, record) => {
                handleSelect(id);
                return false;
            }}
            selectedIds={platformIds || []}
        >
            {/* Selection Checkbox */}
            <FunctionField
                label="Selected"
                render={() => (
                    <SelectionField
                        selectedIds={platformIds || []}
                        onSelect={handleSelect}
                    />
                )}
                sx={{
                    '& .RaDatagrid-headerCell': {
                        width: '60px',
                        textAlign: 'center',
                    },
                    '& .RaDatagrid-cell': {
                        textAlign: 'center',
                    },
                }}
            />

            {/* Platform Name */}
            <FunctionField
                label="Platform"
                render={(record: RaRecord) => (
                    <Box display="flex" alignItems="center" gap={2}>
                        <Avatar
                            sx={{
                                width: 32,
                                height: 32,
                                bgcolor: record.isActive
                                    ? 'secondary.main'
                                    : 'grey.400',
                            }}
                        >
                            <TechIcon fontSize="small" />
                        </Avatar>
                        <Box>
                            <Typography variant="body2" fontWeight={600}>
                                {record.name}
                            </Typography>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                ID: {record.id}
                            </Typography>
                        </Box>
                    </Box>
                )}
                sx={{
                    '& .RaDatagrid-headerCell': {
                        width: '25%',
                    },
                }}
            />

            {/* Platform Group */}
            <FunctionField
                source="platformGroupId"
                label="Group"
                render={(record: RaRecord) => (
                    <ReferenceField
                        source="platformGroupId"
                        reference="platform-group"
                        record={record}
                        link={false}
                    >
                        <TextField source="title" />
                    </ReferenceField>
                )}
                sx={{
                    '& .RaDatagrid-headerCell': {
                        width: '20%',
                    },
                }}
            />

            <TextField
                source="description"
                label="Description"
                sx={{
                    '& .RaDatagrid-headerCell': {
                        width: '30%',
                    },
                }}
            />

            <FunctionField
                source="isActive"
                label="Status"
                render={(record: RaRecord) => (
                    <Chip
                        icon={
                            record.isActive ? <ActiveIcon /> : <InactiveIcon />
                        }
                        label={record.isActive ? 'Active' : 'Inactive'}
                        size="small"
                        color={record.isActive ? 'success' : 'default'}
                        variant="outlined"
                    />
                )}
                sx={{
                    '& .RaDatagrid-headerCell': {
                        width: '15%',
                    },
                }}
            />

            {(canEdit || canDelete) && (
                <FunctionField
                    label="Actions"
                    render={() => (
                        <DesktopActionsField
                            canEdit={canEdit}
                            canDelete={canDelete}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onDuplicate={handleDuplicate}
                        />
                    )}
                    sx={{
                        '& .RaDatagrid-headerCell': {
                            width: '10%',
                            textAlign: 'right',
                        },
                        '& .RaDatagrid-cell': {
                            textAlign: 'right',
                        },
                    }}
                />
            )}
        </DatagridConfigurable>
    );
};

// Mobile List Component
const MobilePlatformsList = ({
    handleEdit,
    handleDelete,
    handleDuplicate,
    hasResourcePermission,
    platformIds,
    setPlatformIds,
}: {
    handleEdit: (record: RaRecord) => void;
    handleDelete: (record: RaRecord) => void;
    handleDuplicate: (record: RaRecord) => void;
    hasResourcePermission: (resource: string, action: string) => boolean;
    platformIds: number[];
    setPlatformIds: (ids: number[]) => void;
}) => {
    const canEdit = hasResourcePermission('platforms', 'edit');
    const canDelete = hasResourcePermission('platforms', 'delete');

    const handleSelect = (record: RaRecord) => {
        const id = Number(record.id);
        if (platformIds?.includes(id)) {
            setPlatformIds(
                platformIds?.filter((itemId: number) => itemId !== id)
            );
        } else {
            setPlatformIds([...(platformIds || []), id]);
        }
    };

    return (
        <Box sx={{ p: 1 }}>
            <SimpleList
                primaryText={(record: RaRecord) => (
                    <MobilePlatformCard
                        record={record}
                        onEdit={canEdit ? handleEdit : undefined}
                        onDelete={canDelete ? handleDelete : undefined}
                        onDuplicate={canEdit ? handleDuplicate : undefined}
                        canEdit={canEdit}
                        canDelete={canDelete}
                        isSelected={platformIds?.includes(Number(record.id)) || false}
                        onSelect={handleSelect}
                    />
                )}
                linkType={false}
                sx={{
                    '& .MuiListItem-root': {
                        padding: 0,
                        marginBottom: 1,
                    },
                    '& .MuiListItemText-root': {
                        margin: 0,
                    },
                }}
            />
        </Box>
    );
};

const PlatformsList = () => {
    const {
        platformIds,
        setPlatformIds,
        setIsPlatformModalOpen,
        platformGroupIds,
    } = usePlatformContext();
    const { hasResourcePermission } = useUserPermissions();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const notify = useNotify();
    const refresh = useRefresh();
    const [deleteOne] = useDelete();

    const canCreate = hasResourcePermission('platforms' as any, 'create');
    const canView = hasResourcePermission('platforms' as any, 'view');

    if (!canView) {
        return (
            <Box sx={{ p: 2, textAlign: 'center' }}>
                <Alert severity="warning">
                    You don't have permission to view platforms.
                </Alert>
            </Box>
        );
    }

    const handleEdit = (record: RaRecord) => {
        setIsPlatformModalOpen({
            open: true,
            record: record,
        });
    };

    const handleDelete = async (record: RaRecord) => {
        try {
            await deleteOne('platform', { id: record.id });
            notify('Platform deleted successfully', { type: 'success' });
            refresh();
        } catch (error) {
            notify('Error deleting platform', { type: 'error' });
        }
    };

    const handleDuplicate = (record: RaRecord) => {
        const { id, ...rest } = record;
        setIsPlatformModalOpen({
            open: true,
            record: {
                ...rest,
                id: undefined,
                name: rest.name ? rest.name + ' (Copy)' : undefined,
            },
        });
    };

    const ResponsiveContent = isMobile
        ? MobilePlatformsList
        : DesktopPlatformsList;

    return (
        <List
            sx={{ mx: 2 }}
            disableSyncWithLocation
            resource="platform"
            component="div"
            filter={{
                platformGroupId: platformGroupIds,
            }}
            queryOptions={{
                meta: {
                    populate: ['platformGroup'],
                },
            }}
            actions={
                <SimpleToolbar
                    selectedIds={platformIds || []}
                    setSelectedIds={setPlatformIds}
                    hasCreateButton={false}
                >
                    {canCreate && (
                        <IconButton
                            color="primary"
                            size="medium"
                            onClick={() =>
                                setIsPlatformModalOpen({
                                    open: true,
                                    record: undefined,
                                })
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
                        title="No platforms found."
                        buttonText="Create Platform"
                        onClick={() =>
                            setIsPlatformModalOpen({
                                open: true,
                                record: undefined,
                            })
                        }
                    />
                ) : (
                    <Box sx={{ p: 2, textAlign: 'center' }}>
                        <Typography color="text.secondary">
                            No platforms found.
                        </Typography>
                    </Box>
                )
            }
        >
            <ResponsiveContent
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                handleDuplicate={handleDuplicate}
                hasResourcePermission={hasResourcePermission}
                platformIds={platformIds || []}
                setPlatformIds={setPlatformIds}
            />
        </List>
    );
};

export default PlatformsList;