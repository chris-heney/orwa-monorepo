import * as React from 'react';
import { UseMutationOptions } from 'react-query';
import { MutationMode, RaRecord, DeleteParams } from 'react-admin';
import { DeleteWithConfirmIconButton } from './DeleteWithConfirmIconButton';
import { DeleteWithUndoIconButton } from './DeleteWithUndoIconButton';

export const DeleteRowButton = ({
    mutationMode,
    ...rest
}: DeleteRowButtonProps) => {
    return mutationMode === 'undoable' ? (
        <DeleteWithUndoIconButton {...rest} />
    ) : (
        <DeleteWithConfirmIconButton mutationMode={mutationMode} {...rest} />
    );
};

export interface DeleteRowButtonProps<
    RecordType extends RaRecord = any,
    MutationOptionsError = unknown
> {
    mutationMode?: MutationMode;
    mutationOptions?: UseMutationOptions<
        RecordType,
        MutationOptionsError,
        DeleteParams<RecordType>
    >;
    record?: RaRecord;
    resource?: string;
}

export default DeleteRowButton;
