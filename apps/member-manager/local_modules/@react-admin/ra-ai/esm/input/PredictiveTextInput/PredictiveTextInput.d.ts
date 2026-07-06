import * as React from 'react';
import { TextInputProps } from 'react-admin';
import { UseQueryOptions } from 'react-query';
/**
 * An alternative to `<TextInput>` that suggests completion for the input value.
 *
 * Users can accept the completion by pressing the `Tab` key. It's like Intellisense or Copilot for your forms.
 *
 * @example
 * import { Edit, SimpleForm, TextInput } from 'react-admin';
 * import { PredictiveTextInput } from '@react-admin/ra-ai';
 *
 * const PersonEdit = () => (
 *     <Edit>
 *         <SimpleForm>
 *             <TextInput source="firstName" />
 *             <TextInput source="lastName" />
 *             <TextInput source="company" />
 *             <PredictiveTextInput source="email" />
 *             <PredictiveTextInput source="website" />
 *             <PredictiveTextInput source="bio" multiline />
 *         </SimpleForm>
 *     </Edit>
 * );
 */
export declare const PredictiveTextInput: (props: PredictiveTextInputProps) => React.JSX.Element;
export interface PredictiveTextInputProps extends TextInputProps {
    debounce?: number;
    locale?: string;
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
//# sourceMappingURL=PredictiveTextInput.d.ts.map