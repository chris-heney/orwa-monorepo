import React, { ReactElement } from 'react';
import PropTypes from 'prop-types';
import { IconButton, Tooltip } from '@mui/material';
import ActionDelete from '@mui/icons-material/Delete';
import clsx from 'clsx';
import { UseMutationOptions } from 'react-query';
import {
    useTranslate,
    RaRecord,
    RedirectionSideEffect,
    useDeleteWithUndoController,
    useRecordContext,
    useResourceContext,
    DeleteParams,
} from 'react-admin';

export const DeleteWithUndoIconButton = (
    props: DeleteWithUndoIconButtonProps
) => {
    const {
        className,
        label = 'ra.action.delete',
        redirect: redirectTo = 'list',
        mutationOptions,
    } = props;
    const record = useRecordContext(props);
    const resource = useResourceContext(props);
    const { isLoading, handleDelete } = useDeleteWithUndoController({
        mutationOptions,
        resource,
        record,
        redirect: redirectTo,
    });
    const translate = useTranslate();
    const translatedLabel = translate(label, { _: label });
    return (
        <Tooltip title={translatedLabel}>
            <IconButton
                aria-label={translatedLabel}
                disabled={isLoading}
                onClick={handleDelete}
                className={clsx('ra-delete-button', className)}
                key="button"
                size="small"
            >
                <ActionDelete color="error" />
            </IconButton>
        </Tooltip>
    );
};

export type DeleteWithUndoIconButtonProps<
    RecordType extends RaRecord = any,
    MutationOptionsError = unknown
> = {
    className?: string;
    confirmTitle?: string;
    confirmContent?: string;
    icon?: ReactElement;
    label?: string;
    mutationOptions?: UseMutationOptions<
        RecordType,
        MutationOptionsError,
        DeleteParams<RecordType>
    >;
    onClick?: (e: MouseEvent) => void;
    record?: RaRecord;
    redirect?: RedirectionSideEffect;
    resource?: string;
    invalid?: boolean;
    pristine?: boolean;
    saving?: boolean;
    submitOnEnter?: boolean;
};

DeleteWithUndoIconButton.propTypes = {
    className: PropTypes.string,
    confirmTitle: PropTypes.string,
    confirmContent: PropTypes.string,
    label: PropTypes.string,
    mutationOptions: PropTypes.object,
    onClick: PropTypes.func,
    record: PropTypes.any,
    redirect: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
        PropTypes.func,
    ]),
    resource: PropTypes.string,
    icon: PropTypes.element,
};
