"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.englishI18nProvider = exports.frenchI18nProvider = void 0;
var react_admin_1 = require("react-admin");
var i18n_1 = require("../src/i18n");
var ra_i18n_polyglot_1 = __importDefault(require("ra-i18n-polyglot"));
var ra_language_english_1 = __importDefault(require("ra-language-english"));
var ra_language_french_1 = __importDefault(require("ra-language-french"));
var englishMessages = __assign(__assign({}, ra_language_english_1.default), { resources: {
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
var frenchMessages = __assign(__assign({}, ra_language_french_1.default), { resources: {
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
exports.frenchI18nProvider = (0, ra_i18n_polyglot_1.default)(function () {
    return (0, react_admin_1.mergeTranslations)(frenchMessages, i18n_1.raFormLayoutLanguageFrench);
}, 'fr');
exports.englishI18nProvider = (0, ra_i18n_polyglot_1.default)(function () {
    return (0, react_admin_1.mergeTranslations)(englishMessages, i18n_1.raFormLayoutLanguageEnglish);
}, 'en');
exports.default = (0, ra_i18n_polyglot_1.default)(function (locale) {
    if (locale === 'fr') {
        return (0, react_admin_1.mergeTranslations)(frenchMessages, i18n_1.raFormLayoutLanguageFrench);
    }
    // Always fallback on english
    return (0, react_admin_1.mergeTranslations)(englishMessages, i18n_1.raFormLayoutLanguageEnglish);
}, 'en');
