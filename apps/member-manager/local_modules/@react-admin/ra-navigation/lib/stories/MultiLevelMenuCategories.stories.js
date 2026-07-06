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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OldSyntax = void 0;
var React = __importStar(require("react"));
var react_1 = require("react");
var react_admin_1 = require("react-admin");
var history_1 = require("history");
var material_1 = require("@mui/material");
var Dashboard_1 = __importDefault(require("@mui/icons-material/Dashboard"));
var MusicNote_1 = __importDefault(require("@mui/icons-material/MusicNote"));
var People_1 = __importDefault(require("@mui/icons-material/People"));
var Settings_1 = __importDefault(require("@mui/icons-material/Settings"));
var FlashOn_1 = __importDefault(require("@mui/icons-material/FlashOn"));
var app_location_1 = require("../src/app-location");
var multi_level_menu_1 = require("../src/multi-level-menu");
var dataProvider_1 = require("./dataProvider");
exports.default = { title: 'ra-navigation/MultiLevelMenu/Compat' };
var Dashboard = function () {
    (0, app_location_1.useDefineAppLocation)('dashboard');
    return (React.createElement(material_1.Card, null,
        React.createElement("h1", null, "Dashboard")));
};
var SongList = function () { return (React.createElement(react_admin_1.List, null,
    React.createElement(react_admin_1.Datagrid, null,
        React.createElement(react_admin_1.TextField, { source: "id" }),
        React.createElement(react_admin_1.TextField, { source: "title" }),
        React.createElement(react_admin_1.DateField, { source: "released" })))); };
var ArtistList = function () { return (React.createElement(react_admin_1.List, null,
    React.createElement(ArtistsDatagrid, null))); };
var types = {
    Rock: 'artists.rock',
    'Folk Rock': 'artists.rock.folk',
    'Pop Rock': 'artists.rock.pop',
    Jazz: 'artists.jazz',
    RB: 'artists.jazz.rb',
};
var ArtistsDatagrid = function () {
    var _a = (0, app_location_1.useAppLocationState)(), setLocation = _a[1];
    var resourceLocation = (0, app_location_1.useResourceAppLocation)();
    var filterValues = (0, react_admin_1.useListContext)().filterValues;
    (0, react_1.useEffect)(function () {
        var type = filterValues.type;
        if (typeof type !== 'undefined') {
            setLocation(types[type]);
        }
    }, 
    /* eslint-disable react-hooks/exhaustive-deps */
    [
        JSON.stringify({
            resourceLocation: resourceLocation,
            filterValues: filterValues,
        }),
    ]
    /* eslint-enable react-hooks/exhaustive-deps */
    );
    return (React.createElement(react_admin_1.Datagrid, null,
        React.createElement(react_admin_1.TextField, { source: "id" }),
        React.createElement(react_admin_1.TextField, { source: "name" })));
};
var MultiLevelMenuWithCategories = function () { return (React.createElement(multi_level_menu_1.MultiLevelMenu, { variant: "categories" },
    React.createElement(multi_level_menu_1.MenuItemCategory, { name: "dashboard", to: "/", end: true, label: "Dashboard", icon: React.createElement(Dashboard_1.default, null) }),
    React.createElement(multi_level_menu_1.MenuItemCategory, { name: "songs", icon: React.createElement(MusicNote_1.default, null), to: "/songs", label: "Songs" }),
    React.createElement(multi_level_menu_1.MenuItemCategory, { name: "artists", label: "Artists", icon: React.createElement(People_1.default, null) },
        React.createElement(material_1.CardContent, null,
            React.createElement(material_1.Typography, { variant: "h4", gutterBottom: true }, "All artists"),
            React.createElement(multi_level_menu_1.MenuItemList, null,
                React.createElement(multi_level_menu_1.MenuItemNode, { name: "artists", to: '/artists?filter={}', label: "All Artists" }),
                React.createElement(multi_level_menu_1.MenuItemNode, { name: "artists.rock", to: '/artists?filter={"type":"Rock"}', label: "Rock" },
                    React.createElement(multi_level_menu_1.MenuItemNode, { name: "artists.rock.pop", to: '/artists?filter={"type":"Pop Rock"}', label: "Pop Rock" }),
                    React.createElement(multi_level_menu_1.MenuItemNode, { name: "artists.rock.folk", to: '/artists?filter={"type":"Folk Rock"}', label: "Folk Rock" })),
                React.createElement(multi_level_menu_1.MenuItemNode, { name: "artists.jazz", to: '/artists?filter={"type":"Jazz"}', label: "Jazz" },
                    React.createElement(multi_level_menu_1.MenuItemNode, { name: "artists.jazz.rb", to: '/artists?filter={"type":"RB"}', label: "R&B" }))))),
    React.createElement(multi_level_menu_1.MenuItemCategory, { name: "rock_artists", label: "Rock Artists", icon: React.createElement(FlashOn_1.default, null) },
        React.createElement(material_1.CardContent, null,
            React.createElement(material_1.Typography, { variant: "h4", gutterBottom: true }, "Rock artists"),
            React.createElement(multi_level_menu_1.MenuItemList, null,
                React.createElement(multi_level_menu_1.MenuItemNode, { name: "rock_artists.pop", to: '/artists?filter={"type":"Pop Rock"}', label: "Pop Rock", icon: React.createElement(FlashOn_1.default, null) }),
                React.createElement(multi_level_menu_1.MenuItemNode, { name: "rock_artists.folk", to: '/artists?filter={"type":"Folk Rock"}', label: "Folk Rock", icon: React.createElement(FlashOn_1.default, null) })))),
    React.createElement(multi_level_menu_1.MenuItemCategory, { sx: {
            marginTop: 'auto',
        }, name: "configuration", to: "/", label: "Configuration", icon: React.createElement(Settings_1.default, null) }))); };
var LayoutWithCategories = function (props) { return (React.createElement(app_location_1.AppLocationContext, null,
    React.createElement(react_admin_1.Layout, __assign({}, props, { menu: MultiLevelMenuWithCategories })))); };
var OldSyntax = function () { return (React.createElement(react_admin_1.Admin, { history: (0, history_1.createMemoryHistory)(), dataProvider: dataProvider_1.dataProvider, layout: LayoutWithCategories, dashboard: Dashboard, theme: multi_level_menu_1.theme },
    React.createElement(react_admin_1.Resource, { name: "songs", list: SongList }),
    React.createElement(react_admin_1.Resource, { name: "artists", list: ArtistList }))); };
exports.OldSyntax = OldSyntax;
