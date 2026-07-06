import * as React from 'react';
import { testDataProvider, Admin, Resource } from 'react-admin';
import { Typography, Skeleton } from '@mui/material';
import { Book, People, ChatBubble } from '@mui/icons-material';
import { MemoryRouter } from 'react-router-dom';

import { SolarLayout } from '.';
import { useDefineAppLocation } from '../app-location';

export default { title: 'ra-navigation/SolarLayout/SolarLayout' };

export const Basic = () => (
    <MemoryRouter initialEntries={['/']}>
        <Admin dataProvider={testDataProvider()} layout={SolarLayout}>
            <Resource name="posts" list={PostList} icon={Book} />
            <Resource name="comments" list={CommentList} icon={ChatBubble} />
            <Resource name="users" list={UserList} icon={People} />
        </Admin>
    </MemoryRouter>
);

export const RenderingError = () => (
    <MemoryRouter initialEntries={['/']}>
        <Admin dataProvider={testDataProvider()} layout={SolarLayout}>
            <Resource
                name="posts"
                list={() => {
                    throw new Error('A problem has occurred');
                }}
                icon={Book}
            />
            <Resource name="comments" list={CommentList} icon={ChatBubble} />
            <Resource name="users" list={UserList} icon={People} />
        </Admin>
    </MemoryRouter>
);

const Dashboard = React.lazy(
    // @ts-ignore to ignore compilation error "Dynamic imports are only supported when the '--module' flag is set to 'es2020', 'es2022', 'esnext', 'commonjs', 'amd', 'system', 'umd', 'node16', or 'nodenext'."
    () => import('../../stories/solar-layout/Dashboard')
);
export const LazyLoading = () => (
    <MemoryRouter initialEntries={['/']}>
        <Admin
            dataProvider={testDataProvider()}
            layout={SolarLayout}
            dashboard={Dashboard}
        >
            <Resource name="posts" list={PostList} icon={Book} />
            <Resource name="comments" list={CommentList} icon={ChatBubble} />
            <Resource name="users" list={UserList} icon={People} />
        </Admin>
    </MemoryRouter>
);

const Page = ({ title }) => {
    useDefineAppLocation(title.toLowerCase() || 'dashboard');
    return (
        <>
            <Typography variant="h5" mt={2}>
                {title}
            </Typography>
            <Skeleton height={300} />
        </>
    );
};

const PostList = () => <Page title="Posts" />;
const CommentList = () => <Page title="Comments" />;
const UserList = () => <Page title="Users" />;
