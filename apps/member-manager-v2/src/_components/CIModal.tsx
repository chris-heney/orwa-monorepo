import { Box, Modal, useMediaQuery, useTheme } from '@mui/material';

const CIWebModal = ({
    isModalOpen,
    setIsModalOpen,
    children,
}: {
    isModalOpen: boolean;
    setIsModalOpen: (isModalOpen: boolean) => void;
    children: React.ReactNode;
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Modal
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            aria-labelledby="feature-package-modal"
            aria-describedby="create-new-feature-package"
            sx={{
                border: 'none',
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    ...(isMobile
                        ? {
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              transform: 'none',
                              maxWidth: '100%',
                              maxHeight: '100%',
                              borderRadius: 0,
                          }
                        : {
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)',
                              maxWidth: { sm: 400, md: 800 },
                              maxHeight: '90vh',
                          }),
                    overflow: 'auto',
                }}
            >
                {children}
            </Box>
        </Modal>
    );
};

export default CIWebModal;
