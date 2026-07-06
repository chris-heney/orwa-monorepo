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
import { Admin, Resource, Layout, List, Datagrid, TextField, DateField, useListContext, } from 'react-admin';
import { createMemoryHistory } from 'history';
import { Card, CardContent, Typography } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MusicIcon from '@mui/icons-material/MusicNote';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import FlashIcon from '@mui/icons-material/FlashOn';
import merge from 'lodash/merge';
import { AppLocationContext, useAppLocationState, useDefineAppLocation, useResourceAppLocation, } from '../src/app-location';
import { IconMenu, MenuItemList, MenuItemNode, theme, } from '../src/multi-level-menu';
import { dataProvider } from './dataProvider';
export default { title: 'ra-navigation/IconMenu' };
var Dashboard = function () {
    useDefineAppLocation('dashboard');
    return (React.createElement(Card, null,
        React.createElement("h1", null, "Dashboard")));
};
var SongList = function () { return (React.createElement(List, null,
    React.createElement(Datagrid, null,
        React.createElement(TextField, { source: "id" }),
        React.createElement(TextField, { source: "title" }),
        React.createElement(DateField, { source: "released" })))); };
var ArtistList = function () { return (React.createElement(List, null,
    React.createElement(ArtistsDatagrid, null))); };
var types = {
    Rock: 'artists.rock',
    'Folk Rock': 'artists.rock.folk',
    'Pop Rock': 'artists.rock.pop',
    Jazz: 'artists.jazz',
    RB: 'artists.jazz.rb',
};
var ArtistsDatagrid = function () {
    var _a = useAppLocationState(), setLocation = _a[1];
    var resourceLocation = useResourceAppLocation();
    var filterValues = useListContext().filterValues;
    useEffect(function () {
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
    return (React.createElement(Datagrid, null,
        React.createElement(TextField, { source: "id" }),
        React.createElement(TextField, { source: "name" })));
};
var MultiLevelMenuWithCategories = function () { return (React.createElement(IconMenu, null,
    React.createElement(IconMenu.Item, { name: "dashboard", to: "/", end: true, label: "Dashboard", icon: React.createElement(DashboardIcon, null) }),
    React.createElement(IconMenu.Item, { name: "songs", icon: React.createElement(MusicIcon, null), to: "/songs", label: "Songs" }),
    React.createElement(IconMenu.Item, { name: "artists", label: "Artists", icon: React.createElement(PeopleIcon, null) },
        React.createElement(CardContent, null,
            React.createElement(Typography, { variant: "h4", gutterBottom: true }, "All artists"),
            React.createElement(MenuItemList, null,
                React.createElement(MenuItemNode, { name: "artists", to: '/artists?filter={}', label: "All Artists" }),
                React.createElement(MenuItemNode, { name: "artists.rock", to: '/artists?filter={"type":"Rock"}', label: "Rock" },
                    React.createElement(MenuItemNode, { name: "artists.rock.pop", to: '/artists?filter={"type":"Pop Rock"}', label: "Pop Rock" }),
                    React.createElement(MenuItemNode, { name: "artists.rock.folk", to: '/artists?filter={"type":"Folk Rock"}', label: "Folk Rock" })),
                React.createElement(MenuItemNode, { name: "artists.jazz", to: '/artists?filter={"type":"Jazz"}', label: "Jazz" },
                    React.createElement(MenuItemNode, { name: "artists.jazz.rb", to: '/artists?filter={"type":"RB"}', label: "R&B" }))))),
    React.createElement(IconMenu.Item, { name: "rock_artists", label: "Rock Artists", icon: React.createElement(FlashIcon, null) },
        React.createElement(CardContent, null,
            React.createElement(Typography, { variant: "h4", gutterBottom: true }, "Rock artists"),
            React.createElement(MenuItemList, null,
                React.createElement(MenuItemNode, { name: "rock_artists.pop", to: '/artists?filter={"type":"Pop Rock"}', label: "Pop Rock", icon: React.createElement(FlashIcon, null) }),
                React.createElement(MenuItemNode, { name: "rock_artists.folk", to: '/artists?filter={"type":"Folk Rock"}', label: "Folk Rock", icon: React.createElement(FlashIcon, null) })))),
    React.createElement(IconMenu.Item, { sx: {
            marginTop: 'auto',
        }, name: "configuration", to: "/", label: "Configuration", icon: React.createElement(SettingsIcon, null) }))); };
var LayoutWithCategories = function (props) { return (React.createElement(AppLocationContext, null,
    React.createElement(Layout, __assign({}, props, { menu: MultiLevelMenuWithCategories })))); };
export var Basic = function () { return (React.createElement(Admin, { history: createMemoryHistory(), dataProvider: dataProvider, layout: LayoutWithCategories, dashboard: Dashboard, theme: theme },
    React.createElement(Resource, { name: "songs", list: SongList }),
    React.createElement(Resource, { name: "artists", list: ArtistList }))); };
export var DarkMode = function () {
    var darkTheme = merge({}, theme, {
        palette: {
            mode: 'dark',
            background: {
                default: '#121212',
                paper: '#121212',
            },
        },
    });
    return (React.createElement(Admin, { history: createMemoryHistory(), dataProvider: dataProvider, layout: LayoutWithCategories, dashboard: Dashboard, theme: darkTheme },
        React.createElement(Resource, { name: "songs", list: SongList }),
        React.createElement(Resource, { name: "artists", list: ArtistList })));
};
var LongMultiLevelMenuWithCategories = function () { return (React.createElement(IconMenu, null,
    React.createElement(IconMenu.Item, { name: "dashboard", to: "/", end: true, label: "Dashboard", icon: React.createElement(DashboardIcon, null) }),
    React.createElement(IconMenu.Item, { name: "songs", icon: React.createElement(MusicIcon, null), to: "/songs", label: "Songs" }),
    React.createElement(IconMenu.Item, { name: "artists", label: "Artists", icon: React.createElement(PeopleIcon, null) }),
    React.createElement(IconMenu.Item, { name: "rock_artists", label: "Rock Artists", icon: React.createElement(FlashIcon, null) }),
    React.createElement(IconMenu.Item, { name: "foo1", label: "Foo1", icon: React.createElement(MusicIcon, null), to: "/foo1" }),
    React.createElement(IconMenu.Item, { name: "foo2", label: "Foo2", icon: React.createElement(MusicIcon, null), to: "/foo2" }),
    React.createElement(IconMenu.Item, { name: "foo3", label: "Foo3", icon: React.createElement(MusicIcon, null), to: "/foo3" }),
    React.createElement(IconMenu.Item, { name: "foo4", label: "Foo4", icon: React.createElement(MusicIcon, null), to: "/foo4" }),
    React.createElement(IconMenu.Item, { name: "foo5", label: "Foo5", icon: React.createElement(MusicIcon, null), to: "/foo5" }),
    React.createElement(IconMenu.Item, { name: "foo6", label: "Foo6", icon: React.createElement(MusicIcon, null), to: "/foo6" }),
    React.createElement(IconMenu.Item, { name: "foo7", label: "Foo7", icon: React.createElement(MusicIcon, null), to: "/foo7" }),
    React.createElement(IconMenu.Item, { name: "foo8", label: "Foo8", icon: React.createElement(MusicIcon, null), to: "/foo8" }),
    React.createElement(IconMenu.Item, { name: "foo9", label: "Foo9", icon: React.createElement(MusicIcon, null), to: "/foo9" }),
    React.createElement(IconMenu.Item, { name: "foo10", label: "Foo10", icon: React.createElement(MusicIcon, null), to: "/foo10" }),
    React.createElement(IconMenu.Item, { name: "foo11", label: "Foo11", icon: React.createElement(MusicIcon, null), to: "/foo11" }),
    React.createElement(IconMenu.Item, { name: "foo12", label: "Foo12", icon: React.createElement(MusicIcon, null), to: "/foo12" }),
    React.createElement(IconMenu.Item, { name: "foo13", label: "Foo13", icon: React.createElement(MusicIcon, null), to: "/foo13" }),
    React.createElement(IconMenu.Item, { name: "foo14", label: "Foo14", icon: React.createElement(MusicIcon, null), to: "/foo14" }),
    React.createElement(IconMenu.Item, { name: "foo15", label: "Foo15", icon: React.createElement(MusicIcon, null), to: "/foo15" }),
    React.createElement(IconMenu.Item, { name: "foo16", label: "Foo16", icon: React.createElement(MusicIcon, null), to: "/foo16" }),
    React.createElement(IconMenu.Item, { name: "foo17", label: "Foo17", icon: React.createElement(MusicIcon, null), to: "/foo17" }),
    React.createElement(IconMenu.Item, { name: "foo18", label: "Foo18", icon: React.createElement(MusicIcon, null), to: "/foo18" }),
    React.createElement(IconMenu.Item, { name: "foo19", label: "Foo19", icon: React.createElement(MusicIcon, null), to: "/foo19" }),
    React.createElement(IconMenu.Item, { name: "foo10", label: "Foo10", icon: React.createElement(MusicIcon, null), to: "/foo10" }))); };
var LayoutWithLongMenuWithCategories = function (props) { return (React.createElement(AppLocationContext, null,
    React.createElement(Layout, __assign({}, props, { menu: LongMultiLevelMenuWithCategories })))); };
export var Long = function () {
    return (React.createElement(Admin, { history: createMemoryHistory(), dataProvider: dataProvider, layout: LayoutWithLongMenuWithCategories, dashboard: Dashboard, theme: theme },
        React.createElement(Resource, { name: "songs", list: SongList }),
        React.createElement(Resource, { name: "artists", list: ArtistList })));
};
