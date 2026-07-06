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
import * as React from 'react';
import { useCallback, useEffect, useRef, useState, } from 'react';
import { styled } from '@mui/material';
import { MultiLevelMenuContext } from './MultiLevelMenuContext';
import { MenuItemList } from './MenuItemList';
export var MenuRoot = function (props) {
    var children = props.children, _a = props.initialOpen, initialOpen = _a === void 0 ? false : _a, _b = props.openItemList, openItemList = _b === void 0 ? [] : _b, _c = props.variant, variant = _c === void 0 ? 'default' : _c, rest = __rest(props, ["children", "initialOpen", "openItemList", "variant"]);
    var openedItems = useRef([]);
    var _d = useState(true), isFirstLoad = _d[0], setIsFirstLoad = _d[1];
    var rootRef = useRef();
    var openingListeners = useRef([]);
    var onOpen = function (callback) {
        openingListeners.current.push(callback);
    };
    var offOpen = function (callback) {
        openingListeners.current = openingListeners.current.filter(function (l) { return l !== callback; });
    };
    var isOpen = useCallback(function (name) { return Array.from(openedItems.current).includes(name); }, []);
    var close = useCallback(function (name) {
        openedItems.current = openedItems.current.filter(function (item) { return item !== name; });
    }, []);
    var open = useCallback(function (name) {
        var set = new Set(openedItems.current);
        set.add(name);
        openedItems.current = Array.from(set);
        openingListeners.current.forEach(function (callback) { return callback(name); });
    }, []);
    var setIsOpen = useCallback(function (name, isOpen) {
        if (isOpen) {
            return open(name);
        }
        close(name);
    }, [open, close]);
    var toggle = useCallback(function (name) {
        setIsOpen(name, !isOpen);
    }, [setIsOpen, isOpen]);
    var _e = useState(false), hasCategories = _e[0], setHasCategories = _e[1];
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
    useEffect(function () {
        setTimeout(function () { return setIsFirstLoad(false); }, 150);
    }, []);
    return (React.createElement(Root, __assign({ ref: rootRef }, rest),
        React.createElement(MultiLevelMenuContext.Provider, { value: context },
            React.createElement("nav", { className: variant === 'categories'
                    ? MultiLevelMenuClasses.navWithCategories
                    : MultiLevelMenuClasses.nav },
                React.createElement(MenuItemList, { className: MultiLevelMenuClasses.list }, children)))));
};
var PREFIX = 'RaMenuRoot';
export var MultiLevelMenuClasses = {
    nav: "".concat(PREFIX, "-nav"),
    navWithCategories: "".concat(PREFIX, "-navWithCategories"),
    list: "".concat(PREFIX, "-list"),
};
var Root = styled('div', {
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
        _b["& .".concat(MultiLevelMenuClasses.navWithCategories)] = {
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            zIndex: theme.zIndex.appBar - 1, // Display the menu categories under the AppBar
        },
        _b["& .".concat(MultiLevelMenuClasses.nav)] = {
            display: 'flex',
            flexDirection: 'column',
            paddingTop: theme.spacing(1),
        },
        _b["& .".concat(MultiLevelMenuClasses.list)] = {},
        _b);
});
