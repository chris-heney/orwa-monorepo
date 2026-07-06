import * as React from 'react';
import { Box } from '@mui/material';

import { TextFieldWithCompletion } from './TextFieldWithCompletion';

export default {
    title: 'ra-ai/input/TextFieldWithCompletion',
};

// set the completion after a delay to simulate a network request
const WithCompletion = ({ children }) => {
    const [completion, setCompletion] = React.useState<string | undefined>();
    React.useEffect(() => {
        setTimeout(() => {
            setCompletion(' ipsum dolor sit amet');
        }, 500);
    }, []);
    return <Box m={2}>{children(completion)}</Box>;
};

export const Default = () => (
    <WithCompletion>
        {completion => (
            <TextFieldWithCompletion
                name="title"
                label="Title"
                defaultValue="Lorem"
                completion={completion}
            />
        )}
    </WithCompletion>
);

export const Filled = () => (
    <WithCompletion>
        {completion => (
            <TextFieldWithCompletion
                variant="filled"
                name="title"
                label="Title"
                defaultValue="Lorem"
                completion={completion}
            />
        )}
    </WithCompletion>
);

export const Standard = () => (
    <WithCompletion>
        {completion => (
            <TextFieldWithCompletion
                variant="standard"
                name="title"
                label="Title"
                defaultValue="Lorem"
                completion={completion}
            />
        )}
    </WithCompletion>
);

export const FullWidth = () => (
    <WithCompletion>
        {completion => (
            <TextFieldWithCompletion
                fullWidth
                name="title"
                label="Title"
                defaultValue="Lorem"
                completion={completion}
            />
        )}
    </WithCompletion>
);

export const HelperText = () => (
    <WithCompletion>
        {completion => (
            <TextFieldWithCompletion
                name="title"
                label="Title"
                defaultValue="Lorem"
                completion={completion}
                helperText="Please fill the void"
            />
        )}
    </WithCompletion>
);

export const Multiline = () => (
    <WithCompletion>
        {completion => (
            <TextFieldWithCompletion
                multiline
                rows={3}
                name="title"
                label="Title"
                defaultValue="Lorem"
                completion={completion}
            />
        )}
    </WithCompletion>
);

export const MultilineAutoSize = () => (
    <WithCompletion>
        {completion => (
            <TextFieldWithCompletion
                multiline
                name="title"
                label="Title"
                defaultValue="Lorem"
                completion={completion}
            />
        )}
    </WithCompletion>
);

export const MultilineRows = () => (
    <WithCompletion>
        {completion => (
            <TextFieldWithCompletion
                multiline
                rows={3}
                variant="filled"
                name="title"
                label="Title"
                defaultValue="Lorem"
                completion={completion}
            />
        )}
    </WithCompletion>
);
