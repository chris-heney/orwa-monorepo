import * as React from 'react';
import { Box } from '@mui/material';
import { TextFieldWithCompletion } from './TextFieldWithCompletion';
export default {
    title: 'ra-ai/input/TextFieldWithCompletion',
};
// set the completion after a delay to simulate a network request
var WithCompletion = function (_a) {
    var children = _a.children;
    var _b = React.useState(), completion = _b[0], setCompletion = _b[1];
    React.useEffect(function () {
        setTimeout(function () {
            setCompletion(' ipsum dolor sit amet');
        }, 500);
    }, []);
    return React.createElement(Box, { m: 2 }, children(completion));
};
export var Default = function () { return (React.createElement(WithCompletion, null, function (completion) { return (React.createElement(TextFieldWithCompletion, { name: "title", label: "Title", defaultValue: "Lorem", completion: completion })); })); };
export var Filled = function () { return (React.createElement(WithCompletion, null, function (completion) { return (React.createElement(TextFieldWithCompletion, { variant: "filled", name: "title", label: "Title", defaultValue: "Lorem", completion: completion })); })); };
export var Standard = function () { return (React.createElement(WithCompletion, null, function (completion) { return (React.createElement(TextFieldWithCompletion, { variant: "standard", name: "title", label: "Title", defaultValue: "Lorem", completion: completion })); })); };
export var FullWidth = function () { return (React.createElement(WithCompletion, null, function (completion) { return (React.createElement(TextFieldWithCompletion, { fullWidth: true, name: "title", label: "Title", defaultValue: "Lorem", completion: completion })); })); };
export var HelperText = function () { return (React.createElement(WithCompletion, null, function (completion) { return (React.createElement(TextFieldWithCompletion, { name: "title", label: "Title", defaultValue: "Lorem", completion: completion, helperText: "Please fill the void" })); })); };
export var Multiline = function () { return (React.createElement(WithCompletion, null, function (completion) { return (React.createElement(TextFieldWithCompletion, { multiline: true, rows: 3, name: "title", label: "Title", defaultValue: "Lorem", completion: completion })); })); };
export var MultilineAutoSize = function () { return (React.createElement(WithCompletion, null, function (completion) { return (React.createElement(TextFieldWithCompletion, { multiline: true, name: "title", label: "Title", defaultValue: "Lorem", completion: completion })); })); };
export var MultilineRows = function () { return (React.createElement(WithCompletion, null, function (completion) { return (React.createElement(TextFieldWithCompletion, { multiline: true, rows: 3, variant: "filled", name: "title", label: "Title", defaultValue: "Lorem", completion: completion })); })); };
