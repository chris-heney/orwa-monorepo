import { useQuery, UseQueryOptions } from 'react-query';
import { useDataProvider } from 'react-admin';

/**
 * Call the dataProvider.getCompletion() method via react-query, and return the result
 *
 * @example
 * const { data, isLoading, error } = useGetCompletion({ prompt: 'Lorem ipsum' });
 * console.log(data);
 * // ' dolor sit amet, consectetur adipiscing elit.'
 *
 * @example // openAI Params
 * const { data, isLoading, error } = useGetCompletion({
 *     prompt: 'Lorem ipsum',
 *     meta: { openAIParams: { temperature: 0.5 } } ,
 * });
 */
export const useGetCompletion = (
    { prompt, stop, maxSize, temperature, meta }: GetCompletionParams,
    options?: UseQueryOptions<GetCompletionResult, Error>
) => {
    const dataProvider = useDataProvider();
    return useQuery(
        ['getCompletion', { prompt, stop, maxSize, temperature, meta }],
        ({ signal }) =>
            dataProvider.getCompletion({
                prompt,
                stop,
                maxSize,
                temperature,
                meta,
                signal,
            }),
        options
    );
};

export type GetCompletionParams = {
    prompt?: string;
    stop?: string[];
    maxSize?: number;
    temperature?: number;
    meta?: any; // meta can contain openAIParams to override default params
    signal?: AbortSignal;
};

export type GetCompletionResult = {
    data: string;
};
