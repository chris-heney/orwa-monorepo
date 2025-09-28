import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { Box, Paper, Typography } from '@mui/material';
import { BooleanInput, TextInput } from 'react-admin';
import { styles } from '../styles';

const ContentCreationHelp = () => {
    return (
        <Paper sx={styles.section}>
            <Box sx={styles.sectionTitle}>
                <HelpOutlineIcon sx={styles.icon} />
                <Typography variant="h6">Content Creation Help</Typography>
            </Box>

            <Typography variant="body2" color="text.secondary" paragraph>
                Let us know if you need assistance with writing content for your
                website pages.
            </Typography>

            <Box sx={styles.booleanInput}>
                <BooleanInput
                    source="content.needHelpWritingPages"
                    label="I need help writing content for my pages"
                />
            </Box>

            <Box sx={styles.inputWrapper}>
                <TextInput
                    source="content.mostVisibleServices"
                    label="Most Important Services/Products"
                    fullWidth
                    multiline
                    rows={3}
                    helperText="List the services or products you want to highlight most prominently"
                    variant="outlined"
                />
            </Box>
        </Paper>
    );
};

export default ContentCreationHelp;
