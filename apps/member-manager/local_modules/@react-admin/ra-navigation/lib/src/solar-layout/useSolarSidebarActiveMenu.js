"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSolarSidebarActiveMenu = void 0;
var react_admin_1 = require("react-admin");
/**
 * A hook that returns the secondary solar sidebar currently active menu and a function to set it.
 *
 * @example
 * const EnableUserMenu = () => {
 *     const [active, setActive] = useSolarSidebarActiveMenu();
 *     return (
 *         <Button onClick={() => setActive('usermenu')}>
 *             Open User Menu
 *         </Button>
 *     );
 * };
 */
var useSolarSidebarActiveMenu = function () {
    return (0, react_admin_1.useStore)('secondary_solar_sidebar.open', null);
};
exports.useSolarSidebarActiveMenu = useSolarSidebarActiveMenu;
