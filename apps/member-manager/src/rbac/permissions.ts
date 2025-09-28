// DB-backed RBAC utilities

// Resource types for type safety
export type Resource =
    | 'organization'
    | 'coreServices'
    | 'industry'
    | 'trade'
    | 'service'
    | 'serviceContext'
    | 'domains'
    | 'content'
    | 'packageGroups'
    | 'packages'
    | 'features'
    | 'addonGroups'
    | 'addons'
    | 'techStackGroups'
    | 'techStacks';

export type Action = 'create' | 'edit' | 'delete' | 'view' | 'manage';

export interface DBPermission {
    resource: string;
    action: string;
}

// Role-based permissions mapping organized by resources
// Note: Roles remain defined in the backend now. Kept here only for references in some UIs.
export const ROLES = {
    SUPER_ADMINS: 'Super Admins',
    CONTENT: 'Content',
    DIGITAL_STRATEGIST: 'Digital Strategist',
    HELPDESK: 'Helpdesk',
    SEO: 'SEO',
    SERVER_ADMIN: 'Server Admin',
    WEB_PRODUCTION: 'Web Production',
    QA: 'QA',
    PUBLIC: 'Public',
    NEARBY_NOW: 'Nearby Now',
    SERVICE_AI_CHAT: 'Service: AI Chat',
    SUPER_TEAM: 'Super Team',
    AUTHENTIC_READ_ONLY: 'authentic Read-only',
} as const;

// Utility functions for checking permissions
export const hasResourcePermission = (
    userPermissions: DBPermission[],
    resource: Resource,
    action: string
): boolean => {
    if (!userPermissions || userPermissions.length === 0) return false;
    return userPermissions.some(
        p => p.resource === resource && p.action === action
    );
};

export const getResourcePermissions = (
    userPermissions: DBPermission[],
    resource: Resource
) => {
    const base = { create: false, edit: false, delete: false, view: false, manage: false };
    if (!userPermissions || userPermissions.length === 0) return base;
    const set = new Set(
        userPermissions.filter(p => p.resource === resource).map(p => p.action)
    );
    return {
        create: set.has('create'),
        edit: set.has('edit'),
        delete: set.has('delete'),
        view: set.has('view'),
        manage: set.has('manage'),
    };
};

// Role helpers no longer operate on client; keep conservative fallbacks
export const hasRole = (_: any[], __: string): boolean => false;
export const isSuperAdmin = (_: any[]): boolean => false;
export const isReadOnly = (userPermissions: DBPermission[]): boolean => {
    if (!userPermissions || userPermissions.length === 0) return true;
    // Read-only if every permission is view-only
    return userPermissions.every(p => p.action === 'view');
};
