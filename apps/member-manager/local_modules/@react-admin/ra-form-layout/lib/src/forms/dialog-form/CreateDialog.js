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
exports.CreateDialog = void 0;
var React = __importStar(require("react"));
var react_admin_1 = require("react-admin");
var material_1 = require("@mui/material");
var react_router_dom_1 = require("react-router-dom");
var react_query_1 = require("react-query");
var FormDialogTitle_1 = require("./FormDialogTitle");
var useFormDialogContext_1 = require("./useFormDialogContext");
/**
 * A component which displays a creation form inside a dialog.
 *
 * By default, this components manages the open/close state of the dialog via the router.
 * In case it is used inside a `<FormDialogContext>`, or if the `isOpen`, `open` and `close`
 * props are provided directly, then the open/close state is managed by these values instead.
 *
 * @param {CreateDialogProps} props
 *
 * @example
 * const PostList = () => (
 *     <>
 *         <List>
 *             <Datagrid>
 *                 ...
 *             </Datagrid>
 *         </List>
 *         <CreateDialog>
 *             <SimpleForm>
 *                 <TextField source="id" />
 *                 <TextInput source="first_name" validate={required()} />
 *                 <TextInput source="last_name" validate={required()} />
 *                 <DateInput source="dob" label="born" validate={required()} />
 *                 <SelectInput source="sex" choices={sexChoices} />
 *             </SimpleForm>
 *         </CreateDialog>
 *     </>
 * );
 *
 * @example with a managed state
 * const CustomerEditForm = () => {
 *     const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
 *     const openCreateDialog = useCallback(() => {
 *         setIsCreateDialogOpen(true);
 *     }, []);
 *     const closeCreateDialog = useCallback(() => {
 *         setIsCreateDialogOpen(false);
 *     }, []);
 *
 *     return (
 *         <SimpleForm>
 *             <Button
 *                 label="Create a new customer"
 *                 onClick={() => openCreateDialog()}
 *             />
 *             <CreateDialog
 *                 fullWidth
 *                 maxWidth="md"
 *                 isOpen={isCreateDialogOpen}
 *                 open={openCreateDialog}
 *                 close={closeCreateDialog}
 *                 resource="customers"
 *             >
 *                 <CustomerForm />
 *             </CreateDialog>
 *         </SimpleForm>
 *     );
 * };
 */
var CreateDialog = function (_a) {
    var _b;
    var close = _a.close, props = __rest(_a, ["close"]);
    var resource = (0, react_admin_1.useResourceContext)(props);
    var context = (0, useFormDialogContext_1.useFormDialogContext)(props);
    var closeEvent = (0, react_admin_1.useEvent)((_b = context === null || context === void 0 ? void 0 : context.close) !== null && _b !== void 0 ? _b : close);
    if (context) {
        return (React.createElement(CreateDialogView, __assign({ resource: resource }, context, props, { close: closeEvent })));
    }
    return (React.createElement(react_router_dom_1.Routes, null,
        React.createElement(react_router_dom_1.Route, { path: "create/*", element: React.createElement(CreateDialogView, __assign({ resource: resource, isOpen: true }, props, { close: close != null ? closeEvent : undefined })) })));
};
exports.CreateDialog = CreateDialog;
var CreateDialogView = function (_a) {
    var children = _a.children, _b = _a.mutationOptions, mutationOptionsProp = _b === void 0 ? {} : _b, title = _a.title, _c = _a.redirect, redirectTo = _c === void 0 ? 'list' : _c, props = __rest(_a, ["children", "mutationOptions", "title", "redirect"]);
    var redirect = (0, react_admin_1.useRedirect)();
    var notify = (0, react_admin_1.useNotify)();
    var onSuccess = mutationOptionsProp.onSuccess, otherMutationOptions = __rest(mutationOptionsProp, ["onSuccess"]);
    var queryClient = (0, react_query_1.useQueryClient)();
    var controllerProps = (0, react_admin_1.useCreateController)(__assign(__assign({}, props), { mutationOptions: __assign({ onSuccess: function (data, variables, context) {
                // Because redirecting to the list doesn't remount the List component, we need
                // to explicitly ask react-query to refresh the list queries
                queryClient.invalidateQueries([resource, 'getList']);
                queryClient.invalidateQueries([resource, 'getManyReference']);
                if (onSuccess) {
                    onSuccess(data, variables, context);
                    if (props.close) {
                        props.close();
                    }
                }
                else {
                    notify('ra.notification.created', {
                        type: 'info',
                        messageArgs: { smart_count: 1 },
                    });
                    if (props.close) {
                        props.close();
                    }
                    else {
                        redirect(redirectTo, props.resource, data.id, data, {
                            _scrollToTop: false,
                        });
                    }
                }
            } }, otherMutationOptions) }));
    var defaultTitle = controllerProps.defaultTitle, record = controllerProps.record, resource = controllerProps.resource;
    var handleClose = function (event, reason) {
        if (props.close) {
            props.close(event, reason);
        }
        else {
            redirect('list', props.resource, undefined, undefined, {
                _scrollToTop: false,
            });
        }
    };
    return (React.createElement(material_1.Dialog, __assign({ open: props.isOpen, "aria-labelledby": "create-dialog-title", onClose: handleClose, "data-testid": "create-dialog" }, sanitizeRestProps(props)),
        React.createElement(FormDialogTitle_1.FormDialogTitle, { id: "create-dialog-title", title: title, defaultTitle: defaultTitle, record: record, onClose: handleClose }),
        React.createElement(react_admin_1.CreateContextProvider, { value: controllerProps }, children)));
};
/* eslint-disable @typescript-eslint/no-unused-vars */
var sanitizeRestProps = function (_a) {
    var _b = _a.basePath, basePath = _b === void 0 ? null : _b, _c = _a.hasCreate, hasCreate = _c === void 0 ? null : _c, _d = _a.hasEdit, hasEdit = _d === void 0 ? null : _d, _e = _a.hasList, hasList = _e === void 0 ? null : _e, _f = _a.hasShow, hasShow = _f === void 0 ? null : _f, _g = _a.history, history = _g === void 0 ? null : _g, _h = _a.loaded, loaded = _h === void 0 ? null : _h, _j = _a.loading, loading = _j === void 0 ? null : _j, _k = _a.location, location = _k === void 0 ? null : _k, _l = _a.match, match = _l === void 0 ? null : _l, _m = _a.mutationOptions, mutationOptions = _m === void 0 ? null : _m, _o = _a.options, options = _o === void 0 ? null : _o, _p = _a.permissions, permissions = _p === void 0 ? null : _p, _q = _a.transform, transform = _q === void 0 ? null : _q, _r = _a.isOpen, isOpen = _r === void 0 ? null : _r, _s = _a.open, open = _s === void 0 ? null : _s, _t = _a.close, close = _t === void 0 ? null : _t, rest = __rest(_a, ["basePath", "hasCreate", "hasEdit", "hasList", "hasShow", "history", "loaded", "loading", "location", "match", "mutationOptions", "options", "permissions", "transform", "isOpen", "open", "close"]);
    return rest;
};
/* eslint-enable @typescript-eslint/no-unused-vars */
