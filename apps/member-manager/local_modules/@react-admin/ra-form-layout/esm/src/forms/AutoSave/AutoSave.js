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
import { useTranslate } from 'react-admin';
import { Fade, Typography, styled } from '@mui/material';
import { useAutoSave } from './useAutoSave';
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
export var AutoSave = function (_a) {
    var _b = _a.debounce, debounce = _b === void 0 ? 3000 : _b, _c = _a.confirmationDuration, confirmationDuration = _c === void 0 ? 3000 : _c, typographyProps = _a.typographyProps;
    var _d = useState(null), lastSaveAt = _d[0], setLastSaveAt = _d[1];
    var _e = useState(null), error = _e[0], setError = _e[1];
    var translate = useTranslate();
    var timeoutRef = React.useRef();
    var isSaving = useAutoSave({
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
        return (React.createElement(Root, __assign({ color: "error", className: AutoSaveClasses.error }, typographyProps), translate('ra-form-layout.autosave.error', {
            _: 'Server error, changes are not saved: %{error}',
            error: error,
        })));
    }
    if (isSaving) {
        return (React.createElement(Root, __assign({ color: "text.secondary" }, typographyProps), translate('ra-form-layout.autosave.saving', {
            _: 'Saving...',
        })));
    }
    return (React.createElement(Fade, { in: !!lastSaveAt },
        React.createElement(Root, __assign({ color: "text.secondary" }, typographyProps), translate('ra-form-layout.autosave.last_saved_at', {
            _: 'All changes saved',
            lastSaveAt: lastSaveAt,
        }))));
};
var PREFIX = 'RaAutoSave';
export var AutoSaveClasses = {
    error: "".concat(PREFIX, "-error"),
};
var Root = styled(Typography, {
    name: PREFIX,
    overridesResolver: function (_props, styles) { return styles.root; },
})(function (_a) {
    var _b;
    var theme = _a.theme;
    return (_b = {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1)
        },
        _b["&.".concat(AutoSaveClasses.error)] = {},
        _b);
});
