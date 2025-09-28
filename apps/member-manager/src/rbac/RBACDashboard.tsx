import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import DownloadIcon from '@mui/icons-material/Download';
import InfoIcon from '@mui/icons-material/Info';
// import MenuIcon from '@mui/icons-material/Menu';
import MoreVertIcon from '@mui/icons-material/MoreVert';
// import RefreshIcon from '@mui/icons-material/Refresh';
import RestoreIcon from '@mui/icons-material/Restore';
import SaveIcon from '@mui/icons-material/Save';
import SecurityIcon from '@mui/icons-material/Security';
// import SettingsIcon from '@mui/icons-material/Settings';
import ViewListIcon from '@mui/icons-material/ViewList';
import {
    Alert,
    AppBar,
    Avatar,
    Badge,
    BottomNavigation,
    BottomNavigationAction,
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    OutlinedInput,
    Grid,
    IconButton,
    List,
    ListItemAvatar,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Menu,
    Paper,
    SpeedDial,
    SpeedDialAction,
    SpeedDialIcon,
    Switch,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    TextField,
    Toolbar,
    Tooltip,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { useDataProvider, useNotify } from 'react-admin';
import { Action, Resource } from './permissions';

// Type definitions for better structure
interface ResourcePermission {
    create: boolean;
    edit: boolean;
    delete: boolean;
    view: boolean;
    manage?: boolean;
}

interface RolePermissions {
    [key: string]: Partial<Record<Resource, ResourcePermission>>;
}

const resources: Resource[] = [
    'organization',
    'coreServices',
    'industry',
    'trade',
    'service',
    'serviceContext',
    'domains',
    'content',
    'packageGroups',
    'packages',
    'features',
    'addonGroups',
    'addons',
    'platformGroups' as any,
    'platforms' as any,
];

const actions: Action[] = ['view', 'create', 'edit', 'delete', 'manage'];

const actionColors = {
    view: 'info',
    create: 'success',
    edit: 'warning',
    delete: 'error',
    manage: 'secondary',
} as const;

const actionDescriptions = {
    view: 'Can view and list records',
    create: 'Can create new records',
    edit: 'Can modify existing records',
    delete: 'Can delete records',
    manage: 'Full administrative access',
};

const RBACDashboard: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
    const dataProvider = useDataProvider();
    const [permissions, setPermissions] = useState<RolePermissions>({});
    const [roleNames, setRoleNames] = useState<string[]>([]);
    const [hasChanges, setHasChanges] = useState(false);
    const [saveDialogOpen, setSaveDialogOpen] = useState(false);
    const [generatedCode] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState(0); // 0: Overview, 1: Detailed
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState<string[]>([]);
    const [resourceFilter, setResourceFilter] = useState('');
    const [showOnlyGranted, setShowOnlyGranted] = useState(false);
    
    const notify = useNotify();
    const [allPermissions, setAllPermissions] = useState<Array<{ id: number; resource: string; action: string }>>([]);

    // Load roles and permissions from backend via dataProvider
    useEffect(() => {
        const load = async () => {
            try {
                // Load all permissions for mapping during save
                const permsRes = await dataProvider.getList('permission', {
                    pagination: { page: 1, perPage: 1000 },
                    sort: { field: 'resource', order: 'ASC' },
                    filter: {},
                    meta: { raw: true },
                } as any);
                setAllPermissions(permsRes.data as any);

                // Load roles with their permissions
                const rolesRes = await dataProvider.getList('role', {
                    pagination: { page: 1, perPage: 100 },
                    sort: { field: 'name', order: 'ASC' },
                    filter: {},
                    meta: { populate: 'permissions.permission', raw: true },
                } as any);
                const roles: any[] = (rolesRes.data as any[]) || [];

                const names = roles.map(r => r.name);
                setRoleNames(names);

                const next: RolePermissions = {};
                roles.forEach(r => {
                    const map: Partial<Record<Resource, any>> = {} as any;
                    (r.permissions || []).forEach((rp: any) => {
                        const p = rp.permission;
                        if (!p) return;
                        const resName = p.resource as Resource;
                        map[resName] = map[resName] || { create: false, edit: false, delete: false, view: false, manage: false };
                        (map[resName] as any)[p.action] = true;
                    });
                    next[r.name] = map as any;
                });
                setPermissions(next);
                setHasChanges(false);
            } catch (e) {
                console.error('Failed to load RBAC via dataProvider', e);
            }
        };
        load();
    }, [dataProvider]);

    // Handle permission toggle
    const handlePermissionChange = (
        roleName: string,
        resource: Resource,
        action: Action,
        value: boolean
    ) => {
        setPermissions(prev => {
            const newPermissions = { ...prev };
            if (!newPermissions[roleName]) {
                newPermissions[roleName] = {};
            }
            if (!newPermissions[roleName][resource]) {
                newPermissions[roleName][resource] = {
                    view: false,
                    create: false,
                    edit: false,
                    delete: false,
                    manage: false,
                };
            }

            newPermissions[roleName][resource]![action] = value;
            return newPermissions;
        });
        setHasChanges(true);
    };

    // Toggle all actions for a resource within a role
    const setAllActionsForResource = (
        roleName: string,
        resource: Resource,
        value: boolean
    ) => {
        setPermissions(prev => {
            const next = { ...prev } as typeof prev;
            if (!next[roleName]) next[roleName] = {} as any;
            if (!next[roleName][resource]) {
                next[roleName][resource] = {
                    view: false,
                    create: false,
                    edit: false,
                    delete: false,
                    manage: false,
                } as any;
            }
            (['view', 'create', 'edit', 'delete', 'manage'] as Action[]).forEach(a => {
                next[roleName][resource]![a] = value;
            });
            return next;
        });
        setHasChanges(true);
    };

    const areAllActionsOnForResource = (
        roleName: string,
        resource: Resource
    ): boolean => {
        const perms = permissions[roleName]?.[resource];
        if (!perms) return false;
        return (['view', 'create', 'edit', 'delete', 'manage'] as Action[]).every(a => Boolean((perms as any)[a]));
    };

    // Build payload for backend from current UI state
    const buildBackendPayload = useMemo(() => {
        return () => {
            const roleToPerms: Record<string, { resource: string; action: string }[]> = {};
            Object.entries(permissions).forEach(([roleName, rolePerms]) => {
                const pairs: { resource: string; action: string }[] = [];
                Object.entries(rolePerms || {}).forEach(([resource, resourcePerms]) => {
                    Object.entries(resourcePerms || {}).forEach(([action, enabled]) => {
                        if (enabled) pairs.push({ resource, action });
                    });
                });
                roleToPerms[roleName] = pairs;
            });
            return roleToPerms;
        };
    }, [permissions]);

    // Handle save permissions (persist to backend via standard API)
    const handleSave = async () => {
        setIsSaving(true);
        try {
            const payload = buildBackendPayload();

            // Build quick lookup for permissions
            const permIdByKey = new Map<string, number>();
            allPermissions.forEach(p => permIdByKey.set(`${p.resource}:${p.action}`, p.id));

            for (const roleName of Object.keys(payload)) {
                // Resolve role id by name
                const roleRes = await dataProvider.getList('role', {
                    pagination: { page: 1, perPage: 1 },
                    sort: { field: 'id', order: 'ASC' },
                    filter: { name: { $eq: roleName } },
                    meta: { raw: true },
                } as any);
                const role = (roleRes.data as any[])?.[0];
                if (!role) continue;

                // Fetch existing rolePermission rows to reset
                const existingRes = await dataProvider.getList('rolePermission', {
                    pagination: { page: 1, perPage: 1000 },
                    sort: { field: 'id', order: 'ASC' },
                    filter: { roleId: { $eq: role.id } },
                    meta: { raw: true },
                } as any);
                const existing = (existingRes.data as any[]) || [];

                // Delete existing one by one (generic API-safe)
                for (const rp of existing) {
                    try {
                        await dataProvider.delete('rolePermission', { id: rp.id });
                    } catch {
                        // ignore deletion failure for non-existent
                    }
                }

                // Create new mappings
                for (const p of payload[roleName]) {
                    const pid = permIdByKey.get(`${p.resource}:${p.action}`);
                    if (!pid) {
                        // If permission does not exist yet, create it
                        const created = await dataProvider.create('permission', {
                            data: { resource: p.resource, action: p.action },
                        } as any);
                        const newId = (created as any).data?.id;
                        if (newId) permIdByKey.set(`${p.resource}:${p.action}`, newId);
                    }
                    const permissionId = permIdByKey.get(`${p.resource}:${p.action}`);
                    if (!permissionId) continue;
                    await dataProvider.create('rolePermission', {
                        data: { roleId: role.id, permissionId },
                    } as any);
                }
            }
            notify('Permissions saved to server', { type: 'success' });
            setHasChanges(false);
        } catch (error) {
            console.error('Error saving RBAC', error);
            notify('Error saving RBAC to server', { type: 'error' });
        } finally {
            setIsSaving(false);
        }
    };

    // Reset to server state
    const handleReset = async () => {
        try {
            const rolesRes = await dataProvider.getList('role', {
                pagination: { page: 1, perPage: 100 },
                sort: { field: 'name', order: 'ASC' },
                filter: {},
                meta: { populate: 'permissions.permission', raw: true },
            } as any);
            const roles: any[] = (rolesRes.data as any[]) || [];
            const next: RolePermissions = {};
            roles.forEach(r => {
                const map: Partial<Record<Resource, any>> = {} as any;
                (r.permissions || []).forEach((rp: any) => {
                    const p = rp.permission;
                    if (!p) return;
                    const resName = p.resource as Resource;
                    map[resName] = map[resName] || { create: false, edit: false, delete: false, view: false, manage: false };
                    (map[resName] as any)[p.action] = true;
                });
                next[r.name] = map as any;
            });
            setPermissions(next);
            setHasChanges(false);
            notify('Permissions reloaded from server', { type: 'info' });
        } catch (e) {
            console.error(e);
        }
    };

    // Get permission value safely
    const getPermissionValue = (
        roleName: string,
        resource: Resource,
        action: Action
    ): boolean => {
        return permissions[roleName]?.[resource]?.[action] ?? false;
    };


    // Handle menu open/close
    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
        setMenuOpen(true);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setMenuOpen(false);
    };
    
    // Handle tab change
    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };
    
    // Filter resources by search query
    const filteredResources = resources
        .filter(resource => 
            searchQuery ? resource.toLowerCase().includes(searchQuery.toLowerCase()) : true
        );
   
    // Mobile Resource Permissions Component
    const ResourcePermissions = ({ 
        resource, 
        roleName = selectedRole 
    }: { 
        resource: Resource, 
        roleName?: string | null 
    }) => {
        if (!roleName) return null;
        
        return (
            <Card sx={{ mb: 2 }}>
                <CardHeader
                    title={resource}
                    titleTypographyProps={{ variant: 'subtitle1' }}
                    sx={{ pb: 1 }}
                />
                <CardContent sx={{ pt: 0 }}>
                    <Grid container spacing={1}>
                        {actions.map(action => (
                            <Grid item xs={6} key={action}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={getPermissionValue(roleName, resource, action)}
                                            onChange={e => handlePermissionChange(
                                                roleName,
                                                resource,
                                                action,
                                                e.target.checked
                                            )}
                                            size="small"
                                            color={actionColors[action]}
                                            disabled={isSaving}
                                        />
                                    }
                                    label={
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Chip
                                                label={action}
                                                size="small"
                                                color={actionColors[action as Action]}
                                                variant={getPermissionValue(roleName, resource, action) ? "filled" : "outlined"}
                                                sx={{ fontSize: '0.7rem', height: 24 }}
                                            />
                                        </Box>
                                    }
                                    sx={{ m: 0 }}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </CardContent>
            </Card>
        );
    };
    
    // Action buttons for mobile view
    const MobileActionButtons = () => (
        <Box
            sx={{
                position: 'fixed',
                bottom: 70,
                right: 16,
                zIndex: 1100
            }}
        >
            <SpeedDial
                ariaLabel="RBAC Actions"
                icon={<SpeedDialIcon />}
                direction="up"
            >
                <SpeedDialAction
                    icon={<SaveIcon />}
                    tooltipTitle="Save Changes"
                    onClick={hasChanges && !isSaving ? handleSave : undefined}
                    sx={{ 
                        opacity: hasChanges && !isSaving ? 1 : 0.5,
                        pointerEvents: hasChanges && !isSaving ? 'auto' : 'none'
                    }}
                />
                <SpeedDialAction
                    icon={<RestoreIcon />}
                    tooltipTitle="Reset Changes"
                    onClick={hasChanges && !isSaving ? handleReset : undefined}
                    sx={{ 
                        opacity: hasChanges && !isSaving ? 1 : 0.5,
                        pointerEvents: hasChanges && !isSaving ? 'auto' : 'none'
                    }}
                />
            </SpeedDial>
        </Box>
    );
    
    // Desktop header with actions
    const DesktopHeader = () => (
        <Box
            sx={{
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <SecurityIcon color="primary" sx={{ fontSize: 32 }} />
                <Typography variant="h4" component="h1">
                    RBAC Management
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                    variant="outlined"
                    startIcon={<RestoreIcon />}
                    onClick={handleReset}
                    disabled={!hasChanges || isSaving}
                >
                    Reset
                </Button>
                <Button
                    variant="contained"
                    startIcon={
                        isSaving ? (
                            <CircularProgress size={16} />
                        ) : (
                            <AutoFixHighIcon />
                        )
                    }
                    onClick={handleSave}
                    disabled={!hasChanges || isSaving}
                    color="primary"
                >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
            </Box>
        </Box>
    );
    
    // Mobile header with tabs
    const MobileHeader = () => (
        <>
            <AppBar position="static" color="default" elevation={0}>
                <Toolbar>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <SecurityIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            RBAC Management
                        </Typography>
                    </Box>
                    <IconButton 
                        edge="end" 
                        color="inherit" 
                        aria-label="menu"
                        onClick={handleMenuOpen}
                    >
                        <Badge 
                            color="error" 
                            variant="dot" 
                            invisible={!hasChanges}
                        >
                            <MoreVertIcon />
                        </Badge>
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={menuOpen}
                        onClose={handleMenuClose}
                    >
                        <MenuItem 
                            onClick={() => {
                                handleReset();
                                handleMenuClose();
                            }}
                            disabled={!hasChanges || isSaving}
                        >
                            <ListItemIcon>
                                <RestoreIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Reset Changes</ListItemText>
                        </MenuItem>
                        <MenuItem 
                            onClick={() => {
                                handleSave();
                                handleMenuClose();
                            }}
                            disabled={!hasChanges || isSaving}
                        >
                            <ListItemIcon>
                                <SaveIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Save Changes</ListItemText>
                        </MenuItem>
                    </Menu>
                </Toolbar>
                <Tabs 
                    value={activeTab} 
                    onChange={handleTabChange}
                    variant="fullWidth"
                    indicatorColor="primary"
                    textColor="primary"
                    aria-label="RBAC tabs"
                >
                    <Tab 
                        label="Overview" 
                        icon={<SecurityIcon />} 
                        iconPosition="start" 
                    />
                    <Tab 
                        label="Detailed" 
                        icon={<ViewListIcon />} 
                        iconPosition="start" 
                    />
                </Tabs>
            </AppBar>
            <Box sx={{ mt: 2, px: 2 }}>
                {hasChanges && (
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        You have unsaved changes.
                    </Alert>
                )}
            </Box>
        </>
    );
    
    // Bottom navigation for mobile
    const MobileBottomNav = () => (
        <Paper 
            sx={{ 
                position: 'fixed', 
                bottom: 0, 
                left: 0, 
                right: 0,
                zIndex: 1000
            }} 
            elevation={3}
        >
            <BottomNavigation
                showLabels
                value={activeTab}
                onChange={(_, newValue) => setActiveTab(newValue)}
            >
                <BottomNavigationAction 
                    label="Overview" 
                    icon={
                        <Badge 
                            color="primary" 
                            variant="dot" 
                            invisible={!hasChanges}
                        >
                            <SecurityIcon />
                        </Badge>
                    } 
                />
                <BottomNavigationAction 
                    label="Detailed" 
                    icon={<ViewListIcon />} 
                />
            </BottomNavigation>
        </Paper>
    );
        
    return (
        <Box>
            
            <Box >
            {isMobile ? <MobileHeader /> : <DesktopHeader />}

                {!isMobile && hasChanges && (
                    <Alert severity="warning" sx={{ mb: 3 }}>
                        You have unsaved changes. Click "Save Changes" to
                        persist them to the server.
                    </Alert>
                )}

              
                {/* Detailed Permissions Matrix - Desktop and Mobile Tab 1 */}
                {(!isMobile || (isMobile && activeTab === 1)) && (
                    <Card>
                        <CardContent sx={{ p: isMobile ? 1 : 2 }}>
                            {!isMobile && (
                                <>
                                    <Typography variant="h6" gutterBottom>
                                        Per Role Permissions
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                                        <FormControl sx={{ minWidth: 280 }} size="small">
                                            <InputLabel id="rbac-role-filter-label">Filter roles</InputLabel>
                                            <Select
                                                labelId="rbac-role-filter-label"
                                                multiple
                                                value={roleFilter}
                                                onChange={(e) => setRoleFilter(typeof e.target.value === 'string' ? e.target.value.split(',') : (e.target.value as string[]))}
                                                input={<OutlinedInput label="Filter roles" />}
                                                renderValue={(selected) => (
                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                        {(selected as string[]).map((value) => (
                                                            <Chip key={value} label={value} size="small" />
                                                        ))}
                                                    </Box>
                                                )}
                                            >
                                                {roleNames.map((name) => (
                                                    <MenuItem key={name} value={name}>{name}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <TextField
                                            label="Filter resources"
                                            size="small"
                                            value={resourceFilter}
                                            onChange={(e) => setResourceFilter(e.target.value)}
                                            sx={{ width: 260 }}
                                        />
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={showOnlyGranted}
                                                    onChange={(e) => setShowOnlyGranted(e.target.checked)}
                                                    size="small"
                                                />
                                            }
                                            label="Show granted only"
                                        />
                                    </Box>
                                </>
                            )}
                            
                            {/* Mobile role selector */}
                            {isMobile && (
                                <>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="subtitle1" gutterBottom>
                                            Select a Role
                                        </Typography>
                                        <List 
                                            component="nav" 
                                            sx={{ 
                                                bgcolor: 'background.paper',
                                                borderRadius: 1,
                                                border: '1px solid',
                                                borderColor: 'divider'
                                            }}
                                        >
                                            {roleNames.map(roleName => {
                                                const isSelected = selectedRole === roleName;
                                                
                                                return (
                                                    <ListItemButton
                                                        key={roleName}
                                                        selected={isSelected}
                                                        onClick={() => setSelectedRole(roleName)}
                                                    >
                                                        <ListItemAvatar>
                                                            <Avatar 
                                                                sx={{ 
                                                                    bgcolor: isSelected ? 'primary.main' : 'grey.400',
                                                                    width: 32,
                                                                    height: 32,
                                                                }}
                                                            >
                                                                {roleName.charAt(0)}
                                                            </Avatar>
                                                        </ListItemAvatar>
                                                        <ListItemText 
                                                            primary={roleName} 
                                                            primaryTypographyProps={{ 
                                                                variant: 'body2',
                                                                fontWeight: isSelected ? 'bold' : 'normal'
                                                            }}
                                                        />
                                                    </ListItemButton>
                                                );
                                            })}
                                        </List>
                                    </Box>
                                    
                                    {selectedRole && (
                                        <Box sx={{ mb: 2 }}>
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                                placeholder="Search resources..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                sx={{ mb: 2 }}
                                            />
                                            
                                            {filteredResources.map((resource) => (
                                                <ResourcePermissions 
                                                    key={resource} 
                                                    resource={resource} 
                                                />
                                            ))}
                                        </Box>
                                    )}
                                </>
                            )}
                            
                            {/* Desktop permissions table */}
                            {!isMobile && (
                                <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
                                    <Table stickyHeader size={isSmall ? "small" : "medium"}>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell
                                                    sx={{
                                                        fontWeight: 'bold',
                                                        minWidth: 120,
                                                    }}
                                                >
                                                    Role
                                                </TableCell>
                                                <TableCell
                                                    sx={{
                                                        fontWeight: 'bold',
                                                        minWidth: 100,
                                                    }}
                                                >
                                                    Resource
                                                </TableCell>
                                                {actions.map(action => (
                                                    <TableCell
                                                        key={action}
                                                        align="center"
                                                        sx={{
                                                            fontWeight: 'bold',
                                                            minWidth: 80,
                                                        }}
                                                    >
                                                        <Tooltip
                                                            title={actionDescriptions[action]}
                                                        >
                                                            <Box
                                                                sx={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    gap: 0.5,
                                                                }}
                                                            >
                                                                {action.toUpperCase()}
                                                                <InfoIcon
                                                                    sx={{
                                                                        fontSize: 14,
                                                                        opacity: 0.6,
                                                                    }}
                                                                />
                                                            </Box>
                                                        </Tooltip>
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {roleNames
                                                .filter(name => roleFilter.length === 0 || roleFilter.includes(name))
                                                .map(roleName => {
                                                const resourcesForRole = resources
                                                    .filter(r => !resourceFilter || r.toLowerCase().includes(resourceFilter.toLowerCase()))
                                                    .filter(r => !showOnlyGranted || Object.values(permissions[roleName]?.[r] || {}).some(Boolean));
                                                return resourcesForRole.map(
                                                    (resource, resourceIndex) => (
                                                        <TableRow
                                                            key={`${roleName}-${resource}`}
                                                            hover
                                                            sx={{
                                                                '&:nth-of-type(odd)': {
                                                                    bgcolor: 'action.hover',
                                                                },
                                                            }}
                                                        >
                                                            {resourceIndex === 0 && (
                                                                <TableCell
                                                                    rowSpan={resourcesForRole.length}
                                                                    sx={{
                                                                        borderRight: 1,
                                                                        borderColor: 'divider',
                                                                        backgroundColor: 'grey.50',
                                                                        fontWeight: 'bold',
                                                                    }}
                                                                >
                                                                    {roleName}
                                                                </TableCell>
                                                            )}
                                                            <TableCell sx={{ fontWeight: 'medium' }}>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                                    <span>{resource}</span>
                                                                    <Button
                                                                        size="small"
                                                                        variant={areAllActionsOnForResource(roleName, resource) ? 'contained' : 'outlined'}
                                                                        color={areAllActionsOnForResource(roleName, resource) ? 'primary' : 'inherit'}
                                                                        onClick={() =>
                                                                            setAllActionsForResource(
                                                                                roleName,
                                                                                resource,
                                                                                !areAllActionsOnForResource(roleName, resource)
                                                                            )
                                                                        }
                                                                        sx={{ ml: 1 }}
                                                                    >
                                                                        {areAllActionsOnForResource(roleName, resource) ? 'All On' : 'All'}
                                                                    </Button>
                                                                </Box>
                                                            </TableCell>
                                                            {actions.map(action => (
                                                                <TableCell
                                                                    key={action}
                                                                    align="center"
                                                                    padding="none"
                                                                >
                                                                    <FormControlLabel
                                                                        control={
                                                                            <Switch
                                                                                checked={getPermissionValue(
                                                                                    roleName,
                                                                                    resource,
                                                                                    action
                                                                                )}
                                                                                onChange={e =>
                                                                                    handlePermissionChange(
                                                                                        roleName,
                                                                                        resource,
                                                                                        action,
                                                                                        e.target.checked
                                                                                    )
                                                                                }
                                                                                size="small"
                                                                                color={actionColors[action]}
                                                                                disabled={isSaving}
                                                                            />
                                                                        }
                                                                        label=""
                                                                        sx={{ m: 0 }}
                                                                    />
                                                                </TableCell>
                                                            ))}
                                                        </TableRow>
                                                    )
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </CardContent>
                    </Card>
                )}
            </Box>
            
            {/* Mobile Action Buttons and Bottom Navigation */}
            {isMobile && (
                <>
                    <MobileActionButtons />
                    <MobileBottomNav />
                </>
            )}

            {/* Fallback Manual Save Dialog */}
            <Dialog
                open={saveDialogOpen}
                onClose={() => setSaveDialogOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Manual Save Required</DialogTitle>
                <DialogContent>
                    <Alert severity="info" sx={{ mb: 2 }}>
                        Automatic file saving isn't available. You can either
                        copy the code or download the file.
                    </Alert>
                    <TextField
                        multiline
                        rows={isMobile ? 10 : 20}
                        value={generatedCode}
                        fullWidth
                        variant="outlined"
                        InputProps={{
                            readOnly: true,
                            sx: { fontFamily: 'monospace', fontSize: '0.8rem' },
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSaveDialogOpen(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {}}
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                    >
                        Download File
                    </Button>
                    <Button
                        onClick={() => {}}
                        variant="contained"
                        startIcon={<SaveIcon />}
                    >
                        Copy Code
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default RBACDashboard;
