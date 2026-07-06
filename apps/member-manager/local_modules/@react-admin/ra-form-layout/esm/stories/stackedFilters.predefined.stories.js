import * as React from 'react';
import { createMemoryHistory } from 'history';
import { defaultTheme, TextField, TopToolbar, memoryStore, List, Datagrid, CoreAdminContext, CardContentInner, mergeTranslations, DateField, ChipField, ReferenceField, BooleanField, } from 'react-admin';
import { createTheme, ThemeProvider } from '@mui/material';
import fakeRestProvider from 'ra-data-fakerest';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';
import { booleanFilter, choicesArrayFilter, choicesFilter, dateFilter, numberFilter, raFormLayoutLanguageEnglish, referenceFilter, StackedFilters, textFilter, } from '../src';
import { TextArrayField } from './TextArrayField';
export default {
    title: 'ra-form-layout/StackedFilters/PredefinedFilters',
};
var Wrapper = function (_a) {
    var children = _a.children, dataProvider = _a.dataProvider, initialEntries = _a.initialEntries;
    var history = createMemoryHistory({
        initialEntries: initialEntries,
    });
    var i18nProvider = polyglotI18nProvider(function () { return mergeTranslations(englishMessages, raFormLayoutLanguageEnglish); }, 'en');
    return (React.createElement(ThemeProvider, { theme: createTheme(defaultTheme) },
        React.createElement(CoreAdminContext, { history: history, dataProvider: dataProvider, i18nProvider: i18nProvider, store: memoryStore() },
            React.createElement(CardContentInner, null, children))));
};
export var BooleanFilter = function () {
    var params = new URLSearchParams();
    params.append('displayedFilters', JSON.stringify({ title_q: true }));
    params.append('filter', JSON.stringify({ published_eq: true }));
    params.append('page', '1');
    params.append('perPage', '10');
    params.append('sort', 'id');
    params.append('order', 'ASC');
    var dataProvider = fakeRestProvider({
        posts: [
            { id: 1, title: 'Lorem ipsum dolor sit amet', published: true },
            {
                id: 2,
                title: 'Sed ut perspiciatis unde omnis',
                published: true,
            },
            {
                id: 3,
                title: 'Voluptatem quia voluptas sit',
                published: true,
            },
            { id: 4, title: 'Neque porro quisquam est', published: false },
            { id: 5, title: 'At vero eos et accusamus', published: true },
            { id: 6, title: 'Et iusto odio dignissimos', published: false },
            {
                id: 7,
                title: 'Ducimus qui blanditiis praesentium',
                published: true,
            },
            {
                id: 8,
                title: 'Voluptatum deleniti atque corrupti',
                published: true,
            },
            {
                id: 9,
                title: 'Quos dolores et quas molestias',
                published: true,
            },
            {
                id: 10,
                title: 'Excepturi sint occaecati cupiditate',
                published: true,
            },
            {
                id: 11,
                title: 'Non provident, similique sunt in culpa',
                published: true,
            },
            {
                id: 12,
                title: 'Qui officia deserunt mollitia animi',
                published: true,
            },
            {
                id: 13,
                title: 'Id est laborum et dolorum fuga',
                published: true,
            },
        ],
    }, process.env.NODE_ENV !== 'test');
    return (React.createElement(Wrapper, { dataProvider: dataProvider, initialEntries: ["/posts?".concat(params.toString())] },
        React.createElement(List, { resource: "posts", actions: React.createElement(BooleanFilterToolbar, null) },
            React.createElement(Datagrid, null,
                React.createElement(TextField, { source: "title" }),
                React.createElement(BooleanField, { source: "published" })))));
};
var BooleanFilterToolbar = function () { return (React.createElement(TopToolbar, null,
    React.createElement(StackedFilters, { config: {
            published: booleanFilter(),
        } }))); };
export var TextFilter = function () {
    var params = new URLSearchParams();
    params.append('displayedFilters', JSON.stringify({ title_q: true }));
    params.append('filter', JSON.stringify({ title_q: 'volup' }));
    params.append('page', '1');
    params.append('perPage', '10');
    params.append('sort', 'id');
    params.append('order', 'ASC');
    var dataProvider = fakeRestProvider({
        posts: [
            { id: 1, title: 'Lorem ipsum dolor sit amet' },
            { id: 2, title: 'Sed ut perspiciatis unde omnis' },
            { id: 3, title: 'Voluptatem quia voluptas sit' },
            { id: 4, title: 'Neque porro quisquam est' },
            { id: 5, title: 'At vero eos et accusamus' },
            { id: 6, title: 'Et iusto odio dignissimos' },
            { id: 7, title: 'Ducimus qui blanditiis praesentium' },
            { id: 8, title: 'Voluptatum deleniti atque corrupti' },
            { id: 9, title: 'Quos dolores et quas molestias' },
            { id: 10, title: 'Excepturi sint occaecati cupiditate' },
            { id: 11, title: 'Non provident, similique sunt in culpa' },
            { id: 12, title: 'Qui officia deserunt mollitia animi' },
            { id: 13, title: 'Id est laborum et dolorum fuga' },
        ],
    }, process.env.NODE_ENV !== 'test');
    return (React.createElement(Wrapper, { dataProvider: dataProvider, initialEntries: ["/posts?".concat(params.toString())] },
        React.createElement(List, { resource: "posts", actions: React.createElement(TextFilterToolbar, null) },
            React.createElement(Datagrid, null,
                React.createElement(TextField, { source: "title" })))));
};
var TextFilterToolbar = function () { return (React.createElement(TopToolbar, null,
    React.createElement(StackedFilters, { config: {
            title: textFilter(),
        } }))); };
