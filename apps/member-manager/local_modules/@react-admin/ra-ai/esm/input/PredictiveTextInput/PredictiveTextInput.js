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
import { useInput, FieldTitle, InputHelperText, sanitizeInputRestProps, } from 'react-admin';
import clsx from 'clsx';
import { TextFieldWithCompletion } from './TextFieldWithCompletion';
import { usePredictiveTextInputController } from './usePredictiveTextInputController';
/**
 * An alternative to `<TextInput>` that suggests completion for the input value.
 *
 * Users can accept the completion by pressing the `Tab` key. It's like Intellisense or Copilot for your forms.
 *
 * @example
 * import { Edit, SimpleForm, TextInput } from 'react-admin';
 * import { PredictiveTextInput } from '@react-admin/ra-ai';
 *
 * const PersonEdit = () => (
 *     <Edit>
 *         <SimpleForm>
 *             <TextInput source="firstName" />
 *             <TextInput source="lastName" />
 *             <TextInput source="company" />
 *             <PredictiveTextInput source="email" />
 *             <PredictiveTextInput source="website" />
 *             <PredictiveTextInput source="bio" multiline />
 *         </SimpleForm>
 *     </Edit>
 * );
 */
export var PredictiveTextInput = function (props) {
    var className = props.className, debounce = props.debounce, defaultValue = props.defaultValue, label = props.label, locale = props.locale, format = props.format, helperText = props.helperText, maxSize = props.maxSize, meta = props.meta, onFocus = props.onFocus, onBlur = props.onBlur, onChange = props.onChange, parse = props.parse, promptGenerator = props.promptGenerator, queryOptions = props.queryOptions, resource = props.resource, source = props.source, stop = props.stop, temperature = props.temperature, validate = props.validate, rest = __rest(props, ["className", "debounce", "defaultValue", "label", "locale", "format", "helperText", "maxSize", "meta", "onFocus", "onBlur", "onChange", "parse", "promptGenerator", "queryOptions", "resource", "source", "stop", "temperature", "validate"]);
    if (props.resettable) {
        throw new Error('PredictiveTextInput does not support resettable yet');
    }
    var _a = useInput(__assign({ defaultValue: defaultValue, format: format, parse: parse, resource: resource, source: source, type: 'text', validate: validate, onBlur: onBlur, onChange: onChange }, rest)), field = _a.field, _b = _a.fieldState, error = _b.error, invalid = _b.invalid, isTouched = _b.isTouched, isSubmitted = _a.formState.isSubmitted, id = _a.id, isRequired = _a.isRequired;
    var _c = usePredictiveTextInputController({
        field: field,
        locale: locale,
        promptGenerator: promptGenerator,
        debounce: debounce,
        maxSize: maxSize,
        meta: meta,
        stop: stop,
        temperature: temperature,
        queryOptions: queryOptions,
    }), completion = _c.completion, handleFocus = _c.handleFocus, handleBlur = _c.handleBlur, handleKeyDown = _c.handleKeyDown;
    return (React.createElement(TextFieldWithCompletion, __assign({ id: id }, field, { className: clsx('ra-input', "ra-input-".concat(source), className), label: label !== '' && label !== false ? (React.createElement(FieldTitle, { label: label, source: source, resource: resource, isRequired: isRequired })) : null, error: (isTouched || isSubmitted) && invalid, helperText: React.createElement(InputHelperText, { touched: isTouched || isSubmitted, error: error === null || error === void 0 ? void 0 : error.message, helperText: helperText }) }, sanitizeInputRestProps(rest), { completion: completion, onFocus: handleFocus, onBlur: handleBlur, onKeyDown: handleKeyDown })));
};
