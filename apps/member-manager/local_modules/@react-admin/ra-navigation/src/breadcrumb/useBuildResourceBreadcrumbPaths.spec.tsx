import * as React from 'react';
import { I18nContextProvider, ResourceDefinition } from 'react-admin';
import { render } from '@testing-library/react';
import { useBuildResourceBreadcrumbPaths } from './useBuildResourceBreadcrumbPaths';

describe('useBuildResourceBreadcrumbPaths', () => {
    const i18nProvider = {
        getLocale: () => 'en',
        changeLocale: () => null,
        translate: (key: string, options: any): string =>
            `${key} ${JSON.stringify(options)}`,
    };
    const GetResourcePaths = ({
        resource,
        callback,
    }: {
        resource: ResourceDefinition;
        callback: (result: any) => void;
    }) => {
        const buildResourceBreadcrumbPaths = useBuildResourceBreadcrumbPaths();

        const result = buildResourceBreadcrumbPaths(resource);
        callback(result);
        return null;
    };

    it('should build breadcrumb paths from a resource definition where all views are defined', () => {
        let paths;
        const callback = jest.fn(result => {
            paths = result;
        });

        render(
            <I18nContextProvider value={i18nProvider}>
                <GetResourcePaths
                    resource={{
                        name: 'song',
                        hasList: true,
                        hasEdit: true,
                        hasCreate: true,
                        hasShow: true,
                    }}
                    callback={callback}
                />
            </I18nContextProvider>
        );

        expect(callback).toHaveBeenCalledWith({
            song: {
                label: 'resources.song.name {"smart_count":2,"_":"Songs"}',
                to: '/song',
            },
            'song.create': {
                label: 'ra.action.create undefined',
                to: '/song/create',
            },
            'song.edit': {
                label: expect.any(Function),
                to: expect.any(Function),
            },
            'song.show': {
                label: expect.any(Function),
                to: expect.any(Function),
            },
        });
        expect(
            paths[`song.edit`].label({
                record: { id: 1 },
            })
        ).toEqual('#1');
        expect(
            paths[`song.show`].label({
                record: { id: 1 },
            })
        ).toEqual('#1');
    });
    it('should build breadcrumb paths from a resource definition where no views are defined', () => {
        let paths;
        const callback = jest.fn(result => {
            paths = result;
        });

        render(
            <I18nContextProvider value={i18nProvider}>
                <GetResourcePaths
                    resource={{
                        name: 'song',
                        hasList: false,
                        hasEdit: false,
                        hasCreate: false,
                        hasShow: false,
                    }}
                    callback={callback}
                />
            </I18nContextProvider>
        );

        expect(callback).toHaveBeenCalledWith({
            song: {
                label: 'resources.song.name {"smart_count":2,"_":"Songs"}',
                to: '/song',
            },
            'song.create': {
                label: 'ra.page.create {"name":"resources.song.name {\\"smart_count\\":1,\\"_\\":\\"Song\\"}"}',
                to: '/song/create',
            },
            'song.edit': {
                label: expect.any(Function),
                to: expect.any(Function),
            },
            'song.show': {
                label: expect.any(Function),
                to: expect.any(Function),
            },
        });
        expect(
            paths[`song.edit`].label({
                record: { id: 1 },
            })
        ).toEqual(
            `ra.page.edit {"name":"resources.song.name {\\"smart_count\\":1,\\"_\\":\\"Song\\"}","id":1,"record":{"id":1},"recordRepresentation":"#1"}`
        );
        expect(
            paths[`song.show`].label({
                record: { id: 1 },
            })
        ).toEqual(
            `ra.page.show {"name":"resources.song.name {\\"smart_count\\":1,\\"_\\":\\"Song\\"}","id":1,"record":{"id":1},"recordRepresentation":"#1"}`
        );
    });
});
