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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAccordionsWithErrors = exports.AccordionFormView = void 0;
var React = __importStar(require("react"));
var react_1 = require("react");
var get_1 = __importDefault(require("lodash/get"));
var react_admin_1 = require("react-admin");
var AccordionFormView = function (_a) {
    var _b = _a.autoClose, autoClose = _b === void 0 ? false : _b, children = _a.children, className = _a.className, resource = _a.resource, _c = _a.toolbar, toolbar = _c === void 0 ? DefaultToolbar : _c;
    var childrens = react_1.Children.toArray(children);
    var _d = React.useState(childrens.length > 0 ? childrens[0].props.label : ''), expanded = _d[0], setExpanded = _d[1];
    var handleChange = function (panel) {
        return function (event, isExpanded) {
            setExpanded(isExpanded ? panel : false);
        };
    };
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: className }, react_1.Children.map(children, function (accordion) {
            return React.isValidElement(accordion)
                ? React.cloneElement(accordion, {
                    autoClose: autoClose,
                    expanded: expanded === accordion.props.label,
                    onChange: handleChange(accordion.props.label),
                    resource: resource,
                })
                : null;
        })),
        toolbar));
};
exports.AccordionFormView = AccordionFormView;
var DefaultToolbar = React.createElement(react_admin_1.Toolbar, { sx: { backgroundColor: 'transparent' } });
var findAccordionsWithErrors = function (children, errors) {
    return react_1.Children.toArray(children).reduce(function (acc, child) {
        if (!(0, react_1.isValidElement)(child)) {
            return acc;
        }
        var inputs = react_1.Children.toArray(child.props.children);
        if (inputs.some(function (input) {
            return (0, react_1.isValidElement)(input) && (0, get_1.default)(errors, input.props.source);
        })) {
            return __spreadArray(__spreadArray([], acc, true), [child.props.label], false);
        }
        return acc;
    }, []);
};
exports.findAccordionsWithErrors = findAccordionsWithErrors;
