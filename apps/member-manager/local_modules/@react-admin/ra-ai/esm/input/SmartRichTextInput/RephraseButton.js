var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import * as React from 'react';
import { useTranslate } from 'react-admin';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { SmartReplaceButton, } from './SmartReplaceButton';
var promptGenerator = function (text, locale) {
    if (locale === void 0) { locale = 'en'; }
    return locale === 'en'
        ? "Rephrase the following text delimited by triple quotes.\nDo not include triple quotes in the corrected text.\n\"\"\"".concat(text, "\"\"\"\n")
        : "Here is an text delimited by \"\"\" using the ".concat(locale, " locale. Rephrase it.\nKeep the original locale. Do not include triple quotes in the rephrased text.\n\"\"\"").concat(text, "\"\"\"\n\n");
};
export var RephraseButton = function (props) {
    var translate = useTranslate();
    return (React.createElement(SmartReplaceButton, __assign({ promptGenerator: promptGenerator, label: translate('ra.ai.button.rephrase', { _: 'Rephrase' }), Icon: AutoAwesomeIcon }, props)));
};
