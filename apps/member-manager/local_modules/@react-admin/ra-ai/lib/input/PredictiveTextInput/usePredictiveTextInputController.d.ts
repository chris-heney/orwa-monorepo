import * as React from 'react';
import { UseQueryOptions } from 'react-query';
/**
 * Controller logic for the <PredictiveTextInput> component
 */
export declare const usePredictiveTextInputController: (props: UsePredictiveTextInputControllerParams) => {
    completion: string;
    handleFocus: (event: React.FocusEvent<HTMLInputElement>) => void;
    handleBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
    handleKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
};
export interface UsePredictiveTextInputControllerParams {
    field: {
        name: string;
        value: string;
        onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
        onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
    };
    locale?: string;
    debounce?: number;
    resource?: string;
    promptGenerator?: (params: {
        resource: string;
        name: string;
        value?: string;
        record?: Record<string, any>;
    }) => string;
    maxSize?: number;
    meta?: any;
    stop?: string[];
    temperature?: number;
    queryOptions?: UseQueryOptions<{
        data: string;
    }, Error>;
}
//# sourceMappingURL=usePredictiveTextInputController.d.ts.map