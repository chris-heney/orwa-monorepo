"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePrimarySidebarState = void 0;
var react_admin_1 = require("react-admin");
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
var usePrimarySidebarState = function () {
    return (0, react_admin_1.useStore)('primary_solar_sidebar.open', false);
};
exports.usePrimarySidebarState = usePrimarySidebarState;
