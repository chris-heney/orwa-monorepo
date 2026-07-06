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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useEditableDatagridEditController = void 0;
var react_1 = require("react");
var react_admin_1 = require("react-admin");
var useRowContext_1 = require("./useRowContext");
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
var useEditableDatagridEditController = function (props) {
    if (props === void 0) { props = {}; }
    var mutationMode = props.mutationMode, _a = props.mutationOptions, mutationOptions = _a === void 0 ? {} : _a, transform = props.transform;
    var close = (0, useRowContext_1.useRowContext)().close;
    var resource = (0, react_admin_1.useResourceContext)(props);
    var record = (0, react_admin_1.useRecordContext)(props);
    var notify = (0, react_admin_1.useNotify)();
    var onSuccess = mutationOptions.onSuccess, onError = mutationOptions.onError, mutationMeta = mutationOptions.meta, otherMutationOptions = __rest(mutationOptions, ["onSuccess", "onError", "meta"]);
    var _b = (0, react_admin_1.useMutationMiddlewares)(), registerMutationMiddleware = _b.registerMutationMiddleware, getMutateWithMiddlewares = _b.getMutateWithMiddlewares, unregisterMutationMiddleware = _b.unregisterMutationMiddleware;
    var updateParams = { id: record.id, previousData: record };
    var _c = (0, react_admin_1.useUpdate)(resource, undefined, __assign(__assign({}, otherMutationOptions), { mutationMode: mutationMode, returnPromise: mutationMode === 'pessimistic' })), update = _c[0], saving = _c[1].isLoading;
    var save = (0, react_1.useCallback)(function (data, _a) {
        var onSuccessFromSave = _a.onSuccess, onErrorFromSave = _a.onError, transformFromSave = _a.transform, 
        // @ts-ignore
        // TODO: we should update the SaveHandler type to include meta
        metaFromSave = _a.meta;
        return __awaiter(void 0, void 0, void 0, function () {
            var tranformedData, mutate, error_1;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        tranformedData = transformFromSave
                            ? transformFromSave(data, {
                                previousData: updateParams.previousData,
                            })
                            : transform
                                ? transform(data, {
                                    previousData: updateParams.previousData,
                                })
                                : data;
                        mutate = getMutateWithMiddlewares(update);
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, mutate(resource, {
                                id: record.id,
                                data: tranformedData,
                                meta: metaFromSave !== null && metaFromSave !== void 0 ? metaFromSave : mutationMeta,
                                previousData: updateParams.previousData,
                            }, {
                                onSuccess: onSuccessFromSave
                                    ? onSuccessFromSave
                                    : onSuccess
                                        ? onSuccess
                                        : function () {
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
                                        : function (error) {
                                            return notify(typeof error === 'string'
                                                ? error
                                                : error.message ||
                                                    'ra.notification.http_error', { type: 'warning' });
                                        },
                            })];
                    case 2:
                        _c.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _c.sent();
                        if (((_b = error_1.body) === null || _b === void 0 ? void 0 : _b.errors) != null) {
                            return [2 /*return*/, error_1.body.errors];
                        }
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }, [
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
    ]);
    return {
        save: save,
        saving: saving,
        registerMutationMiddleware: registerMutationMiddleware,
        unregisterMutationMiddleware: unregisterMutationMiddleware,
    };
};
exports.useEditableDatagridEditController = useEditableDatagridEditController;
