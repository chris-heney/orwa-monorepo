import { Box, Grid2, useMediaQuery, useTheme } from '@mui/material';
import {
    NumberField,
    RaRecord,
    ReferenceField,
    TextField,
    useDelete,
    useGetList,
    useNotify,
    useRefresh,
} from 'react-admin';
import { useCoreServiceContext } from '../../CoreServiceContex';
import { MobilePackageCard } from '../../components/MobileCoreServiceCards';
import CoreServiceReusableList from '../../components/ReusableList';

// Mobile version of the packages list
const MobilePackagesList = ({
    handleEdit,
    handleDelete,
    packageIds,
    setPackageIds,
    records,
}: {
    handleEdit: (record: RaRecord) => void;
    handleDelete: (record: RaRecord) => void;
    packageIds: number[];
    setPackageIds: (ids: number[]) => void;
    records: RaRecord[] | undefined;
}) => {
    const handleSelect = (record: RaRecord) => {
        const id = Number(record.id);
        if (packageIds.includes(id)) {
            setPackageIds(packageIds.filter((itemId: number) => itemId !== id));
        } else {
            setPackageIds([...packageIds, id]);
        }
    };

    if (!records || records.length === 0) {
        return (
            <Box sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
                <p>No packages found.</p>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 2 }}>
            <Grid2 container spacing={2}>
                {records.map((record: RaRecord) => (
                    <Grid2 key={record.id} size={{ xs: 12, sm: 6, md: 4 }}>
                        <MobilePackageCard
                            record={record}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            canEdit={true}
                            canDelete={true}
                            isSelected={packageIds.includes(Number(record.id))}
                            onSelect={handleSelect}
                        />
                    </Grid2>
                ))}
            </Grid2>
        </Box>
    );
};

const PackageList = () => {
    const {
        packageIds,
        setPackageIds,
        coreServiceIds,
        packageGroupIds,
        setIsPackageModalOpen,
    } = useCoreServiceContext();

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const notify = useNotify();
    const refresh = useRefresh();
    const [deleteOne] = useDelete();

    // Fetch data for mobile view
    const { data: records } = useGetList('package', {
        pagination: { page: 1, perPage: 1000 },
        filter: {
            coreServiceId: coreServiceIds,
            packageGroupId: packageGroupIds,
        },
    });

    const fields = [
        { source: 'name', label: 'Name' },
        { source: 'description', label: 'Description' },
        {
            source: 'investmentSetup',
            label: 'Setup Cost',
            component: NumberField,
        },
        {
            source: 'investmentRecurring',
            label: 'Recurring Cost',
            component: NumberField,
        },
        { source: 'investmentFrequency', label: 'Frequency' },
        {
            source: 'packageGroupId',
            label: 'Package Group',
            render: (record: RaRecord) => (
                <ReferenceField
                    source="packageGroupId"
                    reference="package-group"
                    record={record}
                >
                    <TextField source="name" />
                </ReferenceField>
            ),
        },
    ];

    const handleEdit = (record: RaRecord) => {
        setIsPackageModalOpen({
            open: true,
            record: record,
        });
    };

    const handleDelete = async (record: RaRecord) => {
        try {
            await deleteOne('package', { id: record.id });
            notify('Package deleted successfully', { type: 'success' });
            refresh();
        } catch (error) {
            notify('Error deleting package', { type: 'error' });
        }
    };

    // Return mobile or desktop version based on screen size
    if (isMobile) {
        return (
            <MobilePackagesList
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                packageIds={packageIds}
                setPackageIds={setPackageIds}
                records={records}
            />
        );
    }

    return (
        <CoreServiceReusableList
            resource="packages"
            raResource="package"
            fields={fields}
            selectedIds={packageIds}
            setSelectedIds={setPackageIds}
            setModalOpen={setIsPackageModalOpen}
            title="Packages"
            emptyTitle="No packages found for the selected core services and package groups."
            createButtonText="Create Package"
            filter={{
                coreServiceId: coreServiceIds,
                packageGroupId: packageGroupIds,
            }}
            onEdit={handleEdit}
            onDelete={handleDelete}
        />
    );
};

export default PackageList;
