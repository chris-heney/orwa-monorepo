import * as React from 'react';
import { Box, Alert, ThemeProvider, createTheme } from '@mui/material';
import { QueryClient, QueryClientProvider } from 'react-query';
import {
    AdminContext,
    SimpleForm,
    DataProviderContext,
    defaultI18nProvider,
    testDataProvider,
} from 'react-admin';
import { MemoryRouter } from 'react-router-dom';

import { addGetCompletionBasedOnOpenAIAPI } from '../../dataProvider/addGetCompletionBasedOnOpenAIAPI';
import { SmartRichTextInput } from './SmartRichTextInput';
import { SmartRichTextInputToolbar } from './SmartRichTextInputToolbar';
import { SmartEditToolbar } from './SmartEditToolbar';
import { OpenAIWrapper } from '../test/OpenAIWrapper';

export default {
    title: 'ra-ai/input/SmartRichTextInput',
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
                            data: 'Ipsum lorem sit dolor amet',
                        }),
                    }}
                >
                    <Box m={2}>
                        <SimpleForm
                            record={{
                                body: '<p>Lorem ipsum dolor sit amet</p>',
                            }}
                        >
                            <SmartRichTextInput source="body" />
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
            <SimpleForm record={{ body: '<p>Lorem ipsum dolor sit amet</p>' }}>
                <SmartRichTextInput source="body" />
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
            <SimpleForm record={{ body: '<p>Lorem ipsum dolor sit amet</p>' }}>
                <SmartRichTextInput source="body" fullWidth />
            </SimpleForm>
        </Box>
    </AdminContext>
);

export const ToolbarCustom = () => (
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
            <SimpleForm record={{ body: '<p>Lorem ipsum dolor sit amet</p>' }}>
                <SmartRichTextInput
                    source="body"
                    toolbar={
                        <SmartRichTextInputToolbar>
                            <SmartEditToolbar />
                        </SmartRichTextInputToolbar>
                    }
                />
            </SimpleForm>
        </Box>
    </AdminContext>
);

export const ToolbarSmall = () => (
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
            <SimpleForm record={{ body: '<p>Lorem ipsum dolor sit amet</p>' }}>
                <SmartRichTextInput
                    source="body"
                    toolbar={<SmartRichTextInputToolbar size="small" />}
                />
            </SimpleForm>
        </Box>
    </AdminContext>
);

export const Locale = () => (
    <OpenAIWrapper>
        <AdminContext
            i18nProvider={defaultI18nProvider}
            dataProvider={addGetCompletionBasedOnOpenAIAPI({
                dataProvider: testDataProvider(),
            })}
        >
            <Box m={2}>
                <SimpleForm
                    record={{
                        body: `
                    <h2>Chemise élégante</h2>
                    <p>Prix : 29,99 €</p>
                    <p>Cette chemise élégante est un choix parfait pour toutes les occasions. Fabriquée à partir de tissu de haute qualité, elle est à la fois confortable et durable. Son design classique et intemporel en fait une pièce essentielle de votre garde-robe.</p>
                    <p>Caractéristiques :</p>
                    <ul>
                      <li>Tissu respirant et léger</li>
                      <li>Coupe ajustée</li>
                      <li>Col italien</li>
                      <li>Manches longues avec poignets boutonnés</li>
                      <li>Fermeture boutonnée sur le devant</li>
                      <li>Disponible en différentes tailles et couleurs</li>
                    </ul>`,
                    }}
                >
                    <SmartRichTextInput source="body" locale="fr" />
                </SimpleForm>
            </Box>
        </AdminContext>
    </OpenAIWrapper>
);

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
            <Box m={2}>
                <SimpleForm
                    record={{ body: '<p>Lorem ipsum dolor sit amet</p>' }}
                >
                    <SmartRichTextInput stop={['ipsum', 'sic']} source="body" />
                </SimpleForm>
                <Alert severity="info">
                    Custom stop param is: {JSON.stringify(stop)}
                </Alert>
            </Box>
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
            <Box m={2}>
                <SimpleForm
                    record={{ body: '<p>Lorem ipsum dolor sit amet</p>' }}
                >
                    <SmartRichTextInput temperature={0.5} source="body" />
                </SimpleForm>
                <Alert severity="info">
                    Custom temperature param is: {temperature}
                </Alert>
            </Box>
        </AdminContext>
    );
};

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
            <SimpleForm
                record={{
                    body: '<p>Lorem ipsum dolor sit amet</p>',
                }}
            >
                <SmartRichTextInput source="body" sx={{ width: '50ch' }} />
            </SimpleForm>
        </Box>
    </AdminContext>
);
