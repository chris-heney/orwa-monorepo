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
    inputWrapper: {
        mb: 2
    },
    highlight: {
        bgcolor: alpha('#2196f3', 0.08),
        p: 2,
        borderRadius: 1,
        borderLeft: '4px solid #2196f3',
        mb: 3
    },
    slider: {
        '& .MuiSlider-thumb': {
            width: 28,
            height: 28,
        },
        '& .MuiSlider-valueLabel': {
            backgroundColor: 'primary.main',
            fontSize: 14,
            padding: '4px 8px',
            borderRadius: 4
        }
    },
    budgetDisplay: {
        fontSize: '2.5rem',
        fontWeight: 'bold',
        color: 'primary.main',
        textAlign: 'center',
        my: 2
    },
    platformCard: {
        mb: 2,
        cursor: 'pointer',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 6px 12px rgba(0,0,0,0.1)'
        }
    },
    cardSelected: {
        borderColor: 'primary.main',
        borderWidth: 2,
        backgroundColor: alpha('#2196f3', 0.05)
    },
    goalChip: {
        m: 0.5,
        padding: '10px 6px',
        height: 'auto',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
            transform: 'scale(1.05)'
        }
    },
    selectedGoalChip: {
        backgroundColor: 'primary.main',
        color: 'white',
        '&:hover': {
            backgroundColor: 'primary.dark',
        }
    },
    credentialsInput: {
        mb: 2
    },
    competitorCard: {
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
    }
}; 