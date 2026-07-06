import { createContext, useContext } from 'react';
import defaults from 'lodash/defaults';
import { UseMutationOptions } from 'react-query';

export const SmartRichTextInputParamsContext =
    createContext<SmartRichTextInputParamsContextType>({});

export const useSmartRichTextInputParamsContext = (props: any) => {
    const context = useContext(SmartRichTextInputParamsContext);
    return defaults({}, props != null ? extractContext(props) : {}, context);
};

const extractContext = ({
    locale,
    stop,
    maxSize,
    temperature,
    meta,
    mutationOptions,
}): SmartRichTextInputParamsContextType => ({
    locale,
    stop,
    maxSize,
    temperature,
    meta,
    mutationOptions,
});

export interface SmartRichTextInputParamsContextType {
    locale?: string;
    stop?: string[];
    maxSize?: number;
    temperature?: number;
    meta?: any; // meta can contain openAIParams to override default params
    mutationOptions?: UseMutationOptions<{ data: string }, Error, string>;
}