export var NumberFilter = function () {
    var params = new URLSearchParams();
    params.append('displayedFilters', JSON.stringify({ views_gt: true }));
    params.append('filter', JSON.stringify({ views_gt: 40 }));
    params.append('page', '1');
    params.append('perPage', '10');
    params.append('sort', 'id');
    params.append('order', 'ASC');
    var dataProvider = fakeRestProvider({
        posts: [
            { id: 1, title: 'Lorem ipsum dolor sit amet', views: 10 },
            { id: 2, title: 'Sed ut perspiciatis unde omnis', views: 20 },
            { id: 3, title: 'Voluptatem quia voluptas sit', views: 30 },
            { id: 4, title: 'Neque porro quisquam est', views: 40 },
            { id: 5, title: 'At vero eos et accusamus', views: 50 },
            { id: 6, title: 'Et iusto odio dignissimos', views: 60 },
            {
                id: 7,
                title: 'Ducimus qui blanditiis praesentium',
                views: 70,
            },
            {
                id: 8,
                title: 'Voluptatum deleniti atque corrupti',
                views: 80,
            },
            { id: 9, title: 'Quos dolores et quas molestias', views: 20 },
            {
                id: 10,
                title: 'Excepturi sint occaecati cupiditate',
                views: 30,
            },
            {
                id: 11,
                title: 'Non provident, similique sunt in culpa',
                views: 40,
            },
            {
                id: 12,
                title: 'Qui officia deserunt mollitia animi',
                views: 50,
            },
            { id: 13, title: 'Id est laborum et dolorum fuga', views: 60 },
        ],
    }, process.env.NODE_ENV !== 'test');
    return (React.createElement(Wrapper, { dataProvider: dataProvider, initialEntries: ["/posts?".concat(params.toString())] },
        React.createElement(List, { resource: "posts", actions: React.createElement(NumberFilterToolbar, null) },
            React.createElement(Datagrid, null,
                React.createElement(TextField, { source: "title" }),
                React.createElement(TextField, { source: "views" })))));
};
var NumberFilterToolbar = function () { return (React.createElement(TopToolbar, null,
    React.createElement(StackedFilters, { config: {
            views: numberFilter(),
        } }))); };
export var DateFilter = function () {
    var params = new URLSearchParams();
    params.append('displayedFilters', JSON.stringify({ published_at_gt: true }));
    params.append('filter', JSON.stringify({
        published_at_gt: new Date('2012-10-28').toISOString(),
    }));
    params.append('page', '1');
    params.append('perPage', '10');
    params.append('sort', 'id');
    params.append('order', 'ASC');
    var dataProvider = fakeRestProvider({
        posts: [
            {
                id: 1,
                title: 'Lorem ipsum dolor sit amet',
                published_at: new Date('2012-10-22').toISOString(),
            },
            {
                id: 2,
                title: 'Sed ut perspiciatis unde omnis',
                published_at: new Date('2012-10-22').toISOString(),
            },
            {
                id: 3,
                title: 'Voluptatem quia voluptas sit',
                published_at: new Date('2012-10-22').toISOString(),
            },
            {
                id: 4,
                title: 'Neque porro quisquam est',
                published_at: new Date('2012-10-25').toISOString(),
            },
            {
                id: 5,
                title: 'At vero eos et accusamus',
                published_at: new Date('2012-10-26').toISOString(),
            },
            {
                id: 6,
                title: 'Et iusto odio dignissimos',
                published_at: new Date('2012-10-27').toISOString(),
            },
            {
                id: 7,
                title: 'Ducimus qui blanditiis praesentium',
                published_at: new Date('2012-10-28').toISOString(),
            },
            {
                id: 8,
                title: 'Voluptatum deleniti atque corrupti',
                published_at: new Date('2012-10-29').toISOString(),
            },
            {
                id: 9,
                title: 'Quos dolores et quas molestias',
                published_at: new Date('2012-10-30').toISOString(),
            },
            {
                id: 10,
                title: 'Excepturi sint occaecati cupiditate',
                published_at: new Date('2012-10-31').toISOString(),
            },
            {
                id: 11,
                title: 'Non provident, similique sunt in culpa',
                published_at: new Date('2012-10-31').toISOString(),
            },
            {
                id: 12,
                title: 'Qui officia deserunt mollitia animi',
                published_at: new Date('2012-10-31').toISOString(),
            },
            {
                id: 13,
                title: 'Id est laborum et dolorum fuga',
                published_at: new Date('2012-10-31').toISOString(),
            },
        ],
    }, process.env.NODE_ENV !== 'test');
    return (React.createElement(Wrapper, { dataProvider: dataProvider, initialEntries: ["/posts?".concat(params.toString())] },
        React.createElement(List, { resource: "posts", actions: React.createElement(DateFilterToolbar, null) },
            React.createElement(Datagrid, null,
                React.createElement(TextField, { source: "title" }),
                React.createElement(DateField, { source: "published_at" })))));
};
var DateFilterToolbar = function () { return (React.createElement(TopToolbar, null,
    React.createElement(StackedFilters, { config: {
            published_at: dateFilter(),
        } }))); };
