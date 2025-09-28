import * as React from 'react';
import { SolarLayout, SolarLayoutProps } from '@react-admin/ra-navigation';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import AppBar from './AppBar';
import { Menu } from './Menu';

const Layout = (props: SolarLayoutProps) => {

    return (
        <>
            <ReactQueryDevtools initialIsOpen={false} />
            <SolarLayout {...props} menu={Menu} appBar={AppBar}>
                {/* <CustomHeader title="Synapse" /> */}
                {/* <CustomBreadcrumb /> */}
                {props.children}
            </SolarLayout>
        </>
    );
};

export default Layout;
