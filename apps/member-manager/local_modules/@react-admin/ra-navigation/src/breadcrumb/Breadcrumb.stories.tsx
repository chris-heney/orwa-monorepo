/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useEffect } from 'react';
import { Typography, Card, CardContent, Direction } from '@mui/material';
import merge from 'lodash/merge';
import rtlPlugin from 'stylis-plugin-rtl';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import {
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
    ReferenceField,
    ReferenceInput,
    SelectInput,
    defaultTheme,
    LayoutProps,
    useListContext,
    DatagridProps,
} from 'react-admin';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';
import { createMemoryHistory } from 'history';
import {
    Route,
    Routes,
    MemoryRouter,
    Link,
    HashRouter,
} from 'react-router-dom';

import { Breadcrumb } from './Breadcrumb';
import { dataProvider } from '../../stories/dataProvider';

import {
    AppLocationContext,
    useAppLocationState,
    useResourceAppLocation,
} from '../app-location';

export default { title: 'ra-navigation/Breadcrumb/Basic' };

const i18nProvider = polyglotI18nProvider(() => englishMessages);

const MyLayout = ({ children, ...rest }: LayoutProps) => (
    <AppLocationContext>
        <Layout {...rest}>
            <Breadcrumb />
            {children}
        </Layout>
    </AppLocationContext>
);

const MyBreadcrumbWithFilter = () => (
    <Breadcrumb hasDashboard>
        <Breadcrumb.ResourceItems resources={['songs', 'artists']} />
        <Breadcrumb.Item
            name="songs_by_artist.filter"
            label={({ artistId }) => `Filtered by artist #${artistId}`}
        />
    </Breadcrumb>
);

const MyLayoutWithFilter = ({ children, ...rest }: LayoutProps) => (
    <AppLocationContext>
        <Layout {...rest}>
            <MyBreadcrumbWithFilter />
            {children}
        </Layout>
    </AppLocationContext>
);

const songFilter = [
    <ReferenceInput alwaysOn source="artist_id" reference="artists" key={1}>
        <SelectInput optionText="name" />
    </ReferenceInput>,
];

const SongsGrid = (props: DatagridProps) => {
    const [, setLocation] = useAppLocationState();
    const resourceLocation = useResourceAppLocation();
    const { filterValues } = useListContext();
    const effectDeps = JSON.stringify({
        resourceLocation,
        filter: filterValues,
    });
    useEffect(
        () => {
            const { artist_id: artistId } = filterValues;
            if (typeof artistId !== 'undefined') {
                setLocation('songs_by_artist.filter', { artistId });
            } else {
                setLocation(null);
            }
            return () => {
                setLocation(null);
            };
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [effectDeps]
    );

    return (
        <Datagrid {...props}>
            <TextField source="id" />
            <TextField source="title" />
            <ReferenceField source="artist_id" reference="artists">
                <TextField source="name" />
            </ReferenceField>
            <ShowButton />
            <EditButton />
        </Datagrid>
    );
};

const SongList = () => (
    <List>
        <SongsGrid />
    </List>
);

const SongListWithFilter = () => (
    <List filters={songFilter}>
        <SongsGrid />
    </List>
);

const ArtistList = () => (
    <List>
        <Datagrid>
            <TextField source="id" />
            <TextField source="name" />
            <EditButton />
        </Datagrid>
    </List>
);

const ArtistEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="name" />
        </SimpleForm>
    </Edit>
);

const ArtistCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="name" />
        </SimpleForm>
    </Create>
);

const SongEdit = () => (
    <Edit resource="songs">
        <SimpleForm>
            <TextInput source="title" />
        </SimpleForm>
    </Edit>
);

const SongCreate = () => (
    <Create resource="songs">
        <SimpleForm>
            <TextInput source="title" />
        </SimpleForm>
    </Create>
);

const SongShow = () => (
    <Show resource="songs">
        <SimpleShowLayout>
            <TextField source="title" />
        </SimpleShowLayout>
    </Show>
);

const Dashboard = () => (
    <Card>
        <CardContent>
            <Typography variant="h4">Here is Homepage</Typography>
            <Typography>No breadcrumb is displayed in Home</Typography>
        </CardContent>
    </Card>
);

