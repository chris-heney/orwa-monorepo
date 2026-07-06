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
exports.OnClick = exports.OpenItemList = exports.NoLocation = exports.Long = exports.WithIconsDarkMode = exports.WithIcons = exports.InitiallyOpen = exports.OpenedOnLoad = exports.DarkMode = exports.Basic = void 0;
var React = __importStar(require("react"));
var react_1 = require("react");
var react_admin_1 = require("react-admin");
var history_1 = require("history");
var material_1 = require("@mui/material");
var Dashboard_1 = __importDefault(require("@mui/icons-material/Dashboard"));
var MusicNote_1 = __importDefault(require("@mui/icons-material/MusicNote"));
var People_1 = __importDefault(require("@mui/icons-material/People"));
var merge_1 = __importDefault(require("lodash/merge"));
var app_location_1 = require("../src/app-location");
var multi_level_menu_1 = require("../src/multi-level-menu");
var dataProvider_1 = require("./dataProvider");
exports.default = { title: 'ra-navigation/MultiLevelMenu' };
var BasicMultiLevelMenu = function () { return (React.createElement(multi_level_menu_1.MultiLevelMenu, null,
    React.createElement(multi_level_menu_1.MultiLevelMenu.Item, { name: "dashboard", to: "/", end: true, label: "Dashboard" }),
    React.createElement(multi_level_menu_1.MultiLevelMenu.Item, { name: "songs", to: "/songs", label: "Songs" }),
    React.createElement(multi_level_menu_1.MultiLevelMenu.Item, { name: "artists", to: '/artists?filter={}', label: "Artists" },
        React.createElement(multi_level_menu_1.MultiLevelMenu.Item, { name: "artists.rock", to: '/artists?filter={"type":"Rock"}', label: "Rock" },
            React.createElement(multi_level_menu_1.MultiLevelMenu.Item, { name: "artists.rock.pop", to: '/artists?filter={"type":"Pop Rock"}', label: "Pop Rock" }),
            React.createElement(multi_level_menu_1.MultiLevelMenu.Item, { name: "artists.rock.folk", to: '/artists?filter={"type":"Folk Rock"}', label: "Folk Rock" })),
        React.createElement(multi_level_menu_1.MultiLevelMenu.Item, { name: "artists.jazz", to: '/artists?filter={"type":"Jazz"}', label: "Jazz" },
            React.createElement(multi_level_menu_1.MultiLevelMenu.Item, { name: "artists.jazz.rb", to: '/artists?filter={"type":"RB"}', label: "R&B" }))))); };
var BasicLayout = function (props) { return (React.createElement(app_location_1.AppLocationContext, null,
    React.createElement(react_admin_1.Layout, __assign({}, props, { menu: BasicMultiLevelMenu })))); };
var Dashboard = function () {
    (0, app_location_1.useDefineAppLocation)('dashboard');
    return (React.createElement(material_1.Card, null,
        React.createElement("h1", null, "Dashboard")));
};
var types = {
    Rock: 'rock',
    'Folk Rock': 'rock.folk',
    'Pop Rock': 'rock.pop',
    Jazz: 'jazz',
    RB: 'jazz.rb',
};
var SongList = function () { return (React.createElement(react_admin_1.List, null,
    React.createElement(SongDatagrid, null))); };
var SongDatagrid = function () {
    var _a = (0, app_location_1.useAppLocationState)(), setLocation = _a[1];
    var resourceLocation = (0, app_location_1.useResourceAppLocation)();
    var filterValues = (0, react_admin_1.useListContext)().filterValues;
    (0, react_1.useEffect)(function () {
        var location = 'songs';
        var released_gte = filterValues.released_gte, type = filterValues.type;
        if (released_gte) {
            var year = released_gte.substring(released_gte.length - 2);
            location = "".concat(location, ".").concat(year, "s");
        }
        if (typeof type !== 'undefined') {
            location = "".concat(location, ".").concat(types[type]);
        }
        setLocation(location);
    }, 
    /* eslint-disable react-hooks/exhaustive-deps */
    [
        JSON.stringify({
            resourceLocation: resourceLocation,
            filter: filterValues,
        }),
    ]
    /* eslint-enable react-hooks/exhaustive-deps */
    );
    return (React.createElement(react_admin_1.Datagrid, null,
        React.createElement(react_admin_1.TextField, { source: "id" }),
        React.createElement(react_admin_1.TextField, { source: "title" }),
        React.createElement(react_admin_1.DateField, { source: "released" })));
};
var ArtistList = function () { return (React.createElement(react_admin_1.List, null,
    React.createElement(ArtistsDatagrid, null))); };
