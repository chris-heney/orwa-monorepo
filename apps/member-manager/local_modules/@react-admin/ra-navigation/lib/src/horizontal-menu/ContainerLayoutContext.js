"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useContainerLayout = exports.ContainerLayoutContext = void 0;
var react_1 = require("react");
var defaults_1 = __importDefault(require("lodash/defaults"));
exports.ContainerLayoutContext = (0, react_1.createContext)({});
var useContainerLayout = function (props) {
    var context = (0, react_1.useContext)(exports.ContainerLayoutContext);
    return (0, defaults_1.default)({}, props != null ? extractContainerLayoutProps(props) : {}, context);
};
exports.useContainerLayout = useContainerLayout;
var extractContainerLayoutProps = function (_a) {
    var hasDashboard = _a.hasDashboard, menu = _a.menu, title = _a.title, toolbar = _a.toolbar, userMenu = _a.userMenu;
    return ({
        hasDashboard: hasDashboard,
        menu: menu,
        title: title,
        toolbar: toolbar,
        userMenu: userMenu,
    });
};
