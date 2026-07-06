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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Locale = exports.OpenAI = exports.Slow = exports.Context = exports.Short = exports.DataProviderError = exports.Type = exports.Sx = exports.MultilineFullWidth = exports.MultilineRows = exports.MultilineAutoSize = exports.Source = exports.Temperature = exports.Stop = exports.MaxSize = exports.PromptGenerator = exports.Debounce = exports.Variant = exports.FullWidth = exports.Default = exports.Basic = void 0;
var React = __importStar(require("react"));
var material_1 = require("@mui/material");
var react_query_1 = require("react-query");
var devtools_1 = require("react-query/devtools");
var react_admin_1 = require("react-admin");
var react_router_dom_1 = require("react-router-dom");
var PredictiveTextInput_1 = require("./PredictiveTextInput");
var addGetCompletionBasedOnOpenAIAPI_1 = require("../../dataProvider/addGetCompletionBasedOnOpenAIAPI");
var OpenAIWrapper_1 = require("../test/OpenAIWrapper");
exports.default = {
    title: 'ra-ai/input/PredictiveTextInput',
};
var delayedPromise = function (data, delay) {
    if (delay === void 0) { delay = 1000; }
    return function () {
        return new Promise(function (resolve) {
            setTimeout(function () { return resolve(data); }, delay);
        });
    };
};
var Basic = function () { return (React.createElement(react_router_dom_1.MemoryRouter, null,
    React.createElement(material_1.ThemeProvider, { theme: (0, material_1.createTheme)() },
        React.createElement(react_query_1.QueryClientProvider, { client: new react_query_1.QueryClient() },
            React.createElement(react_admin_1.DataProviderContext.Provider, { value: __assign(__assign({}, (0, react_admin_1.testDataProvider)()), { getCompletion: delayedPromise({
                        data: ' dolor sit amet',
                    }) }) },
                React.createElement(material_1.Box, { m: 2 },
                    React.createElement(react_admin_1.SimpleForm, { record: { title: 'Lorem' } },
                        React.createElement(PredictiveTextInput_1.PredictiveTextInput, { source: "title" })))))))); };
exports.Basic = Basic;
var Default = function () { return (React.createElement(react_admin_1.AdminContext, { i18nProvider: react_admin_1.defaultI18nProvider, dataProvider: __assign(__assign({}, (0, react_admin_1.testDataProvider)()), { getCompletion: delayedPromise({
            data: ' dolor sit amet',
        }) }) },
    React.createElement(material_1.Box, { m: 2 },
        React.createElement(react_admin_1.SimpleForm, { record: { title: 'Lorem' } },
            React.createElement(PredictiveTextInput_1.PredictiveTextInput, { source: "title" }))))); };
exports.Default = Default;
var FullWidth = function () { return (React.createElement(react_admin_1.AdminContext, { i18nProvider: react_admin_1.defaultI18nProvider, dataProvider: __assign(__assign({}, (0, react_admin_1.testDataProvider)()), { getCompletion: delayedPromise({
            data: ' dolor sit amet',
        }) }) },
    React.createElement(material_1.Box, { m: 2 },
        React.createElement(react_admin_1.SimpleForm, { record: { title: 'Lorem' } },
            React.createElement(PredictiveTextInput_1.PredictiveTextInput, { source: "title", fullWidth: true }))))); };
exports.FullWidth = FullWidth;
var Variant = function () { return (React.createElement(react_admin_1.AdminContext, { i18nProvider: react_admin_1.defaultI18nProvider, dataProvider: __assign(__assign({}, (0, react_admin_1.testDataProvider)()), { getCompletion: delayedPromise({
            data: ' dolor sit amet',
        }) }) },
    React.createElement(material_1.Box, { m: 2 },
        React.createElement(react_admin_1.SimpleForm, { record: { title: 'Lorem' } },
            React.createElement(PredictiveTextInput_1.PredictiveTextInput, { variant: "outlined", source: "title" }))))); };
