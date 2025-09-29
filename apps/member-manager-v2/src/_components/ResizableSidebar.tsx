import React, { useCallback, useEffect, useState, ReactNode } from 'react';
import { Box, useTheme } from '@mui/material';

interface ResizableSidebarProps {
    children: ReactNode;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    width: number;
    onWidthChange: (width: number) => void;
    minWidth?: number;
    maxWidth?: number;
    defaultWidth?: number;
    sx?: Record<string, any>;
}

export const ResizableSidebar: React.FC<ResizableSidebarProps> = ({
    children,
    isOpen,
    onOpenChange,
    width,
    onWidthChange,
    minWidth = 0,
    maxWidth = 500,
    defaultWidth = 280,
    sx = {},
}) => {
    const theme = useTheme();
    const [isResizing, setIsResizing] = useState(false);

    // Resize handlers
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        setIsResizing(true);
        e.preventDefault();
    }, []);

    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            if (!isResizing) return;

            // Close sidebar if dragged too far left
            if (e.clientX < 10) {
                onOpenChange(false);
                onWidthChange(defaultWidth);
                return;
            }

            const newWidth = e.clientX;
            if (newWidth >= minWidth && newWidth <= maxWidth) {
                onWidthChange(newWidth);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [isResizing, minWidth, maxWidth, defaultWidth]
    );

    const handleMouseUp = useCallback(() => {
        setIsResizing(false);
    }, []);

    useEffect(() => {
        if (isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isResizing]);

    if (!isOpen) {
        return null;
    }

    return (
        <Box
            sx={{
                width: width,
                flexShrink: 0,
                overflowX: 'hidden',
                overflowY: 'auto',
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                zIndex: 1,
                height: '100%',
                borderRight: `1px solid ${theme.palette.divider}`,
                backgroundColor: theme.palette.background.paper,
                ...sx,
            }}
        >
            {children}

            {/* Resize Handle */}
            <Box
                onMouseDown={handleMouseDown}
                sx={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    bottom: 0,
                    width: 4,
                    cursor: 'col-resize',
                    backgroundColor: 'transparent',
                    zIndex: 1,
                    '&:hover': {
                        backgroundColor: 'primary.main',
                        opacity: 0.5,
                    },
                    ...(isResizing && {
                        backgroundColor: 'primary.main',
                        opacity: 0.7,
                    }),
                }}
            />
        </Box>
    );
};
