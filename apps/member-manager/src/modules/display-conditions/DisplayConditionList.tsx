import { customDatagridStyle } from '../../themes/customDatagridStyles';
import {
    Settings as SettingsIcon,
    Edit as EditIcon,
    Visibility as VisibilityIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';
import {
    Avatar,
    Box,
    Card,
    CardContent,
    Chip,
    Fade,
    IconButton,
    Paper,
    Stack,
    Tooltip,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import {
    CreateButton,
    Datagrid,
    DateField,
    ExportButton,
    FilterButton,
    FilterLiveSearch,
    FunctionField,
    List,
    ReferenceField,
    SelectColumnsButton,
    SelectInput,
    SimpleList,
    TextField,
    TopToolbar,
    BooleanField,
    DeleteButton,
    EditButton,
    ShowButton,
} from 'react-admin';
import { useNavigate } from 'react-router-dom';

// Enhanced Mobile Card Component
const DisplayConditionMobileCard = ({ record }: { record: any }) => {
    const theme = useTheme();
    const navigate = useNavigate();

    const getRuleTypeColor = (ruleType: string) => {
        const colors = {
            PAYLOAD_FIELD: 'primary',
            URL_PARAM: 'secondary',
            PACKAGE_SELECTED: 'success',
            CORE_SERVICE_SELECTED: 'info',
            INDUSTRY: 'warning',
            ALWAYS_SHOW: 'success',
            NEVER_SHOW: 'error',
            CUSTOM_LOGIC: 'default',
        };
        return colors[ruleType as keyof typeof colors] || 'default';
    };

    const getOperatorColor = (operator: string) => {
        const colors = {
            EQUALS: 'primary',
            NOT_EQUALS: 'secondary',
            CONTAINS: 'info',
            NOT_CONTAINS: 'warning',
            IN: 'success',
            NOT_IN: 'error',
            EXISTS: 'default',
            NOT_EXISTS: 'default',
        };
        return colors[operator as keyof typeof colors] || 'default';
    };

    return (
        <Card
            sx={{
                mb: 2,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows[4],
                },
            }}
        >
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box flex={1}>
                        <Typography variant="h6" gutterBottom>
                            {record.field || 'No Field'}
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" mb={1}>
                            <Chip
                                label={record.ruleType}
                                color={getRuleTypeColor(record.ruleType) as any}
                                size="small"
                                variant="outlined"
                            />
                            <Chip
                                label={record.operator}
                                color={getOperatorColor(record.operator) as any}
                                size="small"
                                variant="filled"
                            />
                            {record.isRequired && (
                                <Chip
                                    label="Required"
                                    color="error"
                                    size="small"
                                    variant="outlined"
                                />
                            )}
                        </Stack>
                        <Typography variant="body2" color="text.secondary" noWrap>
                            Value: {record.value}
                        </Typography>
                    </Box>
                    <Box display="flex" flexDirection="column" gap={1}>
                        <IconButton
                            size="small"
                            onClick={() => navigate(`/onboarding-display-condition/${record.id}/show`)}
                        >
                            <VisibilityIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                            size="small"
                            onClick={() => navigate(`/onboarding-display-condition/${record.id}`)}
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

// Enhanced filters
const DisplayConditionFilters = [
    <FilterLiveSearch key="search" source="q" alwaysOn />,
    <SelectInput
        key="ruleType"
        source="ruleType"
        label="Rule Type"
        choices={[
            { id: 'PAYLOAD_FIELD', name: 'Payload Field' },
            { id: 'URL_PARAM', name: 'URL Parameter' },
            { id: 'PACKAGE_SELECTED', name: 'Package Selected' },
            { id: 'CORE_SERVICE_SELECTED', name: 'Core Service Selected' },
            { id: 'INDUSTRY', name: 'Industry' },
            { id: 'SESSION_RESUMED', name: 'Session Resumed' },
            { id: 'ORGANIZATION_EXISTS', name: 'Organization Exists' },
            { id: 'ALWAYS_SHOW', name: 'Always Show' },
            { id: 'NEVER_SHOW', name: 'Never Show' },
            { id: 'CUSTOM_LOGIC', name: 'Custom Logic' },
        ]}
    />,
    <SelectInput
        key="operator"
        source="operator"
        label="Operator"
        choices={[
            { id: 'EQUALS', name: 'Equals' },
            { id: 'NOT_EQUALS', name: 'Not Equals' },
            { id: 'CONTAINS', name: 'Contains' },
            { id: 'NOT_CONTAINS', name: 'Not Contains' },
            { id: 'GREATER_THAN', name: 'Greater Than' },
            { id: 'LESS_THAN', name: 'Less Than' },
            { id: 'EXISTS', name: 'Exists' },
            { id: 'NOT_EXISTS', name: 'Not Exists' },
            { id: 'IN', name: 'In' },
            { id: 'NOT_IN', name: 'Not In' },
            { id: 'REGEX_MATCH', name: 'Regex Match' },
        ]}
    />,
];

// Enhanced Actions
const DisplayConditionListActions = () => (
    <TopToolbar>
        <FilterButton />
        <CreateButton />
        <ExportButton />
        <SelectColumnsButton />
    </TopToolbar>
);

// Responsive List Component
const ResponsiveDisplayConditionList = () => {
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <List
            filters={DisplayConditionFilters}
            actions={<DisplayConditionListActions />}
            perPage={25}
            sort={{ field: 'createdAt', order: 'DESC' }}
            sx={{ 
                '& .RaList-main': { 
                    backgroundColor: 'transparent',
                    '& .MuiPaper-root': {
                        backgroundColor: 'transparent',
                        boxShadow: 'none',
                    }
                } 
            }}
        >
            {isSmall ? (
                <SimpleList
                    primaryText={(record) => record.field || 'No Field'}
                    secondaryText={(record) => `${record.ruleType} ${record.operator}`}
                    tertiaryText={(record) => record.value}
                />
            ) : (
                <Datagrid
                    sx={customDatagridStyle}
                    rowClick="show"
                    bulkActionButtons={false}
                >
                    <ReferenceField 
                        source="onboardingStepId" 
                        reference="onboarding-step" 
                        link={false}
                        label="Step"
                    >
                        <TextField source="label" />
                    </ReferenceField>
                    <FunctionField
                        label="Rule Type"
                        render={(record: any) => (
                            <Chip
                                label={record.ruleType}
                                color="primary"
                                size="small"
                                variant="outlined"
                            />
                        )}
                    />
                    <TextField source="field" label="Field" />
                    <FunctionField
                        label="Operator"
                        render={(record: any) => (
                            <Chip
                                label={record.operator}
                                color="secondary"
                                size="small"
                            />
                        )}
                    />
                    <TextField source="value" label="Value" />
                    <BooleanField source="isRequired" label="Required" />
                    <DateField source="createdAt" label="Created" showTime />
                    <Box component="div">
                        <ShowButton />
                        <EditButton />
                        <DeleteButton />
                    </Box>
                </Datagrid>
            )}
        </List>
    );
};

// Main List Component with Header
const DisplayConditionListContent = () => {
    const theme = useTheme();

    return (
            <Fade in timeout={500}>
                <Box>
                    {/* Header Section */}
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            mb: 3,
                            background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}15 100%)`,
                            borderRadius: 2,
                            border: `1px solid ${theme.palette.divider}`,
                        }}
                    >
                        <Box display="flex" alignItems="center" gap={2}>
                            <Avatar
                                sx={{
                                    bgcolor: theme.palette.primary.main,
                                    width: 56,
                                    height: 56,
                                }}
                            >
                                <SettingsIcon
                                    sx={{
                                        fontSize: 28,
                                        color: theme.palette.primary.contrastText,
                                    }}
                                />
                            </Avatar>
                            <Box>
                                <Typography
                                    variant="h4"
                                    fontWeight={600}
                                    gutterBottom
                                >
                                    Display Conditions
                                </Typography>
                                <Typography
                                    variant="body1"
                                    color="text.secondary"
                                >
                                    Manage dynamic display rules for onboarding steps
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>

                    {/* Main Content */}
                    <Paper
                        elevation={0}
                        sx={{
                            overflow: 'hidden',
                            width: '100%',
                            border: 0,
                        }}
                    >
                        <ResponsiveDisplayConditionList />
                    </Paper>
                </Box>
            </Fade>
    );
};

const DisplayConditionList = () => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                backgroundColor: theme.palette.background.default,
                minHeight: '100vh',
                p: { xs: 1, sm: 2, md: 3 },
            }}
        >
            <DisplayConditionListContent />
        </Box>
    );
};

export default DisplayConditionList;
