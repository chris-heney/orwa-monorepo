import { useQuery } from 'react-query';
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
export var useGetCompletion = function (_a, options) {
    var prompt = _a.prompt, stop = _a.stop, maxSize = _a.maxSize, temperature = _a.temperature, meta = _a.meta;
    var dataProvider = useDataProvider();
    return useQuery(['getCompletion', { prompt: prompt, stop: stop, maxSize: maxSize, temperature: temperature, meta: meta }], function (_a) {
        var signal = _a.signal;
        return dataProvider.getCompletion({
            prompt: prompt,
            stop: stop,
            maxSize: maxSize,
            temperature: temperature,
            meta: meta,
            signal: signal,
        });
    }, options);
};
