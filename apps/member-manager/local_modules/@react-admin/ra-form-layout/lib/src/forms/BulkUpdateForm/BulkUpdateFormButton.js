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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BulkUpdateFormButtonClasses = exports.BulkUpdateFormButton = void 0;
var Close_1 = __importDefault(require("@mui/icons-material/Close"));
var Create_1 = __importDefault(require("@mui/icons-material/Create"));
var material_1 = require("@mui/material");
var clsx_1 = __importDefault(require("clsx"));
var React = __importStar(require("react"));
var react_1 = require("react");
var react_admin_1 = require("react-admin");
/**
 * This component renders a button allowing to edit multiple records at once.
 *
 * The `<BulkUpdateFormButton>` can be used inside `<Datagrid>`'s `bulkActionButtons`.
 * It will render a button that opens a dialog containing the form passed as children.
 * When the form is submitted, it will call the dataProvider's `updateMany` method with the ids of the selected records.
 *
 * @example
 * ```tsx
 * import * as React from 'react';
 * import {
 *     Admin,
 *     BooleanField,
 *     BooleanInput,
 *     Datagrid,
 *     DateField,
 *     DateInput,
 *     List,
 *     Resource,
 *     SimpleForm,
 *     TextField,
 * } from 'react-admin';
 * import { BulkUpdateFormButton } from '@react-admin/ra-form-layout';
 *
 * import { dataProvider } from './dataProvider';
 * import { i18nProvider } from './i18nProvider';
 *
 * export const App = () => (
 *     <Admin dataProvider={dataProvider} i18nProvider={i18nProvider}>
 *         <Resource name="posts" list={PostList} />
 *     </Admin>
 * );
 *
 * const PostBulkUpdateButton = () => (
 *     <BulkUpdateFormButton>
 *         <SimpleForm>
 *             <DateInput source="published_at" />
 *             <BooleanInput source="is_public" />
 *         </SimpleForm>
 *     </BulkUpdateFormButton>
 * );
 *
 * const PostList = () => (
 *     <List>
 *         <Datagrid bulkActionButtons={<PostBulkUpdateButton />}>
 *             <TextField source="id" />
 *             <TextField source="title" />
 *             <DateField source="published_at" />
 *             <BooleanField source="is_public" />
 *         </Datagrid>
 *     </List>
 * );
 * ```
 */
