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
exports.MultiLevelMenu = void 0;
/* eslint-disable @typescript-eslint/ban-ts-comment */
var React = __importStar(require("react"));
var material_1 = require("@mui/material");
var MenuRoot_1 = require("./MenuRoot");
var MenuItemNode_1 = require("./MenuItemNode");
/**
 * The `<MultiLevelMenu>` component allows to have complex menus with collapsible
 * sub menus inside our application.
 * The app must be inside an AppLocationContext.
 *
 * @see AppLocationContext
 *
 * It accepts `<MultiLevelMenu.Item>` components as children, which may also have `<MultiLevelMenu.Item>` children.
 *
 * @example <caption>Simple Menu</caption>
 * import * as React from 'react';
 * import { Admin, Resource, Layout } from 'react-admin';
 * import { MultiLevelMenu } from '@react-admin/ra-navigation';
 *
 * import { Dashboard } from './Dashboard';
 * import { SongList } from './SongList';
 * import { ArtistList } from './ArtistList';
 *
 * const BasicMultiLevelMenu = () => (
 *     <MultiLevelMenu>
 *         <MultiLevelMenu.Item name="dashboard" to="/" exact label="Dashboard" />
 *         <MultiLevelMenu.Item name="songs" to="/songs" label="Songs" />
 *         <MultiLevelMenu.Item name="artists" label="Artists">
 *             <MultiLevelMenu.Item name="artists.rock" to={'/artists?filter={"type":"Rock"}'} label="Rock" />
 *             <MultiLevelMenu.Item name="artists.jazz" to={'/artists?filter={"type":"Jazz"}'} label="Jazz" />
 *         </MultiLevelMenu.Item>
 *     </MultiLevelMenu>
 * );
 *
 * const BasicLayout = props => (
 *     <AppLocationContext>
 *         <Layout {...props} menu={BasicMultiLevelMenu} />
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
var MultiLevelMenu = function (props) { return (React.createElement(Root, __assign({ variant: "default" }, props))); };
exports.MultiLevelMenu = MultiLevelMenu;
var Root = (0, material_1.styled)(MenuRoot_1.MenuRoot, {
    name: 'RaMultiLevelMenu',
    overridesResolver: function (props, styles) { return styles.root; },
})(function (_a) {
    var theme = _a.theme;
    return ({
        // @ts-ignore
        width: theme.sidebar.width,
    });
});
exports.MultiLevelMenu.Item = MenuItemNode_1.MenuItemNode;