var ArtistsDatagrid = function () {
    var _a = (0, app_location_1.useAppLocationState)(), setLocation = _a[1];
    var resourceLocation = (0, app_location_1.useResourceAppLocation)();
    var filterValues = (0, react_admin_1.useListContext)().filterValues;
    (0, react_1.useEffect)(function () {
        var type = filterValues.type;
        if (typeof type !== 'undefined') {
            setLocation("artists.".concat(types[type]));
        }
    }, 
    /* eslint-disable react-hooks/exhaustive-deps */
    [
        JSON.stringify({
            resourceLocation: resourceLocation,
            filter: filterValues,
        }),
    ]
    /* eslint-enable react-hooks/exhaustive-deps */
    );
    return (React.createElement(react_admin_1.Datagrid, null,
        React.createElement(react_admin_1.TextField, { source: "id" }),
        React.createElement(react_admin_1.TextField, { source: "name" })));
};
var Basic = function () { return (React.createElement(react_admin_1.Admin, { history: (0, history_1.createMemoryHistory)(), dataProvider: dataProvider_1.dataProvider, layout: BasicLayout, dashboard: Dashboard },
    React.createElement(react_admin_1.Resource, { name: "songs", list: SongList }),
    React.createElement(react_admin_1.Resource, { name: "artists", list: ArtistList }))); };
exports.Basic = Basic;
var DarkMode = function () {
    var darkTheme = (0, merge_1.default)({}, react_admin_1.defaultTheme, {
        palette: {
            mode: 'dark',
            background: {
                default: '#121212',
                paper: '#121212',
            },
        },
    });
    return (React.createElement(react_admin_1.Admin, { history: (0, history_1.createMemoryHistory)(), dataProvider: dataProvider_1.dataProvider, layout: BasicLayout, dashboard: Dashboard, theme: darkTheme },
        React.createElement(react_admin_1.Resource, { name: "songs", list: SongList }),
        React.createElement(react_admin_1.Resource, { name: "artists", list: ArtistList })));
};
exports.DarkMode = DarkMode;
var OpenedOnLoad = function () {
    var history = (0, history_1.createMemoryHistory)({
        initialEntries: ['/artists?filter={"type":"Folk Rock"}'],
    });
    return (React.createElement(react_admin_1.Admin, { dataProvider: dataProvider_1.dataProvider, layout: BasicLayout, dashboard: Dashboard, history: history },
        React.createElement(react_admin_1.Resource, { name: "songs", list: SongList }),
        React.createElement(react_admin_1.Resource, { name: "artists", list: ArtistList })));
};
exports.OpenedOnLoad = OpenedOnLoad;
var InitiallyOpenMultiLevelMenu = function () { return (React.createElement(multi_level_menu_1.MultiLevelMenu, { initialOpen: true },
    React.createElement(multi_level_menu_1.MultiLevelMenu.Item, { name: "dashboard", to: "/", end: true, label: "Dashboard" }),
    React.createElement(multi_level_menu_1.MultiLevelMenu.Item, { name: "songs", to: "/songs", label: "Songs" }),
    React.createElement(multi_level_menu_1.MultiLevelMenu.Item, { name: "artists", to: '/artists?filter={}', label: "Artists" },
        React.createElement(multi_level_menu_1.MultiLevelMenu.Item, { name: "artists.rock", to: '/artists?filter={"type":"Rock"}', label: "Rock" },
            React.createElement(multi_level_menu_1.MultiLevelMenu.Item, { name: "artists.rock.pop", to: '/artists?filter={"type":"Pop Rock"}', label: "Pop Rock" }),
            React.createElement(multi_level_menu_1.MultiLevelMenu.Item, { name: "artists.rock.folk", to: '/artists?filter={"type":"Folk Rock"}', label: "Folk Rock" })),
        React.createElement(multi_level_menu_1.MultiLevelMenu.Item, { name: "artists.jazz", to: '/artists?filter={"type":"Jazz"}', label: "Jazz" },
            React.createElement(multi_level_menu_1.MultiLevelMenu.Item, { name: "artists.jazz.rb", to: '/artists?filter={"type":"RB"}', label: "R&B" }))))); };
