import * as React from 'react';
import {
    Admin,
    CustomRoutes,
    Resource,
    LayoutProps,
    ListGuesser,
    EditGuesser,
    UserMenu as RaUserMenu,
    Logout,
    useUserMenu,
} from 'react-admin';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import AlarmIcon from '@mui/icons-material/Alarm';
import SettingsIcon from '@mui/icons-material/Settings';
import {
    Box,
    IconButton,
    MenuList,
    MenuItem,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import { createMemoryHistory } from 'history';
import { Route } from 'react-router-dom';

import { useDefineAppLocation } from '../app-location';
import { ContainerLayout } from './ContainerLayout';
import { HorizontalMenu } from './HorizontalMenu';
import { Header } from './Header';
import { dataProvider } from '../../stories/dataProvider';

export default { title: 'ra-navigation/ContainerLayout' };

export const Basic = () => (
    <Admin
        history={createMemoryHistory()}
        dataProvider={dataProvider}
        layout={ContainerLayout}
    >
        <Resource name="songs" list={ListGuesser} edit={EditGuesser} />
        <Resource
            name="artists"
            list={ListGuesser}
            edit={EditGuesser}
            recordRepresentation="name"
        />
    </Admin>
);

const title = (
    <Box display="flex" alignItems="center" gap={1}>
        <LibraryMusicIcon />
        Acme records
    </Box>
);

const Dashboard = () => {
    return <h1>Dashboard</h1>;
};

export const HasDashboard = () => (
    <Admin
        history={createMemoryHistory()}
        dataProvider={dataProvider}
        dashboard={Dashboard}
        layout={ContainerLayout}
        title={title}
    >
        <Resource name="songs" list={ListGuesser} edit={EditGuesser} />
        <Resource
            name="artists"
            list={ListGuesser}
            edit={EditGuesser}
            recordRepresentation="name"
        />
    </Admin>
);

const CustomMenu = () => (
    <HorizontalMenu>
        <HorizontalMenu.Item label="Dashboard" to="/" value="" />
        <HorizontalMenu.Item label="Songs" to="/songs" value="songs" />
        <HorizontalMenu.Item label="Artists" to="/artists" value="artists" />
        <HorizontalMenu.Item label="Custom" to="/custom" value="custom" />
    </HorizontalMenu>
);

const CustomPage = () => {
    useDefineAppLocation('custom');
    return <h1>Custom page</h1>;
};

export const Menu = () => (
    <Admin
        history={createMemoryHistory()}
        dataProvider={dataProvider}
        layout={(props: LayoutProps) => (
            <ContainerLayout {...props} menu={<CustomMenu />} />
        )}
        dashboard={Dashboard}
        title={title}
    >
        <Resource name="songs" list={ListGuesser} edit={EditGuesser} />
        <Resource
            name="artists"
            list={ListGuesser}
            edit={EditGuesser}
            recordRepresentation="name"
        />
        <CustomRoutes>
            <Route path="custom" element={<CustomPage />} />
        </CustomRoutes>
    </Admin>
);

const CustomToolbar = () => (
    <IconButton color="inherit" aria-label="add an alarm">
        <AlarmIcon />
    </IconButton>
);

export const Toolbar = () => (
    <Admin
        history={createMemoryHistory()}
        dataProvider={dataProvider}
        layout={(props: LayoutProps) => (
            <ContainerLayout {...props} toolbar={<CustomToolbar />} />
        )}
        dashboard={Dashboard}
        title={title}
    >
        <Resource name="songs" list={ListGuesser} edit={EditGuesser} />
        <Resource
            name="artists"
            list={ListGuesser}
            edit={EditGuesser}
            recordRepresentation="name"
        />
        <CustomRoutes>
            <Route path="custom" element={<CustomPage />} />
        </CustomRoutes>
    </Admin>
);

export const MaxWidth = ({ maxWidth = 'md' }: any) => (
    <Admin
        history={createMemoryHistory()}
        dataProvider={dataProvider}
        layout={(props: LayoutProps) => (
            <ContainerLayout {...props} maxWidth={maxWidth} />
        )}
        title={title}
    >
        <Resource name="songs" list={ListGuesser} edit={EditGuesser} />
        <Resource
            name="artists"
            list={ListGuesser}
            edit={EditGuesser}
            recordRepresentation="name"
        />
    </Admin>
);
MaxWidth.args = {
    maxWidth: 'md',
};
MaxWidth.argTypes = {
    maxWidth: {
        value: 'md',
        options: ['sm', 'md', 'lg', 'xl', false],
        control: { type: 'radio' },
    },
};

export const Fixed = () => (
    <Admin
        history={createMemoryHistory()}
        dataProvider={dataProvider}
        layout={(props: LayoutProps) => <ContainerLayout {...props} fixed />}
        title={title}
    >
        <Resource name="songs" list={ListGuesser} edit={EditGuesser} />
        <Resource
            name="artists"
            list={ListGuesser}
            edit={EditGuesser}
            recordRepresentation="name"
        />
    </Admin>
);

export const AppBar = () => (
    <Admin
        history={createMemoryHistory()}
        dataProvider={dataProvider}
        layout={props => (
            <ContainerLayout
                {...props}
                appBar={<Header color="primary" position="sticky" />}
            />
        )}
        title={title}
    >
        <Resource name="songs" list={ListGuesser} edit={EditGuesser} />
        <Resource
            name="artists"
            list={ListGuesser}
            edit={EditGuesser}
            recordRepresentation="name"
        />
    </Admin>
);

export const InvalidPage = () => (
    <Admin
        history={createMemoryHistory({
            initialEntries: ['/invalid'],
        })}
        dataProvider={dataProvider}
        layout={ContainerLayout}
    >
        <Resource name="songs" list={ListGuesser} edit={EditGuesser} />
        <Resource
            name="artists"
            list={ListGuesser}
            edit={EditGuesser}
            recordRepresentation="name"
        />
    </Admin>
);

export const Sx = () => (
    <Admin
        history={createMemoryHistory()}
        dataProvider={dataProvider}
        layout={(props: LayoutProps) => (
            <ContainerLayout
                {...props}
                sx={{ '& .MuiToolbar-root': { px: 10 } }}
            />
        )}
    >
        <Resource name="songs" list={ListGuesser} edit={EditGuesser} />
        <Resource
            name="artists"
            list={ListGuesser}
            edit={EditGuesser}
            recordRepresentation="name"
        />
    </Admin>
);

const authProvider = {
    checkAuth: () => Promise.resolve(),
    login: () => Promise.resolve(),
    logout: () => Promise.resolve(),
    checkError: () => Promise.resolve(),
    getPermissions: () => Promise.resolve([]),
};

const ConfigurationMenu = React.forwardRef<any, any>((props, ref) => {
    const { onClose } = useUserMenu();
    return (
        <MenuItem
            ref={ref}
            {...props}
            to="/configuration"
            onClick={onClose}
            sx={{ color: 'text.secondary' }}
        >
            <ListItemIcon>
                <SettingsIcon />
            </ListItemIcon>
            <ListItemText>Configuration</ListItemText>
        </MenuItem>
    );
});
ConfigurationMenu.displayName = 'ConfigurationMenu';

const CustomUserMenu = () => (
    <RaUserMenu>
        <MenuList>
            <ConfigurationMenu />
            <Logout />
        </MenuList>
    </RaUserMenu>
);

export const UserMenu = () => (
    <Admin
        history={createMemoryHistory()}
        dataProvider={dataProvider}
        authProvider={authProvider}
        layout={(props: LayoutProps) => (
            <ContainerLayout {...props} userMenu={<CustomUserMenu />} />
        )}
    >
        <Resource name="songs" list={ListGuesser} edit={EditGuesser} />
        <Resource
            name="artists"
            list={ListGuesser}
            edit={EditGuesser}
            recordRepresentation="name"
        />
    </Admin>
);
