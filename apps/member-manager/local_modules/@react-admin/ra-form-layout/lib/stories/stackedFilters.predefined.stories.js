"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reference = exports.ChoicesArray = exports.Choices = exports.DateFilter = exports.NumberFilter = exports.TextFilter = exports.BooleanFilter = void 0;
var React = __importStar(require("react"));
var history_1 = require("history");
var react_admin_1 = require("react-admin");
var material_1 = require("@mui/material");
var ra_data_fakerest_1 = __importDefault(require("ra-data-fakerest"));
var ra_i18n_polyglot_1 = __importDefault(require("ra-i18n-polyglot"));
var ra_language_english_1 = __importDefault(require("ra-language-english"));
var src_1 = require("../src");
var TextArrayField_1 = require("./TextArrayField");
exports.default = {
    title: 'ra-form-layout/StackedFilters/PredefinedFilters',
};
var Wrapper = function (_a) {
    var children = _a.children, dataProvider = _a.dataProvider, initialEntries = _a.initialEntries;
    var history = (0, history_1.createMemoryHistory)({
        initialEntries: initialEntries,
    });
    var i18nProvider = (0, ra_i18n_polyglot_1.default)(function () { return (0, react_admin_1.mergeTranslations)(ra_language_english_1.default, src_1.raFormLayoutLanguageEnglish); }, 'en');
    return (React.createElement(material_1.ThemeProvider, { theme: (0, material_1.createTheme)(react_admin_1.defaultTheme) },
        React.createElement(react_admin_1.CoreAdminContext, { history: history, dataProvider: dataProvider, i18nProvider: i18nProvider, store: (0, react_admin_1.memoryStore)() },
            React.createElement(react_admin_1.CardContentInner, null, children))));
};
var BooleanFilter = function () {
    var params = new URLSearchParams();
    params.append('displayedFilters', JSON.stringify({ title_q: true }));
    params.append('filter', JSON.stringify({ published_eq: true }));
    params.append('page', '1');
    params.append('perPage', '10');
    params.append('sort', 'id');
    params.append('order', 'ASC');
    var dataProvider = (0, ra_data_fakerest_1.default)({
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
        React.createElement(react_admin_1.List, { resource: "posts", actions: React.createElement(BooleanFilterToolbar, null) },
            React.createElement(react_admin_1.Datagrid, null,
                React.createElement(react_admin_1.TextField, { source: "title" }),
                React.createElement(react_admin_1.BooleanField, { source: "published" })))));
};
exports.BooleanFilter = BooleanFilter;
var BooleanFilterToolbar = function () { return (React.createElement(react_admin_1.TopToolbar, null,
    React.createElement(src_1.StackedFilters, { config: {
            published: (0, src_1.booleanFilter)(),
        } }))); };
var TextFilter = function () {
    var params = new URLSearchParams();
    params.append('displayedFilters', JSON.stringify({ title_q: true }));
    params.append('filter', JSON.stringify({ title_q: 'volup' }));
    params.append('page', '1');
    params.append('perPage', '10');
    params.append('sort', 'id');
    params.append('order', 'ASC');
    var dataProvider = (0, ra_data_fakerest_1.default)({
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
        React.createElement(react_admin_1.List, { resource: "posts", actions: React.createElement(TextFilterToolbar, null) },
            React.createElement(react_admin_1.Datagrid, null,
                React.createElement(react_admin_1.TextField, { source: "title" })))));
};
exports.TextFilter = TextFilter;
var TextFilterToolbar = function () { return (React.createElement(react_admin_1.TopToolbar, null,
    React.createElement(src_1.StackedFilters, { config: {
            title: (0, src_1.textFilter)(),
        } }))); };
var NumberFilter = function () {
    var params = new URLSearchParams();
    params.append('displayedFilters', JSON.stringify({ views_gt: true }));
    params.append('filter', JSON.stringify({ views_gt: 40 }));
    params.append('page', '1');
    params.append('perPage', '10');
    params.append('sort', 'id');
    params.append('order', 'ASC');
    var dataProvider = (0, ra_data_fakerest_1.default)({
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
        React.createElement(react_admin_1.List, { resource: "posts", actions: React.createElement(NumberFilterToolbar, null) },
            React.createElement(react_admin_1.Datagrid, null,
                React.createElement(react_admin_1.TextField, { source: "title" }),
                React.createElement(react_admin_1.TextField, { source: "views" })))));
};
exports.NumberFilter = NumberFilter;
var NumberFilterToolbar = function () { return (React.createElement(react_admin_1.TopToolbar, null,
    React.createElement(src_1.StackedFilters, { config: {
            views: (0, src_1.numberFilter)(),
        } }))); };
