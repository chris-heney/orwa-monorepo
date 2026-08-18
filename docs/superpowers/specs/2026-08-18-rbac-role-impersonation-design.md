# RBAC role impersonation (test-as-role)

**Date:** 2026-08-18  
**Status:** Approved for planning  
**Apps:** `apps/member-manager`, `apps/strapi`

## Goal

From RBAC Manager, an **Admin** can temporarily “Test as” another users-permissions role so that:

1. **UI gating** (menu modules via `useModuleAccess`, capability buttons via `useCan`) matches that role.
2. **API authorization** enforces that role’s `up_permissions` (real 403s for missing grants).

Exit restores the real Admin session without changing DB role assignment or JWT identity.

## Non-goals

- Impersonating a specific **user** (identity/email stays the Admin).
- Changing the Admin’s stored role in the database.
- Simulating fully unauthenticated Public traffic (no JWT).
- Allowing non-Admin callers to activate impersonation.

## Security model

| Rule                 | Behavior                                                                                                                                                |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Who may start        | Only users whose **real** role is Admin (`type === 'admin'` or name `Admin`).                                                                           |
| Credential           | Real Admin JWT unchanged.                                                                                                                               |
| Signal               | Request header `X-Impersonate-Role: <numericRoleId>`.                                                                                                   |
| Authorization        | After authenticate, before authorize: swap `ctx.state.user.role` to the target role for permission checks.                                              |
| Exception (option B) | `users-permissions` **role** and **permissions** management actions always authorize as the **real** Admin role so RBAC Manager and Exit remain usable. |
| Persistence          | Frontend preview state in `sessionStorage` (survives refresh; cleared on tab close, Exit, logout).                                                      |
| Non-Admin + header   | `403`.                                                                                                                                                  |
| Unknown role id      | `400`; frontend clears preview.                                                                                                                         |

### Exempt API actions (always real Admin)

- `plugin::users-permissions.role.find`
- `plugin::users-permissions.role.findOne`
- `plugin::users-permissions.role.createRole`
- `plugin::users-permissions.role.updateRole`
- `plugin::users-permissions.role.deleteRole`
- `plugin::users-permissions.permissions.getPermissions`

All other content-API / plugin actions use the impersonated role’s grants.

## Backend (Strapi)

### Hook point

After users-permissions JWT auth sets `ctx.state.user`, before authorize:

1. If `X-Impersonate-Role` is absent → no-op.
2. Resolve the caller’s **real** role (before any swap). If not Admin → `403`.
3. If the matched route action is in the exempt list above → do not swap; continue as Admin.
4. Load target role by numeric id. If missing → `400`.
5. Set `ctx.state.user.role` to the target role (keep real `user.id` / email).
6. Stash real role on `ctx.state.impersonator` for `/users/me` and logging.

Implementation may live as a users-permissions extension (preferred: wrap authenticate → authorize gap) or an equivalent plugin middleware registered so it runs after auth and before permission checks.

### `GET /api/users/me`

When impersonating, the existing `me` override that attaches `role` must attach the **target** role’s:

- `id`, `name`, `description`, `type`, `modules`
- `permissions`: flat array of action UIDs (same shape as today)

Also attach a small flag for the UI banner, e.g.:

```json
"impersonating": { "roleId": 3, "roleName": "Staff" }
```

When not impersonating, behavior unchanged.

### CORS

Allow request header `X-Impersonate-Role` in Strapi CORS config.

## Frontend (member-manager)

### Entry point

On `RbacDashboard` Actions column: icon button (e.g. supervised-user / mask), tooltip **“Test as this role”**.

- Visible/enabled only when the **current real user** is Admin (RBAC screen already Admin-oriented; still gate explicitly).
- Available for any listed target role (Staff, Public, Authenticated, custom, Admin).

Confirm dialog: explain that UI and API will behave as that role; Exit is always available.

### On confirm

1. Write `{ roleId, roleName }` to `sessionStorage`.
2. Invalidate react-query key `['auth', 'moduleAccess']` so `/users/me` refetches with the header.
3. Navigate to `firstAllowedPath(modules)` for the target role’s modules (same rules as login / `ModuleRouteGuard`: Admin → all modules; others use stored modules with `settings` always available).

### HTTP clients

Attach `X-Impersonate-Role` when sessionStorage has an active preview:

- `helpers/ra-strapi-data-provider` `httpClient` (react-admin dataProvider)
- RBAC direct-fetch `modules/rbac-manager/api.ts` `request()`

Clear the header when preview is cleared.

### Exit banner

Sticky banner outside module gating:

- Copy: “Testing as **{roleName}**”
- Action: **Exit preview** → clear sessionStorage → invalidate me query → navigate to `/rbac/dashboard`

### Logout

Clear preview state together with auth cookies.

### Invalid stored role

If `/users/me` or any request returns 400 for a bad impersonation id: clear preview, notify, stop sending the header.

## Data flow

```text
Admin clicks Test as Staff
  → confirm
  → sessionStorage { roleId, roleName }
  → navigate firstAllowedPath(Staff modules)
  → all API calls: Authorization: Bearer <adminJwt>
                   X-Impersonate-Role: <staffRoleId>
  → Strapi: authorize as Staff (except role/permission mgmt)
  → /users/me: role = Staff modules + permissions
  → useModuleAccess / useCan reflect Staff
Exit → clear storage → me as Admin → /rbac/dashboard
```

## Testing (manual)

1. As Admin, Test as Staff → banner, Memberships (or first allowed) home; create/edit UI matches Staff.
2. Staff-forbidden mutation/list → API `403`.
3. Open RBAC / list roles while previewing → still works (exempt actions).
4. Exit → Admin UI/API restored; land on `/rbac/dashboard`.
5. Refresh while previewing → preview persists for the tab.
6. Non-Admin cannot activate (no control + API `403` if header forged).

## Open implementation notes

- Prefer a single helper to read/write/clear sessionStorage preview so httpClient and RBAC api stay in sync.
- Confirm exact Strapi 5 users-permissions hook for “after authenticate / before authorize” during implementation; fall back to wrapping the plugin auth middleware if global middleware runs too early.
