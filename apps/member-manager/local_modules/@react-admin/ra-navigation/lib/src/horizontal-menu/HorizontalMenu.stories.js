"use strict";
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
exports.FromResources = exports.DetectLocation = exports.Basic = void 0;
var React = __importStar(require("react"));
var react_router_dom_1 = require("react-router-dom");
var react_query_1 = require("react-query");
var react_admin_1 = require("react-admin");
var app_location_1 = require("../app-location");
var HorizontalMenu_1 = require("./HorizontalMenu");
exports.default = {
    title: 'ra-navigation/HorizontalMenu',
};
var Wrapper = function (_a) {
    var children = _a.children;
    return (React.createElement(react_router_dom_1.MemoryRouter, null,
        React.createElement(react_query_1.QueryClientProvider, { client: new react_query_1.QueryClient() },
            React.createElement(app_location_1.AppLocationContext, null, children))));
};
var Basic = function () { return (React.createElement(Wrapper, null,
    React.createElement(HorizontalMenu_1.HorizontalMenu, null,
        React.createElement(HorizontalMenu_1.HorizontalMenu.Item, { label: "Dashboard", to: "/", value: "" }),
        React.createElement(HorizontalMenu_1.HorizontalMenu.Item, { label: "Songs", to: "/songs", value: "songs" }),
        React.createElement(HorizontalMenu_1.HorizontalMenu.Item, { label: "Artists", to: "/artists", value: "artists" })))); };
exports.Basic = Basic;
var CustomPage = function () {
    (0, app_location_1.useDefineAppLocation)('custom');
    return React.createElement("h1", null, "Custom page");
};
var DetectLocation = function () { return (React.createElement(Wrapper, null,
    React.createElement(HorizontalMenu_1.HorizontalMenu, null,
        React.createElement(HorizontalMenu_1.HorizontalMenu.Item, { label: "Dashboard", to: "/", value: "" }),
        React.createElement(HorizontalMenu_1.HorizontalMenu.Item, { label: "Custom", to: "/foo", value: "custom" })),
    React.createElement(CustomPage, null))); };
exports.DetectLocation = DetectLocation;
var FromResources = function () { return (React.createElement(react_admin_1.ResourceDefinitionContextProvider, { definitions: {
        posts: { name: 'posts', hasList: true },
        comments: { name: 'comments', hasList: true },
        tags: { name: 'tags' },
    } },
    React.createElement(Wrapper, null,
        React.createElement(HorizontalMenu_1.HorizontalMenu, { hasDashboard: true })))); };
exports.FromResources = FromResources;
