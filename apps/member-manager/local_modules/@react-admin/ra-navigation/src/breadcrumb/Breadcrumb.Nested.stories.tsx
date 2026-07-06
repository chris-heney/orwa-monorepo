/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import { Button, Stack, Chip } from '@mui/material';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import EditIcon from '@mui/icons-material/Edit';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';
import LabelIcon from '@mui/icons-material/Label';
import {
    Admin,
    Resource,
    List,
    Edit,
    SimpleForm,
    TextField,
    TextInput,
    Layout,
    Datagrid,
    EditButton,
    LayoutProps,
    useRecordContext,
    useGetOne,
    DateField,
    SearchInput,
    DateInput,
    ListGuesser,
} from 'react-admin';
import { Route, Link, useParams } from 'react-router-dom';

import { Breadcrumb } from './Breadcrumb';
import { dataProvider } from '../../stories/dataProvider';
import { AppLocationContext, useDefineAppLocation } from '../app-location';

export default { title: 'ra-navigation/Breadcrumb/NestedResources' };

interface Song {
    id: number;
    rank: number;
    artist_id: number;
    title: string;
    writer: string;
    producer: string;
    released: Date;
    recordCompany: string;
}

interface Artist {
    id: number;
    name: string;
    type: string[];
    yearsActive: string;
    bio: string;
}

const SongsButton = () => {
    const artist = useRecordContext();
    return (
        <Button
            component={Link}
            to={`/artists/${artist.id}/songs`}
            startIcon={<LibraryMusicIcon />}
        >
            Songs
        </Button>
    );
};

const TypeField = () => {
    const artist = useRecordContext();
    return (
        <Stack direction="row" spacing={1}>
            {artist?.type.map(type => (
                <Chip key={type} size="small" label={type} />
            ))}
        </Stack>
    );
};

TypeField.defaultProps = {
    label: 'Type',
};

const ArtistList = () => (
    <List filters={[<SearchInput key="q" source="q" alwaysOn />]}>
        <Datagrid>
            <TextField source="name" />
            <TextField source="yearsActive" />
            <TypeField />
            <EditButton />
            <SongsButton />
        </Datagrid>
    </List>
);

const ArtistEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="name" />
            <TextInput source="yearsActive" />
            <TextInput source="bio" multiline fullWidth />
            <SongsButton />
        </SimpleForm>
    </Edit>
);

const EditSongButton = () => {
    const song = useRecordContext();
    return (
        <Button
            component={Link}
            to={`/artists/${song?.artist_id}/songs/${song?.id}`}
            startIcon={<EditIcon />}
        >
            Edit
        </Button>
    );
};

const SongListForArtist = () => {
    const { id } = useParams<{ id: string }>();
    const { data: record } = useGetOne('artists', { id });
    useDefineAppLocation('artists.edit.songs', { record });
    return (
        <List
            resource="songs"
            filter={{ artist_id: id }}
            filters={[<SearchInput key="q" source="q" alwaysOn />]}
        >
            <Datagrid>
                <TextField source="title" />
                <DateField source="released" />
                <TextField source="writer" />
                <TextField source="producer" />
                <TextField source="recordCompany" label="Label" />
                <EditSongButton />
            </Datagrid>
        </List>
    );
};

const SongEditForArtist = () => {
    const { id, songId } = useParams<{ id: string; songId: string }>();
    const { data: record } = useGetOne('artists', { id });
    const { data: song } = useGetOne('songs', { id: songId });
    useDefineAppLocation('artists.edit.songs.edit', { record, song });
    return (
        <Edit resource="songs" id={songId} redirect={`/artists/${id}/songs`}>
            <SimpleForm>
                <TextInput source="title" />
                <DateInput source="released" />
                <TextInput source="writer" />
                <TextInput source="producer" />
                <TextInput source="recordCompany" label="Label" />
            </SimpleForm>
        </Edit>
    );
};

const BreadcrumbForNestedResources = () => (
    <Breadcrumb sx={{ mt: 0.5, mb: -2 }}>
        <Breadcrumb.Item name="artists" label="Artists" to="/artists">
            <Breadcrumb.Item
                name="edit"
                label={({ record }: { record?: Artist }) => record?.name}
                to={({ record }: { record?: Artist }) =>
                    `/artists/${record?.id}`
                }
            >
                <Breadcrumb.Item
                    name="songs"
                    label="Songs"
                    to={({ record }: { record?: Artist }) =>
                        `/artists/${record?.id}/songs`
                    }
                >
                    <Breadcrumb.Item
                        name="edit"
                        label={({ song }: { song?: Song }) => song?.title}
                        to={({ song }: { song?: Song }) =>
                            `/artists/${song?.artist_id}/songs/${song?.id}`
                        }
                    />
                </Breadcrumb.Item>
            </Breadcrumb.Item>
            <Breadcrumb.Item
                name="create"
                label="Create"
                to="/artists/create"
            />
        </Breadcrumb.Item>
    </Breadcrumb>
);

const LayoutForNestedResources = ({ children, ...rest }: LayoutProps) => (
    <AppLocationContext>
        <Layout {...rest}>
            <BreadcrumbForNestedResources />
            {children}
        </Layout>
    </AppLocationContext>
);

export const NestedResources = () => (
    <Admin dataProvider={dataProvider} layout={LayoutForNestedResources}>
        <Resource
            name="artists"
            list={ArtistList}
            edit={ArtistEdit}
            recordRepresentation="name"
            icon={GroupsIcon}
        >
            <Route path=":id/songs" element={<SongListForArtist />} />
            <Route path=":id/songs/:songId" element={<SongEditForArtist />} />
        </Resource>
        <Resource name="songs" recordRepresentation="title" />
        <Resource name="producers" list={ListGuesser} icon={PersonIcon} />
        <Resource name="labels" list={ListGuesser} icon={LabelIcon} />
    </Admin>
);