var DateFilter = function () {
    var params = new URLSearchParams();
    params.append('displayedFilters', JSON.stringify({ published_at_gt: true }));
    params.append('filter', JSON.stringify({
        published_at_gt: new Date('2012-10-28').toISOString(),
    }));
    params.append('page', '1');
    params.append('perPage', '10');
    params.append('sort', 'id');
    params.append('order', 'ASC');
    var dataProvider = (0, ra_data_fakerest_1.default)({
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
        React.createElement(react_admin_1.List, { resource: "posts", actions: React.createElement(DateFilterToolbar, null) },
            React.createElement(react_admin_1.Datagrid, null,
                React.createElement(react_admin_1.TextField, { source: "title" }),
                React.createElement(react_admin_1.DateField, { source: "published_at" })))));
};
exports.DateFilter = DateFilter;
var DateFilterToolbar = function () { return (React.createElement(react_admin_1.TopToolbar, null,
    React.createElement(src_1.StackedFilters, { config: {
            published_at: (0, src_1.dateFilter)(),
        } }))); };
var Choices = function () {
    var params = new URLSearchParams();
    params.append('displayedFilters', JSON.stringify({ category_eq: true }));
    params.append('filter', JSON.stringify({ category_eq: 'programming' }));
    params.append('page', '1');
    params.append('perPage', '10');
    params.append('sort', 'id');
    params.append('order', 'ASC');
    var dataProvider = (0, ra_data_fakerest_1.default)({
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
        React.createElement(react_admin_1.List, { resource: "posts", actions: React.createElement(ChoicesToolbar, null) },
            React.createElement(react_admin_1.Datagrid, null,
                React.createElement(react_admin_1.TextField, { source: "title" }),
                React.createElement(react_admin_1.ChipField, { source: "category" })))));
};
exports.Choices = Choices;
var ChoicesToolbar = function () { return (React.createElement(react_admin_1.TopToolbar, null,
    React.createElement(src_1.StackedFilters, { config: {
            category: (0, src_1.choicesFilter)({
                choices: [
                    { id: 'programming', name: 'Programming' },
                    { id: 'art', name: 'Art' },
                    { id: 'misc', name: 'Misc' },
                ],
            }),
        } }))); };
var ChoicesArray = function () {
    var params = new URLSearchParams();
    params.append('displayedFilters', JSON.stringify({ tags_inc_any: true }));
    params.append('filter', JSON.stringify({ tags_inc_any: ['react'] }));
    params.append('page', '1');
    params.append('perPage', '10');
    params.append('sort', 'id');
    params.append('order', 'ASC');
    var dataProvider = (0, ra_data_fakerest_1.default)({
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
        React.createElement(react_admin_1.List, { resource: "posts", actions: React.createElement(ChoicesArrayToolbar, null) },
            React.createElement(react_admin_1.Datagrid, null,
                React.createElement(react_admin_1.TextField, { source: "title" }),
                React.createElement(TextArrayField_1.TextArrayField, { source: "tags" })))));
};
exports.ChoicesArray = ChoicesArray;
var ChoicesArrayToolbar = function () { return (React.createElement(react_admin_1.TopToolbar, null,
    React.createElement(src_1.StackedFilters, { config: {
            tags: (0, src_1.choicesArrayFilter)({
                choices: [
                    { id: 'programming', name: 'Programming' },
                    { id: 'react', name: 'React' },
                    { id: 'solid', name: 'Solid' },
                    { id: 'vue', name: 'Vue' },
                ],
            }),
        } }))); };
var Reference = function () {
    var params = new URLSearchParams();
    params.append('displayedFilters', JSON.stringify({ category_id_eq: true }));
    params.append('filter', JSON.stringify({ category_id_eq: 'programming' }));
    params.append('page', '1');
    params.append('perPage', '10');
    params.append('sort', 'id');
    params.append('order', 'ASC');
    var dataProvider = (0, ra_data_fakerest_1.default)({
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
        React.createElement(react_admin_1.List, { resource: "posts", actions: React.createElement(ReferenceToolbar, null) },
            React.createElement(react_admin_1.Datagrid, null,
                React.createElement(react_admin_1.TextField, { source: "title" }),
                React.createElement(react_admin_1.ReferenceField, { reference: "categories", source: "category_id" },
                    React.createElement(react_admin_1.ChipField, { source: "name" }))))));
};
exports.Reference = Reference;
var ReferenceToolbar = function () { return (React.createElement(react_admin_1.TopToolbar, null,
    React.createElement(src_1.StackedFilters, { config: {
            category_id: (0, src_1.referenceFilter)({
                reference: 'categories',
                optionText: 'name',
            }),
        } }))); };
