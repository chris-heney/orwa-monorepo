import React from 'react';
import { TextInput } from 'react-admin';
import { Typography, Box, Paper, Grid2 } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { styles } from '../styles';
import { useFormContext } from 'react-hook-form';
import FileUploadField from '../../../../../_components/FileUploadField';

const BasicInfoSection = () => {
    const { getValues } = useFormContext();

    return (
        <Paper sx={styles.section}>
            <Box sx={styles.sectionTitle}>
                <PersonIcon sx={styles.icon} />
                <Typography variant="h6">Basic Information</Typography>
            </Box>
            
            <Typography variant="body2" paragraph color="text.secondary">
                Provide basic author information for PR outreach and content attribution.
            </Typography>
            
            <Grid2 container spacing={3}>
                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box sx={styles.inputWrapper}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <PersonIcon sx={{ color: '#2196F3', mr: 1 }} />
                            <Typography variant="subtitle1">Author Name</Typography>
                        </Box>
                        <TextInput 
                            source="authorFullName" 
                            label="Full Name" 
                            fullWidth 
                            helperText="Author's full name for bylines"
                            variant="outlined"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box sx={styles.inputWrapper}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <PersonIcon sx={{ color: '#4CAF50', mr: 1 }} />
                            <Typography variant="subtitle1">Preferred Name</Typography>
                        </Box>
                        <TextInput 
                            source="authorPreferredName" 
                            label="Preferred Name" 
                            fullWidth 
                            helperText="Name to use in articles and content"
                            variant="outlined"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box sx={styles.inputWrapper}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <EmailIcon sx={{ color: '#FF9800', mr: 1 }} />
                            <Typography variant="subtitle1">Email</Typography>
                        </Box>
                        <TextInput 
                            source="authorEmail" 
                            label="Author Email" 
                            fullWidth 
                            type="email"
                            helperText="Email for author contact and verification"
                            variant="outlined"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box sx={styles.inputWrapper}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <LinkedInIcon sx={{ color: '#0A66C2', mr: 1 }} />
                            <Typography variant="subtitle1">LinkedIn Profile</Typography>
                        </Box>
                        <TextInput 
                            source="authorLinkedinProfile" 
                            label="LinkedIn Profile URL" 
                            fullWidth 
                            helperText="LinkedIn profile URL for author credibility"
                            variant="outlined"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12 }}>
                    <Box sx={styles.inputWrapper}>
                        <Typography variant="subtitle1" gutterBottom>
                            Author Headshot
                        </Typography>
                        <FileUploadField
                            source="authorHeadshotId"
                            label="Author Headshot"
                            folderPath={`org-${getValues('name') || 'temp'}/headshots`}
                            accept="image/*"
                            assetType="headshot"
                        />
                    </Box>
                </Grid2>
            </Grid2>
        </Paper>
    );
};

export default React.memo(BasicInfoSection);
