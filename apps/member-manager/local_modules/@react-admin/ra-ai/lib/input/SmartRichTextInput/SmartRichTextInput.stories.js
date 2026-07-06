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
exports.Sx = exports.Temperature = exports.Stop = exports.Locale = exports.ToolbarSmall = exports.ToolbarCustom = exports.FullWidth = exports.Default = exports.Basic = void 0;
var React = __importStar(require("react"));
var material_1 = require("@mui/material");
var react_query_1 = require("react-query");
var react_admin_1 = require("react-admin");
var react_router_dom_1 = require("react-router-dom");
var addGetCompletionBasedOnOpenAIAPI_1 = require("../../dataProvider/addGetCompletionBasedOnOpenAIAPI");
var SmartRichTextInput_1 = require("./SmartRichTextInput");
var SmartRichTextInputToolbar_1 = require("./SmartRichTextInputToolbar");
var SmartEditToolbar_1 = require("./SmartEditToolbar");
var OpenAIWrapper_1 = require("../test/OpenAIWrapper");
exports.default = {
    title: 'ra-ai/input/SmartRichTextInput',
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
                        data: 'Ipsum lorem sit dolor amet',
                    }) }) },
                React.createElement(material_1.Box, { m: 2 },
                    React.createElement(react_admin_1.SimpleForm, { record: {
                            body: '<p>Lorem ipsum dolor sit amet</p>',
                        } },
                        React.createElement(SmartRichTextInput_1.SmartRichTextInput, { source: "body" })))))))); };
exports.Basic = Basic;
var Default = function () { return (React.createElement(react_admin_1.AdminContext, { i18nProvider: react_admin_1.defaultI18nProvider, dataProvider: __assign(__assign({}, (0, react_admin_1.testDataProvider)()), { getCompletion: delayedPromise({
            data: ' dolor sit amet',
        }) }) },
    React.createElement(material_1.Box, { m: 2 },
        React.createElement(react_admin_1.SimpleForm, { record: { body: '<p>Lorem ipsum dolor sit amet</p>' } },
            React.createElement(SmartRichTextInput_1.SmartRichTextInput, { source: "body" }))))); };
exports.Default = Default;
var FullWidth = function () { return (React.createElement(react_admin_1.AdminContext, { i18nProvider: react_admin_1.defaultI18nProvider, dataProvider: __assign(__assign({}, (0, react_admin_1.testDataProvider)()), { getCompletion: delayedPromise({
            data: ' dolor sit amet',
        }) }) },
    React.createElement(material_1.Box, { m: 2 },
        React.createElement(react_admin_1.SimpleForm, { record: { body: '<p>Lorem ipsum dolor sit amet</p>' } },
            React.createElement(SmartRichTextInput_1.SmartRichTextInput, { source: "body", fullWidth: true }))))); };
exports.FullWidth = FullWidth;
var ToolbarCustom = function () { return (React.createElement(react_admin_1.AdminContext, { i18nProvider: react_admin_1.defaultI18nProvider, dataProvider: __assign(__assign({}, (0, react_admin_1.testDataProvider)()), { getCompletion: delayedPromise({
            data: ' dolor sit amet',
        }) }) },
    React.createElement(material_1.Box, { m: 2 },
        React.createElement(react_admin_1.SimpleForm, { record: { body: '<p>Lorem ipsum dolor sit amet</p>' } },
            React.createElement(SmartRichTextInput_1.SmartRichTextInput, { source: "body", toolbar: React.createElement(SmartRichTextInputToolbar_1.SmartRichTextInputToolbar, null,
                    React.createElement(SmartEditToolbar_1.SmartEditToolbar, null)) }))))); };
