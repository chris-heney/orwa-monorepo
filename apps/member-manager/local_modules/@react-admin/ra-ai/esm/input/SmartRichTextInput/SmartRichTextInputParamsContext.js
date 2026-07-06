import { createContext, useContext } from 'react';
import defaults from 'lodash/defaults';
export var SmartRichTextInputParamsContext = createContext({});
export var useSmartRichTextInputParamsContext = function (props) {
    var context = useContext(SmartRichTextInputParamsContext);
    return defaults({}, props != null ? extractContext(props) : {}, context);
};
var extractContext = function (_a) {
    var locale = _a.locale, stop = _a.stop, maxSize = _a.maxSize, temperature = _a.temperature, meta = _a.meta, mutationOptions = _a.mutationOptions;
    return ({
        locale: locale,
        stop: stop,
        maxSize: maxSize,
        temperature: temperature,
        meta: meta,
        mutationOptions: mutationOptions,
    });
};
