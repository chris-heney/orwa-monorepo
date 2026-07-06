import { MutationMode, RaRecord, SaveContextValue, TransformData, UseCreateMutateParams } from 'react-admin';
import { UseMutationOptions } from 'react-query';
/**
 * `useEditableDatagridEditController` is a custom hook for managing the state and logic of an editable data grid.
 *
 * This hook returns an object containing various properties and methods for managing the editable data grid.
 *
 * @param {Object} params The parameters passed to the hook. Expected properties are:
 * - `resource`: The name of the resource being edited.
 * - `record`: The record being edited.
 * - `save`: A callback function that will be called when the record is saved.
 * - `cancel`: A callback function that will be called when the editing is cancelled.
 *
 * @returns {Object} Returns an object with the following properties:
 * - `isEditing`: A boolean indicating whether the data grid is in editing mode.
 * - `setEditing`: A function to set the editing mode.
 * - `editRow`: A function to edit a specific row.
 * - `cancelEdit`: A function to cancel editing.
 * - `saveEdit`: A function to save the edited record.
 */
/**
 * `useEditableDatagridEditController` hook build a SaveContextValue
 * to save the record when the EditableDatagridRow is validated.
 * Used in EditableDatagridRowEditBase component.
 *
 * @param {Object} props The props used to mutate the record
 *
 * @return {SaveContextValue} The SaveContextValue value used to save the record
 *
 * @example
 *
 * import { SaveContextProvider } from 'react-admin';
 * import {
 *     EditableDatagridEditControllerProps,
 *     useEditableDatagridEditController,
 * } from './useEditableDatagridEditController';
 *
 * export const EditableDatagridRowEditBase = (
 *     props: EditableDatagridRowEditBaseProps
 * ) => {
 *     const { children } = props;
 *     const controllerProps = useEditableDatagridEditController(props);
 *     return (
 *         <SaveContextProvider value={controllerProps}>
 *             {children}
 *         </SaveContextProvider>
 *     );
 * };
 */
export declare const useEditableDatagridEditController: <RecordType extends RaRecord<import("react-admin").Identifier> = any, MutationOptionsError = unknown>(props?: EditableDatagridEditControllerProps<RecordType, MutationOptionsError>) => SaveContextValue<RecordType, (...args: any[]) => any>;
export interface EditableDatagridEditControllerProps<RecordType extends RaRecord = any, MutationOptionsError = unknown> {
    mutationOptions?: UseMutationOptions<RecordType, MutationOptionsError, UseCreateMutateParams<RecordType>> & {
        meta?: any;
    };
    transform?: TransformData;
    mutationMode?: MutationMode;
    resource?: string;
}
//# sourceMappingURL=useEditableDatagridEditController.d.ts.map