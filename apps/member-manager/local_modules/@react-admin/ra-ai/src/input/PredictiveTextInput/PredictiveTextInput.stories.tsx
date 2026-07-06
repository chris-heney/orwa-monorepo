import * as React from 'react';
import { Box, Alert, ThemeProvider, createTheme } from '@mui/material';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import {
    AdminContext,
    SimpleForm,
    DataProviderContext,
    TextInput,
    ResourceContextProvider,
    defaultI18nProvider,
    testDataProvider,
    Notification,
    I18nContextProvider,
} from 'react-admin';
import { MemoryRouter } from 'react-router-dom';

import { PredictiveTextInput } from './PredictiveTextInput';
import { addGetCompletionBasedOnOpenAIAPI } from '../../dataProvider/addGetCompletionBasedOnOpenAIAPI';
import { OpenAIWrapper } from '../test/OpenAIWrapper';

export default {
    title: 'ra-ai/input/PredictiveTextInput',
};

const delayedPromise =
    (data, delay = 1000) =>
    () =>
        new Promise(resolve => {
            setTimeout(() => resolve(data), delay);
        });

export const Basic = () => (
    <MemoryRouter>
        <ThemeProvider theme={createTheme()}>
            <QueryClientProvider client={new QueryClient()}>
                <DataProviderContext.Provider
                    value={{
                        ...testDataProvider(),
                        getCompletion: delayedPromise({
                            data: ' dolor sit amet',
                        }),
                    }}
                >
                    <Box m={2}>
                        <SimpleForm record={{ title: 'Lorem' }}>
                            <PredictiveTextInput source="title" />
                        </SimpleForm>
                    </Box>
                </DataProviderContext.Provider>
            </QueryClientProvider>
        </ThemeProvider>
    </MemoryRouter>
);

export const Default = () => (
    <AdminContext
        i18nProvider={defaultI18nProvider}
        dataProvider={{
            ...testDataProvider(),
            getCompletion: delayedPromise({
                data: ' dolor sit amet',
            }),
        }}
    >
        <Box m={2}>
            <SimpleForm record={{ title: 'Lorem' }}>
                <PredictiveTextInput source="title" />
            </SimpleForm>
        </Box>
    </AdminContext>
);

export const FullWidth = () => (
    <AdminContext
        i18nProvider={defaultI18nProvider}
        dataProvider={{
            ...testDataProvider(),
            getCompletion: delayedPromise({
                data: ' dolor sit amet',
            }),
        }}
    >
        <Box m={2}>
            <SimpleForm record={{ title: 'Lorem' }}>
                <PredictiveTextInput source="title" fullWidth />
            </SimpleForm>
        </Box>
    </AdminContext>
);

export const Variant = () => (
    <AdminContext
        i18nProvider={defaultI18nProvider}
        dataProvider={{
            ...testDataProvider(),
            getCompletion: delayedPromise({
                data: ' dolor sit amet',
            }),
        }}
    >
        <Box m={2}>
            <SimpleForm record={{ title: 'Lorem' }}>
                <PredictiveTextInput variant="outlined" source="title" />
            </SimpleForm>
        </Box>
    </AdminContext>
);

const ReRenderPeriodically = ({ children }) => {
    const [_render, setRender] = React.useState(0);
    React.useEffect(() => {
        const interval = setInterval(() => {
            setRender(render => render + 1);
        }, 100);
        return () => clearInterval(interval);
    }, []);
    return children();
};

export const Debounce = ({ debounce = 1000 }) => {
    const nbCalls = React.useRef(0);
    return (
        <AdminContext
            i18nProvider={defaultI18nProvider}
            dataProvider={{
                ...testDataProvider(),
                getCompletion: () => {
                    nbCalls.current++;
                    return new Promise(resolve =>
                        setTimeout(
                            () => resolve({ data: ' dolor sit amet' }),
                            100
                        )
                    );
                },
            }}
        >
            <Box m={2} display="flex" gap={2} flexDirection="column">
                <SimpleForm record={{ title: 'Lorem' }}>
                    <PredictiveTextInput debounce={debounce} source="title" />
                </SimpleForm>
                <ReRenderPeriodically>
                    {() => (
                        <Alert severity="info">
                            {nbCalls.current} calls to the dataProvider
                        </Alert>
                    )}
                </ReRenderPeriodically>
            </Box>
        </AdminContext>
    );
};
Debounce.args = {
    debounce: 1000,
};

