# RBAC Manager — Phased Implementation Plan

Goal: a new **RBAC Manager** module in `apps/member-manager` that lets an Admin create
roles, choose which frontend **modules** each role can see, and grant per-endpoint
**CRUD permissions** — all persisted in the Strapi (5.50) users-permissions tables,
which are already the server-side enforcement layer.

Each phase is self-contained and executable in a fresh context. Execute in order;
Phases 1–2 (backend) must land before Phase 4+ (frontend) is testable end-to-end.

---

## Phase 0 — Consolidated Documentation Findings (READ FIRST, every phase)

All facts below were verified by reading the installed plugin source at
`apps/strapi/node_modules/@strapi/plugin-users-permissions/` and the app code. Line
numbers are from that install — re-verify if the Strapi version changes.

### Allowed APIs (these exist; use exactly these)

**Content-API role endpoints** (`server/routes/content-api/role.js:9-57`, prefix
resolution `@strapi/core/dist/services/server/register-routes.js:78` +
`content-api.js:7`):

```
GET    /api/users-permissions/roles          → { roles: [{id,name,description,type,nb_users}] }
GET    /api/users-permissions/roles/:id      → { role: {...role, permissions: <full action matrix>} }
POST   /api/users-permissions/roles          → { ok: true }
PUT    /api/users-permissions/roles/:role    → { ok: true }
DELETE /api/users-permissions/roles/:role    → { ok: true }
GET    /api/users-permissions/permissions    → { permissions: <full action matrix, all enabled:false> }
```

**Permissions payload shape** (service `services/role.js:17-25` — nested 3-level
object; action UID persisted = `${typeName}.${controllerName}.${actionName}`):

```jsonc
{
  "name": "Field Staff",
  "description": "…",
  "permissions": {
    "api::watersystem": {
      "controllers": {
        "watersystem": {
          "find": { "enabled": true },
          "findOne": { "enabled": true },
          "create": { "enabled": false },
          "update": { "enabled": false },
          "delete": { "enabled": false }
        }
      }
    }
  }
}
```

**Auth scopes gating those endpoints** (auto-generated per handler,
`register-routes.js:10-23`; checked by `strategies/users-permissions.js:103-112`).
An ORWA Admin role needs exactly these action rows in `up_permissions`:

```
plugin::users-permissions.role.find
plugin::users-permissions.role.findOne
plugin::users-permissions.role.createRole
plugin::users-permissions.role.updateRole
plugin::users-permissions.role.deleteRole
plugin::users-permissions.permissions.getPermissions
```

**Schema extension mechanism** (`@strapi/core/dist/loaders/plugins/index.js:52-84`):
`src/extensions/users-permissions/content-types/<ct>/schema.json` is merged with a
**shallow top-level spread** — the extension's `attributes` object **wholly replaces**
the plugin's. The existing user extension
(`apps/strapi/src/extensions/users-permissions/content-types/user/schema.json`) is a
full copy for exactly this reason. Behavior overrides go in
`src/extensions/users-permissions/strapi-server.ts` (loader hook
`loaders/plugins/index.js:87-93`); none exists yet.

**Frontend data access** (`apps/member-manager/src/helpers/ra-strapi-data-provider/src/DataProviderFactory.ts`):

- `getList("users-permissions/roles", {meta:{raw:true}})` works (special case at
  `:734` reads `json.roles`) — already used by `src/context/RolesContextProvider.tsx:27`.
- `getOne` / `create` / `update` against that resource are **broken by construction**
  (`getOne` parses `json.data` which is undefined → TypeError; `create`/`update` wrap
  the body in `{ data: … }` which Strapi's role controller does not expect, and parse
  `json.data` from a `{ ok: true }` response). Use direct `fetch` with the bearer
  token — the established pattern in
  `src/modules/human-resources/users/CreateUserModal.tsx:80-96` and
  `EditUserModal.tsx:72-82`.
