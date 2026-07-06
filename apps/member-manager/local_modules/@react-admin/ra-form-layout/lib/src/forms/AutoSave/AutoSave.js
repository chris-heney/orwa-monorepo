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
exports.AutoSaveClasses = exports.AutoSave = void 0;
var React = __importStar(require("react"));
var react_1 = require("react");
var react_admin_1 = require("react-admin");
var material_1 = require("@mui/material");
var useAutoSave_1 = require("./useAutoSave");
/**
 * A component that enables autosaving of the form and displays the last save date.
 *
 * @param interval The interval in milliseconds between two autosaves. Defaults to 5000 (5s).
 * @param confirmationDuration The delay in milliseconds before save confirmation message disappears. Defaults to 3000 (3s).
 * @param typographyProps Additional props to pass to the `<Typography>` component that displays the last save time.
 *
 * @example
 * import { AutoSave } from '@react-admin/ra-form-layout';
 * import { Edit, SaveButton, SimpleForm, TextInput, Toolbar } from 'react-admin';
 *
 * const AutoSaveToolbar = () => (
 *    <Toolbar>
 *       <SaveButton />
 *       <AutoSave />
 *   </Toolbar>
 * );
 *
 * const PostEdit = () => (
 *     <Edit mutationMode="optimistic">
 *         <SimpleForm toolbar={AutoSaveToolbar} resetOptions={{ keepDirtyValues: true }}>
 *             <TextInput source="title" />
 *             <TextInput source="teaser" />
 *         </SimpleForm>
 *     </Edit>
 * );
 */
var AutoSave = function (_a) {
    var _b = _a.debounce, debounce = _b === void 0 ? 3000 : _b, _c = _a.confirmationDuration, confirmationDuration = _c === void 0 ? 3000 : _c, typographyProps = _a.typographyProps;
    var _d = (0, react_1.useState)(null), lastSaveAt = _d[0], setLastSaveAt = _d[1];
    var _e = (0, react_1.useState)(null), error = _e[0], setError = _e[1];
    var translate = (0, react_admin_1.useTranslate)();
    var timeoutRef = React.useRef();
    var isSaving = (0, useAutoSave_1.useAutoSave)({
        debounce: debounce,
        onSuccess: function () {
            setLastSaveAt(new Date());
            setError(null);
            // To avoid TS taking the Node setTimeout instead of the browser one
            var setTimeout = window.setTimeout, clearTimeout = window.clearTimeout;
            if (confirmationDuration !== false) {
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                }
                timeoutRef.current = setTimeout(function () {
                    setLastSaveAt(null);
                }, confirmationDuration);
            }
            return function () {
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                }
            };
        },
        onError: function (error) { return setError((error === null || error === void 0 ? void 0 : error.message) || error); },
    });
    if (error) {
        return (React.createElement(Root, __assign({ color: "error", className: exports.AutoSaveClasses.error }, typographyProps), translate('ra-form-layout.autosave.error', {
            _: 'Server error, changes are not saved: %{error}',
            error: error,
        })));
    }
    if (isSaving) {
        return (React.createElement(Root, __assign({ color: "text.secondary" }, typographyProps), translate('ra-form-layout.autosave.saving', {
            _: 'Saving...',
        })));
    }
    return (React.createElement(material_1.Fade, { in: !!lastSaveAt },
        React.createElement(Root, __assign({ color: "text.secondary" }, typographyProps), translate('ra-form-layout.autosave.last_saved_at', {
            _: 'All changes saved',
            lastSaveAt: lastSaveAt,
        }))));
};
exports.AutoSave = AutoSave;
var PREFIX = 'RaAutoSave';
exports.AutoSaveClasses = {
    error: "".concat(PREFIX, "-error"),
};
var Root = (0, material_1.styled)(material_1.Typography, {
    name: PREFIX,
    overridesResolver: function (_props, styles) { return styles.root; },
})(function (_a) {
    var _b;
    var theme = _a.theme;
    return (_b = {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1)
        },
        _b["&.".concat(exports.AutoSaveClasses.error)] = {},
        _b);
});