var BulkUpdateFormButton = function (props) {
    var _a, _b;
    var resource = (0, react_admin_1.useResourceContext)(props);
    var selectedIds = (0, react_admin_1.useListContext)(props).selectedIds;
    var unselectAll = (0, react_admin_1.useUnselectAll)(resource);
    var refresh = (0, react_admin_1.useRefresh)();
    var notify = (0, react_admin_1.useNotify)();
    var translate = (0, react_admin_1.useTranslate)();
    var getResourceLabel = (0, react_admin_1.useGetResourceLabel)();
    var _c = (0, react_1.useState)(false), open = _c[0], setOpen = _c[1];
    var handleClickOpen = function () {
        setOpen(true);
    };
    var handleClose = function () {
        setOpen(false);
    };
    var dialogTitle = translate('ra-form-layout.action.bulk_update', {
        resource: getResourceLabel(resource, (_a = selectedIds === null || selectedIds === void 0 ? void 0 : selectedIds.length) !== null && _a !== void 0 ? _a : 2),
        _: 'Update selected %{resource}',
        smart_count: (_b = selectedIds === null || selectedIds === void 0 ? void 0 : selectedIds.length) !== null && _b !== void 0 ? _b : 2,
    });
    var children = props.children, className = props.className, _d = props.DialogProps, DialogProps = _d === void 0 ? {} : _d, _e = props.label, label = _e === void 0 ? 'ra.action.update' : _e, _f = props.icon, icon = _f === void 0 ? defaultIcon : _f, mutationMode = props.mutationMode, _g = props.onSuccess, onSuccess = _g === void 0 ? function () {
        notify('ra.notification.updated', {
            type: 'info',
            messageArgs: { smart_count: selectedIds.length },
            undoable: mutationMode === 'undoable',
        });
        unselectAll();
        refresh();
    } : _g, _h = props.onError, onError = _h === void 0 ? function (error) {
        notify(typeof error === 'string'
            ? error
            : error.message || 'ra.notification.http_error', {
            type: 'error',
            messageArgs: {
                _: typeof error === 'string'
                    ? error
                    : error && error.message
                        ? error.message
                        : undefined,
            },
        });
        refresh();
    } : _h, _j = props.mutationOptions, mutationOptions = _j === void 0 ? {} : _j, rest = __rest(props, ["children", "className", "DialogProps", "label", "icon", "mutationMode", "onSuccess", "onError", "mutationOptions"]);
    var meta = mutationOptions.meta, otherMutationOptions = __rest(mutationOptions, ["meta"]);
    var _k = (0, react_admin_1.useMutationMiddlewares)(), registerMutationMiddleware = _k.registerMutationMiddleware, unregisterMutationMiddleware = _k.unregisterMutationMiddleware, getMutateWithMiddlewares = _k.getMutateWithMiddlewares;
    var _l = (0, react_admin_1.useUpdateMany)(), updateMany = _l[0], isLoading = _l[1].isLoading;
    var mutate = getMutateWithMiddlewares(updateMany);
    var save = (0, react_1.useCallback)(function (data) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, mutate(resource, { ids: selectedIds, data: data, meta: meta }, __assign(__assign({ onError: onError, mutationMode: mutationMode }, otherMutationOptions), { onSuccess: function (data, variables, context) {
                            otherMutationOptions.onSuccess
                                ? otherMutationOptions.onSuccess(data, variables, context)
                                : onSuccess();
                            handleClose();
                        } }))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, [
        meta,
        mutate,
        mutationMode,
        onError,
        onSuccess,
        otherMutationOptions,
        resource,
        selectedIds,
    ]);
    var saveContext = (0, react_1.useMemo)(function () { return ({
        save: save,
        registerMutationMiddleware: registerMutationMiddleware,
        unregisterMutationMiddleware: unregisterMutationMiddleware,
        saving: isLoading,
        mutationMode: mutationMode,
    }); }, [
        save,
        registerMutationMiddleware,
        unregisterMutationMiddleware,
        isLoading,
        mutationMode,
    ]);
    return (React.createElement(React.Fragment, null,
        React.createElement(StyledButton, __assign({ onClick: handleClickOpen, label: label, disabled: isLoading, className: (0, clsx_1.default)(className, exports.BulkUpdateFormButtonClasses.root) }, sanitizeRestProps(rest)), icon),
        React.createElement(material_1.Dialog, __assign({ open: open, onClose: handleClose, sx: {
                '& .MuiDialog-paper': { minWidth: { md: '50%' } },
            } }, DialogProps),
            React.createElement(material_1.DialogTitle, null,
                dialogTitle,
                ' ',
                React.createElement(material_1.IconButton, { "aria-label": "close", onClick: handleClose, sx: {
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: function (theme) { return theme.palette.grey[500]; },
                    } },
                    React.createElement(Close_1.default, null))),
            React.createElement(react_admin_1.SaveContextProvider, { value: saveContext }, children))));
};
exports.BulkUpdateFormButton = BulkUpdateFormButton;
var defaultIcon = React.createElement(Create_1.default, null);
var sanitizeRestProps = function (_a) {
    var filterValues = _a.filterValues, label = _a.label, selectedIds = _a.selectedIds, onSuccess = _a.onSuccess, onError = _a.onError, mutationMode = _a.mutationMode, mutationOptions = _a.mutationOptions, resource = _a.resource, icon = _a.icon, children = _a.children, rest = __rest(_a, ["filterValues", "label", "selectedIds", "onSuccess", "onError", "mutationMode", "mutationOptions", "resource", "icon", "children"]);
    return rest;
};
var PREFIX = 'RaBulkUpdateFormButton';
exports.BulkUpdateFormButtonClasses = {
    root: "".concat(PREFIX, "-root"),
};
var StyledButton = (0, material_1.styled)(react_admin_1.Button, {
    name: PREFIX,
    overridesResolver: function (props, styles) { return styles.root; },
})(function (_a) {
    var theme = _a.theme;
    return ({
        color: theme.palette.primary.main,
        '&:hover': {
            backgroundColor: (0, material_1.alpha)(theme.palette.primary.main, 0.12),
            // Reset on mouse devices
            '@media (hover: none)': {
                backgroundColor: 'transparent',
            },
        },
    });
});
