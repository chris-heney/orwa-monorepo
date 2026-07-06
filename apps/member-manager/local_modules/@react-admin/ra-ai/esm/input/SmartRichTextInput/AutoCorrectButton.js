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
import SpellcheckIcon from '@mui/icons-material/Spellcheck';
import { useTranslate } from 'react-admin';
import { SmartReplaceButton, } from './SmartReplaceButton';
var promptGenerator = function (text, locale) {
    if (locale === void 0) { locale = 'en'; }
    return locale === 'en'
        ? "Correct the misspelled words and grammar errors in the following article delimited by triple quotes.\nDo not include triple quotes in the corrected text.\n\"\"\"".concat(text, "\"\"\"\n")
        : "Here is an article delimited by \"\"\" using the ".concat(locale, " locale.\nCorrect the misspelled words and grammar errors.\nKeep the original locale. Do not include triple quotes in the corrected text.\n\"\"\"").concat(text, "\"\"\"    \n");
};
export var AutoCorrectButton = function (props) {
    var translate = useTranslate();
    return (React.createElement(SmartReplaceButton, __assign({ promptGenerator: promptGenerator, label: translate('ra.ai.button.autoCorrect', { _: 'Auto-correct' }), Icon: SpellcheckIcon }, props)));
};
