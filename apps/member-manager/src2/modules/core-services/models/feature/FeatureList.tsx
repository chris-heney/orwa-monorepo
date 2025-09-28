import { Box, Chip, Grid2, useMediaQuery, useTheme } from '@mui/material';
import {
    RaRecord,
    useDelete,
    useGetList,
    useNotify,
    useRefresh,
} from 'react-admin';
import { useCoreServiceContext } from '../../CoreServiceContex';
import { MobileFeatureCard } from '../../components/MobileCoreServiceCards';
import CoreServiceReusableList from '../../components/ReusableList';

// Mobile version of the features list
const MobileFeaturesList = ({
    handleEdit,
    handleDelete,
    featureIds,
    setFeatureIds,
    records,
}: {
    handleEdit: (record: RaRecord) => void;
    handleDelete: (record: RaRecord) => void;
    featureIds: number[];
    setFeatureIds: (ids: number[]) => void;
    records: RaRecord[] | undefined;
}) => {
    const handleSelect = (record: RaRecord) => {
        const id = Number(record.id);
        if (featureIds.includes(id)) {
            setFeatureIds(featureIds.filter((itemId: number) => itemId !== id));
        } else {
            setFeatureIds([...featureIds, id]);
        }
    };

    if (!records || records.length === 0) {
        return (
            <Box sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
                <p>No features found.</p>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 2 }}>
            <Grid2 container spacing={2}>
                {records.map((record: RaRecord) => (
                    <Grid2 key={record.id} size={{ xs: 12, sm: 6, md: 4 }}>
                        <MobileFeatureCard
                            record={record}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            canEdit={true}
                            canDelete={true}
                            isSelected={featureIds.includes(Number(record.id))}
                            onSelect={handleSelect}
                        />
                    </Grid2>
                ))}
            </Grid2>
        </Box>
    );
};

const FeatureList = () => {
    const {
        featureIds,
        setFeatureIds,
        coreServiceIds,
        setIsFeatureModalOpen,
        packageIds,
    } = useCoreServiceContext();

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const notify = useNotify();
    const refresh = useRefresh();
    const [deleteOne] = useDelete();

    // Fetch data for mobile view
    const { data: records } = useGetList('feature', {
        pagination: { page: 1, perPage: 1000 },
        filter: {
            coreServiceId: coreServiceIds,
            'packages.id': packageIds,
        },
        meta: {
            populate: ['packages'],
            raw: true,
        },
    });

    const fields = [
        { source: 'name', label: 'Name' },
        { source: 'description', label: 'Description' },
        {
            source: 'packages',
            label: 'Packages',
            render: (record: RaRecord) => {
                if (!record?.packages?.length) return null;
                return (
                    <Grid2 py={0.5} container spacing={0.5}>
                        {record?.packages?.map((p: any) => (
                            <Grid2 key={p.id}>
                                <Chip label={p.name} />
                            </Grid2>
                        ))}
                    </Grid2>
                );
            },
        },
    ];

    const handleEdit = (record: RaRecord) => {
        setIsFeatureModalOpen({
            open: true,
            record: record,
        });
    };

    const handleDelete = async (record: RaRecord) => {
        try {
            await deleteOne('feature', { id: record.id });
            notify('Feature deleted successfully', { type: 'success' });
            refresh();
        } catch (error) {
            notify('Error deleting feature', { type: 'error' });
        }
    };

    // Return mobile or desktop version based on screen size
    if (isMobile) {
        return (
            <MobileFeaturesList
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                featureIds={featureIds}
                setFeatureIds={setFeatureIds}
                records={records}
            />
        );
    }

    return (
        <CoreServiceReusableList
            resource="features"
            raResource="feature"
            fields={fields}
            selectedIds={featureIds}
            setSelectedIds={setFeatureIds}
            setModalOpen={setIsFeatureModalOpen}
            title="Features"
            emptyTitle="No features found for the selected core services."
            createButtonText="Create Feature"
            filter={{
                coreServiceId: coreServiceIds,
                'packages.id': packageIds,
            }}
            queryOptions={{
                meta: {
                    populate: ['packages'],
                    raw: true,
                },
            }}
            onEdit={handleEdit}
            onDelete={handleDelete}
        />
    );
};

export default FeatureList;
