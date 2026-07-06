import { FormDialogContextType } from './FormDialogContext';
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
export declare const useFormDialogContext: (props?: Partial<FormDialogContextType>) => FormDialogContextType;
//# sourceMappingURL=useFormDialogContext.d.ts.map