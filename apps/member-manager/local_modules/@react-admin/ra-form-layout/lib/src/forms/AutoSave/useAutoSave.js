"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAutoSave = void 0;
var react_1 = require("react");
var react_admin_1 = require("react-admin");
var react_hook_form_1 = require("react-hook-form");
var useDebouncedEvent_1 = require("./useDebouncedEvent");
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
var useAutoSave = function (options) {
    if (options === void 0) { options = {}; }
    var _a = options.debounce, debounce = _a === void 0 ? 3000 : _a, onSuccess = options.onSuccess, onError = options.onError, transform = options.transform;
    var form = (0, react_hook_form_1.useFormContext)();
    var saveContext = (0, react_admin_1.useSaveContext)();
    var handleSuccess = (0, react_admin_1.useEvent)(onSuccess);
    var handleError = (0, react_admin_1.useEvent)(onError);
    var values = (0, react_hook_form_1.useWatch)();
    if (!form || !saveContext) {
        throw new Error('Cannot use useAutoSave outside of a react-admin form');
    }
    if (saveContext.mutationMode === 'undoable') {
        throw new Error('The useAutoSave hook cannot be used in undoable Edit views. Use <Edit mutationMode="optimistic"> or <Edit mutationMode="pessimistic"> instead.');
    }
    var formState = form.formState, handleSubmit = form.handleSubmit, setError = form.setError;
    var isDirty = formState.isDirty, errors = formState.errors, isSubmitting = formState.isSubmitting;
    var submitEvent = (0, react_admin_1.useEvent)(function () {
        var submitCallback = function (values) { return __awaiter(void 0, void 0, void 0, function () {
            var serverErrors;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(saveContext === null || saveContext === void 0 ? void 0 : saveContext.save)) return [3 /*break*/, 2];
                        return [4 /*yield*/, saveContext.save(values, {
                                onSuccess: function (response, variables, context) {
                                    if (handleSuccess) {
                                        handleSuccess(response, variables, context);
                                    }
                                },
                                onError: function (error) {
                                    if (handleError) {
                                        handleError(error);
                                    }
                                },
                                transform: transform,
                            })];
                    case 1:
                        serverErrors = _a.sent();
                        _a.label = 2;
                    case 2:
                        if (serverErrors != null) {
                            (0, react_admin_1.setSubmissionErrors)(serverErrors, setError);
                        }
                        return [2 /*return*/];
                }
            });
        }); };
        return handleSubmit(submitCallback)();
    });
    var save = (0, useDebouncedEvent_1.useDebouncedEvent)(submitEvent, debounce);
    // Watch for changes in the form values and reset the error state.
    // This turns the autosave back on as well
    (0, react_1.useEffect)(function () {
        if (!isDirty || Object.keys(errors).length > 0) {
            return;
        }
        save();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isDirty, JSON.stringify(errors), save, values]);
    return (saveContext === null || saveContext === void 0 ? void 0 : saveContext.saving) || isSubmitting;
};
exports.useAutoSave = useAutoSave;