exports.Variant = Variant;
var ReRenderPeriodically = function (_a) {
    var children = _a.children;
    var _b = React.useState(0), _render = _b[0], setRender = _b[1];
    React.useEffect(function () {
        var interval = setInterval(function () {
            setRender(function (render) { return render + 1; });
        }, 100);
        return function () { return clearInterval(interval); };
    }, []);
    return children();
};
var Debounce = function (_a) {
    var _b = _a.debounce, debounce = _b === void 0 ? 1000 : _b;
    var nbCalls = React.useRef(0);
    return (React.createElement(react_admin_1.AdminContext, { i18nProvider: react_admin_1.defaultI18nProvider, dataProvider: __assign(__assign({}, (0, react_admin_1.testDataProvider)()), { getCompletion: function () {
                nbCalls.current++;
                return new Promise(function (resolve) {
                    return setTimeout(function () { return resolve({ data: ' dolor sit amet' }); }, 100);
                });
            } }) },
        React.createElement(material_1.Box, { m: 2, display: "flex", gap: 2, flexDirection: "column" },
            React.createElement(react_admin_1.SimpleForm, { record: { title: 'Lorem' } },
                React.createElement(PredictiveTextInput_1.PredictiveTextInput, { debounce: debounce, source: "title" })),
            React.createElement(ReRenderPeriodically, null, function () { return (React.createElement(material_1.Alert, { severity: "info" },
                nbCalls.current,
                " calls to the dataProvider")); }))));
};
exports.Debounce = Debounce;
exports.Debounce.args = {
    debounce: 1000,
};
var PromptGenerator = function () {
    var _a = React.useState(''), prompt = _a[0], setPrompt = _a[1];
    return (React.createElement(react_admin_1.AdminContext, { i18nProvider: react_admin_1.defaultI18nProvider, dataProvider: __assign(__assign({}, (0, react_admin_1.testDataProvider)()), { getCompletion: function (_a) {
                var prompt = _a.prompt;
                return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_b) {
                        setPrompt(prompt);
                        return [2 /*return*/, { data: ' dolor sit amet' }];
                    });
                });
            } }) },
        React.createElement(react_admin_1.ResourceContextProvider, { value: "users" },
            React.createElement(material_1.Box, { m: 2 },
                React.createElement(react_admin_1.SimpleForm, { record: { title: 'Lorem' } },
                    React.createElement(PredictiveTextInput_1.PredictiveTextInput, { promptGenerator: function (params) { return JSON.stringify(params); }, source: "title" })),
                React.createElement(material_1.Alert, { severity: "info" },
                    "Custom prompt is: ",
                    prompt)))));
};
exports.PromptGenerator = PromptGenerator;
var MaxSize = function () {
    var _a = React.useState(), maxSize = _a[0], setMaxSize = _a[1];
    return (React.createElement(react_admin_1.AdminContext, { i18nProvider: react_admin_1.defaultI18nProvider, dataProvider: __assign(__assign({}, (0, react_admin_1.testDataProvider)()), { getCompletion: function (_a) {
                var maxSize = _a.maxSize;
                return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_b) {
                        setMaxSize(maxSize);
                        return [2 /*return*/, { data: ' dolor sit amet' }];
                    });
                });
            } }) },
        React.createElement(react_admin_1.ResourceContextProvider, { value: "users" },
            React.createElement(material_1.Box, { m: 2 },
                React.createElement(react_admin_1.SimpleForm, { record: { title: 'Lorem' } },
                    React.createElement(PredictiveTextInput_1.PredictiveTextInput, { maxSize: 128, source: "title" })),
                React.createElement(material_1.Alert, { severity: "info" },
                    "Custom maxSize param is: ",
                    JSON.stringify(maxSize))))));
};
exports.MaxSize = MaxSize;
var Stop = function () {
    var _a = React.useState(), stop = _a[0], setStop = _a[1];
    return (React.createElement(react_admin_1.AdminContext, { i18nProvider: react_admin_1.defaultI18nProvider, dataProvider: __assign(__assign({}, (0, react_admin_1.testDataProvider)()), { getCompletion: function (_a) {
                var stop = _a.stop;
                return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_b) {
                        setStop(stop);
                        return [2 /*return*/, { data: ' dolor sit amet' }];
                    });
                });
            } }) },
        React.createElement(react_admin_1.ResourceContextProvider, { value: "users" },
            React.createElement(material_1.Box, { m: 2 },
                React.createElement(react_admin_1.SimpleForm, { record: { title: 'Lorem' } },
                    React.createElement(PredictiveTextInput_1.PredictiveTextInput, { stop: ['ipsum', 'sic'], source: "title" })),
                React.createElement(material_1.Alert, { severity: "info" },
                    "Custom stop param is: ",
                    JSON.stringify(stop))))));
};
exports.Stop = Stop;
var Temperature = function () {
    var _a = React.useState(), temperature = _a[0], setTemperature = _a[1];
    return (React.createElement(react_admin_1.AdminContext, { i18nProvider: react_admin_1.defaultI18nProvider, dataProvider: __assign(__assign({}, (0, react_admin_1.testDataProvider)()), { getCompletion: function (_a) {
                var temperature = _a.temperature;
                return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_b) {
                        setTemperature(temperature);
                        return [2 /*return*/, { data: ' dolor sit amet' }];
                    });
                });
            } }) },
        React.createElement(react_admin_1.ResourceContextProvider, { value: "users" },
            React.createElement(material_1.Box, { m: 2 },
                React.createElement(react_admin_1.SimpleForm, { record: { title: 'Lorem' } },
                    React.createElement(PredictiveTextInput_1.PredictiveTextInput, { temperature: 0.5, source: "title" })),
                React.createElement(material_1.Alert, { severity: "info" },
                    "Custom temperature param is: ",
                    temperature)))));
};
exports.Temperature = Temperature;
var Source = function () { return (React.createElement(react_admin_1.AdminContext, { i18nProvider: react_admin_1.defaultI18nProvider, dataProvider: __assign(__assign({}, (0, react_admin_1.testDataProvider)()), { getCompletion: delayedPromise({
            data: ' dolor sit amet',
        }) }) },
    React.createElement(material_1.Box, { m: 2 },
        React.createElement(react_admin_1.SimpleForm, { record: { foo: { title: 'Lorem ipsum' } } },
            React.createElement(PredictiveTextInput_1.PredictiveTextInput, { multiline: true, source: "foo.title" }))))); };
