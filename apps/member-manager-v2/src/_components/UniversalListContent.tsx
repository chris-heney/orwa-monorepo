import React from 'react';
import { useMediaQuery, useTheme } from '@mui/material';
import { useFilterProvider } from './FilterProvider';

interface UniversalListContentProps {
    desktopListComponent: React.ComponentType;
    desktopGridComponent?: React.ComponentType;
    mobileListComponent?: React.ComponentType;
    mobileGridComponent?: React.ComponentType;
}

export const UniversalListContent: React.FC<UniversalListContentProps> = ({
    desktopListComponent: DesktopList,
    desktopGridComponent: DesktopGrid,
    mobileListComponent: MobileList,
    mobileGridComponent: MobileGrid,
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { viewMode } = useFilterProvider();

    // Use mobile-optimized components on mobile devices
    if (isMobile) {
        if (viewMode === 'list') {
            return MobileList ? <MobileList /> : <DesktopList />;
        }
        return MobileGrid ? (
            <MobileGrid />
        ) : DesktopGrid ? (
            <DesktopGrid />
        ) : (
            <DesktopList />
        );
    }

    // Use desktop components on larger screens
    if (viewMode === 'list') {
        return <DesktopList />;
    }

    return DesktopGrid ? <DesktopGrid /> : <DesktopList />;
};
