import React from 'react';
import { TextInput, BooleanInput, SelectInput } from 'react-admin';
import { Typography, Box, Paper, Grid2 } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import EditIcon from '@mui/icons-material/Edit';
import { styles } from '../styles';
import FileUploadField from '../../../../../_components/FileUploadField';
import { useFormContext } from 'react-hook-form';

const AuthorConfiguration = () => {

    const { getValues } = useFormContext();         

    return (
        <Paper sx={styles.section}>
            <Box sx={styles.sectionTitle}>
                <PersonIcon sx={styles.icon} />
                <Typography variant="h6">Author Configuration</Typography>
            </Box>
            
            <Typography variant="body2" paragraph color="text.secondary">
                Configure how author information appears in generated content and articles.
            </Typography>
            
            <Grid2 container spacing={3}>
                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box sx={styles.inputWrapper}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <PersonIcon sx={{ color: '#2196F3', mr: 1 }} />
                            <Typography variant="subtitle1">Author Name & Title</Typography>
                        </Box>
                        <TextInput 
                            source="authorNameAndTitle" 
                            label="Author Name and Title" 
                            fullWidth 
                            helperText="e.g., John Smith, CEO"
                            variant="outlined"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box sx={styles.inputWrapper}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <RecordVoiceOverIcon sx={{ color: '#4CAF50', mr: 1 }} />
                            <Typography variant="subtitle1">Point of View</Typography>
                        </Box>
                        <SelectInput
                            source="authorPointOfView"
                            label="Author Point of View"
                            choices={[
                                { id: 'FIRST_PERSON', name: 'First Person - "I" perspective' },
                                { id: 'THIRD_PERSON', name: 'Third Person - "They/The company" perspective' }
                            ]}
                            fullWidth
                            helperText="Writing perspective for content"
                            variant="outlined"
                        />
                    </Box>
                </Grid2>

                <FileUploadField 
                    source="authorHeadshotId"
                    label="Author Headshot"
                    folderPath={`org-${getValues('name') || 'temp'}`}
                />

                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box sx={styles.inputWrapper}>
                        <BooleanInput
                            source="mentionAuthorInArticles"
                            label="Mention Author in Articles"
                            helperText="Include author information in generated articles"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box sx={styles.inputWrapper}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <EditIcon sx={{ color: '#FF9800', mr: 1 }} />
                            <Typography variant="subtitle1">Author Override</Typography>
                        </Box>
                        <TextInput 
                            source="authorOverride" 
                            label="Author Override" 
                            fullWidth 
                            helperText="Force all posts to use specific author (optional)"
                            variant="outlined"
                        />
                    </Box>
                </Grid2>
            </Grid2>
        </Paper>
    );
};

export default React.memo(AuthorConfiguration);

