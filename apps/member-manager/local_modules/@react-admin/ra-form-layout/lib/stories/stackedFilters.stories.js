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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomOperator = exports.CustomFilter = exports.ExistingFilters = exports.TranslationSupport = exports.Sx = exports.Basic = void 0;
var React = __importStar(require("react"));
var react_1 = require("react");
var react_admin_1 = require("react-admin");
var ra_data_fakerest_1 = __importDefault(require("ra-data-fakerest"));
var material_1 = require("@mui/material");
var colors_1 = require("@mui/material/colors");
var ExpandMore_1 = __importDefault(require("@mui/icons-material/ExpandMore"));
var history_1 = require("history");
var react_hook_form_1 = require("react-hook-form");
var format_1 = __importDefault(require("date-fns/format"));
var src_1 = require("../src");
var ra_i18n_polyglot_1 = __importDefault(require("ra-i18n-polyglot"));
var ra_language_english_1 = __importDefault(require("ra-language-english"));
var ra_language_french_1 = __importDefault(require("ra-language-french"));
var TextArrayField_1 = require("./TextArrayField");
exports.default = { title: 'ra-form-layout/StackedFilters/FullApp' };
var i18nProvider = (0, ra_i18n_polyglot_1.default)(function () { return (0, react_admin_1.mergeTranslations)(ra_language_english_1.default, src_1.raFormLayoutLanguageEnglish); }, 'en');
var Basic = function () {
    var history = (0, history_1.createMemoryHistory)();
    return (React.createElement(react_admin_1.Admin, { dataProvider: dataProvider, i18nProvider: i18nProvider, history: history, store: (0, react_admin_1.memoryStore)() },
        React.createElement(react_admin_1.Resource, { name: "posts", list: PostList, recordRepresentation: function (record) { return record.title; } }),
        React.createElement(react_admin_1.Resource, { name: "comments", list: CommentList })));
};
exports.Basic = Basic;
var Sx = function () {
    var history = (0, history_1.createMemoryHistory)();
    return (React.createElement(react_admin_1.Admin, { dataProvider: dataProvider, i18nProvider: i18nProvider, history: history, store: (0, react_admin_1.memoryStore)() },
        React.createElement(react_admin_1.Resource, { name: "posts", list: PostListSx, recordRepresentation: function (record) { return record.title; } }),
        React.createElement(react_admin_1.Resource, { name: "comments", list: CommentList })));
};
exports.Sx = Sx;
var TranslationSupport = function () {
    var history = (0, history_1.createMemoryHistory)();
    var i18nProvider = (0, ra_i18n_polyglot_1.default)(function (locale) {
        return locale === 'fr'
            ? (0, react_admin_1.mergeTranslations)(ra_language_french_1.default, src_1.raFormLayoutLanguageFrench)
            : (0, react_admin_1.mergeTranslations)(ra_language_english_1.default, src_1.raFormLayoutLanguageEnglish);
    }, 'en', [
        { locale: 'fr', name: 'Français' },
        { locale: 'en', name: 'English' },
    ]);
    return (React.createElement(react_admin_1.Admin, { dataProvider: dataProvider, i18nProvider: i18nProvider, history: history, store: (0, react_admin_1.memoryStore)() },
        React.createElement(react_admin_1.Resource, { name: "posts", list: PostList, recordRepresentation: function (record) { return record.title; } }),
        React.createElement(react_admin_1.Resource, { name: "comments", list: CommentList })));
};
exports.TranslationSupport = TranslationSupport;
var ExistingFilters = function () {
    var params = new URLSearchParams();
    params.append('displayedFilters', JSON.stringify({ title_q: true, is_public_eq: true }));
    params.append('filter', JSON.stringify({ title_q: 'volup', is_public_eq: true }));
    params.append('page', '1');
    params.append('perPage', '10');
    params.append('sort', 'id');
    params.append('order', 'ASC');
    var history = (0, history_1.createMemoryHistory)({
        initialEntries: ["/posts?".concat(params.toString())],
    });
    return (React.createElement(react_admin_1.Admin, { dataProvider: dataProvider, i18nProvider: i18nProvider, history: history, store: (0, react_admin_1.memoryStore)() },
        React.createElement(react_admin_1.Resource, { name: "posts", list: PostList, recordRepresentation: function (record) { return record.title; } }),
        React.createElement(react_admin_1.Resource, { name: "comments", list: CommentList })));
};
exports.ExistingFilters = ExistingFilters;
var PostListFilters = {
    id: (0, src_1.textFilter)({ operators: ['eq', 'neq'] }),
    title: (0, src_1.textFilter)(),
    published_at: (0, src_1.dateFilter)(),
    is_public: (0, src_1.booleanFilter)(),
    tags: (0, src_1.choicesArrayFilter)({
        choices: [
            { id: 'solid', name: 'Solid' },
            { id: 'react', name: 'React' },
            { id: 'vue', name: 'Vue' },
            { id: 'programming', name: 'Programming' },
        ],
    }),
};
var PostListToolbar = function () { return (React.createElement(react_admin_1.TopToolbar, null,
    React.createElement(react_admin_1.CreateButton, null),
    React.createElement(src_1.StackedFilters, { config: PostListFilters }))); };
