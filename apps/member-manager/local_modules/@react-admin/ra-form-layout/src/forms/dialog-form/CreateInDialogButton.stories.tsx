import * as React from 'react';
import {
    Datagrid,
    ReferenceManyField,
    Edit,
    SimpleForm,
    TextField,
    TextInput,
    Admin,
    Resource,
    WithRecord,
    ListGuesser,
    List,
    required,
    EditGuesser,
    useNotify,
} from 'react-admin';
import { createHashHistory } from 'history';
import { MemoryRouter } from 'react-router-dom';

import i18nProvider from '../../../stories/i18nProvider';
import { dataProvider } from '../../../stories/common';
import { CreateInDialogButton } from './CreateInDialogButton';

export default {
    title: 'ra-form-layout/DialogForm/CreateInDialogButton',
};

const EmployeeList = () => (
    <List
        actions={
            <CreateInDialogButton>
                <SimpleForm>
                    <TextInput source="name" />
                    <TextInput source="address" />
                    <TextInput source="city" />
                </SimpleForm>
            </CreateInDialogButton>
        }
    >
        <Datagrid rowClick="edit">
            <TextField source="name" />
            <TextField source="address" />
            <TextField source="city" />
        </Datagrid>
    </List>
);

export const Basic = () => (
    <MemoryRouter>
        <Admin dataProvider={dataProvider} i18nProvider={i18nProvider}>
            <Resource
                name="employers"
                list={EmployeeList}
                edit={EditGuesser}
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
                    <List
                        actions={
                            <CreateInDialogButton
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
                            </CreateInDialogButton>
                        }
                    >
                        <Datagrid>
                            <TextField source="name" />
                            <TextField source="address" />
                            <TextField source="city" />
                        </Datagrid>
                    </List>
                )}
                recordRepresentation="name"
            />
        </Admin>
    </MemoryRouter>
);

export const InReferenceField = () => {
    const history = createHashHistory();
    return (
        <Admin
            dataProvider={dataProvider}
            i18nProvider={i18nProvider}
            history={history}
        >
            <Resource
                name="employers"
                list={ListGuesser}
                edit={() => (
                    <Edit>
                        <SimpleForm>
                            <TextInput source="name" />
                            <TextInput source="address" />
                            <TextInput source="city" />
                            <ReferenceManyField
                                target="employer_id"
                                reference="customers"
                            >
                                <WithRecord
                                    render={record => (
                                        <CreateInDialogButton
                                            record={{ employer_id: record.id }}
                                        >
                                            <SimpleForm>
                                                <TextInput source="first_name" />
                                                <TextInput source="last_name" />
                                            </SimpleForm>
                                        </CreateInDialogButton>
                                    )}
                                />
                                <Datagrid>
                                    <TextField source="first_name" />
                                    <TextField source="last_name" />
                                </Datagrid>
                            </ReferenceManyField>
                        </SimpleForm>
                    </Edit>
                )}
                recordRepresentation="name"
            />
            <Resource name="customers" list={ListGuesser} />
        </Admin>
    );
};

export const InputValidation = () => {
    const history = createHashHistory();
    return (
        <Admin
            dataProvider={dataProvider}
            i18nProvider={i18nProvider}
            history={history}
        >
            <Resource
                name="employers"
                list={ListGuesser}
                edit={() => (
                    <Edit>
                        <SimpleForm>
                            <TextInput source="name" />
                            <TextInput source="address" />
                            <TextInput source="city" />
                            <ReferenceManyField
                                target="employer_id"
                                reference="customers"
                            >
                                <WithRecord
                                    render={record => (
                                        <CreateInDialogButton
                                            record={{ employer_id: record.id }}
                                        >
                                            <SimpleForm>
                                                <TextInput
                                                    source="first_name"
                                                    validate={[required()]}
                                                />
                                                <TextInput
                                                    source="last_name"
                                                    validate={[required()]}
                                                />
                                            </SimpleForm>
                                        </CreateInDialogButton>
                                    )}
                                />
                                <Datagrid>
                                    <TextField source="first_name" />
                                    <TextField source="last_name" />
                                </Datagrid>
                            </ReferenceManyField>
                        </SimpleForm>
                    </Edit>
                )}
                recordRepresentation="name"
            />
            <Resource name="customers" list={ListGuesser} />
        </Admin>
    );
};

export const GlobalValidation = () => {
    const history = createHashHistory();
    return (
        <Admin
            dataProvider={dataProvider}
            i18nProvider={i18nProvider}
            history={history}
        >
            <Resource
                name="employers"
                list={ListGuesser}
                edit={() => (
                    <Edit>
                        <SimpleForm>
                            <TextInput source="name" />
                            <TextInput source="address" />
                            <TextInput source="city" />
                            <ReferenceManyField
                                target="employer_id"
                                reference="customers"
                            >
                                <WithRecord
                                    render={record => (
                                        <CreateInDialogButton
                                            record={{ employer_id: record.id }}
                                        >
                                            <SimpleForm
                                                validate={() => ({
                                                    first_name: 'not good',
                                                })}
                                            >
                                                <TextInput source="first_name" />
                                                <TextInput source="last_name" />
                                            </SimpleForm>
                                        </CreateInDialogButton>
                                    )}
                                />
                                <Datagrid>
                                    <TextField source="first_name" />
                                    <TextField source="last_name" />
                                </Datagrid>
                            </ReferenceManyField>
                        </SimpleForm>
                    </Edit>
                )}
                recordRepresentation="name"
            />
            <Resource name="customers" list={ListGuesser} />
        </Admin>
    );
};

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
        <List
            actions={
                <CreateInDialogButton
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
                </CreateInDialogButton>
            }
        >
            <Datagrid>
                <TextField source="name" />
                <TextField source="address" />
                <TextField source="city" />
            </Datagrid>
        </List>
    );
};
