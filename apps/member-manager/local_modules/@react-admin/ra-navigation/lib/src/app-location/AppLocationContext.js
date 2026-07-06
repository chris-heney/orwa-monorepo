"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppLocationContext = exports.defaultLocation = exports.LocationContext = void 0;
var React = __importStar(require("react"));
var react_1 = require("react");
var AppBreadcrumbContext_1 = require("./AppBreadcrumbContext");
var useResourceAppLocation_1 = require("./useResourceAppLocation");
var constants_1 = require("./constants");
exports.LocationContext = (0, react_1.createContext)([]);
exports.defaultLocation = {
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
var AppLocationContext = function (_a) {
    var children = _a.children, initialLocation = _a.initialLocation, _b = _a.hasDashboard, hasDashboard = _b === void 0 ? false : _b;
    var _c = (0, react_1.useState)(initialLocation), location = _c[0], setLocation = _c[1];
    var resourceLocation = (0, useResourceAppLocation_1.useResourceAppLocation)();
    var finalLocation = (location === null || location === void 0 ? void 0 : location.path) ? location : resourceLocation;
    if (!(finalLocation === null || finalLocation === void 0 ? void 0 : finalLocation.path) && hasDashboard) {
        // Set the location state to Dashboard when navigate to root url
        finalLocation = { path: constants_1.DASHBOARD };
    }
    if (!(finalLocation === null || finalLocation === void 0 ? void 0 : finalLocation.path)) {
        finalLocation = exports.defaultLocation;
    }
    return (React.createElement(exports.LocationContext.Provider, { value: [finalLocation, setLocation] },
        React.createElement(AppBreadcrumbContext_1.AppBreadcrumbContextProvider, { hasDashboard: hasDashboard }, children)));
};
exports.AppLocationContext = AppLocationContext;
