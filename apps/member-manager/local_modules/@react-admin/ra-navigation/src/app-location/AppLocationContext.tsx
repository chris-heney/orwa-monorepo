import * as React from 'react';
import { createContext, ReactElement, ReactNode, useState } from 'react';

import { AppBreadcrumbContextProvider } from './AppBreadcrumbContext';
import { useResourceAppLocation } from './useResourceAppLocation';
import { DASHBOARD } from './constants';

export const LocationContext = createContext([]);

/**
 * AppLocation type defines all required location information needed to define a location
 * It is mainly used by the location state object in LocationContext
 *
 * @type {Object}
 * @property {string} path dot based location path (eg: foo.bar.baz)
 * @property {Object} values location context values (eg: { record }, ...)
 */
export type AppLocation = { path: string; values?: any };

export const defaultLocation = {
    path: null,
    values: {},
};

type AppLocationContextProps = {
    children: ReactNode;
    hasDashboard?: boolean;
    /**
     * @internal Only use in tests
     */
    initialLocation?: AppLocation;
};

/**
 * The <AppLocationContext /> component allows to wrap our application inside an unique location context.
 * This component must be contained by our admin to be able to access the current registred resources from the redux store.
 *
 * So, the easiest way to include it is to use a custom Layout as a wrapper since you (probably) need to insert your breadcrumb here too.
 *
 * @example
 *
 *  import { AppLocationContext } from '@react-admin/ra-navigation';
 *  import { Admin, Resource, Layout } from 'react-admin';
 *
 *  const MyLayout = ({ children, ...props }) => {
 *      const classes = useStyles();
 *
 *      return (
 *          <AppLocationContext>
 *              <Layout {...props}>
 *                  {children}
 *              </Layout>
 *          </AppLocationContext>
 *      );
 *  };
 *
 *  const App = () => (
 *      <Admin dataProvider={dataProvider} layout={MyLayout}>
 *          <Resource name="posts" list={PostList} />
 *      </Admin>
 *  );
 */
export const AppLocationContext = ({
    children,
    initialLocation,
    hasDashboard = false,
}: AppLocationContextProps): ReactElement => {
    const [location, setLocation] = useState<AppLocation>(initialLocation);
    const resourceLocation = useResourceAppLocation();
    let finalLocation = location?.path ? location : resourceLocation;
    if (!finalLocation?.path && hasDashboard) {
        // Set the location state to Dashboard when navigate to root url
        finalLocation = { path: DASHBOARD };
    }
    if (!finalLocation?.path) {
        finalLocation = defaultLocation;
    }

    return (
        <LocationContext.Provider value={[finalLocation, setLocation]}>
            <AppBreadcrumbContextProvider hasDashboard={hasDashboard}>
                {children}
            </AppBreadcrumbContextProvider>
        </LocationContext.Provider>
    );
};
