import { usePermissions as useRAPermissions } from 'react-admin';
import { hasResourcePermission, getResourcePermissions, hasRole, isSuperAdmin, isReadOnly, ROLES, Resource } from './permissions';

export const useUserPermissions = () => {
    const { permissions: userGroups = [], isLoading } = useRAPermissions<any[]>();

    // Check for active test role (Super Admin feature)
    const activeTestRole = localStorage.getItem('activeTestRole');
    const isOriginalSuperAdmin = isSuperAdmin(userGroups);
    
    // Create test groups if we're in test mode
    const effectiveGroups = activeTestRole && isOriginalSuperAdmin 
        ? [{ pk: 'test', name: activeTestRole, is_superuser: false, parent: null, users: [] }] as any[]
        : userGroups;

    return {
        userGroups: effectiveGroups,
        originalUserGroups: userGroups, // Keep reference to original groups
        isLoading,
        isTestingRole: Boolean(activeTestRole && isOriginalSuperAdmin),
        activeTestRole: activeTestRole,
        
        // Resource-based permission checks (uses effective groups)
        hasResourcePermission: (resource: Resource, action: string) => 
            hasResourcePermission(effectiveGroups, resource, action),
            
        getResourcePermissions: (resource: Resource) => 
            getResourcePermissions(effectiveGroups, resource),

        // Role checks (uses effective groups)
        hasRole: (roleName: string) => hasRole(effectiveGroups, roleName),
        isSuperAdmin: () => isSuperAdmin(effectiveGroups),
        isReadOnly: () => isReadOnly(effectiveGroups),
        
        // Original role checks (always uses original groups)
        isOriginalSuperAdmin: () => {
            try {
                const t = localStorage.getItem('id_token') || localStorage.getItem('token');
                if (!t) return isOriginalSuperAdmin;
                const payload = JSON.parse(atob(t.split('.')[1]));
                const groups: string[] = Array.isArray(payload.groups) ? payload.groups : [];
                return groups.includes(ROLES.SUPER_ADMINS) || isOriginalSuperAdmin;
            } catch { return isOriginalSuperAdmin; }
        },
        
        // Convenience role checks (uses effective groups)
        isContentManager: () => hasRole(effectiveGroups, ROLES.CONTENT),
        isDigitalStrategist: () => hasRole(effectiveGroups, ROLES.DIGITAL_STRATEGIST),
        isServerAdmin: () => hasRole(effectiveGroups, ROLES.SERVER_ADMIN),
        isWebProduction: () => hasRole(effectiveGroups, ROLES.WEB_PRODUCTION),
        isHelpdesk: () => hasRole(effectiveGroups, ROLES.HELPDESK),
        isSEO: () => hasRole(effectiveGroups, ROLES.SEO),
        isQA: () => hasRole(effectiveGroups, ROLES.QA),
        
        // Legacy permission checks (deprecated - use resource-based instead)
        hasPermission: (permission: string) => {
            // Map legacy permissions to resource-based
            const permissionMap: Record<string, { resource: Resource, action: string }> = {
                'view:organization': { resource: 'organization', action: 'view' },
                'create:organization': { resource: 'organization', action: 'create' },
                'edit:organization': { resource: 'organization', action: 'edit' },
                'delete:organization': { resource: 'organization', action: 'delete' },
                'manage:content': { resource: 'content', action: 'manage' },
                'manage:core-services': { resource: 'coreServices', action: 'manage' },
                'manage:domains': { resource: 'domains', action: 'manage' },
            };
            
            const mapping = permissionMap[permission];
            if (mapping) {
                return hasResourcePermission(effectiveGroups, mapping.resource, mapping.action);
            }
            
            return false;
        },
    };
}; 