export var Choices = function () {
    var params = new URLSearchParams();
    params.append('displayedFilters', JSON.stringify({ category_eq: true }));
    params.append('filter', JSON.stringify({ category_eq: 'programming' }));
    params.append('page', '1');
    params.append('perPage', '10');
    params.append('sort', 'id');
    params.append('order', 'ASC');
    var dataProvider = fakeRestProvider({
        posts: [
            {
                id: 1,
                title: 'Lorem ipsum dolor sit amet',
                category: 'programming',
            },
            {
                id: 2,
                title: 'Sed ut perspiciatis unde omnis',
                category: 'programming',
            },
            {
                id: 3,
                title: 'Voluptatem quia voluptas sit',
                category: 'art',
            },
            {
                id: 4,
                title: 'Neque porro quisquam est',
                category: 'programming',
            },
            { id: 5, title: 'At vero eos et accusamus', category: 'art' },
            {
                id: 6,
                title: 'Et iusto odio dignissimos',
                category: 'programming',
            },
            {
                id: 7,
                title: 'Ducimus qui blanditiis praesentium',
                category: 'programming',
            },
            {
                id: 8,
                title: 'Voluptatum deleniti atque corrupti',
                category: 'art',
            },
            {
                id: 9,
                title: 'Quos dolores et quas molestias',
                category: 'misc',
            },
            {
                id: 10,
                title: 'Excepturi sint occaecati cupiditate',
                category: 'art',
            },
            {
                id: 11,
                title: 'Non provident, similique sunt in culpa',
                category: 'misc',
            },
            {
                id: 12,
                title: 'Qui officia deserunt mollitia animi',
                category: 'misc',
            },
            {
                id: 13,
                title: 'Id est laborum et dolorum fuga',
                category: 'programming',
            },
        ],
    }, process.env.NODE_ENV !== 'test');
    return (React.createElement(Wrapper, { dataProvider: dataProvider, initialEntries: ["/posts?".concat(params.toString())] },
        React.createElement(List, { resource: "posts", actions: React.createElement(ChoicesToolbar, null) },
            React.createElement(Datagrid, null,
                React.createElement(TextField, { source: "title" }),
                React.createElement(ChipField, { source: "category" })))));
};
var ChoicesToolbar = function () { return (React.createElement(TopToolbar, null,
    React.createElement(StackedFilters, { config: {
            category: choicesFilter({
                choices: [
                    { id: 'programming', name: 'Programming' },
                    { id: 'art', name: 'Art' },
                    { id: 'misc', name: 'Misc' },
                ],
            }),
        } }))); };
