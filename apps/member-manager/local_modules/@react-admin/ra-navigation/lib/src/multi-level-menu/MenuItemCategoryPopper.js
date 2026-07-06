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
exports.MenuItemCategoryPopoverClasses = exports.MenuItemCategoryPopper = void 0;
var React = __importStar(require("react"));
var material_1 = require("@mui/material");
var Close_1 = __importDefault(require("@mui/icons-material/Close"));
var MenuItemNode_1 = require("./MenuItemNode");
var react_admin_1 = require("react-admin");
var MenuItemCategoryPopper = function (_a) {
    var children = _a.children, onClose = _a.onClose, props = __rest(_a, ["children", "onClose"]);
    var translate = (0, react_admin_1.useTranslate)();
    return (React.createElement(Root, __assign({}, props, { role: "presentation" }), function (_a) {
        var TransitionProps = _a.TransitionProps;
        return (React.createElement(material_1.ClickAwayListener, { onClickAway: onClose },
            React.createElement(material_1.Slide, __assign({}, TransitionProps, { direction: "right" }),
                React.createElement(material_1.Paper, null,
                    React.createElement(material_1.IconButton, { "aria-label": translate('ra.action.close'), className: exports.MenuItemCategoryPopoverClasses.closeButton, onClick: onClose },
                        React.createElement(Close_1.default, null)),
                    children))));
    }));
};
exports.MenuItemCategoryPopper = MenuItemCategoryPopper;
var PREFIX = 'RaMenuItemCategoryPopover';
exports.MenuItemCategoryPopoverClasses = {
    closeButton: "".concat(PREFIX, "-closeButton"),
};
var Root = (0, material_1.styled)(material_1.Popper, {
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
                _c["& .".concat(MenuItemNode_1.MenuItemClasses.link)] = {
                    color: theme.palette.mode === 'dark'
                        ? theme.palette.common.white
                        : theme.palette.common.black,
                },
                _c["& .".concat(MenuItemNode_1.MenuItemClasses.active)] = {
                    color: theme.palette.mode === 'dark'
                        ? theme.palette.common.white
                        : theme.palette.common.black,
                },
                _c["& .".concat(MenuItemNode_1.MenuItemClasses.icon)] = {
                    color: theme.palette.mode === 'dark'
                        ? theme.palette.common.white
                        : theme.palette.common.black,
                },
                _c["& .".concat(MenuItemNode_1.MenuItemClasses.button)] = {
                    color: theme.palette.mode === 'dark'
                        ? theme.palette.common.white
                        : theme.palette.common.black,
                },
                _c)
        },
        _b["& .".concat(exports.MenuItemCategoryPopoverClasses.closeButton)] = {
            position: 'absolute',
            right: theme.spacing(1),
            top: theme.spacing(1),
        },
        _b);
});
