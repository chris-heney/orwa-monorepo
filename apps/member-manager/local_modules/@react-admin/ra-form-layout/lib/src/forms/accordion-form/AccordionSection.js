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
exports.AccordionSectionClasses = exports.hasInputsWithError = exports.AccordionSection = void 0;
var React = __importStar(require("react"));
var react_1 = require("react");
var clsx_1 = __importDefault(require("clsx"));
var ExpandMore_1 = __importDefault(require("@mui/icons-material/ExpandMore"));
var react_admin_1 = require("react-admin");
var react_hook_form_1 = require("react-hook-form");
var get_1 = __importDefault(require("lodash/get"));
var material_1 = require("@mui/material");
var styles_1 = require("@mui/material/styles");
/**
 * Renders children (Inputs) inside a MUI <Accordion> element without a Card style.
 *
 * To be used as child of a <SimpleForm> or a <TabbedForm> element.
 *
 * @param {string} label The main label used as the accordion summary. Appears in red when the accordion has errors
 * @param {string} secondary Optional. The secondary label used as the accordion summary
 * @param {boolean} fullWidth Optional. If true, the Accordion take the entire form width.
 * @param {string} className Optional. A class name to style the underlying <Accordion>.
 * @param {object} classes Optional. Override styles of the <Accordion>, the <AccordionSummary> and the <AccordionDetails> internal components.
 * @param {boolean} defaultExpanded Optional. Set to true to have the accordion expanded by default.
 * @param {boolean} disabled Optional. If true, the accordion will be displayed in a disabled state.
 * @param {boolean} square Optional. If true, rounded corners are disabled.
 * @param {ReactElement} TransitionComponent Optional. The MUI component used for the transition.
 * @param {object} TransitionProps Optional. If true, rounded corners are disabled.
 *
 * @example
 *
 * import { Edit, TextField, TextInput, DateInput, SelectInput, ArrayInput, SimpleForm, SimpleFormIterator, BooleanInput } from 'react-admin';
 * import { AccordionSection } from '@react-admin/ra-form-layout';
 *
 * const CustomerEdit = () => (
 *     <Edit component="div">
 *         <SimpleForm>
 *              <Labeled label="id">
 *                  <TextField source="id" />
 *             </Labeled>
 *             <TextInput source="first_name" validate={required()} />
 *             <TextInput source="last_name" validate={required()} />
 *             <DateInput source="dob" label="born" validate={required()} />
 *             <SelectInput source="sex" choices={sexChoices} />
 *             <AccordionSection label="Occupations">
 *                 <ArrayInput source="occupations" label="">
 *                     <SimpleFormIterator>
 *                         <TextInput source="name" validate={required()} />
 *                         <DateInput source="from" validate={required()} />
 *                         <DateInput source="to" />
 *                     </SimpleFormIterator>
 *                 </ArrayInput>
 *             </AccordionSection>
 *             <AccordionSection label="Preferences">
 *                 <SelectInput
 *                     source="language"
 *                     choices={languageChoices}
 *                     defaultValue="en"
 *                 />
 *                 <BooleanInput source="dark_theme" />
 *                 <BooleanInput source="accepts_emails_from_partners" />
 *             </AccordionSection>
 *         </SimpleFormForm>
 *     </Edit>
 * );
 *
 */
