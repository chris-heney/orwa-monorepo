import RateReviewIcon from '@mui/icons-material/RateReview';
import { Box, Paper, Typography } from '@mui/material';
import { ArrayInput, SimpleFormIterator, TextInput } from 'react-admin';
import { styles } from '../styles';

const CustomerTestimonials = () => {
    return (
        <Paper sx={styles.section}>
            <Box sx={styles.sectionTitle}>
                <RateReviewIcon sx={styles.icon} />
                <Typography variant="h6">Customer Testimonials</Typography>
            </Box>

            <Typography variant="body2" color="text.secondary">
                Testimonials build trust with potential customers. Add
                testimonials you've received from your customers.
            </Typography>

            <Box sx={styles.inputWrapper}>
                <ArrayInput source="content.customerTestimonials">
                    <SimpleFormIterator>
                        <TextInput
                            source="text"
                            label="Testimonial"
                            fullWidth
                            multiline
                            rows={3}
                            helperText="The testimonial content"
                            variant="outlined"
                            sx={{ mt: 1 }}
                        />
                        <TextInput
                            source="author"
                            label="Customer Name"
                            helperText="Who provided this testimonial?"
                            variant="outlined"
                            sx={{ mt: 1 }}
                        />
                        <TextInput
                            source="company"
                            label="Company (Optional)"
                            helperText="Customer's company (if applicable)"
                            variant="outlined"
                            sx={{ mt: 1 }}
                        />
                    </SimpleFormIterator>
                </ArrayInput>
            </Box>
        </Paper>
    );
};

export default CustomerTestimonials;
