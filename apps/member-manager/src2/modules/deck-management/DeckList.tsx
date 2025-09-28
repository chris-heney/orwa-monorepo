import { customDatagridStyle } from '../../themes/customDatagridStyles';
import {
    ViewModule as DeckIcon,
    Edit as EditIcon,
    Star as StarIcon,
    Visibility as VisibilityIcon,
    ContentCopy as ContentCopyIcon,
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
    DatagridConfigurable,
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
} from 'react-admin';
import { useNavigate } from 'react-router-dom';

// Enhanced Mobile Card Component
const DeckMobileCard = ({ record }: { record: any }) => {
    const theme = useTheme();
    const navigate = useNavigate();

    return (
        <Card
            variant="outlined"
            onClick={() => navigate(`/deck/${record.id}`)}
            sx={{
                borderRadius: 3,
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                border: `1px solid ${theme.palette.divider}`,
                '&:hover': {
                    boxShadow: `0 8px 24px ${theme.palette.primary.main}15`,
                    transform: 'translateY(-2px)',
                    borderColor: theme.palette.primary.main,
                },
                '&:active': {
                    transform: 'translateY(0px)',
                },
            }}
        >
            <CardContent sx={{ p: 2.5 }}>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Avatar
                        sx={{
                            width: 52,
                            height: 52,
                            bgcolor: record.isDefault
                                ? 'warning.main'
                                : 'primary.main',
                            border: `2px solid ${theme.palette.background.paper}`,
                            boxShadow: theme.shadows[2],
                        }}
                    >
                        {record.isDefault ? <StarIcon /> : <DeckIcon />}
                    </Avatar>
                    <Box flex={1} minWidth={0}>
                        <Typography
                            variant="h6"
                            fontWeight={700}
                            sx={{
                                fontSize: '1.1rem',
                                lineHeight: 1.2,
                                mb: 0.5,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {record.name}
                        </Typography>
                        <Box
                            display="flex"
                            alignItems="center"
                            gap={1}
                            flexWrap="wrap"
                        >
                            {record.isDefault && (
                                <Chip
                                    label="Default"
                                    size="small"
                                    color="warning"
                                    sx={{
                                        height: 24,
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                    }}
                                />
                            )}
                            <Chip
                                label={`${record.steps?.length || 0} steps`}
                                size="small"
                                variant="outlined"
                                sx={{
                                    height: 24,
                                    fontSize: '0.75rem',
                                }}
                            />
                        </Box>
                    </Box>
                </Box>

                {/* Description and Actions */}
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Box flex={1} minWidth={0} mr={2}>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {record.description || 'No description'}
                        </Typography>
                    </Box>

                    <Box display="flex" gap={0.5}>
                        <IconButton
                            size="small"
                            onClick={e => {
                                e.stopPropagation();
                                navigate(`/deck/${record.id}/show`);
                            }}
                            sx={{
                                bgcolor: `${theme.palette.primary.main}08`,
                                '&:hover': {
                                    bgcolor: `${theme.palette.primary.main}15`,
                                },
                            }}
                        >
                            <VisibilityIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                            size="small"
                            onClick={e => {
                                e.stopPropagation();
                                navigate(`/deck/${record.id}`);
                            }}
                            sx={{
                                bgcolor: `${theme.palette.primary.main}08`,
                                '&:hover': {
                                    bgcolor: `${theme.palette.primary.main}15`,
                                },
                            }}
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

// Deck Actions Component
const DeckActions = ({ record }: { record: any }) => {
    const theme = useTheme();
    const navigate = useNavigate();

    return (
        <Stack direction="row" spacing={1}>
            <Tooltip title="View">
                <IconButton
                    size="small"
                    onClick={() => navigate(`/onboarding-deck/${record.id}/show`)}
                    sx={{
                        bgcolor: `${theme.palette.primary.main}08`,
                        '&:hover': {
                            bgcolor: `${theme.palette.primary.main}15`,
                        },
                    }}
                >
                    <VisibilityIcon fontSize="small" />
                </IconButton>
            </Tooltip>
            <Tooltip title="Edit">
                <IconButton
                    size="small"
                    onClick={() => navigate(`/onboarding-deck/${record.id}`)}
                    sx={{
                        bgcolor: `${theme.palette.primary.main}08`,
                        '&:hover': {
                            bgcolor: `${theme.palette.primary.main}15`,
                        },
                    }}
                >
                    <EditIcon fontSize="small" />
                </IconButton>
            </Tooltip>


            <Tooltip title="Copy to clipboard">
                <IconButton
                    size="small"
                    onClick={() => {
                        navigator.clipboard.writeText(
                            `https://onboard.ciwebgroup.com/?deckId=${record.id}`
                        );
                    }}
                    sx={{
                        bgcolor: `${theme.palette.primary.main}08`,
                        '&:hover': {
                            bgcolor: `${theme.palette.primary.main}15`,
                        },
                    }}
                >
                    <ContentCopyIcon fontSize="small" />
                </IconButton>
            </Tooltip>
        </Stack>
    );
};

// Responsive list component
const ResponsiveDeckList = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    if (isMobile) {
        return (
            <Box sx={{ p: 1 }}>
                <SimpleList
                    primaryText={record => <DeckMobileCard record={record} />}
                    linkType={false}
                    sx={{
                        '& .MuiListItem-root': {
                            padding: 0,
                            marginBottom: 1,
                        },
                        '& .MuiListItemText-root': {
                            margin: 0,
                        },
                    }}
                />
            </Box>
        );
    }

    return (
        <DatagridConfigurable
            rowClick="expand"
            sx={{
                ...customDatagridStyle,
                width: '100%',
                '& .RaDatagrid-table': {
                    width: '100%',
                    minWidth: '100%',
                    borderCollapse: 'separate',
                    borderSpacing: 0,
                },
                '& .RaDatagrid-thead': {
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                    backgroundColor: theme.palette.background.default,
                },
                '& .RaDatagrid-headerCell': {
                    padding: { xs: '12px 8px', sm: '16px 12px' },
                    fontSize: { xs: '0.875rem', sm: '0.875rem' },
                    fontWeight: 600,
                    borderBottom: `2px solid ${theme.palette.divider}`,
                    backgroundColor: theme.palette.background.default,
                    whiteSpace: 'nowrap',
                    position: 'sticky',
                    top: 0,
                },
                '& .RaDatagrid-cell': {
                    padding: { xs: '12px 8px', sm: '16px 12px' },
                    fontSize: { xs: '0.875rem', sm: '0.875rem' },
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    verticalAlign: 'middle',
                },
                '& .RaDatagrid-row': {
                    '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                    },
                },
            }}
            bulkActionButtons={false}
        >
            <TextField source="name" label="Name" />
            <TextField source="description" label="Description" />
            <FunctionField
                source="steps"
                label="Steps"
                render={(record: any) => (
                    <Chip
                        label={`${record.deckSteps?.length || 0} steps`}
                        size="small"
                        variant="outlined"
                    />
                )}
            />
            {/* <BooleanField source="isDefault" label="Default" /> */}
            <DateField source="updatedAt" label="Updated" showTime={false} />
            <ReferenceField source="packageId" reference="package" label="Associated Package" >
                <TextField source="name" />
            </ReferenceField>
            
            <FunctionField
                source="createdAt"
                sortable={false}
                cellClassName="align-right"
                label="Actions"
                render={(record: any) => {
                    return <DeckActions record={record} />;
                }}
            />
        </DatagridConfigurable>
    );
};

// Filters for the list
const DeckFilters = [
    <FilterLiveSearch
        source="name[$contains]"
        placeholder="Search decks..."
        alwaysOn
        sx={{
            '& .MuiInputBase-input': {
                fontSize: { xs: '0.875rem', sm: '1rem' },
            },
        }}
    />,
    <SelectInput
        source="isDefault[$eq]"
        choices={[
            { id: true, name: 'Default' },
            { id: false, name: 'Not Default' },
        ]}
        label="Default Status"
        emptyText="All Decks"
        sx={{
            minWidth: { xs: '120px', sm: '160px' },
        }}
    />,
];

// List actions toolbar
const DeckListActions = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <TopToolbar>
            <SelectColumnsButton size={isMobile ? 'small' : 'medium'} />
            <FilterButton size={isMobile ? 'small' : 'medium'} />
            <CreateButton
                label={isMobile ? 'Add' : 'Add Deck'}
                size={isMobile ? 'small' : 'medium'}
            />
            <ExportButton
                size={isMobile ? 'small' : 'medium'}
                sx={{
                    display: { xs: 'none', sm: 'inline-flex' },
                }}
            />
        </TopToolbar>
    );
};

const DeckListContent = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
            <Fade in timeout={600}>
                <Box sx={{ width: '100%' }}>
                    {/* Header Section */}
                    <Paper
                        elevation={0}
                        sx={{
                            p: { xs: 2, md: 3 },
                            mb: 2,
                            background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}15 100%)`,
                            border: `1px solid ${theme.palette.divider}`,
                            borderRadius: 2,
                            width: '100%',
                        }}
                    >
                        <Box display="flex" alignItems="center" gap={2}>
                            <Avatar
                                sx={{
                                    bgcolor: 'primary.main',
                                    width: { xs: 48, md: 56 },
                                    height: { xs: 48, md: 56 },
                                }}
                            >
                                <DeckIcon
                                    fontSize={isMobile ? 'medium' : 'large'}
                                />
                            </Avatar>
                            <Box>
                                <Typography
                                    variant="h4"
                                    fontWeight={600}
                                    gutterBottom
                                >
                                    Deck Management
                                </Typography>
                                <Typography
                                    variant="body1"
                                    color="text.secondary"
                                >
                                    Manage your onboarding workflow decks and
                                    configurations
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
                        <ResponsiveDeckList />
                    </Paper>
                </Box>
            </Fade>
    );
};

const DeckList = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <List
            filters={DeckFilters}
            actions={<DeckListActions />}
            perPage={isMobile ? 10 : 25}
            sort={{ field: 'name', order: 'ASC' }}
            disableSyncWithLocation
            component="div"
            queryOptions={{
                meta: {
                    populate: ['deckSteps'],
                },
            }}
            sx={{
                width: '100%',
                '& .RaList-main': {
                    width: '100%',
                },
                '& .RaList-content': {
                    width: '100%',
                },
                p: 0,
            }}
        >
            <DeckListContent />
        </List>
    );
};

export default DeckList;
