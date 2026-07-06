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
exports.AccordionFormPanelClasses = exports.AccordionFormPanel = void 0;
var React = __importStar(require("react"));
var react_1 = require("react");
var material_1 = require("@mui/material");
var styles_1 = require("@mui/material/styles");
var ExpandMore_1 = __importDefault(require("@mui/icons-material/ExpandMore"));
var react_admin_1 = require("react-admin");
var react_hook_form_1 = require("react-hook-form");
/**
 * Renders children (Inputs) inside a MUI <Accordion> element.
 *
 * To be used as child of an <AccordionForm> element.
 *
 * @param {string} label The main label used as the accordion summary. Appears in red when the accordion has errors
 * @param {string} secondary Optional. The secondary label used as the accordion summary
 * @param {boolean} defaultExpanded Optional. Set to true to have the accordion expanded by default (except if autoClose = true on the parent)
 * @param {boolean} disabled Optional. If true, the accordion will be displayed in a disabled state.
 * @param {boolean} square Optional. If true, rounded corners are disabled.
 *
 * @example
 *
 * import { Edit, TextField, TextInput, DateInput, SelectInput, ArrayInput, SimpleFormIterator, BooleanInput } from 'react-admin';
 * import { AccordionForm, AccordionFormPanel } from '@react-admin/ra-form-layout';
 *
 * // don't forget the component="div" prop on the main component to disable the main Card
 * const CustomerEdit = () => (
 *     <Edit component="div">
 *         <AccordionForm>
 *             <AccordionFormPanel label="Identity" defaultExpanded>
 *                 <TextField source="id" />
 *                 <TextInput source="first_name" validate={required()} />
 *                 <TextInput source="last_name" validate={required()} />
 *                 <DateInput source="dob" label="born" validate={required()} />
 *                 <SelectInput source="sex" choices={sexChoices} />
 *             </AccordionFormPanel>
 *             <AccordionFormPanel label="Occupations">
 *                 <ArrayInput source="occupations" label="">
 *                     <SimpleFormIterator>
 *                         <TextInput source="name" validate={required()} />
 *                         <DateInput source="from" validate={required()} />
 *                         <DateInput source="to" />
 *                     </SimpleFormIterator>
 *                 </ArrayInput>
 *             </AccordionFormPanel>
 *             <AccordionFormPanel label="Preferences">
 *                 <SelectInput
 *                     source="language"
 *                     choices={languageChoices}
 *                     defaultValue="en"
 *                 />
 *                 <BooleanInput source="dark_theme" />
 *                 <BooleanInput source="accepts_emails_from_partners" />
 *             </AccordionFormPanel>
 *         </AccordionForm>
 *     </Edit>
 * );
 */
var AccordionFormPanel = function (props) {
    return (React.createElement(react_admin_1.FormGroupContextProvider, { name: props.label },
        React.createElement(AccordionFormPanelView, __assign({}, props))));
};
exports.AccordionFormPanel = AccordionFormPanel;
var AccordionFormPanelView = function (props) {
    var children = props.children, _a = props.defaultExpanded, defaultExpanded = _a === void 0 ? false : _a, _b = props.disabled, disabled = _b === void 0 ? false : _b, label = props.label, secondary = props.secondary, square = props.square, 
    // injected by the parent
    _c = props.autoClose, 
    // injected by the parent
    autoClose = _c === void 0 ? false : _c, onChange = props.onChange, expanded = props.expanded;
    var _d = (0, react_1.useState)(defaultExpanded), innerExpanded = _d[0], setExpanded = _d[1];
    var handleChange = function () {
        setExpanded(function (expanded) { return !expanded; });
    };
    var accordionParams = autoClose
        ? {
            expanded: expanded,
            onChange: onChange,
        }
        : {
            expanded: innerExpanded,
            onChange: handleChange,
        };
    var translate = (0, react_admin_1.useTranslate)();
    var formGroup = (0, react_admin_1.useFormGroup)(label);
    var isSubmitted = (0, react_hook_form_1.useFormState)().isSubmitted;
    var hasErrors = !formGroup.isValid && (formGroup.isTouched || isSubmitted);
    return (React.createElement(StyledAccordion, __assign({}, accordionParams, { disabled: disabled, square: square }),
        React.createElement(material_1.AccordionSummary, { expandIcon: React.createElement(ExpandMore_1.default, null), "aria-controls": "panel-".concat(label, "-content"), id: "panel-".concat(label, "-header") },
            React.createElement(material_1.Typography, { color: hasErrors ? 'error' : 'text.primary', className: exports.AccordionFormPanelClasses.heading }, translate(label, { _: label })),
            React.createElement(material_1.Typography, { className: exports.AccordionFormPanelClasses.secondaryHeading }, secondary && translate(secondary, { _: secondary }))),
        React.createElement(material_1.AccordionDetails, { className: exports.AccordionFormPanelClasses.detail }, children)));
};
var PREFIX = 'RaAccordionFormPanel';
exports.AccordionFormPanelClasses = {
    heading: "".concat(PREFIX, "-heading"),
    secondaryHeading: "".concat(PREFIX, "-secondaryHeading"),
    detail: "".concat(PREFIX, "-detail"),
};
var StyledAccordion = (0, styles_1.styled)(material_1.Accordion, {
    name: PREFIX,
    overridesResolver: function (props, styles) { return styles.root; },
})(function (_a) {
    var _b;
    var theme = _a.theme;
    return (_b = {},
        _b["& .".concat(exports.AccordionFormPanelClasses.heading)] = {
            fontSize: theme.typography.pxToRem(15),
            flexBasis: '33.33%',
            flexShrink: 0,
        },
        _b["& .".concat(exports.AccordionFormPanelClasses.secondaryHeading)] = {
            fontSize: theme.typography.pxToRem(15),
            color: theme.palette.text.secondary,
        },
        _b["& .".concat(exports.AccordionFormPanelClasses.detail)] = {
            alignItems: 'flex-start',
            display: 'flex',
            flexDirection: 'column',
        },
        _b);
});
