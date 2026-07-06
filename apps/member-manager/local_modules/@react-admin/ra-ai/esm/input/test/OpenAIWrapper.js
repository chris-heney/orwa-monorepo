import * as React from 'react';
import { Box } from '@mui/material';
export var OpenAIWrapper = function (_a) {
    var children = _a.children;
    var _b = React.useState(localStorage.getItem('ra-ai.openai-api-key')), key = _b[0], setKey = _b[1];
    if (key) {
        return children;
    }
    return (React.createElement(Box, { m: 2 },
        React.createElement("form", { onSubmit: function (e) {
                e.preventDefault();
                var form = e.target;
                // @ts-ignore
                var keyInput = form.elements.key;
                localStorage.setItem('ra-ai.openai-api-key', keyInput.value);
                setKey(keyInput.value);
            } },
            React.createElement("label", { htmlFor: "key" }, "OpenAI API key: "),
            React.createElement("input", { type: "text", id: "key", name: "key" }),
            React.createElement("button", { type: "submit" }, "Submit"))));
};