var PostList = function (_a) {
    var _b = _a.actions, actions = _b === void 0 ? React.createElement(PostListToolbar, null) : _b;
    return (React.createElement(react_admin_1.List, { actions: actions },
        React.createElement(react_admin_1.Datagrid, null,
            React.createElement(react_admin_1.TextField, { source: "id" }),
            React.createElement(react_admin_1.TextField, { source: "title" }),
            React.createElement(react_admin_1.DateField, { source: "published_at" }),
            React.createElement(TextArrayField_1.TextArrayField, { source: "tags" }))));
};
var PostListToolbarSx = function () { return (React.createElement(react_admin_1.TopToolbar, null,
    React.createElement(react_admin_1.CreateButton, null),
    React.createElement(src_1.StackedFilters, { config: CommentListFilters, sx: {
            '& .MuiButton-root': {
                backgroundColor: colors_1.blueGrey[400],
                color: 'white',
            },
        }, StackedFiltersFormProps: {
            sx: {
                '& .RaStackedFiltersForm-sourceInput .MuiInputBase-root': {
                    borderWidth: 1,
                    borderStyle: 'solid',
                    borderColor: colors_1.blueGrey[400],
                },
                '& .RaStackedFiltersForm-operatorInput .MuiInputBase-root': {
                    borderWidth: 1,
                    borderStyle: 'solid',
                    borderColor: colors_1.blueGrey[400],
                },
                '& .RaStackedFiltersForm-valueInput .MuiInputBase-root': {
                    borderWidth: 1,
                    borderStyle: 'solid',
                    borderColor: colors_1.blueGrey[400],
                },
                '& .RaStackedFiltersActions-applyButton': {
                    backgroundColor: colors_1.blueGrey[400],
                    color: 'white',
                },
            },
        } }))); };
var PostListSx = function () { return React.createElement(PostList, { actions: React.createElement(PostListToolbarSx, null) }); };
var CommentListFilters = {
    id: (0, src_1.textFilter)({ operators: ['eq', 'neq'] }),
    post_id: (0, src_1.referenceFilter)({ reference: 'posts', optionText: 'title' }),
    'author.name': (0, src_1.textFilter)(),
};
var CommentListToolbar = function () { return (React.createElement(react_admin_1.TopToolbar, null,
    React.createElement(react_admin_1.CreateButton, null),
    React.createElement(src_1.StackedFilters, { config: CommentListFilters }))); };
var CommentList = function () { return (React.createElement(react_admin_1.List, { actions: React.createElement(CommentListToolbar, null) },
    React.createElement(react_admin_1.Datagrid, null,
        React.createElement(react_admin_1.TextField, { source: "id" }),
        React.createElement(react_admin_1.ReferenceField, { source: "post_id", reference: "posts" },
            React.createElement(react_admin_1.TextField, { source: "title" })),
        React.createElement(react_admin_1.TextField, { source: "author.name" })))); };