exports.Source = Source;
var MultilineAutoSize = function () { return (React.createElement(react_admin_1.AdminContext, { i18nProvider: react_admin_1.defaultI18nProvider, dataProvider: __assign(__assign({}, (0, react_admin_1.testDataProvider)()), { getCompletion: delayedPromise({
            data: ' dolor sit amet',
        }) }) },
    React.createElement(material_1.Box, { m: 2 },
        React.createElement(react_admin_1.SimpleForm, { record: { title: 'Lorem ipsum' } },
            React.createElement(PredictiveTextInput_1.PredictiveTextInput, { multiline: true, source: "title" }))))); };
exports.MultilineAutoSize = MultilineAutoSize;
var MultilineRows = function () { return (React.createElement(react_admin_1.AdminContext, { i18nProvider: react_admin_1.defaultI18nProvider, dataProvider: __assign(__assign({}, (0, react_admin_1.testDataProvider)()), { getCompletion: delayedPromise({
            data: ' dolor sit amet',
        }) }) },
    React.createElement(material_1.Box, { m: 2 },
        React.createElement(react_admin_1.SimpleForm, { record: { title: 'Lorem ipsum' } },
            React.createElement(PredictiveTextInput_1.PredictiveTextInput, { multiline: true, rows: 3, source: "title" }))))); };
exports.MultilineRows = MultilineRows;
var MultilineFullWidth = function () { return (React.createElement(react_admin_1.AdminContext, { i18nProvider: react_admin_1.defaultI18nProvider, dataProvider: __assign(__assign({}, (0, react_admin_1.testDataProvider)()), { getCompletion: delayedPromise({
            data: ' dolor sit amet',
        }) }) },
    React.createElement(material_1.Box, { m: 2 },
        React.createElement(react_admin_1.SimpleForm, { record: {
                title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            } },
            React.createElement(PredictiveTextInput_1.PredictiveTextInput, { source: "title", multiline: true, fullWidth: true }))))); };
exports.MultilineFullWidth = MultilineFullWidth;
var Sx = function () { return (React.createElement(react_admin_1.AdminContext, { i18nProvider: react_admin_1.defaultI18nProvider, dataProvider: __assign(__assign({}, (0, react_admin_1.testDataProvider)()), { getCompletion: delayedPromise({
            data: ' dolor sit amet',
        }) }) },
    React.createElement(material_1.Box, { m: 2 },
        React.createElement(react_admin_1.SimpleForm, { record: { title: 'Lorem' } },
            React.createElement(PredictiveTextInput_1.PredictiveTextInput, { source: "title", sx: { width: '50ch' } }))))); };
exports.Sx = Sx;
var Type = function () { return (React.createElement(react_admin_1.AdminContext, { i18nProvider: react_admin_1.defaultI18nProvider, dataProvider: __assign(__assign({}, (0, react_admin_1.testDataProvider)()), { getCompletion: delayedPromise({
            data: '456789',
        }) }) },
    React.createElement(material_1.Box, { m: 2 },
        React.createElement(react_admin_1.SimpleForm, { record: { socialSecurity: '123' } },
            React.createElement(PredictiveTextInput_1.PredictiveTextInput, { type: "number", source: "socialSecurity" }))))); };
