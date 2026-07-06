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
import { useState } from 'react';
import clsx from 'clsx';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslate } from 'react-admin';
import { useFormState } from 'react-hook-form';
import get from 'lodash/get';
import { Accordion as MuiAccordion, AccordionDetails as MuiAccordionDetails, AccordionSummary as MuiAccordionSummary, Typography, } from '@mui/material';
import { styled } from '@mui/material/styles';
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
export var AccordionSection = function (props) {
    var _a;
    var _b = props.Accordion, Accordion = _b === void 0 ? DefaultAccordion : _b, _c = props.AccordionDetails, AccordionDetails = _c === void 0 ? DefaultAccordionDetails : _c, _d = props.AccordionSummary, AccordionSummary = _d === void 0 ? DefaultAccordionSummary : _d, children = props.children, className = props.className, _e = props.defaultExpanded, defaultExpanded = _e === void 0 ? false : _e, _f = props.disabled, disabled = _f === void 0 ? false : _f, _g = props.fullWidth, fullWidth = _g === void 0 ? false : _g, label = props.label, secondary = props.secondary, square = props.square, TransitionComponent = props.TransitionComponent, TransitionProps = props.TransitionProps, 
    // injected by the parent
    resource = props.resource, rest = __rest(props, ["Accordion", "AccordionDetails", "AccordionSummary", "children", "className", "defaultExpanded", "disabled", "fullWidth", "label", "secondary", "square", "TransitionComponent", "TransitionProps", "resource"]);
    var _h = useState(defaultExpanded), expanded = _h[0], setExpanded = _h[1];
    var translate = useTranslate();
    var errors = useFormState().errors;
    var handleChange = function () {
        setExpanded(function (expanded) { return !expanded; });
    };
    var hasErrors = hasInputsWithError(children, errors);
    return (React.createElement(Accordion, __assign({}, rest, { expanded: expanded, onChange: handleChange, disabled: disabled, square: square, className: clsx(className, (_a = {},
            _a[AccordionSectionClasses.fullWidth] = fullWidth,
            _a)), TransitionComponent: TransitionComponent, TransitionProps: TransitionProps }),
        React.createElement(AccordionSummary, { expandIcon: React.createElement(ExpandMoreIcon, null), "aria-controls": "panel-".concat(label, "-content"), id: "panel-".concat(label, "-header"), className: AccordionSectionClasses.summary },
            React.createElement(Typography, { color: hasErrors ? 'error' : 'text.primary', className: AccordionSectionClasses.heading }, translate(label, { _: label })),
            React.createElement(Typography, { className: AccordionSectionClasses.secondaryHeading }, secondary && translate(secondary, { _: secondary }))),
        React.createElement(AccordionDetails, { className: AccordionSectionClasses.detail }, children)));
};
export var hasInputsWithError = function (children, errors) {
    return React.Children.toArray(children).some(function (input) { return React.isValidElement(input) && get(errors, input.props.source); });
};
var PREFIX = 'RaAccordionSection';
export var AccordionSectionClasses = {
    heading: "".concat(PREFIX, "-heading"),
    secondaryHeading: "".concat(PREFIX, "-secondaryHeading"),
    summary: "".concat(PREFIX, "-summary"),
    detail: "".concat(PREFIX, "-detail"),
    fullWidth: "".concat(PREFIX, "-fullWidth"),
};
var StyledAccordion = styled(MuiAccordion, {
    name: PREFIX,
    overridesResolver: function (props, styles) { return styles.root; },
})(function (_a) {
    var _b;
    var theme = _a.theme;
    return (_b = {},
        _b["& .".concat(AccordionSectionClasses.heading)] = {
            fontSize: theme.typography.pxToRem(15),
            flexBasis: '33.33%',
            flexShrink: 0,
        },
        _b["& .".concat(AccordionSectionClasses.secondaryHeading)] = {
            fontSize: theme.typography.pxToRem(15),
            color: theme.palette.text.secondary,
        },
        _b["& .".concat(AccordionSectionClasses.summary)] = {},
        _b["& .".concat(AccordionSectionClasses.detail)] = {
            display: 'block',
        },
        _b["&.".concat(AccordionSectionClasses.fullWidth)] = {
            width: '100%',
        },
        _b);
});
var DefaultAccordion = styled(StyledAccordion)(function (_a) {
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
var DefaultAccordionSummary = styled(MuiAccordionSummary)(function () { return ({
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
var DefaultAccordionDetails = styled(MuiAccordionDetails)(function (_a) {
    var theme = _a.theme;
    return ({
        root: {
            padding: theme.spacing(2),
        },
    });
});
export default AccordionSection;
