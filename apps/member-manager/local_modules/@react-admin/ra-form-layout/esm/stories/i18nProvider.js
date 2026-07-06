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
import { mergeTranslations } from 'react-admin';
import { raFormLayoutLanguageEnglish, raFormLayoutLanguageFrench, } from '../src/i18n';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import baseEnglishMessages from 'ra-language-english';
import baseFrenchMessages from 'ra-language-french';
var englishMessages = __assign(__assign({}, baseEnglishMessages), { resources: {
        customers: {
            fields: {
                name: 'Job',
                from: 'From',
                to: 'To',
            },
            sections: {
                identity: 'Identity',
                occupations: 'Occupations',
                preferences: 'Preferences',
                publications: 'Publications',
            },
        },
    } });
var frenchMessages = __assign(__assign({}, baseFrenchMessages), { resources: {
        customers: {
            steps: {
                first: 'Premier',
                second: 'Deuxième',
                third: 'Troisième',
            },
            sections: {
                identity: 'Identité',
                occupations: 'Occupations',
                preferences: 'Préférences',
                publications: 'Publications',
            },
        },
    } });
export var frenchI18nProvider = polyglotI18nProvider(function () {
    return mergeTranslations(frenchMessages, raFormLayoutLanguageFrench);
}, 'fr');
export var englishI18nProvider = polyglotI18nProvider(function () {
    return mergeTranslations(englishMessages, raFormLayoutLanguageEnglish);
}, 'en');
export default polyglotI18nProvider(function (locale) {
    if (locale === 'fr') {
        return mergeTranslations(frenchMessages, raFormLayoutLanguageFrench);
    }
    // Always fallback on english
    return mergeTranslations(englishMessages, raFormLayoutLanguageEnglish);
}, 'en');
