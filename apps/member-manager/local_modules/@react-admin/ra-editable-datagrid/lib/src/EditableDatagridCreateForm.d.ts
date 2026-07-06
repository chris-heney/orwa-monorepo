import * as React from 'react';
import { ReactElement, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { CreateParams, RaRecord, TransformData } from 'react-admin';
import { UseMutationOptions } from 'react-query';
declare const EditableDatagridCreateForm: {
    (props: EditableDatagridCreateFormProps): React.JSX.Element;
    propTypes: {
        expand: PropTypes.Requireable<NonNullable<PropTypes.ReactElementLike | PropTypes.ReactComponentLike>>;
        hasBulkActions: PropTypes.Validator<boolean>;
        resource: PropTypes.Requireable<string>;
        createForm: PropTypes.Requireable<PropTypes.ReactElementLike>;
        hasStandaloneCreateForm: PropTypes.Requireable<boolean>;
        isStandaloneCreateFormVisible: PropTypes.Validator<boolean>;
        closeStandaloneCreateForm: PropTypes.Validator<(...args: any[]) => any>;
    };
};
export interface EditableDatagridCreateFormProps<RecordType extends Omit<RaRecord, 'id'> = RaRecord> {
    expand?: ReactNode;
    hasBulkActions?: boolean;
    resource?: string;
    createForm?: ReactElement;
    hasStandaloneCreateForm?: boolean;
    isStandaloneCreateFormVisible: boolean;
    closeStandaloneCreateForm: () => void;
    mutationOptions?: UseMutationOptions<RecordType, unknown, CreateParams<RecordType>>;
    transform?: TransformData;
}
export default EditableDatagridCreateForm;
//# sourceMappingURL=EditableDatagridCreateForm.d.ts.map