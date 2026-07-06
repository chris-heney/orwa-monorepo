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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
import { Box, Stack, styled } from '@mui/material';
import omit from 'lodash/omit';
import React, { useCallback, useEffect } from 'react';
import { required, useSaveContext, useTranslate, } from 'react-admin';
import { useFormContext, useWatch } from 'react-hook-form';
import { WizardForm, WizardFormStep, useWizardFormContext, } from '../wizard-form';
import { InputSelector } from './InputSelector';
/**
 * This component renders a form allowing to select the fields to update in a record.
 *
 * `<InputSelectorForm>` expects a list of inputs passed in the `inputs` prop. Each input must have a `label` and an `element`.
 *
 * `<InputSelectorForm>` also expects to be used inside a [`<SaveContext>`](https://marmelab.com/react-admin/useSaveContext.html#usage).
 * When the form is submitted, it will call the `save` method from the `<SaveContext>`, with the value of the selected inputs.
 *
 * @example
 * ```tsx
 * import { InputSelectorForm } from '@react-admin/ra-form-layout';
 * import * as React from 'react';
 * import {
 *     BooleanInput,
 *     DateInput,
 *     SelectArrayInput,
 *     TextInput,
 * } from 'react-admin';
 *
 * const PostEdit = () => (
 *     <InputSelectorForm
 *         inputs={[
 *             {
 *                 label: 'Title',
 *                 element: <TextInput source="title" />,
 *             },
 *             {
 *                 label: 'Body',
 *                 element: <TextInput source="body" multiline />,
 *             },
 *             {
 *                 label: 'Published at',
 *                 element: <DateInput source="published_at" />,
 *             },
 *             {
 *                 label: 'Is public',
 *                 element: <BooleanInput source="is_public" />,
 *             },
 *             {
 *                 label: 'Tags',
 *                 element: (
 *                     <SelectArrayInput
 *                         source="tags"
 *                         choices={[
 *                             { id: 'react', name: 'React' },
 *                             { id: 'vue', name: 'Vue' },
 *                             { id: 'solid', name: 'Solid' },
 *                             { id: 'programming', name: 'Programming' },
 *                         ]}
 *                     />
 *                 ),
 *             },
 *         ]}
 *     />
 * );
 * ```
 */
export var InputSelectorForm = function (props) {
    var inputs = props.inputs, rest = __rest(props, ["inputs"]);
    var translate = useTranslate();
    var saveContext = useSaveContext();
    if (!(saveContext === null || saveContext === void 0 ? void 0 : saveContext.save) ||
        !(saveContext === null || saveContext === void 0 ? void 0 : saveContext.registerMutationMiddleware) ||
        !(saveContext === null || saveContext === void 0 ? void 0 : saveContext.unregisterMutationMiddleware)) {
        if (process.env.NODE_ENV === 'development') {
            throw new Error('<InputSelectorForm> can only be used inside a <SaveContext>. Please use <SaveContextProvider> to provide a <SaveContext>.');
        }
    }
    var handleSubmit = function (data) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, saveContext.save(data, {})];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var selectInputsLabel = translate('ra-form-layout.input_selector_form.select_inputs', {
        _: 'Select fields',
    });
    var selectValuesLabel = translate('ra-form-layout.input_selector_form.select_values', {
        _: 'Select values',
    });
    return (React.createElement(WizardForm, __assign({ onSubmit: handleSubmit, shouldUnregister: true }, rest),
        React.createElement(WizardFormStep, { label: selectInputsLabel },
            React.createElement(InputSelector, { source: inputSelectorFormInputs, inputs: inputs.map(function (input) { return input.label; }), validate: required() })),
        React.createElement(WizardFormStep, { label: selectValuesLabel },
            React.createElement(SelectedInputs, { inputs: inputs }),
            React.createElement(RegisterTemporaryInput, null))));
};
export var inputSelectorFormInputs = '@@ra-form-layout-input-selector-form-inputs';
var RegisterTemporaryInput = function () {
    var reset = useFormContext().reset;
    var goToStep = useWizardFormContext().goToStep;
    var _a = useSaveContext(), registerMutationMiddleware = _a.registerMutationMiddleware, unregisterMutationMiddleware = _a.unregisterMutationMiddleware;
    var middleware = useCallback(function (resource, params, options, next) { return __awaiter(void 0, void 0, void 0, function () {
        var sanitizedParams;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sanitizedParams = __assign(__assign({}, params), { data: omit(params.data, inputSelectorFormInputs) });
                    return [4 /*yield*/, next(resource, sanitizedParams, options)];
                case 1:
                    _a.sent();
                    // We go back to the first step
                    goToStep(0);
                    // We reset the form after the save, and after the navigation to first step is completed
                    queueMicrotask(function () {
                        reset();
                    });
                    return [2 /*return*/];
            }
        });
    }); }, [reset, goToStep]);
    useEffect(function () {
        registerMutationMiddleware(middleware);
        return function () { return unregisterMutationMiddleware(middleware); };
    }, [middleware, registerMutationMiddleware, unregisterMutationMiddleware]);
    return null;
};
var SelectedInputs = function (_a) {
    var _b;
    var inputs = _a.inputs;
    var selectedInputNames = useWatch({
        name: inputSelectorFormInputs,
    });
    var selectedInputs = (_b = (selectedInputNames &&
        selectedInputNames.map(function (selectedInput) {
            return inputs.find(function (input) { return input.label === selectedInput; });
        }))) !== null && _b !== void 0 ? _b : [];
    return (React.createElement(StyledBox, { className: SelectedInputsClasses.root },
        React.createElement(Stack, { paddingX: 1 }, selectedInputs.map(function (selectedInput) {
            return selectedInput ? (React.createElement(React.Fragment, { key: selectedInput.label }, selectedInput.element)) : null;
        }))));
};
var SelectedInputsPrefix = 'RaSelectedInputs';
var SelectedInputsClasses = {
    root: "".concat(SelectedInputsPrefix, "-root"),
};
var StyledBox = styled(Box, {
    name: SelectedInputsPrefix,
    overridesResolver: function (props, styles) { return styles.root; },
})({
    maxHeight: 'max(calc(100vh - 300px), 100px)',
    overflow: 'auto',
});
