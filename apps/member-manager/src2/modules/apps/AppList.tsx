import {
    Add as AddIcon,
    Close as CloseIcon,
    Search as SearchIcon,
    Tune as TuneIcon,
} from '@mui/icons-material';
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    FormControl,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    TextField as MuiTextField,
    Paper,
    Select,
    Stack,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { useState } from 'react';
import {
    CreateButton,
    Datagrid,
    DateField,
    FunctionField,
    List,
    TextField,
    useListContext,
    useListFilterContext,
    useRecordContext,
} from 'react-admin';
import { useNavigate } from 'react-router-dom';
import {
    AppCategoryField,
    AppExpandView,
    AppIconField,
    AppQuickActions,
    AppStatusField,
    AppUrlField,
} from './components';

// Enhanced expand view with action buttons
const AppExpandViewWithActions = () => {
    const record = useRecordContext();

    if (!record) return null;

    return <AppExpandView />;
};

// Enhanced Mobile Card Component
const AppMobileCard = ({ record }: { record: any }) => {
    const theme = useTheme();
    const navigate = useNavigate();

    // Add additional validation
    if (!record || typeof record !== 'object') {
        return null;
    }

    const hasUrl = Boolean(record.url);
    const hasDescription = Boolean(record.description);

    return (
        <Card
            sx={{
                mb: 1,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                overflow: 'hidden',
                transition: 'all 0.2s',
                '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: `0 4px 12px ${theme.palette.primary.main}20`,
                },
            }}
            onClick={() => navigate(`/app/${record.id}/show`)}
        >
            <CardContent sx={{ p: 2 }}>
                <Grid container spacing={2}>
                    <Grid item xs={3} sm={2}>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'flex-start',
                                pt: 1,
                            }}
                        >
                            <AppIconField size="medium" record={record} />
                        </Box>
                    </Grid>
                    <Grid item xs={9} sm={10}>
                        <Stack spacing={0.5}>
                            <Typography variant="subtitle1" fontWeight="bold">
                                {record.name}
                            </Typography>

                            {hasDescription && (
                                <Typography
                                    variant="body2"
                                    color="textSecondary"
                                    sx={{
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                        mb: 1,
                                    }}
                                >
                                    {record.description}
                                </Typography>
                            )}

                            <Box
                                sx={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: 1,
                                    alignItems: 'center',
                                }}
                            >
                                <AppCategoryField />
                                <AppStatusField />

                                {hasUrl && (
                                    <Chip
                                        size="small"
                                        label="URL"
                                        color="info"
                                        variant="outlined"
                                    />
                                )}
                            </Box>
                        </Stack>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};
