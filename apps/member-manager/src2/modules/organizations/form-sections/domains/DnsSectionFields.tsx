import DnsIcon from '@mui/icons-material/Dns';
import { Box, Typography } from '@mui/material';
import React from 'react';
import { ArrayInput, SimpleFormIterator, TextInput } from 'react-admin';
import { styles } from './styles';

interface DnsSectionFieldsProps {
    prefix?: string;
    recordType: string;
    description: string;
    source: string;
    placeholder: string;
    helperText: string;
}

const DnsSectionFields: React.FC<DnsSectionFieldsProps> = ({
    prefix = '',
    recordType,
    description,
    source,
    placeholder,
    helperText,
}) => {
    return (
        <Box>
            <Box sx={styles.recordType}>
                <DnsIcon sx={styles.recordTypeIcon} />
                <Typography variant="subtitle2">
                    {recordType} Records
                </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" paragraph>
                {description}
            </Typography>
            <ArrayInput source={`${prefix}${source}`} label="">
                <SimpleFormIterator inline>
                    <TextInput
                        source=""
                        label={`${recordType} Record`}
                        fullWidth
                        placeholder={placeholder}
                        variant="outlined"
                        helperText={helperText}
                    />
                </SimpleFormIterator>
            </ArrayInput>
        </Box>
    );
};

export default DnsSectionFields;
