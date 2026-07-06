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
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePredictiveTextInputController = void 0;
var React = __importStar(require("react"));
var react_admin_1 = require("react-admin");
var react_hook_form_1 = require("react-hook-form");
var use_debounce_1 = require("use-debounce");
var react_query_1 = require("react-query");
var useGetCompletion_1 = require("../../dataProvider/useGetCompletion");
/**
 * Create a prompt based on the current record and the field value
 *
 * @example
 * defaultPromptGenerator({
 *     resource: "users",
 *     name: 'email',
 *     value: 'john',
 *     record: { firstName: 'John', lastName: 'Doe' }
 * });
 *
 * // The following describes one of users:
 * // firstName:John
 * // lastName:Doe
 * // email:john
 *
 * // Expected response from a completion API
 * // '.doe@example'
 */
var defaultPromptGenerator = function (_a) {
    var resource = _a.resource, name = _a.name, value = _a.value, _b = _a.record, record = _b === void 0 ? {} : _b, locale = _a.locale;
    var cleanedRecord = Object.keys(record).reduce(function (acc, key) {
        if (key !== name && record[key]) {
            acc[key] = record[key];
        }
        return acc;
    }, {});
    return "The following describes one of ".concat(resource, " (no space between the colon and the value), using the ").concat(locale, " locale:\n").concat(Object.keys(cleanedRecord)
        .map(function (key) { return "".concat(key, ":").concat(cleanedRecord[key]); })
        .join('\n'), "\n").concat(name, ":").concat(value);
};
/**
 * Controller logic for the <PredictiveTextInput> component
 */
var usePredictiveTextInputController = function (props) {
    var _a = props.field, name = _a.name, value = _a.value, onFocus = _a.onFocus, onBlur = _a.onBlur, _b = props.debounce, debounce = _b === void 0 ? 1000 : _b, locale = props.locale, queryOptions = props.queryOptions, meta = props.meta, _c = props.promptGenerator, promptGenerator = _c === void 0 ? defaultPromptGenerator : _c, temperature = props.temperature, _d = props.stop, stop = _d === void 0 ? ['\n'] : _d, maxSize = props.maxSize;
    var resource = (0, react_admin_1.useResourceContext)(props);
    var _e = React.useState(false), hasFocus = _e[0], setHasFocus = _e[1];
    var _f = React.useState(false), hasJustAcceptedCompletion = _f[0], setHasJustAcceptedCompletion = _f[1];
    var _g = React.useState(''), completion = _g[0], setCompletion = _g[1];
    var record = (0, react_hook_form_1.useWatch)();
    var formContext = (0, react_hook_form_1.useFormContext)();
    var queryClient = (0, react_query_1.useQueryClient)();
    var notify = (0, react_admin_1.useNotify)();
    var debouncedValue = (0, use_debounce_1.useDebounce)(value, debounce)[0];
    var localeFromI18n = (0, react_admin_1.useLocaleState)()[0];
    var contentLocale = locale || localeFromI18n;
    var prompt = promptGenerator({
        resource: resource,
        name: name,
        value: value,
        record: record,
        locale: contentLocale,
    });
    var debouncedPrompt = (0, use_debounce_1.useDebounce)(prompt, debounce)[0];
    var handleSuccess = React.useCallback(function (response) {
        if (!hasFocus)
            return;
        setCompletion(response.data);
    }, [hasFocus, setCompletion]);
    var handleError = React.useCallback(function (error) {
        if (!hasFocus)
            return;
        setCompletion('');
        notify((error === null || error === void 0 ? void 0 : error.message) || 'ra-ai.notification.getCompletion.error', {
            type: 'error',
            messageArgs: {
                _: (error === null || error === void 0 ? void 0 : error.message) || 'Error fetching completion',
            },
        });
    }, [hasFocus, setCompletion, notify]);
    (0, useGetCompletion_1.useGetCompletion)({ prompt: debouncedPrompt, stop: stop, temperature: temperature, maxSize: maxSize, meta: meta }, __assign(__assign({}, queryOptions), { enabled: hasFocus && !hasJustAcceptedCompletion, onSuccess: handleSuccess, onError: handleError }));
    // When the user blurs the field, we don't want the suggestion to be displayed
    // So we reset completion when the field value changes or changes focus
    React.useEffect(function () {
        setCompletion('');
    }, [resource, name, value, hasFocus]);
    var handleFocus = function (event) {
        onFocus && onFocus(event);
        setHasFocus(true);
    };
    var handleBlur = function (event) {
        onBlur && onBlur(event);
        setHasFocus(false);
    };
    // When the user continues typing after a pause that triggered a completion,
    // we want to cancel the completion calls to avoid displaying an outdated suggestion
    React.useEffect(function () {
        if (value !== debouncedValue) {
            queryClient.cancelQueries([resource, 'getCompletion']);
        }
    }, [resource, value, debouncedValue, queryClient]);
    // When the user presses tab and there is a suggestion,
    // we want to accept the completion instead of moving to the next field
    var handleKeyDown = function (event) {
        if (event.key === 'Tab' && completion !== '') {
            if (hasJustAcceptedCompletion) {
                return;
            }
            formContext.setValue(name, "".concat(value).concat(completion), {
                shouldDirty: true,
            });
            setCompletion('');
            setHasJustAcceptedCompletion(true);
            event.preventDefault();
        }
        else if (value !== completion) {
            setHasJustAcceptedCompletion(false);
        }
    };
    return { completion: completion, handleFocus: handleFocus, handleBlur: handleBlur, handleKeyDown: handleKeyDown };
};
exports.usePredictiveTextInputController = usePredictiveTextInputController;
