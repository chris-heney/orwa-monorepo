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
exports.dataProvider = exports.InBulkUpdateFormButton = exports.NumerousInputsInDialog = exports.NumerousInputs = exports.I18N = exports.Validation = exports.InDialog = exports.Basic = void 0;
var material_1 = require("@mui/material");
var history_1 = require("history");
var ra_data_fakerest_1 = __importDefault(require("ra-data-fakerest"));
var React = __importStar(require("react"));
var react_admin_1 = require("react-admin");
var __1 = require("../..");
var ra_i18n_polyglot_1 = __importDefault(require("ra-i18n-polyglot"));
var ra_language_english_1 = __importDefault(require("ra-language-english"));
var ra_language_french_1 = __importDefault(require("ra-language-french"));
var __2 = require("..");
var TextArrayField_1 = require("../../../stories/TextArrayField");
var InputSelectorForm_1 = require("./InputSelectorForm");
exports.default = {
    title: 'ra-form-layout/InputSelectorForm',
    excludeStories: ['dataProvider'],
};
var customEnglishMessages = {
    resources: {
        posts: {
            fields: {
                title: 'Title',
                body: 'Body',
                published_at: 'Published at',
                is_public: 'Is public',
                tags: 'Tags',
            },
        },
    },
};
var customFrenchMessages = {
    resources: {
        posts: {
            name: 'Article |||| Articles',
            fields: {
                title: 'Titre',
                body: 'Contenu',
                published_at: 'Publié le',
                is_public: 'Public',
                tags: 'Catégories',
            },
        },
        comments: {
            name: 'Commentaire |||| Commentaires',
        },
    },
};
var getI18nProvider = function () {
    return (0, ra_i18n_polyglot_1.default)(function (locale) {
        return locale === 'en'
            ? (0, react_admin_1.mergeTranslations)(customEnglishMessages, ra_language_english_1.default, __1.raFormLayoutLanguageEnglish)
            : (0, react_admin_1.mergeTranslations)(customFrenchMessages, ra_language_french_1.default, __1.raFormLayoutLanguageFrench);
    }, 'en', [
        { locale: 'en', name: 'English' },
        { locale: 'fr', name: 'Français' },
    ]);
};
var Basic = function (_a) {
    var _b = _a.dataProvider, dataProviderProp = _b === void 0 ? exports.dataProvider : _b;
    return (React.createElement(react_admin_1.AdminContext, { dataProvider: dataProviderProp, i18nProvider: getI18nProvider(), store: (0, react_admin_1.memoryStore)({}), history: (0, history_1.createMemoryHistory)() },
        React.createElement(react_admin_1.Edit, { resource: "posts", id: "1", mutationMode: "pessimistic" },
            React.createElement(InputSelectorForm_1.InputSelectorForm, { inputs: [
                    {
                        label: 'Title',
                        element: React.createElement(react_admin_1.TextInput, { source: "title" }),
                    },
                    {
                        label: 'Body',
                        element: React.createElement(react_admin_1.TextInput, { source: "body", multiline: true }),
                    },
                    {
                        label: 'Published at',
                        element: React.createElement(react_admin_1.DateInput, { source: "published_at" }),
                    },
                    {
                        label: 'Is public',
                        element: React.createElement(react_admin_1.BooleanInput, { source: "is_public" }),
                    },
                    {
                        label: 'Tags',
                        element: (React.createElement(react_admin_1.SelectArrayInput, { source: "tags", choices: [
                                { id: 'react', name: 'React' },
                                { id: 'vue', name: 'Vue' },
                                { id: 'solid', name: 'Solid' },
                                { id: 'programming', name: 'Programming' },
                            ] })),
                    },
                ] }))));
};
exports.Basic = Basic;
var InDialog = function () { return (React.createElement(react_admin_1.AdminContext, { dataProvider: exports.dataProvider, i18nProvider: getI18nProvider(), store: (0, react_admin_1.memoryStore)({}), history: (0, history_1.createMemoryHistory)() },
    React.createElement(react_admin_1.Edit, { resource: "posts", id: "1", mutationMode: "pessimistic" },
        React.createElement(material_1.Dialog, { open: true, sx: {
                '& .MuiDialog-paper': { minWidth: { md: '50%' } },
            } },
            React.createElement(InputSelectorForm_1.InputSelectorForm, { inputs: [
                    {
                        label: 'Title',
                        element: React.createElement(react_admin_1.TextInput, { source: "title" }),
                    },
                    {
                        label: 'Body',
                        element: React.createElement(react_admin_1.TextInput, { source: "body", multiline: true }),
                    },
                    {
                        label: 'Published at',
                        element: React.createElement(react_admin_1.DateInput, { source: "published_at" }),
                    },
                    {
                        label: 'Is public',
                        element: React.createElement(react_admin_1.BooleanInput, { source: "is_public" }),
                    },
                    {
                        label: 'Tags',
                        element: (React.createElement(react_admin_1.SelectArrayInput, { source: "tags", choices: [
                                { id: 'react', name: 'React' },
                                { id: 'vue', name: 'Vue' },
                                { id: 'solid', name: 'Solid' },
                                {
                                    id: 'programming',
                                    name: 'Programming',
                                },
                            ] })),
                    },
                ] }))))); };
