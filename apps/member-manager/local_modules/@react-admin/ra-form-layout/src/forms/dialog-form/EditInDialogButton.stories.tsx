import * as React from 'react';
import {
    SimpleForm,
    TextInput,
    Admin,
    Resource,
    List,
    Datagrid,
    TextField,
    useNotify,
} from 'react-admin';
import { MemoryRouter } from 'react-router-dom';

import i18nProvider from '../../../stories/i18nProvider';
import { dataProvider } from '../../../stories/common';
import { EditInDialogButton } from './EditInDialogButton';

export default {
    title: 'ra-form-layout/DialogForm/EditInDialogButton',
};

export const Basic = () => (
    <MemoryRouter>
        <Admin dataProvider={dataProvider} i18nProvider={i18nProvider}>
            <Resource
                name="employers"
                list={() => (
                    <List>
                        <Datagrid>
                            <TextField source="name" />
                            <TextField source="address" />
                            <TextField source="city" />

                            <EditInDialogButton>
                                <SimpleForm>
                                    <TextInput source="name" />
                                    <TextInput source="address" />
                                    <TextInput source="city" />
                                </SimpleForm>
                            </EditInDialogButton>
                        </Datagrid>
                    </List>
                )}
                recordRepresentation="name"
            />
        </Admin>
    </MemoryRouter>
);

export const Transform = () => (
    <MemoryRouter>
        <Admin dataProvider={dataProvider} i18nProvider={i18nProvider}>
            <Resource
                name="employers"
                list={() => (
                    <List>
                        <Datagrid>
                            <TextField source="name" />
                            <TextField source="address" />
                            <TextField source="city" />
                            <EditInDialogButton
                                transform={record => ({
                                    ...record,
                                    name: record.name + '_transformed',
                                })}
                            >
                                <SimpleForm>
                                    <TextInput source="name" />
                                    <TextInput source="address" />
                                    <TextInput source="city" />
                                </SimpleForm>
                            </EditInDialogButton>
                        </Datagrid>
                    </List>
                )}
                recordRepresentation="name"
            />
        </Admin>
    </MemoryRouter>
);

export const CustomMutationOptions = () => {
    return (
        <MemoryRouter>
            <Admin dataProvider={dataProvider} i18nProvider={i18nProvider}>
                <Resource
                    name="employers"
                    list={CustomMutationOptionsList}
                    recordRepresentation="name"
                />
            </Admin>
        </MemoryRouter>
    );
};

const CustomMutationOptionsList = () => {
    const notify = useNotify();
    return (
        <List>
            <Datagrid>
                <TextField source="name" />
                <TextField source="address" />
                <TextField source="city" />
                <EditInDialogButton
                    mutationOptions={{
                        onSuccess: () => {
                            notify('custom notification');
                        },
                    }}
                >
                    <SimpleForm>
                        <TextInput source="name" />
                        <TextInput source="address" />
                        <TextInput source="city" />
                    </SimpleForm>
                </EditInDialogButton>
            </Datagrid>
        </List>
    );
};
