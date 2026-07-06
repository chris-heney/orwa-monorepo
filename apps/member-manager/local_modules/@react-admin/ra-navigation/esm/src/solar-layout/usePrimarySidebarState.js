import { useStore } from 'react-admin';
/**
 * A hook that returns the primary solar sidebar open state and a function to toggle it.
 *
 * The sidebar is closed by default.
 *
 * @example
 * const ToggleSidebar = () => {
 *     const [open, setOpen] = usePrimarySidebarState();
 *     return (
 *         <Button onClick={() => setOpen(!open)}>
 *             {open ? 'Open' : 'Close'}
 *         </Button>
 *     );
 * };
 */
export var usePrimarySidebarState = function () {
    return useStore('primary_solar_sidebar.open', false);
};
