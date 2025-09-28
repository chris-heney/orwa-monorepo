import {
    Box,
    CircularProgress,
    Container,
    Fade,
    Paper,
    Stack,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { useState } from 'react';
import {
    Create,
    FormTab,
    TabbedForm,
    useDataProvider,
    useNotify,
    useRedirect,
    useRefresh,
} from 'react-admin';

// Import tab components
import BasicDetailsTab from './form-sections/basic-details/BasicDetailsTab';

// Import default values
import { Organization } from '@ci-connect/types';
import { FieldValues } from 'react-hook-form';
import { createRecord } from '../../_utils/createRecord';
import { cleanRecord, removeNullValues } from './utils';

// Icons
import BusinessIcon from '@mui/icons-material/Business';

const TabConfig = [
    {
        key: 'basic',
        label: 'Basic Details',
        icon: <BusinessIcon />,
        component: BasicDetailsTab,
    },
];

const OrganizationCreateForm = (props: any) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const refresh = useRefresh();
    const redirect = useRedirect();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (formData: FieldValues) => {
        setIsLoading(true);
        // Remove specific fields we don't want to send
        const { industry, ...dataWithoutExcluded } = formData;

        // Remove all null values and clean the data
        const dataToSubmit = removeNullValues(
            cleanRecord(dataWithoutExcluded as Organization)
        );

        return createRecord(
            dataToSubmit,
            dataProvider,
            notify,
            refresh,
            'organization',
            (record: any) => {
                console.log('record', record);
                setIsLoading(false);
                redirect(`/organization/${record.id}`);
            },
            {
                publish: ['created_organization'],
            }
        ).catch(() => {
            setIsLoading(false);
        });
    };

    return (
        <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
            <Fade in timeout={600}>
                <Box>
                    {/* Header Section */}
                    <Paper
                        elevation={0}
                        sx={{
                            p: { xs: 2, md: 4 },
                            mb: 3,
                            background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}15 100%)`,
                            border: `1px solid ${theme.palette.divider}`,
                            borderRadius: 2,
                        }}
                    >
                        <Stack
                            direction="row"
                            alignItems="center"
                            spacing={2}
                            sx={{ mb: 2 }}
                        >
                            <Box
                                sx={{
                                    p: 1.5,
                                    borderRadius: 2,
                                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                                    color: 'white',
                                    boxShadow: theme.shadows[3],
                                }}
                            >
                                <BusinessIcon />
                            </Box>
                            <Box>
                                <Typography
                                    variant={isMobile ? 'h5' : 'h4'}
                                    fontWeight="bold"
                                    color="text.primary"
                                >
                                    Create Organization
                                </Typography>
                                <Typography
                                    variant="body1"
                                    color="text.secondary"
                                >
                                    Set up your organization profile with
                                    comprehensive details
                                </Typography>
                            </Box>
                        </Stack>
                    </Paper>

                    {/* Form Section */}
                    <Paper
                        elevation={0}
                        sx={{
                            border: `1px solid ${theme.palette.divider}`,
                            borderRadius: 2,
                            overflow: 'hidden',
                        }}
                    >
                        <TabbedForm
                            onSubmit={handleSubmit}
                            sx={{
                                '& .RaTabbedForm-content': {
                                    p: 0,
                                    backgroundColor: 'transparent',
                                    borderRadius: 0,
                                    boxShadow: 'none',
                                },
                                '& .MuiTabs-root': {
                                    backgroundColor:
                                        theme.palette.background.paper,
                                    borderBottom: `1px solid ${theme.palette.divider}`,
                                    minHeight: isMobile ? 40 : 48,
                                    '& .MuiTabs-flexContainer': {
                                        overflowX: 'auto',
                                        '&::-webkit-scrollbar': {
                                            height: 4,
                                        },
                                        '&::-webkit-scrollbar-track': {
                                            backgroundColor:
                                                theme.palette.action.hover,
                                        },
                                        '&::-webkit-scrollbar-thumb': {
                                            backgroundColor:
                                                theme.palette.primary.main,
                                            borderRadius: 2,
                                        },
                                        scrollbarWidth: 'thin',
                                        scrollbarColor: `${theme.palette.primary.main} ${theme.palette.action.hover}`,
                                    },
                                },
                                '& .MuiTab-root': {
                                    minWidth: isMobile ? 'auto' : 'auto',
                                    minHeight: isMobile ? 40 : 48,
                                    px: isMobile ? 1 : 1.5,
                                    py: isMobile ? 0.5 : 0.75,
                                    fontWeight: 500,
                                    fontSize: isMobile ? '0.75rem' : '0.875rem',
                                    transition: 'all 0.3s ease',
                                    borderRadius: 0,
                                    textTransform: 'none',
                                    flexShrink: 0,
                                    '&:hover': {
                                        backgroundColor:
                                            theme.palette.action.hover,
                                        color: theme.palette.primary.main,
                                    },
                                    '&.Mui-selected': {
                                        backgroundColor: 'transparent',
                                        color: theme.palette.primary.main,
                                        fontWeight: 600,
                                        position: 'relative',
                                        '&::after': {
                                            content: '""',
                                            position: 'absolute',
                                            bottom: 0,
                                            left: 0,
                                            right: 0,
                                            height: 2,
                                            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                            borderRadius: '2px 2px 0 0',
                                        },
                                    },
                                },
                                '& .MuiTabPanel-root': {
                                    p: { xs: 2, md: 4 },
                                },
                            }}
                        >
                            {TabConfig.map((tab, index) => (
                                <FormTab
                                    key={tab.key}
                                    label={
                                        <Stack
                                            direction="row"
                                            alignItems="center"
                                            spacing={1}
                                        >
                                            {tab.icon}
                                            <Typography
                                                variant="inherit"
                                                sx={{
                                                    display: {
                                                        xs: 'none',
                                                        sm: 'block',
                                                    },
                                                }}
                                            >
                                                {tab.label}
                                            </Typography>
                                        </Stack>
                                    }
                                    sx={{
                                        minHeight: 'calc(100vh - 300px)',
                                        '& .MuiBox-root': {
                                            maxWidth: '100%',
                                        },
                                    }}
                                >
                                    <Fade in timeout={300}>
                                        <Box>
                                            <tab.component />
                                        </Box>
                                    </Fade>
                                </FormTab>
                            ))}
                        </TabbedForm>
                    </Paper>
                </Box>
            </Fade>

            {/* Loading Overlay */}
            {isLoading && (
                <Fade in>
                    <Box
                        sx={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            zIndex: 1300,
                            backgroundColor: 'rgba(255,255,255,0.9)',
                            backdropFilter: 'blur(4px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column',
                        }}
                    >
                        <CircularProgress
                            size={60}
                            thickness={4}
                            sx={{
                                color: theme.palette.primary.main,
                                mb: 2,
                            }}
                        />
                        <Typography
                            variant="h6"
                            color="text.primary"
                            sx={{ mb: 1 }}
                        >
                            Creating Organization...
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Please wait while we set up your organization
                            profile
                        </Typography>
                    </Box>
                </Fade>
            )}
        </Container>
    );
};

// Main component
const OrganizationCreate = (props: any) => {
    return (
        <Create
            resource="organization"
            {...props}
            mutationMode="pessimistic"
            component="div"
        >
            <OrganizationCreateForm />
        </Create>
    );
};

export default OrganizationCreate;
