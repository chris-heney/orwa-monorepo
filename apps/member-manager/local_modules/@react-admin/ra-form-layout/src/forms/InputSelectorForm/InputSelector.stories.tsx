import { Alert, Box, Typography } from '@mui/material';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';
import frenchMessages from 'ra-language-french';
import * as React from 'react';
import {
    AdminContext,
    Create,
    SaveButton,
    SimpleForm,
    Toolbar,
    mergeTranslations,
    required,
} from 'react-admin';
import { useWatch } from 'react-hook-form';
import { InputSelector } from '..';

export default {
    title: 'ra-form-layout/InputSelector',
};

const getI18nProvider = () =>
    polyglotI18nProvider(
        locale =>
            locale === 'en'
                ? mergeTranslations(englishMessages)
                : mergeTranslations(frenchMessages),
        'en',
        [
            { locale: 'en', name: 'English' },
            { locale: 'fr', name: 'Français' },
        ]
    );

const FormContextWatcher = () => {
    const values = useWatch();
    return (
        <Box sx={{ width: '100%' }}>
            <Alert severity="info" sx={{ mx: 1 }}>
                <Typography>Record values</Typography>
                <pre>{JSON.stringify(values, null, 2)}</pre>
            </Alert>
        </Box>
    );
};

export const Basic = () => (
    <AdminContext i18nProvider={getI18nProvider()}>
        <Create resource="posts">
            <SimpleForm
                onSubmit={values => {
                    // eslint-disable-next-line no-console
                    console.log(values);
                }}
            >
                <InputSelector
                    source="@@ra-form-layout-inputs"
                    inputs={[
                        'title',
                        'body',
                        'teaser',
                        'average_note',
                        'published_at',
                    ]}
                />
                <FormContextWatcher />
            </SimpleForm>
        </Create>
    </AdminContext>
);

export const NotFullWidth = () => (
    <AdminContext i18nProvider={getI18nProvider()}>
        <Create resource="posts">
            <SimpleForm
                onSubmit={values => {
                    // eslint-disable-next-line no-console
                    console.log(values);
                }}
            >
                <InputSelector
                    source="@@ra-form-layout-inputs"
                    inputs={[
                        'title',
                        'body',
                        'teaser',
                        'average_note',
                        'published_at',
                    ]}
                    fullWidth={false}
                />
                <FormContextWatcher />
            </SimpleForm>
        </Create>
    </AdminContext>
);

export const Required = () => (
    <AdminContext i18nProvider={getI18nProvider()}>
        <Create resource="posts">
            <SimpleForm
                onSubmit={values => {
                    // eslint-disable-next-line no-console
                    console.log(values);
                }}
                toolbar={
                    <Toolbar>
                        <SaveButton alwaysEnable />
                    </Toolbar>
                }
            >
                <InputSelector
                    source="@@ra-form-layout-inputs"
                    inputs={[
                        'title',
                        'body',
                        'teaser',
                        'average_note',
                        'published_at',
                    ]}
                    validate={required()}
                />
                <FormContextWatcher />
            </SimpleForm>
        </Create>
    </AdminContext>
);

export const DefaultValue = () => (
    <AdminContext i18nProvider={getI18nProvider()}>
        <Create resource="posts">
            <SimpleForm
                onSubmit={values => {
                    // eslint-disable-next-line no-console
                    console.log(values);
                }}
                toolbar={
                    <Toolbar>
                        <SaveButton alwaysEnable />
                    </Toolbar>
                }
            >
                <InputSelector
                    source="@@ra-form-layout-inputs"
                    inputs={[
                        'title',
                        'body',
                        'teaser',
                        'average_note',
                        'published_at',
                    ]}
                    defaultValue={['title', 'teaser']}
                />
                <FormContextWatcher />
            </SimpleForm>
        </Create>
    </AdminContext>
);

export const HelperText = () => (
    <AdminContext i18nProvider={getI18nProvider()}>
        <Create resource="posts">
            <SimpleForm
                onSubmit={values => {
                    // eslint-disable-next-line no-console
                    console.log(values);
                }}
                toolbar={
                    <Toolbar>
                        <SaveButton alwaysEnable />
                    </Toolbar>
                }
            >
                <InputSelector
                    source="@@ra-form-layout-inputs"
                    inputs={[
                        'title',
                        'body',
                        'teaser',
                        'average_note',
                        'published_at',
                    ]}
                    validate={required()}
                    helperText="Please select at least one input"
                />
                <FormContextWatcher />
            </SimpleForm>
        </Create>
    </AdminContext>
);