var CustomFilter = function () {
    var history = (0, history_1.createMemoryHistory)();
    return (React.createElement(react_admin_1.Admin, { dataProvider: dataProvider, i18nProvider: i18nProvider, history: history, store: (0, react_admin_1.memoryStore)() },
        React.createElement(react_admin_1.Resource, { name: "posts", list: CustomFilterPostList, recordRepresentation: function (record) { return record.title; } }),
        React.createElement(react_admin_1.Resource, { name: "comments", list: CommentList })));
};
exports.CustomFilter = CustomFilter;
var PostListFiltersForm = function () {
    var filterValues = (0, react_admin_1.useListContext)().filterValues;
    return (React.createElement(material_1.Accordion, { sx: { my: 1 } },
        React.createElement(material_1.AccordionSummary, { expandIcon: React.createElement(ExpandMore_1.default, null), "aria-controls": "filters-content", id: "filters-header" },
            React.createElement(material_1.Typography, null, Object.keys(filterValues).length ? (React.createElement(React.Fragment, null,
                Object.keys(filterValues).length,
                " filter(s) applied")) : ('Filters'))),
        React.createElement(material_1.AccordionDetails, { id: "filters-content" },
            React.createElement(src_1.StackedFiltersForm, { config: PostListFilters }))));
};
var CustomFilterPostList = function () { return (React.createElement(react_admin_1.ListBase, null,
    React.createElement(PostListFiltersForm, null),
    React.createElement(material_1.Card, null,
        React.createElement(react_admin_1.Datagrid, null,
            React.createElement(react_admin_1.TextField, { source: "id" }),
            React.createElement(react_admin_1.TextField, { source: "title" }),
            React.createElement(react_admin_1.DateField, { source: "published_at" }),
            React.createElement(TextArrayField_1.TextArrayField, { source: "tags" }))))); };
