import { Box, Chip, Grid2, useMediaQuery, useTheme } from '@mui/material';
import { Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material';
import {
    RaRecord,
    useDelete,
    useGetList,
    useNotify,
    useRefresh,
} from 'react-admin';
import { useCoreServiceContext } from '../../CoreServiceContex';
import { MobileCoreServiceCard } from '../../components/MobileCoreServiceCards';
import CoreServiceReusableList from '../../components/ReusableList';

// Mobile version of the core services list
const MobileCoreServicesList = ({
    handleEdit,
    handleDelete,
    coreServiceIds,
    setCoreServiceIds,
    records,
}: {
    handleEdit: (record: RaRecord) => void;
    handleDelete: (record: RaRecord) => void;
    coreServiceIds: number[];
    setCoreServiceIds: (ids: number[]) => void;
    records: RaRecord[] | undefined;
    packageGroupIds: number[];
    featureIds: number[];
    packageIds: number[];
}) => {
    const handleSelect = (record: RaRecord) => {
        const id = Number(record.id);
        if (coreServiceIds.includes(id)) {
            setCoreServiceIds(
                coreServiceIds.filter((itemId: number) => itemId !== id)
            );
        } else {
            setCoreServiceIds([...coreServiceIds, id]);
        }
    };

    if (!records || records.length === 0) {
        return (
            <Box sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
                <p>No core services found.</p>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 2 }}>
            <Grid2 container spacing={2}>
                {records.map((record: RaRecord) => (
                    <Grid2 key={record.id} size={{ xs: 12, sm: 6, md: 4 }}>
                        <MobileCoreServiceCard
                            record={record}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            canEdit={true}
                            canDelete={true}
                            isSelected={coreServiceIds.includes(
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

const CoreServicesList = () => {
    const {
        coreServiceIds,
        setCoreServiceIds,
        setIsCoreServiceModalOpen,
        packageGroupIds,
        featureIds,
        packageIds,
    } = useCoreServiceContext();

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const notify = useNotify();
    const refresh = useRefresh();
    const [deleteOne] = useDelete();

    // Fetch data for mobile view
    const { data: records } = useGetList('core-service', {
        pagination: { page: 1, perPage: 1000 },
        filter: {
            'packageGroups.id': packageGroupIds,
            'features.id': featureIds,
            'packages.id': packageIds,
        },
        meta: {
            populate: 'packages,decks',
        },
    });

    const fields = [
        { source: 'name', label: 'Name' },
        { 
            source: 'active', 
            label: 'Active',
            render: (record: RaRecord) => {
                return record.active ? (
                    <CheckIcon sx={{ color: 'success.main', fontSize: 20 }} />
                ) : (
                    <CloseIcon sx={{ color: 'error.main', fontSize: 20 }} />
                );
            },
        },
        {
            source: 'decks',
            label: 'Decks',
            render: (record: RaRecord) => {
                if (!record?.decks?.length) return null;
                return (
                    <Grid2 py={0.5} container spacing={0.5}>
                        {record?.decks?.map((d: any) => (
                            <Grid2 key={d.id}>
                                <Chip label={d.name} />
                            </Grid2>
                        ))}
                    </Grid2>
                );
            },
        },
    ];

    const handleEdit = (record: RaRecord) => {
        setIsCoreServiceModalOpen({
            open: true,
            record: record,
        });
    };

    const handleDelete = async (record: RaRecord) => {
        // Check if the core service has any packages
        if (record.packages && record.packages.length > 0) {
            notify(
                'Related packages must be removed before deleting this service!',
                { type: 'warning' }
            );
            return;
        }

        try {
            await deleteOne('core-service', { id: record.id });
            notify('Core service deleted successfully', { type: 'success' });
            refresh();
        } catch (error) {
            notify('Error deleting core service', { type: 'error' });
        }
    };

    // Return mobile or desktop version based on screen size
    if (isMobile) {
        return (
            <MobileCoreServicesList
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                coreServiceIds={coreServiceIds}
                setCoreServiceIds={setCoreServiceIds}
                records={records}
                packageGroupIds={packageGroupIds}
                featureIds={featureIds}
                packageIds={packageIds}
            />
        );
    }

    return (
        <CoreServiceReusableList
            resource="coreServices"
            raResource="core-service"
            fields={fields}
            selectedIds={coreServiceIds}
            setSelectedIds={setCoreServiceIds}
            setModalOpen={setIsCoreServiceModalOpen}
            title="Core Services"
            emptyTitle="No core services found for the selected package groups and features."
            createButtonText="Create Core Service"
            filter={{
                'packageGroups.id': packageGroupIds,
                'features.id': featureIds,
                'packages.id': packageIds,
            }}
            queryOptions={{
                meta: {
                    populate: 'packages,decks',
                    raw: true,
                },
            }}
            onEdit={handleEdit}
            onDelete={handleDelete}
        />
    );
};

export default CoreServicesList;