// Modern Search and Filter Component for Apps
const ModernAppSearchFilters = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const { filterValues, setFilters } = useListFilterContext();

    // Handle search input
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
        setFilters({ ...filterValues, q: event.target.value || undefined });
    };

    // Clear search
    const handleClearSearch = () => {
        setSearchValue('');
        setFilters({ ...filterValues, q: undefined });
    };

    // Toggle filters
    const handleToggleFilters = () => {
        setFiltersOpen(!filtersOpen);
    };

    // Update category filter
    const handleCategoryChange = (event: any) => {
        setFilters({
            ...filterValues,
            category:
                event.target.value === 'all' ? undefined : event.target.value,
        });
    };

    // Update active filter
    const handleActiveChange = (event: any) => {
        setFilters({
            ...filterValues,
            isActive:
                event.target.value === 'all'
                    ? undefined
                    : event.target.value === 'true',
        });
    };

    return (
        <Paper
            elevation={0}
            sx={{
                p: 2,
                mb: 2,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
            }}
        >
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={6}>
                    <MuiTextField
                        fullWidth
                        placeholder="Search apps..."
                        variant="outlined"
                        size="small"
                        value={searchValue}
                        onChange={handleSearch}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="action" />
                                </InputAdornment>
                            ),
                            endAdornment: searchValue ? (
                                <InputAdornment position="end">
                                    <IconButton
                                        size="small"
                                        onClick={handleClearSearch}
                                        edge="end"
                                    >
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                </InputAdornment>
                            ) : null,
                        }}
                    />
                </Grid>

                <Grid item xs={8} md={3}>
                    <Button
                        variant={filtersOpen ? 'contained' : 'outlined'}
                        color="primary"
                        startIcon={<TuneIcon />}
                        onClick={handleToggleFilters}
                        fullWidth={isMobile}
                    >
                        Filters
                    </Button>
                </Grid>

                <Grid item xs={4} md={3} sx={{ textAlign: 'right' }}>
                    <CreateButton
                        label={isMobile ? 'New' : 'Add App'}
                        icon={<AddIcon />}
                    />
                </Grid>

                {filtersOpen && (
                    <Grid item xs={12}>
                        <Box sx={{ pt: 1 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6} md={4}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel id="category-label">
                                            Category
                                        </InputLabel>
                                        <Select
                                            labelId="category-label"
                                            value={
                                                filterValues.category || 'all'
                                            }
                                            label="Category"
                                            onChange={handleCategoryChange}
                                        >
                                            <MenuItem value="all">
                                                All Categories
                                            </MenuItem>
                                            <MenuItem value="CONTENT">
                                                Content
                                            </MenuItem>
                                            <MenuItem value="DESIGN">
                                                Design
                                            </MenuItem>
                                            <MenuItem value="DEVELOPMENT">
                                                Development
                                            </MenuItem>
                                            <MenuItem value="SUPPORT">
                                                Support
                                            </MenuItem>
                                            <MenuItem value="MARKETING">
                                                Marketing
                                            </MenuItem>
                                            <MenuItem value="ADMIN">
                                                Admin
                                            </MenuItem>
                                            <MenuItem value="OTHER">
                                                Other
                                            </MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel id="active-label">
                                            Status
                                        </InputLabel>
                                        <Select
                                            labelId="active-label"
                                            value={
                                                filterValues.isActive ===
                                                undefined
                                                    ? 'all'
                                                    : filterValues.isActive.toString()
                                            }
                                            label="Status"
                                            onChange={handleActiveChange}
                                        >
                                            <MenuItem value="all">
                                                All Statuses
                                            </MenuItem>
                                            <MenuItem value="true">
                                                Active
                                            </MenuItem>
                                            <MenuItem value="false">
                                                Inactive
                                            </MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => {
                                            setSearchValue('');
                                            setFilters({});
                                        }}
                                    >
                                        Clear Filters
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                )}
            </Grid>
        </Paper>
    );
};

// Simplified filters since we have modern component
const AppFilters = [];

// Responsive list component with reduced columns
const ResponsiveAppList = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    if (isMobile) {
        return (
            <Box>
                <Box sx={{ mb: 2 }}>
                    <ModernAppSearchFilters />
                </Box>
                <AppMobileList />
            </Box>
        );
    }

    return (
        <Box>
            <Box sx={{ mb: 2 }}>
                <ModernAppSearchFilters />
            </Box>
            <Datagrid
                rowClick="expand"
                expand={<AppExpandViewWithActions />}
                bulkActionButtons={false}
                sx={{
                    '& .RaDatagrid-headerCell': {
                        fontWeight: 'bold',
                    },
                    '& .RaDatagrid-row': {
                        '&:hover': {
                            backgroundColor: theme.palette.action.hover,
                        },
                    },
                }}
            >
                <FunctionField label="App" render={() => <AppIconField />} />
                <FunctionField
                    label="Category"
                    render={() => <AppCategoryField />}
                />
                <FunctionField
                    label="Name"
                    render={() => <TextField source="name" />}
                />
                <TextField source="description" label="Description" />
                <FunctionField label="URL" render={() => <AppUrlField />} />
                <FunctionField
                    label="Status"
                    render={() => <AppStatusField />}
                />
                <FunctionField
                    label="Last Updated"
                    render={() => <DateField source="updatedAt" showTime />}
                />
                <AppQuickActions />
            </Datagrid>
        </Box>
    );
};

// Mobile list component
const AppMobileList = () => {
    const { data } = useListContext();

    // Ensure data is available and is an array
    if (!data || !Array.isArray(data) || data.length === 0) {
        return (
            <Box p={2} textAlign="center">
                <Typography variant="body1" color="textSecondary">
                    No applications found
                </Typography>
            </Box>
        );
    }

    return (
        <Stack spacing={1}>
            {data.map((record: any) =>
                record && record.id ? (
                    <AppMobileCard record={record} key={record.id} />
                ) : null
            )}
        </Stack>
    );
};

const AppListContent = () => {
    return <ResponsiveAppList />;
};

const AppList = () => (
    <List
        filters={AppFilters}
        actions={false}
        sort={{ field: 'order', order: 'ASC' }}
        component="div"
        sx={{ padding: 0 }}
    >
        <AppListContent />
    </List>
);

export default AppList;
