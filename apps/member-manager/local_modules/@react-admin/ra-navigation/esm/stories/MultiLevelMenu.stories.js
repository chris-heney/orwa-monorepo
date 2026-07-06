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
import * as React from 'react';
import { useEffect } from 'react';
import { defaultTheme, Admin, Resource, Layout, List, Datagrid, TextField, DateField, useListContext, } from 'react-admin';
import { createMemoryHistory } from 'history';
import { Card } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MusicIcon from '@mui/icons-material/MusicNote';
import PeopleIcon from '@mui/icons-material/People';
import merge from 'lodash/merge';
import { AppLocationContext, useAppLocationState, useDefineAppLocation, useResourceAppLocation, } from '../src/app-location';
import { MultiLevelMenu } from '../src/multi-level-menu';
import { dataProvider } from './dataProvider';
export default { title: 'ra-navigation/MultiLevelMenu' };
var BasicMultiLevelMenu = function () { return (React.createElement(MultiLevelMenu, null,
    React.createElement(MultiLevelMenu.Item, { name: "dashboard", to: "/", end: true, label: "Dashboard" }),
    React.createElement(MultiLevelMenu.Item, { name: "songs", to: "/songs", label: "Songs" }),
    React.createElement(MultiLevelMenu.Item, { name: "artists", to: '/artists?filter={}', label: "Artists" },
        React.createElement(MultiLevelMenu.Item, { name: "artists.rock", to: '/artists?filter={"type":"Rock"}', label: "Rock" },
            React.createElement(MultiLevelMenu.Item, { name: "artists.rock.pop", to: '/artists?filter={"type":"Pop Rock"}', label: "Pop Rock" }),
            React.createElement(MultiLevelMenu.Item, { name: "artists.rock.folk", to: '/artists?filter={"type":"Folk Rock"}', label: "Folk Rock" })),
        React.createElement(MultiLevelMenu.Item, { name: "artists.jazz", to: '/artists?filter={"type":"Jazz"}', label: "Jazz" },
            React.createElement(MultiLevelMenu.Item, { name: "artists.jazz.rb", to: '/artists?filter={"type":"RB"}', label: "R&B" }))))); };
var BasicLayout = function (props) { return (React.createElement(AppLocationContext, null,
    React.createElement(Layout, __assign({}, props, { menu: BasicMultiLevelMenu })))); };
var Dashboard = function () {
    useDefineAppLocation('dashboard');
    return (React.createElement(Card, null,
        React.createElement("h1", null, "Dashboard")));
};
var types = {
    Rock: 'rock',
    'Folk Rock': 'rock.folk',
    'Pop Rock': 'rock.pop',
    Jazz: 'jazz',
    RB: 'jazz.rb',
};
var SongList = function () { return (React.createElement(List, null,
    React.createElement(SongDatagrid, null))); };
