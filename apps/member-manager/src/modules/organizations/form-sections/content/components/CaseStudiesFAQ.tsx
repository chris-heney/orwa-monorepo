import CaseIcon from '@mui/icons-material/Cases';
import { Box, Paper, Typography } from '@mui/material';
import { BooleanInput } from 'react-admin';
import { styles } from '../styles';

const CaseStudiesFAQ = () => {
    return (
        <Paper sx={styles.section}>
            <Box sx={styles.sectionTitle}>
                <CaseIcon sx={styles.icon} />
                <Typography variant="h6">Case Studies & FAQ</Typography>
            </Box>

            <Typography variant="body2" color="text.secondary" paragraph>
                Case studies and FAQs help demonstrate your expertise and answer
                common questions.
            </Typography>

            <Box sx={styles.booleanInput}>
                <BooleanInput
                    source="content.caseStudiesAvailable"
                    label="I have case studies available"
                />
            </Box>

            <Box sx={styles.booleanInput}>
                <BooleanInput
                    source="content.faqSectionNeeded"
                    label="I need an FAQ section on my website"
                />
            </Box>
        </Paper>
    );
};

export default CaseStudiesFAQ;
