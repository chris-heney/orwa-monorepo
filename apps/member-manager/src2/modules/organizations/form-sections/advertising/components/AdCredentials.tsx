import React from 'react';
import { TextInput } from 'react-admin';
import { Typography, Box, Paper, Divider, Stack } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import { styles } from '../styles';

const AdCredentials = () => {
    return (
        <Paper sx={styles.section}>
            <Box sx={styles.sectionTitle}>
                <LockIcon sx={styles.icon} />
                <Typography variant="h6">Advertising Account Credentials</Typography>
            </Box>
            
            <Typography variant="body2" paragraph color="text.secondary">
                If you want us to help manage your ad accounts, please provide access credentials. This information is stored securely.
            </Typography>
            
            <Stack spacing={3}>
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <GoogleIcon sx={{ color: '#4285F4', mr: 1 }} />
                        <Typography variant="subtitle1">Google Ads Account</Typography>
                    </Box>
                    <TextInput 
                        source="paidAdvertising.googleAdsCredentials" 
                        label="Google Ads Account Information" 
                        fullWidth 
                        multiline
                        rows={3}
                        helperText="Email, account ID, or other access information for your Google Ads account"
                        variant="outlined"
                    />
                </Box>
                
                <Divider />
                
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <FacebookIcon sx={{ color: '#1877F2', mr: 1 }} />
                        <Typography variant="subtitle1">Meta Business Manager</Typography>
                    </Box>
                    <TextInput 
                        source="paidAdvertising.metaBusinessManagerCredentials" 
                        label="Meta Business Manager Information" 
                        fullWidth 
                        multiline
                        rows={3}
                        helperText="Email, account ID, or other access information for Facebook/Instagram ads"
                        variant="outlined"
                    />
                </Box>
            </Stack>
        </Paper>
    );
};

export default React.memo(AdCredentials); 