import React from 'react';
import {
    Box,
    Button,
    Stack,
    Typography,
} from '@mui/material';

// Define the tab structure
type Tab = {
    key: string;
    label: string;
    shortLabel: string;
    icon: React.ReactNode;
    component: React.ComponentType;
    priority: number;
};

interface MobileTabNavigationProps {
    tabs: Tab[];
    currentTab: number;
    onTabChange: (index: number) => void;
}

const MobileTabNavigation: React.FC<MobileTabNavigationProps> = ({
    tabs,
    currentTab,
    onTabChange,
}) => {
    return (
        <Stack
            direction="row"
            spacing={1}
            sx={{ 
                p: 1, 
                bgcolor: 'background.paper',
                borderBottom: 1,
                borderColor: 'divider',
            }}
        >
            {tabs.map((tab, index) => (
                <Button
                    key={tab.key}
                    variant={currentTab === index ? "contained" : "outlined"}
                    size="small"
                    startIcon={tab.icon}
                    onClick={() => onTabChange(index)}
                    sx={{
                        flexGrow: 1,
                        textTransform: 'none',
                    }}
                >
                    {tab.shortLabel}
                </Button>
            ))}
        </Stack>
    );
}

export default MobileTabNavigation;
