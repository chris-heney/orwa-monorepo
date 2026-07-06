import * as React from 'react';
import { useResourceContext, useNotify, useLocaleState } from 'react-admin';
import { useWatch, useFormContext } from 'react-hook-form';
import { useDebounce } from 'use-debounce';
import { UseQueryOptions, useQueryClient } from 'react-query';

import { useGetCompletion } from '../../dataProvider/useGetCompletion';

/**
 * Create a prompt based on the current record and the field value
 *
 * @example
 * defaultPromptGenerator({
 *     resource: "users",
 *     name: 'email',
 *     value: 'john',
 *     record: { firstName: 'John', lastName: 'Doe' }
 * });
 *
 * // The following describes one of users:
 * // firstName:John
 * // lastName:Doe
 * // email:john
 *
 * // Expected response from a completion API
 * // '.doe@example'
 */
const defaultPromptGenerator = ({
    resource,
    name,
    value,
    record = {},
    locale,
}) => {
    const cleanedRecord = Object.keys(record).reduce((acc, key) => {
        if (key !== name && record[key]) {
            acc[key] = record[key];
        }
        return acc;
    }, {} as Record<string, any>);

    return `The following describes one of ${resource} (no space between the colon and the value), using the ${locale} locale:
${Object.keys(cleanedRecord)
    .map(key => `${key}:${cleanedRecord[key]}`)
    .join('\n')}
${name}:${value}`;
};

/**
 * Controller logic for the <PredictiveTextInput> component
 */
export const usePredictiveTextInputController = (
    props: UsePredictiveTextInputControllerParams
) => {
    const {
        field: { name, value, onFocus, onBlur },
        debounce = 1000,
        locale,
        queryOptions,
        meta,
        promptGenerator = defaultPromptGenerator,
        temperature,
        stop = ['\n'],
        maxSize,
    } = props;
    const resource = useResourceContext(props);
    const [hasFocus, setHasFocus] = React.useState(false);
    const [hasJustAcceptedCompletion, setHasJustAcceptedCompletion] =
        React.useState(false);
    const [completion, setCompletion] = React.useState('');
    const record = useWatch();
    const formContext = useFormContext();
    const queryClient = useQueryClient();
    const notify = useNotify();
    const [debouncedValue] = useDebounce(value, debounce);
    const [localeFromI18n] = useLocaleState();
    const contentLocale = locale || localeFromI18n;
    const prompt = promptGenerator({
        resource,
        name,
        value,
        record,
        locale: contentLocale,
    });
    const [debouncedPrompt] = useDebounce(prompt, debounce);

    const handleSuccess = React.useCallback(
        response => {
            if (!hasFocus) return;
            setCompletion(response.data);
        },
        [hasFocus, setCompletion]
    );
    const handleError = React.useCallback(
        error => {
            if (!hasFocus) return;
            setCompletion('');
            notify(error?.message || 'ra-ai.notification.getCompletion.error', {
                type: 'error',
                messageArgs: {
                    _: error?.message || 'Error fetching completion',
                },
            });
        },
        [hasFocus, setCompletion, notify]
    );

    useGetCompletion(
        { prompt: debouncedPrompt, stop, temperature, maxSize, meta },
        {
            ...queryOptions,
            enabled: hasFocus && !hasJustAcceptedCompletion,
            onSuccess: handleSuccess,
            onError: handleError,
        }
    );

    // When the user blurs the field, we don't want the suggestion to be displayed
    // So we reset completion when the field value changes or changes focus
    React.useEffect(() => {
        setCompletion('');
    }, [resource, name, value, hasFocus]);
    const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
        onFocus && onFocus(event);
        setHasFocus(true);
    };
    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        onBlur && onBlur(event);
        setHasFocus(false);
    };

    // When the user continues typing after a pause that triggered a completion,
    // we want to cancel the completion calls to avoid displaying an outdated suggestion
    React.useEffect(() => {
        if (value !== debouncedValue) {
            queryClient.cancelQueries([resource, 'getCompletion']);
        }
    }, [resource, value, debouncedValue, queryClient]);

    // When the user presses tab and there is a suggestion,
    // we want to accept the completion instead of moving to the next field
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Tab' && completion !== '') {
            if (hasJustAcceptedCompletion) {
                return;
            }
            formContext.setValue(name, `${value}${completion}`, {
                shouldDirty: true,
            });
            setCompletion('');
            setHasJustAcceptedCompletion(true);
            event.preventDefault();
        } else if (value !== completion) {
            setHasJustAcceptedCompletion(false);
        }
    };

    return { completion, handleFocus, handleBlur, handleKeyDown };
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
    queryOptions?: UseQueryOptions<{ data: string }, Error>;
}
