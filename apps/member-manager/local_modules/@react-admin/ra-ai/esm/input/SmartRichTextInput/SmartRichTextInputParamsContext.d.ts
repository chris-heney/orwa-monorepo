/// <reference types="react" />
import { UseMutationOptions } from 'react-query';
export declare const SmartRichTextInputParamsContext: import("react").Context<SmartRichTextInputParamsContextType>;
export declare const useSmartRichTextInputParamsContext: (props: any) => SmartRichTextInputParamsContextType;
export interface SmartRichTextInputParamsContextType {
    locale?: string;
    stop?: string[];
    maxSize?: number;
    temperature?: number;
    meta?: any;
    mutationOptions?: UseMutationOptions<{
        data: string;
    }, Error, string>;
}
//# sourceMappingURL=SmartRichTextInputParamsContext.d.ts.map