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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultiLevelMenuClasses = exports.MenuRoot = void 0;
var React = __importStar(require("react"));
var react_1 = require("react");
var material_1 = require("@mui/material");
var MultiLevelMenuContext_1 = require("./MultiLevelMenuContext");
var MenuItemList_1 = require("./MenuItemList");
var MenuRoot = function (props) {
    var children = props.children, _a = props.initialOpen, initialOpen = _a === void 0 ? false : _a, _b = props.openItemList, openItemList = _b === void 0 ? [] : _b, _c = props.variant, variant = _c === void 0 ? 'default' : _c, rest = __rest(props, ["children", "initialOpen", "openItemList", "variant"]);
    var openedItems = (0, react_1.useRef)([]);
    var _d = (0, react_1.useState)(true), isFirstLoad = _d[0], setIsFirstLoad = _d[1];
    var rootRef = (0, react_1.useRef)();
    var openingListeners = (0, react_1.useRef)([]);
    var onOpen = function (callback) {
        openingListeners.current.push(callback);
    };
    var offOpen = function (callback) {
        openingListeners.current = openingListeners.current.filter(function (l) { return l !== callback; });
    };
    var isOpen = (0, react_1.useCallback)(function (name) { return Array.from(openedItems.current).includes(name); }, []);
    var close = (0, react_1.useCallback)(function (name) {
        openedItems.current = openedItems.current.filter(function (item) { return item !== name; });
    }, []);
    var open = (0, react_1.useCallback)(function (name) {
        var set = new Set(openedItems.current);
        set.add(name);
        openedItems.current = Array.from(set);
        openingListeners.current.forEach(function (callback) { return callback(name); });
    }, []);
    var setIsOpen = (0, react_1.useCallback)(function (name, isOpen) {
        if (isOpen) {
            return open(name);
        }
        close(name);
    }, [open, close]);
    var toggle = (0, react_1.useCallback)(function (name) {
        setIsOpen(name, !isOpen);
    }, [setIsOpen, isOpen]);
    var _e = (0, react_1.useState)(false), hasCategories = _e[0], setHasCategories = _e[1];
    var context = {
        close: close,
        hasCategories: hasCategories,
        initialOpen: initialOpen,
        openItemList: openItemList,
        isFirstLoad: isFirstLoad,
        isOpen: isOpen,
        offOpen: offOpen,
        onOpen: onOpen,
        open: open,
        rootRef: rootRef,
        setHasCategories: setHasCategories,
        setIsOpen: setIsOpen,
        toggle: toggle,
    };
    (0, react_1.useEffect)(function () {
        setTimeout(function () { return setIsFirstLoad(false); }, 150);
    }, []);
    return (React.createElement(Root, __assign({ ref: rootRef }, rest),
        React.createElement(MultiLevelMenuContext_1.MultiLevelMenuContext.Provider, { value: context },
            React.createElement("nav", { className: variant === 'categories'
                    ? exports.MultiLevelMenuClasses.navWithCategories
                    : exports.MultiLevelMenuClasses.nav },
                React.createElement(MenuItemList_1.MenuItemList, { className: exports.MultiLevelMenuClasses.list }, children)))));
};
exports.MenuRoot = MenuRoot;
var PREFIX = 'RaMenuRoot';
exports.MultiLevelMenuClasses = {
    nav: "".concat(PREFIX, "-nav"),
    navWithCategories: "".concat(PREFIX, "-navWithCategories"),
    list: "".concat(PREFIX, "-list"),
};
var Root = (0, material_1.styled)('div', {
    name: PREFIX,
    overridesResolver: function (props, styles) { return styles.root; },
})(function (_a) {
    var _b;
    var theme = _a.theme;
    return (_b = {
            display: 'flex',
            flexDirection: 'column',
            zIndex: theme.zIndex.appBar - 1,
            minHeight: '100%'
        },
        _b["& .".concat(exports.MultiLevelMenuClasses.navWithCategories)] = {
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            zIndex: theme.zIndex.appBar - 1, // Display the menu categories under the AppBar
        },
        _b["& .".concat(exports.MultiLevelMenuClasses.nav)] = {
            display: 'flex',
            flexDirection: 'column',
            paddingTop: theme.spacing(1),
        },
        _b["& .".concat(exports.MultiLevelMenuClasses.list)] = {},
        _b);
});