exports.Type = Type;
var DataProviderError = function () { return (React.createElement(react_admin_1.AdminContext, { i18nProvider: react_admin_1.defaultI18nProvider, queryClient: new react_query_1.QueryClient({ defaultOptions: { queries: { retry: false } } }), dataProvider: __assign(__assign({}, (0, react_admin_1.testDataProvider)()), { getCompletion: function () {
            return new Promise(function (_resolve, reject) {
                return setTimeout(function () { return reject(new Error()); }, 100);
            });
        } }) },
    React.createElement(material_1.Box, { m: 2 },
        React.createElement(react_admin_1.SimpleForm, { record: { title: 'Lorem' } },
            React.createElement(PredictiveTextInput_1.PredictiveTextInput, { source: "title" }))),
    React.createElement(react_admin_1.Notification, null))); };
exports.DataProviderError = DataProviderError;
var Short = function () { return (React.createElement(react_router_dom_1.MemoryRouter, null,
    React.createElement(material_1.ThemeProvider, { theme: (0, material_1.createTheme)() },
        React.createElement(react_query_1.QueryClientProvider, { client: new react_query_1.QueryClient() },
            React.createElement(react_admin_1.I18nContextProvider, { value: react_admin_1.defaultI18nProvider },
                React.createElement(react_admin_1.DataProviderContext.Provider, { value: __assign(__assign({}, (0, react_admin_1.testDataProvider)()), { getCompletion: delayedPromise({
                            data: ', consectetur adipiscing elit',
                        }) }) },
                    React.createElement(material_1.Box, { m: 2 },
                        React.createElement(react_admin_1.SimpleForm, { record: { title: 'Lorem ipsum dolor sit amet' } },
                            React.createElement(PredictiveTextInput_1.PredictiveTextInput, { source: "title" }))))))))); };
exports.Short = Short;
// simulate a completion API with simple business rules
var getCompletionLocal = function (_a) {
    var _b = _a.prompt, prompt = _b === void 0 ? '' : _b;
    return __awaiter(void 0, void 0, void 0, function () {
        var promptLines, _c, key, value, promptForParams, params;
        return __generator(this, function (_d) {
            promptLines = prompt.split('\n');
            _c = promptLines[promptLines.length - 1].split(':'), key = _c[0], value = _c[1];
            promptForParams = promptLines.slice(1, -1);
            params = promptForParams.reduce(function (acc, line) {
                var _a = line.split(':'), key = _a[0], value = _a[1];
                acc[key] = value;
                return acc;
            }, {});
            if (key === 'email') {
                if (value) {
                    if (!value.includes('@')) {
                        if (params.company) {
                            return [2 /*return*/, {
                                    data: "@".concat(params.company
                                        .toLowerCase()
                                        .replace(' ', '-'), ".com"),
                                }];
                        }
                        else {
                            return [2 /*return*/, { data: '@gmail.com' }];
                        }
                    }
                    else {
                        return [2 /*return*/, { data: '' }];
                    }
                }
                else {
                    if (params.firstName && params.lastName) {
                        return [2 /*return*/, {
                                data: "".concat(params.firstName.toLowerCase(), ".").concat(params.lastName.toLowerCase(), "@").concat(params.company
                                    ? params.company.toLowerCase().replace(' ', '-')
                                    : 'gmail', ".com"),
                            }];
                    }
                    else {
                        return [2 /*return*/, { data: '' }];
                    }
                }
            }
            else if (key === 'website') {
                if (value) {
                    if (!value.includes('.')) {
                        return [2 /*return*/, {
                                data: '.com',
                            }];
                    }
                    else {
                        return [2 /*return*/, { data: '' }];
                    }
                }
                else {
                    if (params.company) {
                        return [2 /*return*/, {
                                data: "https://www.".concat(params.company
                                    .toLowerCase()
                                    .replace(' ', '-'), ".com"),
                            }];
                    }
                    else {
                        return [2 /*return*/, { data: '' }];
                    }
                }
            }
            return [2 /*return*/];
        });
    });
};
var Context = function () { return (React.createElement(react_admin_1.AdminContext, { i18nProvider: react_admin_1.defaultI18nProvider, dataProvider: __assign(__assign({}, (0, react_admin_1.testDataProvider)()), { getCompletion: getCompletionLocal }) },
    React.createElement(react_admin_1.ResourceContextProvider, { value: "users" },
        React.createElement(material_1.Box, { m: 2 },
            React.createElement(react_admin_1.SimpleForm, { record: {
                    firstName: 'John',
                    lastName: 'Doe',
                    reference: '',
                    company: 'Acme',
                    website: '',
                } },
                React.createElement(react_admin_1.TextInput, { source: "firstName", sx: { width: '50ch' }, helperText: false }),
                React.createElement(react_admin_1.TextInput, { source: "lastName", sx: { width: '50ch' }, helperText: false }),
                React.createElement(react_admin_1.TextInput, { source: "company", sx: { width: '50ch' }, helperText: false }),
                React.createElement(PredictiveTextInput_1.PredictiveTextInput, { source: "email", sx: { width: '50ch' }, helperText: false }),
                React.createElement(PredictiveTextInput_1.PredictiveTextInput, { source: "website", sx: { width: '50ch' }, helperText: false })),
            React.createElement(devtools_1.ReactQueryDevtools, null))))); };
