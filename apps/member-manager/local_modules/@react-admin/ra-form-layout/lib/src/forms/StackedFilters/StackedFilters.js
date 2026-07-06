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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StackedFiltersClasses = exports.StackedFilters = void 0;
var React = __importStar(require("react"));
var react_1 = require("react");
var react_admin_1 = require("react-admin");
var material_1 = require("@mui/material");
var FilterList_1 = __importDefault(require("@mui/icons-material/FilterList"));
var clsx_1 = __importDefault(require("clsx"));
var StackedFiltersForm_1 = require("./StackedFiltersForm");
/**
 * An alternative to the <Filter> component that add the concept of operator and displays the filters form in a popover.
 * @example
 * import { CreateButton,List, NumberInput, TopToolbar } from 'react-admin';
 * import { StackedFilters, FiltersConfig, textFilter, numberFilter, referenceFilter, booleanFilter } from '@react-admin/ra-form-layout';
 * import { MyNumberRangeInput } from './MyNumberRangeInput';
 *
 * const postListFilters: FiltersConfig = {
 *     title: textFilter(),
 *     views: numberFilter(),
 *     tag_ids: referenceFilter({ reference: 'tags' }),
 *     published: booleanFilter(),
 *     note: {
 *         operators: [
 *            { value: 'eq', label: 'Equals' },
 *            { value: 'neq', label: 'Not Equals' },
 *            { value: 'between', label: 'Between', input: ({ source }) => <MyNumberRangeInput source={source} /> },
 *         ],
 *         input: ({ source }) => <NumberInput source={source} />,
 *     }
 * };
 * const PostListToolbar = () => (
 *     <TopToolbar>
 *         <CreateButton />
 *         <StackedFilters config={postListFilters} />
 *     </TopToolbar>
 * );
 * const PostList = () => (
 *     <List actions={<PostListToolbar />}>
 *         ...
 *     </List>
 * );
 * @param props
 * @param props.config {FilterConfig} The filters configuration.
 * @returns A filter element for a <List>.
 */
var StackedFilters = function (props) {
    var BadgeProps = props.BadgeProps, ButtonProps = props.ButtonProps, className = props.className, config = props.config, PopoverProps = props.PopoverProps, StackedFiltersFormProps = props.StackedFiltersFormProps, sx = props.sx;
    var translate = (0, react_admin_1.useTranslate)();
    var filterValues = (0, react_admin_1.useListContext)().filterValues;
    var _a = (0, react_1.useState)(null), anchorEl = _a[0], setAnchorEl = _a[1];
    var handlePopoverClose = (0, react_1.useCallback)(function () {
        setAnchorEl(null);
    }, [setAnchorEl]);
    var handlePopoverOpen = (0, react_1.useCallback)(function (event) {
        setAnchorEl(event.currentTarget);
    }, [setAnchorEl]);
    return (React.createElement(Root, { className: (0, clsx_1.default)(exports.StackedFiltersClasses.root, className), sx: sx },
        React.createElement(material_1.Badge, __assign({ badgeContent: Object.keys(filterValues).length, color: "secondary", id: "filters-badge" }, BadgeProps),
            React.createElement(react_admin_1.Button, __assign({ onClick: handlePopoverOpen, size: "small", label: translate('ra-form-layout.filters.filters_button_label', {
                    _: 'Filters',
                }), "aria-describedby": "filters-badge" }, ButtonProps),
                React.createElement(FilterList_1.default, null))),
        React.createElement(material_1.Popover, __assign({ open: Boolean(anchorEl), anchorEl: anchorEl, onClose: handlePopoverClose, anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'right',
            } }, PopoverProps),
            React.createElement(material_1.Box, { className: exports.StackedFiltersClasses.formContainer, minWidth: function (theme) { return theme.breakpoints.values.sm; }, p: 1 },
                React.createElement(StackedFiltersForm_1.StackedFiltersForm, __assign({ config: config, onFiltersApplied: handlePopoverClose }, StackedFiltersFormProps))))));
};
exports.StackedFilters = StackedFilters;
var PREFIX = 'RaStackedFilters';
exports.StackedFiltersClasses = {
    root: "".concat(PREFIX, "-root"),
    popover: "".concat(PREFIX, "-popover"),
    formContainer: "".concat(PREFIX, "-form-container"),
};
var Root = (0, material_1.styled)('div', {
    name: PREFIX,
    overridesResolver: function (props, styles) { return styles.root; },
})(function () { return ({}); });
