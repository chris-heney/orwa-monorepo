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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import * as React from 'react';
import { cloneElement, createElement, forwardRef, isValidElement, useState, useMemo, } from 'react';
import { styled, Table } from '@mui/material';
import { Datagrid, useResourceContext, useListContext, useRedirect, DatagridRoot, sanitizeListRestProps, injectedProps, DatagridHeader, ListNoResults, } from 'react-admin';
import clsx from 'clsx';
import { ActionsColumn } from './ActionsColumn';
import EditableDatagridBody from './EditableDatagridBody';
import { EditableDatagridContextProvider } from './EditableDatagridContext';
import { CreateButton, InlineCreateButton } from './buttons';
import { useMatch } from 'react-router-dom';
/**
 * Component to display and edit tabular data.
 *
 * To be used as child of <List> or <ReferenceManyField>.
 * The <EditableDatagrid> expects the same props as <Datagrid>, plus 5 more props:
 *
 * - editForm: a component to display instead of a row when the user edits a record
 * - createForm: a component to display as the first row when the user creates a record
 * - noDelete: disable the inline Delete button
 * - actions: a component to display instead of the default actions
 * - mutationMode: the mutation mode to use for the inline form (default to undoable)
 *
 * The component renders the editForm and createForm elements in a <table>, so they
 * should render a <tr>. We advise you to use <RowForm> for editForm and createForm.
 *
 * Note: No need to include an <EditButton> as child, the <EditableDatagrid>
 * component adds a column with edit/delete/save/cancel buttons itself.
 *
 * Note: To display a custom create button, pass a custom component as the `empty` prop. It can use the `useEditableDatagridContext` hook to access to `openStandaloneCreateForm` and `closeStandaloneCreateForm` callbacks.
 *
 * Note: To enable the create form in a <List>, you should add the `hasCreate`
 * prop to the <List> component.
 *
 * @example
 *
 *     const ArtistList = () => (
 *         <List hasCreate>
 *             <EditableDatagrid
 *                 createForm={<ArtistForm />}
 *                 editForm={<ArtistForm />}
 *                 empty={<CustomEmptyComponent />}
 *             >
 *                 <TextField source="id" />
 *                 <TextField source="firstname" />
 *                 <TextField source="name" />
 *                 <DateField source="dob" label="born" />
 *                 <SelectField
 *                     source="prof"
 *                     label="Profession"
 *                     choices={professionChoices}
 *                 />
 *             </EditableDatagrid>
 *         </List>
 *     );
 *
 *      const CustomEmptyComponent = () => {
 *          const { openStandaloneCreateForm } = useEditableDatagridContext();
 *
 *          const handleClick = () => {
 *              openStandaloneCreateForm();
 *          };
 *          return (
 *              <>
 *                  <p>Here a custom empty component</p>
 *                  <Button
 *                      size="small"
 *                      color="primary"
 *                      variant="outlined"
 *                      onClick={handleClick}
 *                  >
 *                      Custom Create Button
 *                  </Button>
 *              </>
 *          );
 *      };
 *
 *     const ArtistForm = () => (
 *         <RowForm>
 *             <TextField source="id" />
 *             <TextInput source="firstname" validate={required()} />
 *             <TextInput source="name" validate={required()} />
 *             <DateInput source="dob" label="born" validate={required()} />
 *             <SelectInput
 *                 source="prof"
 *                 label="Profession"
 *                 choices={professionChoices}
 *             />
 *         </RowForm>
 *     );
 *
 * @example // inside a <ReferenceManyField> - remember to set the foreign ket in the createForm using defaultValues
 *
 *     const OrderEdit = () => (
 *         <Edit>
 *             <SimpleForm>
 *                 <ReferenceManyField
 *                     fullWidth
 *                     label="Products"
 *                     reference="products"
 *                     target="order_id"
 *                 >
 *                     <EditableDatagrid
 *                         createForm={<ProductForm />}
 *                         editForm={<ProductForm />}
 *                     >
 *                         <TextField source="id" />
 *                         <TextField source="name" />
 *                         <NumberField source="price" label="Default Price" />
 *                         <DateField source="available_since" />
 *                     </EditableDatagrid>
 *                 </ReferenceManyField>
 *                 <DateInput source="purchase_date" />
 *             </SimpleForm>
 *         </Edit>
 *     );
 *
 *     const ProductForm = () => {
 *         const orderRecord = useRecordContext();
 *
 *         return (
 *             <RowForm defaultValues={{ order_id: orderRecord.id }}>
 *                 <TextField source="id" disabled />
 *                 <TextInput source="name" validate={required()} />
 *                 <NumberInput
 *                     source="price"
 *                     label="Default Price"
 *                     validate={required()}
 *                 />
 *                 <DateInput source="available_since" validate={required()} />
 *             </RowForm>
 *         );
 *     };
 *
 * @see Datagrid for the other props
 * @see RowForm for the create and edit form
 */