export var ChoicesArray = function () {
    var params = new URLSearchParams();
    params.append('displayedFilters', JSON.stringify({ tags_inc_any: true }));
    params.append('filter', JSON.stringify({ tags_inc_any: ['react'] }));
    params.append('page', '1');
    params.append('perPage', '10');
    params.append('sort', 'id');
    params.append('order', 'ASC');
    var dataProvider = fakeRestProvider({
        posts: [
            {
                id: 1,
                title: 'Lorem ipsum dolor sit amet',
                tags: ['programming', 'react'],
            },
            {
                id: 2,
                title: 'Sed ut perspiciatis unde omnis',
                tags: ['programming', 'react'],
            },
            {
                id: 3,
                title: 'Voluptatem quia voluptas sit',
                tags: ['programming', 'react'],
            },
            {
                id: 4,
                title: 'Neque porro quisquam est',
                tags: ['programming', 'solid'],
            },
            {
                id: 5,
                title: 'At vero eos et accusamus',
                tags: ['programming', 'react'],
            },
            {
                id: 6,
                title: 'Et iusto odio dignissimos',
                tags: ['programming', 'vue'],
            },
            {
                id: 7,
                title: 'Ducimus qui blanditiis praesentium',
                tags: ['programming', 'solid'],
            },
            {
                id: 8,
                title: 'Voluptatum deleniti atque corrupti',
                tags: ['programming', 'react'],
            },
            {
                id: 9,
                title: 'Quos dolores et quas molestias',
                tags: ['programming', 'react'],
            },
            {
                id: 10,
                title: 'Excepturi sint occaecati cupiditate',
                tags: ['programming', 'react'],
            },
            {
                id: 11,
                title: 'Non provident, similique sunt in culpa',
                tags: ['programming', 'react'],
            },
            {
                id: 12,
                title: 'Qui officia deserunt mollitia animi',
                tags: ['programming', 'react'],
            },
            {
                id: 13,
                title: 'Id est laborum et dolorum fuga',
                tags: ['programming', 'vue'],
            },
        ],
    }, process.env.NODE_ENV !== 'test');
    return (React.createElement(Wrapper, { dataProvider: dataProvider, initialEntries: ["/posts?".concat(params.toString())] },
        React.createElement(List, { resource: "posts", actions: React.createElement(ChoicesArrayToolbar, null) },
            React.createElement(Datagrid, null,
                React.createElement(TextField, { source: "title" }),
                React.createElement(TextArrayField, { source: "tags" })))));
};
var ChoicesArrayToolbar = function () { return (React.createElement(TopToolbar, null,
    React.createElement(StackedFilters, { config: {
            tags: choicesArrayFilter({
                choices: [
                    { id: 'programming', name: 'Programming' },
                    { id: 'react', name: 'React' },
                    { id: 'solid', name: 'Solid' },
                    { id: 'vue', name: 'Vue' },
                ],
            }),
        } }))); };
export var Reference = function () {
    var params = new URLSearchParams();
    params.append('displayedFilters', JSON.stringify({ category_id_eq: true }));
    params.append('filter', JSON.stringify({ category_id_eq: 'programming' }));
    params.append('page', '1');
    params.append('perPage', '10');
    params.append('sort', 'id');
    params.append('order', 'ASC');
    var dataProvider = fakeRestProvider({
        posts: [
            {
                id: 1,
                title: 'Lorem ipsum dolor sit amet',
                category_id: 'programming',
            },
            {
                id: 2,
                title: 'Sed ut perspiciatis unde omnis',
                category_id: 'programming',
            },
            {
                id: 3,
                title: 'Voluptatem quia voluptas sit',
                category_id: 'art',
            },
            {
                id: 4,
                title: 'Neque porro quisquam est',
                category_id: 'programming',
            },
            {
                id: 5,
                title: 'At vero eos et accusamus',
                category_id: 'art',
            },
            {
                id: 6,
                title: 'Et iusto odio dignissimos',
                category_id: 'programming',
            },
            {
                id: 7,
                title: 'Ducimus qui blanditiis praesentium',
                category_id: 'programming',
            },
            {
                id: 8,
                title: 'Voluptatum deleniti atque corrupti',
                category_id: 'art',
            },
            {
                id: 9,
                title: 'Quos dolores et quas molestias',
                category_id: 'misc',
            },
            {
                id: 10,
                title: 'Excepturi sint occaecati cupiditate',
                category_id: 'art',
            },
            {
                id: 11,
                title: 'Non provident, similique sunt in culpa',
                category_id: 'misc',
            },
            {
                id: 12,
                title: 'Qui officia deserunt mollitia animi',
                category_id: 'misc',
            },
            {
                id: 13,
                title: 'Id est laborum et dolorum fuga',
                category_id: 'programming',
            },
        ],
        categories: [
            { id: 'programming', name: 'Programming' },
            { id: 'art', name: 'Art' },
            { id: 'misc', name: 'Misc' },
        ],
    }, process.env.NODE_ENV !== 'test');
    return (React.createElement(Wrapper, { dataProvider: dataProvider, initialEntries: ["/posts?".concat(params.toString())] },
        React.createElement(List, { resource: "posts", actions: React.createElement(ReferenceToolbar, null) },
            React.createElement(Datagrid, null,
                React.createElement(TextField, { source: "title" }),
                React.createElement(ReferenceField, { reference: "categories", source: "category_id" },
                    React.createElement(ChipField, { source: "name" }))))));
};
var ReferenceToolbar = function () { return (React.createElement(TopToolbar, null,
    React.createElement(StackedFilters, { config: {
            category_id: referenceFilter({
                reference: 'categories',
                optionText: 'name',
            }),
        } }))); };