export const PromptGenerator = () => {
    const [prompt, setPrompt] = React.useState('');
    return (
        <AdminContext
            i18nProvider={defaultI18nProvider}
            dataProvider={{
                ...testDataProvider(),
                getCompletion: async ({ prompt }) => {
                    setPrompt(prompt);
                    return { data: ' dolor sit amet' };
                },
            }}
        >
            <ResourceContextProvider value="users">
                <Box m={2}>
                    <SimpleForm record={{ title: 'Lorem' }}>
                        <PredictiveTextInput
                            promptGenerator={params => JSON.stringify(params)}
                            source="title"
                        />
                    </SimpleForm>
                    <Alert severity="info">Custom prompt is: {prompt}</Alert>
                </Box>
            </ResourceContextProvider>
        </AdminContext>
    );
};

export const MaxSize = () => {
    const [maxSize, setMaxSize] = React.useState();
    return (
        <AdminContext
            i18nProvider={defaultI18nProvider}
            dataProvider={{
                ...testDataProvider(),
                getCompletion: async ({ maxSize }) => {
                    setMaxSize(maxSize);
                    return { data: ' dolor sit amet' };
                },
            }}
        >
            <ResourceContextProvider value="users">
                <Box m={2}>
                    <SimpleForm record={{ title: 'Lorem' }}>
                        <PredictiveTextInput maxSize={128} source="title" />
                    </SimpleForm>
                    <Alert severity="info">
                        Custom maxSize param is: {JSON.stringify(maxSize)}
                    </Alert>
                </Box>
            </ResourceContextProvider>
        </AdminContext>
    );
};

export const Stop = () => {
    const [stop, setStop] = React.useState();
    return (
        <AdminContext
            i18nProvider={defaultI18nProvider}
            dataProvider={{
                ...testDataProvider(),
                getCompletion: async ({ stop }) => {
                    setStop(stop);
                    return { data: ' dolor sit amet' };
                },
            }}
        >
            <ResourceContextProvider value="users">
                <Box m={2}>
                    <SimpleForm record={{ title: 'Lorem' }}>
                        <PredictiveTextInput
                            stop={['ipsum', 'sic']}
                            source="title"
                        />
                    </SimpleForm>
                    <Alert severity="info">
                        Custom stop param is: {JSON.stringify(stop)}
                    </Alert>
                </Box>
            </ResourceContextProvider>
        </AdminContext>
    );
};

export const Temperature = () => {
    const [temperature, setTemperature] = React.useState();
    return (
        <AdminContext
            i18nProvider={defaultI18nProvider}
            dataProvider={{
                ...testDataProvider(),
                getCompletion: async ({ temperature }) => {
                    setTemperature(temperature);
                    return { data: ' dolor sit amet' };
                },
            }}
        >
            <ResourceContextProvider value="users">
                <Box m={2}>
                    <SimpleForm record={{ title: 'Lorem' }}>
                        <PredictiveTextInput temperature={0.5} source="title" />
                    </SimpleForm>
                    <Alert severity="info">
                        Custom temperature param is: {temperature}
                    </Alert>
                </Box>
            </ResourceContextProvider>
        </AdminContext>
    );
};

export const Source = () => (
    <AdminContext
        i18nProvider={defaultI18nProvider}
        dataProvider={{
            ...testDataProvider(),
            getCompletion: delayedPromise({
                data: ' dolor sit amet',
            }),
        }}
    >
        <Box m={2}>
            <SimpleForm record={{ foo: { title: 'Lorem ipsum' } }}>
                <PredictiveTextInput multiline source="foo.title" />
            </SimpleForm>
        </Box>
    </AdminContext>
);

export const MultilineAutoSize = () => (
    <AdminContext
        i18nProvider={defaultI18nProvider}
        dataProvider={{
            ...testDataProvider(),
            getCompletion: delayedPromise({
                data: ' dolor sit amet',
            }),
        }}
    >
        <Box m={2}>
            <SimpleForm record={{ title: 'Lorem ipsum' }}>
                <PredictiveTextInput multiline source="title" />
            </SimpleForm>
        </Box>
    </AdminContext>
);

export const MultilineRows = () => (
    <AdminContext
        i18nProvider={defaultI18nProvider}
        dataProvider={{
            ...testDataProvider(),
            getCompletion: delayedPromise({
                data: ' dolor sit amet',
            }),
        }}
    >
        <Box m={2}>
            <SimpleForm record={{ title: 'Lorem ipsum' }}>
                <PredictiveTextInput multiline rows={3} source="title" />
            </SimpleForm>
        </Box>
    </AdminContext>
);