var EditableDatagrid = forwardRef(function (props, ref) {
    var actions = props.actions, bulkActionButtons = props.bulkActionButtons, className = props.className, children = props.children, createForm = props.createForm, editForm = props.editForm, empty = props.empty, expand = props.expand, _a = props.header, header = _a === void 0 ? DatagridHeader : _a, _b = props.mutationMode, mutationMode = _b === void 0 ? 'undoable' : _b, noDelete = props.noDelete, _c = props.size, size = _c === void 0 ? 'small' : _c, rest = __rest(props, ["actions", "bulkActionButtons", "className", "children", "createForm", "editForm", "empty", "expand", "header", "mutationMode", "noDelete", "size"]);
    var resource = useResourceContext(props);
    var redirect = useRedirect();
    var _d = useListContext(), data = _d.data, defaultTitle = _d.defaultTitle, sort = _d.sort, setSort = _d.setSort, selectedIds = _d.selectedIds;
    var _e = useState(false), isStandaloneCreateFormVisible = _e[0], setShowStandaloneCreateForm = _e[1];
    // If EditableDatagrid is in a List view, the create form is displayed based on the route
    // If not, the create form is displayed based on an internal state (see EditableDatagridBody)
    // In order to detect if we are in a List view, we check the props that are passed
    // We choose 'defaultTitle' since it's very unlikely to have this prop in a Reference field
    // Also, we don't want to have 'defaultTitle' in the Props type, to not confuse users
    var isInListView = defaultTitle !== null &&
        defaultTitle !== undefined &&
        defaultTitle !== '';
    var hasStandaloneCreateForm = !isInListView && Boolean(createForm);
    var openStandaloneCreateForm = function () {
        if (hasStandaloneCreateForm) {
            setShowStandaloneCreateForm(true);
        }
        else {
            redirect('create', resource);
        }
        // once the row is replaced by a form, focus the first input
        setTimeout(function () {
            var input = document.querySelectorAll('#new_record input')[0];
            input && input.focus && input.focus();
        }, 100); // FIXME not super robust
    };
    var closeStandaloneCreateForm = function () {
        if (hasStandaloneCreateForm) {
            setShowStandaloneCreateForm(false);
        }
        else {
            redirect('list', resource);
        }
    };
    var contextValue = useMemo(function () { return ({
        openStandaloneCreateForm: openStandaloneCreateForm,
        closeStandaloneCreateForm: closeStandaloneCreateForm,
    }); }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);
    var datagridBody = (React.createElement(EditableDatagridBody, { className: className, createForm: createForm, editForm: editForm, expand: expand, hasBulkActions: !!bulkActionButtons, hasStandaloneCreateForm: hasStandaloneCreateForm, isStandaloneCreateFormVisible: isStandaloneCreateFormVisible, closeStandaloneCreateForm: closeStandaloneCreateForm, mutationMode: mutationMode, resource: resource }));
    var actionsChildren = actions === false ? null : (React.createElement(ActionsColumn
    // Datagrid cells supports the label prop which accept a React element.
    , { 
        // Datagrid cells supports the label prop which accept a React element.
        label: hasStandaloneCreateForm ? (React.createElement(InlineCreateButton, { onClick: openStandaloneCreateForm })) : (''), mutationMode: mutationMode, noDelete: noDelete, redirect: isInListView ? 'list' : false }, actions));
    var matchCreate = useMatch("/".concat(resource, "/create/*"));
    var shouldRenderDatagridBodyForCreation = isStandaloneCreateFormVisible || matchCreate !== null;
    var shouldRenderCustomEmpty = empty &&
        React.isValidElement(empty) &&
        !shouldRenderDatagridBodyForCreation;
    var shouldRenderDefaultEmpty = !shouldRenderDatagridBodyForCreation;
    var shouldRenderCreateButton = hasStandaloneCreateForm && !shouldRenderDatagridBodyForCreation;
    return (React.createElement(EditableDatagridContextProvider, { value: contextValue },
        React.createElement(Root, __assign({ body: datagridBody, bulkActionButtons: bulkActionButtons, expand: expand, resource: resource, header: header, size: size, empty: React.createElement(React.Fragment, null,
                shouldRenderCustomEmpty ? (empty) : shouldRenderCreateButton ? (React.createElement(CreateButton, { resource: resource, onClick: openStandaloneCreateForm })) : shouldRenderDefaultEmpty ? (React.createElement(ListNoResults, null)) : null,
                shouldRenderDatagridBodyForCreation ? (
                // TODO: The DataGrid wrapper (DatagridRoot + Table + Headers) should be extracted
                // to a dedicated component in react-admin to avoid duplicating it here
                React.createElement(DatagridRoot, { className: DatagridClasses.root },
                    React.createElement("div", { className: DatagridClasses.tableWrapper },
                        React.createElement(Table, __assign({ ref: ref, className: clsx(DatagridClasses.table, className), size: size }, sanitizeRestProps(rest)),
                            createOrCloneElement(header, {
                                children: children,
                                sort: sort,
                                data: data,
                                hasExpand: !!expand,
                                hasBulkActions: false,
                                isRowSelectable: rest.isRowSelectable,
                                onSelect: rest.onSelect,
                                resource: resource,
                                selectedIds: selectedIds,
                                setSort: setSort,
                            }, children, actionsChildren),
                            datagridBody)))) : null) }, rest),
            children,
            actionsChildren)));
});
EditableDatagrid.displayName = 'EditableDatagrid';
var createOrCloneElement = function (element, props) {
    var children = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        children[_i - 2] = arguments[_i];
    }
    return isValidElement(element)
        ? cloneElement.apply(void 0, __spreadArray([element, props], children, false)) : createElement.apply(void 0, __spreadArray([element, props], children, false));
};
var dataGridProps = ['rowClick', 'optimized', 'isRowSelectable'];
var sanitizeRestProps = function (props) {
    return Object.keys(sanitizeListRestProps(props))
        .filter(function (propName) {
        return !injectedProps.includes(propName) &&
            !dataGridProps.includes(propName);
    })
        .reduce(function (acc, key) {
        var _a;
        return (__assign(__assign({}, acc), (_a = {}, _a[key] = props[key], _a)));
    }, {});
};
var PREFIX = 'RaEditableDatagrid';
export var DatagridClasses = {
    root: "".concat(PREFIX, "-root"),
    table: "".concat(PREFIX, "-table"),
    tableWrapper: "".concat(PREFIX, "-tableWrapper"),
    thead: "".concat(PREFIX, "-thead"),
    tbody: "".concat(PREFIX, "-tbody"),
    headerRow: "".concat(PREFIX, "-headerRow"),
    headerCell: "".concat(PREFIX, "-headerCell"),
    checkbox: "".concat(PREFIX, "-checkbox"),
    row: "".concat(PREFIX, "-row"),
    clickableRow: "".concat(PREFIX, "-clickableRow"),
    rowEven: "".concat(PREFIX, "-rowEven"),
    rowOdd: "".concat(PREFIX, "-rowOdd"),
    rowCell: "".concat(PREFIX, "-rowCell"),
    expandHeader: "".concat(PREFIX, "-expandHeader"),
    expandIconCell: "".concat(PREFIX, "-expandIconCell"),
    expandIcon: "".concat(PREFIX, "-expandIcon"),
    expanded: "".concat(PREFIX, "-expanded"),
    expandedPanel: "".concat(PREFIX, "-expandedPanel"),
};
var Root = styled(Datagrid, {
    name: PREFIX,
    overridesResolver: function (props, styles) { return styles.root; },
})(function (_a) {
    var _b;
    var theme = _a.theme;
    return (_b = {},
        _b["& .".concat(DatagridClasses.table)] = {
            tableLayout: 'auto',
        },
        _b["& .".concat(DatagridClasses.tableWrapper)] = {},
        _b["& .".concat(DatagridClasses.thead)] = {},
        _b["& .".concat(DatagridClasses.tbody)] = {},
        _b["& .".concat(DatagridClasses.headerRow)] = {},
        _b["& .".concat(DatagridClasses.headerCell)] = {
            position: 'sticky',
            top: 0,
            zIndex: 2,
            backgroundColor: theme.palette.background.paper,
            '&:first-of-type': {
                borderTopLeftRadius: theme.shape.borderRadius,
            },
            '&:last-child': {
                borderTopRightRadius: theme.shape.borderRadius,
            },
        },
        _b["& .".concat(DatagridClasses.checkbox)] = {},
        _b["& .".concat(DatagridClasses.row)] = {},
        _b["& .".concat(DatagridClasses.clickableRow)] = {
            cursor: 'pointer',
        },
        _b["& .".concat(DatagridClasses.rowEven)] = {},
        _b["& .".concat(DatagridClasses.rowOdd)] = {},
        _b["& .".concat(DatagridClasses.rowCell)] = {},
        _b["& .".concat(DatagridClasses.expandHeader)] = {
            padding: 0,
            width: theme.spacing(6),
        },
        _b["& .".concat(DatagridClasses.expandIconCell)] = {
            width: theme.spacing(6),
        },
        _b["& .".concat(DatagridClasses.expandIcon)] = {
            padding: theme.spacing(1),
            transform: 'rotate(-90deg)',
            transition: theme.transitions.create('transform', {
                duration: theme.transitions.duration.shortest,
            }),
        },
        _b["& .".concat(DatagridClasses.expandIcon, ".").concat(DatagridClasses.expanded)] = {
            transform: 'rotate(0deg)',
        },
        _b["& .".concat(DatagridClasses.expandedPanel)] = {},
        _b);
});
export default EditableDatagrid;