var InitiallyOpenLayout = function (props) { return (React.createElement(app_location_1.AppLocationContext, null,
    React.createElement(react_admin_1.Layout, __assign({}, props, { menu: InitiallyOpenMultiLevelMenu })))); };
var InitiallyOpen = function () { return (React.createElement(react_admin_1.Admin, { history: (0, history_1.createMemoryHistory)(), dataProvider: dataProvider_1.dataProvider, layout: InitiallyOpenLayout, dashboard: Dashboard },
    React.createElement(react_admin_1.Resource, { name: "songs", list: SongList }),
    React.createElement(react_admin_1.Resource, { name: "artists", list: ArtistList }))); };
exports.InitiallyOpen = InitiallyOpen;
var MultiLevelMenuWithIcons = function () { return (React.createElement(multi_level_menu_1.MultiLevelMenu, null,
    React.createElement(multi_level_menu_1.MultiLevelMenu.Item, { name: "dashboard", to: "/", end: true, label: "Dashboard", icon: React.createElement(Dashboard_1.default, null) }),
    React.createElement(multi_level_menu_1.MultiLevelMenu.Item, { name: "songs", to: "/songs", label: "Songs", icon: React.createElement(MusicNote_1.default, null) }),
    React.createElement(multi_level_menu_1.MultiLevelMenu.Item, { name: "artists", to: '/artists?filter={}', label: "Artists", icon: React.createElement(People_1.default, null) },
        React.createElement(multi_level_menu_1.MultiLevelMenu.Item, { name: "artists.rock", to: '/artists?filter={"type":"Rock"}', label: "Rock" },
            React.createElement(multi_level_menu_1.MultiLevelMenu.Item, { name: "artists.rock.pop", to: '/artists?filter={"type":"Pop Rock"}', label: "Pop Rock" }),
            React.createElement(multi_level_menu_1.MultiLevelMenu.Item, { name: "artists.rock.folk", to: '/artists?filter={"type":"Folk Rock"}', label: "Folk Rock" })),
        React.createElement(multi_level_menu_1.MultiLevelMenu.Item, { name: "artists.jazz", to: '/artists?filter={"type":"Jazz"}', label: "Jazz" },
            React.createElement(multi_level_menu_1.MultiLevelMenu.Item, { name: "artists.jazz.rb", to: '/artists?filter={"type":"RB"}', label: "R&B" }))))); };
var LayoutWithIcons = function (props) { return (React.createElement(app_location_1.AppLocationContext, null,
    React.createElement(react_admin_1.Layout, __assign({}, props, { menu: MultiLevelMenuWithIcons })))); };
var WithIcons = function () { return (React.createElement(react_admin_1.Admin, { dataProvider: dataProvider_1.dataProvider, layout: LayoutWithIcons, dashboard: Dashboard, history: (0, history_1.createMemoryHistory)() },
    React.createElement(react_admin_1.Resource, { name: "songs", list: SongList }),
    React.createElement(react_admin_1.Resource, { name: "artists", list: ArtistList }))); };
