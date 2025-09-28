import { Box, Chip, Grid2, useMediaQuery, useTheme } from '@mui/material';
import {
    NumberField,
    RaRecord,
    useDelete,
    useGetList,
    useNotify,
    useRefresh,
} from 'react-admin';
import { useCoreServiceContext } from '../../CoreServiceContex';
import { MobileAddonCard } from '../../components/MobileCoreServiceCards';
import CoreServiceReusableList from '../../components/ReusableList';

// Mobile version of the addons list
const MobileAddonsList = ({
    handleEdit,
    handleDelete,
    addonIds,
    setAddonIds,
    records,
}: {
    handleEdit: (record: RaRecord) => void;
    handleDelete: (record: RaRecord) => void;
    addonIds: number[];
    setAddonIds: (ids: number[]) => void;
    records: RaRecord[] | undefined;
}) => {
    const handleSelect = (record: RaRecord) => {
        const id = Number(record.id);
        if (addonIds.includes(id)) {
            setAddonIds(addonIds.filter((itemId: number) => itemId !== id));
        } else {
            setAddonIds([...addonIds, id]);
        }
    };

    const handleDuplicate = (record: RaRecord) => {
        // This would be handled by the parent component
        handleEdit({
            ...record,
            name: record.name + ' (Copy)',
            id: undefined,
        });
    };

    if (!records || records.length === 0) {
        return (
            <Box sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
                <p>No addons found.</p>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 2 }}>
            <Grid2 container spacing={2}>
                {records.map((record: RaRecord) => (
                    <Grid2 key={record.id} size={{ xs: 12, sm: 6, md: 4 }}>
                        <MobileAddonCard
                            record={record}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onDuplicate={handleDuplicate}
                            canEdit={true}
                            canDelete={true}
                            isSelected={addonIds.includes(Number(record.id))}
                            onSelect={handleSelect}
                        />
                    </Grid2>
                ))}
            </Grid2>
        </Box>
    );
};

const AddonList = () => {
    const {
        addonIds,
        setAddonIds,
        coreServiceIds,
        setIsAddonModalOpen,
        addonGroupIds,
        packageIds,
    } = useCoreServiceContext();

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const notify = useNotify();
    const refresh = useRefresh();
    const [deleteOne] = useDelete();

    // Fetch data for mobile view
    const { data: records } = useGetList('addon', {
        pagination: { page: 1, perPage: 1000 },
        filter: {
            coreServiceId: coreServiceIds,
            'packages.id': packageIds,
            'addonGroup.id': addonGroupIds,
        },
        meta: {
            populate: ['addonGroup'],
            raw: true,
        },
    });

    const fields = [
        { source: 'name', label: 'Name' },
        {
            source: 'investmentSetup',
            label: 'Setup',
            component: NumberField,
        },
        {
            source: 'investmentEa',
            label: 'Per Unit',
            component: NumberField,
        },
        {
            source: 'investmentRecurring',
            label: 'Recurring',
            component: NumberField,
        },
        {
            source: 'addonGroup',
            label: 'Group',
            render: (record: RaRecord) => {
                return (
                    <Grid2 container spacing={1}>
                        {record?.addonGroup?.map((addon: any) => (
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
        setIsAddonModalOpen({
            open: true,
            record: record,
        });
    };

    const handleDelete = async (record: RaRecord) => {
        try {
            await deleteOne('addon', { id: record.id });
            notify('Addon deleted successfully', { type: 'success' });
            refresh();
        } catch (error) {
            notify('Error deleting addon', { type: 'error' });
        }
    };

    // Return mobile or desktop version based on screen size
    if (isMobile) {
        return (
            <MobileAddonsList
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                addonIds={addonIds}
                setAddonIds={setAddonIds}
                records={records}
            />
        );
    }

    return (
        <CoreServiceReusableList
            resource="addons"
            raResource="addon"
            fields={fields}
            selectedIds={addonIds}
            setSelectedIds={setAddonIds}
            setModalOpen={setIsAddonModalOpen}
            title="Addons"
            emptyTitle="No addons found for the selected core services."
            createButtonText="Create Addon"
            filter={{
                coreServiceId: coreServiceIds,
                'packages.id': packageIds,
                'addonGroup.id': addonGroupIds,
            }}
            queryOptions={{
                meta: {
                    populate: ['addonGroup'],
                    raw: true,
                },
            }}
            hasDuplicate
            onDelete={handleDelete}
        />
    );
};

export default AddonList;
