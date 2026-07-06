import * as React from 'react';
import {
    Admin,
    AdminContext,
    CustomRoutes,
    LayoutProps,
    Resource,
} from 'react-admin';
import {
    fireEvent,
    render,
    screen,
    getByText,
    waitFor,
} from '@testing-library/react';
import { MemoryRouter, NavLink, Route } from 'react-router-dom';

import { Breadcrumb } from './Breadcrumb';
import { useResourcesBreadcrumbPaths } from './useResourcesBreadcrumbPaths';
import { AppLocationContext, useDefineAppLocation } from '../app-location';
import {
    Basename,
    RecordRepresentation,
    WithInnerDynamicViews,
} from './Breadcrumb.stories';
import { NestedResources } from './Breadcrumb.Nested.stories';

const fakeDataProvider = {
    create: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
    getList: jest.fn(),
    getMany: jest.fn(),
    getOne: jest
        .fn()
        .mockImplementation(() =>
            Promise.resolve({ data: { id: '1', title: 'my title' } })
        ),
    getManyReference: jest.fn(),
};

describe('Breadcrumb', () => {
    it('should render breadcrumb from app location', () => {
        render(
            <MemoryRouter initialEntries={['/foo']}>
                <AdminContext>
                    <AppLocationContext
                        initialLocation={{ path: 'foo', values: {} }}
                    >
                        <Breadcrumb>
                            <Breadcrumb.Item name="foo" label="Foo" />
                        </Breadcrumb>
                    </AppLocationContext>
                </AdminContext>
            </MemoryRouter>
        );

        expect(screen.queryByText('Foo')).not.toBeNull();
    });

    it("should render nothing if there's no app location", () => {
        render(
            <MemoryRouter initialEntries={['/songs/1']}>
                <AdminContext dataProvider={fakeDataProvider}>
                    <AppLocationContext>
                        <Breadcrumb>
                            <Breadcrumb.Item name="foo" label="Foo" />
                        </Breadcrumb>
                    </AppLocationContext>
                </AdminContext>
            </MemoryRouter>
        );

        expect(screen.queryByText('Foo')).toBeNull();
    });

    it("should render nothing if location doesn't match", () => {
        render(
            <MemoryRouter initialEntries={['/songs/1']}>
                <AdminContext dataProvider={fakeDataProvider}>
                    <AppLocationContext
                        initialLocation={{ path: 'bar', values: {} }}
                    >
                        <Breadcrumb>
                            <Breadcrumb.Item name="foo" label="Foo" />
                        </Breadcrumb>
                    </AppLocationContext>
                </AdminContext>
            </MemoryRouter>
        );

        expect(screen.queryByText('Foo')).toBeNull();
    });

    it('should update rendered breadcrumb on app location change', async () => {
        const GoToSongButton = () => {
            return <NavLink to="/songs/1">Go To Songs #1</NavLink>;
        };

        const Layout = ({ children }: LayoutProps) => (
            <AppLocationContext>
                <Breadcrumb>
                    <Breadcrumb.ResourceItems />
                    <Breadcrumb.Item name="foo" label="Foo" />
                </Breadcrumb>
                <GoToSongButton />
                {children}
            </AppLocationContext>
        );
        const FooPage = () => {
            useDefineAppLocation('foo');
            return null;
        };
        render(
            <MemoryRouter initialEntries={['/foo']}>
                <Admin layout={Layout} dataProvider={fakeDataProvider}>
                    <Resource
                        name="songs"
                        create={<div />}
                        edit={<div />}
                        list={<div />}
                        show={<div />}
                    />
                    <CustomRoutes>
                        <Route path="/foo" element={<FooPage />} />
                    </CustomRoutes>
                </Admin>
            </MemoryRouter>
        );

        expect(screen.queryByText('Songs')).toBeNull();
        expect(screen.queryByText('#1')).toBeNull();
        expect(screen.queryByText('Foo')).not.toBeNull();

        fireEvent.click(screen.getByText('Go To Songs #1'));
        await waitFor(() => {
            expect(screen.queryByText('Foo')).toBeNull();
        });
        await waitFor(() => {
            expect(screen.queryByText('Songs')).not.toBeNull();
        });
        await waitFor(() => {
            expect(screen.queryByText('#1')).not.toBeNull();
        });
    });

    it('should update rendered breadcrumb on setLocation call from useAppLocationState', async () => {
        const Custom = ({ path }: { path: string }) => {
            useDefineAppLocation(path);
            return <>{`${path} path`}</>;
        };

        const Layout = ({ children }: LayoutProps) => {
            return (
                <AppLocationContext>
                    <Breadcrumb>
                        <Breadcrumb.Item name="foo" label="Foo" />
                        <Breadcrumb.Item name="bar" label="Bar" />
                    </Breadcrumb>
                    <NavLink to="/foo">Show Foo</NavLink>
                    <NavLink to="/bar">Show Bar</NavLink>
                    {children}
                </AppLocationContext>
            );
        };
        const App = () => {
            return (
                <MemoryRouter initialEntries={['/foo']}>
                    <Admin layout={Layout}>
                        <Resource
                            name="songs"
                            create={<div />}
                            edit={<div />}
                            list={<div />}
                            show={<div />}
                        />
                        <CustomRoutes>
                            <Route path="foo" element={<Custom path="foo" />} />
                            <Route path="bar" element={<Custom path="bar" />} />
                        </CustomRoutes>
                    </Admin>
                </MemoryRouter>
            );
        };

        render(<App />);

        expect(screen.queryByText('Foo')).not.toBeNull();
        expect(screen.queryByText('foo path')).not.toBeNull();
        expect(screen.queryByText('Bar')).toBeNull();

        fireEvent.click(screen.getByText('Show Bar'));
        await waitFor(() => new Promise(resolve => setTimeout(resolve, 50)));
        await waitFor(() => {
            expect(screen.queryByText('bar path')).not.toBeNull();
        });
        expect(screen.queryByText('Bar')).not.toBeNull();

        fireEvent.click(screen.getByText('Show Foo'));
        await waitFor(() => new Promise(resolve => setTimeout(resolve, 50)));
        await waitFor(() => {
            expect(screen.queryByText('foo path')).not.toBeNull();
        });
        expect(screen.queryByText('Foo')).not.toBeNull();
    });

    describe('Breadcrumb.ResourceItems', () => {
        it('should render react-admin resource breadcrumb from location if <Breadcrumb.ResourceItems /> is defined as children', async () => {
            const Layout = ({ children }: LayoutProps) => (
                <AppLocationContext>
                    <Breadcrumb>
                        <Breadcrumb.ResourceItems />
                        <Breadcrumb.Item name="foo" label="Foo" />
                        <Breadcrumb.Item name="bar" label="Bar" />
                    </Breadcrumb>
                    {children}
                </AppLocationContext>
            );
            const FooPage = () => {
                useDefineAppLocation('foo');
                return null;
            };
            render(
                <MemoryRouter initialEntries={['/songs/1']}>
                    <Admin dataProvider={fakeDataProvider} layout={Layout}>
                        <Resource
                            name="songs"
                            create={<div />}
                            edit={<div />}
                            list={<div />}
                            show={<div />}
                        />
                        <CustomRoutes>
                            <Route path="/foo" element={<FooPage />} />
                        </CustomRoutes>
                    </Admin>
                </MemoryRouter>
            );

            await waitFor(() => {
                expect(screen.queryByText('Songs')).not.toBeNull();
            });
            expect(screen.queryByText('#1')).not.toBeNull();
        });

        it('should support string recordRepresentation', async () => {
            render(
                <MemoryRouter initialEntries={['/artists/1']}>
                    <RecordRepresentation />
                </MemoryRouter>
            );

            await waitFor(() => {
                expect(screen.queryAllByText('Artists')).toHaveLength(2);
            });
            expect(screen.queryByText('Bob Dylan')).not.toBeNull();
        });

        it('should support fn recordRepresentation', async () => {
            render(
                <MemoryRouter initialEntries={['/songs/1']}>
                    <RecordRepresentation />
                </MemoryRouter>
            );

            await waitFor(() => {
                expect(screen.queryAllByText('Songs')).toHaveLength(2);
            });
            expect(
                screen.queryByText('Song "Like a Rolling Stone"')
            ).not.toBeNull();
        });

        it("shouldn't render react-admin resource breadcrumb from location if <Breadcrumb.ResourceItems /> is not defined as children", async () => {
            const Layout = ({ children }: LayoutProps) => (
                <AppLocationContext>
                    <Breadcrumb>
                        <Breadcrumb.Item name="foo" label="Foo" />
                        <Breadcrumb.Item name="bar" label="Bar" />
                    </Breadcrumb>
                    {children}
                </AppLocationContext>
            );
            render(
                <MemoryRouter initialEntries={['/songs/1']}>
                    <Admin dataProvider={fakeDataProvider} layout={Layout}>
                        <Resource
                            name="songs"
                            create={<div />}
                            edit={<div />}
                            list={<div />}
                            show={<div />}
                        />
                    </Admin>
                </MemoryRouter>
            );

            await waitFor(() => {
                expect(screen.queryByText('Songs')).toBeNull();
            });
            expect(screen.queryByText('#1')).toBeNull();
        });
    });

    it('should allow to define react-admin resource breadcrumb parts', async () => {
        const Layout = ({ children }: LayoutProps) => (
            <AppLocationContext>
                <Breadcrumb>
                    <Breadcrumb.Item name="foo" label="Foo" />
                    <Breadcrumb.Item name="bar" label="Bar" />
                    <Breadcrumb.Item name="songs" label="Songs List">
                        <Breadcrumb.Item name="edit" label="Edit Song" />
                    </Breadcrumb.Item>
                </Breadcrumb>
                {children}
            </AppLocationContext>
        );
        render(
            <MemoryRouter initialEntries={['/songs/1']}>
                <Admin dataProvider={fakeDataProvider} layout={Layout}>
                    <Resource
                        name="songs"
                        create={<div />}
                        edit={<div />}
                        list={<div />}
                        show={<div />}
                    />
                </Admin>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.queryByText('Songs List')).not.toBeNull();
        });
        expect(screen.queryByText('Edit Song')).not.toBeNull();
    });

    it('should work with a basename', async () => {
        render(<Basename />);
        const adminLink = await screen.findByText('Admin');
        adminLink.click();
        const songsLink = await screen.findByText('Songs');
        songsLink.click();
        const editButtons = await screen.findAllByText('Edit');
        editButtons[0].click();
        await waitFor(() => {
            expect(screen.queryByText('#1')).not.toBeNull();
        });
    });

    it('should have correct breadcrumbs links when using basename', async () => {
        const hookValue = jest.fn();
        const UseResourcesBreadcrumbPaths = () => {
            const result = useResourcesBreadcrumbPaths();
            hookValue(result);
            return <div>hello</div>;
        };

        const Layout = ({ children }: LayoutProps) => (
            <AppLocationContext>
                <Breadcrumb>
                    <Breadcrumb.Item name="songs" label="Songs List" />
                </Breadcrumb>
                {children}
            </AppLocationContext>
        );
        render(
            <MemoryRouter initialEntries={['/songs']}>
                <Admin
                    basename="/acme"
                    dataProvider={fakeDataProvider}
                    layout={Layout}
                >
                    <Resource
                        name="songs"
                        list={<UseResourcesBreadcrumbPaths />}
                    />
                </Admin>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.queryByText('Songs List')).not.toBeNull();
        });
        expect(hookValue).toHaveBeenCalledWith(
            expect.objectContaining({
                songs: { label: 'Songs', to: '/acme/songs' },
            })
        );
    });

    it('should render an edition path even if embedded in list', async () => {
        render(<WithInnerDynamicViews />);
        (await screen.findByText('Songs')).click();
        await waitFor(() => {
            expect(screen.queryByText('1-10 of 11')).not.toBeNull();
        });
        (await screen.findAllByText('Edit'))[0].click();
        await screen.findByText('#1');
    });

    it('should render the correct path for nested resources', async () => {
        render(<NestedResources />);
        await waitFor(() => {
            expect(screen.queryByText('1-4 of 4')).not.toBeNull();
        });
        (await screen.findAllByText('Edit'))[0].click();
        (await screen.findByText('Songs')).click();
        (await screen.findAllByText('Edit'))[0].click();
        const breadcrumb = await screen.findByLabelText('Breadcrumb');
        getByText(breadcrumb, 'Artists');
        getByText(breadcrumb, 'Bob Dylan');
        getByText(breadcrumb, 'Songs');
        getByText(breadcrumb, 'Like a Rolling Stone');
    });
});