var SongDatagrid = function () {
    var _a = useAppLocationState(), setLocation = _a[1];
    var resourceLocation = useResourceAppLocation();
    var filterValues = useListContext().filterValues;
    useEffect(function () {
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
    return (React.createElement(Datagrid, null,
        React.createElement(TextField, { source: "id" }),
        React.createElement(TextField, { source: "title" }),
        React.createElement(DateField, { source: "released" })));
};
var ArtistList = function () { return (React.createElement(List, null,
    React.createElement(ArtistsDatagrid, null))); };
var ArtistsDatagrid = function () {
    var _a = useAppLocationState(), setLocation = _a[1];
    var resourceLocation = useResourceAppLocation();
    var filterValues = useListContext().filterValues;
    useEffect(function () {
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
    return (React.createElement(Datagrid, null,
        React.createElement(TextField, { source: "id" }),
        React.createElement(TextField, { source: "name" })));
};
export var Basic = function () { return (React.createElement(Admin, { history: createMemoryHistory(), dataProvider: dataProvider, layout: BasicLayout, dashboard: Dashboard },
    React.createElement(Resource, { name: "songs", list: SongList }),
    React.createElement(Resource, { name: "artists", list: ArtistList }))); };
export var DarkMode = function () {
    var darkTheme = merge({}, defaultTheme, {
        palette: {
            mode: 'dark',
            background: {
                default: '#121212',
                paper: '#121212',
            },
        },
    });
    return (React.createElement(Admin, { history: createMemoryHistory(), dataProvider: dataProvider, layout: BasicLayout, dashboard: Dashboard, theme: darkTheme },
        React.createElement(Resource, { name: "songs", list: SongList }),
        React.createElement(Resource, { name: "artists", list: ArtistList })));
};
export var OpenedOnLoad = function () {
    var history = createMemoryHistory({
        initialEntries: ['/artists?filter={"type":"Folk Rock"}'],
    });
    return (React.createElement(Admin, { dataProvider: dataProvider, layout: BasicLayout, dashboard: Dashboard, history: history },
        React.createElement(Resource, { name: "songs", list: SongList }),
        React.createElement(Resource, { name: "artists", list: ArtistList })));
};
var InitiallyOpenMultiLevelMenu = function () { return (React.createElement(MultiLevelMenu, { initialOpen: true },
    React.createElement(MultiLevelMenu.Item, { name: "dashboard", to: "/", end: true, label: "Dashboard" }),
    React.createElement(MultiLevelMenu.Item, { name: "songs", to: "/songs", label: "Songs" }),
    React.createElement(MultiLevelMenu.Item, { name: "artists", to: '/artists?filter={}', label: "Artists" },
        React.createElement(MultiLevelMenu.Item, { name: "artists.rock", to: '/artists?filter={"type":"Rock"}', label: "Rock" },
            React.createElement(MultiLevelMenu.Item, { name: "artists.rock.pop", to: '/artists?filter={"type":"Pop Rock"}', label: "Pop Rock" }),
            React.createElement(MultiLevelMenu.Item, { name: "artists.rock.folk", to: '/artists?filter={"type":"Folk Rock"}', label: "Folk Rock" })),
        React.createElement(MultiLevelMenu.Item, { name: "artists.jazz", to: '/artists?filter={"type":"Jazz"}', label: "Jazz" },
            React.createElement(MultiLevelMenu.Item, { name: "artists.jazz.rb", to: '/artists?filter={"type":"RB"}', label: "R&B" }))))); };
var InitiallyOpenLayout = function (props) { return (React.createElement(AppLocationContext, null,
    React.createElement(Layout, __assign({}, props, { menu: InitiallyOpenMultiLevelMenu })))); };
export var InitiallyOpen = function () { return (React.createElement(Admin, { history: createMemoryHistory(), dataProvider: dataProvider, layout: InitiallyOpenLayout, dashboard: Dashboard },
    React.createElement(Resource, { name: "songs", list: SongList }),
    React.createElement(Resource, { name: "artists", list: ArtistList }))); };
var MultiLevelMenuWithIcons = function () { return (React.createElement(MultiLevelMenu, null,
    React.createElement(MultiLevelMenu.Item, { name: "dashboard", to: "/", end: true, label: "Dashboard", icon: React.createElement(DashboardIcon, null) }),
    React.createElement(MultiLevelMenu.Item, { name: "songs", to: "/songs", label: "Songs", icon: React.createElement(MusicIcon, null) }),
    React.createElement(MultiLevelMenu.Item, { name: "artists", to: '/artists?filter={}', label: "Artists", icon: React.createElement(PeopleIcon, null) },
        React.createElement(MultiLevelMenu.Item, { name: "artists.rock", to: '/artists?filter={"type":"Rock"}', label: "Rock" },
            React.createElement(MultiLevelMenu.Item, { name: "artists.rock.pop", to: '/artists?filter={"type":"Pop Rock"}', label: "Pop Rock" }),
            React.createElement(MultiLevelMenu.Item, { name: "artists.rock.folk", to: '/artists?filter={"type":"Folk Rock"}', label: "Folk Rock" })),
        React.createElement(MultiLevelMenu.Item, { name: "artists.jazz", to: '/artists?filter={"type":"Jazz"}', label: "Jazz" },
            React.createElement(MultiLevelMenu.Item, { name: "artists.jazz.rb", to: '/artists?filter={"type":"RB"}', label: "R&B" }))))); };
var LayoutWithIcons = function (props) { return (React.createElement(AppLocationContext, null,
    React.createElement(Layout, __assign({}, props, { menu: MultiLevelMenuWithIcons })))); };
export var WithIcons = function () { return (React.createElement(Admin, { dataProvider: dataProvider, layout: LayoutWithIcons, dashboard: Dashboard, history: createMemoryHistory() },
    React.createElement(Resource, { name: "songs", list: SongList }),
    React.createElement(Resource, { name: "artists", list: ArtistList }))); };
export var WithIconsDarkMode = function () {
    var darkTheme = merge({}, defaultTheme, {
        palette: {
            mode: 'dark',
            background: {
                default: '#121212',
                paper: '#121212',
            },
        },
    });
    return (React.createElement(Admin, { history: createMemoryHistory(), dataProvider: dataProvider, layout: LayoutWithIcons, dashboard: Dashboard, theme: darkTheme },
        React.createElement(Resource, { name: "songs", list: SongList }),
        React.createElement(Resource, { name: "artists", list: ArtistList })));
};
var LongMultiLevelMenu = function () { return (React.createElement(MultiLevelMenu, { initialOpen: true },
    React.createElement(MultiLevelMenu.Item, { name: "dashboard", to: "/", end: true, label: "Dashboard", icon: React.createElement(PeopleIcon, null) }),
    React.createElement(MultiLevelMenu.Item, { name: "songs", to: '/songs?filter={"released_gte":undefined,"released_lt":undefined}', label: "Songs", icon: React.createElement(PeopleIcon, null) },
        React.createElement(MultiLevelMenu.Item, { name: "songs.60s", to: '/songs?filter={"released_gte":"01/01/1960","released_lt":"01/01/1970"}', label: "60s", icon: React.createElement(PeopleIcon, null) },
            React.createElement(MultiLevelMenu.Item, { name: "songs.60s.rock.pop", to: '/songs?filter={"released_gte":"01/01/1960","released_lt":"01/01/1970","type":"Pop Rock"}', label: "Pop Rock", icon: React.createElement(PeopleIcon, null) }),
            React.createElement(MultiLevelMenu.Item, { name: "songs.60s.rock.folk", to: '/songs?filter={"released_gte":"01/01/1960","released_lt":"01/01/1970","type":"Folk Rock"}', label: "Folk Rock", icon: React.createElement(PeopleIcon, null) }),
            React.createElement(MultiLevelMenu.Item, { name: "songs.60s.jazz.rb", to: '/songs?filter={"released_gte":"01/01/1960","released_lt":"01/01/1970","type":"RB"}', label: "R&B", icon: React.createElement(PeopleIcon, null) })),
        React.createElement(MultiLevelMenu.Item, { name: "songs.70s", to: '/songs?filter={"released_gte":"01/01/1970","released_lt":"01/01/1980"}', label: "70s", icon: React.createElement(PeopleIcon, null) },
            React.createElement(MultiLevelMenu.Item, { name: "songs.70s.rock.pop", to: '/songs?filter={"released_gte":"01/01/1970","released_lt":"01/01/1980","type":"Pop Rock"}', label: "Pop Rock", icon: React.createElement(PeopleIcon, null) }),
            React.createElement(MultiLevelMenu.Item, { name: "songs.70s.rock.folk", to: '/songs?filter={"released_gte":"01/01/1970","released_lt":"01/01/1980","type":"Folk Rock"}', label: "Folk Rock", icon: React.createElement(PeopleIcon, null) }),
            React.createElement(MultiLevelMenu.Item, { name: "songs.70s.jazz.rb", to: '/songs?filter={"released_gte":"01/01/1970","released_lt":"01/01/1980","type":"RB"}', label: "R&B", icon: React.createElement(PeopleIcon, null) })),
        React.createElement(MultiLevelMenu.Item, { name: "songs.80s", to: '/songs?filter={"released_gte":"01/01/1980","released_lt":"01/01/1990"}', label: "80s", icon: React.createElement(PeopleIcon, null) },
            React.createElement(MultiLevelMenu.Item, { name: "songs.80s.rock.pop", to: '/songs?filter={"released_gte":"01/01/1980","released_lt":"01/01/1990","type":"Pop Rock"}', label: "Pop Rock", icon: React.createElement(PeopleIcon, null) }),
            React.createElement(MultiLevelMenu.Item, { name: "songs.80s.rock.folk", to: '/songs?filter={"released_gte":"01/01/1980","released_lt":"01/01/1990","type":"Folk Rock"}', label: "Folk Rock", icon: React.createElement(PeopleIcon, null) }),
            React.createElement(MultiLevelMenu.Item, { name: "songs.80s.jazz.rb", to: '/songs?filter={"released_gte":"01/01/1980","released_lt":"01/01/1990","type":"RB"}', label: "R&B", icon: React.createElement(PeopleIcon, null) })),
        React.createElement(MultiLevelMenu.Item, { name: "songs.90s", to: '/songs?filter={"released_gte":"01/01/1990","released_lt":"01/01/2000"}', label: "90s", icon: React.createElement(PeopleIcon, null) },
            React.createElement(MultiLevelMenu.Item, { name: "songs.90s.rock.pop", to: '/songs?filter={"released_gte":"01/01/1990","released_lt":"01/01/2000","type":"Pop Rock"}', label: "Pop Rock", icon: React.createElement(PeopleIcon, null) }),
            React.createElement(MultiLevelMenu.Item, { name: "songs.90s.rock.folk", to: '/songs?filter={"released_gte":"01/01/1990","released_lt":"01/01/2000","type":"Folk Rock"}', label: "Folk Rock", icon: React.createElement(PeopleIcon, null) }),
            React.createElement(MultiLevelMenu.Item, { name: "songs.90s.jazz.rb", to: '/songs?filter={"released_gte":"01/01/1990","released_lt":"01/01/2000","type":"RB"}', label: "R&B", icon: React.createElement(PeopleIcon, null) }))),
    React.createElement(MultiLevelMenu.Item, { name: "artists", to: '/artists?filter={}', label: "Artists", icon: React.createElement(PeopleIcon, null) },
        React.createElement(MultiLevelMenu.Item, { name: "artists.rock", to: '/artists?filter={"type":"Rock"}', label: "Rock", icon: React.createElement(PeopleIcon, null) },
            React.createElement(MultiLevelMenu.Item, { name: "artists.rock.pop", to: '/artists?filter={"type":"Pop Rock"}', label: "Pop Rock", icon: React.createElement(PeopleIcon, null) }),
            React.createElement(MultiLevelMenu.Item, { name: "artists.rock.folk", to: '/artists?filter={"type":"Folk Rock"}', label: "Folk Rock", icon: React.createElement(PeopleIcon, null) })),
        React.createElement(MultiLevelMenu.Item, { name: "artists.jazz", to: '/artists?filter={"type":"Jazz"}', label: "Jazz", icon: React.createElement(PeopleIcon, null) },
            React.createElement(MultiLevelMenu.Item, { name: "artists.jazz.rb", to: '/artists?filter={"type":"RB"}', label: "R&B", icon: React.createElement(PeopleIcon, null) }))))); };
var LongLayout = function (props) { return (React.createElement(AppLocationContext, null,
    React.createElement(Layout, __assign({}, props, { menu: LongMultiLevelMenu })))); };
export var Long = function () { return (React.createElement(Admin, { history: createMemoryHistory(), dataProvider: dataProvider, layout: LongLayout, dashboard: Dashboard },
    React.createElement(Resource, { name: "songs", list: SongList }),
    React.createElement(Resource, { name: "artists", list: ArtistList }))); };
var NoLocationMultiLevelMenu = function () { return (React.createElement(MultiLevelMenu, null,
    React.createElement(MultiLevelMenu.Item, { name: "dashboard", to: "/", end: true, label: "Dashboard" }),
    React.createElement(MultiLevelMenu.Item, { name: "songs", to: "/songs", label: "Songs" }),
    React.createElement(MultiLevelMenu.Item, { name: "artists", to: '/artists?filter={}', label: "Artists" },
        React.createElement(MultiLevelMenu.Item, { name: "artists.rock", label: "Rock", icon: React.createElement(PeopleIcon, null) },
            React.createElement(MultiLevelMenu.Item, { name: "artists.rock.pop", to: '/artists?filter={"type":"Pop Rock"}', label: "Pop Rock" }),
            React.createElement(MultiLevelMenu.Item, { name: "artists.rock.folk", to: '/artists?filter={"type":"Folk Rock"}', label: "Folk Rock" })),
        React.createElement(MultiLevelMenu.Item, { name: "artists.jazz", to: '/artists?filter={"type":"Jazz"}', label: "Jazz", icon: React.createElement(PeopleIcon, null) },
            React.createElement(MultiLevelMenu.Item, { name: "artists.jazz.rb", to: '/artists?filter={"type":"RB"}', label: "R&B" }))))); };
var NoLocationLayout = function (props) { return (React.createElement(AppLocationContext, null,
    React.createElement(Layout, __assign({}, props, { menu: NoLocationMultiLevelMenu })))); };
export var NoLocation = function () { return (React.createElement(Admin, { history: createMemoryHistory(), dataProvider: dataProvider, layout: NoLocationLayout, dashboard: Dashboard },
    React.createElement(Resource, { name: "songs", list: SongList }),
    React.createElement(Resource, { name: "artists", list: ArtistList }))); };
var OpenItemListMultiLevelMenu = function () { return (React.createElement(MultiLevelMenu, { openItemList: ['songs', 'songs.70s', 'artists', 'artists.jazz'] },
    React.createElement(MultiLevelMenu.Item, { name: "dashboard", to: "/", end: true, label: "Dashboard", icon: React.createElement(PeopleIcon, null) }),
    React.createElement(MultiLevelMenu.Item, { name: "songs", to: '/songs?filter={"released_gte":undefined,"released_lt":undefined}', label: "Songs", icon: React.createElement(PeopleIcon, null) },
        React.createElement(MultiLevelMenu.Item, { name: "songs.60s", to: '/songs?filter={"released_gte":"01/01/1960","released_lt":"01/01/1970"}', label: "60s", icon: React.createElement(PeopleIcon, null) },
            React.createElement(MultiLevelMenu.Item, { name: "songs.60s.rock.pop", to: '/songs?filter={"released_gte":"01/01/1960","released_lt":"01/01/1970","type":"Pop Rock"}', label: "Pop Rock", icon: React.createElement(PeopleIcon, null) }),
            React.createElement(MultiLevelMenu.Item, { name: "songs.60s.rock.folk", to: '/songs?filter={"released_gte":"01/01/1960","released_lt":"01/01/1970","type":"Folk Rock"}', label: "Folk Rock", icon: React.createElement(PeopleIcon, null) }),
            React.createElement(MultiLevelMenu.Item, { name: "songs.60s.jazz.rb", to: '/songs?filter={"released_gte":"01/01/1960","released_lt":"01/01/1970","type":"RB"}', label: "R&B", icon: React.createElement(PeopleIcon, null) })),
        React.createElement(MultiLevelMenu.Item, { name: "songs.70s", to: '/songs?filter={"released_gte":"01/01/1970","released_lt":"01/01/1980"}', label: "70s", icon: React.createElement(PeopleIcon, null) },
            React.createElement(MultiLevelMenu.Item, { name: "songs.70s.rock.pop", to: '/songs?filter={"released_gte":"01/01/1970","released_lt":"01/01/1980","type":"Pop Rock"}', label: "Pop Rock", icon: React.createElement(PeopleIcon, null) }),
            React.createElement(MultiLevelMenu.Item, { name: "songs.70s.rock.folk", to: '/songs?filter={"released_gte":"01/01/1970","released_lt":"01/01/1980","type":"Folk Rock"}', label: "Folk Rock", icon: React.createElement(PeopleIcon, null) }),
            React.createElement(MultiLevelMenu.Item, { name: "songs.70s.jazz.rb", to: '/songs?filter={"released_gte":"01/01/1970","released_lt":"01/01/1980","type":"RB"}', label: "R&B", icon: React.createElement(PeopleIcon, null) })),
        React.createElement(MultiLevelMenu.Item, { name: "songs.80s", to: '/songs?filter={"released_gte":"01/01/1980","released_lt":"01/01/1990"}', label: "80s", icon: React.createElement(PeopleIcon, null) },
            React.createElement(MultiLevelMenu.Item, { name: "songs.80s.rock.pop", to: '/songs?filter={"released_gte":"01/01/1980","released_lt":"01/01/1990","type":"Pop Rock"}', label: "Pop Rock", icon: React.createElement(PeopleIcon, null) }),
            React.createElement(MultiLevelMenu.Item, { name: "songs.80s.rock.folk", to: '/songs?filter={"released_gte":"01/01/1980","released_lt":"01/01/1990","type":"Folk Rock"}', label: "Folk Rock", icon: React.createElement(PeopleIcon, null) }),
            React.createElement(MultiLevelMenu.Item, { name: "songs.80s.jazz.rb", to: '/songs?filter={"released_gte":"01/01/1980","released_lt":"01/01/1990","type":"RB"}', label: "R&B", icon: React.createElement(PeopleIcon, null) })),
        React.createElement(MultiLevelMenu.Item, { name: "songs.90s", to: '/songs?filter={"released_gte":"01/01/1990","released_lt":"01/01/2000"}', label: "90s", icon: React.createElement(PeopleIcon, null) },
            React.createElement(MultiLevelMenu.Item, { name: "songs.90s.rock.pop", to: '/songs?filter={"released_gte":"01/01/1990","released_lt":"01/01/2000","type":"Pop Rock"}', label: "Pop Rock", icon: React.createElement(PeopleIcon, null) }),
            React.createElement(MultiLevelMenu.Item, { name: "songs.90s.rock.folk", to: '/songs?filter={"released_gte":"01/01/1990","released_lt":"01/01/2000","type":"Folk Rock"}', label: "Folk Rock", icon: React.createElement(PeopleIcon, null) }),
            React.createElement(MultiLevelMenu.Item, { name: "songs.90s.jazz.rb", to: '/songs?filter={"released_gte":"01/01/1990","released_lt":"01/01/2000","type":"RB"}', label: "R&B", icon: React.createElement(PeopleIcon, null) }))),
    React.createElement(MultiLevelMenu.Item, { name: "artists", to: '/artists?filter={}', label: "Artists", icon: React.createElement(PeopleIcon, null) },
        React.createElement(MultiLevelMenu.Item, { name: "artists.rock", to: '/artists?filter={"type":"Rock"}', label: "Rock", icon: React.createElement(PeopleIcon, null) },
            React.createElement(MultiLevelMenu.Item, { name: "artists.rock.pop", to: '/artists?filter={"type":"Pop Rock"}', label: "Pop Rock", icon: React.createElement(PeopleIcon, null) }),
            React.createElement(MultiLevelMenu.Item, { name: "artists.rock.folk", to: '/artists?filter={"type":"Folk Rock"}', label: "Folk Rock", icon: React.createElement(PeopleIcon, null) })),
        React.createElement(MultiLevelMenu.Item, { name: "artists.jazz", to: '/artists?filter={"type":"Jazz"}', label: "Jazz", icon: React.createElement(PeopleIcon, null) },
            React.createElement(MultiLevelMenu.Item, { name: "artists.jazz.rb", to: '/artists?filter={"type":"RB"}', label: "R&B", icon: React.createElement(PeopleIcon, null) }))))); };
var OpenItemListLayout = function (props) { return (React.createElement(AppLocationContext, null,
    React.createElement(Layout, __assign({}, props, { menu: OpenItemListMultiLevelMenu })))); };
export var OpenItemList = function () { return (React.createElement(Admin, { history: createMemoryHistory(), dataProvider: dataProvider, layout: OpenItemListLayout, dashboard: Dashboard },
    React.createElement(Resource, { name: "songs", list: SongList }),
    React.createElement(Resource, { name: "artists", list: ArtistList }))); };
var OnClickDashboard = function () {
    useDefineAppLocation('dashboard');
    return (React.createElement(Card, null,
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
    return React.createElement(MultiLevelMenu.Item, __assign({}, props, { onClick: handleClick }));
};
var OnClickMultiLevelMenu = function () { return (React.createElement(MultiLevelMenu, null,
    React.createElement(ClickLoggingMultiLevelMenuItem, { name: "dashboard", to: "/", end: true, label: "Dashboard" }),
    React.createElement(ClickLoggingMultiLevelMenuItem, { name: "songs", to: "/songs", label: "Songs" }),
    React.createElement(ClickLoggingMultiLevelMenuItem, { name: "artists", to: '/artists?filter={}', label: "Artists" },
        React.createElement(ClickLoggingMultiLevelMenuItem, { name: "artists.rock", to: '/artists?filter={"type":"Rock"}', label: "Rock" },
            React.createElement(ClickLoggingMultiLevelMenuItem, { name: "artists.rock.pop", to: '/artists?filter={"type":"Pop Rock"}', label: "Pop Rock" }),
            React.createElement(ClickLoggingMultiLevelMenuItem, { name: "artists.rock.folk", to: '/artists?filter={"type":"Folk Rock"}', label: "Folk Rock" })),
        React.createElement(ClickLoggingMultiLevelMenuItem, { name: "artists.jazz", to: '/artists?filter={"type":"Jazz"}', label: "Jazz" },
            React.createElement(ClickLoggingMultiLevelMenuItem, { name: "artists.jazz.rb", to: '/artists?filter={"type":"RB"}', label: "R&B" }))))); };
var OnClickLayout = function (props) { return (React.createElement(AppLocationContext, null,
    React.createElement(Layout, __assign({}, props, { menu: OnClickMultiLevelMenu })))); };
export var OnClick = function () { return (React.createElement(Admin, { history: createMemoryHistory(), dataProvider: dataProvider, layout: OnClickLayout, dashboard: OnClickDashboard },
    React.createElement(Resource, { name: "songs", list: SongList }),
    React.createElement(Resource, { name: "artists", list: ArtistList }))); };