export const MultilineFullWidth = () => (
    <AdminContext
        i18nProvider={defaultI18nProvider}
        dataProvider={{
            ...testDataProvider(),
            getCompletion: delayedPromise({
                data: ' dolor sit amet',
            }),
        }}
    >
        <Box m={2}>
            <SimpleForm
                record={{
                    title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                }}
            >
                <PredictiveTextInput source="title" multiline fullWidth />
            </SimpleForm>
        </Box>
    </AdminContext>
);

export const Sx = () => (
    <AdminContext
        i18nProvider={defaultI18nProvider}
        dataProvider={{
            ...testDataProvider(),
            getCompletion: delayedPromise({
                data: ' dolor sit amet',
            }),
        }}
    >
        <Box m={2}>
            <SimpleForm record={{ title: 'Lorem' }}>
                <PredictiveTextInput source="title" sx={{ width: '50ch' }} />
            </SimpleForm>
        </Box>
    </AdminContext>
);

export const Type = () => (
    <AdminContext
        i18nProvider={defaultI18nProvider}
        dataProvider={{
            ...testDataProvider(),
            getCompletion: delayedPromise({
                data: '456789',
            }),
        }}
    >
        <Box m={2}>
            <SimpleForm record={{ socialSecurity: '123' }}>
                <PredictiveTextInput type="number" source="socialSecurity" />
            </SimpleForm>
        </Box>
    </AdminContext>
);

export const DataProviderError = () => (
    <AdminContext
        i18nProvider={defaultI18nProvider}
        queryClient={
            new QueryClient({ defaultOptions: { queries: { retry: false } } })
        }
        dataProvider={{
            ...testDataProvider(),
            getCompletion: () =>
                new Promise((_resolve, reject) =>
                    setTimeout(() => reject(new Error()), 100)
                ),
        }}
    >
        <Box m={2}>
            <SimpleForm record={{ title: 'Lorem' }}>
                <PredictiveTextInput source="title" />
            </SimpleForm>
        </Box>
        <Notification />
    </AdminContext>
);

export const Short = () => (
    <MemoryRouter>
        <ThemeProvider theme={createTheme()}>
            <QueryClientProvider client={new QueryClient()}>
                <I18nContextProvider value={defaultI18nProvider}>
                    <DataProviderContext.Provider
                        value={{
                            ...testDataProvider(),
                            getCompletion: delayedPromise({
                                data: ', consectetur adipiscing elit',
                            }),
                        }}
                    >
                        <Box m={2}>
                            <SimpleForm
                                record={{ title: 'Lorem ipsum dolor sit amet' }}
                            >
                                <PredictiveTextInput source="title" />
                            </SimpleForm>
                        </Box>
                    </DataProviderContext.Provider>
                </I18nContextProvider>
            </QueryClientProvider>
        </ThemeProvider>
    </MemoryRouter>
);

// simulate a completion API with simple business rules
const getCompletionLocal = async ({ prompt = '' }) => {
    // Grab individual key/values from the prompt, which looks like this:
    // The following describes a users:
    // firstName:John
    // lastName:Doe
    // email:john
    const promptLines = prompt.split('\n');
    // key and value are the last line of the prompt
    // with the previous example, key = 'email' and value = 'john'
    const [key, value] = promptLines[promptLines.length - 1].split(':');
    // params are all the other lines of the prompt except the header
    // with the previous example, params = { firstName: 'John', lastName: 'Doe' }
    const promptForParams = promptLines.slice(1, -1);
    const params = promptForParams.reduce((acc, line) => {
        const [key, value] = line.split(':');
        acc[key] = value;
        return acc;
    }, {} as any);

    if (key === 'email') {
        if (value) {
            if (!value.includes('@')) {
                if (params.company) {
                    return {
                        data: `@${params.company
                            .toLowerCase()
                            .replace(' ', '-')}.com`,
                    };
                } else {
                    return { data: '@gmail.com' };
                }
            } else {
                return { data: '' };
            }
        } else {
            if (params.firstName && params.lastName) {
                return {
                    data: `${params.firstName.toLowerCase()}.${params.lastName.toLowerCase()}@${
                        params.company
                            ? params.company.toLowerCase().replace(' ', '-')
                            : 'gmail'
                    }.com`,
                };
            } else {
                return { data: '' };
            }
        }
    } else if (key === 'website') {
        if (value) {
            if (!value.includes('.')) {
                return {
                    data: '.com',
                };
            } else {
                return { data: '' };
            }
        } else {
            if (params.company) {
                return {
                    data: `https://www.${params.company
                        .toLowerCase()
                        .replace(' ', '-')}.com`,
                };
            } else {
                return { data: '' };
            }
        }
    }
};

