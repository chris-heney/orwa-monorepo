import React from 'react';
import { Box, Typography, Chip, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { TextField } from 'react-admin';
import { SingleFieldList } from 'react-admin';
import CustomChipField from './ShowCustomChipField';
import CustomArrayField from './ShowCustomArrayField';

interface UniversalShowFieldProps {
    source: string;
    label?: string;
    dataType?: 'array' | 'string' | 'commaString' | 'keyValue' | 'boolean' | 'number';
    selectOptions?: string[];
    categoryOptions?: string[];
    iconType?: 'copy' | 'download' | 'launch' ;
}

const UniversalShowField: React.FC<UniversalShowFieldProps> = ({
    source,
    label,
    dataType = 'array',
    selectOptions,
    categoryOptions,
    iconType
}) => {
    const theme = useTheme();

    const renderContent = () => {
        if (dataType === 'array' || dataType === 'commaString') {
            return (
                <Box display="flex" flexWrap="wrap" gap={1}>
                    <CustomArrayField source={source}>
                        <SingleFieldList >
                            <CustomChipField iconType={iconType} />
                        </SingleFieldList>
                    </CustomArrayField>
                </Box>
            );
        }

        if (dataType === 'boolean') {
            return (
                <Typography>
                    {source ? 'Yes' : 'No'}
                </Typography>
            );
        }

        if (dataType === 'keyValue') {
            return (
                <Box>
                    {Object.entries(source || {}).map(([key, val], index) => (
                        <TextField source={source} key={index}>
                            <strong>{key}:</strong> {String(val)}
                        </TextField>
                    ))}
                </Box>
            );
        }

        if (dataType === 'number' || dataType === 'string') {
            return (
                <Box display="flex" alignItems="center">
                    <Chip
                        label={<TextField source={source} />}
                        sx={{
                            backgroundColor: `${theme.palette.primary.main}95`,
                            '& .MuiChip-label': { color: 'black' },
                        }}
                    />
                </Box>
            );
        }

        return null;
    };

    return (
        <Paper elevation={2} sx={{ padding: 2}}>
            {label && <Typography variant="h6" gutterBottom>{label}</Typography>}
            {renderContent()}
        </Paper>
    );
};

export default UniversalShowField;
