import React from 'react';
import { DataProvider, UseCreateMutateParams, RaRecord } from 'react-admin';
import { EditableDatagridProps } from '../src';
import { UseMutationOptions } from 'react-query';
declare const _default: {
    title: string;
};
export default _default;
export declare const Undoable: ({ dataProvider, }: {
    dataProvider?: DataProvider;
}) => React.JSX.Element;
export declare const Pessimistic: ({ dataProvider, }: {
    dataProvider?: DataProvider;
}) => React.JSX.Element;
export declare const Optimistic: ({ dataProvider, }: {
    dataProvider?: DataProvider;
}) => React.JSX.Element;
export declare const NoSubmitOnEnter: () => React.JSX.Element;
export declare const SlowUndoable: () => React.JSX.Element;
export declare const SlowPessimistic: () => React.JSX.Element;
export declare const SlowOptimistic: () => React.JSX.Element;
export declare const ConfirmDelete: () => React.JSX.Element;
export declare const NoDelete: () => React.JSX.Element;
export declare const RowClickEdit: () => React.JSX.Element;
export declare const RowClickEditShow: () => React.JSX.Element;
export declare const CustomSideEffectsUndoable: ({ dataProvider, mutationOptions, }: {
    dataProvider?: DataProvider;
    mutationOptions?: UseMutationOptions<RaRecord, unknown, UseCreateMutateParams<RaRecord>>;
}) => React.JSX.Element;
export declare const CustomSideEffectsPessimistic: ({ dataProvider, mutationOptions, }: {
    dataProvider?: DataProvider;
    mutationOptions?: UseMutationOptions<RaRecord, unknown, UseCreateMutateParams<RaRecord>>;
}) => React.JSX.Element;
export declare const CustomSideEffectsOptimistic: ({ dataProvider, mutationOptions, }: {
    dataProvider?: DataProvider;
    mutationOptions?: UseMutationOptions<RaRecord, unknown, UseCreateMutateParams<RaRecord>>;
}) => React.JSX.Element;
export declare const WithTransform: () => React.JSX.Element;
export declare const NoSubmitOnEnterWithTransform: () => React.JSX.Element;
export declare const WithMeta: {
    ({ mutationMode, dataProvider: dataProviderProp, }: {
        mutationMode: EditableDatagridProps['mutationMode'];
        dataProvider: DataProvider;
    }): React.JSX.Element;
    args: {
        mutationMode: string;
    };
    argTypes: {
        mutationMode: {
            options: string[];
            control: {
                type: string;
            };
        };
    };
};
export declare const Styled: () => React.JSX.Element;
export declare const Size: {
    ({ size, }: {
        size: EditableDatagridProps['size'];
    }): React.JSX.Element;
    args: {
        size: string;
    };
    argTypes: {
        size: {
            options: string[];
            control: {
                type: string;
            };
        };
    };
};
export declare const CustomHeader: () => React.JSX.Element;
export declare const WithListContextProvider: ({ dataProvider, }: {
    dataProvider?: DataProvider;
}) => React.JSX.Element;
//# sourceMappingURL=editable.basic.stories.d.ts.map