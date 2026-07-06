import { useCallback } from 'react';
import {
    HttpError,
    MutationMode,
    RaRecord,
    SaveContextValue,
    SaveHandler,
    TransformData,
    UseCreateMutateParams,
    useMutationMiddlewares,
    useNotify,
    useRecordContext,
    useResourceContext,
    useUpdate,
} from 'react-admin';
import { UseMutationOptions } from 'react-query';
import { useRowContext } from './useRowContext';

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
export const useEditableDatagridEditController = <
    RecordType extends RaRecord = any,
    MutationOptionsError = unknown
>(
    props: EditableDatagridEditControllerProps<
        RecordType,
        MutationOptionsError
    > = {}
): SaveContextValue<RecordType> => {
    const { mutationMode, mutationOptions = {}, transform } = props;
    const { close } = useRowContext();
    const resource = useResourceContext(props);
    const record = useRecordContext<RecordType>(props);
    const notify = useNotify();

    const {
        onSuccess,
        onError,
        meta: mutationMeta,
        ...otherMutationOptions
    } = mutationOptions;

    const {
        registerMutationMiddleware,
        getMutateWithMiddlewares,
        unregisterMutationMiddleware,
    } = useMutationMiddlewares();

    const updateParams = { id: record.id, previousData: record };

    const [update, { isLoading: saving }] = useUpdate<
        RecordType,
        MutationOptionsError
    >(resource, undefined, {
        ...otherMutationOptions,
        mutationMode,
        returnPromise: mutationMode === 'pessimistic',
    });
    const save = useCallback<SaveHandler<any>>(
        async (
            data: Partial<RecordType>,
            {
                onSuccess: onSuccessFromSave,
                onError: onErrorFromSave,
                transform: transformFromSave,
                // @ts-ignore
                // TODO: we should update the SaveHandler type to include meta
                meta: metaFromSave,
            }
        ) => {
            const tranformedData: Partial<RecordType> = transformFromSave
                ? transformFromSave(data, {
                      previousData: updateParams.previousData,
                  })
                : transform
                ? transform(data, {
                      previousData: updateParams.previousData,
                  })
                : data;

            const mutate = getMutateWithMiddlewares(update);

            try {
                await mutate(
                    resource,
                    {
                        id: record.id,
                        data: tranformedData,
                        meta: metaFromSave ?? mutationMeta,
                        previousData: updateParams.previousData,
                    },
                    {
                        onSuccess: onSuccessFromSave
                            ? onSuccessFromSave
                            : onSuccess
                            ? onSuccess
                            : () => {
                                  notify('ra.notification.updated', {
                                      type: 'info',
                                      messageArgs: {
                                          smart_count: 1,
                                      },
                                      undoable: mutationMode === 'undoable',
                                  });
                                  close();
                              },
                        onError: onErrorFromSave
                            ? onErrorFromSave
                            : onError
                            ? onError
                            : (error: Error | string) =>
                                  notify(
                                      typeof error === 'string'
                                          ? error
                                          : error.message ||
                                                'ra.notification.http_error',
                                      { type: 'warning' }
                                  ),
                    }
                );
            } catch (error) {
                if ((error as HttpError).body?.errors != null) {
                    return (error as HttpError).body.errors;
                }
            }
        },
        [
            updateParams.previousData,
            transform,
            getMutateWithMiddlewares,
            update,
            resource,
            record.id,
            mutationMeta,
            onSuccess,
            onError,
            notify,
            mutationMode,
            close,
        ]
    );

    return {
        save,
        saving,
        registerMutationMiddleware,
        unregisterMutationMiddleware,
    };
};

export interface EditableDatagridEditControllerProps<
    RecordType extends RaRecord = any,
    MutationOptionsError = unknown
> {
    mutationOptions?: UseMutationOptions<
        RecordType,
        MutationOptionsError,
        UseCreateMutateParams<RecordType>
    > & { meta?: any };
    transform?: TransformData;
    mutationMode?: MutationMode;
    resource?: string;
}
