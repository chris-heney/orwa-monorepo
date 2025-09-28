import { Organization } from '@ci-connect/types';
import ContactsIcon from '@mui/icons-material/Contacts';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import WorkIcon from '@mui/icons-material/Work';
import {
    Avatar,
    Box,
    Card,
    CardContent,
    Chip,
    Divider,
    Grid2,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    Typography,
} from '@mui/material';
import { useRecordContext } from 'react-admin';

export const ContactsShow = () => {
    const record = useRecordContext<Organization>();

    if (!record) return null;

    const organizationContacts = record.organizationContact || [];

    // Function to get initials from name
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(part => part.charAt(0))
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    // Function to get contact type color
    const getContactTypeColor = (type: string) => {
        switch (type?.toLowerCase()) {
            case 'primary':
                return 'primary';
            case 'billing':
                return 'secondary';
            case 'technical':
                return 'info';
            case 'sales':
                return 'success';
            default:
                return 'default';
        }
    };

    return (
        <Paper elevation={0} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <ContactsIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h5">Contacts</Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {organizationContacts.length === 0 ? (
                <Typography variant="body1" color="textSecondary">
                    No contacts have been added for this organization.
                </Typography>
            ) : (
                <Grid2 container spacing={2}>
                    {organizationContacts.map((organizationContact, index) => {
                        const contact = organizationContact.contact;
                        return (
                            <Grid2
                                size={{
                                    xs: 12,
                                    sm: 6,
                                    md: 4,
                                }}
                                key={contact?.id || index}
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
                                            <Avatar
                                                sx={{
                                                    bgcolor: `${getContactTypeColor(
                                                        organizationContact.contactType
                                                    )}.main`,
                                                    mr: 2,
                                                }}
                                            >
                                                {contact && contact.first ? (
                                                    getInitials(
                                                        `${contact.first} ${contact.last}`
                                                    )
                                                ) : (
                                                    <PersonIcon />
                                                )}
                                            </Avatar>
                                            <Box>
                                                <Typography
                                                    variant="h6"
                                                    component="div"
                                                >
                                                    {contact?.first}{' '}
                                                    {contact?.last}
                                                </Typography>
                                                <Chip
                                                    label={
                                                        organizationContact.contactType ||
                                                        'Contact'
                                                    }
                                                    size="small"
                                                    color={getContactTypeColor(
                                                        organizationContact.contactType
                                                    )}
                                                    variant="outlined"
                                                />
                                            </Box>
                                        </Box>

                                        <List dense disablePadding>
                                            {contact?.title && (
                                                <ListItem
                                                    disablePadding
                                                    sx={{ pb: 1 }}
                                                >
                                                    <ListItemIcon
                                                        sx={{ minWidth: 36 }}
                                                    >
                                                        <WorkIcon
                                                            fontSize="small"
                                                            color="action"
                                                        />
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={contact.title}
                                                    />
                                                </ListItem>
                                            )}

                                            {contact?.phones && (
                                                <ListItem
                                                    disablePadding
                                                    sx={{ pb: 1 }}
                                                >
                                                    <ListItemIcon
                                                        sx={{ minWidth: 36 }}
                                                    >
                                                        <PhoneIcon
                                                            fontSize="small"
                                                            color="action"
                                                        />
                                                    </ListItemIcon>
                                                    {contact.phones.map(
                                                        (phone, index) => (
                                                            <ListItemText
                                                                key={index}
                                                                primary={phone}
                                                            />
                                                        )
                                                    )}
                                                </ListItem>
                                            )}

                                            {contact?.email && (
                                                <ListItem
                                                    disablePadding
                                                    sx={{ pb: 1 }}
                                                >
                                                    <ListItemIcon
                                                        sx={{ minWidth: 36 }}
                                                    >
                                                        <EmailIcon
                                                            fontSize="small"
                                                            color="action"
                                                        />
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={contact.email}
                                                    />
                                                </ListItem>
                                            )}
                                        </List>
                                    </CardContent>
                                </Card>
                            </Grid2>
                        );
                    })}
                </Grid2>
            )}
        </Paper>
    );
};

export default ContactsShow;
