import React, { useState } from 'react';
import {
    Show,
    SimpleShowLayout,
    TextField,
    DateField,
    ReferenceField,
    EmailField,
    TopToolbar,
    EditButton,
    useShowContext
} from 'react-admin';
import {
    Avatar,
    Card,
    CardContent,
    Typography,
    Grid,
    Box,
    Chip,
    Paper,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider,
    useTheme,
    Badge
} from '@mui/material';
import {
    Person as PersonIcon,
    Security as SecurityIcon,
    Assignment as AssignmentIcon,
    CheckCircle as CheckCircleIcon,
    AccessTime as AccessTimeIcon,
    Computer as ComputerIcon,
    Public as PublicIcon
} from '@mui/icons-material';
// Using any type for record since we have extended user fields

const UserShowActions = () => (
    <TopToolbar>
        <EditButton />
    </TopToolbar>
);

// Stats Widget Component
const StatsCard = ({ 
    title, 
    value, 
    icon, 
    color = 'primary',
    subtitle 
}: { 
    title: string; 
    value: string | number; 
    icon: React.ReactNode; 
    color?: string;
    subtitle?: string;
}) => {
    
    return (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                        <Typography variant="h4" fontWeight="bold" color={`${color}.main`}>
                            {value}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {title}
                        </Typography>
                        {subtitle && (
                            <Typography variant="caption" color="text.disabled">
                                {subtitle}
                            </Typography>
                        )}
                    </Box>
                    <Box
                        sx={{
                            p: 2,
                            borderRadius: '50%',
                            backgroundColor: `${color}.light`,
                            color: `${color}.main`
                        }}
                    >
                        {icon}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

// Activity Feed Component
const ActivityFeed = () => {
    const [activities] = useState([
        {
            id: 1,
            type: 'login',
            title: 'Logged into system',
            description: 'Successful authentication via OIDC',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            icon: <SecurityIcon />
        },
        {
            id: 2,
            type: 'task',
            title: 'Completed domain review',
            description: 'Reviewed and approved 3 domain configurations',
            timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
            icon: <CheckCircleIcon />
        },
        {
            id: 3,
            type: 'edit',
            title: 'Updated organization profile',
            description: 'Modified contact information for Acme Corp',
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            icon: <PersonIcon />
        },
        {
            id: 4,
            type: 'system',
            title: 'Permission granted',
            description: 'Added to Domain Administrators role',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            icon: <SecurityIcon />
        },
        {
            id: 5,
            type: 'task',
            title: 'Ticket resolved',
            description: 'Closed support ticket #1234 - DNS configuration',
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            icon: <AssignmentIcon />
        }
    ]);

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccessTimeIcon />
                    Recent Activity
                </Typography>
                <List dense>
                    {activities.map((activity, index) => (
                        <React.Fragment key={activity.id}>
                            <ListItem>
                                <ListItemIcon>
                                    <Badge 
                                        color={
                                            activity.type === 'login' ? 'success' :
                                            activity.type === 'task' ? 'primary' :
                                            activity.type === 'edit' ? 'warning' : 'info'
                                        }
                                        variant="dot"
                                    >
                                        {activity.icon}
                                    </Badge>
                                </ListItemIcon>
                                <ListItemText
                                    primary={
                                        <Typography variant="body2" fontWeight="medium">
                                            {activity.title}
                                        </Typography>
                                    }
                                    secondary={
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">
                                                {activity.description}
                                            </Typography>
                                            <Typography variant="caption" display="block" color="text.disabled">
                                                {activity.timestamp.toLocaleString()}
                                            </Typography>
                                        </Box>
                                    }
                                />
                            </ListItem>
                            {index < activities.length - 1 && <Divider variant="inset" component="li" />}
                        </React.Fragment>
                    ))}
                </List>
            </CardContent>
        </Card>
    );
};

// User Header Component
const UserHeader = () => {
    const { record } = useShowContext<any>();
    const theme = useTheme();
    
    if (!record) return null;

    return (
        <Paper 
            sx={{ 
                p: 3, 
                mb: 3,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}15 100%)`
            }}
        >
            <Box display="flex" alignItems="center" gap={3}>
                <Avatar
                    src={record.profilePicture?.fileUrl}
                    alt={record.displayName || record.username}
                    sx={{ 
                        width: 120, 
                        height: 120,
                        border: `4px solid ${theme.palette.background.paper}`,
                        boxShadow: theme.shadows[4]
                    }}
                >
                    {(record.displayName || record.username)?.charAt(0)?.toUpperCase()}
                </Avatar>
                <Box flex={1}>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        {record.displayName || record.username}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" gutterBottom>
                        @{record.username}
                    </Typography>
                    <Box display="flex" gap={1} flexWrap="wrap" mt={2}>
                        {Array.isArray(record.role) && record.role?.map((role: any, index: number) => (
                            <Chip
                                key={index}
                                label={role.name}
                                color={role.name === 'Super Admins' ? 'error' : 'primary'}
                                variant="filled"
                                size="small"
                            />
                        ))}
                    </Box>
                </Box>
                <Box textAlign="right">
                    <Typography variant="body2" color="text.secondary">
                        Member since
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                        {record.createdAt ? new Date(record.createdAt).toLocaleDateString() : 'Unknown'}
                    </Typography>
                    {record.lastLoginAt && (
                        <>
                            <Typography variant="body2" color="text.secondary" mt={1}>
                                Last active
                            </Typography>
                            <Typography variant="body1" fontWeight="medium">
                                {new Date(record.lastLoginAt).toLocaleDateString()}
                            </Typography>
                        </>
                    )}
                </Box>
            </Box>
        </Paper>
    );
};

export const UserShow = () => {
    
    // Mock stats - in real app these would come from APIs
    const stats = {
        ticketsClosed: Math.floor(Math.random() * 50) + 10,
        tasksCompleted: Math.floor(Math.random() * 100) + 25,
        domainsManaged: Math.floor(Math.random() * 20) + 5,
        loginSessions: Math.floor(Math.random() * 200) + 50
    };

    return (
        <Show queryOptions={{
            meta: {
                populate: ['profilePicture'],
                raw: true
            }
        }} actions={<UserShowActions />} component="div">
            <UserHeader />
            
            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatsCard
                        title="Tickets Closed"
                        value={stats.ticketsClosed}
                        icon={<CheckCircleIcon />}
                        color="success"
                        subtitle="This month"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatsCard
                        title="Tasks Completed"
                        value={stats.tasksCompleted}
                        icon={<AssignmentIcon />}
                        color="primary"
                        subtitle="All time"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatsCard
                        title="Domains Managed"
                        value={stats.domainsManaged}
                        icon={<PublicIcon />}
                        color="info"
                        subtitle="Active"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatsCard
                        title="Login Sessions"
                        value={stats.loginSessions}
                        icon={<ComputerIcon />}
                        color="warning"
                        subtitle="Total"
                    />
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                {/* User Details */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <PersonIcon />
                                User Information
                            </Typography>
                            <SimpleShowLayout>
                                <TextField source="displayName" label="Display Name" />
                                <TextField source="username" label="Username" />
                                <ReferenceField source="contactId" reference="contact" label="Contact Email" link={false}>
                                    <EmailField source="email" />
                                </ReferenceField>
                                <TextField source="authProvider" label="Authentication Provider" />
                                <TextField source="authExternalId" label="External ID" />
                                <DateField source="createdAt" label="Account Created" showTime />
                                <DateField source="lastLoginAt" label="Last Login" showTime />
                                <DateField source="updatedAt" label="Last Updated" showTime />
                            </SimpleShowLayout>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Activity Feed */}
                <Grid item xs={12} md={6}>
                    <ActivityFeed  />
                </Grid>
            </Grid>
        </Show>
    );
};