exports.ToolbarCustom = ToolbarCustom;
var ToolbarSmall = function () { return (React.createElement(react_admin_1.AdminContext, { i18nProvider: react_admin_1.defaultI18nProvider, dataProvider: __assign(__assign({}, (0, react_admin_1.testDataProvider)()), { getCompletion: delayedPromise({
            data: ' dolor sit amet',
        }) }) },
    React.createElement(material_1.Box, { m: 2 },
        React.createElement(react_admin_1.SimpleForm, { record: { body: '<p>Lorem ipsum dolor sit amet</p>' } },
            React.createElement(SmartRichTextInput_1.SmartRichTextInput, { source: "body", toolbar: React.createElement(SmartRichTextInputToolbar_1.SmartRichTextInputToolbar, { size: "small" }) }))))); };
exports.ToolbarSmall = ToolbarSmall;
var Locale = function () { return (React.createElement(OpenAIWrapper_1.OpenAIWrapper, null,
    React.createElement(react_admin_1.AdminContext, { i18nProvider: react_admin_1.defaultI18nProvider, dataProvider: (0, addGetCompletionBasedOnOpenAIAPI_1.addGetCompletionBasedOnOpenAIAPI)({
            dataProvider: (0, react_admin_1.testDataProvider)(),
        }) },
        React.createElement(material_1.Box, { m: 2 },
            React.createElement(react_admin_1.SimpleForm, { record: {
                    body: "\n                    <h2>Chemise \u00E9l\u00E9gante</h2>\n                    <p>Prix : 29,99 \u20AC</p>\n                    <p>Cette chemise \u00E9l\u00E9gante est un choix parfait pour toutes les occasions. Fabriqu\u00E9e \u00E0 partir de tissu de haute qualit\u00E9, elle est \u00E0 la fois confortable et durable. Son design classique et intemporel en fait une pi\u00E8ce essentielle de votre garde-robe.</p>\n                    <p>Caract\u00E9ristiques :</p>\n                    <ul>\n                      <li>Tissu respirant et l\u00E9ger</li>\n                      <li>Coupe ajust\u00E9e</li>\n                      <li>Col italien</li>\n                      <li>Manches longues avec poignets boutonn\u00E9s</li>\n                      <li>Fermeture boutonn\u00E9e sur le devant</li>\n                      <li>Disponible en diff\u00E9rentes tailles et couleurs</li>\n                    </ul>",
                } },
                React.createElement(SmartRichTextInput_1.SmartRichTextInput, { source: "body", locale: "fr" })))))); };
exports.Locale = Locale;
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
        React.createElement(material_1.Box, { m: 2 },
            React.createElement(react_admin_1.SimpleForm, { record: { body: '<p>Lorem ipsum dolor sit amet</p>' } },
                React.createElement(SmartRichTextInput_1.SmartRichTextInput, { stop: ['ipsum', 'sic'], source: "body" })),
            React.createElement(material_1.Alert, { severity: "info" },
                "Custom stop param is: ",
                JSON.stringify(stop)))));
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
        React.createElement(material_1.Box, { m: 2 },
            React.createElement(react_admin_1.SimpleForm, { record: { body: '<p>Lorem ipsum dolor sit amet</p>' } },
                React.createElement(SmartRichTextInput_1.SmartRichTextInput, { temperature: 0.5, source: "body" })),
            React.createElement(material_1.Alert, { severity: "info" },
                "Custom temperature param is: ",
                temperature))));
};
exports.Temperature = Temperature;
var Sx = function () { return (React.createElement(react_admin_1.AdminContext, { i18nProvider: react_admin_1.defaultI18nProvider, dataProvider: __assign(__assign({}, (0, react_admin_1.testDataProvider)()), { getCompletion: delayedPromise({
            data: ' dolor sit amet',
        }) }) },
    React.createElement(material_1.Box, { m: 2 },
        React.createElement(react_admin_1.SimpleForm, { record: {
                body: '<p>Lorem ipsum dolor sit amet</p>',
            } },
            React.createElement(SmartRichTextInput_1.SmartRichTextInput, { source: "body", sx: { width: '50ch' } }))))); };
exports.Sx = Sx;
