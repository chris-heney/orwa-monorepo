import * as React from 'react';
import { Admin, Resource, ListGuesser, Edit, SimpleForm, TextInput, } from 'react-admin';
import fakerestProvider from 'ra-data-fakerest';
import { MemoryRouter } from 'react-router-dom';
import { addGetCompletionBasedOnOpenAIAPI } from '../../dataProvider/addGetCompletionBasedOnOpenAIAPI';
import { SmartRichTextInput } from './SmartRichTextInput';
import { OpenAIWrapper } from '../test/OpenAIWrapper';
export default {
    title: 'ra-ai/input/SmartRichTextInput',
};
var posts = [
    {
        id: 1,
        title: 'Revolutionary "SolarScent" Unveiled: A Groundbreaking Solar-Powered Fragrance Experience',
        body: "\n    <p><strong>June 13, 2023</strong> - In a remakable leap forward for the fragrance industry, leading scent innovator \"FragranceTech\" has unveiled their latest breakthroug creation, the groudbreaking \"SolarScent.\" This revolutionary product harnesses the powers of the sun to provide the unique olfactory experience like no other.</p>\n\n    <p>Imagine a fragrance that not only captivates your senses but also contributes to a greener planet. SolarScent achieves just that. Combining advanced solar technology with cutting-edge scent engineering, this remarkable invention utilizes sunlight to power a fragrance delivery system that emits exquisite aromas throughout the day.</p>\n\n    <p>The SolarScent device, elegantly designed with sleek lines and a minimalist aesthetic, features a high-efficiency solar panel integrated discreetly into its surface. This panel captures solar energy, which is then stored in a rechargeable battery within the device.</p>\n\n    <p>Once charged, SolarScent seamlessly releases bursts of carefully curated scents, creating an immersive sensory experience. Users can choose from an array of fragrance cartridges that range from refreshing citrus notes to floral bouquets or even exotic woods, tailoring their olfactory journey to suit their mood and preference.</p>\n\n    <p>FragranceTech CEO, Dr. Jasmine Evans, expressed her excitement about SolarScent's potential impact, stating, \"We believe SolarScent has the power to revolutionize the fragrance industry and redefine our relationship with scents. By harnessing the energy of the sun, we are taking a step towards a more sustainable future without compromising on the sensory pleasures that fragrances offer.\"</p>\n",
    },
];
var dataProvider = addGetCompletionBasedOnOpenAIAPI({
    dataProvider: fakerestProvider({ posts: posts }, process.env.NODE_ENV !== 'test'),
});
var PostEdit = function () { return (React.createElement(Edit, null,
    React.createElement(SimpleForm, null,
        React.createElement(TextInput, { source: "title", fullWidth: true }),
        React.createElement(SmartRichTextInput, { source: "body", label: false })))); };
export var FullApp = function () { return (React.createElement(OpenAIWrapper, null,
    React.createElement(MemoryRouter, { initialEntries: ['/posts/1'] },
        React.createElement(Admin, { dataProvider: dataProvider },
            React.createElement(Resource, { name: "posts", list: ListGuesser, edit: PostEdit }))))); };
