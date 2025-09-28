import FeedIcon from '@mui/icons-material/Feed';
import { Box, Paper, Typography } from '@mui/material';
import { BooleanInput } from 'react-admin';
import { styles } from '../styles';

const BlogSection = () => {
    return (
        <Paper sx={styles.section}>
            <Box sx={styles.sectionTitle}>
                <FeedIcon sx={styles.icon} />
                <Typography variant="h6">Blog Content</Typography>
            </Box>

            <Typography variant="body2" color="text.secondary" paragraph>
                Blogs help establish your expertise and improve SEO. Would you
                like to include blog content on your website?
            </Typography>

            <Box sx={styles.booleanInput}>
                <BooleanInput
                    source="content.blogContentNeeded"
                    label="Include blog content on website"
                />
            </Box>
        </Paper>
    );
};

export default BlogSection;
