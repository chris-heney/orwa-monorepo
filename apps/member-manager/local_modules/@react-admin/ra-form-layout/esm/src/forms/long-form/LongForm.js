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
import { LongFormSection } from './LongFormSection';
import { LongFormView } from './LongFormView';
/**
 * Form layout for long forms.
 *
 * Renders a fixed table of contents and toolbar, as well as section headers.
 * Expects `<LongForm.Section>` as children, each having a label.
 *
 * @example
 * import { LongForm } from '@react-admin/ra-form-layout';
 *
 * const CustomerEdit = () => (
 *     <Edit component="div">
 *         <LongForm>
 *             <LongForm.Section label="Identity">
 *                 <Labeled label="id">
 *                     <TextField source="id" />
 *                 </Labeled>
 *                 <TextInput source="first_name" validate={required()} />
 *                 <TextInput source="last_name" validate={required()} />
 *                 <DateInput source="dob" label="born" validate={required()} />
 *                 <SelectInput source="sex" choices={sexChoices} />
 *             </LongForm.Section>
 *             <LongForm.Section label="Occupations">
 *                 <ArrayInput source="occupations" label="">
 *                     <SimpleFormIterator>
 *                         <TextInput source="name" validate={required()} />
 *                         <DateInput source="from" validate={required()} />
 *                         <DateInput source="to" />
 *                     </SimpleFormIterator>
 *                 </ArrayInput>
 *             </LongForm.Section>
 *             <LongForm.Section label="Preferences">
 *                 <SelectInput
 *                     source="language"
 *                     choices={languageChoices}
 *                     defaultValue="en"
 *                 />
 *                 <BooleanInput source="dark_theme" />
 *                 <BooleanInput source="accepts_emails_from_partners" />
 *             </LongForm.Section>
 *         </LongForm>
 *     </Edit>
 * );
 */
export var LongForm = function (props) {
    var context = props.context, criteriaMode = props.criteriaMode, defaultValues = props.defaultValues, delayError = props.delayError, formRootPathname = props.formRootPathname, id = props.id, mode = props.mode, noValidate = props.noValidate, onSubmit = props.onSubmit, record = props.record, resetOptions = props.resetOptions, resolver = props.resolver, reValidateMode = props.reValidateMode, shouldFocusError = props.shouldFocusError, shouldUnregister = props.shouldUnregister, shouldUseNativeValidation = props.shouldUseNativeValidation, validate = props.validate, warnWhenUnsavedChanges = props.warnWhenUnsavedChanges, rest = __rest(props, ["context", "criteriaMode", "defaultValues", "delayError", "formRootPathname", "id", "mode", "noValidate", "onSubmit", "record", "resetOptions", "resolver", "reValidateMode", "shouldFocusError", "shouldUnregister", "shouldUseNativeValidation", "validate", "warnWhenUnsavedChanges"]);
    return (React.createElement(Form, { context: context, criteriaMode: criteriaMode, defaultValues: defaultValues, delayError: delayError, formRootPathname: formRootPathname, id: id, mode: mode, noValidate: noValidate, onSubmit: onSubmit, record: record, resetOptions: resetOptions, resolver: resolver, reValidateMode: reValidateMode, shouldFocusError: shouldFocusError, shouldUnregister: shouldUnregister, shouldUseNativeValidation: shouldUseNativeValidation, validate: validate, warnWhenUnsavedChanges: warnWhenUnsavedChanges },
        React.createElement(LongFormView, __assign({}, rest))));
};
LongForm.Section = LongFormSection;
