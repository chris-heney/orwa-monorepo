import { Box, Grid2, useMediaQuery, useTheme } from '@mui/material';
import {
    NumberField,
    RaRecord,
    useDelete,
    useGetList,
    useNotify,
    useRefresh,
} from 'react-admin';
import { useCoreServiceContext } from '../../CoreServiceContex';
import { MobilePackageGroupCard } from '../../components/MobileCoreServiceCards';
import CoreServiceReusableList from '../../components/ReusableList';

// Mobile version of the package groups list
const MobilePackageGroupsList = ({
    handleEdit,
    handleDelete,
    packageGroupIds,
    setPackageGroupIds,
    records,
}: {
    handleEdit: (record: RaRecord) => void;
    handleDelete: (record: RaRecord) => void;
    packageGroupIds: number[];
    setPackageGroupIds: (ids: number[]) => void;
    records: RaRecord[] | undefined;
}) => {
    const handleSelect = (record: RaRecord) => {
        const id = Number(record.id);
        if (packageGroupIds.includes(id)) {
            setPackageGroupIds(
                packageGroupIds.filter((itemId: number) => itemId !== id)
            );
        } else {
            setPackageGroupIds([...packageGroupIds, id]);
        }
    };

    if (!records || records.length === 0) {
        return (
            <Box sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
                <p>No package groups found.</p>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 2 }}>
            <Grid2 container spacing={2}>
                {records.map((record: RaRecord) => (
                    <Grid2 key={record.id} size={{ xs: 12, sm: 6, md: 4 }}>
                        <MobilePackageGroupCard
                            record={record}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            canEdit={true}
                            canDelete={true}
                            isSelected={packageGroupIds.includes(
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

const PackageGroupList = () => {
    const {
        packageGroupIds,
        setPackageGroupIds,
        coreServiceIds,
        setIsPackageGroupModalOpen,
        packageIds,
    } = useCoreServiceContext();

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const notify = useNotify();
    const refresh = useRefresh();
    const [deleteOne] = useDelete();

    // Fetch data for mobile view
    const { data: records } = useGetList('package-group', {
        pagination: { page: 1, perPage: 1000 },
        filter: {
            'coreServices.id': coreServiceIds,
            'packages.id': packageIds,
        },
    });

    const fields = [
        { source: 'name', label: 'Name' },
        {
            source: 'revenueMin',
            label: 'Min Revenue',
            component: NumberField,
        },
        {
            source: 'revenueMax',
            label: 'Max Revenue',
            component: NumberField,
        },
    ];

    const handleEdit = (record: RaRecord) => {
        setIsPackageGroupModalOpen({ open: true, record: record });
    };

    const handleDelete = async (record: RaRecord) => {
        try {
            await deleteOne('package-group', { id: record.id });
            notify('Package group deleted successfully', { type: 'success' });
            refresh();
        } catch (error) {
            notify('Error deleting package group', { type: 'error' });
        }
    };

    // Return mobile or desktop version based on screen size
    if (isMobile) {
        return (
            <MobilePackageGroupsList
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                packageGroupIds={packageGroupIds}
                setPackageGroupIds={setPackageGroupIds}
                records={records}
            />
        );
    }

    return (
        <CoreServiceReusableList
            resource="packageGroups"
            raResource="package-group"
            fields={fields}
            selectedIds={packageGroupIds}
            setSelectedIds={setPackageGroupIds}
            setModalOpen={setIsPackageGroupModalOpen}
            title="Package Groups"
            emptyTitle="No package groups found for the selected core services."
            createButtonText="Create Package Group"
            filter={{
                'coreServices.id': coreServiceIds,
                'packages.id': packageIds,
            }}
            onEdit={handleEdit}
            onDelete={handleDelete}
        />
    );
};

export default PackageGroupList;
