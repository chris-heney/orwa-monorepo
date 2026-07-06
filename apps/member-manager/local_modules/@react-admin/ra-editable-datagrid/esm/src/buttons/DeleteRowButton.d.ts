import * as React from 'react';
import { UseMutationOptions } from 'react-query';
import { MutationMode, RaRecord, DeleteParams } from 'react-admin';
export declare const DeleteRowButton: ({ mutationMode, ...rest }: DeleteRowButtonProps) => React.JSX.Element;
export interface DeleteRowButtonProps<RecordType extends RaRecord = any, MutationOptionsError = unknown> {
    mutationMode?: MutationMode;
    mutationOptions?: UseMutationOptions<RecordType, MutationOptionsError, DeleteParams<RecordType>>;
    record?: RaRecord;
    resource?: string;
}
export default DeleteRowButton;
//# sourceMappingURL=DeleteRowButton.d.ts.map