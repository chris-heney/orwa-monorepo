import React, { Fragment, ReactElement, ReactEventHandler } from 'react';
import PropTypes from 'prop-types';
import { IconButton, Tooltip } from '@mui/material';
import ActionDelete from '@mui/icons-material/Delete';
import clsx from 'clsx';
import inflection from 'inflection';
import { UseMutationOptions } from 'react-query';
import {
    Confirm,
    DeleteParams,
    MutationMode,
    RaRecord,
    RedirectionSideEffect,
    useDeleteWithConfirmController,
    useRecordContext,
    useResourceContext,
    useTranslate,
} from 'react-admin';

export const DeleteWithConfirmIconButton = <RecordType extends RaRecord = any>(
    props: DeleteWithConfirmIconButtonProps<RecordType>
) => {
    const {
        className,
        confirmContent = 'ra.message.delete_content',
        confirmTitle = 'ra.message.delete_title',
        label = 'ra.action.delete',
        mutationMode,
        mutationOptions,
        onClick,
        redirect: redirectTo = 'list',
        translateOptions = {},
    } = props;
    const record = useRecordContext(props);
    const resource = useResourceContext(props);

    const {
        open,
        isLoading,
        handleDialogOpen,
        handleDialogClose,
        handleDelete,
    } = useDeleteWithConfirmController({
        mutationMode,
        mutationOptions,
        onClick,
        resource,
        record,
        redirect: redirectTo,
    });
    const translate = useTranslate();
    const translatedLabel = translate(label, { _: label });

    return (
        <Fragment>
            <Tooltip title={translatedLabel}>
                <IconButton
                    aria-label={translatedLabel}
                    onClick={handleDialogOpen}
                    className={clsx('ra-delete-button', className)}
                    key="button"
                    size="small"
                >
                    <ActionDelete color="error" />
                </IconButton>
            </Tooltip>
            <Confirm
                isOpen={open}
                loading={isLoading}
                title={confirmTitle}
                content={confirmContent}
                translateOptions={{
                    name: translate(`resources.${resource}.forcedCaseName`, {
                        smart_count: 1,
                        _: inflection.humanize(
                            translate(`resources.${resource}.name`, {
                                smart_count: 1,
                                _: inflection.singularize(resource),
                            }),
                            true
                        ),
                    }),
                    id: record?.id,
                    ...translateOptions,
                }}
                onConfirm={handleDelete}
                onClose={handleDialogClose}
            />
        </Fragment>
    );
};

export interface DeleteWithConfirmIconButtonProps<
    RecordType extends RaRecord = any,
    MutationOptionsError = unknown
> {
    className?: string;
    confirmContent?: string;
    confirmTitle?: string;
    icon?: ReactElement;
    label?: string;
    mutationMode?: MutationMode;
    mutationOptions?: UseMutationOptions<
        RecordType,
        MutationOptionsError,
        DeleteParams<RecordType>
    >;
    onClick?: ReactEventHandler<any>;
    record?: RaRecord;
    redirect?: RedirectionSideEffect;
    resource?: string;
    submitOnEnter?: boolean;
    translateOptions?: Record<string, any>;
}

DeleteWithConfirmIconButton.propTypes = {
    className: PropTypes.string,
    confirmContent: PropTypes.string,
    confirmTitle: PropTypes.string,
    icon: PropTypes.element,
    label: PropTypes.string,
    mutationMode: PropTypes.oneOf(['pessimistic', 'optimistic', 'undoable']),
    mutationOptions: PropTypes.object,
    onClick: PropTypes.func,
    record: PropTypes.any,
    redirect: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
        PropTypes.func,
    ]),
    resource: PropTypes.string,
    submitOnEnter: PropTypes.bool,
    translateOptions: PropTypes.object,
};
