import * as React from 'react';
import { Typography, Card, CardContent } from '@mui/material';
import {
    RaRecord,
    Admin,
    Resource,
    List,
    Edit,
    Create,
    SimpleForm,
    Show,
    SimpleShowLayout,
    TextField,
    TextInput,
    Layout,
    Datagrid,
    ShowButton,
    EditButton,
    LayoutProps,
    useCreatePath,
} from 'react-admin';
import { createMemoryHistory } from 'history';

import { Breadcrumb } from '.';
import { dataProvider } from '../../stories/dataProvider';
import { AppLocationContext, DASHBOARD } from '../app-location';

export default { title: 'ra-navigation/Breadcrumb/CustomLabels' };

const MyBreadcrumb = () => {
    const createPath = useCreatePath();
    return (
        <Breadcrumb>
            <Breadcrumb.Item name={DASHBOARD} label="My Home" to="/">
                <Breadcrumb.Item
                    name="songs"
                    label="My Fabulous Songs"
                    to="/songs"
                >
                    <Breadcrumb.Item
                        name="edit"
                        label={({ record }: { record: RaRecord }) =>
                            `Edit "${record.title}"`
                        }
                        to={({ record }: { record: RaRecord }): string =>
                            record
                                ? createPath({
                                      resource: 'songs',
                                      id: record.id,
                                      type: 'edit',
                                  })
                                : undefined
                        }
                    />
                    <Breadcrumb.Item
                        name="show"
                        label={({ record }: { record: RaRecord }) =>
                            `Show "${record.title}"`
                        }
                        to={({ record }: { record: RaRecord }): string =>
                            record
                                ? createPath({
                                      resource: 'songs',
                                      id: record.id,
                                      type: 'show',
                                  })
                                : undefined
                        }
                    />
                    <Breadcrumb.Item
                        name="create"
                        label="Yeah! Add Another One"
                    />
                </Breadcrumb.Item>
            </Breadcrumb.Item>
        </Breadcrumb>
    );
};

const MyLayout = ({ children, ...rest }: LayoutProps) => (
    <AppLocationContext>
        <Layout {...rest}>
            <MyBreadcrumb />
            {children}
        </Layout>
    </AppLocationContext>
);

const SongList = () => (
    <List>
        <Datagrid>
            <TextField source="id" />
            <TextField source="title" />
            <ShowButton />
            <EditButton />
        </Datagrid>
    </List>
);

const SongEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="title" />
        </SimpleForm>
    </Edit>
);

const SongCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="title" />
        </SimpleForm>
    </Create>
);

const SongShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="title" />
        </SimpleShowLayout>
    </Show>
);

const Dashboard = () => (
    <Card>
        <CardContent>
            <Typography variant="h4">Here is Homepage</Typography>
            <Typography>No breacrumb is displayed in Home</Typography>
        </CardContent>
    </Card>
);

export const Labels = () => (
    <Admin
        history={createMemoryHistory()}
        dataProvider={dataProvider}
        layout={MyLayout}
        dashboard={Dashboard}
    >
        <Resource
            name="songs"
            list={SongList}
            edit={SongEdit}
            create={SongCreate}
            show={SongShow}
        />
    </Admin>
);

const MyBreadcrumbNoHome = () => {
    const createPath = useCreatePath();
    return (
        <Breadcrumb>
            <Breadcrumb.Item name="songs" label="My Fabulous Songs" to="/songs">
                <Breadcrumb.Item
                    name="edit"
                    label={({ record }: { record: RaRecord }) =>
                        `Edit "${record.title}"`
                    }
                    to={({ record }: { record: RaRecord }): string =>
                        record &&
                        createPath({
                            resource: 'songs',
                            id: record.id,
                            type: 'edit',
                        })
                    }
                />
                <Breadcrumb.Item
                    name="show"
                    label={({ record }: { record: RaRecord }) =>
                        `Show "${record.title}"`
                    }
                    to={({ record }: { record: RaRecord }): string =>
                        record &&
                        createPath({
                            resource: 'songs',
                            id: record.id,
                            type: 'show',
                        })
                    }
                />
                <Breadcrumb.Item name="create" label="Yeah! Add Another One" />
            </Breadcrumb.Item>
        </Breadcrumb>
    );
};

const MyLayoutNoHome = ({ children, ...rest }: LayoutProps) => (
    <AppLocationContext>
        <Layout {...rest}>
            <MyBreadcrumbNoHome />
            {children}
        </Layout>
    </AppLocationContext>
);

export const LabelsNoHome = () => (
    <Admin
        history={createMemoryHistory()}
        dataProvider={dataProvider}
        layout={MyLayoutNoHome}
    >
        <Resource
            name="songs"
            list={SongList}
            edit={SongEdit}
            create={SongCreate}
            show={SongShow}
        />
    </Admin>
);
