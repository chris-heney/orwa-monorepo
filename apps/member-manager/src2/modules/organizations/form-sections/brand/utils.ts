import {alpha} from '@mui/material';



export const predefinedPalettes = [
    {
        name: 'Ocean Blue',
        colors: ['#1976D2', '#2196F3', '#64B5F6', '#BBDEFB', '#0D47A1']
    },
    {
        name: 'Forest Green',
        colors: ['#2E7D32', '#4CAF50', '#81C784', '#C8E6C9', '#1B5E20']
    },
    {
        name: 'Sunset Orange',
        colors: ['#E64A19', '#FF5722', '#FF8A65', '#FFCCBC', '#BF360C']
    },
    {
        name: 'Royal Purple',
        colors: ['#7B1FA2', '#9C27B0', '#BA68C8', '#E1BEE7', '#4A148C']
    },
    {
        name: 'Ruby Red',
        colors: ['#C62828', '#F44336', '#E57373', '#FFCDD2', '#B71C1C']
    },
    {
        name: 'Modern Gray',
        colors: ['#455A64', '#607D8B', '#90A4AE', '#CFD8DC', '#263238']
    },
    {
        name: 'Teal Accent',
        colors: ['#00796B', '#009688', '#4DB6AC', '#B2DFDB', '#004D40']
    },
    {
        name: 'Gold Rush',
        colors: ['#FFA000', '#FFC107', '#FFD54F', '#FFECB3', '#FF6F00']
    },
    {
        name: 'Elegant Black',
        colors: ['#212121', '#424242', '#616161', '#9E9E9E', '#000000']
    },
    {
        name: 'Vibrant Violet',
        colors: ['#6A1B9A', '#9C27B0', '#CE93D8', '#E1BEE7', '#4A148C']
    },
    {
        name: 'Citrus Fresh',
        colors: ['#AFB42B', '#CDDC39', '#DCE775', '#F0F4C3', '#827717']
    },
    {
        name: 'Berry Blast',
        colors: ['#AD1457', '#EC407A', '#F48FB1', '#FCE4EC', '#880E4F']
    },
    {
        name: 'Cool Mint',
        colors: ['#00838F', '#00BCD4', '#4DD0E1', '#E0F7FA', '#006064']
    },
    {
        name: 'Amber Warmth',
        colors: ['#E65100', '#FF9800', '#FFB74D', '#FFF3E0', '#BF360C']
    },
    {
        name: 'Deep Ocean',
        colors: ['#0D47A1', '#1565C0', '#42A5F5', '#E3F2FD', '#01579B']
    },
    {
        name: 'Rustic Earth',
        colors: ['#6D4C41', '#8D6E63', '#BCAAA4', '#EFEBE9', '#3E2723']
    }
];

// Common font combinations
export const fontCombinations = [
    { name: 'Modern Sans', value: 'Roboto, Helvetica, sans-serif' },
    { name: 'Classic Serif', value: 'Georgia, Times New Roman, serif' },
    { name: 'Professional', value: 'Arial, Helvetica, sans-serif' },
    { name: 'Creative', value: 'Montserrat, Avenir, sans-serif' },
    { name: 'Elegant', value: 'Playfair Display, Georgia, serif' },
    { name: 'Tech-focused', value: 'SF Pro Display, Arial, sans-serif' }
];

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
    inputWrapper: {
        mb: 1.5,
    },
    highlight: {
        bgcolor: alpha('#2196f3', 0.08),
        p: 2,
        borderRadius: 1,
        borderLeft: '4px solid #2196f3',
        mb: 2,
    },
    colorPalette: {
        display: 'flex',
        mb: 1,
        borderRadius: 1,
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        height: 40,
    },
    colorBlock: {
        flex: 1,
        height: '100%',
    },
    paletteCard: {
        mb: 2,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: 'pointer',
        overflow: 'hidden',
        '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 6px 12px rgba(0,0,0,0.1)',
        },
    },
    selectedPalette: {
        border: '2px solid #2196f3',
        transform: 'translateY(-4px)',
        boxShadow: '0 6px 12px rgba(0,0,0,0.15) !important',
    },
    selectedFont: {
        backgroundColor: 'primary.main',
        color: 'white',
        '&:hover': {
            backgroundColor: 'primary.dark',
        },
    },
};