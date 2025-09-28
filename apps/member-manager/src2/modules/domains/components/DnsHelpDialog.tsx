import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, Stack } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

export const DnsHelpDialog = ({
    open,
    onClose,
}: {
    open: boolean;
    onClose: () => void;
}) => (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
            <Box display="flex" alignItems="center" gap={1}>
                <InfoIcon color="primary" />
                DNS Records Help
            </Box>
        </DialogTitle>
        <DialogContent>
            <Stack spacing={2}>
                <Box>
                    <Typography variant="h6" color="primary">
                        A Records
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Point your domain to an IP address (e.g., 192.168.1.1)
                    </Typography>
                </Box>
                <Box>
                    <Typography variant="h6" color="primary">
                        CNAME Records
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Point your domain to another domain (e.g., example.com)
                    </Typography>
                </Box>
                <Box>
                    <Typography variant="h6" color="primary">
                        MX Records
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Mail exchange records for email routing (e.g., 10
                        mail.example.com)
                    </Typography>
                </Box>
                <Box>
                    <Typography variant="h6" color="primary">
                        TXT Records
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Text records for verification, SPF, DKIM, etc.
                    </Typography>
                </Box>
                <Box>
                    <Typography variant="h6" color="primary">
                        NS Records
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Name server records (e.g., ns1.example.com)
                    </Typography>
                </Box>
            </Stack>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose} color="primary">
                Got it
            </Button>
        </DialogActions>
    </Dialog>
);