var CustomOperator = function () {
    var params = new URLSearchParams();
    params.append('displayedFilters', JSON.stringify({ published_at_between: true }));
    params.append('filter', JSON.stringify({
        published_at_between: [
            new Date('2012-09-01'),
            new Date('2012-09-30'),
        ],
    }));
    params.append('page', '1');
    params.append('perPage', '10');
    params.append('sort', 'id');
    params.append('order', 'ASC');
    var history = (0, history_1.createMemoryHistory)({
        initialEntries: ["/posts?".concat(params.toString())],
    });
    var i18nProvider = (0, ra_i18n_polyglot_1.default)(function () {
        return (0, react_admin_1.mergeTranslations)(ra_language_english_1.default, src_1.raFormLayoutLanguageEnglish, {
            resources: {
                posts: {
                    filters: {
                        operators: {
                            between: 'Between',
                            nbetween: 'Not between',
                        },
                    },
                },
            },
        });
    }, 'en');
    // Fake handling of the between and nbetween operators
    var dataProviderWithBetween = __assign(__assign({}, dataProvider), { getList: function (resource, params) { return __awaiter(void 0, void 0, void 0, function () {
            var _a, beforeData, beforeTotal, _b, afterData, afterTotal, data, allData, total, startIndex, i;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (params.filter.published_at_between) {
                            return [2 /*return*/, dataProvider.getList(resource, __assign(__assign({}, params), { filter: {
                                        published_at_gte: params.filter.published_at_between[0],
                                        published_at_lte: params.filter.published_at_between[1],
                                    } }))];
                        }
                        if (!params.filter.published_at_nbetween) return [3 /*break*/, 3];
                        return [4 /*yield*/, dataProvider.getList(resource, __assign(__assign({}, params), { pagination: { page: 1, perPage: 1000 }, filter: {
                                    published_at_lt: params.filter.published_at_nbetween[0],
                                } }))];
                    case 1:
                        _a = _c.sent(), beforeData = _a.data, beforeTotal = _a.total;
                        return [4 /*yield*/, dataProvider.getList(resource, __assign(__assign({}, params), { pagination: { page: 1, perPage: 1000 }, filter: {
                                    published_at_gt: params.filter.published_at_nbetween[1],
                                } }))];
                    case 2:
                        _b = _c.sent(), afterData = _b.data, afterTotal = _b.total;
                        data = [];
                        allData = __spreadArray(__spreadArray([], beforeData, true), afterData, true);
                        total = beforeTotal + afterTotal;
                        startIndex = (params.pagination.page - 1) * params.pagination.perPage;
                        for (i = startIndex; i < total; i++) {
                            if (allData[i]) {
                                data.push(allData[i]);
                            }
                            if (data.length === params.pagination.perPage) {
                                break;
                            }
                        }
                        return [2 /*return*/, { data: data, total: total }];
                    case 3: return [2 /*return*/, dataProvider.getList(resource, params)];
                }
            });
        }); } });
    return (React.createElement(react_admin_1.Admin, { dataProvider: dataProviderWithBetween, i18nProvider: i18nProvider, history: history, store: (0, react_admin_1.memoryStore)() },
        React.createElement(react_admin_1.Resource, { name: "posts", list: CustomOperatorPostList })));
};
exports.CustomOperator = CustomOperator;
var CustomOperatorFilters = {
    published_at: {
        operators: [
            {
                value: 'between',
                label: 'resources.posts.filters.operators.between',
            },
            {
                value: 'nbetween',
                label: 'resources.posts.filters.operators.nbetween',
            },
        ],
        // eslint-disable-next-line react/display-name
        input: function (_a) {
            var source = _a.source;
            return React.createElement(DateRangeInput, { source: source });
        },
    },
};
var DateRangeInput = function (_a) {
    var source = _a.source;
    // register the input in react-hook-form
    var field = (0, react_admin_1.useInput)({ source: source }).field;
    var value = field.value;
    var form = (0, react_hook_form_1.useFormContext)();
    var _b = (0, react_1.useState)(value && value.length > 0
        ? (0, format_1.default)(new Date(value[0]), 'yyyy-MM-dd')
        : ''), start = _b[0], setStart = _b[1];
    var _c = (0, react_1.useState)(value && value.length > 0
        ? (0, format_1.default)(new Date(value[1]), 'yyyy-MM-dd')
        : ''), end = _c[0], setEnd = _c[1];
    var handleStartChange = function (event) {
        setStart(event.target.value);
        if (end) {
            form.setValue(source, [event.target.value, end], {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
            });
        }
    };
    var handleEndChange = function (event) {
        setEnd(event.target.value);
        if (start) {
            form.setValue(source, [start, event.target.value], {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
            });
        }
    };
    return (React.createElement(material_1.Stack, { gap: 1, direction: "row", alignItems: "baseline" },
        React.createElement(material_1.TextField, { name: "".concat(source, "_start"), onChange: handleStartChange, value: start, type: "date" }),
        React.createElement(material_1.Typography, null, "and"),
        React.createElement(material_1.TextField, { name: "".concat(source, "_end"), onChange: handleEndChange, value: end, type: "date" })));
};
var CustomOperatorToolbar = function () { return (React.createElement(react_admin_1.TopToolbar, null,
    React.createElement(react_admin_1.CreateButton, null),
    React.createElement(src_1.StackedFilters, { config: CustomOperatorFilters }))); };
var CustomOperatorPostList = function () { return (React.createElement(react_admin_1.List, { actions: React.createElement(CustomOperatorToolbar, null) },
    React.createElement(react_admin_1.Datagrid, null,
        React.createElement(react_admin_1.TextField, { source: "id" }),
        React.createElement(react_admin_1.TextField, { source: "title" }),
        React.createElement(react_admin_1.DateField, { source: "published_at" }),
        React.createElement(TextArrayField_1.TextArrayField, { source: "tags" })))); };
var dataProvider = (0, ra_data_fakerest_1.default)({
    books: [],
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
}, process.env.NODE_ENV !== 'test');