exports.WithIcons = WithIcons;
var WithIconsDarkMode = function () {
    var darkTheme = (0, merge_1.default)({}, react_admin_1.defaultTheme, {
        palette: {
            mode: 'dark',
            background: {
                default: '#121212',
                paper: '#121212',
            },
        },
    });
    return (React.createElement(react_admin_1.Admin, { history: (0, history_1.createMemoryHistory)(), dataProvider: dataProvider_1.dataProvider, layout: LayoutWithIcons, dashboard: Dashboard, theme: darkTheme },
        React.createElement(react_admin_1.Resource, { name: "songs", list: SongList }),
        React.createElement(react_admin_1.Resource, { name: "artists", list: ArtistList })));
};
exports.WithIconsDarkMode = WithIconsDarkMode;
var LongMultiLevelMenu = function () { return (React.createElement(multi_level_menu_1.MultiLevelMenu, { initialOpen: true },
    React.createElement(multi_level_menu_1.MultiLevelMenu.Item, { name: "dashboard", to: "/", end: true, label: "Dashboard", icon: React.createElement(People_1.default, null) }),
    React.createElement(multi_level_menu_1.MultiLevelMenu.Item, { name: "songs", to: '/songs?filter={"released_gte":undefined,"released_lt":undefined}', label: "Songs", icon: React.createElement(People_1.default, null) },
        React.createElement(multi_level_menu_1.MultiLevelMenu.Item, { name: "songs.60s", to: '/songs?filter={"released_gte":"01/01/1960","released_lt":"01/01/1970"}', label: "60s", icon: React.createElement(People_1.default, null) },
            React.createElement(multi_level_menu_1.MultiLevelMenu.Item, { name: "songs.60s.rock.pop", to: '/songs?filter={"released_gte":"01/01/1960","released_lt":"01/01/1970","type":"Pop Rock"}', label: "Pop Rock", icon: React.createElement(People_1.default, null) }),
            React.createElement(multi_level_menu_1.MultiLevelMenu.Item, { name: "songs.60s.rock.folk", to: '/songs?filter={"released_gte":"01/01/1960","released_lt":"01/01/1970","type":"Folk Rock"}', label: "Folk Rock", icon: React.createElement(People_1.default, null) }),
            React.createElement(multi_level_menu_1.MultiLevelMenu.Item, { name: "songs.60s.jazz.rb", to: '/songs?filter={"released_gte":"01/01/1960","released_lt":"01/01/1970","type":"RB"}', label: "R&B", icon: React.createElement(People_1.default, null) })),
        React.createElement(multi_level_menu_1.MultiLevelMenu.Item, { name: "songs.70s", to: '/songs?filter={"released_gte":"01/01/1970","released_lt":"01/01/1980"}', label: "70s", icon: React.createElement(People_1.default, null) },
            React.createElement(multi_level_menu_1.MultiLevelMenu.Item, { name: "songs.70s.rock.pop", to: '/songs?filter={"released_gte":"01/01/1970","released_lt":"01/01/1980","type":"Pop Rock"}', label: "Pop Rock", icon: React.createElement(People_1.default, null) }),
            React.createElement(multi_level_menu_1.MultiLevelMenu.Item, { name: "songs.70s.rock.folk", to: '/songs?filter={"released_gte":"01/01/1970","released_lt":"01/01/1980","type":"Folk Rock"}', label: "Folk Rock", icon: React.createElement(People_1.default, null) }),
            React.createElement(multi_level_menu_1.MultiLevelMenu.Item, { name: "songs.70s.jazz.rb", to: '/songs?filter={"released_gte":"01/01/1970","released_lt":"01/01/1980","type":"RB"}', label: "R&B", icon: React.createElement(People_1.default, null) })),
        React.createElement(multi_level_menu_1.MultiLevelMenu.Item, { name: "songs.80s", to: '/songs?filter={"released_gte":"01/01/1980","released_lt":"01/01/1990"}', label: "80s", icon: React.createElement(People_1.default, null) },
            React.createElement(multi_level_menu_1.MultiLevelMenu.Item, { name: "songs.80s.rock.pop", to: '/songs?filter={"released_gte":"01/01/1980","released_lt":"01/01/1990","type":"Pop Rock"}', label: "Pop Rock", icon: React.createElement(People_1.default, null) }),
            React.createElement(multi_level_menu_1.MultiLevelMenu.Item, { name: "songs.80s.rock.folk", to: '/songs?filter={"released_gte":"01/01/1980","released_lt":"01/01/1990","type":"Folk Rock"}', label: "Folk Rock", icon: React.createElement(People_1.default, null) }),
            React.createElement(multi_level_menu_1.MultiLevelMenu.Item, { name: "songs.80s.jazz.rb", to: '/songs?filter={"released_gte":"01/01/1980","released_lt":"01/01/1990","type":"RB"}', label: "R&B", icon: React.createElement(People_1.default, null) })),
        React.createElement(multi_level_menu_1.MultiLevelMenu.Item, { name: "songs.90s", to: '/songs?filter={"released_gte":"01/01/1990","released_lt":"01/01/2000"}', label: "90s", icon: React.createElement(People_1.default, null) },
            React.createElement(multi_level_menu_1.MultiLevelMenu.Item, { name: "songs.90s.rock.pop", to: '/songs?filter={"released_gte":"01/01/1990","released_lt":"01/01/2000","type":"Pop Rock"}', label: "Pop Rock", icon: React.createElement(People_1.default, null) }),
            React.createElement(multi_level_menu_1.MultiLevelMenu.Item, { name: "songs.90s.rock.folk", to: '/songs?filter={"released_gte":"01/01/1990","released_lt":"01/01/2000","type":"Folk Rock"}', label: "Folk Rock", icon: React.createElement(People_1.default, null) }),
            React.createElement(multi_level_menu_1.MultiLevelMenu.Item, { name: "songs.90s.jazz.rb", to: '/songs?filter={"released_gte":"01/01/1990","released_lt":"01/01/2000","type":"RB"}', label: "R&B", icon: React.createElement(People_1.default, null) }))),
    React.createElement(multi_level_menu_1.MultiLevelMenu.Item, { name: "artists", to: '/artists?filter={}', label: "Artists", icon: React.createElement(People_1.default, null) },
        React.createElement(multi_level_menu_1.MultiLevelMenu.Item, { name: "artists.rock", to: '/artists?filter={"type":"Rock"}', label: "Rock", icon: React.createElement(People_1.default, null) },
            React.createElement(multi_level_menu_1.MultiLevelMenu.Item, { name: "artists.rock.pop", to: '/artists?filter={"type":"Pop Rock"}', label: "Pop Rock", icon: React.createElement(People_1.default, null) }),
            React.createElement(multi_level_menu_1.MultiLevelMenu.Item, { name: "artists.rock.folk", to: '/artists?filter={"type":"Folk Rock"}', label: "Folk Rock", icon: React.createElement(People_1.default, null) })),
        React.createElement(multi_level_menu_1.MultiLevelMenu.Item, { name: "artists.jazz", to: '/artists?filter={"type":"Jazz"}', label: "Jazz", icon: React.createElement(People_1.default, null) },
            React.createElement(multi_level_menu_1.MultiLevelMenu.Item, { name: "artists.jazz.rb", to: '/artists?filter={"type":"RB"}', label: "R&B", icon: React.createElement(People_1.default, null) }))))); };
