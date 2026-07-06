import React, { BaseSyntheticEvent } from 'react';
import { CreateParams, RaRecord, UpdateParams, TransformData } from 'react-admin';
import { UseMutationOptions } from 'react-query';
export declare const SaveRowButton: <RecordType extends Omit<RaRecord<import("react-admin").Identifier>, "id"> = RaRecord<import("react-admin").Identifier>>({ handleSubmit, saving, submitOnEnter, mutationOptions, transform, }: SaveRowButtonProps<RecordType>) => React.JSX.Element;
export interface SaveRowButtonProps<RecordType extends Omit<RaRecord, 'id'> = RaRecord> {
    handleSubmit: (e: BaseSyntheticEvent) => void;
    mutationOptions?: UseMutationOptions<RecordType, unknown, CreateParams<RecordType> | UpdateParams<RecordType & {
        id: RaRecord['id'];
    }>>;
    saving?: boolean;
    submitOnEnter?: boolean;
    transform?: TransformData;
}
//# sourceMappingURL=SaveRowButton.d.ts.map