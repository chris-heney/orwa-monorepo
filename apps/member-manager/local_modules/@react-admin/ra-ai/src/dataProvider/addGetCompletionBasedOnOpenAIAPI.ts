import { DataProvider, fetchUtils } from 'react-admin';
import merge from 'lodash/merge';
import { GetCompletionParams } from './useGetCompletion';

const DEFAULT_PARAMS = {
    model: 'gpt-3.5-turbo-instruct',
    temperature: 1,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
};

/**
 * Add a getCompletion method to the dataProvider based on the OpenAI API
 * @see https://beta.openai.com/docs/api-reference/completions/create
 *
 * The method expects the OpenAI API key to be stored in the localStorage under the key 'ra-ai.openai-api-key'.
 * It's up to you to store the key in the localStorage (e.g. in authProvider.login()) and to remove it (e.g. in authProvider.logout())
 *
 * The getCompletion method will call the OpenAI completion API with the passed prompt
 *
 * @example
 * const dataProvider = addGetCompletionBasedOnOpenAIAPI({
 *    dataProvider: restDataProvider,
 * });
 * dataProvider
 *   .getCompletion('lorem ipsum dolor')
 *   .then(({ data }) => {
 *      console.log(data); // 'sit amet'
 *   });
 *
 * @returns DataProvider
 */
export const addGetCompletionBasedOnOpenAIAPI = ({
    dataProvider,
    endpoint = 'https://api.openai.com/v1/completions',
    defaultParams = DEFAULT_PARAMS,
    httpClient = fetchUtils.fetchJson,
}: {
    dataProvider: DataProvider;
    endpoint?: string;
    defaultParams?: any;
    httpClient?: (url: string, options?: any) => Promise<any>;
}) => ({
    ...dataProvider,
    getCompletion: async (parameters: GetCompletionParams = {}) => {
        const {
            prompt,
            stop,
            maxSize,
            temperature,
            meta = {},
            signal,
        } = parameters || {};
        const body = merge({}, defaultParams, meta, {
            prompt,
            stop,
            max_tokens: maxSize,
            temperature,
        });
        const requestOptions = {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json',
            }),
            body: JSON.stringify(body),
            signal,
        };
        const key = window.localStorage.getItem('ra-ai.openai-api-key');
        if (key) {
            requestOptions.headers.set('Authorization', `Bearer ${key}`);
        }
        const { json } = await httpClient(endpoint, requestOptions);
        return { data: json.choices[0]?.text };
    },
});
