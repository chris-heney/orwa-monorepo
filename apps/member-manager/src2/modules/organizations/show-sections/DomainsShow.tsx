import { Organization, OrganizationDomain } from '@ci-connect/types';
import LanguageIcon from '@mui/icons-material/Language';
import PublicIcon from '@mui/icons-material/Public';
import {
    Box,
    Card,
    CardContent,
    Divider,
    Grid2,
    List,
    ListItem,
    ListItemText,
    Paper,
    Typography,
} from '@mui/material';
import { useRecordContext } from 'react-admin';

export const DomainsShow = () => {
    const record = useRecordContext<Organization>();

    if (!record) return null;

    const domains = record.domains || ([] as OrganizationDomain[]);

    return (
        <Paper elevation={0} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <LanguageIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h5">Domains</Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {domains.length > 0 ? (
                <Grid2 container spacing={3}>
                    {domains.map((domain: any, index: number) => (
                        <Grid2
                            size={{ xs: 12, md: 6 }}
                            key={domain.id || index}
                        >
                            <Card variant="outlined">
                                <CardContent>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            mb: 2,
                                        }}
                                    >
                                        <PublicIcon
                                            color="primary"
                                            sx={{ mr: 1 }}
                                        />
                                        <Typography variant="h6">
                                            {domain.name || 'Unknown Domain'}
                                        </Typography>
                                    </Box>
                                    <Divider sx={{ mb: 2 }} />

                                    <List disablePadding>
                                        <ListItem disableGutters sx={{ mb: 1 }}>
                                            <ListItemText
                                                primary="Domain Name"
                                                secondary={domain.name || '—'}
                                                primaryTypographyProps={{
                                                    variant: 'body2',
                                                    color: 'textSecondary',
                                                }}
                                                secondaryTypographyProps={{
                                                    variant: 'body1',
                                                }}
                                            />
                                        </ListItem>

                                        <ListItem disableGutters sx={{ mb: 1 }}>
                                            <ListItemText
                                                primary="Registrar"
                                                secondary={
                                                    domain.registrar || '—'
                                                }
                                                primaryTypographyProps={{
                                                    variant: 'body2',
                                                    color: 'textSecondary',
                                                }}
                                                secondaryTypographyProps={{
                                                    variant: 'body1',
                                                }}
                                            />
                                        </ListItem>

                                        <ListItem disableGutters sx={{ mb: 1 }}>
                                            <ListItemText
                                                primary="Registration Date"
                                                secondary={
                                                    domain.registrationDate
                                                        ? new Date(
                                                              domain.registrationDate
                                                          ).toLocaleDateString()
                                                        : '—'
                                                }
                                                primaryTypographyProps={{
                                                    variant: 'body2',
                                                    color: 'textSecondary',
                                                }}
                                                secondaryTypographyProps={{
                                                    variant: 'body1',
                                                }}
                                            />
                                        </ListItem>

                                        <ListItem disableGutters sx={{ mb: 1 }}>
                                            <ListItemText
                                                primary="Expiration Date"
                                                secondary={
                                                    domain.expirationDate
                                                        ? new Date(
                                                              domain.expirationDate
                                                          ).toLocaleDateString()
                                                        : '—'
                                                }
                                                primaryTypographyProps={{
                                                    variant: 'body2',
                                                    color: 'textSecondary',
                                                }}
                                                secondaryTypographyProps={{
                                                    variant: 'body1',
                                                }}
                                            />
                                        </ListItem>

                                        <ListItem disableGutters sx={{ mb: 1 }}>
                                            <ListItemText
                                                primary="Auto-Renew"
                                                secondary={
                                                    domain.autoRenew
                                                        ? 'Yes'
                                                        : 'No'
                                                }
                                                primaryTypographyProps={{
                                                    variant: 'body2',
                                                    color: 'textSecondary',
                                                }}
                                                secondaryTypographyProps={{
                                                    variant: 'body1',
                                                }}
                                            />
                                        </ListItem>
                                    </List>
                                </CardContent>
                            </Card>
                        </Grid2>
                    ))}
                </Grid2>
            ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body1" color="textSecondary">
                        No domains have been added for this organization.
                    </Typography>
                </Box>
            )}
        </Paper>
    );
};

export default DomainsShow;