- Bearer token comes from `CookieStore.getCookie('token')`
  (`src/helpers/ra-strapi-data-provider/src/httpClient.ts:6-20`); API base is
  `${VITE_API_ENDPOINT}/api` (`src/App.tsx:102-105`).

### Anti-patterns / landmines (verified in source — every phase must respect these)

1. **`updateRole` drops custom fields.** `services/role.js:96` does
   `_.pick(data, ['name', 'description'])` — a `modules` field sent to PUT is
   **discarded** (even `type` is ignored). `createRole` uses
   `_.omit(params, ['users','permissions'])` (`:13-15`) so extra fields DO pass
   through on POST. → Phase 1 overrides the service; do not assume PUT works for
   `modules` without it.
2. **PUT replaces the whole permission set.** `services/role.js:119-144` deletes every
   existing permission not present-and-enabled in the submitted matrix. If
   `permissions` is `undefined`, `newActions` is `[]` and **all** permissions are
   deleted. → The UI must always GET `/roles/:id` (full matrix), mutate, and PUT the
   **complete** matrix. Never send a partial diff.
3. **Bootstrap wipes Staff grants.** `apps/strapi/src/index.ts:101-105` deletes any
   Staff-role permission outside a hard-coded 10-action whitelist **on every boot**.
   Until Phase 2 lands, anything the RBAC UI grants to Staff reverts on restart.
4. **Extension schema must be a complete attribute copy**: `name` (string, minLength 3,
   required, configurable:false), `description` (string), `type` (string, unique),
   `permissions` (oneToMany → `plugin::users-permissions.permission`, mappedBy `role`),
   `users` (oneToMany → `plugin::users-permissions.user`, mappedBy `role`) — plugin
   source `server/content-types/role/index.js:3-50`. Omitting one deletes it from the
   model.
5. **Extensions load from compiled `dist/`** (`loaders/plugins/index.js:53`) — schema
   or strapi-server changes need a rebuild/restart of Strapi, not a hot reload.
6. **`type` is unique and auto-derived** from name via
   `_.snakeCase(_.deburr(_.toLower(name)))` (`services/role.js:10`). Two role names
   that snake-case identically throw a DB unique-constraint error → surface it in the
   UI, don't retry.
7. **`deleteRole` reassigns all its users to the `public` role** and hard-deletes its
   permissions (`services/role.js:147-178`; controller blocks deleting `public` at
   `controllers/role.js:82-84`). UI must warn with the user count (`nb_users`).
8. **The `role` cookie is client-writable** — all frontend gating is cosmetic UX. The
   `up_permissions` table (which this feature edits) is the real enforcement layer.
   Never grant `plugin::users-permissions.role.*` actions to any role except Admin.
9. **Zod body schemas on these routes are docs-only, not runtime validation**
   (`compose-endpoint.js:64-72` composes no validation middleware). Don't rely on the
   server to reject malformed payloads; validate in the UI.
10. **`syncPermissions()` prunes rows for renamed/removed controller actions** on boot
    (`services/users-permissions.js:183-191`) — renaming a custom controller action
    silently drops its grants. Nothing to code; know it when debugging.

---

## Phase 1 — Strapi: role schema extension + `updateRole` override

### What to implement

**1a. `apps/strapi/src/extensions/users-permissions/content-types/role/schema.json`** —
COPY the plugin's role schema from
`node_modules/@strapi/plugin-users-permissions/server/content-types/role/index.js:3-50`
into JSON (follow the existing user extension file as the formatting template:
`apps/strapi/src/extensions/users-permissions/content-types/user/schema.json`).
Include `collectionName: "up_roles"`, the `info` block, `pluginOptions`, and ALL five
stock attributes (anti-pattern 4), then append:

```jsonc
"modules": { "type": "json", "configurable": false }
```

`modules` stores an array of module keys, e.g. `["dashboard", "memberships"]` (the
key registry is defined in Phase 3).

