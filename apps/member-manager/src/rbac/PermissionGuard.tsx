import React from 'react';
import { useUserPermissions } from './usePermissions';
import { ROLES, Resource } from './permissions';
import { IconButton, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

interface PermissionGuardProps {
    children: React.ReactNode;
    resource?: Resource;
    action?: string;
    roles?: string[];
    permission?: string; // Legacy support
    allowReadOnly?: boolean;
    fallback?: React.ReactNode;
}

/**
 * PermissionGuard component that conditionally renders children based on user permissions
 * 
 * Usage examples:
 * 
 * // Check single permission
 * <PermissionGuard permission={PERMISSIONS.CREATE_ORGANIZATION}>
 *   <CreateButton />
 * </PermissionGuard>
 * 
 * // Check multiple permissions (user needs ANY of these)
 * <PermissionGuard permissions={[PERMISSIONS.CREATE_ORGANIZATION, PERMISSIONS.EDIT_ORGANIZATION]}>
 *   <EditButton />
 * </PermissionGuard>
 * 
 * // Check role
 * <PermissionGuard role={ROLES.SUPER_ADMINS}>
 *   <AdminPanel />
 * </PermissionGuard>
 * 
 * // Check multiple roles (user needs ANY of these)
 * <PermissionGuard roles={[ROLES.CONTENT, ROLES.DIGITAL_STRATEGIST]}>
 *   <ContentManagement />
 * </PermissionGuard>
 * 
 * // Require ALL roles
 * <PermissionGuard requireAllRoles={[ROLES.CONTENT, ROLES.SEO]}>
 *   <AdvancedFeature />
 * </PermissionGuard>
 * 
 * // Super admin only
 * <PermissionGuard requireSuperAdmin>
 *   <SystemSettings />
 * </PermissionGuard>
 * 
 * // Allow read-only users
 * <PermissionGuard permission={PERMISSIONS.VIEW_ORGANIZATION} allowReadOnly>
 *   <DataDisplay />
 * </PermissionGuard>
 */
export const PermissionGuard: React.FC<PermissionGuardProps> = ({
    children,
    resource,
    action,
    roles,
    permission,
    allowReadOnly = false,
    fallback = null,
}) => {
    const { hasResourcePermission, hasRole, isReadOnly, hasPermission } = useUserPermissions();

    // Resource-based permission check
    if (resource && action) {
        const hasAccess = hasResourcePermission(resource, action);
        if (!hasAccess) return <>{fallback}</>;
    }

    // Role-based check
    if (roles && roles.length > 0) {
        const hasRequiredRole = roles.some(role => hasRole(role));
        if (!hasRequiredRole) {
            // If allowReadOnly is true and user is read-only, show the content
            if (allowReadOnly && isReadOnly()) {
                return <>{children}</>;
            }
            return <>{fallback}</>;
        }
    }

    // Legacy permission check
    if (permission) {
        const hasAccess = hasPermission(permission);
        if (!hasAccess) return <>{fallback}</>;
    }

    // Hide from read-only users if allowReadOnly is false
    if (!allowReadOnly && isReadOnly()) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
};

// Resource-specific permission guards
interface ResourcePermissionGuardProps {
    children: React.ReactNode;
    resource: Resource;
    action: 'create' | 'edit' | 'delete' | 'view' | 'manage';
    fallback?: React.ReactNode;
}

export const ResourcePermissionGuard: React.FC<ResourcePermissionGuardProps> = ({
    children,
    resource,
    action,
    fallback = null,
}) => {
    return (
        <PermissionGuard resource={resource} action={action} fallback={fallback}>
            {children}
        </PermissionGuard>
    );
};

// Convenience components for common role checks
export const SuperAdminOnly: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({
    children,
    fallback = null,
}) => (
    <PermissionGuard roles={[ROLES.SUPER_ADMINS]} fallback={fallback}>
        {children}
    </PermissionGuard>
);

export const ContentManagerOnly: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({
    children,
    fallback = null,
}) => (
    <PermissionGuard roles={[ROLES.CONTENT]} fallback={fallback}>
        {children}
    </PermissionGuard>
);

export const ServerAdminOnly: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({
    children,
    fallback = null,
}) => (
    <PermissionGuard roles={[ROLES.SERVER_ADMIN]} fallback={fallback}>
        {children}
    </PermissionGuard>
);

export const ReadOnlyHidden: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({
    children,
    fallback = null,
}) => (
    <PermissionGuard allowReadOnly={false} fallback={fallback}>
        {children}
    </PermissionGuard>
);

// Reusable Action Buttons with Permissions
interface PermissionActionButtonsProps {
    resource: Resource;
    record: any;
    onEdit?: (record: any) => void;
    onDelete?: (record: any) => void;
}

export const PermissionActionButtons: React.FC<PermissionActionButtonsProps> = ({
    resource,
    record,
    onEdit,
    onDelete,
}) => {
    const { hasResourcePermission } = useUserPermissions();

    const hasEditPermission = hasResourcePermission(resource, 'edit');
    const hasDeletePermission = hasResourcePermission(resource, 'delete');

    // If no permissions, return null (hide the entire actions column)
    if (!hasEditPermission && !hasDeletePermission) {
        return null;
    }

    return (
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            {hasEditPermission && onEdit && (
                <IconButton
                    size="small"
                    color="info"
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit(record);
                    }}
                >
                    <EditIcon fontSize="small" />
                </IconButton>
            )}
            {hasDeletePermission && onDelete && (
                <IconButton
                    size="small"
                    color="error"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(record);
                    }}
                >
                    <DeleteIcon fontSize="small" />
                </IconButton>
            )}
        </Box>
    );
};

// Reusable Create Button with Permissions
interface PermissionCreateButtonProps {
    resource: Resource;
    onClick: () => void;
    label?: string;
}

export const PermissionCreateButton: React.FC<PermissionCreateButtonProps> = ({
    resource,
    onClick,
    label = 'Create',
}) => {
    const { hasResourcePermission } = useUserPermissions();

    if (!hasResourcePermission(resource, 'create')) {
        return null;
    }

    return (
        <IconButton
            color="primary"
            size="medium"
            onClick={onClick}
            title={label}
        >
            <AddIcon fontSize="small" />
        </IconButton>
    );
};

// Hook to check if actions column should be visible
export const useActionsColumnVisibility = (resource: Resource) => {
    const { hasResourcePermission } = useUserPermissions();
    
    return (
        hasResourcePermission(resource, 'edit') ||
        hasResourcePermission(resource, 'delete')
    );
}; 