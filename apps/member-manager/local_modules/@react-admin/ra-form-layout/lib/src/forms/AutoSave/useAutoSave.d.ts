import { OnError, OnSuccess, TransformData } from 'react-admin';
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
export declare const useAutoSave: (options?: UseAutoSaveParams) => boolean;
export interface UseAutoSaveParams {
    debounce?: number;
    onSuccess?: OnSuccess;
    onError?: OnError;
    transform?: TransformData;
}
//# sourceMappingURL=useAutoSave.d.ts.map