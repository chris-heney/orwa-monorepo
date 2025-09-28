import { SxProps, Theme } from '@mui/material';

export interface AnalyticsStyleProps {
    styles: {
        section?: SxProps<Theme>;
        sectionTitle: SxProps<Theme>;
        icon: SxProps<Theme>;
        highlight?: SxProps<Theme>;
        inputWrapper: SxProps<Theme>;
        inputWithIcon: SxProps<Theme>;
        inputIcon: SxProps<Theme>;
    };
} 