var LongLayout = function (props) { return (React.createElement(app_location_1.AppLocationContext, null,
    React.createElement(react_admin_1.Layout, __assign({}, props, { menu: LongMultiLevelMenu })))); };
var Long = function () { return (React.createElement(react_admin_1.Admin, { history: (0, history_1.createMemoryHistory)(), dataProvider: dataProvider_1.dataProvider, layout: LongLayout, dashboard: Dashboard },
    React.createElement(react_admin_1.Resource, { name: "songs", list: SongList }),
    React.createElement(react_admin_1.Resource, { name: "artists", list: ArtistList }))); };
exports.Long = Long;
var NoLocationMultiLevelMenu = function () { return (React.createElement(multi_level_menu_1.MultiLevelMenu, null,
    React.createElement(multi_level_menu_1.MultiLevelMenu.Item, { name: "dashboard", to: "/", end: true, label: "Dashboard" }),
    React.createElement(multi_level_menu_1.MultiLevelMenu.Item, { name: "songs", to: "/songs", label: "Songs" }),
    React.createElement(multi_level_menu_1.MultiLevelMenu.Item, { name: "artists", to: '/artists?filter={}', label: "Artists" },
        React.createElement(multi_level_menu_1.MultiLevelMenu.Item, { name: "artists.rock", label: "Rock", icon: React.createElement(People_1.default, null) },
            React.createElement(multi_level_menu_1.MultiLevelMenu.Item, { name: "artists.rock.pop", to: '/artists?filter={"type":"Pop Rock"}', label: "Pop Rock" }),
            React.createElement(multi_level_menu_1.MultiLevelMenu.Item, { name: "artists.rock.folk", to: '/artists?filter={"type":"Folk Rock"}', label: "Folk Rock" })),
        React.createElement(multi_level_menu_1.MultiLevelMenu.Item, { name: "artists.jazz", to: '/artists?filter={"type":"Jazz"}', label: "Jazz", icon: React.createElement(People_1.default, null) },
            React.createElement(multi_level_menu_1.MultiLevelMenu.Item, { name: "artists.jazz.rb", to: '/artists?filter={"type":"RB"}', label: "R&B" }))))); };
