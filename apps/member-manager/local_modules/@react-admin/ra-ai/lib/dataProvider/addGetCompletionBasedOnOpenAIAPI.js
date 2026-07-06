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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addGetCompletionBasedOnOpenAIAPI = void 0;
var react_admin_1 = require("react-admin");
var merge_1 = __importDefault(require("lodash/merge"));
var DEFAULT_PARAMS = {
    model: 'gpt-3.5-turbo-instruct',
    temperature: 1,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
};
/**
 * Add a getCompletion method to the dataProvider based on the OpenAI API
 * @see https://beta.openai.com/docs/api-reference/completions/create
 *
 * The method expects the OpenAI API key to be stored in the localStorage under the key 'ra-ai.openai-api-key'.
 * It's up to you to store the key in the localStorage (e.g. in authProvider.login()) and to remove it (e.g. in authProvider.logout())
 *
 * The getCompletion method will call the OpenAI completion API with the passed prompt
 *
 * @example
 * const dataProvider = addGetCompletionBasedOnOpenAIAPI({
 *    dataProvider: restDataProvider,
 * });
 * dataProvider
 *   .getCompletion('lorem ipsum dolor')
 *   .then(({ data }) => {
 *      console.log(data); // 'sit amet'
 *   });
 *
 * @returns DataProvider
 */
var addGetCompletionBasedOnOpenAIAPI = function (_a) {
    var dataProvider = _a.dataProvider, _b = _a.endpoint, endpoint = _b === void 0 ? 'https://api.openai.com/v1/completions' : _b, _c = _a.defaultParams, defaultParams = _c === void 0 ? DEFAULT_PARAMS : _c, _d = _a.httpClient, httpClient = _d === void 0 ? react_admin_1.fetchUtils.fetchJson : _d;
    return (__assign(__assign({}, dataProvider), { getCompletion: function (parameters) {
            if (parameters === void 0) { parameters = {}; }
            return __awaiter(void 0, void 0, void 0, function () {
                var _a, prompt, stop, maxSize, temperature, _b, meta, signal, body, requestOptions, key, json;
                var _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _a = parameters || {}, prompt = _a.prompt, stop = _a.stop, maxSize = _a.maxSize, temperature = _a.temperature, _b = _a.meta, meta = _b === void 0 ? {} : _b, signal = _a.signal;
                            body = (0, merge_1.default)({}, defaultParams, meta, {
                                prompt: prompt,
                                stop: stop,
                                max_tokens: maxSize,
                                temperature: temperature,
                            });
                            requestOptions = {
                                method: 'POST',
                                headers: new Headers({
                                    'Content-Type': 'application/json',
                                }),
                                body: JSON.stringify(body),
                                signal: signal,
                            };
                            key = window.localStorage.getItem('ra-ai.openai-api-key');
                            if (key) {
                                requestOptions.headers.set('Authorization', "Bearer ".concat(key));
                            }
                            return [4 /*yield*/, httpClient(endpoint, requestOptions)];
                        case 1:
                            json = (_d.sent()).json;
                            return [2 /*return*/, { data: (_c = json.choices[0]) === null || _c === void 0 ? void 0 : _c.text }];
                    }
                });
            });
        } }));
};
exports.addGetCompletionBasedOnOpenAIAPI = addGetCompletionBasedOnOpenAIAPI;
