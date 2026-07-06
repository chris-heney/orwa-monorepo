/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import {
    Admin,
    Create,
    Datagrid,
    Edit,
    EditGuesser,
    Layout,
    LayoutProps,
    List,
    ListGuesser,
    Resource,
    Show,
    SimpleForm,
    SimpleShowLayout,
    TextField,
    TextInput,
    useRecordContext,
} from 'react-admin';
import { MemoryRouter } from 'react-router-dom';

import { AppLocationContext, useDefineAppLocation } from '../app-location';
import { Breadcrumb } from './Breadcrumb';
import { dataProvider } from '../../stories/dataProvider';

export default {
    title: 'ra-navigation/Breadcrumb.ResourceItem',
    decorators: [
        Story => (
            <MemoryRouter>
                <Story />
            </MemoryRouter>
        ),
    ],
};

const BreadcrumbForResources = () => (
    <Breadcrumb>
        <Breadcrumb.ResourceItem resource="songs" />
        <Breadcrumb.ResourceItem resource="artists" />
    </Breadcrumb>
);

const LayoutForResources = ({ children, ...rest }: LayoutProps) => (
    <AppLocationContext>
        <Layout {...rest}>
            <BreadcrumbForResources />
            {children}
        </Layout>
    </AppLocationContext>
);

export const Basic = () => (
    <Admin dataProvider={dataProvider} layout={LayoutForResources}>
        <Resource
            name="songs"
            list={ListGuesser}
            edit={EditGuesser}
            recordRepresentation="title"
        />
        <Resource
            name="artists"
            list={ListGuesser}
            edit={EditGuesser}
            recordRepresentation="name"
        />
    </Admin>
);

const BreadcrumbForGroupedResources = () => (
    <Breadcrumb>
        <Breadcrumb.Item name="music" label="Music">
            <Breadcrumb.ResourceItem resource="songs" />
            <Breadcrumb.ResourceItem resource="artists" />
        </Breadcrumb.Item>
    </Breadcrumb>
);

const LayoutForGroupedResources = ({ children, ...rest }: LayoutProps) => (
    <AppLocationContext>
        <Layout {...rest}>
            <BreadcrumbForGroupedResources />
            {children}
        </Layout>
    </AppLocationContext>
);

export const Grouped = () => (
    <Admin dataProvider={dataProvider} layout={LayoutForGroupedResources}>
        <Resource
            name="songs"
            list={SongList}
            edit={SongEdit}
            show={SongShow}
            create={SongCreate}
            recordRepresentation="title"
        />
        <Resource
            name="artists"
            list={ArtistList}
            edit={ArtistEdit}
            show={ArtistShow}
            create={ArtistCreate}
            recordRepresentation="name"
        />
    </Admin>
);

const SongList = () => {
    useDefineAppLocation('music.songs');
    return (
        <List>
            <Datagrid rowClick="edit">
                <TextField source="title" />
            </Datagrid>
        </List>
    );
};

const SongEditAppLocation = () => {
    const record = useRecordContext();
    useDefineAppLocation('music.songs.edit', { record });
    return null;
};

const SongEdit = () => (
    <Edit>
        <SongEditAppLocation />
        <SimpleForm>
            <TextInput source="title" />
        </SimpleForm>
    </Edit>
);

const SongShowAppLocation = () => {
    const record = useRecordContext();
    useDefineAppLocation('music.songs.show', { record });
    return null;
};

const SongShow = () => (
    <Show>
        <SongShowAppLocation />
        <SimpleShowLayout>
            <TextField source="title" />
        </SimpleShowLayout>
    </Show>
);

const SongCreate = () => {
    useDefineAppLocation('music.songs.create');
    return (
        <Create>
            <SimpleForm>
                <TextInput source="title" />
            </SimpleForm>
        </Create>
    );
};

const ArtistList = () => {
    useDefineAppLocation('music.artists');
    return (
        <List>
            <Datagrid rowClick="edit">
                <TextField source="name" />
            </Datagrid>
        </List>
    );
};

const ArtistEditAppLocation = () => {
    const record = useRecordContext();
    useDefineAppLocation('music.artists.edit', { record });
    return null;
};

const ArtistEdit = () => (
    <Edit>
        <ArtistEditAppLocation />
        <SimpleForm>
            <TextInput source="name" />
        </SimpleForm>
    </Edit>
);

const ArtistShowAppLocation = () => {
    const record = useRecordContext();
    useDefineAppLocation('music.artists.show', { record });
    return null;
};

const ArtistShow = () => (
    <Show>
        <ArtistShowAppLocation />
        <SimpleShowLayout>
            <TextField source="name" />
        </SimpleShowLayout>
    </Show>
);

const ArtistCreate = () => {
    useDefineAppLocation('music.artists.create');
    return (
        <Create>
            <SimpleForm>
                <TextInput source="name" />
            </SimpleForm>
        </Create>
    );
};
