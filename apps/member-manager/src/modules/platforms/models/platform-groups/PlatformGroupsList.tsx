import {
    CheckCircle as ActiveIcon,
    Add as AddIcon,
    Code as CodeIcon,
    Delete as DeleteIcon,
    FileCopy as DuplicateIcon,
    Edit as EditIcon,
    Block as InactiveIcon,
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
import { MobilePlatformGroupCard } from '../../components/MobilePlatformCards';
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
const DesktopPlatformGroupsList = ({
    handleEdit,
    handleDelete,
    handleDuplicate,
    hasResourcePermission,
    setIsPlatformGroupModalOpen,
    platformGroupIds,
    setPlatformGroupIds,
}: {
    handleEdit: (record: RaRecord) => void;
    handleDelete: (record: RaRecord) => void;
    handleDuplicate: (record: RaRecord) => void;
    hasResourcePermission: (resource: string, action: string) => boolean;
    setIsPlatformGroupModalOpen: (state: {
        open: boolean;
        record?: RaRecord;
    }) => void;
    platformGroupIds: number[];
    setPlatformGroupIds: (ids: number[]) => void;
}) => {
    const theme = useTheme();

    const canEdit = hasResourcePermission('platformGroups', 'edit');
    const canDelete = hasResourcePermission('platformGroups', 'delete');

    const handleSelect = (recordId: any) => {
        const id = Number(recordId);
        if (platformGroupIds?.includes(id)) {
            setPlatformGroupIds(
                platformGroupIds?.filter((itemId: number) => itemId !== id)
            );
        } else {
            setPlatformGroupIds([...(platformGroupIds || []), id]);
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
            selectedIds={platformGroupIds || []}
        >
            {/* Selection Checkbox */}
            <FunctionField
                label="Selected"
                render={() => (
                    <SelectionField
                        selectedIds={platformGroupIds || []}
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

            {/* Icon and Title */}
            <FunctionField
                label="Group"
                render={(record: RaRecord) => (
                    <Box display="flex" alignItems="center" gap={2}>
                        <Avatar
                            sx={{
                                width: 32,
                                height: 32,
                                bgcolor: record.isActive
                                    ? 'primary.main'
                                    : 'grey.400',
                                fontSize: '1rem',
                            }}
                        >
                            {record.icon || <CodeIcon fontSize="small" />}
                        </Avatar>
                        <Box>
                            <Typography variant="body2" fontWeight={600}>
                                {record.title}
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

            <TextField
                source="purpose"
                label="Purpose"
                sx={{
                    '& .RaDatagrid-headerCell': {
                        width: '30%',
                    },
                }}
            />

            <FunctionField
                source="sortOrder"
                label="Sort Order"
                render={(record: RaRecord) => (
                    <Typography variant="body2">{record.sortOrder}</Typography>
                )}
                sx={{
                    '& .RaDatagrid-headerCell': {
                        width: '15%',
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

            <FunctionField
                source="platforms"
                label="Platforms"
                render={(record: RaRecord) => (
                    <Chip
                        label={`${record.platforms?.length || 0} platforms`}
                        size="small"
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
const MobilePlatformGroupsList = ({
    handleEdit,
    handleDelete,
    handleDuplicate,
    hasResourcePermission,
    platformGroupIds,
    setPlatformGroupIds,
}: {
    handleEdit: (record: RaRecord) => void;
    handleDelete: (record: RaRecord) => void;
    handleDuplicate: (record: RaRecord) => void;
    hasResourcePermission: (resource: string, action: string) => boolean;
    platformGroupIds: number[];
    setPlatformGroupIds: (ids: number[]) => void;
}) => {
    const canEdit = hasResourcePermission('platformGroups', 'edit');
    const canDelete = hasResourcePermission('platformGroups', 'delete');

    const handleSelect = (record: RaRecord) => {
        const id = Number(record.id);
        if (platformGroupIds?.includes(id)) {
            setPlatformGroupIds(
                platformGroupIds?.filter((itemId: number) => itemId !== id)
            );
        } else {
            setPlatformGroupIds([...(platformGroupIds || []), id]);
        }
    };

    return (
        <Box sx={{ p: 1 }}>
            <SimpleList
                primaryText={(record: RaRecord) => (
                    <MobilePlatformGroupCard
                        record={record}
                        onEdit={canEdit ? handleEdit : undefined}
                        onDelete={canDelete ? handleDelete : undefined}
                        onDuplicate={canEdit ? handleDuplicate : undefined}
                        canEdit={canEdit}
                        canDelete={canDelete}
                        isSelected={platformGroupIds?.includes(
                            Number(record.id)
                        ) || false}
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

const PlatformGroupsList = () => {
    const {
        platformGroupIds,
        setPlatformGroupIds,
        setIsPlatformGroupModalOpen,
    } = usePlatformContext();
    const { hasResourcePermission } = useUserPermissions();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const notify = useNotify();
    const refresh = useRefresh();
    const [deleteOne] = useDelete();

    const canCreate = hasResourcePermission('platformGroups' as any, 'create');
    const canView = hasResourcePermission('platformGroups' as any, 'view');

    if (!canView) {
        return (
            <Box sx={{ p: 2, textAlign: 'center' }}>
                <Alert severity="warning">
                    You don't have permission to view platform groups.
                </Alert>
            </Box>
        );
    }

    const handleEdit = (record: RaRecord) => {
        setIsPlatformGroupModalOpen({
            open: true,
            record: record,
        });
    };

    const handleDelete = async (record: RaRecord) => {
        // Check if the platform group has any platforms
        if (record.platforms && record.platforms.length > 0) {
            notify(
                'Related platforms must be removed before deleting this group!',
                { type: 'warning' }
            );
            return;
        }

        try {
            await deleteOne('platform-group', { id: record.id });
            notify('Platform group deleted successfully', {
                type: 'success',
            });
            refresh();
        } catch (error) {
            notify('Error deleting platform group', { type: 'error' });
        }
    };

    const handleDuplicate = (record: RaRecord) => {
        const { id, ...rest } = record;
        setIsPlatformGroupModalOpen({
            open: true,
            record: {
                ...rest,
                id: undefined,
                title: rest.title ? rest.title + ' (Copy)' : undefined,
            },
        });
    };

    const ResponsiveContent = isMobile
        ? MobilePlatformGroupsList
        : DesktopPlatformGroupsList;

    return (
        <List
            sx={{ mx: 2 }}
            disableSyncWithLocation
            resource="platform-group"
            component="div"
            filter={{}}
            queryOptions={{
                meta: {
                    populate: ['platforms'],
                },
            }}
            actions={
                <SimpleToolbar
                    selectedIds={platformGroupIds || []}
                    setSelectedIds={setPlatformGroupIds}
                    hasCreateButton={false}
                >
                    {canCreate && (
                        <IconButton
                            color="primary"
                            size="medium"
                            onClick={() =>
                                setIsPlatformGroupModalOpen({
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
                        title="No platform groups found."
                        buttonText="Create Platform Group"
                        onClick={() =>
                            setIsPlatformGroupModalOpen({
                                open: true,
                                record: undefined,
                            })
                        }
                    />
                ) : (
                    <Box sx={{ p: 2, textAlign: 'center' }}>
                        <Typography color="text.secondary">
                            No platform groups found.
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
                setIsPlatformGroupModalOpen={setIsPlatformGroupModalOpen}
                platformGroupIds={platformGroupIds || []}
                setPlatformGroupIds={setPlatformGroupIds}
            />
        </List>
    );
};

export default PlatformGroupsList;
