"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGetCompletion = void 0;
var react_query_1 = require("react-query");
var react_admin_1 = require("react-admin");
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
var useGetCompletion = function (_a, options) {
    var prompt = _a.prompt, stop = _a.stop, maxSize = _a.maxSize, temperature = _a.temperature, meta = _a.meta;
    var dataProvider = (0, react_admin_1.useDataProvider)();
    return (0, react_query_1.useQuery)(['getCompletion', { prompt: prompt, stop: stop, maxSize: maxSize, temperature: temperature, meta: meta }], function (_a) {
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
exports.useGetCompletion = useGetCompletion;
