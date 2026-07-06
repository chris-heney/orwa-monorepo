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
import * as React from 'react';
import { useDataProvider, useTranslate } from 'react-admin';
import { useTiptapEditor } from 'ra-input-rich-text';
import { useMutation } from 'react-query';
import { ToggleButton } from '@mui/material';
import EditNoteIcon from '@mui/icons-material/EditNote';
import { useSmartRichTextInputParamsContext, } from './SmartRichTextInputParamsContext';
export var ContinueButton = function (props) {
    var editor = useTiptapEditor();
    var translate = useTranslate();
    var dataProvider = useDataProvider();
    var _a = useSmartRichTextInputParamsContext(props), locale = _a.locale, mutationOptions = _a.mutationOptions, params = __rest(_a, ["locale", "mutationOptions"]);
    var _b = useMutation(function (prompt) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, dataProvider.getCompletion(__assign({ prompt: prompt }, params))];
        });
    }); }, mutationOptions), mutateAsync = _b.mutateAsync, isLoading = _b.isLoading;
    var replace = function (event) { return __awaiter(void 0, void 0, void 0, function () {
        var from, text, completion, cleanCompletion, to;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    event.preventDefault();
                    from = editor.state.selection.from;
                    text = from > 1
                        ? editor.state.doc.textBetween(0, from, ' ')
                        : editor.getText();
                    if (!text)
                        return [2 /*return*/];
                    return [4 /*yield*/, mutateAsync(text)];
                case 1:
                    completion = (_a.sent()).data;
                    if (completion) {
                        cleanCompletion = completion.trim();
                        to = from + cleanCompletion.length;
                        editor
                            .chain()
                            .focus()
                            .insertContent(cleanCompletion)
                            .setTextSelection({ from: from, to: to })
                            .run();
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    var label = translate('ra.ai.button.complete', { _: 'Continue writing' });
    return (React.createElement(ToggleButton, __assign({ "aria-label": label, title: label, value: label, onClick: replace, disabled: !(editor === null || editor === void 0 ? void 0 : editor.isEditable) || isLoading, selected: isLoading }, sanitizeRestProps(props)),
        React.createElement(EditNoteIcon, { fontSize: "inherit" })));
};
var sanitizeRestProps = function (_a) {
    var locale = _a.locale, stop = _a.stop, maxSize = _a.maxSize, temperature = _a.temperature, meta = _a.meta, mutationOptions = _a.mutationOptions, rest = __rest(_a, ["locale", "stop", "maxSize", "temperature", "meta", "mutationOptions"]);
    return rest;
};
