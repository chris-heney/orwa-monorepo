import { Theme } from '@mui/material';

export const styles = {
    section: {
        padding: 3,
        marginBottom: 3,
    },
    sectionTitle: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: 2,
    },
    icon: {
        marginRight: 1,
        color: (theme: Theme) => theme.palette.primary.main,
    },
    inputWrapper: {
        marginTop: 2,
    },
    highlight: {
        padding: 2,
        marginBottom: 3,
        backgroundColor: (theme: Theme) => theme.palette.grey[50],
        borderLeft: (theme: Theme) => `4px solid ${theme.palette.primary.main}`,
        borderRadius: 1,
    },
    divider: {
        marginTop: 2,
        marginBottom: 2,
    },
    contractItem: {
        borderRadius: 1,
        border: (theme: Theme) => `1px solid ${theme.palette.divider}`,
        padding: 2,
        marginBottom: 2,
    },
    contractItemHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 1,
    },
}; 