export const Basic = () => (
    <HashRouter>
        <Admin
            dataProvider={dataProvider}
            i18nProvider={i18nProvider}
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
            <Resource
                name="artists"
                options={{ label: 'Artists' }}
                list={ArtistList}
                edit={ArtistEdit}
                create={ArtistCreate}
            />
        </Admin>
    </HashRouter>
);

export const RecordRepresentation = () => (
    <Admin
        history={createMemoryHistory()}
        dataProvider={dataProvider}
        i18nProvider={i18nProvider}
        layout={MyLayout}
        dashboard={Dashboard}
    >
        <Resource
            name="songs"
            list={SongList}
            edit={SongEdit}
            create={SongCreate}
            show={SongShow}
            recordRepresentation={record => `Song "${record.title}"`}
        />
        <Resource
            name="artists"
            options={{ label: 'Artists' }}
            list={ArtistList}
            edit={ArtistEdit}
            recordRepresentation="name"
        />
    </Admin>
);

export const WithFilter = () => (
    <Admin
        history={createMemoryHistory()}
        dataProvider={dataProvider}
        i18nProvider={i18nProvider}
        layout={MyLayoutWithFilter}
        dashboard={Dashboard}
    >
        <Resource
            name="songs"
            list={SongListWithFilter}
            edit={SongEdit}
            create={SongCreate}
            show={SongShow}
        />
        <Resource
            name="artists"
            options={{ label: 'Artists' }}
            list={ArtistList}
            edit={ArtistEdit}
        />
    </Admin>
);

export const Basename = () => (
    <MemoryRouter>
        <Routes>
            <Route
                path="/"
                element={
                    <div>
                        <Typography variant="h4">Homepage</Typography>
                        <Link to="/acme">Admin</Link>
                    </div>
                }
            />
            <Route
                path="/acme/*"
                element={
                    <Admin
                        dataProvider={dataProvider}
                        i18nProvider={i18nProvider}
                        layout={MyLayoutWithFilter}
                        dashboard={Dashboard}
                        basename="/acme"
                    >
                        <Resource
                            name="songs"
                            list={SongListWithFilter}
                            edit={SongEdit}
                            create={SongCreate}
                            show={SongShow}
                        />
                        <Resource
                            name="artists"
                            options={{ label: 'Artists' }}
                            list={ArtistList}
                            edit={ArtistEdit}
                        />
                    </Admin>
                }
            />
        </Routes>
    </MemoryRouter>
);

export const DarkMode = () => {
    const darkTheme = merge({}, defaultTheme, {
        palette: {
            mode: 'dark',
            background: {
                default: '#121212',
                paper: '#121212',
            },
        },
    });

    return (
        <Admin
            history={createMemoryHistory()}
            dataProvider={dataProvider}
            i18nProvider={i18nProvider}
            layout={MyLayoutWithFilter}
            dashboard={Dashboard}
            theme={darkTheme}
        >
            <Resource
                name="songs"
                list={SongListWithFilter}
                edit={SongEdit}
                create={SongCreate}
                show={SongShow}
            />
            <Resource
                name="artists"
                options={{ label: 'Artists' }}
                list={ArtistList}
                edit={ArtistEdit}
            />
        </Admin>
    );
};

const MyBreadcrumbNoHome = () => (
    <Breadcrumb>
        <Breadcrumb.ResourceItems resources={['songs', 'artists']} />
        <Breadcrumb.Item
            name="songs_by_artist.filter"
            label={({ artistId }) => `Filtered by artist #${artistId}`}
        />
    </Breadcrumb>
);

const MyLayoutNoHome = ({ children, ...rest }: LayoutProps) => (
    <AppLocationContext>
        <Layout {...rest}>
            <MyBreadcrumbNoHome />
            {children}
        </Layout>
    </AppLocationContext>
);

export const BasicNoHome = () => (
    <Admin
        history={createMemoryHistory()}
        dataProvider={dataProvider}
        layout={MyLayoutNoHome}
    >
        <Resource
            name="songs"
            list={SongListWithFilter}
            edit={SongEdit}
            create={SongCreate}
            show={SongShow}
        />
        <Resource name="artists" list={ArtistList} edit={ArtistEdit} />
    </Admin>
);

