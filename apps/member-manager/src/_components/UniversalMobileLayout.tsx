import React, { useState } from 'react';
import {
    Box,
    Drawer,
    IconButton,
    useTheme,
    Typography,
} from '@mui/material';
import {
    Add as AddIcon,
    Close as CloseIcon,
} from '@mui/icons-material';
import { CreateButton, List } from 'react-admin';

interface UniversalMobileLayoutProps {
    listProps: any;
    headerComponent: React.ComponentType;
    toolbarComponent: React.ComponentType<{ onFilterClick: () => void }>;
    filtersComponent: React.ComponentType;
    listContentComponent: React.ComponentType;
    title?: string;
}

export const UniversalMobileLayout: React.FC<UniversalMobileLayoutProps> = ({
    listProps,
    headerComponent: Header,
    toolbarComponent: Toolbar,
    filtersComponent: Filters,
    listContentComponent: ListContent,
    title = "Filters",
}) => {
    const theme = useTheme();
    const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

    return (
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Mobile Header */}
            <Header />

            {/* Main Content with integrated toolbar */}
            <Box sx={{ flex: 1, overflow: 'hidden' }}>
                <List {...listProps}>
                    <Toolbar onFilterClick={() => setFilterDrawerOpen(true)} />
                    <ListContent />
                </List>
            </Box>

            {/* Filter Drawer */}
            <Drawer
                anchor="bottom"
                open={filterDrawerOpen}
                onClose={() => setFilterDrawerOpen(false)}
                PaperProps={{
                    sx: {
                        height: '80%',
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 16,
                        overflow: 'hidden',
                    },
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 2,
                        borderBottom: `1px solid ${theme.palette.divider}`,
                    }}
                >
                    <Typography variant="h6">{title}</Typography>
                    <IconButton onClick={() => setFilterDrawerOpen(false)}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Box sx={{ overflow: 'auto', flex: 1 }}>
                    <Filters />
                </Box>
            </Drawer>

            {/* Floating Action Button */}
            <CreateButton
                sx={{
                    position: 'fixed',
                    bottom: 24,
                    right: 24,
                    zIndex: 1000,
                    boxShadow: `0 8px 24px ${theme.palette.primary.main}40`,
                    '& .MuiFab-root': {
                        backgroundColor: 'primary.main',
                        '&:hover': {
                            backgroundColor: 'primary.dark',
                        },
                    },
                }}
            >
                <AddIcon />
            </CreateButton>
        </Box>
    );
};
