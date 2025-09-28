import { alpha } from '@mui/material';

export const styles = {
    section: {
        mb: 2.5,
        p: 2,
        borderRadius: 2,
        bgcolor: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
        transition: 'box-shadow 0.3s ease',
        '&:hover': {
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        },
    },
    sectionTitle: {
        display: 'flex',
        alignItems: 'center',
        mb: 1.5,
        pb: 1,
        borderBottom: '1px solid #f0f0f0',
    },
    icon: {
        color: 'primary.main',
        mr: 1,
    },
    highlight: {
        bgcolor: alpha('#2196f3', 0.08),
        p: 2,
        borderRadius: 1,
        borderLeft: '4px solid #2196f3',
        mb: 2,
    },
    inputWrapper: {
        mb: 2,
    },
    inputWithIcon: {
        display: 'flex',
        alignItems: 'flex-start',
        mb: 1,
    },
    inputIcon: {
        mt: 1,
        mr: 1,
        color: 'text.secondary',
    },
}; 