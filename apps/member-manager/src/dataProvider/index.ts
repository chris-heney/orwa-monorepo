import simpleRestProvider from 'ra-data-simple-rest';
import { addLocksMethodsBasedOnALockResource } from '@react-admin/ra-realtime';
import { addTreeMethodsBasedOnChildren } from '@react-admin/ra-tree';
import { addRevisionMethodsBasedOnRelatedResource } from '@react-admin/ra-history';

import addRealtimeMethodsWithFakeTransport from './addRealtimeMethodsWithFakeTransport';
import addSearchMethod from './addSearchMethod';

const compose = (...funcs: any) =>
    funcs.reduce(
        (a: any, b: any) =>
            (...args: any) =>
                a(b(...args)),
        (arg: any) => arg
    );

const restProvider = compose(
    addLocksMethodsBasedOnALockResource,
    addRealtimeMethodsWithFakeTransport,
    addTreeMethodsBasedOnChildren,
    addSearchMethod,
    addRevisionMethodsBasedOnRelatedResource
)(simpleRestProvider('http://localhost:4000'));

const fakeDataProvider = {
    ...restProvider,
    getList: (resource: string, params: any) => {
        if (resource === 'servers') {
            return Promise.resolve({
                data: [
                    { id: 1, name: 'Server 1', status: 'active' },
                    { id: 2, name: 'Server 2', status: 'inactive' },
                    { id: 3, name: 'Server 3', status: 'active' },
                ],
                total: 3,
            });
        }
        if (resource === 'domains') {
            return Promise.resolve({
                data: [
                    { id: 1, name: 'Domain 1', status: 'active' },
                    { id: 2, name: 'Domain 2', status: 'expired' },
                    { id: 3, name: 'Domain 3', status: 'active' },
                ],
                total: 3,
            });
        }
        return restProvider.getList(resource, params);
    },
    getOne: (resource: string, params: any) => {
        if (resource === 'servers') {
            const server = [
                { id: 1, name: 'Server 1', status: 'active' },
                { id: 2, name: 'Server 2', status: 'inactive' },
                { id: 3, name: 'Server 3', status: 'active' },
            ].find(server => server.id === params.id);
            if (server) {
                return Promise.resolve({
                    data: server,
                });
            } else {
                return Promise.resolve({
                    data: null,
                });
            }
        }
        if (resource === 'domains') {
            const domain = [
                { id: 1, name: 'Domain 1', status: 'active' },
                { id: 2, name: 'Domain 2', status: 'expired' },
                { id: 3, name: 'Domain 3', status: 'active' },
            ].find(domain => domain.id === params.id);
            if (domain) {
                return Promise.resolve({
                    data: domain,
                });
            } else {
                return Promise.resolve({
                    data: null,
                });
            }
        }
        return restProvider.getOne(resource, params);
    }
};

const delayedDataProvider = new Proxy(fakeDataProvider, {
    get: (target, name, self) => {
        if (name === 'then') {
            return self;
        }

        return (resource: string, params: any) => {
            return new Promise(resolve =>
                setTimeout(
                    () => resolve(fakeDataProvider[name](resource, params)),
                    200
                )
            );
        };
    },
});

export default delayedDataProvider;