exports.InDialog = InDialog;
var Validation = function (_a) {
    var _b = _a.dataProvider, dataProviderProp = _b === void 0 ? exports.dataProvider : _b;
    return (React.createElement(react_admin_1.AdminContext, { dataProvider: dataProviderProp, i18nProvider: getI18nProvider(), store: (0, react_admin_1.memoryStore)({}), history: (0, history_1.createMemoryHistory)() },
        React.createElement(react_admin_1.Edit, { resource: "posts", id: "1", mutationMode: "pessimistic" },
            React.createElement(InputSelectorForm_1.InputSelectorForm, { inputs: [
                    {
                        label: 'Title',
                        element: (React.createElement(react_admin_1.TextInput, { source: "title", validate: (0, react_admin_1.required)() })),
                    },
                    {
                        label: 'Body',
                        element: (React.createElement(react_admin_1.TextInput, { source: "body", multiline: true, validate: (0, react_admin_1.required)() })),
                    },
                    {
                        label: 'Published at',
                        element: (React.createElement(react_admin_1.DateInput, { source: "published_at", validate: (0, react_admin_1.required)() })),
                    },
                    {
                        label: 'Is public',
                        element: (React.createElement(react_admin_1.NullableBooleanInput, { source: "is_public", validate: (0, react_admin_1.required)() })),
                    },
                    {
                        label: 'Tags',
                        element: (React.createElement(react_admin_1.SelectArrayInput, { source: "tags", choices: [
                                { id: 'react', name: 'React' },
                                { id: 'vue', name: 'Vue' },
                                { id: 'solid', name: 'Solid' },
                                { id: 'programming', name: 'Programming' },
                            ], validate: (0, react_admin_1.required)() })),
                    },
                ] }))));
};
exports.Validation = Validation;
var I18N = function () { return (React.createElement(react_admin_1.AdminContext, { dataProvider: exports.dataProvider, i18nProvider: getI18nProvider(), store: (0, react_admin_1.memoryStore)({}), history: (0, history_1.createMemoryHistory)() },
    React.createElement(react_admin_1.Edit, { resource: "posts", id: "1", mutationMode: "pessimistic", actions: React.createElement(react_admin_1.TopToolbar, null,
            React.createElement(react_admin_1.LocalesMenuButton, null),
            React.createElement(material_1.Box, { sx: { flex: 1 } })) },
        React.createElement(InputSelectorForm_1.InputSelectorForm, { inputs: [
                {
                    label: 'resources.posts.fields.title',
                    element: React.createElement(react_admin_1.TextInput, { source: "title" }),
                },
                {
                    label: 'resources.posts.fields.body',
                    element: React.createElement(react_admin_1.TextInput, { source: "body", multiline: true }),
                },
                {
                    label: 'resources.posts.fields.published_at',
                    element: React.createElement(react_admin_1.DateInput, { source: "published_at" }),
                },
                {
                    label: 'resources.posts.fields.is_public',
                    element: React.createElement(react_admin_1.BooleanInput, { source: "is_public" }),
                },
                {
                    label: 'resources.posts.fields.tags',
                    element: (React.createElement(react_admin_1.SelectArrayInput, { source: "tags", choices: [
                            { id: 'react', name: 'React' },
                            { id: 'vue', name: 'Vue' },
                            { id: 'solid', name: 'Solid' },
                            { id: 'programming', name: 'Programming' },
                        ] })),
                },
            ] })))); };
exports.I18N = I18N;
var NumerousInputs = function () { return (React.createElement(react_admin_1.AdminContext, { dataProvider: exports.dataProvider, i18nProvider: getI18nProvider(), store: (0, react_admin_1.memoryStore)({}), history: (0, history_1.createMemoryHistory)() },
    React.createElement(react_admin_1.Edit, { resource: "posts", id: "1", mutationMode: "pessimistic" },
        React.createElement(InputSelectorForm_1.InputSelectorForm, { inputs: Array.from(Array(20).keys()).map(function (index) { return ({
                label: "Field ".concat(index),
                element: React.createElement(react_admin_1.TextInput, { source: "field-".concat(index) }),
            }); }) })))); };
