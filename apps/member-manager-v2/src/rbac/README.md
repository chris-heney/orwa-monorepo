# RBAC (Role-Based Access Control) Module

This folder contains all the Role-Based Access Control functionality for the React Admin application, integrating with Authentik groups for permission management.

## Files

### `index.ts`
Central export file providing clean imports for all RBAC functionality. Import from this file for the best developer experience:

```tsx
import { PermissionGuard, PERMISSIONS, ROLES, useUserPermissions } from '../rbac';
```

### `permissions.ts`
Core permission system containing:
- **AuthentikGroup interface**: TypeScript type for Authentik groups
- **ROLES**: Constants for all available roles (must match Authentik group names exactly)
- **PERMISSIONS**: Available permissions in the application
- **ROLE_PERMISSIONS**: Mapping of roles to their allowed permissions
- **Utility functions**: `hasPermission`, `hasRole`, `isSuperAdmin`, etc.

### `usePermissions.ts`
React hook that wraps React Admin's `usePermissions` and provides convenient permission checking functions:
- `hasPermission(permission)`: Check if user has a specific permission
- `hasRole(roles)`: Check if user has any of the specified roles
- `isSuperAdmin()`: Check if user is a super admin
- `isReadOnly()`: Check if user has read-only access

### `PermissionGuard.tsx`
React component for conditional rendering based on permissions:
- **PermissionGuard**: Main component with flexible permission checking
- **SuperAdminOnly**: Convenience component for super admin only content
- **ContentManagerOnly**: Convenience component for content managers
- **ServerAdminOnly**: Convenience component for server admins
- **ReadOnlyHidden**: Convenience component to hide content from read-only users

## Usage

```tsx
// Import what you need
import { 
    PermissionGuard, 
    SuperAdminOnly, 
    useUserPermissions, 
    PERMISSIONS, 
    ROLES 
} from '../rbac';

// Use in components
const MyComponent = () => {
    const { hasPermission, isSuperAdmin } = useUserPermissions();
    
    return (
        <div>
            <PermissionGuard permission={PERMISSIONS.CREATE_ORGANIZATION}>
                <CreateButton />
            </PermissionGuard>
            
            <SuperAdminOnly>
                <AdminPanel />
            </SuperAdminOnly>
        </div>
    );
};
```

## Integration

This module integrates with:
- **Authentik**: For user group management and JWT tokens
- **React Admin**: For permission checking in UI components
- **Auth Provider**: For fetching user groups from JWT tokens

See the main RBAC_GUIDE.md in the project root for complete documentation. 