export const Context = () => (
    <AdminContext
        i18nProvider={defaultI18nProvider}
        dataProvider={{
            ...testDataProvider(),
            getCompletion: getCompletionLocal,
        }}
    >
        <ResourceContextProvider value="users">
            <Box m={2}>
                <SimpleForm
                    record={{
                        firstName: 'John',
                        lastName: 'Doe',
                        reference: '',
                        company: 'Acme',
                        website: '',
                    }}
                >
                    <TextInput
                        source="firstName"
                        sx={{ width: '50ch' }}
                        helperText={false}
                    />
                    <TextInput
                        source="lastName"
                        sx={{ width: '50ch' }}
                        helperText={false}
                    />
                    <TextInput
                        source="company"
                        sx={{ width: '50ch' }}
                        helperText={false}
                    />
                    <PredictiveTextInput
                        source="email"
                        sx={{ width: '50ch' }}
                        helperText={false}
                    />
                    <PredictiveTextInput
                        source="website"
                        sx={{ width: '50ch' }}
                        helperText={false}
                    />
                </SimpleForm>
                <ReactQueryDevtools />
            </Box>
        </ResourceContextProvider>
    </AdminContext>
);

export const Slow = () => (
    <AdminContext
        i18nProvider={defaultI18nProvider}
        dataProvider={{
            ...testDataProvider(),
            getCompletion: delayedPromise(
                { data: 'Ipsum dolor sit amet' },
                3000
            ),
        }}
    >
        <ResourceContextProvider value="users">
            <Box m={2}>
                <SimpleForm record={{}}>
                    <PredictiveTextInput
                        source="title"
                        sx={{ width: '50ch' }}
                        helperText={false}
                    />
                    <PredictiveTextInput
                        source="excerpt"
                        sx={{ width: '50ch' }}
                        helperText={false}
                    />
                </SimpleForm>
            </Box>
        </ResourceContextProvider>
    </AdminContext>
);

export const OpenAI = () => (
    <OpenAIWrapper>
        <AdminContext
            i18nProvider={defaultI18nProvider}
            dataProvider={addGetCompletionBasedOnOpenAIAPI({
                dataProvider: testDataProvider(),
            })}
        >
            <ResourceContextProvider value="users">
                <Box m={2}>
                    <SimpleForm
                        record={{
                            firstName: 'John',
                            lastName: 'Doe',
                            reference: '',
                            company: 'Acme',
                            website: '',
                        }}
                    >
                        <TextInput
                            source="firstName"
                            sx={{ width: '50ch' }}
                            helperText={false}
                        />
                        <TextInput
                            source="lastName"
                            sx={{ width: '50ch' }}
                            helperText={false}
                        />
                        <TextInput
                            source="company"
                            sx={{ width: '50ch' }}
                            helperText={false}
                        />
                        <PredictiveTextInput
                            source="email"
                            sx={{ width: '50ch' }}
                            helperText={false}
                        />
                        <PredictiveTextInput
                            source="website"
                            sx={{ width: '50ch' }}
                            helperText={false}
                        />
                        <PredictiveTextInput
                            source="bio"
                            multiline
                            sx={{ width: '50ch' }}
                            helperText={false}
                        />
                    </SimpleForm>
                </Box>
            </ResourceContextProvider>
        </AdminContext>
    </OpenAIWrapper>
);

export const Locale = () => (
    <OpenAIWrapper>
        <AdminContext
            i18nProvider={defaultI18nProvider}
            dataProvider={addGetCompletionBasedOnOpenAIAPI({
                dataProvider: testDataProvider(),
            })}
        >
            <ResourceContextProvider value="users">
                <Box m={2}>
                    <SimpleForm
                        record={{
                            firstName: 'John',
                            lastName: 'Doe',
                            company: 'Acme',
                        }}
                    >
                        <TextInput
                            source="firstName"
                            sx={{ width: '50ch' }}
                            helperText={false}
                        />
                        <TextInput
                            source="lastName"
                            sx={{ width: '50ch' }}
                            helperText={false}
                        />
                        <TextInput
                            source="company"
                            sx={{ width: '50ch' }}
                            helperText={false}
                        />
                        <PredictiveTextInput
                            source="bio"
                            locale="fr"
                            multiline
                            sx={{ width: '50ch' }}
                            helperText={false}
                        />
                    </SimpleForm>
                </Box>
            </ResourceContextProvider>
        </AdminContext>
    </OpenAIWrapper>
);
