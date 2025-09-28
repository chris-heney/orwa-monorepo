import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import { Box, Paper, Typography } from '@mui/material';
import { ArrayInput, SimpleFormIterator, TextInput } from 'react-admin';
import { styles } from '../styles';

const CustomerQuestions = () => {
    return (
        <Paper sx={styles.section}>
            <Box sx={styles.sectionTitle}>
                <QuestionAnswerIcon sx={styles.icon} />
                <Typography variant="h6">Top Customer Questions</Typography>
            </Box>

            <Typography variant="body2" color="text.secondary" paragraph>
                What questions do your customers most frequently ask? Content
                addressing these questions can improve engagement and
                conversions.
            </Typography>

            <Box sx={styles.inputWrapper}>
                <ArrayInput source="content.topCustomerQuestions">
                    <SimpleFormIterator>
                        <TextInput
                            source=""
                            label="Customer Question"
                            fullWidth
                            helperText="e.g., How does your service work?"
                            variant="outlined"
                            sx={{ mt: 1 }}
                        />
                    </SimpleFormIterator>
                </ArrayInput>
            </Box>
        </Paper>
    );
};

export default CustomerQuestions;
