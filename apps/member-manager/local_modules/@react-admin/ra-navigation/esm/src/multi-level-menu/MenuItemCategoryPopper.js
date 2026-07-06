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
import { ClickAwayListener, IconButton, Paper, Popper, Slide, styled, } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { MenuItemClasses } from './MenuItemNode';
import { useTranslate } from 'react-admin';
export var MenuItemCategoryPopper = function (_a) {
    var children = _a.children, onClose = _a.onClose, props = __rest(_a, ["children", "onClose"]);
    var translate = useTranslate();
    return (React.createElement(Root, __assign({}, props, { role: "presentation" }), function (_a) {
        var TransitionProps = _a.TransitionProps;
        return (React.createElement(ClickAwayListener, { onClickAway: onClose },
            React.createElement(Slide, __assign({}, TransitionProps, { direction: "right" }),
                React.createElement(Paper, null,
                    React.createElement(IconButton, { "aria-label": translate('ra.action.close'), className: MenuItemCategoryPopoverClasses.closeButton, onClick: onClose },
                        React.createElement(CloseIcon, null)),
                    children))));
    }));
};
var PREFIX = 'RaMenuItemCategoryPopover';
export var MenuItemCategoryPopoverClasses = {
    closeButton: "".concat(PREFIX, "-closeButton"),
};
var Root = styled(Popper, {
    name: PREFIX,
    overridesResolver: function (props, styles) { return styles.root; },
})(function (_a) {
    var _b, _c;
    var theme = _a.theme;
    return (_b = {
            '& .MuiPaper-root': (_c = {
                    backgroundColor: theme.palette.background.paper,
                    minWidth: 250,
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    paddingRight: theme.spacing(4)
                },
                _c["& .".concat(MenuItemClasses.link)] = {
                    color: theme.palette.mode === 'dark'
                        ? theme.palette.common.white
                        : theme.palette.common.black,
                },
                _c["& .".concat(MenuItemClasses.active)] = {
                    color: theme.palette.mode === 'dark'
                        ? theme.palette.common.white
                        : theme.palette.common.black,
                },
                _c["& .".concat(MenuItemClasses.icon)] = {
                    color: theme.palette.mode === 'dark'
                        ? theme.palette.common.white
                        : theme.palette.common.black,
                },
                _c["& .".concat(MenuItemClasses.button)] = {
                    color: theme.palette.mode === 'dark'
                        ? theme.palette.common.white
                        : theme.palette.common.black,
                },
                _c)
        },
        _b["& .".concat(MenuItemCategoryPopoverClasses.closeButton)] = {
            position: 'absolute',
            right: theme.spacing(1),
            top: theme.spacing(1),
        },
        _b);
});
