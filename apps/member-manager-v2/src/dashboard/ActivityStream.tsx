import ProjectIcon from '@mui/icons-material/FolderOpen';
import PersonIcon from '@mui/icons-material/Person';
import OrderIcon from '@mui/icons-material/ShoppingCart';
import TimelineIcon from '@mui/icons-material/Timeline';
import {
    Avatar,
    Box,
    Card,
    CardContent,
    CardHeader,
    Chip,
    List,
    ListItem,
    Typography,
} from '@mui/material';
import { useTranslate } from 'react-admin';

interface ActivityEvent {
    id: string;
    type: 'user' | 'project' | 'order' | 'system';
    title: string;
    description: string;
    user: string;
    timestamp: Date;
    metadata?: any;
}

interface Props {
    events?: ActivityEvent[];
}

const ActivityStream = (props: Props) => {
    const { events = [] } = props;
    const translate = useTranslate();

    // Mock data for now
    const mockEvents: ActivityEvent[] = [
        {
            id: '1',
            type: 'user',
            title: 'New user registered',
            description: 'John Doe joined the platform',
            user: 'System',
            timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
        },
        {
            id: '2',
            type: 'project',
            title: 'Project milestone reached',
            description: 'Website redesign project reached 75% completion',
            user: 'Sarah Connor',
            timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
        },
        {
            id: '3',
            type: 'order',
            title: 'New order received',
            description: 'Order #12345 for $2,500 marketing package',
            user: 'Mike Johnson',
            timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
        },
        {
            id: '4',
            type: 'system',
            title: 'System maintenance completed',
            description: 'Database optimization completed successfully',
            user: 'System',
            timestamp: new Date(Date.now() - 1000 * 60 * 180), // 3 hours ago
        },
        {
            id: '5',
            type: 'project',
            title: 'Project started',
            description: 'SEO optimization project for ABC Corp initiated',
            user: 'Emily Davis',
            timestamp: new Date(Date.now() - 1000 * 60 * 300), // 5 hours ago
        },
    ];

    const displayEvents = events.length > 0 ? events : mockEvents;

    const getEventIcon = (type: string) => {
        switch (type) {
            case 'user':
                return <PersonIcon />;
            case 'project':
                return <ProjectIcon />;
            case 'order':
                return <OrderIcon />;
            default:
                return <TimelineIcon />;
        }
    };

    const getEventColor = (type: string) => {
        switch (type) {
            case 'user':
                return 'success';
            case 'project':
                return 'primary';
            case 'order':
                return 'warning';
            case 'system':
                return 'info';
            default:
                return 'default';
        }
    };

    const formatTimeAgo = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (minutes < 60) {
            return `${minutes}m ago`;
        } else if (hours < 24) {
            return `${hours}h ago`;
        } else {
            return `${days}d ago`;
        }
    };

    return (
        <Card sx={{ height: '100%' }}>
            <CardHeader
                avatar={<TimelineIcon color="primary" />}
                title={translate('pos.dashboard.activity_stream')}
                titleTypographyProps={{ variant: 'h6' }}
            />
            <CardContent sx={{ pt: 0, maxHeight: 400, overflow: 'auto' }}>
                {displayEvents.length === 0 ? (
                    <Typography
                        color="textSecondary"
                        sx={{ textAlign: 'center', py: 4 }}
                    >
                        {translate('pos.dashboard.no_activity')}
                    </Typography>
                ) : (
                    <List dense>
                        {displayEvents.map((event, index) => (
                            <ListItem
                                key={event.id}
                                sx={{ px: 0, alignItems: 'flex-start' }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        width: '100%',
                                        position: 'relative',
                                    }}
                                >
                                    {/* Timeline line */}
                                    {index < displayEvents.length - 1 && (
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                left: '20px',
                                                top: '40px',
                                                bottom: '-20px',
                                                width: '2px',
                                                backgroundColor: 'divider',
                                            }}
                                        />
                                    )}

                                    {/* Event icon */}
                                    <Avatar
                                        sx={{
                                            width: 40,
                                            height: 40,
                                            mr: 2,
                                            bgcolor: `${getEventColor(
                                                event.type
                                            )}.light`,
                                            color: `${getEventColor(
                                                event.type
                                            )}.dark`,
                                        }}
                                    >
                                        {getEventIcon(event.type)}
                                    </Avatar>

                                    {/* Event content */}
                                    <Box sx={{ flex: 1 }}>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                mb: 0.5,
                                            }}
                                        >
                                            <Typography
                                                variant="subtitle2"
                                                sx={{ flexGrow: 1 }}
                                            >
                                                {event.title}
                                            </Typography>
                                            <Chip
                                                label={event.type}
                                                size="small"
                                                color={
                                                    getEventColor(
                                                        event.type
                                                    ) as any
                                                }
                                                variant="outlined"
                                                sx={{ ml: 1 }}
                                            />
                                        </Box>
                                        <Typography
                                            variant="body2"
                                            color="textSecondary"
                                            sx={{ mb: 0.5 }}
                                        >
                                            {event.description}
                                        </Typography>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1,
                                            }}
                                        >
                                            <Typography
                                                variant="caption"
                                                color="textSecondary"
                                            >
                                                by {event.user}
                                            </Typography>
                                            <Typography
                                                variant="caption"
                                                color="textSecondary"
                                            >
                                                •{' '}
                                                {formatTimeAgo(event.timestamp)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </ListItem>
                        ))}
                    </List>
                )}
            </CardContent>
        </Card>
    );
};

export default ActivityStream;
