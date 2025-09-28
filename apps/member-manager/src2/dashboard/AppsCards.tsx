import {
    Apps as AppsIcon,
    ArrowBack as ArrowBackIcon,
    Category as CategoryIcon,
    Info as InfoIcon,
    NavigateBefore as NavigateBeforeIcon,
    NavigateNext as NavigateNextIcon,
    Search as SearchIcon,
    StarBorder as StarBorderIcon,
    Star as StarIcon,
} from '@mui/icons-material';
import {
    Box,
    Button,
    Card,
    CardActionArea,
    CardContent,
    CardHeader,
    Chip,
    CircularProgress,
    Collapse,
    FormControl,
    Grid2 as Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useDataProvider, useStore, useTranslate } from 'react-admin';

interface App {
    id: string;
    name: string;
    description: string;
    url: string;
    icon?: string;
    color?: string;
    category:
        | 'CONTENT'
        | 'DESIGN'
        | 'DEVELOPMENT'
        | 'SUPPORT'
        | 'MARKETING'
        | 'ADMIN'
        | 'OTHER';
    isActive: boolean;
    isStarred?: boolean;
}

interface Props {
    apps?: App[];
    title?: string;
}

const AppsCards = (props: Props) => {
    const { apps: propApps = [], title } = props;
    const translate = useTranslate();
    const dataProvider = useDataProvider();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));

    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useStore<string>(
        'dashboard.apps.categoryFilter',
        'all'
    );
    const [showStarredOnly, setShowStarredOnly] = useStore<boolean>(
        'dashboard.apps.showStarredOnly',
        false
    );
    const [starredApps, setStarredApps] = useStore<string[]>(
        'dashboard.apps.starredApps',
        []
    );
    const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());
    const [realApps, setRealApps] = useState<App[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useStore<number>(
        'dashboard.apps.currentPage',
        0
    );

    // Toggle states for filters
    const [showSearch, setShowSearch] = useState(false);
    const [showCategoryFilter, setShowCategoryFilter] = useState(false);

    // Calculate items per page based on screen size
    const itemsPerPage = useMemo(() => {
        if (isMobile) return 4; // 2x2 grid on mobile
        if (isTablet) return 6; // 2x3 grid on tablet
        return 8; // 2x4 grid on desktop
    }, [isMobile, isTablet]);

    // Fetch real apps from the API
    useEffect(() => {
        setLoading(true);
        dataProvider
            .getList('app', {
                pagination: { page: 1, perPage: 50 },
                sort: { field: 'order', order: 'ASC' },
                filter: { isActive: true },
            })
            .then(({ data }) => {
                setRealApps(data);
                setLoading(false);
            })
            .catch(() => {
                // If API fails, we'll just use the mock data
                setLoading(false);
            });
    }, [dataProvider]);

    // Combine real apps from API with mock apps and prop apps
    // We'll use the real apps if available, otherwise fallback to mock + prop apps
    const displayApps = useMemo(() => {
        // If we have real apps from the API, use them + any apps passed as props
        if (realApps.length > 0) {
            // Create a Set of IDs from real apps to avoid duplicates
            const realAppIds = new Set(realApps.map(app => app.id));

            // Filter out any prop apps that have the same IDs as real apps
            const uniquePropApps = propApps.filter(
                app => !realAppIds.has(app.id)
            );

            // Combine real apps with unique prop apps
            return [...realApps, ...uniquePropApps];
        }

        // If we don't have real apps, use props or mock apps
        return propApps.length > 0 ? propApps : [];
    }, [realApps, propApps]);

    const filteredApps = useMemo(() => {
        return displayApps.filter(app => {
            // Search filter
            const matchesSearch =
                app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.description
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());

            // Category filter
            const matchesCategory =
                categoryFilter === 'all' || app.category === categoryFilter;

            // Starred filter
            const matchesStarred =
                !showStarredOnly ||
                (Array.isArray(starredApps) && starredApps.includes(app.id));

            return matchesSearch && matchesCategory && matchesStarred;
        });
    }, [displayApps, searchTerm, categoryFilter, showStarredOnly, starredApps]);

    // Pagination logic
    const totalPages = Math.ceil(filteredApps.length / itemsPerPage);
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentApps = filteredApps.slice(startIndex, endIndex);

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm, categoryFilter, showStarredOnly]);

    const handleNextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages - 1));
    };

    const handlePrevPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 0));
    };

    const toggleStar = (appId: string) => {
        setStarredApps(prev => {
            const currentStarred = Array.isArray(prev) ? prev : [];
            if (currentStarred.includes(appId)) {
                return currentStarred.filter(id => id !== appId);
            } else {
                return [...currentStarred, appId];
            }
        });
    };

    const toggleFlip = (appId: string) => {
        setFlippedCards(prev => {
            const newFlipped = new Set(prev);
            if (newFlipped.has(appId)) {
                newFlipped.delete(appId);
            } else {
                newFlipped.add(appId);
            }
            return newFlipped;
        });
    };

    const getCategoryColor = (category: string) => {
        const colors = {
            CONTENT: '#FF6B6B',
            DESIGN: '#4ECDC4',
            DEVELOPMENT: '#45B7D1',
            SUPPORT: '#96CEB4',
            MARKETING: '#FECA57',
            ADMIN: '#FF9FF3',
            OTHER: '#95A5A6',
        };
        return colors[category as keyof typeof colors] || colors.OTHER;
    };

    return (
        <Card sx={{ height: '100%' }}>
            <CardHeader
                avatar={<AppsIcon color="primary" />}
                title={
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            '&:hover': {
                                color: 'primary.main',
                                textDecoration: 'underline',
                            },
                        }}
                        onClick={() => (window.location.href = '/#/app')}
                    >
                        {title || translate('pos.dashboard.apps')}
                    </Typography>
                }
                action={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton
                            size="small"
                            onClick={() => setShowSearch(!showSearch)}
                            color={showSearch ? 'primary' : 'default'}
                            sx={{
                                borderRadius: '50%',
                                backgroundColor: showSearch
                                    ? 'primary.light'
                                    : 'transparent',
                                '&:hover': {
                                    backgroundColor: showSearch
                                        ? 'primary.light'
                                        : 'action.hover',
                                },
                            }}
                        >
                            <SearchIcon />
                        </IconButton>
                        <IconButton
                            size="small"
                            onClick={() => setShowStarredOnly(!showStarredOnly)}
                            color={showStarredOnly ? 'primary' : 'default'}
                            sx={{
                                borderRadius: '50%',
                                backgroundColor: showStarredOnly
                                    ? 'primary.light'
                                    : 'transparent',
                                '&:hover': {
                                    backgroundColor: showStarredOnly
                                        ? 'primary.light'
                                        : 'action.hover',
                                },
                            }}
                        >
                            <StarIcon />
                        </IconButton>
                        <IconButton
                            size="small"
                            onClick={() =>
                                setShowCategoryFilter(!showCategoryFilter)
                            }
                            color={showCategoryFilter ? 'primary' : 'default'}
                            sx={{
                                borderRadius: '50%',
                                backgroundColor: showCategoryFilter
                                    ? 'primary.light'
                                    : 'transparent',
                                '&:hover': {
                                    backgroundColor: showCategoryFilter
                                        ? 'primary.light'
                                        : 'action.hover',
                                },
                            }}
                        >
                            <CategoryIcon />
                        </IconButton>
                    </Box>
                }
            />
            <CardContent sx={{ pt: 0 }}>
                {/* Collapsible Filters */}
                <Collapse in={showSearch || showCategoryFilter}>
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={2}
                        sx={{ mb: 3 }}
                    >
                        <Collapse
                            in={showSearch}
                            orientation="horizontal"
                            sx={{ flex: 1 }}
                        >
                            <TextField
                                size="small"
                                placeholder={translate(
                                    'pos.dashboard.search_apps'
                                )}
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <SearchIcon
                                            sx={{
                                                mr: 1,
                                                color: 'text.secondary',
                                            }}
                                        />
                                    ),
                                }}
                                fullWidth
                            />
                        </Collapse>
                        <Collapse
                            in={showCategoryFilter}
                            orientation="horizontal"
                        >
                            <FormControl size="small" sx={{ minWidth: 140 }}>
                                <InputLabel>Category</InputLabel>
                                <Select
                                    value={categoryFilter}
                                    label="Category"
                                    onChange={e =>
                                        setCategoryFilter(e.target.value)
                                    }
                                >
                                    <MenuItem value="all">All</MenuItem>
                                    <MenuItem value="CONTENT">Content</MenuItem>
                                    <MenuItem value="DESIGN">Design</MenuItem>
                                    <MenuItem value="DEVELOPMENT">
                                        Development
                                    </MenuItem>
                                    <MenuItem value="SUPPORT">Support</MenuItem>
                                    <MenuItem value="MARKETING">
                                        Marketing
                                    </MenuItem>
                                    <MenuItem value="ADMIN">Admin</MenuItem>
                                    <MenuItem value="OTHER">Other</MenuItem>
                                </Select>
                            </FormControl>
                        </Collapse>
                    </Stack>
                </Collapse>

                {/* Apps Grid with Navigation */}
                <Box sx={{ position: 'relative' }}>
                    {/* Navigation Arrows */}
                    {totalPages > 1 && !loading && (
                        <>
                            <IconButton
                                onClick={handlePrevPage}
                                disabled={currentPage === 0}
                                sx={{
                                    position: 'absolute',
                                    left: -9,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    zIndex: 1,
                                    backgroundColor: 'background.paper',
                                    boxShadow: 2,
                                    '&:hover': {
                                        backgroundColor: 'background.paper',
                                    },
                                    '&.Mui-disabled': {
                                        opacity: 0.3,
                                    },
                                    [theme.breakpoints.down('sm')]: {
                                        left: -9,
                                    },
                                }}
                            >
                                <NavigateBeforeIcon />
                            </IconButton>
                            <IconButton
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages - 1}
                                sx={{
                                    position: 'absolute',
                                    right: -11,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    zIndex: 1,
                                    backgroundColor: 'background.paper',
                                    boxShadow: 2,
                                    '&:hover': {
                                        backgroundColor: 'background.paper',
                                    },
                                    '&.Mui-disabled': {
                                        opacity: 0.3,
                                    },
                                    [theme.breakpoints.down('sm')]: {
                                        right: -11,
                                    },
                                }}
                            >
                                <NavigateNextIcon />
                            </IconButton>
                        </>
                    )}

                    {/* Apps Grid */}
                    {loading ? (
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                py: 4,
                                minHeight: 200,
                            }}
                        >
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Grid container spacing={2} sx={{ px: 4 }}>
                            {currentApps.map(app => {
                                const isFlipped = flippedCards.has(app.id);
                                const isStarred =
                                    Array.isArray(starredApps) &&
                                    starredApps.includes(app.id);

                                return (
                                    <Grid
                                        size={{ xs: 6, sm: 4, md: 3, lg: 3 }}
                                        key={app.id}
                                    >
                                        <Card
                                            sx={{
                                                height: {
                                                    xs: 160,
                                                    sm: 180,
                                                    md: 200,
                                                },
                                                position: 'relative',
                                                perspective: '1000px',
                                            }}
                                        >
                                            {/* Front of card */}
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    width: '100%',
                                                    height: '100%',
                                                    backfaceVisibility:
                                                        'hidden',
                                                    borderRadius: 1,
                                                    transition:
                                                        'transform 0.6s',
                                                    transform: isFlipped
                                                        ? 'rotateY(180deg)'
                                                        : 'rotateY(0deg)',
                                                }}
                                            >
                                                <CardActionArea
                                                    onClick={() =>
                                                        window.open(
                                                            app.url,
                                                            '_blank'
                                                        )
                                                    }
                                                    sx={{ height: '100%' }}
                                                >
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            flexDirection:
                                                                'column',
                                                            alignItems:
                                                                'center',
                                                            justifyContent:
                                                                'center',
                                                            height: '100%',
                                                            backgroundColor:
                                                                app.color ||
                                                                '#f5f5f5',
                                                            borderRadius: 1,
                                                            position:
                                                                'relative',
                                                            color: 'white',
                                                            p: { xs: 1, sm: 2 },
                                                        }}
                                                    >
                                                        <IconButton
                                                            size="small"
                                                            onClick={e => {
                                                                e.stopPropagation();
                                                                toggleStar(
                                                                    app.id
                                                                );
                                                            }}
                                                            sx={{
                                                                position:
                                                                    'absolute',
                                                                top: 4,
                                                                right: 4,
                                                                color: 'white',
                                                                width: 32,
                                                                height: 32,
                                                                '&:hover': {
                                                                    backgroundColor:
                                                                        'rgba(255,255,255,0.1)',
                                                                },
                                                            }}
                                                        >
                                                            {isStarred ? (
                                                                <StarIcon fontSize="small" />
                                                            ) : (
                                                                <StarBorderIcon fontSize="small" />
                                                            )}
                                                        </IconButton>

                                                        <IconButton
                                                            size="small"
                                                            onClick={e => {
                                                                e.stopPropagation();
                                                                toggleFlip(
                                                                    app.id
                                                                );
                                                            }}
                                                            sx={{
                                                                position:
                                                                    'absolute',
                                                                top: 4,
                                                                left: 4,
                                                                color: 'white',
                                                                width: 32,
                                                                height: 32,
                                                                '&:hover': {
                                                                    backgroundColor:
                                                                        'rgba(255,255,255,0.1)',
                                                                },
                                                            }}
                                                        >
                                                            <InfoIcon fontSize="small" />
                                                        </IconButton>

                                                        <Typography
                                                            sx={{
                                                                fontSize: {
                                                                    xs: '2rem',
                                                                    sm: '2.5rem',
                                                                    md: '3rem',
                                                                },
                                                                mb: 1,
                                                            }}
                                                        >
                                                            {app.icon}
                                                        </Typography>
                                                        <Typography
                                                            variant="h6"
                                                            align="center"
                                                            sx={{
                                                                fontWeight:
                                                                    'bold',
                                                                mb: 1,
                                                                fontSize: {
                                                                    xs: '0.875rem',
                                                                    sm: '1rem',
                                                                },
                                                            }}
                                                        >
                                                            {app.name}
                                                        </Typography>
                                                        <Chip
                                                            label={app.category.toLowerCase()}
                                                            size="small"
                                                            sx={{
                                                                mb: 1,
                                                                backgroundColor:
                                                                    'rgba(255,255,255,0.2)',
                                                                color: 'white',
                                                                fontSize: {
                                                                    xs: '0.75rem',
                                                                    sm: '0.875rem',
                                                                },
                                                            }}
                                                        />
                                                    </Box>
                                                </CardActionArea>
                                            </Box>

                                            {/* Back of card */}
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    width: '100%',
                                                    height: '100%',
                                                    backfaceVisibility:
                                                        'hidden',
                                                    borderRadius: 1,
                                                    transition:
                                                        'transform 0.6s',
                                                    transform: isFlipped
                                                        ? 'rotateY(0deg)'
                                                        : 'rotateY(180deg)',
                                                }}
                                            >
                                                <CardContent
                                                    sx={{
                                                        height: '100%',
                                                        p: { xs: 1, sm: 2 },
                                                        position: 'relative',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                    }}
                                                >
                                                    <IconButton
                                                        size="small"
                                                        onClick={() =>
                                                            toggleFlip(app.id)
                                                        }
                                                        sx={{
                                                            position:
                                                                'absolute',
                                                            top: 4,
                                                            left: 4,
                                                            width: 32,
                                                            height: 32,
                                                            '&:hover': {
                                                                backgroundColor:
                                                                    'rgba(0,0,0,0.05)',
                                                            },
                                                        }}
                                                    >
                                                        <ArrowBackIcon fontSize="small" />
                                                    </IconButton>

                                                    <IconButton
                                                        size="small"
                                                        onClick={() =>
                                                            toggleStar(app.id)
                                                        }
                                                        color={
                                                            isStarred
                                                                ? 'primary'
                                                                : 'default'
                                                        }
                                                        sx={{
                                                            position:
                                                                'absolute',
                                                            top: 4,
                                                            right: 4,
                                                            width: 32,
                                                            height: 32,
                                                            '&:hover': {
                                                                backgroundColor:
                                                                    'rgba(0,0,0,0.05)',
                                                            },
                                                        }}
                                                    >
                                                        {isStarred ? (
                                                            <StarIcon fontSize="small" />
                                                        ) : (
                                                            <StarBorderIcon fontSize="small" />
                                                        )}
                                                    </IconButton>

                                                    <Box
                                                        sx={{
                                                            mt: 4,
                                                            flex: 1,
                                                            display: 'flex',
                                                            flexDirection:
                                                                'column',
                                                        }}
                                                    >
                                                        <Typography
                                                            variant="h6"
                                                            gutterBottom
                                                            sx={{
                                                                fontSize: {
                                                                    xs: '0.875rem',
                                                                    sm: '1rem',
                                                                },
                                                                fontWeight:
                                                                    'bold',
                                                            }}
                                                        >
                                                            {app.name}
                                                        </Typography>
                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                            sx={{
                                                                flex: 1,
                                                                overflow:
                                                                    'auto',
                                                                fontSize: {
                                                                    xs: '0.75rem',
                                                                    sm: '0.85rem',
                                                                },
                                                                lineHeight: 1.4,
                                                                mb: 2,
                                                            }}
                                                        >
                                                            {app.description}
                                                        </Typography>
                                                        <Box
                                                            sx={{
                                                                display: 'flex',
                                                                justifyContent:
                                                                    'flex-start',
                                                                alignItems:
                                                                    'center',
                                                            }}
                                                        >
                                                            <Chip
                                                                label={app.category.toLowerCase()}
                                                                size="small"
                                                                sx={{
                                                                    backgroundColor:
                                                                        getCategoryColor(
                                                                            app.category
                                                                        ),
                                                                    color: 'white',
                                                                    fontSize: {
                                                                        xs: '0.75rem',
                                                                        sm: '0.875rem',
                                                                    },
                                                                }}
                                                            />
                                                        </Box>
                                                    </Box>
                                                </CardContent>
                                            </Box>
                                        </Card>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    )}

                    {/* Pagination Info */}
                    {totalPages > 1 && !loading && (
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                mt: 2,
                                gap: 1,
                            }}
                        >
                            <Typography variant="body2" color="text.secondary">
                                Page {currentPage + 1} of {totalPages}
                            </Typography>
                        </Box>
                    )}

                    {/* View All Apps Button */}
                    {!loading && (
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                mt: filteredApps.length > 0 ? 3 : 1,
                                mb: 1,
                            }}
                        >
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() =>
                                    (window.location.href = '/#/app')
                                }
                                startIcon={<AppsIcon />}
                                sx={{
                                    transition: 'all 0.2s ease-in-out',
                                    fontWeight: 500,
                                    px: 3,
                                    py: 1,
                                    borderRadius: 2,
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: 3,
                                    },
                                }}
                            >
                                {translate('pos.dashboard.view_all')}
                            </Button>
                        </Box>
                    )}
                </Box>

                {filteredApps.length === 0 && !loading && (
                    <Typography
                        color="textSecondary"
                        sx={{ textAlign: 'center', py: 4 }}
                    >
                        {translate('pos.dashboard.no_apps_found')}
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
};

export default AppsCards;
