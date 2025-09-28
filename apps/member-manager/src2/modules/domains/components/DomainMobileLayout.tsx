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
import { DomainFilters } from './DomainFilters';
import { DomainListContent } from './DomainListContent';
import { DomainMobileHeader } from './DomainMobileHeader';
import { DomainMobileToolbar } from './DomainMobileToolbar';

interface DomainMobileLayoutProps {
    listProps: any;
}

export const DomainMobileLayout: React.FC<DomainMobileLayoutProps> = ({ listProps }) => {
    const theme = useTheme();
    const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

    return (
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Mobile Header */}
            <DomainMobileHeader />

            {/* Main Content with integrated toolbar */}
            <Box sx={{ flex: 1, overflow: 'hidden' }}>
                <List {...listProps}>
                    <DomainMobileToolbar onFilterClick={() => setFilterDrawerOpen(true)} />
                    <DomainListContent />
                </List>
            </Box>

            {/* Filter Drawer */}
            <Drawer
                anchor="bottom"
                open={filterDrawerOpen}
                onClose={() => setFilterDrawerOpen(false)}
                PaperProps={{
                    sx: {
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 16,
                        maxHeight: '85vh',
                        background: theme.palette.background.paper,
                    },
                }}
            >
                <Box sx={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: 'inherit' }}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            p: 2,
                            borderBottom: `1px solid ${theme.palette.divider}`,
                        }}
                    >
                        <Typography variant="h6" fontWeight={600}>
                            Filter Domains
                        </Typography>
                        <IconButton
                            onClick={() => setFilterDrawerOpen(false)}
                            size="small"
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </Box>
                <Box sx={{ overflow: 'auto', flex: 1 }}>
                        <DomainFilters header={false} />
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
