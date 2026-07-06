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
import { Form } from 'react-admin';
import { AccordionFormView } from './AccordionFormView';
import { AccordionFormPanel } from './AccordionFormPanel';
/**
 * Form component rendering a list of <Accordion> components.
 *
 * Alternative to <SimpleForm>, to be used as child of <Create> or <Edit>.
 * Expects <AccordionFormPanel> elements as children.
 *
 * @param {boolean} autoClose If true, opening an accordion will close the others. Defaults to false.
 * @param {ReactElement} toolbar An alternative toolbar element (to customize form buttons)
 *
 * @example
 *
 * import { Edit, TextField, TextInput, DateInput, SelectInput, ArrayInput, SimpleFormIterator, BooleanInput } from 'react-admin';
 * import { AccordionForm } from '@react-admin/ra-form-layout';
 *
 * // don't forget the component="div" prop on the main component to disable the main Card
 * const CustomerEdit = () => (
 *     <Edit component="div">
 *         <AccordionForm>
 *             <AccordionForm.Panel label="Identity" defaultExpanded>
 *                 <TextField source="id" />
 *                 <TextInput source="first_name" validate={required()} />
 *                 <TextInput source="last_name" validate={required()} />
 *                 <DateInput source="dob" label="born" validate={required()} />
 *                 <SelectInput source="sex" choices={sexChoices} />
 *             </AccordionForm.Panel>
 *             <AccordionForm.Panel label="Occupations">
 *                 <ArrayInput source="occupations" label="">
 *                     <SimpleFormIterator>
 *                         <TextInput source="name" validate={required()} />
 *                         <DateInput source="from" validate={required()} />
 *                         <DateInput source="to" />
 *                     </SimpleFormIterator>
 *                 </ArrayInput>
 *             </AccordionForm.Panel>
 *             <AccordionForm.Panel label="Preferences">
 *                 <SelectInput
 *                     source="language"
 *                     choices={languageChoices}
 *                     defaultValue="en"
 *                 />
 *                 <BooleanInput source="dark_theme" />
 *                 <BooleanInput source="accepts_emails_from_partners" />
 *             </AccordionForm.Panel>
 *         </AccordionForm>
 *     </Edit>
 * );
 */
export var AccordionForm = function (props) {
    var context = props.context, criteriaMode = props.criteriaMode, defaultValues = props.defaultValues, delayError = props.delayError, formRootPathname = props.formRootPathname, id = props.id, mode = props.mode, noValidate = props.noValidate, onSubmit = props.onSubmit, record = props.record, resetOptions = props.resetOptions, resolver = props.resolver, reValidateMode = props.reValidateMode, shouldFocusError = props.shouldFocusError, shouldUnregister = props.shouldUnregister, shouldUseNativeValidation = props.shouldUseNativeValidation, validate = props.validate, warnWhenUnsavedChanges = props.warnWhenUnsavedChanges, rest = __rest(props, ["context", "criteriaMode", "defaultValues", "delayError", "formRootPathname", "id", "mode", "noValidate", "onSubmit", "record", "resetOptions", "resolver", "reValidateMode", "shouldFocusError", "shouldUnregister", "shouldUseNativeValidation", "validate", "warnWhenUnsavedChanges"]);
    return (React.createElement(Form, { context: context, criteriaMode: criteriaMode, defaultValues: defaultValues, delayError: delayError, formRootPathname: formRootPathname, id: id, mode: mode, noValidate: noValidate, onSubmit: onSubmit, record: record, resetOptions: resetOptions, resolver: resolver, reValidateMode: reValidateMode, shouldFocusError: shouldFocusError, shouldUnregister: shouldUnregister, shouldUseNativeValidation: shouldUseNativeValidation, validate: validate, warnWhenUnsavedChanges: warnWhenUnsavedChanges },
        React.createElement(AccordionFormView, __assign({}, rest))));
};
AccordionForm.Panel = AccordionFormPanel;
