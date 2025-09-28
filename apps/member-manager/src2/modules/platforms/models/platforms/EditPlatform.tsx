import { Box, CircularProgress } from '@mui/material';
import { useGetOne } from 'react-admin';
import { usePlatformContext } from "../../PlatformContext";
import PlatformFormFields from "./PlatformFormFields";

const EditPlatform = () => {
    const { isPlatformModalOpen } = usePlatformContext();

    const {
        data: record,
        isLoading,
        error,
    } = useGetOne(
        "platform",
        { id: isPlatformModalOpen.record?.id },
        {
            meta: {
                populate: ["platformGroup"],
            },
            enabled: !!isPlatformModalOpen.record?.id,
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
                <div>Error loading platform</div>
            </Box>
        );
    }

    return <PlatformFormFields isEdit record={record} />;
};

export default EditPlatform;
