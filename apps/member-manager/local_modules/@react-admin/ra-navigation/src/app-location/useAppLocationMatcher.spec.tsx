import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { AppLocationContext, AppLocation } from './AppLocationContext';
import { useAppLocationMatcher } from './useAppLocationMatcher';
import { AdminContext } from 'react-admin';

describe('useAppLocationMatcher', () => {
    const UseApplocationMatcher = ({ path }: { path: string }) => {
        const match = useAppLocationMatcher();

        return <span>{JSON.stringify(match(path))}</span>;
    };

    const App = ({
        path,
        location,
    }: {
        path: string;
        location: AppLocation;
    }) => {
        return (
            <MemoryRouter>
                <AdminContext>
                    <AppLocationContext initialLocation={location}>
                        <UseApplocationMatcher path={path} />
                    </AppLocationContext>
                </AdminContext>
            </MemoryRouter>
        );
    };

    test.each([
        // exact match
        [{ path: 'product' }, 'product', { path: 'product' }],
        // exact deep match
        [{ path: 'product.edit' }, 'product.edit', { path: 'product.edit' }],
        // edit path should match its root resource path
        [{ path: 'product.edit' }, 'product', { path: 'product.edit' }],
        // edit path should not match the list path of the same resource
        [{ path: 'product.edit' }, 'product.list', null],
        // resource with a name starting with the name fo another resource should not match
        [{ path: 'productCatalog' }, 'product', null],
        // should always match the dashboard path
        [{ path: 'product.edit' }, '', { path: 'product.edit' }],
    ])('Correctly matches paths %p %s %p', (location, path, expected) => {
        const { queryByText } = render(<App path={path} location={location} />);
        expect(queryByText(JSON.stringify(expected))).not.toBeNull();
    });
});
