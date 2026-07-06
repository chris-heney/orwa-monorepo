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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StackedFiltersActionsClasses = exports.StackedFiltersFormActions = void 0;
var React = __importStar(require("react"));
var react_1 = require("react");
var react_admin_1 = require("react-admin");
var material_1 = require("@mui/material");
var Add_1 = __importDefault(require("@mui/icons-material/Add"));
var ClearAll_1 = __importDefault(require("@mui/icons-material/ClearAll"));
var Filter_1 = __importDefault(require("@mui/icons-material/Filter"));
var clsx_1 = __importDefault(require("clsx"));
var react_hook_form_1 = require("react-hook-form");
var getListFiltersFromFormValues_1 = require("./getListFiltersFromFormValues");
var StackedFiltersFormActions = function (props) {
    var className = props.className, onFiltersApplied = props.onFiltersApplied, sx = props.sx;
    var _a = (0, react_admin_1.useListContext)(), filterValues = _a.filterValues, setFilters = _a.setFilters;
    var translate = (0, react_admin_1.useTranslate)();
    var add = (0, react_admin_1.useSimpleFormIterator)().add;
    var remove = (0, react_admin_1.useArrayInput)().remove;
    var _b = (0, react_hook_form_1.useFormContext)(), getFieldState = _b.getFieldState, getValues = _b.getValues;
    var filterFieldState = getFieldState('filters');
    var hadFilters = (0, react_1.useRef)(false);
    var disableApply = (0, react_1.useMemo)(function () {
        var filters = (0, getListFiltersFromFormValues_1.getListFiltersFromFormValues)(getValues().filters);
        var hasFilters = Object.keys(filters).length > 0;
        var isDirty = filterFieldState.isDirty;
        // If users remove the last filter, the form is not dirty and the field might not be dirty as well
        // so we need to check whether the form had filters before and still enable the apply button in this case
        var disableApply = !isDirty && (!hasFilters || !hadFilters.current);
        hadFilters.current = hasFilters;
        return disableApply;
    }, [filterFieldState, getValues]);
    var addFilter = (0, react_1.useCallback)(function () {
        add();
    }, [add]);
    var handleClearFilters = (0, react_1.useCallback)(function () {
        // calling the replace method would probably be better
        // but it doesn't work for some reason
        // See https://react-hook-form.com/docs/usefieldarray
        remove(); // Clear the filter ArrayInput
        add(); // Add en empty filter so that the form is not empty
        setFilters({}, {}, false); // Clear the list filters
        if (onFiltersApplied && typeof onFiltersApplied === 'function') {
            onFiltersApplied();
        }
    }, [add, onFiltersApplied, remove, setFilters]);
    return (React.createElement(Root, { className: (0, clsx_1.default)(exports.StackedFiltersActionsClasses.root, className), gap: 1, flexDirection: "row", justifyContent: "space-between", sx: sx },
        React.createElement(material_1.Button, { className: exports.StackedFiltersActionsClasses.addFilterButton, disableElevation: true, onClick: addFilter, startIcon: React.createElement(Add_1.default, null), size: "small" }, translate('ra.action.add_filter', {
            _: 'Add filter',
        })),
        React.createElement(material_1.Stack, { gap: 1, flexDirection: "row" },
            Object.keys(filterValues).length > 0 && (React.createElement(material_1.Button, { className: exports.StackedFiltersActionsClasses.removeFiltersButton, disableElevation: true, onClick: handleClearFilters, startIcon: React.createElement(ClearAll_1.default, null), size: "small" }, translate('ra-form-layout.filters.remove_all_filters', {
                _: 'Remove all filters',
            }))),
            React.createElement(material_1.Button, { className: exports.StackedFiltersActionsClasses.applyButton, disableElevation: true, type: "submit", startIcon: React.createElement(Filter_1.default, null), size: "small", disabled: disableApply }, translate('ra-form-layout.filters.apply_filters', {
                _: 'Apply',
            })))));
};
exports.StackedFiltersFormActions = StackedFiltersFormActions;
var PREFIX = 'RaStackedFiltersActions';
exports.StackedFiltersActionsClasses = {
    root: "".concat(PREFIX, "-root"),
    addFilterButton: "".concat(PREFIX, "-addFilterButton"),
    removeFiltersButton: "".concat(PREFIX, "-removeFiltersButton"),
    applyButton: "".concat(PREFIX, "-applyButton"),
};
var Root = (0, material_1.styled)(material_1.Stack, {
    name: PREFIX,
    overridesResolver: function (props, styles) { return styles.root; },
})(function () { return ({}); });