var NoLocationLayout = function (props) { return (React.createElement(app_location_1.AppLocationContext, null,
    React.createElement(react_admin_1.Layout, __assign({}, props, { menu: NoLocationMultiLevelMenu })))); };
var NoLocation = function () { return (React.createElement(react_admin_1.Admin, { history: (0, history_1.createMemoryHistory)(), dataProvider: dataProvider_1.dataProvider, layout: NoLocationLayout, dashboard: Dashboard },
    React.createElement(react_admin_1.Resource, { name: "songs", list: SongList }),
    React.createElement(react_admin_1.Resource, { name: "artists", list: ArtistList }))); };
exports.NoLocation = NoLocation;
var OpenItemListMultiLevelMenu = function () { return (React.createElement(multi_level_menu_1.MultiLevelMenu, { openItemList: ['songs', 'songs.70s', 'artists', 'artists.jazz'] },
    React.createElement(multi_level_menu_1.MultiLevelMenu.Item, { name: "dashboard", to: "/", end: true, label: "Dashboard", icon: React.createElement(People_1.default, null) }),
    React.createElement(multi_level_menu_1.MultiLevelMenu.Item, { name: "songs", to: '/songs?filter={"released_gte":undefined,"released_lt":undefined}', label: "Songs", icon: React.createElement(People_1.default, null) },
        React.createElement(multi_level_menu_1.MultiLevelMenu.Item, { name: "songs.60s", to: '/songs?filter={"released_gte":"01/01/1960","released_lt":"01/01/1970"}', label: "60s", icon: React.createElement(People_1.default, null) },
            React.createElement(multi_level_menu_1.MultiLevelMenu.Item, { name: "songs.60s.rock.pop", to: '/songs?filter={"released_gte":"01/01/1960","released_lt":"01/01/1970","type":"Pop Rock"}', label: "Pop Rock", icon: React.createElement(People_1.default, null) }),
            React.createElement(multi_level_menu_1.MultiLevelMenu.Item, { name: "songs.60s.rock.folk", to: '/songs?filter={"released_gte":"01/01/1960","released_lt":"01/01/1970","type":"Folk Rock"}', label: "Folk Rock", icon: React.createElement(People_1.default, null) }),
            React.createElement(multi_level_menu_1.MultiLevelMenu.Item, { name: "songs.60s.jazz.rb", to: '/songs?filter={"released_gte":"01/01/1960","released_lt":"01/01/1970","type":"RB"}', label: "R&B", icon: React.createElement(People_1.default, null) })),
        React.createElement(multi_level_menu_1.MultiLevelMenu.Item, { name: "songs.70s", to: '/songs?filter={"released_gte":"01/01/1970","released_lt":"01/01/1980"}', label: "70s", icon: React.createElement(People_1.default, null) },
            React.createElement(multi_level_menu_1.MultiLevelMenu.Item, { name: "songs.70s.rock.pop", to: '/songs?filter={"released_gte":"01/01/1970","released_lt":"01/01/1980","type":"Pop Rock"}', label: "Pop Rock", icon: React.createElement(People_1.default, null) }),
            React.createElement(multi_level_menu_1.MultiLevelMenu.Item, { name: "songs.70s.rock.folk", to: '/songs?filter={"released_gte":"01/01/1970","released_lt":"01/01/1980","type":"Folk Rock"}', label: "Folk Rock", icon: React.createElement(People_1.default, null) }),
            React.createElement(multi_level_menu_1.MultiLevelMenu.Item, { name: "songs.70s.jazz.rb", to: '/songs?filter={"released_gte":"01/01/1970","released_lt":"01/01/1980","type":"RB"}', label: "R&B", icon: React.createElement(People_1.default, null) })),
        React.createElement(multi_level_menu_1.MultiLevelMenu.Item, { name: "songs.80s", to: '/songs?filter={"released_gte":"01/01/1980","released_lt":"01/01/1990"}', label: "80s", icon: React.createElement(People_1.default, null) },
            React.createElement(multi_level_menu_1.MultiLevelMenu.Item, { name: "songs.80s.rock.pop", to: '/songs?filter={"released_gte":"01/01/1980","released_lt":"01/01/1990","type":"Pop Rock"}', label: "Pop Rock", icon: React.createElement(People_1.default, null) }),
            React.createElement(multi_level_menu_1.MultiLevelMenu.Item, { name: "songs.80s.rock.folk", to: '/songs?filter={"released_gte":"01/01/1980","released_lt":"01/01/1990","type":"Folk Rock"}', label: "Folk Rock", icon: React.createElement(People_1.default, null) }),
            React.createElement(multi_level_menu_1.MultiLevelMenu.Item, { name: "songs.80s.jazz.rb", to: '/songs?filter={"released_gte":"01/01/1980","released_lt":"01/01/1990","type":"RB"}', label: "R&B", icon: React.createElement(People_1.default, null) })),
        React.createElement(multi_level_menu_1.MultiLevelMenu.Item, { name: "songs.90s", to: '/songs?filter={"released_gte":"01/01/1990","released_lt":"01/01/2000"}', label: "90s", icon: React.createElement(People_1.default, null) },
            React.createElement(multi_level_menu_1.MultiLevelMenu.Item, { name: "songs.90s.rock.pop", to: '/songs?filter={"released_gte":"01/01/1990","released_lt":"01/01/2000","type":"Pop Rock"}', label: "Pop Rock", icon: React.createElement(People_1.default, null) }),
            React.createElement(multi_level_menu_1.MultiLevelMenu.Item, { name: "songs.90s.rock.folk", to: '/songs?filter={"released_gte":"01/01/1990","released_lt":"01/01/2000","type":"Folk Rock"}', label: "Folk Rock", icon: React.createElement(People_1.default, null) }),
            React.createElement(multi_level_menu_1.MultiLevelMenu.Item, { name: "songs.90s.jazz.rb", to: '/songs?filter={"released_gte":"01/01/1990","released_lt":"01/01/2000","type":"RB"}', label: "R&B", icon: React.createElement(People_1.default, null) }))),
    React.createElement(multi_level_menu_1.MultiLevelMenu.Item, { name: "artists", to: '/artists?filter={}', label: "Artists", icon: React.createElement(People_1.default, null) },
        React.createElement(multi_level_menu_1.MultiLevelMenu.Item, { name: "artists.rock", to: '/artists?filter={"type":"Rock"}', label: "Rock", icon: React.createElement(People_1.default, null) },
            React.createElement(multi_level_menu_1.MultiLevelMenu.Item, { name: "artists.rock.pop", to: '/artists?filter={"type":"Pop Rock"}', label: "Pop Rock", icon: React.createElement(People_1.default, null) }),
            React.createElement(multi_level_menu_1.MultiLevelMenu.Item, { name: "artists.rock.folk", to: '/artists?filter={"type":"Folk Rock"}', label: "Folk Rock", icon: React.createElement(People_1.default, null) })),
        React.createElement(multi_level_menu_1.MultiLevelMenu.Item, { name: "artists.jazz", to: '/artists?filter={"type":"Jazz"}', label: "Jazz", icon: React.createElement(People_1.default, null) },
            React.createElement(multi_level_menu_1.MultiLevelMenu.Item, { name: "artists.jazz.rb", to: '/artists?filter={"type":"RB"}', label: "R&B", icon: React.createElement(People_1.default, null) }))))); };
