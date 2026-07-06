import * as React from 'react';
import { DataProvider } from 'react-admin';
import { BulkUpdateFormButtonProps } from './BulkUpdateFormButton';
declare const _default: {
    title: string;
    excludeStories: string[];
};
export default _default;
export declare const Basic: {
    ({ mutationMode, meta, dataProvider: dataProviderProp, }: {
        mutationMode?: BulkUpdateFormButtonProps['mutationMode'];
        meta?: any;
        dataProvider?: DataProvider;
    }): React.JSX.Element;
    argTypes: {
        mutationMode: {
            options: string[];
            control: {
                type: string;
            };
        };
        meta: {
            control: string;
        };
    };
};
export declare const WithDialogProps: () => React.JSX.Element;
export declare const Validation: ({ dataProvider: dataProviderProp, }: {
    dataProvider?: DataProvider;
}) => React.JSX.Element;
export declare const WithTabbedForm: ({ dataProvider: dataProviderProp, }: {
    dataProvider?: DataProvider;
}) => React.JSX.Element;
export declare const OnSuccess: ({ dataProvider: dataProviderProp, }: {
    dataProvider?: DataProvider;
}) => React.JSX.Element;
export declare const dataProvider: DataProvider;
//# sourceMappingURL=BulkUpdateFormButton.stories.d.ts.map