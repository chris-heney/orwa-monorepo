import React from 'react';
import { Box, IconButton, Typography, Divider, useTheme } from '@mui/material';
import {
    ViewModule as GridIcon,
    ViewList as ListIcon,
    Menu as MenuIcon,
} from '@mui/icons-material';
import { useFilterProvider } from './FilterProvider';
import { ListActionsToolbar } from './ListActionsToolbar';

interface UniversalListToolbarProps {
    title: string;
    showViewToggle?: boolean;
    showSidebarToggle?: boolean;
    onSidebarToggle?: () => void;
    children?: React.ReactNode;
}

export const UniversalListToolbar: React.FC<UniversalListToolbarProps> = ({
    title,
    showViewToggle = true,
    showSidebarToggle = true,
    onSidebarToggle,
    children,
}) => {
    const theme = useTheme();
    const { viewMode, setViewMode, sidebarOpen, setSidebarOpen } =
        useFilterProvider();

    const handleSidebarToggle = () => {
        if (onSidebarToggle) {
            onSidebarToggle();
        } else {
            setSidebarOpen(!sidebarOpen);
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 3,
                py: 2,
                borderBottom: `1px solid ${theme.palette.divider}`,
                backgroundColor: theme.palette.background.paper,
                minHeight: 64,
                position: 'sticky',
                top: 0,
                zIndex: 3,
                width: '100%',
            }}
        >
            {/* Left side */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {showSidebarToggle && (
                    <IconButton
                        onClick={handleSidebarToggle}
                        size="small"
                        sx={{
                            backgroundColor: sidebarOpen
                                ? 'primary.main'
                                : 'transparent',
                            color: sidebarOpen
                                ? 'primary.contrastText'
                                : 'text.secondary',
                            border: `1px solid ${theme.palette.divider}`,
                            '&:hover': {
                                backgroundColor: sidebarOpen
                                    ? 'primary.dark'
                                    : 'action.hover',
                                borderColor: 'primary.main',
                            },
                        }}
                    >
                        <MenuIcon fontSize="small" />
                    </IconButton>
                )}

                <Divider orientation="vertical" flexItem />

                <Typography variant="h6" fontWeight={600}>
                    {title}
                </Typography>
            </Box>

            {/* Right side */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {children}

                <ListActionsToolbar />

                {showViewToggle && (
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
                                backgroundColor:
                                    viewMode === 'grid'
                                        ? 'primary.main'
                                        : 'transparent',
                                color:
                                    viewMode === 'grid'
                                        ? 'primary.contrastText'
                                        : 'text.secondary',
                                px: 1.5,
                                py: 0.75,
                                '&:hover': {
                                    backgroundColor:
                                        viewMode === 'grid'
                                            ? 'primary.dark'
                                            : 'action.hover',
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
                                backgroundColor:
                                    viewMode === 'list'
                                        ? 'primary.main'
                                        : 'transparent',
                                color:
                                    viewMode === 'list'
                                        ? 'primary.contrastText'
                                        : 'text.secondary',
                                px: 1.5,
                                py: 0.75,
                                '&:hover': {
                                    backgroundColor:
                                        viewMode === 'list'
                                            ? 'primary.dark'
                                            : 'action.hover',
                                },
                            }}
                        >
                            <ListIcon fontSize="small" />
                        </IconButton>
                    </Box>
                )}
            </Box>
        </Box>
    );
};
