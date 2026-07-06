import React, { ReactNode, ReactElement } from 'react';
import PropTypes from 'prop-types';
import { DatagridBodyProps, MutationMode } from 'react-admin';
declare const EditableDatagridBody: {
    (props: EditableDatagridBodyProps): React.JSX.Element;
    propTypes: {
        className: PropTypes.Requireable<string>;
        children: PropTypes.Requireable<PropTypes.ReactNodeLike>;
        data: PropTypes.Validator<any[]>;
        expand: PropTypes.Requireable<NonNullable<PropTypes.ReactElementLike | PropTypes.ReactComponentLike>>;
        hasBulkActions: PropTypes.Validator<boolean>;
        hover: PropTypes.Requireable<boolean>;
        onToggleItem: PropTypes.Requireable<(...args: any[]) => any>;
        resource: PropTypes.Requireable<string>;
        rowClick: PropTypes.Requireable<NonNullable<string | ((...args: any[]) => any)>>;
        rowStyle: PropTypes.Requireable<(...args: any[]) => any>;
        selectedIds: PropTypes.Requireable<any[]>;
        isRowSelectable: PropTypes.Requireable<(...args: any[]) => any>;
        version: PropTypes.Requireable<number>;
    };
    defaultProps: {
        data: any[];
        hasBulkActions: boolean;
    };
    muiName: string;
};
export interface EditableDatagridBodyProps extends DatagridBodyProps {
    children?: ReactNode;
    editForm?: ReactElement;
    createForm?: ReactElement;
    mutationMode?: MutationMode;
    hasStandaloneCreateForm?: boolean;
    isStandaloneCreateFormVisible: boolean;
    closeStandaloneCreateForm: () => void;
}
export default EditableDatagridBody;
//# sourceMappingURL=EditableDatagridBody.d.ts.map