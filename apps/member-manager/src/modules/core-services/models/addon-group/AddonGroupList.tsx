import { Box, Chip, Grid2, useMediaQuery, useTheme } from '@mui/material';
import {
    RaRecord,
    useDelete,
    useGetList,
    useNotify,
    useRefresh,
} from 'react-admin';
import { useCoreServiceContext } from '../../CoreServiceContex';
import { MobileAddonGroupCard } from '../../components/MobileCoreServiceCards';
import CoreServiceReusableList from '../../components/ReusableList';

// Mobile version of the addon groups list
const MobileAddonGroupsList = ({
    handleEdit,
    handleDelete,
    addonGroupIds,
    setAddonGroupIds,
    records,
}: {
    handleEdit: (record: RaRecord) => void;
    handleDelete: (record: RaRecord) => void;
    addonGroupIds: number[];
    setAddonGroupIds: (ids: number[]) => void;
    records: RaRecord[] | undefined;
}) => {
    const handleSelect = (record: RaRecord) => {
        const id = Number(record.id);
        if (addonGroupIds.includes(id)) {
            setAddonGroupIds(
                addonGroupIds.filter((itemId: number) => itemId !== id)
            );
        } else {
            setAddonGroupIds([...addonGroupIds, id]);
        }
    };

    if (!records || records.length === 0) {
        return (
            <Box sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
                <p>No addon groups found.</p>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 2 }}>
            <Grid2 container spacing={2}>
                {records.map((record: RaRecord) => (
                    <Grid2 key={record.id} size={{ xs: 12, sm: 6, md: 4 }}>
                        <MobileAddonGroupCard
                            record={record}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            canEdit={true}
                            canDelete={true}
                            isSelected={addonGroupIds.includes(
                                Number(record.id)
                            )}
                            onSelect={handleSelect}
                        />
                    </Grid2>
                ))}
            </Grid2>
        </Box>
    );
};

const AddonGroupList = () => {
    const {
        addonGroupIds,
        setAddonGroupIds,
        setIsAddonGroupModalOpen,
        addonIds,
        coreServiceIds,
        packageIds,
    } = useCoreServiceContext();

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const notify = useNotify();
    const refresh = useRefresh();
    const [deleteOne] = useDelete();

    // Fetch data for mobile view
    const { data: records } = useGetList('addon-group', {
        pagination: { page: 1, perPage: 1000 },
        filter: {
            'addons.id': addonIds,
            coreServiceId: coreServiceIds,
            'packages.id': packageIds,
        },
        meta: {
            populate: ['addons'],
            raw: true,
        },
    });

    const fields = [
        { source: 'name', label: 'Name' },
        {
            source: 'addons',
            label: 'Addons',
            render: (record: RaRecord) => {
                return (
                    <Grid2 container spacing={1}>
                        {record?.addons?.map((addon: any) => (
                            <Grid2 key={addon.id}>
                                <Chip label={addon.name} />
                            </Grid2>
                        ))}
                    </Grid2>
                );
            },
        },
    ];

    const handleEdit = (record: RaRecord) => {
        setIsAddonGroupModalOpen({
            open: true,
            record: record,
        });
    };

    const handleDelete = async (record: RaRecord) => {
        try {
            await deleteOne('addon-group', { id: record.id });
            notify('Addon group deleted successfully', { type: 'success' });
            refresh();
        } catch (error) {
            notify('Error deleting addon group', { type: 'error' });
        }
    };

    // Return mobile or desktop version based on screen size
    if (isMobile) {
        return (
            <MobileAddonGroupsList
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                addonGroupIds={addonGroupIds}
                setAddonGroupIds={setAddonGroupIds}
                records={records}
            />
        );
    }

    return (
        <CoreServiceReusableList
            resource="addonGroups"
            raResource="addon-group"
            fields={fields}
            selectedIds={addonGroupIds}
            setSelectedIds={setAddonGroupIds}
            setModalOpen={setIsAddonGroupModalOpen}
            title="Addon Groups"
            emptyTitle="No addon groups found for the selected package groups and addons."
            createButtonText="Create Addon Group"
            filter={{
                'addons.id': addonIds,
                coreServiceId: coreServiceIds,
                'packages.id': packageIds,
            }}
            queryOptions={{
                meta: {
                    populate: ['addons'],
                    raw: true,
                },
            }}
            onEdit={handleEdit}
            onDelete={handleDelete}
        />
    );
};

export default AddonGroupList;
