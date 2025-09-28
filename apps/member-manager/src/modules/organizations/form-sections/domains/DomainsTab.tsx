import LinkIcon from '@mui/icons-material/Link';
import { Box, Grid2, Typography } from '@mui/material';
import { ArrayInput, SimpleFormIterator } from 'react-admin';
import DomainFields from './DomainFields';
import { styles } from './styles';

const DomainsTab = () => {
    return (
        <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12 }}>
                <Box sx={styles.highlight}>
                    <Typography variant="body1">
                        Manage your website domains and DNS records. These
                        settings determine how your domain connects to various
                        services.
                    </Typography>
                </Box>
            </Grid2>

            <Grid2 size={{ xs: 12 }}>
                <Box sx={styles.sectionTitle}>
                    <LinkIcon sx={styles.icon} />
                    <Typography variant="h6">Domain Information</Typography>
                </Box>

                <ArrayInput source="domains">
                    <SimpleFormIterator fullWidth>
                        <DomainFields />
                    </SimpleFormIterator>
                </ArrayInput>
            </Grid2>
        </Grid2>
    );
};

export default DomainsTab;
