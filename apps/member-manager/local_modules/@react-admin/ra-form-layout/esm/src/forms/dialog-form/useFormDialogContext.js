import { useContext } from 'react';
import { FormDialogContext } from './FormDialogContext';
/**
 * Hook allowing to get the FormDialogContext.
 * Values are retrieved from the given props, or from the FormDialogContext if one exists.
 * For each value, props value takes precedence over context value.
 * In case values can be retrieved neither from props nor from context, `null` is returned.
 *
 * @param props.isOpen The open/close state. `true` if the dialog is open.
 * @param props.open The callback that gets called to open the dialog.
 * @param props.close The callback that gets called to close the dialog.
 *
 * @returns {FormDialogContextType} value from props or context.
 */
export var useFormDialogContext = function (props) {
    var _a, _b, _c;
    var context = useContext(FormDialogContext);
    var finalContext = {
        isOpen: (_a = props === null || props === void 0 ? void 0 : props.isOpen) !== null && _a !== void 0 ? _a : context === null || context === void 0 ? void 0 : context.isOpen,
        open: (_b = props === null || props === void 0 ? void 0 : props.open) !== null && _b !== void 0 ? _b : context === null || context === void 0 ? void 0 : context.open,
        close: (_c = props === null || props === void 0 ? void 0 : props.close) !== null && _c !== void 0 ? _c : context === null || context === void 0 ? void 0 : context.close,
    };
    if (finalContext.isOpen == null &&
        finalContext.open == null &&
        finalContext.close == null) {
        return null;
    }
    else {
        return finalContext;
    }
};
