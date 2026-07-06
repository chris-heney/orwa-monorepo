import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ResourceDefinitionContextProvider } from 'react-admin';
import { AppLocationContext, useDefineAppLocation } from '../app-location';
import { HorizontalMenu } from './HorizontalMenu';
export default {
    title: 'ra-navigation/HorizontalMenu',
};
var Wrapper = function (_a) {
    var children = _a.children;
    return (React.createElement(MemoryRouter, null,
        React.createElement(QueryClientProvider, { client: new QueryClient() },
            React.createElement(AppLocationContext, null, children))));
};
export var Basic = function () { return (React.createElement(Wrapper, null,
    React.createElement(HorizontalMenu, null,
        React.createElement(HorizontalMenu.Item, { label: "Dashboard", to: "/", value: "" }),
        React.createElement(HorizontalMenu.Item, { label: "Songs", to: "/songs", value: "songs" }),
        React.createElement(HorizontalMenu.Item, { label: "Artists", to: "/artists", value: "artists" })))); };
var CustomPage = function () {
    useDefineAppLocation('custom');
    return React.createElement("h1", null, "Custom page");
};
export var DetectLocation = function () { return (React.createElement(Wrapper, null,
    React.createElement(HorizontalMenu, null,
        React.createElement(HorizontalMenu.Item, { label: "Dashboard", to: "/", value: "" }),
        React.createElement(HorizontalMenu.Item, { label: "Custom", to: "/foo", value: "custom" })),
    React.createElement(CustomPage, null))); };
export var FromResources = function () { return (React.createElement(ResourceDefinitionContextProvider, { definitions: {
        posts: { name: 'posts', hasList: true },
        comments: { name: 'comments', hasList: true },
        tags: { name: 'tags' },
    } },
    React.createElement(Wrapper, null,
        React.createElement(HorizontalMenu, { hasDashboard: true })))); };
