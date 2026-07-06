"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IconMenu = void 0;
var React = __importStar(require("react"));
var MenuRoot_1 = require("./MenuRoot");
var MenuItemCategory_1 = require("./MenuItemCategory");
/**
 * The <IconMenu> component renders a vertical menu bar with icons.
 *
 * Clicking on an item opens a sub menu.
 * The app must be inside an AppLocationContext.
 *
 * @see AppLocationContext
 *
 * It accepts <IconMenu.Item> components as children.
 *
 * @example <caption>Simple Menu</caption>
 * import * as React from 'react';
 * import { Admin, Resource, Layout } from 'react-admin';
 * import { IconMenu, MenuItemList, MenuItemNode } from '@react-admin/ra-navigation';
 *
 * const BasicIconMenu = () => (
 *     <IconMenu>
 *          <IconMenu.Item name="dashboard" to="/" exact label="Dashboard" icon={<DashboardIcon />} />
 *          <IconMenu.Item name="songs" to="/songs" label="Songs" icon={<MusicIcon />} />
 *          <IconMenu.Item name="artists" to="/artists?filter={}" label="Artists" icon={<PeopleIcon />}>
 *              <CardContent>
 *                  <Typography variant="h3" gutterBottom>Artist Categories</Typography>
 *                  <MenuItemList>
 *                      <MenuItemNode name="artists.rock" to={'/artists?filter={"type":"rock"}'} label="Rock" />
 *                      <MenuItemNode name="artists.jazz" to={'/artists?filter={"type":"jazz"}'} label="Jazz" />
 *                      <MenuItemNode name="artists.classical" to={'/artists?filter={"type":"classical"}'} label="Rock" />
 *                  </MenuItemList>
 *              </CardContent>
 *          </IconMenu.Item>
 *          <IconMenu.Item name="configuration" to="/" exact label="Configuration" icon={<SettingsIcon />} sx={{ marginTop: 'auto' }} />
 *     </IconMenu>
 * );
 *
 * const BasicLayout = props => (
 *     <AppLocationContext>
 *         <Layout {...props} menu={BasicIconMenu} />
 *     </AppLocationContext>
 * );
 *
 * export const App = () => (
 *     <Admin
 *         dataProvider={dataProvider}
 *         layout={BasicLayout}
 *         dashboard={Dashboard}
 *     >
 *         <Resource name="songs" list={SongList} />
 *         <Resource name="artists" list={ArtistList} />
 *     </Admin>
 * );
 */
var IconMenu = function (props) { return (React.createElement(MenuRoot_1.MenuRoot, __assign({}, props, { variant: "categories" }))); };
exports.IconMenu = IconMenu;
exports.IconMenu.Item = MenuItemCategory_1.MenuItemCategory;
