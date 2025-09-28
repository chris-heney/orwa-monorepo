import {
    Cancel as CancelIcon,
    Clear as ClearIcon,
    Search as SearchIcon,
    Tune as TuneIcon,
} from '@mui/icons-material';
import {
    Avatar,
    Box,
    Chip,
    Collapse,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Paper,
    Select,
    SelectChangeEvent,
    TextField,
    useTheme,
    Grid2,
    FormControl,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import React, { useState } from 'react';
import { useGetList, useListFilterContext } from 'react-admin';

const technologyOptions = [
    { id: 'WordPress', name: 'WordPress' },
    { id: 'Webflow', name: 'Webflow' },
    { id: 'Static', name: 'Static HTML' },
    { id: 'React', name: 'React' },
    { id: 'Vue', name: 'Vue.js' },
    { id: 'Angular', name: 'Angular' },
    { id: 'Other', name: 'Other' },
];

export const ModernDomainSearchFilters: React.FC = () => {
    const theme = useTheme();
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const { filterValues, setFilters } = useListFilterContext();

    // Get hosting providers for the filter
    const { data: hostingProviders = [] } = useGetList('hosting-provider', {
        pagination: { page: 1, perPage: 100 },
        sort: { field: 'name', order: 'ASC' },
    });

    // Constants for multi-select dropdown
    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchValue(value);
        setFilters({ ...filterValues, url: { $contains: value } }, []);
    };

    const handleFilterChange = (field: string, value: any) => {
        setFilters({ ...filterValues, [field]: value }, []);
    };

    const handleMultiSelectTechnology = (
        event: SelectChangeEvent<string[]>
    ) => {
        const value = event.target.value;
        const selectedValues =
            typeof value === 'string' ? value.split(',') : value;
        handleFilterChange('technology', selectedValues);
    };

    const handleDeleteTechnology = (
        event: React.MouseEvent,
        techToRemove: string
    ) => {
        event.preventDefault();
        event.stopPropagation();
        const currentTechs = filterValues['technology'] || [];
        const updatedTechs = Array.isArray(currentTechs)
            ? currentTechs.filter((tech: string) => tech !== techToRemove)
            : [];
        handleFilterChange('technology', updatedTechs);
    };

    const handleMultiSelectHostingProvider = (
        event: SelectChangeEvent<string[]>
    ) => {
        const value = event.target.value;
        const selectedValues =
            typeof value === 'string' ? value.split(',') : value;
        handleFilterChange('hostingProviderId', selectedValues);
    };

    const handleDeleteHostingProvider = (
        event: React.MouseEvent,
        providerId: string
    ) => {
        event.preventDefault();
        event.stopPropagation();
        const currentProviders = filterValues['hostingProviderId'] || [];
        const updatedProviders = Array.isArray(currentProviders)
            ? currentProviders.filter((id: string) => id !== providerId)
            : [];
        handleFilterChange('hostingProviderId', updatedProviders);
    };

    const clearFilters = () => {
        setFilters({}, []);
        setSearchValue('');
    };

    const activeFiltersCount = Object.keys(filterValues).filter(
        key => filterValues[key] && key !== 'domain'
    ).length;

    return (
        <Box>
            {/* Modern Search Bar */}
            <Paper
                elevation={0}
                sx={{
                    overflow: 'hidden',
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 2,
                    background: theme.palette.background.paper,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        boxShadow: `0 4px 20px ${theme.palette.primary.main}15`,
                        borderColor: `${theme.palette.primary.main}50`,
                    },
                }}
            >
                <Box
                    sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}
                >
                    <Box sx={{ flexGrow: 1 }}>
                        <TextField
                            fullWidth
                            placeholder="Search domains..."
                            value={searchValue}
                            onChange={handleSearchChange}
                            variant="outlined"
                            size="small"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon
                                            color="action"
                                            sx={{
                                                fontSize: { xs: 20, sm: 24 },
                                                transition: 'color 0.2s ease',
                                            }}
                                        />
                                    </InputAdornment>
                                ),
                                endAdornment: searchValue && (
                                    <InputAdornment position="end">
                                        <IconButton
                                            size="small"
                                            onClick={() => {
                                                setSearchValue('');
                                                handleFilterChange(
                                                    'domain',
                                                    ''
                                                );
                                            }}
                                            sx={{
                                                opacity: 0.7,
                                                '&:hover': { opacity: 1 },
                                            }}
                                        >
                                            <ClearIcon fontSize="small" />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                                sx: {
                                    fontSize: { xs: '0.9rem', sm: '1rem' },
                                    fontWeight: 500,
                                    borderRadius: 2,
                                    '& input::placeholder': {
                                        color: theme.palette.text.secondary,
                                        opacity: 0.8,
                                    },
                                },
                            }}
                        />
                    </Box>

                    <Chip
                        icon={<TuneIcon sx={{ fontSize: '18px !important' }} />}
                        label={`Filters${
                            activeFiltersCount > 0
                                ? ` (${activeFiltersCount})`
                                : ''
                        }`}
                        onClick={() => setFiltersOpen(!filtersOpen)}
                        variant={filtersOpen ? 'filled' : 'outlined'}
                        color={filtersOpen ? 'primary' : 'default'}
                        sx={{
                            height: 38,
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            borderRadius: 2,
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: `0 4px 8px ${theme.palette.primary.main}20`,
                            },
                        }}
                    />
                </Box>

                {activeFiltersCount > 0 && (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            px: 2,
                            pb: filtersOpen ? 0 : 2,
                        }}
                    >
                        <Chip
                            label="Clear"
                            size="small"
                            variant="outlined"
                            onClick={clearFilters}
                            sx={{
                                height: 28,
                                fontSize: '0.75rem',
                                cursor: 'pointer',
                                '&:hover': {
                                    backgroundColor: theme.palette.error.main,
                                    color: theme.palette.error.contrastText,
                                    borderColor: theme.palette.error.main,
                                },
                            }}
                        />
                    </Box>
                )}

                <Collapse in={filtersOpen} timeout={300}>
                    <Box
                        sx={{
                            overflow: 'hidden',
                            borderTop: filtersOpen
                                ? `1px solid ${theme.palette.divider}`
                                : 'none',
                            background: theme.palette.background.paper,
                            mt: filtersOpen ? 2 : 0,
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', sm: 'row' },
                                gap: 2,
                                mx: 2,
                                my: 2,
                            }}
                        >
                            <Box sx={{ width: { xs: '100%', sm: '50%' } }}>
                                <FormControl fullWidth size="small">
                                    <InputLabel sx={{ mt: '-12px' }}>
                                        Technology
                                    </InputLabel>
                                    <Select
                                        multiple
                                        value={filterValues['technology'] || []}
                                        onChange={handleMultiSelectTechnology}
                                        input={
                                            <OutlinedInput label="Technology" />
                                        }
                                        renderValue={selected => (
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexWrap: 'wrap',
                                                    gap: 0.5,
                                                    pt: 1,
                                                }}
                                            >
                                                {(selected as string[]).map(
                                                    (value, index) => {
                                                        const tech =
                                                            technologyOptions.find(
                                                                t =>
                                                                    t.id ===
                                                                    value
                                                            );
                                                        return (
                                                            <Chip
                                                                key={`tech-${index}`}
                                                                color="secondary"
                                                                label={
                                                                    tech?.name ||
                                                                    value
                                                                }
                                                                deleteIcon={
                                                                    <CancelIcon
                                                                        onMouseDown={event => {
                                                                            event.stopPropagation();
                                                                        }}
                                                                    />
                                                                }
                                                                onDelete={event =>
                                                                    handleDeleteTechnology(
                                                                        event,
                                                                        value
                                                                    )
                                                                }
                                                                sx={{
                                                                    '& .MuiChip-deleteIcon':
                                                                        {
                                                                            color: 'rgba(255, 255, 255, 0.7)',
                                                                            '&:hover':
                                                                                {
                                                                                    color: 'white',
                                                                                },
                                                                        },
                                                                    ...(theme
                                                                        .palette
                                                                        .mode ===
                                                                        'light' && {
                                                                        '& .MuiChip-label':
                                                                            {
                                                                                color: 'white',
                                                                            },
                                                                    }),
                                                                }}
                                                            />
                                                        );
                                                    }
                                                )}
                                            </Box>
                                        )}
                                        MenuProps={MenuProps}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                backgroundColor:
                                                    theme.palette.background
                                                        .paper,
                                            },
                                        }}
                                    >
                                        {technologyOptions.map(tech => (
                                            <MenuItem
                                                key={tech.id}
                                                value={tech.id}
                                            >
                                                {tech.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>

                            <Box sx={{ width: { xs: '100%', sm: '50%' } }}>
                                <FormControl fullWidth size="small">
                                    <InputLabel sx={{ mt: '-12px' }}>
                                        Hosting Provider
                                    </InputLabel>
                                    <Select
                                        multiple
                                        value={
                                            filterValues['hostingProviderId'] ||
                                            []
                                        }
                                        onChange={
                                            handleMultiSelectHostingProvider
                                        }
                                        input={
                                            <OutlinedInput label="Hosting Provider" />
                                        }
                                        renderValue={selected => (
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexWrap: 'wrap',
                                                    gap: 0.5,
                                                    pt: 1,
                                                }}
                                            >
                                                {(selected as string[]).map(
                                                    (value, index) => {
                                                        const provider =
                                                            hostingProviders.find(
                                                                (p: any) =>
                                                                    p.id ===
                                                                    value
                                                            );
                                                        return (
                                                            <Chip
                                                                key={`provider-${index}`}
                                                                color="primary"
                                                                label={
                                                                    provider?.name ||
                                                                    value
                                                                }
                                                                deleteIcon={
                                                                    <CancelIcon
                                                                        onMouseDown={event => {
                                                                            event.stopPropagation();
                                                                        }}
                                                                    />
                                                                }
                                                                onDelete={event =>
                                                                    handleDeleteHostingProvider(
                                                                        event,
                                                                        value
                                                                    )
                                                                }
                                                                sx={{
                                                                    '& .MuiChip-deleteIcon':
                                                                        {
                                                                            color: 'rgba(255, 255, 255, 0.7)',
                                                                            '&:hover':
                                                                                {
                                                                                    color: 'white',
                                                                                },
                                                                        },
                                                                    ...(theme
                                                                        .palette
                                                                        .mode ===
                                                                        'light' && {
                                                                        '& .MuiChip-label':
                                                                            {
                                                                                color: 'white',
                                                                            },
                                                                    }),
                                                                }}
                                                            />
                                                        );
                                                    }
                                                )}
                                            </Box>
                                        )}
                                        MenuProps={MenuProps}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                backgroundColor:
                                                    theme.palette.background
                                                        .paper,
                                            },
                                        }}
                                    >
                                        {hostingProviders.map(
                                            (provider: any) => (
                                                <MenuItem
                                                    key={provider.id}
                                                    value={provider.id}
                                                >
                                                    <Avatar
                                                        sx={{
                                                            width: 24,
                                                            height: 24,
                                                            mr: 1,
                                                            bgcolor:
                                                                'primary.main',
                                                            fontSize: '0.75rem',
                                                        }}
                                                    >
                                                        {(provider.name || '')
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </Avatar>
                                                    {provider.name}
                                                </MenuItem>
                                            )
                                        )}
                                    </Select>
                                </FormControl>
                            </Box>
                        </Box>
                    </Box>
                </Collapse>
            </Paper>
        </Box>
    );
};

export default ModernDomainSearchFilters;
