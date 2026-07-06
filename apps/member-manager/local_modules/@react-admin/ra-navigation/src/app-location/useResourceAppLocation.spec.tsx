import { render, waitFor } from '@testing-library/react';
import * as React from 'react';
import { AdminContext, ResourceDefinitionContextProvider } from 'react-admin';
import { MemoryRouter } from 'react-router-dom';
import { useResourceAppLocation } from './useResourceAppLocation';

describe('useResourceAppLocation', () => {
    const UseResourceAppLocation = () => {
        useResourceAppLocation();
        return null;
    };

    const App = ({
        pathname,
        dataProvider,
    }: {
        pathname: string;
        dataProvider: any;
    }) => {
        return (
            <MemoryRouter initialEntries={[pathname]}>
                <AdminContext dataProvider={dataProvider}>
                    <ResourceDefinitionContextProvider
                        definitions={{
                            posts: {
                                name: 'posts',
                                hasList: true,
                                hasEdit: true,
                                hasShow: true,
                                hasCreate: true,
                                options: {},
                                recordRepresentation: 'title',
                            },
                        }}
                    >
                        <UseResourceAppLocation />
                    </ResourceDefinitionContextProvider>
                </AdminContext>
            </MemoryRouter>
        );
    };

    it('Should call getOne with resource and id from location', async () => {
        const dataProvider = {
            getOne: jest.fn(),
        };
        render(<App pathname="/posts/123" dataProvider={dataProvider} />);
        await waitFor(() => {
            expect(dataProvider.getOne).toHaveBeenCalledWith('posts', {
                id: '123',
            });
        });
    });

    it('Should URI decode the id when calling getOne (for Api Platform)', async () => {
        const dataProvider = {
            getOne: jest.fn(),
        };
        render(
            <App pathname="/posts/%2Fposts%2F123" dataProvider={dataProvider} />
        );
        await waitFor(() => {
            expect(dataProvider.getOne).toHaveBeenCalledWith('posts', {
                id: '/posts/123',
            });
        });
    });
});
