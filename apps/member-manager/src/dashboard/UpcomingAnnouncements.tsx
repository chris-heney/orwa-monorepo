import CampaignIcon from '@mui/icons-material/Campaign';
import {
    Avatar,
    Box,
    Card,
    CardContent,
    CardHeader,
    Chip,
    List,
    ListItem,
    ListItemText,
    Typography,
} from '@mui/material';
import { format } from 'date-fns';
import { useTranslate } from 'react-admin';

interface Announcement {
    id: string;
    title: string;
    content: string;
    author: string;
    authorAvatar?: string;
    date: Date;
    priority: 'high' | 'medium' | 'low';
}

interface Props {
    announcements?: Announcement[];
}

const UpcomingAnnouncements = (props: Props) => {
    const { announcements = [] } = props;
    const translate = useTranslate();

    // Mock data for now
    const mockAnnouncements: Announcement[] = [
        {
            id: '1',
            title: 'Q1 Company Meeting',
            content:
                'Join us for the quarterly all-hands meeting on March 15th at 2 PM EST.',
            author: 'CEO',
            date: new Date('2024-03-15'),
            priority: 'high',
        },
        {
            id: '2',
            title: 'New Client Onboarding Process',
            content:
                "We're implementing a new streamlined onboarding process starting next week.",
            author: 'CEO',
            date: new Date('2024-03-10'),
            priority: 'medium',
        },
        {
            id: '3',
            title: 'Office Renovation Update',
            content:
                'The office renovation will begin on April 1st. Remote work options available.',
            author: 'CEO',
            date: new Date('2024-04-01'),
            priority: 'low',
        },
    ];

    const displayAnnouncements =
        announcements.length > 0 ? announcements : mockAnnouncements;

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'error';
            case 'medium':
                return 'warning';
            case 'low':
                return 'info';
            default:
                return 'default';
        }
    };

    return (
        <Card sx={{ height: '100%' }}>
            <CardHeader
                avatar={<CampaignIcon color="primary" />}
                title={translate('pos.dashboard.upcoming_announcements')}
                titleTypographyProps={{ variant: 'h6' }}
            />
            <CardContent sx={{ pt: 0, maxHeight: 400, overflow: 'auto' }}>
                {displayAnnouncements.length === 0 ? (
                    <Typography
                        color="textSecondary"
                        sx={{ textAlign: 'center', py: 4 }}
                    >
                        {translate('pos.dashboard.no_announcements')}
                    </Typography>
                ) : (
                    <List dense>
                        {displayAnnouncements.map(announcement => (
                            <ListItem
                                key={announcement.id}
                                sx={{ px: 0, alignItems: 'flex-start' }}
                            >
                                <Box sx={{ width: '100%' }}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            mb: 1,
                                        }}
                                    >
                                        <Avatar
                                            sx={{
                                                width: 24,
                                                height: 24,
                                                mr: 1,
                                                fontSize: '0.75rem',
                                            }}
                                        >
                                            {announcement.author.charAt(0)}
                                        </Avatar>
                                        <Typography
                                            variant="subtitle2"
                                            sx={{ flexGrow: 1 }}
                                        >
                                            {announcement.title}
                                        </Typography>
                                        <Chip
                                            label={announcement.priority}
                                            size="small"
                                            color={
                                                getPriorityColor(
                                                    announcement.priority
                                                ) as any
                                            }
                                            sx={{ ml: 1 }}
                                        />
                                    </Box>
                                    <ListItemText
                                        primary={announcement.content}
                                        secondary={format(
                                            announcement.date,
                                            'MMM dd, yyyy'
                                        )}
                                        primaryTypographyProps={{
                                            variant: 'body2',
                                            color: 'textSecondary',
                                        }}
                                        secondaryTypographyProps={{
                                            variant: 'caption',
                                        }}
                                        sx={{ mt: 0 }}
                                    />
                                </Box>
                            </ListItem>
                        ))}
                    </List>
                )}
            </CardContent>
        </Card>
    );
};

export default UpcomingAnnouncements;
