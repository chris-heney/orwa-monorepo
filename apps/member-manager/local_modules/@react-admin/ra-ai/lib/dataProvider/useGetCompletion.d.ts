import { UseQueryOptions } from 'react-query';
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
export declare const useGetCompletion: ({ prompt, stop, maxSize, temperature, meta }: GetCompletionParams, options?: UseQueryOptions<GetCompletionResult, Error>) => import("react-query").UseQueryResult<GetCompletionResult, Error>;
export type GetCompletionParams = {
    prompt?: string;
    stop?: string[];
    maxSize?: number;
    temperature?: number;
    meta?: any;
    signal?: AbortSignal;
};
export type GetCompletionResult = {
    data: string;
};
//# sourceMappingURL=useGetCompletion.d.ts.map