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
import * as React from 'react';
import { useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Typography, } from '@mui/material';
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { FormGroupContextProvider, useFormGroup, useTranslate, } from 'react-admin';
import { useFormState } from 'react-hook-form';
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
export var AccordionFormPanel = function (props) {
    return (React.createElement(FormGroupContextProvider, { name: props.label },
        React.createElement(AccordionFormPanelView, __assign({}, props))));
};
var AccordionFormPanelView = function (props) {
    var children = props.children, _a = props.defaultExpanded, defaultExpanded = _a === void 0 ? false : _a, _b = props.disabled, disabled = _b === void 0 ? false : _b, label = props.label, secondary = props.secondary, square = props.square, 
    // injected by the parent
    _c = props.autoClose, 
    // injected by the parent
    autoClose = _c === void 0 ? false : _c, onChange = props.onChange, expanded = props.expanded;
    var _d = useState(defaultExpanded), innerExpanded = _d[0], setExpanded = _d[1];
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
    var translate = useTranslate();
    var formGroup = useFormGroup(label);
    var isSubmitted = useFormState().isSubmitted;
    var hasErrors = !formGroup.isValid && (formGroup.isTouched || isSubmitted);
    return (React.createElement(StyledAccordion, __assign({}, accordionParams, { disabled: disabled, square: square }),
        React.createElement(AccordionSummary, { expandIcon: React.createElement(ExpandMoreIcon, null), "aria-controls": "panel-".concat(label, "-content"), id: "panel-".concat(label, "-header") },
            React.createElement(Typography, { color: hasErrors ? 'error' : 'text.primary', className: AccordionFormPanelClasses.heading }, translate(label, { _: label })),
            React.createElement(Typography, { className: AccordionFormPanelClasses.secondaryHeading }, secondary && translate(secondary, { _: secondary }))),
        React.createElement(AccordionDetails, { className: AccordionFormPanelClasses.detail }, children)));
};
var PREFIX = 'RaAccordionFormPanel';
export var AccordionFormPanelClasses = {
    heading: "".concat(PREFIX, "-heading"),
    secondaryHeading: "".concat(PREFIX, "-secondaryHeading"),
    detail: "".concat(PREFIX, "-detail"),
};
var StyledAccordion = styled(Accordion, {
    name: PREFIX,
    overridesResolver: function (props, styles) { return styles.root; },
})(function (_a) {
    var _b;
    var theme = _a.theme;
    return (_b = {},
        _b["& .".concat(AccordionFormPanelClasses.heading)] = {
            fontSize: theme.typography.pxToRem(15),
            flexBasis: '33.33%',
            flexShrink: 0,
        },
        _b["& .".concat(AccordionFormPanelClasses.secondaryHeading)] = {
            fontSize: theme.typography.pxToRem(15),
            color: theme.palette.text.secondary,
        },
        _b["& .".concat(AccordionFormPanelClasses.detail)] = {
            alignItems: 'flex-start',
            display: 'flex',
            flexDirection: 'column',
        },
        _b);
});