var OpenItemListLayout = function (props) { return (React.createElement(app_location_1.AppLocationContext, null,
    React.createElement(react_admin_1.Layout, __assign({}, props, { menu: OpenItemListMultiLevelMenu })))); };
var OpenItemList = function () { return (React.createElement(react_admin_1.Admin, { history: (0, history_1.createMemoryHistory)(), dataProvider: dataProvider_1.dataProvider, layout: OpenItemListLayout, dashboard: Dashboard },
    React.createElement(react_admin_1.Resource, { name: "songs", list: SongList }),
    React.createElement(react_admin_1.Resource, { name: "artists", list: ArtistList }))); };
exports.OpenItemList = OpenItemList;
var OnClickDashboard = function () {
    (0, app_location_1.useDefineAppLocation)('dashboard');
    return (React.createElement(material_1.Card, null,
        React.createElement("h1", null, "Dashboard"),
        React.createElement("p", null, "Open the DevTools console to see the onClick events")));
};
var ClickLoggingMultiLevelMenuItem = function (props) {
    var name = props.name, onClick = props.onClick;
    var handleClick = function (event) {
        // eslint-disable-next-line no-console
        console.log("clicked on ".concat(name, "!"));
        onClick && onClick(event);
    };
    return React.createElement(multi_level_menu_1.MultiLevelMenu.Item, __assign({}, props, { onClick: handleClick }));
};
var OnClickMultiLevelMenu = function () { return (React.createElement(multi_level_menu_1.MultiLevelMenu, null,
    React.createElement(ClickLoggingMultiLevelMenuItem, { name: "dashboard", to: "/", end: true, label: "Dashboard" }),
    React.createElement(ClickLoggingMultiLevelMenuItem, { name: "songs", to: "/songs", label: "Songs" }),
    React.createElement(ClickLoggingMultiLevelMenuItem, { name: "artists", to: '/artists?filter={}', label: "Artists" },
        React.createElement(ClickLoggingMultiLevelMenuItem, { name: "artists.rock", to: '/artists?filter={"type":"Rock"}', label: "Rock" },
            React.createElement(ClickLoggingMultiLevelMenuItem, { name: "artists.rock.pop", to: '/artists?filter={"type":"Pop Rock"}', label: "Pop Rock" }),
            React.createElement(ClickLoggingMultiLevelMenuItem, { name: "artists.rock.folk", to: '/artists?filter={"type":"Folk Rock"}', label: "Folk Rock" })),
        React.createElement(ClickLoggingMultiLevelMenuItem, { name: "artists.jazz", to: '/artists?filter={"type":"Jazz"}', label: "Jazz" },
            React.createElement(ClickLoggingMultiLevelMenuItem, { name: "artists.jazz.rb", to: '/artists?filter={"type":"RB"}', label: "R&B" }))))); };
var OnClickLayout = function (props) { return (React.createElement(app_location_1.AppLocationContext, null,
    React.createElement(react_admin_1.Layout, __assign({}, props, { menu: OnClickMultiLevelMenu })))); };
var OnClick = function () { return (React.createElement(react_admin_1.Admin, { history: (0, history_1.createMemoryHistory)(), dataProvider: dataProvider_1.dataProvider, layout: OnClickLayout, dashboard: OnClickDashboard },
    React.createElement(react_admin_1.Resource, { name: "songs", list: SongList }),
    React.createElement(react_admin_1.Resource, { name: "artists", list: ArtistList }))); };
exports.OnClick = OnClick;
