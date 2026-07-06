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
import { RichTextInput } from 'ra-input-rich-text';
import { SmartRichTextInputToolbar } from './SmartRichTextInputToolbar';
import { SmartRichTextInputParamsContext, } from './SmartRichTextInputParamsContext';
export var SmartRichTextInput = function (props) {
    var locale = props.locale, stop = props.stop, maxSize = props.maxSize, temperature = props.temperature, meta = props.meta, mutationOptions = props.mutationOptions, rest = __rest(props, ["locale", "stop", "maxSize", "temperature", "meta", "mutationOptions"]);
    return (React.createElement(SmartRichTextInputParamsContext.Provider, { value: {
            mutationOptions: mutationOptions,
            locale: locale,
            stop: stop,
            maxSize: maxSize,
            temperature: temperature,
            meta: meta,
        } },
        React.createElement(RichTextInput, __assign({ toolbar: React.createElement(SmartRichTextInputToolbar, null) }, rest))));
};
