var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import * as React from 'react';
import { Children, isValidElement } from 'react';
import get from 'lodash/get';
import { Toolbar } from 'react-admin';
export var AccordionFormView = function (_a) {
    var _b = _a.autoClose, autoClose = _b === void 0 ? false : _b, children = _a.children, className = _a.className, resource = _a.resource, _c = _a.toolbar, toolbar = _c === void 0 ? DefaultToolbar : _c;
    var childrens = Children.toArray(children);
    var _d = React.useState(childrens.length > 0 ? childrens[0].props.label : ''), expanded = _d[0], setExpanded = _d[1];
    var handleChange = function (panel) {
        return function (event, isExpanded) {
            setExpanded(isExpanded ? panel : false);
        };
    };
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: className }, Children.map(children, function (accordion) {
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
var DefaultToolbar = React.createElement(Toolbar, { sx: { backgroundColor: 'transparent' } });
export var findAccordionsWithErrors = function (children, errors) {
    return Children.toArray(children).reduce(function (acc, child) {
        if (!isValidElement(child)) {
            return acc;
        }
        var inputs = Children.toArray(child.props.children);
        if (inputs.some(function (input) {
            return isValidElement(input) && get(errors, input.props.source);
        })) {
            return __spreadArray(__spreadArray([], acc, true), [child.props.label], false);
        }
        return acc;
    }, []);
};
