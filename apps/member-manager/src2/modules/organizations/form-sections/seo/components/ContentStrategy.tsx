import ArticleIcon from '@mui/icons-material/Article';
import { Box, Paper, Typography } from '@mui/material';
import { BooleanInput, TextInput } from 'react-admin';
import { styles } from '../styles';

const ContentStrategy = () => {
    return (
        <Paper sx={styles.section}>
            <Box sx={styles.sectionTitle}>
                <ArticleIcon sx={styles.icon} />
                <Typography variant="h6">Content Strategy</Typography>
            </Box>

            <Typography variant="body2" color="text.secondary" paragraph>
                Content is a crucial part of SEO. Provide details about your
                current content strategy.
            </Typography>

            <Box sx={styles.toggleGroup}>
                <BooleanInput source="seo.hasBlog" label="Website has a blog" />

                <BooleanInput
                    source="seo.hasSeoStrategy"
                    label="Has a documented SEO strategy"
                />
            </Box>

            <Box sx={styles.inputWrapper}>
                <TextInput
                    source="seo.contentAudit"
                    label="Content Audit Notes"
                    fullWidth
                    multiline
                    rows={3}
                    helperText="Summarize your current content strengths and weaknesses"
                    variant="outlined"
                />
            </Box>

            <Box sx={styles.inputWrapper}>
                <TextInput
                    source="seo.internalLinkingStrategy"
                    label="Internal Linking Strategy"
                    fullWidth
                    multiline
                    rows={2}
                    helperText="Describe how your pages link to each other"
                    variant="outlined"
                />
            </Box>
        </Paper>
    );
};

export default ContentStrategy;
