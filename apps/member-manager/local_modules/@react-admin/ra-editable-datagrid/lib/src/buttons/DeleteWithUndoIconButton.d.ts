import React, { ReactElement } from 'react';
import PropTypes from 'prop-types';
import { UseMutationOptions } from 'react-query';
import { RaRecord, RedirectionSideEffect, DeleteParams } from 'react-admin';
export declare const DeleteWithUndoIconButton: {
    (props: DeleteWithUndoIconButtonProps): React.JSX.Element;
    propTypes: {
        className: PropTypes.Requireable<string>;
        confirmTitle: PropTypes.Requireable<string>;
        confirmContent: PropTypes.Requireable<string>;
        label: PropTypes.Requireable<string>;
        mutationOptions: PropTypes.Requireable<object>;
        onClick: PropTypes.Requireable<(...args: any[]) => any>;
        record: PropTypes.Requireable<any>;
        redirect: PropTypes.Requireable<NonNullable<string | boolean | ((...args: any[]) => any)>>;
        resource: PropTypes.Requireable<string>;
        icon: PropTypes.Requireable<PropTypes.ReactElementLike>;
    };
};
export type DeleteWithUndoIconButtonProps<RecordType extends RaRecord = any, MutationOptionsError = unknown> = {
    className?: string;
    confirmTitle?: string;
    confirmContent?: string;
    icon?: ReactElement;
    label?: string;
    mutationOptions?: UseMutationOptions<RecordType, MutationOptionsError, DeleteParams<RecordType>>;
    onClick?: (e: MouseEvent) => void;
    record?: RaRecord;
    redirect?: RedirectionSideEffect;
    resource?: string;
    invalid?: boolean;
    pristine?: boolean;
    saving?: boolean;
    submitOnEnter?: boolean;
};
//# sourceMappingURL=DeleteWithUndoIconButton.d.ts.map