var AccordionSection = function (props) {
    var _a;
    var _b = props.Accordion, Accordion = _b === void 0 ? DefaultAccordion : _b, _c = props.AccordionDetails, AccordionDetails = _c === void 0 ? DefaultAccordionDetails : _c, _d = props.AccordionSummary, AccordionSummary = _d === void 0 ? DefaultAccordionSummary : _d, children = props.children, className = props.className, _e = props.defaultExpanded, defaultExpanded = _e === void 0 ? false : _e, _f = props.disabled, disabled = _f === void 0 ? false : _f, _g = props.fullWidth, fullWidth = _g === void 0 ? false : _g, label = props.label, secondary = props.secondary, square = props.square, TransitionComponent = props.TransitionComponent, TransitionProps = props.TransitionProps, 
    // injected by the parent
    resource = props.resource, rest = __rest(props, ["Accordion", "AccordionDetails", "AccordionSummary", "children", "className", "defaultExpanded", "disabled", "fullWidth", "label", "secondary", "square", "TransitionComponent", "TransitionProps", "resource"]);
    var _h = (0, react_1.useState)(defaultExpanded), expanded = _h[0], setExpanded = _h[1];
    var translate = (0, react_admin_1.useTranslate)();
    var errors = (0, react_hook_form_1.useFormState)().errors;
    var handleChange = function () {
        setExpanded(function (expanded) { return !expanded; });
    };
    var hasErrors = (0, exports.hasInputsWithError)(children, errors);
    return (React.createElement(Accordion, __assign({}, rest, { expanded: expanded, onChange: handleChange, disabled: disabled, square: square, className: (0, clsx_1.default)(className, (_a = {},
            _a[exports.AccordionSectionClasses.fullWidth] = fullWidth,
            _a)), TransitionComponent: TransitionComponent, TransitionProps: TransitionProps }),
        React.createElement(AccordionSummary, { expandIcon: React.createElement(ExpandMore_1.default, null), "aria-controls": "panel-".concat(label, "-content"), id: "panel-".concat(label, "-header"), className: exports.AccordionSectionClasses.summary },
            React.createElement(material_1.Typography, { color: hasErrors ? 'error' : 'text.primary', className: exports.AccordionSectionClasses.heading }, translate(label, { _: label })),
            React.createElement(material_1.Typography, { className: exports.AccordionSectionClasses.secondaryHeading }, secondary && translate(secondary, { _: secondary }))),
        React.createElement(AccordionDetails, { className: exports.AccordionSectionClasses.detail }, children)));
};
exports.AccordionSection = AccordionSection;
var hasInputsWithError = function (children, errors) {
    return React.Children.toArray(children).some(function (input) { return React.isValidElement(input) && (0, get_1.default)(errors, input.props.source); });
};
exports.hasInputsWithError = hasInputsWithError;
var PREFIX = 'RaAccordionSection';
exports.AccordionSectionClasses = {
    heading: "".concat(PREFIX, "-heading"),
    secondaryHeading: "".concat(PREFIX, "-secondaryHeading"),
    summary: "".concat(PREFIX, "-summary"),
    detail: "".concat(PREFIX, "-detail"),
    fullWidth: "".concat(PREFIX, "-fullWidth"),
};
var StyledAccordion = (0, styles_1.styled)(material_1.Accordion, {
    name: PREFIX,
    overridesResolver: function (props, styles) { return styles.root; },
})(function (_a) {
    var _b;
    var theme = _a.theme;
    return (_b = {},
        _b["& .".concat(exports.AccordionSectionClasses.heading)] = {
            fontSize: theme.typography.pxToRem(15),
            flexBasis: '33.33%',
            flexShrink: 0,
        },
        _b["& .".concat(exports.AccordionSectionClasses.secondaryHeading)] = {
            fontSize: theme.typography.pxToRem(15),
            color: theme.palette.text.secondary,
        },
        _b["& .".concat(exports.AccordionSectionClasses.summary)] = {},
        _b["& .".concat(exports.AccordionSectionClasses.detail)] = {
            display: 'block',
        },
        _b["&.".concat(exports.AccordionSectionClasses.fullWidth)] = {
            width: '100%',
        },
        _b);
});
var DefaultAccordion = (0, styles_1.styled)(StyledAccordion)(function (_a) {
    var theme = _a.theme;
    return ({
        width: theme.spacing(55),
        marginBottom: -1,
        border: '1px solid rgba(0, 0, 0, .125)',
        boxShadow: 'none',
        '&:last-child.Mui-expanded': {
            marginBottom: theme.spacing(2),
        },
        '&:before': {
            display: 'none',
        },
        expanded: {},
    });
});
var DefaultAccordionSummary = (0, styles_1.styled)(material_1.AccordionSummary)(function () { return ({
    backgroundColor: 'rgba(0, 0, 0, .03)',
    marginBottom: -1,
    '&.Mui-expanded': {
        backgroundColor: 'rgba(0, 0, 0, .05)',
        borderBottom: '1px solid rgba(0, 0, 0, .125)',
    },
    '&, &.Mui-expanded': {
        minHeight: 56,
        '.MuiAccordionSummary-content': {
            margin: 0,
        },
    },
    expanded: {},
}); });
var DefaultAccordionDetails = (0, styles_1.styled)(material_1.AccordionDetails)(function (_a) {
    var theme = _a.theme;
    return ({
        root: {
            padding: theme.spacing(2),
        },
    });
});
exports.default = exports.AccordionSection;
