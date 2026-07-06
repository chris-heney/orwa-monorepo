import * as React from 'react';
import { SimpleForm, TextInput, Admin, Resource, ListGuesser, Edit, } from 'react-admin';
import fakerestProvider from 'ra-data-fakerest';
import { MemoryRouter } from 'react-router-dom';
import { PredictiveTextInput } from './PredictiveTextInput';
import { addGetCompletionBasedOnOpenAIAPI } from '../../dataProvider/addGetCompletionBasedOnOpenAIAPI';
import { OpenAIWrapper } from '../test/OpenAIWrapper';
export default {
    title: 'ra-ai/input/PredictiveTextInput',
};
var users = [
    {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        company: 'Acme',
        email: 'john.doe@acme.com',
    },
    {
        id: 2,
        firstName: 'Jane',
        lastName: 'Smith',
        company: 'XYZ Corp',
        email: 'jane.smith@xyzcorp.com',
    },
    {
        id: 3,
        firstName: 'Michael',
        lastName: 'Johnson',
        company: 'Tech Solutions',
        email: 'michael.johnson@techsolutions.com',
    },
    {
        id: 4,
        firstName: 'Emily',
        lastName: 'Brown',
        company: 'Global Industries',
    },
    {
        id: 5,
        firstName: 'David',
        lastName: 'Davis',
        company: 'Innovate Co',
        email: 'david.davis@innovateco.com',
    },
    {
        id: 6,
        firstName: 'Sarah',
        lastName: 'Wilson',
        company: 'Eagle Enterprises',
        email: 'sarah.wilson@eagleenterprises.com',
    },
    {
        id: 7,
        firstName: 'Matthew',
        lastName: 'Anderson',
        company: 'Tech Solutions',
        email: 'matthew.anderson@techsolutions.com',
    },
    {
        id: 8,
        firstName: 'Olivia',
        lastName: 'Johnson',
        company: 'Acme',
        email: 'olivia.johnson@acme.com',
    },
    {
        id: 9,
        firstName: 'Daniel',
        lastName: 'Taylor',
        company: 'Global Industries',
        email: 'daniel.taylor@globalindustries.com',
    },
    {
        id: 10,
        firstName: 'Sophia',
        lastName: 'Lee',
        company: 'XYZ Corp',
        email: 'sophia.lee@xyzcorp.com',
    },
];
var UserEdit = function () { return (React.createElement(Edit, null,
    React.createElement(SimpleForm, null,
        React.createElement(TextInput, { source: "firstName", sx: { width: '50ch' }, helperText: false }),
        React.createElement(TextInput, { source: "lastName", sx: { width: '50ch' }, helperText: false }),
        React.createElement(TextInput, { source: "company", sx: { width: '50ch' }, helperText: false }),
        React.createElement(PredictiveTextInput, { source: "email", sx: { width: '50ch' }, helperText: false }),
        React.createElement(PredictiveTextInput, { source: "website", sx: { width: '50ch' }, helperText: false })))); };
export var FullApp = function () { return (React.createElement(OpenAIWrapper, null,
    React.createElement(MemoryRouter, { initialEntries: ['/users/4'] },
        React.createElement(Admin, { dataProvider: addGetCompletionBasedOnOpenAIAPI({
                dataProvider: fakerestProvider({ users: users }, process.env.NODE_ENV !== 'test'),
            }) },
            React.createElement(Resource, { name: "users", list: ListGuesser, edit: UserEdit }))))); };
