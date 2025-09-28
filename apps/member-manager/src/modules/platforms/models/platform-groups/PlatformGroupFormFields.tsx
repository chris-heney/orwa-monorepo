import { Box, Grid2, Typography, useTheme, useMediaQuery } from '@mui/material';
import {
    BooleanInput,
    NumberInput,
    RecordContextProvider,
    SaveButton,
    SimpleForm,
    TextInput,
    Toolbar,
    useDataProvider,
    useNotify,
    useRecordContext,
    useRefresh,
} from 'react-admin';
import ModalHeader from '../../../../_components/ModalHeader';
import { createRecord } from '../../../../_utils/createRecord';
import { updateRecord } from '../../../../_utils/updateRecord';
import { validateModelField } from '../../../../_utils/validateModelName';
import { usePlatformContext } from '../../PlatformContext';

// Custom toolbar that won't cause routing issues
const CustomToolbar = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
    return (
        <Toolbar
            sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                backgroundColor: 'transparent',
                boxShadow: 'none',
                borderTop: '1px solid',
                borderColor: 'divider',
                mt: 2,
                pt: 2,
                ...(isMobile && {
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 10,
                    backgroundColor: theme.palette.background.paper,
                    boxShadow: `0px -2px 4px ${theme.palette.divider}`,
                    mt: 0,
                    pt: 1,
                    pb: 1,
                    px: 2,
                    justifyContent: 'center',
                }),
            }}
        >
            <SaveButton 
                sx={{
                    ...(isMobile && {
                        width: '100%',
                        '& .MuiButton-root': {
                            width: '100%',
                        }
                    })
                }}
            />
        </Toolbar>
    );
};

const PlatformGroupFormFields = ({
    isEdit = false,
    record: externalRecord,
}: {
    isEdit?: boolean;
    record?: any;
}) => {
    const { isPlatformGroupModalOpen, setIsPlatformGroupModalOpen } =
        usePlatformContext();
    const notify = useNotify();
    const refresh = useRefresh();
    const dataProvider = useDataProvider();
    const contextRecord = useRecordContext();

    // Use external record if provided, otherwise fall back to context
    const record = externalRecord || contextRecord;

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const formContent = (
        <Box
            sx={{
                bgcolor: 'background.paper',
                borderRadius: isMobile ? 0 : 1,
                overflow: 'hidden',
                ...(isMobile && {
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                }),
            }}
        >
            <ModalHeader
                title={`${isEdit ? 'Edit' : 'Create'} Platform Group`}
                onClose={() => setIsPlatformGroupModalOpen({ open: false })}
                redirect=""
            />
            <SimpleForm
                onSubmit={(data: any) => {
                    return isEdit
                        ? updateRecord(
                              data,
                              isPlatformGroupModalOpen.record!,
                              dataProvider,
                              notify,
                              refresh,
                              'platform-group',
                              () =>
                                  setIsPlatformGroupModalOpen({ open: false })
                          )
                        : createRecord(
                              data,
                              dataProvider,
                              notify,
                              refresh,
                              'platform-group',
                              () =>
                                  setIsPlatformGroupModalOpen({
                                      open: false,
                                  })
                          );
                }}
                toolbar={<CustomToolbar />}
                sx={{
                    p: isMobile ? { xs: 2, pb: 8 } : 2,
                    ...(isMobile && {
                        flexGrow: 1,
                        overflow: 'auto',
                    }),
                    '& .RaSimpleForm-form': {
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        ...(isMobile && {
                            paddingBottom: '60px', // Space for the fixed toolbar
                        }),
                    },
                }}
            >
                <Box>
                    <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ color: 'primary.main', fontWeight: 500, mb: 3 }}
                    >
                        Basic Information
                    </Typography>
                    <Grid2 container spacing={2}>
                        <Grid2 size={isMobile ? 12 : 6}>
                            <TextInput
                                source="key"
                                fullWidth
                                label="Key"
                                helperText="Unique identifier for this group"
                                validate={(value: string) =>
                                    validateModelField(
                                        value,
                                        'platform-group',
                                        'key',
                                        dataProvider,
                                        record
                                    )
                                }
                            />
                        </Grid2>
                        <Grid2 size={isMobile ? 12 : 6}>
                            <TextInput
                                source="icon"
                                fullWidth
                                label="Icon"
                                helperText="Emoji or icon for this group"
                            />
                        </Grid2>
                        <Grid2 size={12}>
                            <TextInput
                                source="title"
                                fullWidth
                                label="Title"
                                helperText="Display name for this platform group"
                            />
                        </Grid2>
                        <Grid2 size={12}>
                            <TextInput
                                source="purpose"
                                fullWidth
                                multiline
                                rows={isMobile ? 4 : 3}
                                label="Purpose"
                                helperText="Description of what this platform group is for"
                            />
                        </Grid2>
                        <Grid2 size={6}>
                            <NumberInput
                                source="sortOrder"
                                fullWidth
                                label="Sort Order"
                                helperText="Order in which this group should appear"
                            />
                        </Grid2>
                        <Grid2 size={6}>
                            <BooleanInput
                                source="isActive"
                                label="Active"
                                defaultValue={true}
                            />
                        </Grid2>
                    </Grid2>
                </Box>
            </SimpleForm>
        </Box>
    );

    // If external record is provided, wrap in RecordContextProvider
    if (externalRecord) {
        return (
            <RecordContextProvider value={externalRecord}>
                {formContent}
            </RecordContextProvider>
        );
    }

    return formContent;
};

export default PlatformGroupFormFields;
