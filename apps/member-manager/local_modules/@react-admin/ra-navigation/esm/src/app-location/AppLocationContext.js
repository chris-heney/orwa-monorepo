import * as React from 'react';
import { createContext, useState } from 'react';
import { AppBreadcrumbContextProvider } from './AppBreadcrumbContext';
import { useResourceAppLocation } from './useResourceAppLocation';
import { DASHBOARD } from './constants';
export var LocationContext = createContext([]);
export var defaultLocation = {
    path: null,
    values: {},
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
export var AppLocationContext = function (_a) {
    var children = _a.children, initialLocation = _a.initialLocation, _b = _a.hasDashboard, hasDashboard = _b === void 0 ? false : _b;
    var _c = useState(initialLocation), location = _c[0], setLocation = _c[1];
    var resourceLocation = useResourceAppLocation();
    var finalLocation = (location === null || location === void 0 ? void 0 : location.path) ? location : resourceLocation;
    if (!(finalLocation === null || finalLocation === void 0 ? void 0 : finalLocation.path) && hasDashboard) {
        // Set the location state to Dashboard when navigate to root url
        finalLocation = { path: DASHBOARD };
    }
    if (!(finalLocation === null || finalLocation === void 0 ? void 0 : finalLocation.path)) {
        finalLocation = defaultLocation;
    }
    return (React.createElement(LocationContext.Provider, { value: [finalLocation, setLocation] },
        React.createElement(AppBreadcrumbContextProvider, { hasDashboard: hasDashboard }, children)));
};
