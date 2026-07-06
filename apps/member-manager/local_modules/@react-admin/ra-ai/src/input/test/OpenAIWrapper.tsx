import * as React from 'react';
import { Box } from '@mui/material';

export const OpenAIWrapper = ({ children }) => {
    const [key, setKey] = React.useState(
        localStorage.getItem('ra-ai.openai-api-key')
    );

    if (key) {
        return children;
    }
    return (
        <Box m={2}>
            <form
                onSubmit={e => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    // @ts-ignore
                    const keyInput = form.elements.key as HTMLInputElement;
                    localStorage.setItem(
                        'ra-ai.openai-api-key',
                        keyInput.value
                    );
                    setKey(keyInput.value);
                }}
            >
                <label htmlFor="key">OpenAI API key: </label>
                <input type="text" id="key" name="key" />
                <button type="submit">Submit</button>
            </form>
        </Box>
    );
};
