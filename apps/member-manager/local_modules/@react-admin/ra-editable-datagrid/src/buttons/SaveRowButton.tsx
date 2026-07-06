import React, {
    MouseEventHandler,
    useCallback,
    BaseSyntheticEvent,
} from 'react';
import {
    CreateParams,
    RaRecord,
    UpdateParams,
    useSaveContext,
    useTranslate,
    TransformData,
    setSubmissionErrors,
} from 'react-admin';
import { Tooltip, IconButton } from '@mui/material';
import ContentSave from '@mui/icons-material/Save';
import { useFormContext } from 'react-hook-form';
import { UseMutationOptions } from 'react-query';

export const SaveRowButton = <
    RecordType extends Omit<RaRecord, 'id'> = RaRecord
>({
    handleSubmit,
    saving,
    submitOnEnter = true,
    mutationOptions,
    transform,
}: SaveRowButtonProps<RecordType>) => {
    const translate = useTranslate();
    const form = useFormContext();
    const saveContext = useSaveContext();
    const hasSideEffects =
        (mutationOptions &&
            (mutationOptions?.onSuccess ||
                mutationOptions?.onError ||
                mutationOptions?.meta)) ||
        transform;
    const type = !submitOnEnter || hasSideEffects ? 'button' : 'submit';
    const { id = 'new_record' } = form.getValues();

    const handleSubmitWithSideEffects = useCallback(
        async values => {
            let errors;
            if (saveContext?.save) {
                errors = await saveContext.save(values, {
                    ...mutationOptions,
                    transform,
                });
            }
            if (errors != null) {
                setSubmissionErrors(errors, form.setError);
            }
        },
        [form.setError, saveContext, mutationOptions, transform]
    );

    const onClick: MouseEventHandler<HTMLButtonElement> = useCallback(
        async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            if (type === 'button') {
                // this button doesn't submit the form, so it doesn't trigger useIsFormInvalid in <FormContent>
                // therefore we need to check for errors manually
                event.stopPropagation();
                await form.handleSubmit(handleSubmitWithSideEffects)(event);
            } else {
                handleSubmit(event);
            }
        },
        [type, form, handleSubmit, handleSubmitWithSideEffects]
    );

    const label = translate('ra.action.save', {
        _: 'ra.action.save',
    });

    return (
        <Tooltip title={label}>
            <IconButton
                aria-label={label}
                disabled={saving || saveContext.saving}
                onClick={onClick}
                size="small"
                color="primary"
                form={`row${id}`}
                type={type}
            >
                <ContentSave />
            </IconButton>
        </Tooltip>
    );
};

export interface SaveRowButtonProps<
    RecordType extends Omit<RaRecord, 'id'> = RaRecord
> {
    handleSubmit: (e: BaseSyntheticEvent) => void;
    mutationOptions?: UseMutationOptions<
        RecordType,
        unknown,
        | CreateParams<RecordType>
        | UpdateParams<RecordType & { id: RaRecord['id'] }>
    >;
    saving?: boolean;
    submitOnEnter?: boolean;
    transform?: TransformData;
}
