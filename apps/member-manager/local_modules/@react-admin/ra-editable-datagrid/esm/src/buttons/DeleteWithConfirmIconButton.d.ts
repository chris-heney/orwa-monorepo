import React, { ReactElement, ReactEventHandler } from 'react';
import PropTypes from 'prop-types';
import { UseMutationOptions } from 'react-query';
import { DeleteParams, MutationMode, RaRecord, RedirectionSideEffect } from 'react-admin';
export declare const DeleteWithConfirmIconButton: {
    <RecordType extends RaRecord<import("react-admin").Identifier> = any>(props: DeleteWithConfirmIconButtonProps<RecordType, unknown>): React.JSX.Element;
    propTypes: {
        className: PropTypes.Requireable<string>;
        confirmContent: PropTypes.Requireable<string>;
        confirmTitle: PropTypes.Requireable<string>;
        icon: PropTypes.Requireable<PropTypes.ReactElementLike>;
        label: PropTypes.Requireable<string>;
        mutationMode: PropTypes.Requireable<string>;
        mutationOptions: PropTypes.Requireable<object>;
        onClick: PropTypes.Requireable<(...args: any[]) => any>;
        record: PropTypes.Requireable<any>;
        redirect: PropTypes.Requireable<NonNullable<string | boolean | ((...args: any[]) => any)>>;
        resource: PropTypes.Requireable<string>;
        submitOnEnter: PropTypes.Requireable<boolean>;
        translateOptions: PropTypes.Requireable<object>;
    };
};
export interface DeleteWithConfirmIconButtonProps<RecordType extends RaRecord = any, MutationOptionsError = unknown> {
    className?: string;
    confirmContent?: string;
    confirmTitle?: string;
    icon?: ReactElement;
    label?: string;
    mutationMode?: MutationMode;
    mutationOptions?: UseMutationOptions<RecordType, MutationOptionsError, DeleteParams<RecordType>>;
    onClick?: ReactEventHandler<any>;
    record?: RaRecord;
    redirect?: RedirectionSideEffect;
    resource?: string;
    submitOnEnter?: boolean;
    translateOptions?: Record<string, any>;
}
//# sourceMappingURL=DeleteWithConfirmIconButton.d.ts.map