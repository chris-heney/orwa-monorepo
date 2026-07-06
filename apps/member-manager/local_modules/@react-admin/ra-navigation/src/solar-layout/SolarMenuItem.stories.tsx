import * as React from 'react';
import { CustomRoutes, testDataProvider, Admin } from 'react-admin';
import {
    Typography,
    Skeleton,
    ListItemText,
    ListItemIcon,
    Divider,
} from '@mui/material';
import {
    Dashboard,
    PieChartOutlined,
    PeopleOutlined,
    Inventory,
    QrCode,
} from '@mui/icons-material';
import { MemoryRouter, Route } from 'react-router-dom';

import { SolarLayout, SolarMenu } from '.';
import { useDefineAppLocation } from '../app-location';

export default { title: 'ra-navigation/SolarLayout/SolarMenuItem' };

export const Basic = () => {
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

export const MenuItemChild = () => {
    const CustomMenu = () => (
        <SolarMenu>
            <SolarMenu.Item
                name="dashboard"
                to="/"
                label="Dashboard"
                icon={<Dashboard />}
            />
            <Divider />
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
                name="catalog"
                icon={<Inventory />}
                label="Catalog"
                subMenu={
                    <SolarMenu.List disablePadding>
                        <SolarMenu.Item name="products" to="/products">
                            <ListItemIcon>
                                <QrCode />
                            </ListItemIcon>
                            <ListItemText>Products</ListItemText>
                            <Typography variant="body2" color="text.secondary">
                                ⌘P
                            </Typography>
                        </SolarMenu.Item>
                    </SolarMenu.List>
                }
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
                        element={<Page title="Products" />}
                    />
                </CustomRoutes>
            </Admin>
        </MemoryRouter>
    );
};
