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
import * as React from 'react';
import { Children, isValidElement, useCallback } from 'react';
import { useSaveContext, useAugmentedForm, OptionalRecordContextProvider, useRecordContext, setSubmissionErrors, } from 'react-admin';
import { TableCell, styled } from '@mui/material';
import { FormProvider } from 'react-hook-form';
import { CancelEditButton, SaveRowButton } from './buttons';
/**
 * A form to be rendered as a table row in an <EditableDatagrid>.
 *
 * All the props it expects are injected by <EditableDatagrid>. You should only
 * provide children to be rendered in each table cell.
 *
 * The children should be Input components, just like in a <SimpleForm>. You
 * can also pass a <Field> component as child.
 *
 * <RowForm> should have as many children as the <EditableDatagrid> that calls
 * it, or there will be a colSpan issue.
 *
 * @example
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
 * @see EditableDatagrid
 */
var RowForm = function (props) {
    var children = props.children, id = props.id, className = props.className, expand = props.expand, hasBulkActions = props.hasBulkActions, defaultValues = props.defaultValues, mutationOptions = props.mutationOptions, selectable = props.selectable, resource = props.resource, saveProp = props.save, saving = props.saving, selected = props.selected, _a = props.submitOnEnter, submitOnEnter = _a === void 0 ? true : _a, transform = props.transform, rest = __rest(props, ["children", "id", "className", "expand", "hasBulkActions", "defaultValues", "mutationOptions", "selectable", "resource", "save", "saving", "selected", "submitOnEnter", "transform"]);
    var record = useRecordContext(props);
    var save = useSaveContext().save;
    var _b = useAugmentedForm(__assign({ defaultValues: __assign(__assign({}, defaultValues), record), record: record, onSubmit: save, mode: 'onSubmit' }, rest)), form = _b.form, formHandleSubmit = _b.formHandleSubmit;
    var hasSideEffects = (mutationOptions &&
        ((mutationOptions === null || mutationOptions === void 0 ? void 0 : mutationOptions.onSuccess) ||
            (mutationOptions === null || mutationOptions === void 0 ? void 0 : mutationOptions.onError) ||
            (mutationOptions === null || mutationOptions === void 0 ? void 0 : mutationOptions.meta))) ||
        transform;
    var handleSubmitWithSideEffects = useCallback(function (values) { return __awaiter(void 0, void 0, void 0, function () {
        var errors;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!save) return [3 /*break*/, 2];
                    return [4 /*yield*/, save(values, __assign(__assign({}, mutationOptions), { transform: transform }))];
                case 1:
                    errors = _a.sent();
                    _a.label = 2;
                case 2:
                    if (errors != null) {
                        setSubmissionErrors(errors, form.setError);
                    }
                    return [2 /*return*/];
            }
        });
    }); }, [form.setError, save, mutationOptions, transform]);
    // handle submit by enter
    var handleKeyDown = useCallback(function (event) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(event.key === 'Enter' && submitOnEnter)) return [3 /*break*/, 3];
                    if (!hasSideEffects) return [3 /*break*/, 2];
                    event.stopPropagation();
                    return [4 /*yield*/, form.handleSubmit(handleSubmitWithSideEffects)(event)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    formHandleSubmit(event);
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    }); }, [
        submitOnEnter,
        hasSideEffects,
        form,
        handleSubmitWithSideEffects,
        formHandleSubmit,
    ]);
    return (React.createElement(OptionalRecordContextProvider, { value: record },
        React.createElement(FormProvider, __assign({}, form),
            Children.map(children, function (field, index) {
                return isValidElement(field) ? (React.createElement(TableCell, { key: index, className: field.props.cellClassName, align: field.props.textAlign, onKeyDown: handleKeyDown }, field)) : null;
            }),
            React.createElement(RowFormActionsTableCell, { handleSubmit: formHandleSubmit, mutationOptions: mutationOptions, transform: transform }))));
};
var PREFIX = 'RaRowFormActionsTableCell';
var RowFormActionsTableCell = function (_a) {
    var handleSubmit = _a.handleSubmit, mutationOptions = _a.mutationOptions, transform = _a.transform;
    return (React.createElement(StyledTableCell, { className: "RaRowForm-actionColumn" },
        React.createElement(SaveRowButton, { handleSubmit: handleSubmit, mutationOptions: mutationOptions, transform: transform }),
        React.createElement(CancelEditButton, null)));
};
var StyledTableCell = styled(TableCell, {
    name: PREFIX,
    overridesResolver: function (props, styles) { return styles.root; },
})(function () { return ({
    whiteSpace: 'nowrap',
    width: '5em',
}); });
export default RowForm;
