import { alpha } from '@mui/material';

export const styles = {
    section: {
        mb: 4,
        p: 2,
        borderRadius: 2,
        bgcolor: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
        transition: 'box-shadow 0.3s ease',
        '&:hover': {
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }
    },
    sectionTitle: {
        display: 'flex',
        alignItems: 'center',
        mb: 2,
        pb: 1,
        borderBottom: '1px solid #f0f0f0'
    },
    icon: {
        color: 'primary.main',
        mr: 1
    },
    highlight: {
        bgcolor: alpha('#2196f3', 0.08),
        p: 2,
        borderRadius: 1,
        borderLeft: '4px solid #2196f3',
        mb: 3
    },
    inputWrapper: {
        mb: 3
    },
    chipGrid: {
        display: 'flex',
        flexWrap: 'wrap',
        mb: 3
    },
    contentTypeChip: {
        m: 0.5, 
        padding: '5px 10px',
        height: 'auto',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
            transform: 'scale(1.05)'
        }
    },
    selectedChip: {
        backgroundColor: 'primary.main',
        color: 'white',
        '&:hover': {
            backgroundColor: 'primary.dark',
        }
    },
    questionCard: {
        p: 1.5,
        mb: 1.5,
        borderRadius: 1,
        border: '1px solid #e0e0e0',
        position: 'relative',
        transition: 'all 0.2s ease',
        '&:hover': {
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            borderColor: '#bdbdbd'
        }
    },
    booleanInput: {
        mb: 2
    }
}; 