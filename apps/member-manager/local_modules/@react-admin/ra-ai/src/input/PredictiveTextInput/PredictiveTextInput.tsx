import * as React from 'react';
import {
    useInput,
    FieldTitle,
    InputHelperText,
    TextInputProps,
    sanitizeInputRestProps,
} from 'react-admin';
import { UseQueryOptions } from 'react-query';
import clsx from 'clsx';

import { TextFieldWithCompletion } from './TextFieldWithCompletion';
import { usePredictiveTextInputController } from './usePredictiveTextInputController';

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
export const PredictiveTextInput = (props: PredictiveTextInputProps) => {
    const {
        className,
        debounce,
        defaultValue,
        label,
        locale,
        format,
        helperText,
        maxSize,
        meta,
        onFocus,
        onBlur,
        onChange,
        parse,
        promptGenerator,
        queryOptions,
        resource,
        source,
        stop,
        temperature,
        validate,
        ...rest
    } = props;

    if (props.resettable) {
        throw new Error('PredictiveTextInput does not support resettable yet');
    }

    const {
        field,
        fieldState: { error, invalid, isTouched },
        formState: { isSubmitted },
        id,
        isRequired,
    } = useInput({
        defaultValue,
        format,
        parse,
        resource,
        source,
        type: 'text',
        validate,
        onBlur,
        onChange,
        ...rest,
    });

    const { completion, handleFocus, handleBlur, handleKeyDown } =
        usePredictiveTextInputController({
            field,
            locale,
            promptGenerator,
            debounce,
            maxSize,
            meta,
            stop,
            temperature,
            queryOptions,
        });

    return (
        <TextFieldWithCompletion
            id={id}
            {...field}
            className={clsx('ra-input', `ra-input-${source}`, className)}
            label={
                label !== '' && label !== false ? (
                    <FieldTitle
                        label={label}
                        source={source}
                        resource={resource}
                        isRequired={isRequired}
                    />
                ) : null
            }
            error={(isTouched || isSubmitted) && invalid}
            helperText={
                <InputHelperText
                    touched={isTouched || isSubmitted}
                    error={error?.message}
                    helperText={helperText}
                />
            }
            {...sanitizeInputRestProps(rest)}
            completion={completion}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
        />
    );
};

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
    queryOptions?: UseQueryOptions<{ data: string }, Error>;
}
