import React from 'react';
import {
    Box,
    Typography,
    TextField,
    InputAdornment,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    OutlinedInput,
    Chip,
    Avatar,
    IconButton,
    Divider,
    Paper,
    useTheme,
    SelectChangeEvent,
} from '@mui/material';
import {
    Search as SearchIcon,
    Clear as ClearIcon,
    Cancel as CancelIcon,
} from '@mui/icons-material';
import { useFilterProvider } from './FilterProvider';

interface FilterOption {
    id: string;
    name: string;
}

interface UniversalFiltersProps {
    header?: boolean;
    searchPlaceholder?: string;
    multiSelectFilters?: {
        source: string;
        label: string;
        options: FilterOption[];
        chipColor?: 'primary' | 'secondary' | 'default';
        showAvatar?: boolean;
    }[];
    searchField?: string;
    children?: React.ReactNode;
}

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

export const UniversalFilters: React.FC<UniversalFiltersProps> = ({
    header = true,
    searchPlaceholder = 'Search...',
    searchField = 'q',
    multiSelectFilters = [],
    children,
}) => {
    const theme = useTheme();
    const { filters, setFilters, searchValue, setSearchValue } =
        useFilterProvider();

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchValue(value);

        if (value) {
            setFilters({ ...filters, [searchField]: { $contains: value } });
        } else {
            // Remove the current search field from filters when cleared
            const { [searchField]: _removed, ...rest } = filters as Record<string, any>;
            setFilters(rest);
        }
    };

    const handleFilterChange = (field: string, value: any) => {
        if (value && (Array.isArray(value) ? value.length > 0 : true)) {
            setFilters({ ...filters, [field]: value });
        } else {
            const { [field]: removed, ...restFilters } = filters;
            setFilters(restFilters);
        }
    };

    const handleMultiSelectChange =
        (source: string) => (event: SelectChangeEvent<string[]>) => {
            const value = event.target.value;
            const selectedValues =
                typeof value === 'string' ? value.split(',') : value;
            handleFilterChange(source, selectedValues);
        };

    const handleDeleteChip =
        (source: string, valueToRemove: string) =>
        (event: React.MouseEvent) => {
            event.preventDefault();
            event.stopPropagation();
            const currentValues = filters[source] || [];
            const updatedValues = Array.isArray(currentValues)
                ? currentValues.filter(
                      (value: string) => value !== valueToRemove
                  )
                : [];
            handleFilterChange(source, updatedValues);
        };

    const clearAllFilters = () => {
        setFilters({});
        setSearchValue('');
    };

    const activeFiltersCount = Object.keys(filters).length;

    return (
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: theme.palette.background.paper,
            }}
        >
            {/* Header */}
            {header && (
                <Box
                    sx={{
                        p: 2,
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mt: 1,
                    }}
                >
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                        Filters
                    </Typography>
                    {activeFiltersCount > 0 && (
                        <Chip
                            label={`Clear ${activeFiltersCount} filter${
                                activeFiltersCount !== 1 ? 's' : ''
                            }`}
                            size="small"
                            variant="outlined"
                            onClick={clearAllFilters}
                            sx={{
                                height: 24,
                                fontSize: '0.7rem',
                                cursor: 'pointer',
                                '&:hover': {
                                    backgroundColor: theme.palette.error.main,
                                    color: theme.palette.error.contrastText,
                                    borderColor: theme.palette.error.main,
                                },
                            }}
                        />
                    )}
                </Box>
            )}

            {/* Filters Content */}
            <Box sx={{ flex: 1, overflow: 'auto' }}>
                <Box sx={{ p: 3 }}>
                    {/* Search */}
                    <Paper
                        elevation={0}
                        sx={{
                            mb: 3,
                            border: `1px solid ${theme.palette.divider}`,
                            borderRadius: 2,
                        }}
                    >
                        <TextField
                            fullWidth
                            placeholder={searchPlaceholder}
                            value={searchValue}
                            onChange={handleSearchChange}
                            variant="outlined"
                            size="small"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon color="action" />
                                    </InputAdornment>
                                ),
                                endAdornment: searchValue && (
                                    <InputAdornment position="end">
                                        <IconButton
                                            size="small"
                                            onClick={() => {
                                                setSearchValue('');
                                                const { [searchField]: _removed, ...rest } =
                                                    (filters as Record<string, any>);
                                                setFilters(rest);
                                            }}
                                        >
                                            <ClearIcon fontSize="small" />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                                sx: {
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        border: 'none',
                                    },
                                },
                            }}
                        />
                    </Paper>

                    {/* Multi-select Filters */}
                    {multiSelectFilters.map((filter, index) => (
                        <Box key={filter.source} sx={{ mb: 3 }}>
                            <Typography
                                variant="subtitle2"
                                fontWeight={600}
                                gutterBottom
                            >
                                {filter.label}
                            </Typography>
                            <FormControl fullWidth size="small">
                                <InputLabel sx={{ mt: '-12px' }}>
                                    Select {filter.label.toLowerCase()}
                                </InputLabel>
                                <Select
                                    multiple
                                    value={filters[filter.source] || []}
                                    onChange={handleMultiSelectChange(
                                        filter.source
                                    )}
                                    input={
                                        <OutlinedInput
                                            label={`Select ${filter.label.toLowerCase()}`}
                                        />
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
                                                (value, chipIndex) => {
                                                    const option =
                                                        filter.options.find(
                                                            o => o.id === value
                                                        );
                                                    return (
                                                        <Chip
                                                            key={`${filter.source}-${chipIndex}`}
                                                            color={
                                                                filter.chipColor ||
                                                                'primary'
                                                            }
                                                            label={
                                                                option?.name ||
                                                                value
                                                            }
                                                            size="small"
                                                            deleteIcon={
                                                                <CancelIcon
                                                                    onMouseDown={event => {
                                                                        event.stopPropagation();
                                                                    }}
                                                                />
                                                            }
                                                            onDelete={handleDeleteChip(
                                                                filter.source,
                                                                value
                                                            )}
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
                                >
                                    {filter.options.map(option => (
                                        <MenuItem
                                            key={option.id}
                                            value={option.id}
                                        >
                                            {filter.showAvatar && (
                                                <Avatar
                                                    sx={{
                                                        width: 24,
                                                        height: 24,
                                                        mr: 1,
                                                        bgcolor: 'primary.main',
                                                        fontSize: '0.75rem',
                                                    }}
                                                >
                                                    {option.name
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </Avatar>
                                            )}
                                            {option.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            {index < multiSelectFilters.length - 1 && (
                                <Divider sx={{ mt: 3 }} />
                            )}
                        </Box>
                    ))}

                    {/* Custom Filters */}
                    {children}
                </Box>
            </Box>
        </Box>
    );
};