**1b. `apps/strapi/src/extensions/users-permissions/strapi-server.ts`** — new file.
Wrap the plugin's `role` service so `updateRole` persists `modules` (anti-pattern 1)
while delegating everything else to the stock implementation:

```ts
export default (plugin: any) => {
  const rawUpdateRole = plugin.services.role({ strapi }).updateRole; // NO — see note
  // Correct pattern: wrap the service factory.
  const originalRoleService = plugin.services.role;
  plugin.services.role = (ctx: any) => {
    const service = originalRoleService(ctx);
    const originalUpdateRole = service.updateRole;
    service.updateRole = async (roleID: number, data: any) => {
      await originalUpdateRole(roleID, data);
      if (data.modules !== undefined) {
        await strapi.db.query('plugin::users-permissions.role').update({ where: { id: roleID }, data: { modules: data.modules } });
      }
    };
    return service;
  };
  return plugin;
};
```

Before writing this, READ
`node_modules/@strapi/plugin-users-permissions/server/services/role.js:1-10` to
confirm the service export shape (factory `({ strapi }) => ({...})` vs plain object)
and match the wrapper to it exactly. If it is a plain object, wrap the method
directly instead of the factory.

No change is needed for create: `createRole` already passes `modules` through
(anti-pattern 1, second half), and the schema extension makes the DB persist it.

### Documentation references

- Plugin role schema: `node_modules/@strapi/plugin-users-permissions/server/content-types/role/index.js:3-50`
- Existing extension pattern: `apps/strapi/src/extensions/users-permissions/content-types/user/schema.json`
- Loader/merge semantics: `node_modules/@strapi/core/dist/loaders/plugins/index.js:52-93`
- Service to override: `node_modules/@strapi/plugin-users-permissions/server/services/role.js:71-145`

### Verification checklist

