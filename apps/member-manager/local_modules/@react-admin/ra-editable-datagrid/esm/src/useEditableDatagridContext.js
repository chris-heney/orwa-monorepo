import { useContext, useMemo } from 'react';
import { EditableDatagridContext, } from './EditableDatagridContext';
/**
 * A hook that returns the EditableDatagridContext.
 * This context provides access to some usefull functions for EditableDatagrid.
 * @param {Partial<EditableDatagridContextValue>} props Optional. Props to use instead of the values from the context.
 * @returns {EditableDatagridContextValue} The EditableDatagridContext.
 */
export var useEditableDatagridContext = function (props) {
    var context = useContext(EditableDatagridContext);
    if (context == null && props == null) {
        throw new Error('useEditableDatagridContext must be used within a EditableDatagridContext.');
    }
    var result = useMemo(function () {
        var _a, _b;
        return ({
            openStandaloneCreateForm: (_a = props === null || props === void 0 ? void 0 : props.openStandaloneCreateForm) !== null && _a !== void 0 ? _a : context === null || context === void 0 ? void 0 : context.openStandaloneCreateForm,
            closeStandaloneCreateForm: (_b = props === null || props === void 0 ? void 0 : props.closeStandaloneCreateForm) !== null && _b !== void 0 ? _b : context === null || context === void 0 ? void 0 : context.closeStandaloneCreateForm,
        });
    }, [props, context]);
    return result;
};
