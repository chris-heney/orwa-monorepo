/**
 * @deprecated No-op kept only so the existing `<UserPreferencesSync />` line
 * in App.tsx keeps compiling. Delete that line (and this file) at the next
 * App.tsx touch.
 *
 * Why it is a no-op: react-admin 4 only accepts `<Resource>` / `<CustomRoutes>`
 * children of `<Admin>` (`getRoutesAndResourceFromNodes` silently drops
 * anything else), so this component NEVER mounted — the boot hydrate it was
 * supposed to run never fired, and every re-login lost the saved view
 * settings. Those responsibilities now live where they are guaranteed to run:
 * - hydrate: `authProvider.checkAuth` / `login` → `userPreferencesStore.ensureHydrated`
 * - unload flush: `userPreferencesStore.setup()` (pagehide/beforeunload, keepalive)
 */
const UserPreferencesSync = () => null;

export default UserPreferencesSync;
