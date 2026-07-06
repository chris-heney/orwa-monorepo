import * as React from 'react';
import { CustomRoutes, testDataProvider, Admin, Resource } from 'react-admin';
import { Typography, Skeleton } from '@mui/material';
import {
    Dashboard,
    PieChartOutlined,
    PeopleOutlined,
    Inventory,
    Settings,
    Book,
    People,
    ChatBubble,
} from '@mui/icons-material';
import { MemoryRouter, Route } from 'react-router-dom';

import { SolarLayout, SolarMenu } from '.';
import { useDefineAppLocation } from '../app-location';

export default { title: 'ra-navigation/SolarLayout/SolarMenu' };

const authProvider = {
    login: () => Promise.reject('bad method'),
    logout: () => Promise.reject('bad method'),
    checkAuth: () => Promise.resolve(),
    checkError: () => Promise.reject('bad method'),
    getPermissions: () => Promise.resolve(),
};

export const Basic = () => {
    const CustomMenu = () => <SolarMenu />;
    const CustomLayout = props => <SolarLayout {...props} menu={CustomMenu} />;

    return (
        <MemoryRouter initialEntries={['/']}>
            <Admin dataProvider={testDataProvider()} layout={CustomLayout}>
                <Resource name="posts" list={PostList} icon={Book} />
                <Resource name="users" list={UserList} icon={People} />
            </Admin>
        </MemoryRouter>
    );
};

export const WithAuth = () => {
    const CustomMenu = () => <SolarMenu />;
    const CustomLayout = props => <SolarLayout {...props} menu={CustomMenu} />;

    return (
        <MemoryRouter initialEntries={['/']}>
            <Admin
                dataProvider={testDataProvider()}
                authProvider={authProvider}
                layout={CustomLayout}
            >
                <Resource name="posts" list={PostList} icon={Book} />
                <Resource
                    name="comments"
                    list={CommentList}
                    icon={ChatBubble}
                />
                <Resource name="users" list={UserList} icon={People} />
            </Admin>
        </MemoryRouter>
    );
};

export const Dense = () => {
    const CustomMenu = () => <SolarMenu dense />;
    const CustomLayout = props => <SolarLayout {...props} menu={CustomMenu} />;

    return (
        <MemoryRouter initialEntries={['/']}>
            <Admin
                dataProvider={testDataProvider()}
                authProvider={authProvider}
                layout={CustomLayout}
            >
                <Resource name="posts" list={PostList} icon={Book} />
                <Resource
                    name="comments"
                    list={CommentList}
                    icon={ChatBubble}
                />
                <Resource name="users" list={UserList} icon={People} />
            </Admin>
        </MemoryRouter>
    );
};

export const Children = () => {
    const CustomMenu = () => (
        <SolarMenu>
            <SolarMenu.Item
                name="dashboard"
                to="/"
                icon={<Dashboard />}
                label="Dashboard"
            />
            <SolarMenu.Item
                name="sales"
                to="/sales"
                icon={<PieChartOutlined />}
                label="Sales"
            />
            <SolarMenu.Item
                name="customers"
                to="/customers"
                icon={<PeopleOutlined />}
                label="Customers"
            />
            <SolarMenu.Item
                name="products"
                to="/products"
                icon={<Inventory />}
                label="Catalog"
            />
        </SolarMenu>
    );
    const CustomLayout = props => <SolarLayout {...props} menu={CustomMenu} />;

    return (
        <MemoryRouter initialEntries={['/']}>
            <Admin dataProvider={testDataProvider()} layout={CustomLayout}>
                <CustomRoutes>
                    <Route path="/" element={<Page title="Dashboard" />} />
                    <Route path="/sales" element={<Page title="Sales" />} />
                    <Route
                        path="/customers"
                        element={<Page title="Customers" />}
                    />
                    <Route
                        path="/products"
                        element={<Page title="Catalog" />}
                    />
                </CustomRoutes>
            </Admin>
        </MemoryRouter>
    );
};

export const BottomToolbar = () => {
    const CustomBottomToolbar = () => (
        <SolarMenu.List>
            <SolarMenu.Item
                name="settings"
                label="Settings"
                to="/settings"
                icon={<Settings />}
            />
            <SolarMenu.LoadingIndicatorItem />
            <SolarMenu.UserItem />
        </SolarMenu.List>
    );

    const CustomMenu = () => (
        <SolarMenu bottomToolbar={<CustomBottomToolbar />} />
    );

    const CustomLayout = props => <SolarLayout {...props} menu={CustomMenu} />;

    return (
        <MemoryRouter initialEntries={['/']}>
            <Admin
                dataProvider={testDataProvider()}
                authProvider={authProvider}
                layout={CustomLayout}
            >
                <Resource name="posts" list={PostList} icon={Book} />
                <Resource
                    name="comments"
                    list={CommentList}
                    icon={ChatBubble}
                />
                <Resource name="users" list={UserList} icon={People} />
                <CustomRoutes>
                    <Route
                        path="/settings"
                        element={<Page title="Settings" />}
                    />
                </CustomRoutes>
            </Admin>
        </MemoryRouter>
    );
};

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