const MyBreadcrumbCustomHome = () => (
    <Breadcrumb
        sx={{
            '& ul': {
                padding: 1,
                paddingLeft: 0,
            },
            '& ul:empty': {
                padding: 0,
            },
        }}
    >
        <Breadcrumb.Item name="dashboard" label="My Home">
            <Breadcrumb.ResourceItems resources={['songs', 'artists']} />
            <Breadcrumb.Item
                name="songs_by_artist.filter"
                label={({ artistId }) => `Filtered by artist #${artistId}`}
            />
        </Breadcrumb.Item>
    </Breadcrumb>
);

const MyLayoutCustomHome = ({ children, ...rest }: LayoutProps) => (
    <AppLocationContext>
        <Layout {...rest}>
            <MyBreadcrumbCustomHome />
            {children}
        </Layout>
    </AppLocationContext>
);

export const BasicCustomHome = () => (
    <Admin
        history={createMemoryHistory()}
        dataProvider={dataProvider}
        layout={MyLayoutCustomHome}
    >
        <Resource
            name="songs"
            list={SongListWithFilter}
            edit={SongEdit}
            create={SongCreate}
            show={SongShow}
        />
        <Resource name="artists" list={ArtistList} edit={ArtistEdit} />
    </Admin>
);

const RestrictedBreadcrumb = () => {
    const [location] = useAppLocationState();
    if (!location.path || location.path.startsWith('artists')) return null;
    return (
        <Breadcrumb>
            <Breadcrumb.ResourceItems resources={['songs']} />
            <Breadcrumb.Item
                name="songs_by_artist.filter"
                label={({ artistId }) => `Filtered by artist #${artistId}`}
            />
        </Breadcrumb>
    );
};

const MyLayoutRestrictedBreadcrumb = ({ children, ...rest }: LayoutProps) => (
    <AppLocationContext>
        <Layout {...rest}>
            <RestrictedBreadcrumb />
            {children}
        </Layout>
    </AppLocationContext>
);

export const BasicRestricted = () => (
    <Admin
        history={createMemoryHistory()}
        dataProvider={dataProvider}
        layout={MyLayoutRestrictedBreadcrumb}
        dashboard={Dashboard}
    >
        <Resource
            name="songs"
            list={SongListWithFilter}
            edit={SongEdit}
            create={SongCreate}
            show={SongShow}
        />
        <Resource
            name="artists"
            options={{ label: 'Artists (no breadcrumb)' }}
            list={ArtistList}
            edit={ArtistEdit}
        />
    </Admin>
);

const SongListAside = () => (
    <Routes>
        <Route path="create" element={<SongCreate />} />
        <Route path=":id/show" element={<SongShow />} />
        <Route path=":id" element={<SongEdit />} />
    </Routes>
);

const SongListWithAside = () => (
    <List filters={songFilter} aside={<SongListAside />} hasCreate>
        <SongsGrid />
    </List>
);

export const WithInnerDynamicViews = () => (
    <Admin
        history={createMemoryHistory()}
        dataProvider={dataProvider}
        layout={MyLayoutWithFilter}
        dashboard={Dashboard}
    >
        <Resource name="songs" list={SongListWithAside} />
        <Resource
            name="artists"
            options={{ label: 'Artists' }}
            list={ArtistList}
            edit={ArtistEdit}
        />
    </Admin>
);

const rtlTheme = { ...defaultTheme, direction: 'rtl' as Direction };

// Create rtl cache
const cacheRtl = createCache({
    key: 'muirtl',
    stylisPlugins: [rtlPlugin],
});

export const RTL = () => {
    useEffect(() => {
        document.body.dir = 'rtl';

        return () => {
            document.body.dir = 'ltr';
        };
    });
    return (
        <CacheProvider value={cacheRtl}>
            <Admin
                history={createMemoryHistory()}
                dataProvider={dataProvider}
                i18nProvider={i18nProvider}
                layout={MyLayoutWithFilter}
                dashboard={Dashboard}
                theme={rtlTheme}
            >
                <Resource
                    name="songs"
                    list={SongListWithFilter}
                    edit={SongEdit}
                    create={SongCreate}
                    show={SongShow}
                />
                <Resource
                    name="artists"
                    options={{ label: 'Artists' }}
                    list={ArtistList}
                    edit={ArtistEdit}
                />
            </Admin>
        </CacheProvider>
    );
};
