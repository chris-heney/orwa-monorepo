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
exports.ShowDialog = void 0;
var React = __importStar(require("react"));
var react_admin_1 = require("react-admin");
var material_1 = require("@mui/material");
var FormDialogTitle_1 = require("./FormDialogTitle");
var react_router_dom_1 = require("react-router-dom");
var useFormDialogContext_1 = require("./useFormDialogContext");
/**
 * A component which displays a show layout inside a dialog.
 *
 * By default, this components manages the open/close state of the dialog via the router.
 * In case it is used inside a `<FormDialogContext>`, or if the `isOpen`, `open` and `close`
 * props are provided directly, then the open/close state is managed by these values instead.
 *
 * @param {ShowDialogProps} props
 *
 * @example
 * const PostList = () => (
 *     <>
 *         <List>
 *             <Datagrid>
 *                 ...
 *             </Datagrid>
 *         </List>
 *         <ShowDialog>
 *             <SimpleShowLayout>
 *                 <TextField source="id" />
 *                 <TextField source="first_name" />
 *                 <TextField source="last_name" />
 *                 <DateField source="dob" label="born" />
 *                 <SelectField source="sex" choices={sexChoices} />
 *             </SimpleShowLayout>
 *         </ShowDialog>
 *     </>
 * );
 *
 * @example with a managed state
 * const CustomerShowForm = () => {
 *     const [isShowDialogOpen, setIsShowDialogOpen] = useState(false);
 *     const openShowDialog = useCallback(() => {
 *         setIsShowDialogOpen(true);
 *     }, []);
 *     const closeShowDialog = useCallback(() => {
 *         setIsShowDialogOpen(false);
 *     }, []);
 *
 *     return (
 *         <SimpleForm>
 *             <Button
 *                 label="Show customer #1"
 *                 onClick={() => openShowDialog()}
 *             />
 *             <ShowDialog
 *                 fullWidth
 *                 maxWidth="md"
 *                 isOpen={isShowDialogOpen}
 *                 open={openShowDialog}
 *                 close={closeShowDialog}
 *                 resource="customers"
 *                 record={{ id: 1 }}
 *             >
 *                 <CustomerSimpleShowLayout />
 *             </ShowDialog>
 *         </SimpleForm>
 *     );
 * };
 */
var ShowDialog = function (_a) {
    var _b;
    var close = _a.close, props = __rest(_a, ["close"]);
    var resource = (0, react_admin_1.useResourceContext)(props);
    var context = (0, useFormDialogContext_1.useFormDialogContext)(props);
    var record = (0, react_admin_1.useRecordContext)(props);
    var closeEvent = (0, react_admin_1.useEvent)((_b = context === null || context === void 0 ? void 0 : context.close) !== null && _b !== void 0 ? _b : close);
    if (context) {
        return (React.createElement(ShowDialogView, __assign({ resource: resource, id: record === null || record === void 0 ? void 0 : record.id }, context, props, { close: closeEvent })));
    }
    return (React.createElement(react_router_dom_1.Routes, null,
        React.createElement(react_router_dom_1.Route, { path: ":id/show/*", element: React.createElement(ShowDialogView, __assign({ resource: resource }, props, { close: close != null ? closeEvent : undefined })) })));
};
exports.ShowDialog = ShowDialog;
var ShowDialogView = function (_a) {
    var _b;
    var close = _a.close, props = __rest(_a, ["close"]);
    var redirect = (0, react_admin_1.useRedirect)();
    var params = (0, react_router_dom_1.useParams)();
    var handleClose = function (event, reason) {
        if (close) {
            close(event, reason);
        }
        else {
            redirect('list', props.resource, undefined, undefined, {
                _scrollToTop: false,
            });
        }
    };
    var isMatch = params.id && params.id !== 'create';
    var open = (_b = props.isOpen) !== null && _b !== void 0 ? _b : isMatch;
    return (React.createElement(material_1.Dialog, __assign({ open: open, "aria-labelledby": "show-dialog-title", onClose: handleClose, "data-testid": "show-dialog" }, sanitizeRestProps(props)), open ? (React.createElement(ShowDialogContentView, __assign({}, props, { onClose: handleClose }))) : null));
};
var ShowDialogContentView = function (_a) {
    var children = _a.children, onClose = _a.onClose, title = _a.title, _b = _a.emptyWhileLoading, emptyWhileLoading = _b === void 0 ? false : _b, props = __rest(_a, ["children", "onClose", "title", "emptyWhileLoading"]);
    var controllerProps = (0, react_admin_1.useShowController)(props);
    var defaultTitle = controllerProps.defaultTitle, record = controllerProps.record;
    if (!children || (!record && emptyWhileLoading)) {
        return null;
    }
    return (React.createElement(React.Fragment, null,
        React.createElement(react_admin_1.ShowContextProvider, { value: controllerProps },
            React.createElement(FormDialogTitle_1.FormDialogTitle, { id: "show-dialog-title", title: title, defaultTitle: defaultTitle, onClose: onClose, record: record }),
            children)));
};
/* eslint-disable @typescript-eslint/no-unused-vars */
var sanitizeRestProps = function (_a) {
    var _b = _a.basePath, basePath = _b === void 0 ? null : _b, _c = _a.hasCreate, hasCreate = _c === void 0 ? null : _c, _d = _a.hasEdit, hasEdit = _d === void 0 ? null : _d, _e = _a.hasShow, hasShow = _e === void 0 ? null : _e, _f = _a.hasList, hasList = _f === void 0 ? null : _f, _g = _a.history, history = _g === void 0 ? null : _g, _h = _a.id, id = _h === void 0 ? null : _h, _j = _a.loaded, loaded = _j === void 0 ? null : _j, _k = _a.loading, loading = _k === void 0 ? null : _k, _l = _a.location, location = _l === void 0 ? null : _l, _m = _a.match, match = _m === void 0 ? null : _m, _o = _a.queryOptions, queryOptions = _o === void 0 ? null : _o, _p = _a.options, options = _p === void 0 ? null : _p, _q = _a.permissions, permissions = _q === void 0 ? null : _q, _r = _a.successMessage, successMessage = _r === void 0 ? null : _r, _s = _a.title, title = _s === void 0 ? null : _s, _t = _a.isOpen, isOpen = _t === void 0 ? null : _t, _u = _a.open, open = _u === void 0 ? null : _u, _v = _a.close, close = _v === void 0 ? null : _v, _w = _a.emptyWhileLoading, emptyWhileLoading = _w === void 0 ? null : _w, rest = __rest(_a, ["basePath", "hasCreate", "hasEdit", "hasShow", "hasList", "history", "id", "loaded", "loading", "location", "match", "queryOptions", "options", "permissions", "successMessage", "title", "isOpen", "open", "close", "emptyWhileLoading"]);
    return rest;
};
/* eslint-enable @typescript-eslint/no-unused-vars */