exports.NumerousInputs = NumerousInputs;
var NumerousInputsInDialog = function () { return (React.createElement(react_admin_1.AdminContext, { dataProvider: exports.dataProvider, i18nProvider: getI18nProvider(), store: (0, react_admin_1.memoryStore)({}), history: (0, history_1.createMemoryHistory)() },
    React.createElement(react_admin_1.Edit, { resource: "posts", id: "1", mutationMode: "pessimistic" },
        React.createElement(material_1.Dialog, { open: true, sx: {
                '& .MuiDialog-paper': { minWidth: { md: '50%' } },
            } },
            React.createElement(InputSelectorForm_1.InputSelectorForm, { inputs: Array.from(Array(20).keys()).map(function (index) { return ({
                    label: "Field ".concat(index),
                    element: React.createElement(react_admin_1.TextInput, { source: "field-".concat(index) }),
                }); }) }))))); };
exports.NumerousInputsInDialog = NumerousInputsInDialog;
var InBulkUpdateFormButton = function (_a) {
    var _b = _a.dataProvider, dataProviderProp = _b === void 0 ? exports.dataProvider : _b;
    var history = (0, history_1.createMemoryHistory)();
    return (React.createElement(react_admin_1.Admin, { dataProvider: dataProviderProp, i18nProvider: getI18nProvider(), history: history, store: (0, react_admin_1.memoryStore)({}) },
        React.createElement(react_admin_1.Resource, { name: "posts", list: PostList, recordRepresentation: function (record) { return record.title; } }),
        React.createElement(react_admin_1.Resource, { name: "comments", list: CommentList })));
};
exports.InBulkUpdateFormButton = InBulkUpdateFormButton;
var PostBulkUpdateFormButton = function () { return (React.createElement(__2.BulkUpdateFormButton, null,
    React.createElement(InputSelectorForm_1.InputSelectorForm, { inputs: [
            {
                label: 'Published at',
                element: React.createElement(react_admin_1.DateInput, { source: "published_at" }),
            },
            {
                label: 'Is public',
                element: React.createElement(react_admin_1.BooleanInput, { source: "is_public" }),
            },
        ] }))); };
var PostList = function () { return (React.createElement(react_admin_1.List, null,
    React.createElement(react_admin_1.Datagrid, { bulkActionButtons: React.createElement(PostBulkUpdateFormButton, null) },
        React.createElement(react_admin_1.TextField, { source: "id" }),
        React.createElement(react_admin_1.TextField, { source: "title" }),
        React.createElement(react_admin_1.DateField, { source: "published_at" }),
        React.createElement(react_admin_1.BooleanField, { source: "is_public" }),
        React.createElement(TextArrayField_1.TextArrayField, { source: "tags" })))); };
var CommentBulkUpdateFormButton = function () { return (React.createElement(__2.BulkUpdateFormButton, null,
    React.createElement(InputSelectorForm_1.InputSelectorForm, { inputs: [
            {
                label: 'Post',
                element: (React.createElement(react_admin_1.ReferenceInput, { source: "post_id", reference: "posts" },
                    React.createElement(react_admin_1.SelectInput, null))),
            },
            {
                label: 'Author',
                element: React.createElement(react_admin_1.TextInput, { source: "author.name" }),
            },
        ] }))); };
var CommentList = function () { return (React.createElement(react_admin_1.List, null,
    React.createElement(react_admin_1.Datagrid, { bulkActionButtons: React.createElement(CommentBulkUpdateFormButton, null) },
        React.createElement(react_admin_1.TextField, { source: "id" }),
        React.createElement(react_admin_1.ReferenceField, { source: "post_id", reference: "posts" },
            React.createElement(react_admin_1.TextField, { source: "title" })),
        React.createElement(react_admin_1.TextField, { source: "author.name" })))); };
