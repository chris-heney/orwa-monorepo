import { useEffect } from 'react';
import {
    OnError,
    OnSuccess,
    TransformData,
    setSubmissionErrors,
    useEvent,
    useSaveContext,
} from 'react-admin';
import { useFormContext, useWatch } from 'react-hook-form';
import { useDebouncedEvent } from './useDebouncedEvent';

/**
 * Automatically save the form at a regular interval.
 * @param {Object} options
 * @param {number} options.debounce The interval in ms between two saves. Defaults to 3000 (3s).
 * @param {Function} options.onSuccess A callback to call when the save request succeeds.
 * @param {Function} options.onError A callback to call when the save request fails.
 * @param {Function} options.transform A function to transform the data before saving.
 * @example
 * import { useAutoSave } from '@react-admin/ra-form-layout';
 * import { Edit, SaveButton, SimpleForm, TextInput, Toolbar } from 'react-admin';
 *
 * const AutoSave = () => {
 *     const [lastSave, setLastSave] = useState();
 *     const [error, setError] = useState();
 *     useAutoSave({
 *         interval: 5000,
 *         onSuccess: () => setLastSave(new Date()),
 *         onError: (error) => setError(error)
 *     });
 *     return (
 *         <div>
 *             {lastSave && <p>Saved at {lastSave.toLocaleString()}</p>}
 *             {error && <p>Error: {error}</p>}
 *         </div>
 *     );
 * };
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
export const useAutoSave = (options: UseAutoSaveParams = {}) => {
    const { debounce = 3000, onSuccess, onError, transform } = options;
    const form = useFormContext();
    const saveContext = useSaveContext();
    const handleSuccess = useEvent(onSuccess);
    const handleError = useEvent(onError);
    const values = useWatch();

    if (!form || !saveContext) {
        throw new Error('Cannot use useAutoSave outside of a react-admin form');
    }
    if (saveContext.mutationMode === 'undoable') {
        throw new Error(
            'The useAutoSave hook cannot be used in undoable Edit views. Use <Edit mutationMode="optimistic"> or <Edit mutationMode="pessimistic"> instead.'
        );
    }

    const { formState, handleSubmit, setError } = form;
    const { isDirty, errors, isSubmitting } = formState;

    const submitEvent = useEvent(() => {
        const submitCallback = async values => {
            let serverErrors;
            if (saveContext?.save) {
                serverErrors = await saveContext.save(values, {
                    onSuccess: (response, variables, context) => {
                        if (handleSuccess) {
                            handleSuccess(response, variables, context);
                        }
                    },
                    onError: error => {
                        if (handleError) {
                            handleError(error);
                        }
                    },
                    transform,
                });
            }

            if (serverErrors != null) {
                setSubmissionErrors(serverErrors, setError);
            }
        };
        return handleSubmit(submitCallback)();
    });

    const save = useDebouncedEvent(submitEvent, debounce);

    // Watch for changes in the form values and reset the error state.
    // This turns the autosave back on as well
    useEffect(() => {
        if (!isDirty || Object.keys(errors).length > 0) {
            return;
        }
        save();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isDirty, JSON.stringify(errors), save, values]);

    return saveContext?.saving || isSubmitting;
};

export interface UseAutoSaveParams {
    debounce?: number;
    onSuccess?: OnSuccess;
    onError?: OnError;
    transform?: TransformData;
}
