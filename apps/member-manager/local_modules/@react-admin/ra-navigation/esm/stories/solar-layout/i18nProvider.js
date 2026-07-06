import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';
import frenchMessages from 'ra-language-french';
export var i18nProvider = polyglotI18nProvider(function (locale) { return (locale === 'fr' ? frenchMessages : englishMessages); }, 'en', [
    { locale: 'en', name: 'English' },
    { locale: 'fr', name: 'Français' },
]);
