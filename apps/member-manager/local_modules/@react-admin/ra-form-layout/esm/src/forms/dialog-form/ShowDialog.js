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
import * as React from 'react';
import { ShowContextProvider, useShowController, useRedirect, useResourceContext, useRecordContext, useEvent, } from 'react-admin';
import { Dialog } from '@mui/material';
import { FormDialogTitle } from './FormDialogTitle';
import { useParams, Routes, Route } from 'react-router-dom';
import { useFormDialogContext } from './useFormDialogContext';
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
export var ShowDialog = function (_a) {
    var _b;
    var close = _a.close, props = __rest(_a, ["close"]);
    var resource = useResourceContext(props);
    var context = useFormDialogContext(props);
    var record = useRecordContext(props);
    var closeEvent = useEvent((_b = context === null || context === void 0 ? void 0 : context.close) !== null && _b !== void 0 ? _b : close);
    if (context) {
        return (React.createElement(ShowDialogView, __assign({ resource: resource, id: record === null || record === void 0 ? void 0 : record.id }, context, props, { close: closeEvent })));
    }
    return (React.createElement(Routes, null,
        React.createElement(Route, { path: ":id/show/*", element: React.createElement(ShowDialogView, __assign({ resource: resource }, props, { close: close != null ? closeEvent : undefined })) })));
};
var ShowDialogView = function (_a) {
    var _b;
    var close = _a.close, props = __rest(_a, ["close"]);
    var redirect = useRedirect();
    var params = useParams();
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
    return (React.createElement(Dialog, __assign({ open: open, "aria-labelledby": "show-dialog-title", onClose: handleClose, "data-testid": "show-dialog" }, sanitizeRestProps(props)), open ? (React.createElement(ShowDialogContentView, __assign({}, props, { onClose: handleClose }))) : null));
};
var ShowDialogContentView = function (_a) {
    var children = _a.children, onClose = _a.onClose, title = _a.title, _b = _a.emptyWhileLoading, emptyWhileLoading = _b === void 0 ? false : _b, props = __rest(_a, ["children", "onClose", "title", "emptyWhileLoading"]);
    var controllerProps = useShowController(props);
    var defaultTitle = controllerProps.defaultTitle, record = controllerProps.record;
    if (!children || (!record && emptyWhileLoading)) {
        return null;
    }
    return (React.createElement(React.Fragment, null,
        React.createElement(ShowContextProvider, { value: controllerProps },
            React.createElement(FormDialogTitle, { id: "show-dialog-title", title: title, defaultTitle: defaultTitle, onClose: onClose, record: record }),
            children)));
};
/* eslint-disable @typescript-eslint/no-unused-vars */
var sanitizeRestProps = function (_a) {
    var _b = _a.basePath, basePath = _b === void 0 ? null : _b, _c = _a.hasCreate, hasCreate = _c === void 0 ? null : _c, _d = _a.hasEdit, hasEdit = _d === void 0 ? null : _d, _e = _a.hasShow, hasShow = _e === void 0 ? null : _e, _f = _a.hasList, hasList = _f === void 0 ? null : _f, _g = _a.history, history = _g === void 0 ? null : _g, _h = _a.id, id = _h === void 0 ? null : _h, _j = _a.loaded, loaded = _j === void 0 ? null : _j, _k = _a.loading, loading = _k === void 0 ? null : _k, _l = _a.location, location = _l === void 0 ? null : _l, _m = _a.match, match = _m === void 0 ? null : _m, _o = _a.queryOptions, queryOptions = _o === void 0 ? null : _o, _p = _a.options, options = _p === void 0 ? null : _p, _q = _a.permissions, permissions = _q === void 0 ? null : _q, _r = _a.successMessage, successMessage = _r === void 0 ? null : _r, _s = _a.title, title = _s === void 0 ? null : _s, _t = _a.isOpen, isOpen = _t === void 0 ? null : _t, _u = _a.open, open = _u === void 0 ? null : _u, _v = _a.close, close = _v === void 0 ? null : _v, _w = _a.emptyWhileLoading, emptyWhileLoading = _w === void 0 ? null : _w, rest = __rest(_a, ["basePath", "hasCreate", "hasEdit", "hasShow", "hasList", "history", "id", "loaded", "loading", "location", "match", "queryOptions", "options", "permissions", "successMessage", "title", "isOpen", "open", "close", "emptyWhileLoading"]);
    return rest;
};
/* eslint-enable @typescript-eslint/no-unused-vars */
