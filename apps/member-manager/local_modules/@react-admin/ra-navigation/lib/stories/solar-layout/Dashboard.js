"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dashboard = void 0;
var src_1 = require("../../src");
var react_1 = __importDefault(require("react"));
var react_admin_1 = require("react-admin");
var Dashboard = function () {
    (0, src_1.useDefineAppLocation)(src_1.DASHBOARD);
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(react_admin_1.Title, { title: "ra.page.dashboard" }),
        react_1.default.createElement(react_admin_1.CardContentInner, null, "Welcome to the react-admin solar layout demo")));
};
exports.Dashboard = Dashboard;
exports.default = exports.Dashboard;
