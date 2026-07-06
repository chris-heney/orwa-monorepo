import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ResourceDefinitionContextProvider } from 'react-admin';

import { AppLocationContext, useDefineAppLocation } from '../app-location';
import { HorizontalMenu } from './HorizontalMenu';

export default {
    title: 'ra-navigation/HorizontalMenu',
};

const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter>
        <QueryClientProvider client={new QueryClient()}>
            <AppLocationContext>{children}</AppLocationContext>
        </QueryClientProvider>
    </MemoryRouter>
);

export const Basic = () => (
    <Wrapper>
        <HorizontalMenu>
            <HorizontalMenu.Item label="Dashboard" to="/" value="" />
            <HorizontalMenu.Item label="Songs" to="/songs" value="songs" />
            <HorizontalMenu.Item
                label="Artists"
                to="/artists"
                value="artists"
            />
        </HorizontalMenu>
    </Wrapper>
);

const CustomPage = () => {
    useDefineAppLocation('custom');
    return <h1>Custom page</h1>;
};

export const DetectLocation = () => (
    <Wrapper>
        <HorizontalMenu>
            <HorizontalMenu.Item label="Dashboard" to="/" value="" />
            <HorizontalMenu.Item label="Custom" to="/foo" value="custom" />
        </HorizontalMenu>
        <CustomPage />
    </Wrapper>
);

export const FromResources = () => (
    <ResourceDefinitionContextProvider
        definitions={{
            posts: { name: 'posts', hasList: true },
            comments: { name: 'comments', hasList: true },
            tags: { name: 'tags' },
        }}
    >
        <Wrapper>
            <HorizontalMenu hasDashboard />
        </Wrapper>
    </ResourceDefinitionContextProvider>
);
