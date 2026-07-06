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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerList = exports.CustomerLayoutForm = exports.CustomerShow = exports.CustomerCreate = exports.CustomerForm = exports.CustomerTitle = exports.languageChoices = exports.sexChoices = exports.dataProvider = exports.getDataProvider = void 0;
var react_1 = __importDefault(require("react"));
var ra_data_fakerest_1 = __importDefault(require("ra-data-fakerest"));
var react_admin_1 = require("react-admin");
var getDataProvider = function () {
    return (0, ra_data_fakerest_1.default)({
        customers: [
            {
                id: 1,
                first_name: 'John',
                last_name: 'Doe',
                dob: new Date('1966-09-05'),
                sex: 'male',
                employer_id: 2,
            },
            {
                id: 2,
                first_name: 'Elmer',
                last_name: 'Jones',
                dob: new Date('1947-03-25'),
                sex: 'male',
                employer_id: 1,
            },
            {
                id: 3,
                first_name: 'Jane',
                last_name: 'Doe',
                dob: new Date('1951-01-30'),
                sex: 'female',
                employer_id: 3,
            },
            {
                id: 4,
                first_name: 'Anita',
                last_name: 'Johnson',
                dob: new Date('1942-07-13'),
                sex: 'female',
                employer_id: 1,
            },
            {
                id: 5,
                first_name: 'Alan',
                last_name: 'Smith',
                dob: new Date('1949-06-22'),
                sex: 'male',
                employer_id: 2,
                occupations: [
                    {
                        name: 'Construction manager',
                        from: new Date('2017-05-13'),
                    },
                    {
                        name: 'Construction worker',
                        from: new Date('2003-09-08'),
                        to: new Date('2017-05-12'),
                    },
                    {
                        name: 'Salesman',
                        from: new Date('2003-05-01'),
                        to: new Date('2003-09-07'),
                    },
                    {
                        name: 'Fisher',
                        from: new Date('1992-12-02'),
                        to: new Date('2003-04-16'),
                    },
                    {
                        name: 'Farmer',
                        from: new Date('1984-03-12'),
                        to: new Date('1992-10-17'),
                    },
                ],
            },
        ],
        customers_profiles: [],
        events: [],
        performances: [],
        employers: [
            {
                id: 1,
                name: 'Acme',
                address: '123 Main Street',
                city: 'Anytown',
            },
            {
                id: 2,
                name: 'Ace Chemicals',
                address: '321 Gotham Avenue',
                city: 'Gotham',
            },
            {
                id: 3,
                name: 'Lexcorp',
                address: '2001 Skynet Dr.',
                city: 'Metropolis',
            },
        ],
    }, process.env.NODE_ENV !== 'test');
};
exports.getDataProvider = getDataProvider;
exports.dataProvider = (0, exports.getDataProvider)();
exports.sexChoices = [
    { id: 'male', name: 'Male' },
    { id: 'female', name: 'Female' },
];
exports.languageChoices = [
    { id: 'en', name: 'English' },
    { id: 'fr', name: 'French' },
];
var CustomerTitle = function (_a) {
    var record = _a.record;
    return (react_1.default.createElement("span", null,
        "Customer ",
        record ? "".concat(record.first_name, " ").concat(record.last_name) : ''));
};
exports.CustomerTitle = CustomerTitle;
var CustomerForm = function (props) { return (react_1.default.createElement(react_admin_1.SimpleForm, __assign({ defaultValues: { first_name: 'John', last_name: 'Doe' } }, props),
    react_1.default.createElement(react_admin_1.TextInput, { source: "first_name", validate: (0, react_admin_1.required)(), fullWidth: true }),
    react_1.default.createElement(react_admin_1.TextInput, { source: "last_name", validate: (0, react_admin_1.required)(), fullWidth: true }),
    react_1.default.createElement(react_admin_1.DateInput, { source: "dob", label: "born", validate: (0, react_admin_1.required)(), fullWidth: true }),
    react_1.default.createElement(react_admin_1.SelectInput, { source: "sex", choices: exports.sexChoices, fullWidth: true }))); };
exports.CustomerForm = CustomerForm;
var CustomerCreate = function () { return (react_1.default.createElement(react_admin_1.Create, null,
    react_1.default.createElement(exports.CustomerForm, null))); };
exports.CustomerCreate = CustomerCreate;
var CustomerShow = function () { return (react_1.default.createElement(react_admin_1.Show, null,
    react_1.default.createElement(exports.CustomerLayoutForm, null))); };
exports.CustomerShow = CustomerShow;
var CustomerLayoutForm = function (props) { return (react_1.default.createElement(react_admin_1.SimpleShowLayout, __assign({}, props),
    react_1.default.createElement(react_admin_1.TextField, { source: "first_name", fullWidth: true }),
    react_1.default.createElement(react_admin_1.TextField, { source: "last_name", fullWidth: true }),
    react_1.default.createElement(react_admin_1.DateField, { source: "dob", label: "born", fullWidth: true }),
    react_1.default.createElement(react_admin_1.SelectField, { source: "sex", choices: exports.sexChoices, fullWidth: true }))); };
exports.CustomerLayoutForm = CustomerLayoutForm;
var CustomerList = function () { return (react_1.default.createElement(react_admin_1.List, { hasCreate: true, sort: { field: 'id', order: 'DESC' }, empty: false },
    react_1.default.createElement(react_admin_1.Datagrid, { rowClick: "edit" },
        react_1.default.createElement(react_admin_1.TextField, { source: "id" }),
        react_1.default.createElement(react_admin_1.TextField, { source: "first_name" }),
        react_1.default.createElement(react_admin_1.TextField, { source: "last_name" }),
        react_1.default.createElement(react_admin_1.DateField, { source: "dob", label: "born" }),
        react_1.default.createElement(react_admin_1.SelectField, { source: "sex", choices: exports.sexChoices }),
        react_1.default.createElement(react_admin_1.ShowButton, null)))); };
exports.CustomerList = CustomerList;