exports.Context = Context;
var Slow = function () { return (React.createElement(react_admin_1.AdminContext, { i18nProvider: react_admin_1.defaultI18nProvider, dataProvider: __assign(__assign({}, (0, react_admin_1.testDataProvider)()), { getCompletion: delayedPromise({ data: 'Ipsum dolor sit amet' }, 3000) }) },
    React.createElement(react_admin_1.ResourceContextProvider, { value: "users" },
        React.createElement(material_1.Box, { m: 2 },
            React.createElement(react_admin_1.SimpleForm, { record: {} },
                React.createElement(PredictiveTextInput_1.PredictiveTextInput, { source: "title", sx: { width: '50ch' }, helperText: false }),
                React.createElement(PredictiveTextInput_1.PredictiveTextInput, { source: "excerpt", sx: { width: '50ch' }, helperText: false })))))); };
exports.Slow = Slow;
var OpenAI = function () { return (React.createElement(OpenAIWrapper_1.OpenAIWrapper, null,
    React.createElement(react_admin_1.AdminContext, { i18nProvider: react_admin_1.defaultI18nProvider, dataProvider: (0, addGetCompletionBasedOnOpenAIAPI_1.addGetCompletionBasedOnOpenAIAPI)({
            dataProvider: (0, react_admin_1.testDataProvider)(),
        }) },
        React.createElement(react_admin_1.ResourceContextProvider, { value: "users" },
            React.createElement(material_1.Box, { m: 2 },
                React.createElement(react_admin_1.SimpleForm, { record: {
                        firstName: 'John',
                        lastName: 'Doe',
                        reference: '',
                        company: 'Acme',
                        website: '',
                    } },
                    React.createElement(react_admin_1.TextInput, { source: "firstName", sx: { width: '50ch' }, helperText: false }),
                    React.createElement(react_admin_1.TextInput, { source: "lastName", sx: { width: '50ch' }, helperText: false }),
                    React.createElement(react_admin_1.TextInput, { source: "company", sx: { width: '50ch' }, helperText: false }),
                    React.createElement(PredictiveTextInput_1.PredictiveTextInput, { source: "email", sx: { width: '50ch' }, helperText: false }),
                    React.createElement(PredictiveTextInput_1.PredictiveTextInput, { source: "website", sx: { width: '50ch' }, helperText: false }),
                    React.createElement(PredictiveTextInput_1.PredictiveTextInput, { source: "bio", multiline: true, sx: { width: '50ch' }, helperText: false }))))))); };
exports.OpenAI = OpenAI;
var Locale = function () { return (React.createElement(OpenAIWrapper_1.OpenAIWrapper, null,
    React.createElement(react_admin_1.AdminContext, { i18nProvider: react_admin_1.defaultI18nProvider, dataProvider: (0, addGetCompletionBasedOnOpenAIAPI_1.addGetCompletionBasedOnOpenAIAPI)({
            dataProvider: (0, react_admin_1.testDataProvider)(),
        }) },
        React.createElement(react_admin_1.ResourceContextProvider, { value: "users" },
            React.createElement(material_1.Box, { m: 2 },
                React.createElement(react_admin_1.SimpleForm, { record: {
                        firstName: 'John',
                        lastName: 'Doe',
                        company: 'Acme',
                    } },
                    React.createElement(react_admin_1.TextInput, { source: "firstName", sx: { width: '50ch' }, helperText: false }),
                    React.createElement(react_admin_1.TextInput, { source: "lastName", sx: { width: '50ch' }, helperText: false }),
                    React.createElement(react_admin_1.TextInput, { source: "company", sx: { width: '50ch' }, helperText: false }),
                    React.createElement(PredictiveTextInput_1.PredictiveTextInput, { source: "bio", locale: "fr", multiline: true, sx: { width: '50ch' }, helperText: false }))))))); };
exports.Locale = Locale;
