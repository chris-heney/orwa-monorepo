import React from 'react';
import { TextInput } from 'react-admin';
import { Typography, Box, Paper, Grid2 } from '@mui/material';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import PersonIcon from '@mui/icons-material/Person';
import DescriptionIcon from '@mui/icons-material/Description';
import { styles } from '../styles';

const CompanyStrategy = () => {
    return (
        <Paper sx={styles.section}>
            <Box sx={styles.sectionTitle}>
                <BusinessCenterIcon sx={styles.icon} />
                <Typography variant="h6">Company Strategy & Positioning</Typography>
            </Box>
            
            <Typography variant="body2" paragraph color="text.secondary">
                AI-generated content helps define your company's strategy, customer avatar, and positioning.
            </Typography>
            
            <Grid2 container spacing={3}>
                <Grid2 size={{ xs: 12 }}>
                    <Box sx={styles.inputWrapper}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <BusinessCenterIcon sx={{ color: '#2196F3', mr: 1 }} />
                            <Typography variant="subtitle1">Company Strategy</Typography>
                        </Box>
                        <TextInput 
                            source="companyStrategy" 
                            label="Company Strategy" 
                            fullWidth 
                            multiline
                            rows={4}
                            helperText="AI-generated overview of services, positioning, and value proposition"
                            variant="outlined"
                        />
                    </Box>
                </Grid2>
                
                <Grid2 size={{ xs: 12 }}>
                    <Box sx={styles.inputWrapper}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <PersonIcon sx={{ color: '#FF9800', mr: 1 }} />
                            <Typography variant="subtitle1">Customer Avatar</Typography>
                        </Box>
                        <TextInput 
                            source="customerAvatar" 
                            label="Customer Avatar" 
                            fullWidth 
                            multiline
                            rows={4}
                            helperText="AI-generated target customer persona including demographics and pain points"
                            variant="outlined"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12 }}>
                    <Box sx={styles.inputWrapper}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <DescriptionIcon sx={{ color: '#4CAF50', mr: 1 }} />
                            <Typography variant="subtitle1">Short Description</Typography>
                        </Box>
                        <TextInput 
                            source="descriptionShort" 
                            label="Short Company Description" 
                            fullWidth 
                            multiline
                            rows={3}
                            helperText="AI-generated short company description for metadata and SEO"
                            variant="outlined"
                        />
                    </Box>
                </Grid2>
            </Grid2>
        </Paper>
    );
};

export default React.memo(CompanyStrategy);