1. Rebuild + restart Strapi (anti-pattern 5): `npx nx run orwa-strapi:develop` (or the
   project's usual dev command) — boot must be clean, no schema errors.
2. DB: `up_roles` table has a `modules` column (or JSON attribute round-trips).
3. With an admin JWT (grant scopes manually via Strapi admin UI or SQL if Phase 2 is
   not yet done):
   - `POST /api/users-permissions/roles` with `{"name":"Rbac Test","modules":["dashboard"],"permissions":{}}` → `{ ok: true }`
   - `GET /api/users-permissions/roles` → new role present **with** `modules` field
   - `PUT /api/users-permissions/roles/<id>` with `{"name":"Rbac Test","modules":["dashboard","memberships"],"permissions":{…full matrix…}}` → GET shows updated `modules`
   - `DELETE /api/users-permissions/roles/<id>` → gone
4. Regression: `GET /api/users/me?populate=role` still returns the role, now including
   `modules`.

### Anti-pattern guards

- Do NOT invent a `PATCH` route or a custom `modules` endpoint — the override keeps
  the single-PUT contract.
- Do NOT write a partial schema.json (anti-pattern 4).
- Do NOT test with the dev server only — extensions load from `dist/` (anti-pattern 5).

---

## Phase 2 — Strapi: bootstrap rework (stop wiping Staff; seed Admin RBAC access)

### What to implement — all in `apps/strapi/src/index.ts`

**2a. De-fang `configureStaffRole` (lines 69-128).** Keep: create-if-missing
(`:78-85`) and name/type normalization (`:86-94`). Change: seed
`STAFF_ALLOWED_ACTIONS` **only when the role is first created** (move the
add-missing-permissions block `:107-124` inside the creation branch). DELETE the
destructive reconcile at `:101-105` entirely. After this, the RBAC Manager (and the
Strapi admin UI) own the Staff role's permissions.

**2b. Seed Admin's RBAC scopes.** Add a `configureAdminRbacPermissions(strapi)` that
calls the existing additive helper `ensureRolePermissions(strapi, { type: 'admin' }, [...])`
(`:13-38` — verified additive, never deletes) with the six action UIDs from Phase 0
("Auth scopes" list). Call it from `bootstrap()` after `configureTermPermissions`.

**2c. Seed default `modules` for existing roles (one-time, non-destructive).** In
`bootstrap()`, for each role where `modules` is null/undefined, set a default:
role `type: 'admin'` → all module keys; `type: 'staff'` → `["memberships"]`; any
other role → `[]` (Admin will assign via the UI). Never overwrite a non-null value.
Use `strapi.db.query('plugin::users-permissions.role')` like the surrounding code.

### Documentation references

- Current file, full read: `apps/strapi/src/index.ts:1-168` (summary in Phase 0 report;
  `ensureRolePermissions` `:13-38`, `configureStaffRole` `:69-128`, `bootstrap` `:164-167`)
- Module key list: `apps/member-manager/src/config/modules.ts` (created in Phase 3 —
  keep the backend default list as a plain string array here; do not import across apps)

### Verification checklist

1. Boot Strapi twice. Between boots, add an extra permission to the Staff role via
   SQL or the admin panel — it must **survive** the second boot.
2. Fresh-DB path (or delete the Staff role first): Staff role is recreated with
   exactly the 10 whitelisted read actions.
3. `up_permissions` for the `admin`-type role now contains the six
   `plugin::users-permissions.*` action rows; an Admin JWT can call
   `GET /api/users-permissions/permissions` (200, full matrix).
4. A Staff JWT calling `POST /api/users-permissions/roles` gets **403**.
5. All roles have non-null `modules` after boot; a role whose `modules` was set via
   the API keeps its value across restarts.

### Anti-pattern guards

- `ensureRolePermissions` is the only permission-seeding helper to use — do not write
  a new reconcile loop, and do not reintroduce any `.delete(` on
  `plugin::users-permissions.permission` in this file.
- Do not seed RBAC scopes to `public`, `authenticated`, or `staff` (anti-pattern 8).

---

## Phase 3 — Frontend: module registry + RBAC API client

### What to implement

**3a. `apps/member-manager/src/config/modules.ts`** — the single source of truth
mapping module keys to nav + routing. Derive entries from the existing hard-coded
menu (`src/layouts/Admin.tsx:91-184` — the table of name/to/label/icon is in the
Phase 0 report):

```ts
export type ModuleKey = 'dashboard' | 'emails' | 'memberships' | 'contacts' | 'assets' | 'media-library' | 'training' | 'conference' | 'terms' | 'grants' | 'rbac' | 'settings';

export interface AppModule {
  key: ModuleKey;
  label: string; // menu label, e.g. "Asset Manager"
  to: string; // primary route, e.g. "/assets"
  pathPrefixes: string[]; // route prefixes owned by the module, for the guard
  resources: string[]; // react-admin resource names owned by the module
}
export const APP_MODULES: AppModule[] = [
  /* one entry per menu item */
];
```

`pathPrefixes` come from `src/App.tsx` CustomRoutes/Resources inventory (Phase 0
report §3): e.g. training owns `/training/dashboard`, `/training-events`,
`/training-event-logs`, `/training-settings`, plus its resources; memberships owns
`/membership-management`, `/watersystems`, `/associates`, `/memberships`,
`/membership-items`, `/invoices`. Icons stay in the menu component (JSX doesn't
belong in config).

**3b. `apps/member-manager/src/modules/rbac-manager/api.ts`** — direct-fetch client
(dataProvider is unusable for these endpoints — Phase 0 "Frontend data access").
Copy the fetch pattern from `src/modules/human-resources/users/EditUserModal.tsx:72-82`
(bearer token + flat JSON body). Functions:

```ts
getRoles():            GET  /api/users-permissions/roles            → json.roles
getRole(id):           GET  /api/users-permissions/roles/${id}      → json.role   // includes full permissions matrix
getPermissionMatrix(): GET  /api/users-permissions/permissions      → json.permissions
createRole(body):      POST /api/users-permissions/roles            → { ok }
updateRole(id, body):  PUT  /api/users-permissions/roles/${id}      → { ok }
deleteRole(id):        DELETE /api/users-permissions/roles/${id}    → { ok }
```

Type the matrix: `Record<string, { controllers: Record<string, Record<string, { enabled: boolean; policy: string }>> }>`.
`createRole`/`updateRole` body: `{ name, description, modules: ModuleKey[], permissions: Matrix }` — flat, NOT `{ data: … }`-wrapped.

**3c. `useModuleAccess()` hook** (`src/modules/rbac-manager/useModuleAccess.ts` or
`src/modules/_helpers/`) — react-query wrapper (copy the query-config style of
`src/modules/_helpers/useCurrentUser.ts:33-67`) around
`GET /api/users/me?populate=role`, returning
`{ modules: ModuleKey[], roleName: string, isLoading }`. Rule: role with
`type === 'admin'`/name `Admin` → all modules (never lock the admin out); role with
null/empty `modules` → `[]` plus always-allowed `settings`. This hook — not the
`role` cookie — feeds all Phase 5 gating.

### Documentation references

- Menu inventory: `src/layouts/Admin.tsx:67-187`
- Route/resource inventory: `src/App.tsx:137-257`
- Fetch pattern to copy: `src/modules/human-resources/users/EditUserModal.tsx:72-82`
- react-query hook pattern to copy: `src/modules/_helpers/useCurrentUser.ts:33-67`
- Endpoint contracts: Phase 0 "Allowed APIs"

### Verification checklist

1. `npx nx run member-manager:typecheck` (or the app's `tsc`) passes.
2. Every menu item in `Admin.tsx:91-184` has a corresponding `APP_MODULES` entry;
   every CustomRoute path in `App.tsx:212-249` matches some module's `pathPrefixes`
   (write a small unit test or a temporary assertion).
3. In the browser console (logged in as Admin), the api client functions round-trip
   against the Phase 1 backend.

### Anti-pattern guards

- Do NOT route these calls through the dataProvider (`getOne` crashes, `create`/
  `update` wrap the body — Phase 0).
- Do NOT read `modules` from a cookie; fetch from `/users/me?populate=role`.

---

## Phase 4 — Frontend: RBAC Manager UI

### What to implement — `apps/member-manager/src/modules/rbac-manager/`

Follow the app's two established conventions (Phase 0 report §8): custom MUI page for
non-Strapi-shaped data (like `src/modules/human-resources/users/UserList.tsx`), with
the shared `PageHeadingBar` (`src/modules/_components/PageHeadingBar.tsx:15-80`) for
the header chrome, and theme-aware styling copied from
`src/modules/terms/TermList.tsx:19-39`.

**4a. `RbacDashboard.tsx`** — role list page. MUI `Table` copied structurally from
`UserList.tsx:145-292`: columns Name, Description, Type, Users (`nb_users`), Modules
(chip count), actions (Edit / Delete). Data via `getRoles()` from Phase 3 + react-query.
Delete uses a confirm dialog that shows `nb_users` and warns "users on this role will
be moved to Public" (anti-pattern 7); block deleting `public`/`authenticated`/the
Admin role client-side.

**4b. `RoleEditor.tsx`** (create + edit, MUI `Dialog` or full page — match
`EditUserModal.tsx` if dialog):

- **Details**: name (required, minLength 3), description. On edit, show `type` as
  read-only (server ignores changes to it — Phase 0 anti-pattern 1).
- **Module access**: checkbox list over `APP_MODULES` bound to `modules`.
- **Permission matrix**: load `getPermissionMatrix()` (all actions, enabled:false)
  and, when editing, `getRole(id)` whose `permissions` is already the full matrix
  with enabled flags overlaid (`services/role.js:44-69`) — use the role's matrix
  directly as form state. Render one section per `api::*` type (collapse
  `plugin::*` types under an "Advanced" accordion); rows = controllers, columns =
  `find | findOne | create | update | delete` checkboxes, with any non-CRUD custom
  actions listed after. Add per-row "read only" / "all" shortcuts.
- **Save**: POST/PUT the **entire matrix** (anti-pattern 2 — never a diff) plus
  `name`, `description`, `modules`. On 4xx/5xx show the server error verbatim
  (unique-`type` collisions — anti-pattern 6).
- Hide the `plugin::users-permissions.role/permissions` rows from the normal list
  (Advanced only) so an admin doesn't casually grant RBAC control (anti-pattern 8).

**4c. Wire-up:**

- `src/modules/rbac-manager/index.tsx` exporting the dashboard; re-export via
  `src/modules/dashboards.ts` (pattern: `grant-manager` at `dashboards.ts:4`).
- Route: `<Route path="rbac/dashboard" element={<RbacDashboard />} />` inside
  `CustomRoutes` in `src/App.tsx:212-249` (pattern: grant dashboard at `:228`).
- Menu item in `src/layouts/Admin.tsx` after Grant Manager (`:165-171` as template):
  `name="rbac-dashboard" to="/rbac/dashboard" label="RBAC Manager"`, icon
  `AdminPanelSettings` from `@mui/icons-material`.
- Gate visibility with `useModuleAccess()` (module key `rbac`) — full data-driven
  menu comes in Phase 5; here just hide the one item.

### Documentation references

- Table page to copy: `src/modules/human-resources/users/UserList.tsx`
- Dialog form to copy: `src/modules/human-resources/users/EditUserModal.tsx`
- Header chrome: `src/modules/_components/PageHeadingBar.tsx:15-80`
- Dashboard mount pattern: `src/modules/grant-manager/GrantManagement.tsx:1-13`,
  `src/modules/dashboards.ts`, `src/App.tsx:228`
- Menu item pattern: `src/layouts/Admin.tsx:165-171`
- Matrix response shapes: Phase 0 "Allowed APIs" + `services/role.js:44-69`

### Verification checklist

1. Typecheck/lint pass; dark and light themes both render (toggle
   `theme.palette.mode`).
2. E2E manual: create role "Field Tech" with modules `["memberships"]` and
   watersystem `find`/`findOne` → appears in list; Strapi DB shows the two
   `up_permissions` rows and the `modules` JSON.
3. Edit it: enable `associate.find`, save, reload → still exactly the expected
   permission rows and nothing else lost (proves full-matrix PUT).
4. Assign a test user to the role (existing EditUserModal), log in as them:
   `GET /api/watersystems` 200, `POST /api/watersystems` 403, and
   `GET /api/users-permissions/roles` **403**.
5. Delete a role with 0 users → gone; attempt on the Admin role → blocked client-side.

### Anti-pattern guards

- Never PUT without the full permissions matrix; never PUT with `permissions`
  undefined (wipes everything — anti-pattern 2).
- No react-admin `<List>`/`<Edit>` for roles (dataProvider incompatibility).
- Don't copy the stale duplicate files (`* 2.tsx`) noted in the discovery report.

---

## Phase 5 — Frontend: data-driven menu, route guard, and resource gating

### What to implement

**5a. Menu** — rewrite `MyMenu` (`src/layouts/Admin.tsx:67-187`): drop the
`user.role === "Staff"` branch (`:75-86`); render items by filtering `APP_MODULES`
against `useModuleAccess().modules`, keeping the existing icons/labels/nesting
(Training submenu `:129-150` stays hard-wired to the `training` key). Settings
(`:179-184`) always visible.

**5b. Route guard** — replace `StaffRouteGuard` + `STAFF_ALLOWED_RESOURCES` +
`isStaffAllowedPath` (`Admin.tsx:36-64`, applied at `:235`) with a
`ModuleRouteGuard`: allow a path when it matches any allowed module's
`pathPrefixes`; otherwise `<Navigate to={firstAllowedModule.to} replace />` (same
redirect mechanics as `:55-64`). While `isLoading`, render children (current
behavior at `:59`).

**5c. Resource registration** — keep `isStaffPermissionSet`/`makeReadOnlyResource`
(`App.tsx:69-98`) untouched in this phase: it is driven by the server permission
matrix, not role names, and still works with RBAC-created read-only roles. Only
verify it against a new custom role.

**5d. Login flow** — in both auth providers (`src/authProvider.ts:47-105` and
`src/helpers/ra-strapi-data-provider/src/AuthProvider.ts` — the wired-in one, per
`App.tsx:114`), keep cookie behavior as-is; the guard/menu read from
`useModuleAccess()` (server truth), not cookies. Update `src/pages/login.tsx:54`
(post-login redirect for Staff) to redirect to the first allowed module instead of
the `"Staff"` string check.

### Documentation references

- Current guard/menu code: `src/layouts/Admin.tsx:36-187` (quoted in Phase 0 report §3)
- Module registry: Phase 3 `src/config/modules.ts`
- Redirect pattern: `Admin.tsx:55-64`

### Verification checklist

1. Admin login: menu unchanged vs. today (all items) + RBAC Manager.
2. Legacy Staff user: menu shows exactly Memberships (+ Settings); deep-linking
   `/assets` redirects to `/membership-management` — parity with old behavior
   (Staff role seeded `modules: ["memberships"]` in Phase 2c).
3. New custom role with `["training", "conference"]`: sees exactly those menu items;
   `/training-events` loads; `/assets` redirects; and the **API** still 403s
   anything not granted in the matrix (defense in depth).
4. `grep -rn "STAFF_ALLOWED_RESOURCES\|isStaffAllowedPath\|StaffRouteGuard" src/`
   → no hits.
5. User with `modules: []`: lands on Settings, menu shows Settings only, no redirect
   loop.

### Anti-pattern guards

- Do not gate by role NAME anywhere new — only by module keys / server permissions.
- Do not delete `makeReadOnlyResource` (it is permission-driven and orthogonal).
- Keep the guard fail-open while loading (matches `:59`) to avoid a login flash-redirect.

---

## Phase 6 — Frontend: migrate hard-coded role-name checks to capabilities

### What to implement

**6a. `useCan()` capability hook** (`src/modules/_helpers/useCan.ts`) — answers
"can the current user do X on resource Y" from the **server permission matrix**, not
role names. Data source: `GET /api/users-permissions/roles/:id` for the user's own
role (via `useModuleAccess`'s role id; react-query, staleTime ~5 min). API:
`can('create' | 'update' | 'delete' | 'find', 'watersystem') → boolean`, resolved
against action UIDs `api::<res>.<res>.<action>`. Admin-type role → always true.

**6b. Migrate the inventory.** Complete table lives in the Phase 0 discovery report
(§4) — 30+ sites. Mechanical mapping:

- `role === "Admin"` gating create/edit/delete buttons or rowClick →
  `can('create'|'update', <resource>)`
  (e.g. `WatersystemList.tsx:66,84,85`, `AssociateList.tsx:81,83`,
  `MembershipsHeader.tsx:360,494`, `CustomShowHeader.tsx:24,42`,
  `ContactEditFormFields.tsx:48,74`, `ShowHeader.tsx:15,22`,
  `HumanResourcesHeader.tsx:167,193`, `InvoicesList.tsx:232`,
  `ContactList.tsx:49,65`, `MembershipsList.tsx:55,63`,
  `MembershipItemsList.tsx:49,57`, `AssociateGrid.tsx:36,69`,
  `WatersystemShow.tsx:417,441,472`)
- `role === "Staff"` hiding whole sections/tabs → module/capability check
  (`MembershipDashboard.tsx:69-78,156,171`, `MembershipsSummary.tsx:20`,
  `AssociateShow.tsx:66,247`, `WatersystemShow.tsx:101,124,292,396`,
  `SavedFilters.tsx:41-42,226,314`, `MembershipFilters.tsx:24,50`)
- `HumanResourcesDashboard.tsx:33,56` ("Users" tab) → gate on module key `rbac` or
  `can('update','user')` — decide once, apply once.
- Training's parallel role lists (`src/modules/training/workflow.ts:84-94`
  `CRUD_ROLES`/`DEQ_ROLES`, consumed in `EventListActionsMenu.tsx` and
  `EventPipelineHeader.tsx`) → replace list membership with
  `can('update','training-event')` (CRUD_ROLES) and a new
  `can('update','training-event') && modules.includes('training')` or a dedicated
  DEQ capability; keep workflow _status_ logic untouched — only the role-list checks
  change.
- Leave `src/config/Roles.ts` / `guestRole.ts` / `RoleController` in place until the
  end of this phase, then delete them and the `getPermissions` plumbing IF nothing
  references them (`App.tsx:93-95` keeps using the permission-set sniff — see 5c).

Do this module-by-module (memberships → HR → training → misc), verifying each before
the next.

### Documentation references

- Full check inventory with lines: Phase 0 discovery report §4 (copy of it should be
  pasted into the executing context)
- Hook patterns: `src/modules/_helpers/useCurrentUser.ts`, Phase 3 `useModuleAccess`
- Role detail endpoint: Phase 0 "Allowed APIs" (`GET /roles/:id`)

### Verification checklist

1. Per module migrated: legacy Admin sees no UI change; legacy Staff sees no UI
   change (screenshots before/after).
2. Custom role "Training Editor" (`modules: ["training"]`, training-event CRUD
   enabled) can use the event action menu items that `CRUD_ROLES` used to gate.
3. `grep -rn 'role === "Admin"\|role === "Staff"\|role !== "Staff"\|role === '"'"'Admin'"'"'' apps/member-manager/src/` →
   only hits in files intentionally deferred (list them in the PR description);
   at phase end → zero hits outside `config/` deletions.
4. Typecheck + existing tests pass.

### Anti-pattern guards

- Do not "improve" component logic while swapping checks — mechanical substitution
  only, one concern per commit.
- The false-positive list from the discovery report (§4, `contact_type` literals in
  `Data.ts:461`, `ContactCreateFields.tsx:60-61`, `ResourceSelector.tsx:43`, etc.)
  must NOT be touched — they are data values, not role gates.

---

## Phase 7 — Final Verification

1. **Anti-pattern greps** (all must be clean):
   - `grep -rn "permission.*delete\|\.delete(" apps/strapi/src/index.ts` → no
     permission deletes.
   - `grep -rn 'role === "' apps/member-manager/src` → no role-name gates left.
   - `grep -rn "users-permissions/roles" apps/member-manager/src/helpers/ra-strapi-data-provider` →
     only the pre-existing getList special case.
2. **Boot-twice test** (Phase 2 check 1) on a copy of production-like data.
3. **End-to-end scenario**: create role → assign modules + matrix → assign user →
   log in as user → menu, routes, and API all agree; restart Strapi → nothing reverts.
4. **Security spot-checks**: non-admin JWT gets 403 on all six RBAC scopes; `public`
   role has no new grants; role cookie tampering changes nothing server-side.
5. Run the monorepo's checks: `npx nx run-many -t typecheck lint test` (or the
   project's equivalents) — report failures honestly.
6. Update `ARCHITECTURE.md` with a short RBAC section (module registry location,
   endpoints used, bootstrap seeding rules).

---

## Execution notes

- Suggested branch: `feat/rbac-manager`, phase-per-commit (or phase-per-PR for 1+2
  vs 3-5 vs 6).
- Phases 1–2 are safe to deploy alone (schema + additive seeds + de-fanged
  reconcile) — no frontend dependency.
- Phase 6 is the long tail; it can ship incrementally after 5, module by module,
  since legacy behavior is preserved by the Phase 2c module seeding.
- Known open question for the executor: confirm whether the ORWA `admin`-type role's
  six RBAC scopes exist in the target environment DB after Phase 2 deploy (query
  `up_permissions`) before pointing the UI at it.
