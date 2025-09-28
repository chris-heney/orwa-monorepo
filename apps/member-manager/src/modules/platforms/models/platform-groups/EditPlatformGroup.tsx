import { Box, CircularProgress } from '@mui/material';
import { useGetOne } from 'react-admin';
import { usePlatformContext } from "../../PlatformContext";
import PlatformGroupFormFields from "./PlatformGroupFormFields";

const EditPlatformGroup = () => {
    const { isPlatformGroupModalOpen } = usePlatformContext();

    const {
        data: record,
        isLoading,
        error,
    } = useGetOne(
        "platform-group",
        { id: isPlatformGroupModalOpen.record?.id },
        {
            meta: {
                populate: ["platforms"],
            },
            enabled: !!isPlatformGroupModalOpen.record?.id,
        }
    );

    if (isLoading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="200px"
            >
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="200px"
            >
                <div>Error loading platform group</div>
            </Box>
        );
    }

    return <PlatformGroupFormFields isEdit record={record} />;
};

export default EditPlatformGroup;
