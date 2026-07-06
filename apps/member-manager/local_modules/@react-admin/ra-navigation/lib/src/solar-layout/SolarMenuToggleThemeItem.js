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
exports.SolarMenuToggleThemeItemClasses = exports.SolarMenuToggleThemeItem = void 0;
var React = __importStar(require("react"));
var react_admin_1 = require("react-admin");
var material_1 = require("@mui/material");
var clsx_1 = __importDefault(require("clsx"));
var Brightness4_1 = __importDefault(require("@mui/icons-material/Brightness4"));
var Brightness7_1 = __importDefault(require("@mui/icons-material/Brightness7"));
var genericForwardRef_1 = require("./genericForwardRef");
/**
 * Button toggling the theme (light or dark).
 *
 * Enabled by default in the <AppBar> when the <Admin> component has a darkMode.
 *
 * @example
 * import { SolarMenu } from '@react-admin/navigation';
 *
 * const MyMenu = () => (
 *     <SolarMenu>
 *          <SolarMenu.ToggleThemeItem />
 *     </SolarMenu>
 * );
 */
var SolarMenuToggleThemeItemComponent = function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    var translate = (0, react_admin_1.useTranslate)();
    var _b = (0, react_admin_1.useThemesContext)(), darkTheme = _b.darkTheme, defaultTheme = _b.defaultTheme;
    var prefersDarkMode = (0, material_1.useMediaQuery)('(prefers-color-scheme: dark)', {
        noSsr: true,
    });
    var _c = (0, react_admin_1.useTheme)(defaultTheme || (prefersDarkMode && darkTheme ? 'dark' : 'light')), theme = _c[0], setTheme = _c[1];
    var handleClick = function () {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };
    var toggleThemeTitle = translate('ra.action.toggle_theme', {
        _: 'Toggle Theme',
    });
    return (React.createElement(Root, __assign({ component: "div", disablePadding: true, className: (0, clsx_1.default)(exports.SolarMenuToggleThemeItemClasses.root, className), secondaryAction: React.createElement("div", { className: exports.SolarMenuToggleThemeItemClasses.iconContainer }, theme === 'dark' ? (React.createElement(Brightness7_1.default, { className: exports.SolarMenuToggleThemeItemClasses.icon, sx: { ml: 'auto' } })) : (React.createElement(Brightness4_1.default, { className: exports.SolarMenuToggleThemeItemClasses.icon, sx: { ml: 'auto' } }))), 
        // @ts-ignore
        ref: ref }, props),
        React.createElement(material_1.ListItemButton, { className: exports.SolarMenuToggleThemeItemClasses.button, onClick: handleClick }, toggleThemeTitle)));
};
exports.SolarMenuToggleThemeItem = (0, genericForwardRef_1.genericForwardRef)(SolarMenuToggleThemeItemComponent);
var PREFIX = 'RaSolarMenuToggleThemeItem';
exports.SolarMenuToggleThemeItemClasses = {
    root: "".concat(PREFIX, "-root"),
    icon: "".concat(PREFIX, "-icon"),
    iconContainer: "".concat(PREFIX, "-iconContainer"),
    button: "".concat(PREFIX, "-button"),
};
var Root = (0, material_1.styled)(material_1.ListItem)(function (_a) {
    var _b;
    var theme = _a.theme;
    return (_b = {},
        _b["& .".concat(exports.SolarMenuToggleThemeItemClasses.iconContainer)] = {
            padding: theme.spacing(1),
            marginRight: "-12px",
        },
        _b["& .".concat(exports.SolarMenuToggleThemeItemClasses.icon)] = {
            color: theme.palette.text.secondary,
        },
        _b["& .".concat(exports.SolarMenuToggleThemeItemClasses.button)] = {},
        _b);
});
