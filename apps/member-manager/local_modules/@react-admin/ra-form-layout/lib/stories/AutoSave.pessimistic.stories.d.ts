import React from 'react';
import { UpdateResult } from 'react-admin';
declare const _default: {
    title: string;
};
export default _default;
export declare const InSimpleForm: {
    ({ dataProvider, debounce, confirmationDuration, }: {
        dataProvider?: {
            update: (resource: any, params: any) => Promise<UpdateResult>;
            getList: <RecordType extends import("react-admin").RaRecord<import("react-admin").Identifier> = any>(resource: string, params: import("react-admin").GetListParams) => Promise<import("react-admin").GetListResult<RecordType>>;
            getOne: <RecordType_1 extends import("react-admin").RaRecord<import("react-admin").Identifier> = any>(resource: string, params: import("react-admin").GetOneParams<RecordType_1>) => Promise<import("react-admin").GetOneResult<RecordType_1>>;
            getMany: <RecordType_2 extends import("react-admin").RaRecord<import("react-admin").Identifier> = any>(resource: string, params: import("react-admin").GetManyParams) => Promise<import("react-admin").GetManyResult<RecordType_2>>;
            getManyReference: <RecordType_3 extends import("react-admin").RaRecord<import("react-admin").Identifier> = any>(resource: string, params: import("react-admin").GetManyReferenceParams) => Promise<import("react-admin").GetManyReferenceResult<RecordType_3>>;
            updateMany: <RecordType_4 extends import("react-admin").RaRecord<import("react-admin").Identifier> = any>(resource: string, params: import("react-admin").UpdateManyParams<any>) => Promise<import("react-admin").UpdateManyResult<RecordType_4>>;
            create: <RecordType_5 extends Omit<import("react-admin").RaRecord<import("react-admin").Identifier>, "id"> = any, ResultRecordType extends import("react-admin").RaRecord<import("react-admin").Identifier> = RecordType_5 & {
                id: import("react-admin").Identifier;
            }>(resource: string, params: import("react-admin").CreateParams<any>) => Promise<import("react-admin").CreateResult<ResultRecordType>>;
            delete: <RecordType_6 extends import("react-admin").RaRecord<import("react-admin").Identifier> = any>(resource: string, params: import("react-admin").DeleteParams<RecordType_6>) => Promise<import("react-admin").DeleteResult<RecordType_6>>;
            deleteMany: <RecordType_7 extends import("react-admin").RaRecord<import("react-admin").Identifier> = any>(resource: string, params: import("react-admin").DeleteManyParams<RecordType_7>) => Promise<import("react-admin").DeleteManyResult<RecordType_7>>;
        };
        debounce: any;
        confirmationDuration: any;
    }): React.JSX.Element;
    args: {
        debounce: number;
        confirmationDuration: number;
    };
};
export declare const InTabbedForm: () => React.JSX.Element;
export declare const InAccordionForm: () => React.JSX.Element;
export declare const InLongForm: () => React.JSX.Element;
export declare const InWizardForm: () => React.JSX.Element;
export declare const WithServerSideValidation: () => React.JSX.Element;
export declare const SubmissionError: () => React.JSX.Element;
export declare const WithSaveButton: () => React.JSX.Element;
//# sourceMappingURL=AutoSave.pessimistic.stories.d.ts.map