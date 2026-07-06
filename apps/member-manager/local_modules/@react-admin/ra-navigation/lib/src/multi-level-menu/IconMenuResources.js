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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IconMenuResources = void 0;
var React = __importStar(require("react"));
var prop_types_1 = __importDefault(require("prop-types"));
var inflection_1 = __importDefault(require("inflection"));
var Dashboard_1 = __importDefault(require("@mui/icons-material/Dashboard"));
var ViewList_1 = __importDefault(require("@mui/icons-material/ViewList"));
var react_admin_1 = require("react-admin");
var IconMenu_1 = require("./IconMenu");
var IconMenuResources = function (_a) {
    var hasDashboard = _a.hasDashboard, props = __rest(_a, ["hasDashboard"]);
    var translate = (0, react_admin_1.useTranslate)();
    var resources = (0, react_admin_1.useResourceDefinitions)();
    return (React.createElement(IconMenu_1.IconMenu, __assign({}, props),
        hasDashboard && (React.createElement(IconMenu_1.IconMenu.Item, { name: "dashboard", to: "/", end: true, label: "Dashboard", icon: React.createElement(Dashboard_1.default, null) })),
        Object.values(resources)
            .filter(function (r) { return r.hasList; })
            .map(function (resource) { return (React.createElement(IconMenu_1.IconMenu.Item, { key: resource.name, name: resource.name, to: "/".concat(resource.name), label: translatedResourceName(resource, translate), icon: resource.icon ? React.createElement(resource.icon, null) : React.createElement(ViewList_1.default, null) })); })));
};
exports.IconMenuResources = IconMenuResources;
exports.IconMenuResources.propTypes = {
    hasDashboard: prop_types_1.default.bool,
};
var translatedResourceName = function (resource, translate) {
    return translate("resources.".concat(resource.name, ".name"), {
        smart_count: 2,
        _: resource.options && resource.options.label
            ? translate(resource.options.label, {
                smart_count: 2,
                _: resource.options.label,
            })
            : inflection_1.default.humanize(inflection_1.default.pluralize(resource.name)),
    });
};
