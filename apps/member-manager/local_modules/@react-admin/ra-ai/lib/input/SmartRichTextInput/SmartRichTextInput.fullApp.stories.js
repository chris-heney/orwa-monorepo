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
exports.FullApp = void 0;
var React = __importStar(require("react"));
var react_admin_1 = require("react-admin");
var ra_data_fakerest_1 = __importDefault(require("ra-data-fakerest"));
var react_router_dom_1 = require("react-router-dom");
var addGetCompletionBasedOnOpenAIAPI_1 = require("../../dataProvider/addGetCompletionBasedOnOpenAIAPI");
var SmartRichTextInput_1 = require("./SmartRichTextInput");
var OpenAIWrapper_1 = require("../test/OpenAIWrapper");
exports.default = {
    title: 'ra-ai/input/SmartRichTextInput',
};
var posts = [
    {
        id: 1,
        title: 'Revolutionary "SolarScent" Unveiled: A Groundbreaking Solar-Powered Fragrance Experience',
        body: "\n    <p><strong>June 13, 2023</strong> - In a remakable leap forward for the fragrance industry, leading scent innovator \"FragranceTech\" has unveiled their latest breakthroug creation, the groudbreaking \"SolarScent.\" This revolutionary product harnesses the powers of the sun to provide the unique olfactory experience like no other.</p>\n\n    <p>Imagine a fragrance that not only captivates your senses but also contributes to a greener planet. SolarScent achieves just that. Combining advanced solar technology with cutting-edge scent engineering, this remarkable invention utilizes sunlight to power a fragrance delivery system that emits exquisite aromas throughout the day.</p>\n\n    <p>The SolarScent device, elegantly designed with sleek lines and a minimalist aesthetic, features a high-efficiency solar panel integrated discreetly into its surface. This panel captures solar energy, which is then stored in a rechargeable battery within the device.</p>\n\n    <p>Once charged, SolarScent seamlessly releases bursts of carefully curated scents, creating an immersive sensory experience. Users can choose from an array of fragrance cartridges that range from refreshing citrus notes to floral bouquets or even exotic woods, tailoring their olfactory journey to suit their mood and preference.</p>\n\n    <p>FragranceTech CEO, Dr. Jasmine Evans, expressed her excitement about SolarScent's potential impact, stating, \"We believe SolarScent has the power to revolutionize the fragrance industry and redefine our relationship with scents. By harnessing the energy of the sun, we are taking a step towards a more sustainable future without compromising on the sensory pleasures that fragrances offer.\"</p>\n",
    },
];
var dataProvider = (0, addGetCompletionBasedOnOpenAIAPI_1.addGetCompletionBasedOnOpenAIAPI)({
    dataProvider: (0, ra_data_fakerest_1.default)({ posts: posts }, process.env.NODE_ENV !== 'test'),
});
var PostEdit = function () { return (React.createElement(react_admin_1.Edit, null,
    React.createElement(react_admin_1.SimpleForm, null,
        React.createElement(react_admin_1.TextInput, { source: "title", fullWidth: true }),
        React.createElement(SmartRichTextInput_1.SmartRichTextInput, { source: "body", label: false })))); };
var FullApp = function () { return (React.createElement(OpenAIWrapper_1.OpenAIWrapper, null,
    React.createElement(react_router_dom_1.MemoryRouter, { initialEntries: ['/posts/1'] },
        React.createElement(react_admin_1.Admin, { dataProvider: dataProvider },
            React.createElement(react_admin_1.Resource, { name: "posts", list: react_admin_1.ListGuesser, edit: PostEdit }))))); };
exports.FullApp = FullApp;