var addDelay = function (dataProvider, delay) {
    if (delay === void 0) { delay = 300; }
    return new Proxy(dataProvider, {
        get: function (target, name) { return function (resource, params) {
            if (typeof name === 'symbol' || name === 'then') {
                return;
            }
            return new Promise(function (resolve) {
                return setTimeout(function () { return resolve(dataProvider[name](resource, params)); }, delay);
            });
        }; },
    });
};
exports.dataProvider = addDelay((0, ra_data_fakerest_1.default)({
    posts: [
        {
            id: 1,
            title: 'Accusantium qui nihil voluptatum quia voluptas maxime ab similique',
            body: 'In facilis aut aut odit hic doloribus. Fugit possimus perspiciatis sit molestias in. Sunt dignissimos sed quis at vitae veniam amet. Sint sunt perspiciatis quis doloribus aperiam numquam consequatur et. Blanditiis aut earum incidunt eos magnam et voluptatem. Minima iure voluptatum autem. At eaque sit aperiam minima aut in illum.',
            published_at: new Date('2012-08-06').toISOString(),
            is_public: false,
            tags: ['react', 'programming'],
        },
        {
            id: 2,
            title: 'Sint dignissimos in architecto aut',
            body: 'Quam earum itaque corrupti labore quas nihil sed. Dolores sunt culpa voluptates exercitationem eveniet totam rerum. Molestias perspiciatis rem numquam accusamus.',
            published_at: new Date('2012-08-08').toISOString(),
            is_public: true,
            tags: ['react', 'programming'],
        },
        {
            id: 3,
            title: 'Perspiciatis adipisci vero qui ipsam iure porro',
            body: 'Ut ad consequatur esse illum. Ex dolore porro et ut sit. Commodi qui sed et voluptatibus laudantium.',
            published_at: new Date('2012-08-08').toISOString(),
            is_public: true,
            tags: ['react', 'programming'],
        },
        {
            id: 4,
            title: 'Maiores et itaque aut perspiciatis',
            body: 'Et quo voluptas odit veniam omnis dolores. Odit commodi consequuntur necessitatibus dolorem officia. Reiciendis quas exercitationem libero sed. Itaque non facilis sit tempore aut doloribus.',
            published_at: new Date('2012-08-12').toISOString(),
            is_public: false,
            tags: ['react', 'programming'],
        },
        {
            id: 5,
            title: 'Sed quo et et fugiat modi',
            body: 'Consequuntur id aut soluta aspernatur sit. Aut doloremque recusandae sit saepe ut quas earum. Quae pariatur iure et ducimus non. Cupiditate dolorem itaque in sit.',
            published_at: new Date('2012-08-05').toISOString(),
            is_public: true,
            tags: ['react', 'programming'],
        },
        {
            id: 6,
            title: 'Minima ea vero omnis odit officiis aut',
            body: 'Omnis rerum voluptatem illum. Amet totam minus id qui aspernatur. Adipisci commodi velit sapiente architecto et molestias. Maiores doloribus quis occaecati quidem laborum. Quae quia quaerat est itaque. Vero assumenda quia tempora libero dicta quis asperiores magnam. Necessitatibus accusantium saepe commodi ut.',
            published_at: new Date('2012-09-05').toISOString(),
            is_public: false,
            tags: ['react', 'programming'],
        },
        {
            id: 7,
            title: 'Illum veritatis corrupti exercitationem sed velit',
            body: 'Omnis hic quo aperiam fugiat iure amet est. Molestias ratione aut et dolor earum magnam placeat. Ad a quam ea amet hic omnis rerum.',
            published_at: new Date('2012-09-29').toISOString(),
            is_public: true,
            tags: ['vue', 'programming'],
        },
        {
            id: 8,
            title: 'Culpa possimus quibusdam nostrum enim tempore rerum odit excepturi',
            body: 'Qui quos exercitationem itaque quia. Repellat libero ut recusandae quidem repudiandae ipsam laudantium. Eveniet quos et quo omnis aut commodi incidunt.',
            published_at: new Date('2012-10-02').toISOString(),
            is_public: true,
            tags: ['react', 'programming'],
        },
        {
            id: 9,
            title: 'A voluptas eius eveniet ut commodi dolor',
            body: 'Sed necessitatibus nesciunt nesciunt aut non sunt. Quam ut in a sed ducimus eos qui sint. Commodi illo necessitatibus sint explicabo maiores. Maxime voluptates sit distinctio quo excepturi. Qui aliquid debitis repellendus distinctio et aut. Ex debitis et quasi id.',
            published_at: new Date('2012-10-16').toISOString(),
            is_public: false,
            tags: ['solid', 'programming'],
        },
        {
            id: 10,
            title: 'Totam vel quasi a odio et nihil',
            body: 'Excepturi veritatis velit rerum nemo voluptatem illum tempora eos. Et impedit sed qui et iusto. A alias asperiores quia quo.',
            published_at: new Date('2012-10-19').toISOString(),
            is_public: true,
            tags: ['vue', 'programming'],
        },
        {
            id: 11,
            title: 'Omnis voluptate enim similique est possimus',
            body: 'Velit eos vero reprehenderit ut assumenda saepe qui. Quasi aut laboriosam quas voluptate voluptatem. Et eos officia repudiandae quaerat. Mollitia libero numquam laborum eos.',
            published_at: new Date('2012-10-22').toISOString(),
            is_public: false,
            tags: ['solid', 'programming'],
        },
        {
            id: 12,
            title: 'Qui tempore rerum et voluptates',
            body: 'Occaecati rem perferendis dolor aut numquam cupiditate. At tenetur dolores pariatur et libero asperiores porro voluptas. Officiis corporis sed eos repellendus perferendis distinctio hic consequatur.',
            published_at: new Date('2012-11-07').toISOString(),
            is_public: true,
            tags: ['solid', 'programming'],
        },
        {
            id: 13,
            title: 'Fusce massa lorem, pulvinar a posuere ut, accumsan ac nisi',
            body: 'Quam earum itaque corrupti labore quas nihil sed. Dolores sunt culpa voluptates exercitationem eveniet totam rerum. Molestias perspiciatis rem numquam accusamus.',
            published_at: new Date('2012-12-01').toISOString(),
            is_public: true,
            tags: ['solid', 'programming'],
        },
    ],
    comments: [
        {
            id: 1,
            author: {},
            post_id: 6,
            body: "Queen, tossing her head through the wood. 'If it had lost something; and she felt sure it.",
            created_at: new Date('2012-08-02').toISOString(),
        },
        {
            id: 2,
            author: {
                name: 'Kiley Pouros',
                email: 'kiley@gmail.com',
            },
            post_id: 9,
            body: "White Rabbit: it was indeed: she was out of the ground--and I should frighten them out of its right paw round, 'lives a March Hare. 'Sixteenth,'.",
            created_at: new Date('2012-08-08').toISOString(),
        },
        {
            id: 3,
            author: {
                name: 'Justina Hegmann',
            },
            post_id: 3,
            body: "I'm not Ada,' she said, 'and see whether it's marked \"poison\" or.",
            created_at: new Date('2012-08-02').toISOString(),
        },
        {
            id: 4,
            author: {
                name: 'Ms. Brionna Smitham MD',
            },
            post_id: 6,
            body: "Dormouse. 'Fourteenth of March, I think I can say.' This was such a noise inside, no one else seemed inclined.",
            created_at: new Date('2014-09-24').toISOString(),
        },
        {
            id: 5,
            author: {
                name: 'Edmond Schulist',
            },
            post_id: 1,
            body: "I ought to tell me your history, you know,' the Hatter and the happy summer days. THE.",
            created_at: new Date('2012-08-07').toISOString(),
        },
        {
            id: 6,
            author: {
                name: 'Danny Greenholt',
            },
            post_id: 6,
            body: 'Duchess asked, with another hedgehog, which seemed to be lost: away went Alice after it, never once considering how in the other. In the very tones of.',
            created_at: new Date('2012-08-09').toISOString(),
        },
        {
            id: 7,
            author: {
                name: 'Luciano Berge',
            },
            post_id: 5,
            body: "While the Panther were sharing a pie--' [later editions continued as follows.",
            created_at: new Date('2012-09-06').toISOString(),
        },
        {
            id: 8,
            author: {
                name: 'Annamarie Mayer',
            },
            post_id: 5,
            body: "I tell you, you coward!' and at once and put it more clearly,' Alice.",
            created_at: new Date('2012-10-03').toISOString(),
        },
        {
            id: 9,
            author: {
                name: 'Breanna Gibson',
            },
            post_id: 2,
            body: "THAT. Then again--\"BEFORE SHE HAD THIS FIT--\" you never tasted an egg!' 'I HAVE tasted eggs, certainly,' said Alice, as she spoke. Alice did not like to have it.",
            created_at: new Date('2012-11-06').toISOString(),
        },
        {
            id: 10,
            author: {
                name: 'Logan Schowalter',
            },
            post_id: 3,
            body: "I'd been the whiting,' said the Hatter, it woke up again with a T!' said the Gryphon. '--you advance twice--' 'Each with a growl, And concluded the banquet--] 'What IS the fun?' said.",
            created_at: new Date('2012-12-07').toISOString(),
        },
        {
            id: 11,
            author: {
                name: 'Logan Schowalter',
            },
            post_id: 1,
            body: "I don't want to be?' it asked. 'Oh, I'm not Ada,' she said, 'and see whether it's marked \"poison\" or not'; for she had asked it aloud; and in despair she put her hand on the end of the.",
            created_at: new Date('2012-08-05').toISOString(),
        },
    ],
}, process.env.NODE_ENV !== 'test'));
