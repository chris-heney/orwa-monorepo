import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    Grid,
    Stack,
    Typography,
    useTheme,
} from '@mui/material';
import {
    DateField,
    UrlField,
    useRecordContext,
    useRedirect,
    useDelete,
    useNotify,
    useRefresh,
} from 'react-admin';
import {
    Edit as EditIcon,
    Visibility as ViewIcon,
    OpenInNew as ExternalLinkIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';
import { AppIconField } from './AppIconField';
import { AppCategoryField } from './AppCategoryField';

export const AppExpandView = () => {
    const record = useRecordContext();
    const theme = useTheme();
    const redirect = useRedirect();
    const [deleteOne] = useDelete();
    const notify = useNotify();
    const refresh = useRefresh();

    if (!record) return null;

    const handleDelete = async () => {
            try {
                await deleteOne('app', { id: record.id, previousData: record });
                notify('App deleted successfully', { type: 'success' });
                refresh();
            } catch (error) {
                notify('Error deleting app', { type: 'error' });
                console.error('Delete error:', error);
            }
    };

    return (
        <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
            <Grid container spacing={2}>
                {/* App Details Card */}
                <Grid item xs={12} md={6}>
                    <Card
                        variant="outlined"
                        sx={{ height: '100%', borderColor: theme.palette.divider }}
                    >
                        <CardContent>
                            <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                                <AppIconField />
                                <Typography variant="h6">{record.name}</Typography>
                                <AppCategoryField />
                            </Stack>
                            
                            <Typography variant="body2" color="textSecondary" paragraph>
                                {record.description}
                            </Typography>
                            
                            <Divider sx={{ my: 2 }} />
                            
                            <Stack spacing={1}>
                                <Box display="flex">
                                    <Typography variant="body2" sx={{ minWidth: 100 }} color="textSecondary">
                                        URL:
                                    </Typography>
                                    <UrlField source="url" target="_blank" />
                                </Box>
                                <Box display="flex">
                                    <Typography variant="body2" sx={{ minWidth: 100 }} color="textSecondary">
                                        Status:
                                    </Typography>
                                    <Chip 
                                        size="small" 
                                        label={record.isActive ? 'Active' : 'Inactive'}
                                        color={record.isActive ? 'success' : 'default'}
                                    />
                                </Box>
                                <Box display="flex">
                                    <Typography variant="body2" sx={{ minWidth: 100 }} color="textSecondary">
                                        Order:
                                    </Typography>
                                    <Typography variant="body2">{record.order || 'Not set'}</Typography>
                                </Box>
                                <Box display="flex">
                                    <Typography variant="body2" sx={{ minWidth: 100 }} color="textSecondary">
                                        Created:
                                    </Typography>
                                    <DateField source="createdAt" showTime />
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
                
                {/* Actions Card */}
                <Grid item xs={12} md={6}>
                    <Card
                        variant="outlined"
                        sx={{ height: '100%', borderColor: theme.palette.divider }}
                    >
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Quick Actions
                            </Typography>
                            <Stack spacing={2} mt={2}>
                                <Button
                                    variant="outlined"
                                    startIcon={<ViewIcon />}
                                    onClick={() => window.location.href = `/#/app/${record.id}/show`}
                                    fullWidth
                                    sx={{ justifyContent: 'flex-start' }}
                                >
                                    View Details
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={<EditIcon />}
                                    onClick={() => window.location.href = `/#/app/${record.id}`}
                                    fullWidth
                                    sx={{ justifyContent: 'flex-start' }}
                                >
                                    Edit App
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={<ExternalLinkIcon />}
                                    href={record.url}
                                    target="_blank"
                                    fullWidth
                                    sx={{ justifyContent: 'flex-start' }}
                                >
                                    Open App
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    startIcon={<DeleteIcon />}
                                    onClick={handleDelete}
                                    fullWidth
                                    sx={{ justifyContent: 'flex-start' }}
                                >
                                    Delete App
                                </Button>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};
