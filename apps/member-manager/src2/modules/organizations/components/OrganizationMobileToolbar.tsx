import React from 'react';
import {
    Box,
    IconButton,
    useTheme,
    AppBar,
    Toolbar,
    Typography,
    Badge,
} from '@mui/material';
import {
    FilterList as FilterIcon,
    ViewModule as GridIcon,
    ViewList as ListIcon,
} from '@mui/icons-material';
import { useOrganizationProvider } from '../context/OrganizationProvider';
import { useListContext } from 'react-admin';
import { OrganizationMobileSavedViews } from './OrganizationMobileSavedViews';

interface OrganizationMobileToolbarProps {
    onFilterClick: () => void;
}

export const OrganizationMobileToolbar: React.FC<OrganizationMobileToolbarProps> = ({ onFilterClick }) => {
    const theme = useTheme();
    const { filters, viewMode, setViewMode } = useOrganizationProvider();
    const { total } = useListContext(); // Access total from ListContext

    const activeFiltersCount = Object.keys(filters).length;

    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                backgroundColor: theme.palette.background.paper,
                borderBottom: `1px solid ${theme.palette.divider}`,
                color: theme.palette.text.primary,
            }}
        >
            <Toolbar variant="dense" sx={{ px: 2, minHeight: 56 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                    {/* Filter Button */}
                    <Badge badgeContent={activeFiltersCount} color="primary">
                        <IconButton
                            onClick={onFilterClick}
                            size="small"
                            sx={{
                                backgroundColor: activeFiltersCount > 0 ? 'primary.main' : 'transparent',
                                color: activeFiltersCount > 0 ? 'primary.contrastText' : 'text.secondary',
                                border: `1px solid ${theme.palette.divider}`,
                                '&:hover': {
                                    backgroundColor: activeFiltersCount > 0 ? 'primary.dark' : 'action.hover',
                                },
                            }}
                        >
                            <FilterIcon fontSize="small" />
                        </IconButton>
                    </Badge>

                    <Typography variant="subtitle1" fontWeight={600} sx={{ flex: 1, ml: 1 }}>
                        Organizations ({total ?? 0})
                    </Typography>
                </Box>

                {/* Right side - Saved Views and View Toggle */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    {/* Saved Views */}
                    <OrganizationMobileSavedViews />
                    
                    {/* View Toggle */}
                    <Box
                        sx={{
                            display: 'flex',
                            border: `1px solid ${theme.palette.divider}`,
                            borderRadius: 2,
                            overflow: 'hidden',
                            backgroundColor: theme.palette.background.default,
                        }}
                    >
                    <IconButton
                        size="small"
                        onClick={() => setViewMode('grid')}
                        sx={{
                            borderRadius: 0,
                            backgroundColor: viewMode === 'grid' ? 'primary.main' : 'transparent',
                            color: viewMode === 'grid' ? 'primary.contrastText' : 'text.secondary',
                            px: 1.5,
                            py: 0.75,
                            '&:hover': {
                                backgroundColor: viewMode === 'grid' ? 'primary.dark' : 'action.hover',
                            },
                        }}
                    >
                        <GridIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                        size="small"
                        onClick={() => setViewMode('list')}
                        sx={{
                            borderRadius: 0,
                            backgroundColor: viewMode === 'list' ? 'primary.main' : 'transparent',
                            color: viewMode === 'list' ? 'primary.contrastText' : 'text.secondary',
                            px: 1.5,
                            py: 0.75,
                            '&:hover': {
                                backgroundColor: viewMode === 'list' ? 'primary.dark' : 'action.hover',
                            },
                        }}
                    >
                        <ListIcon fontSize="small" />
                    </IconButton>
                </Box>
                </Box>
            </Toolbar>
        </AppBar>
    );
};
