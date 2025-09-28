import * as React from 'react';
import { SolarMenu } from '@react-admin/ra-navigation';
import { ThemeSwapper } from '../themes2/ThemeSwapper';
import { useTranslate, useDataProvider } from 'react-admin';
import { 
    ListSubheader, 
    useTheme, 
    Typography, 
    Box, 
    Chip, 
    Divider,
    ListItem,
    ListItemIcon,
    ListItemText,
    FormControl,
    Select,
    MenuItem,
    Alert,
    Button,
    SelectChangeEvent
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import RestoreIcon from '@mui/icons-material/Restore';
import { useUserPermissions } from '../rbac2';
import { useNavigate } from 'react-router-dom';
 

export const ProfileSubMenu = () => {
    const navigate = useNavigate();
    const translate = useTranslate();
    const { isOriginalSuperAdmin } = useUserPermissions();
    const dataProvider = useDataProvider();
    const [activeTestRole, setActiveTestRole] = React.useState<string | null>(
        localStorage.getItem('activeTestRole')
    );
    const [roleName, setRoleName] = React.useState<string | null>(null);
    const [dbRoles, setDbRoles] = React.useState<string[]>([]);
    const [roles, setRoles] = React.useState<string[]>([]);
    const [userId, setUserId] = React.useState<string | null>(null);
    
    const toggleThemeTitle = translate('pos.theme.change_language', {
        _: 'Change Language',
    });
    const theme = useTheme();

    // Load current user's role(s) from backend DB using the stored token
    React.useEffect(() => {
        const load = async () => {
            try {
                const user = await dataProvider.getList('user', { 
                    pagination: { page: 1, perPage: 1 },
                    sort: { field: 'id', order: 'ASC' },
                    filter: { token: {
                            "$eq": localStorage.getItem('id_token')
                    } },
                    meta: {
                        populate: ['role'],
                        raw: true
                    }
                });
                const rolesFromUser = (user.data[0]?.role || []).map((r: any) => r.name);
                setDbRoles(rolesFromUser);
                setUserId(user.data[0]?.id);
                setRoleName(rolesFromUser.length > 0 ? rolesFromUser[0] : null);
            } catch {
                // noop
            }
        };
        load();
    }, [dataProvider]);

    React.useEffect(() => {
        const load = async () => {
            try {
                const res = await dataProvider.getList('role', {
                    pagination: { page: 1, perPage: 100 },
                    sort: { field: 'name', order: 'ASC' },
                    filter: {},
                });
                setRoles(res.data.map((r: any) => r.name));
            } catch {
                // noop
            }
        };
        load();
    }, [dataProvider]);
    


    // Extract last login from JWT token
    const getLastLogin = () => {
        const token = localStorage.getItem('token');
        if (!token) return null;
        
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const loginTime = payload.auth_time || payload.iat;
            if (loginTime) {
                return new Date(loginTime * 1000).toLocaleString();
            }
        } catch (error) {
            console.error('Error parsing token for last login:', error);
        }
        return null;
    };

    const lastLogin = getLastLogin();

    // Handle role switching for super admins
    const handleRoleSwitch = (event: SelectChangeEvent<string>) => {
        const selectedRole = event.target.value;
        if (selectedRole === 'reset') {
            setActiveTestRole(null);
            localStorage.removeItem('activeTestRole');
        } else {
            setActiveTestRole(selectedRole);
            localStorage.setItem('activeTestRole', selectedRole);
        }
        // Trigger a page refresh to apply the new role
        window.location.reload();
    };

    const resetToOriginalRole = () => {
        setActiveTestRole(null);
        localStorage.removeItem('activeTestRole');
        window.location.reload();
    };


    return (
        <SolarMenu.List sx={{ mt: 'auto' }}>
            {/* Role Testing Section (Super Admins Only) */}
            {isOriginalSuperAdmin() && (
                <>
                    <Typography
                        variant="body2"
                        component={ListSubheader}
                        sx={{
                            fontWeight: theme.typography.fontWeightMedium,
                            lineHeight: '48px',
                            marginBottom: `-${theme.spacing(1)}`,
                            backgroundColor: 'transparent',
                            color: 'warning.main',
                        }}
                    >
                        Role Testing (Super Admin)
                    </Typography>
                    
                    {activeTestRole && (
                        <ListItem sx={{ py: 1 }}>
                            <Alert 
                                severity="warning" 
                                sx={{ 
                                    width: '100%',
                                    '& .MuiAlert-message': {
                                        fontSize: '0.75rem'
                                    }
                                }}
                                action={
                                    <Button
                                        size="small"
                                        onClick={resetToOriginalRole}
                                        startIcon={<RestoreIcon />}
                                        sx={{ fontSize: '0.7rem' }}
                                    >
                                        Reset
                                    </Button>
                                }
                            >
                                Testing as: <strong>{activeTestRole}</strong>
                            </Alert>
                        </ListItem>
                    )}
                    
                    <ListItem sx={{ py: 1 }}>
                        <Box sx={{ width: '100%' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <SwapHorizIcon sx={{ mr: 1, color: 'warning.main', fontSize: 18 }} />
                                <Typography variant="body2" color="warning.main">
                                    Switch Role:
                                </Typography>
                            </Box>
                            <FormControl size="small" fullWidth>
                                <Select
                                    value={activeTestRole || ''}
                                    onChange={handleRoleSwitch}
                                    displayEmpty
                                    sx={{ fontSize: '0.8rem' }}
                                >
                                    <MenuItem value="">
                                        <em>Use Original Roles</em>
                                    </MenuItem>
                                    <MenuItem value="reset" disabled={!activeTestRole}>
                                        <RestoreIcon sx={{ mr: 1, fontSize: 16 }} />
                                        Reset to Original
                                    </MenuItem>
                                    <Divider />
                                    {roles.map((role) => (
                                        <MenuItem key={role} value={role}>
                                            {role}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                    </ListItem>
                    
                    <Divider sx={{ my: 1 }} />
                </>
            )}

            {/* User Information Section */}
            <Typography
                variant="body2"
                component={ListSubheader}
                sx={{
                    fontWeight: theme.typography.fontWeightMedium,
                    lineHeight: '48px',
                    marginBottom: `-${theme.spacing(1)}`,
                    backgroundColor: 'transparent',
                }}
            >
                User Information
            </Typography>
            
            {/* User Roles from DB (fallback to single role name) */}
            <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start', py: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, width: '100%' }}>
                    <PersonIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 18 }} />
                    <Typography variant="body2" color="text.secondary">
                        Active Roles:
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, width: '100%' }}>
                    {activeTestRole ? (
                        <Chip 
                            label={activeTestRole} 
                            size="small" 
                            color="warning"
                            variant="filled"
                            sx={{ fontSize: '0.75rem' }}
                        />
                    ) : dbRoles.length > 0 ? (
                        dbRoles.map(r => (
                            <Chip key={r} label={r} size="small" color={r === 'Super Admins' ? 'error' : 'primary'} variant="outlined" sx={{ fontSize: '0.75rem' }} />
                        ))
                    ) : roleName ? (
                        <Chip label={roleName} size="small" color={roleName === 'Super Admins' ? 'error' : 'primary'} variant="outlined" sx={{ fontSize: '0.75rem' }} />
                    ) : (
                        <Typography variant="caption" color="text.secondary">
                            No role assigned
                        </Typography>
                    )}
                </Box>
            </ListItem>

            {/* Last Login */}
            {lastLogin && (
                <ListItem sx={{ py: 1 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                        <AccessTimeIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                    </ListItemIcon>
                    <ListItemText 
                        primary={
                            <Typography variant="body2" color="text.secondary">
                                Last Login:
                            </Typography>
                        }
                        secondary={
                            <Typography variant="caption" color="text.primary">
                                {lastLogin}
                            </Typography>
                        }
                    />
                </ListItem>
            )}

            <Divider sx={{ my: 1 }} />

            {/* Profile Navigation */}
            <ListItem 
                component="div"
                sx={{ py: 1, cursor: 'pointer' }}
                onClick={() => navigate(`/user/${userId}`)}
            >
                <ListItemIcon sx={{ minWidth: 32 }}>
                    <PersonIcon sx={{ color: 'primary.main', fontSize: 18 }} />
                </ListItemIcon>
                <ListItemText
                    primary={
                        <Typography variant="body2" color="primary">
                            View Profile
                        </Typography>
                    }
                />
            </ListItem>

            <Divider sx={{ my: 1 }} />

            {/* Settings Section */}
            <Typography
                variant="body2"
                component={ListSubheader}
                sx={{
                    fontWeight: theme.typography.fontWeightMedium,
                    lineHeight: '48px',
                    marginBottom: `-${theme.spacing(1)}`,
                    backgroundColor: 'transparent',
                }}
            >
                {toggleThemeTitle}
            </Typography>
            <SolarMenu.LocalesItem sx={{ pb: 1 }} />
            <ThemeSwapper />
            <SolarMenu.ToggleThemeItem sx={{ pb: 1 }} />
            <SolarMenu.UserProfileItem sx={{ pb: 1 }} />
        </SolarMenu.List>
    );
};
