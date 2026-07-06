var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import * as React from 'react';
import { styled } from '@mui/material';
import clsx from 'clsx';
import { useAppLocationState } from '../app-location';
import { useHasDashboard } from '../app-location/useHasDashboard';
import { BreadcrumbItem } from './BreadcrumbItem';
import { DashboardBreadcrumbItem } from './DashboardBreadcrumbItem';
import { ResourceBreadcrumbItem } from './ResourceBreadcrumbItem';
import { ResourceBreadcrumbItems } from './ResourceBreadcrumbItems';
/**
 * The <Breadcrumb /> component allows to include a breadcrumb inside our application.
 * The layout of the app must be inside a AppLocationContext.
 *
 * @see AppLocationContext
 *
 * @param {string} separator Optionnal. Specify the separator caracter between items. Default is '/'.
 * @param {string} className Optionnal. To allow a style customization of this Component.
 * @param {ReactElement} dashboard Optionnal. Passed by Layout to detect if a Dashboard page has been set.
 * @param {boolean} hasDashboard Optionnal. Boolean to manually activate Dashboard navigation. Default is false.
 *
 * If provided with no children, <Breadcrumb /> will render breadcrumb entries for all
 * resources declared under <Admin />.
 * It's basically the same as providing <ResourceBreacrumbItems /> as child.
 *
 * @example
 *  import React from 'react';
 *  import { AppLocationContext } from '@react-admin/ra-navigation';
 *  import { Breadcrumb } from '@react-admin/ra-navigation';
 *  import { Admin, Resource, Layout } from 'react-admin';
 *
 *  import PostList from './PostList';
 *  import PostEdit from './PostEdit';
 *  import PostShow from './PostShow';
 *  import PostCreate from './PostCreate';
 *
 *  const MyLayout = ({ children, ...props }) => (
 *    <AppLocationContext>
 *      <Layout {...props}>
 *        <Breadcrumb />
 *        {children}
 *      </Layout>
 *    </AppLocationContext>
 *  );
 *
 *  const App = () => (
 *    <Admin dataProvider={dataProvider} layout={MyLayout}>
 *      <Resource
 *        name="posts"
 *        list={PostList}
 *        edit={PostEdit}
 *        show={PostShow}
 *        create={PostCreate}
 *      />
 *    </Admin>
 *  );
 *
 * It'll display respectively:
 *   - "Posts" on Post List
 *   - "Posts / Show #1" on Post Show with id = 1
 *   - "Posts / Edit #1" on Post Edit with id = 1
 *   - "Posts / Create" on Post Create
 *
 * If the app has a dashboard page, you can automatically set the root the Breadcrumb to this page in two possible ways:
 *
 * 1. By passing the dashboard prop to the Component
 * const MyLayout = ({ children, dashboard, ...props }) => (
 *    <AppLocationContext>
 *      <Layout {...props}>
 *        <Breadcrumb dashboard={dashboard} />
 *        {children}
 *      </Layout>
 *    </AppLocationContext>
 *  );
 *
 * 2. By passing a hasDashboard prop to the Component
 * const MyLayout = ({ children, ...props }) => (
 *    <AppLocationContext>
 *      <Layout {...props}>
 *        <Breadcrumb hasDashboard />
 *        {children}
 *      </Layout>
 *    </AppLocationContext>
 *  );
 *
 * By doing this, the breadcrumb will now show respectively:
 *   - "Dashboard / Posts" on Post List
 *   - "Dashboard / Posts / Show #1" on Post Show with id = 1
 *   - "Dashboard / Posts / Edit #1" on Post Edit with id = 1
 *   - "Dashboard / Posts / Create" on Post Create
 *
 * It's also possible to define a custom breadcrumb tree inside <Breadcrumb />.
 * This way, custom routes can also be displayed inside the breadcrumb.
 *
 *  import React from 'react';
 *  import { AppLocationContext } from '@react-admin/ra-navigation';
 *  import { Breadcrumb } from '@react-admin/ra-navigation';
 *  import { Admin, Resource, Layout } from 'react-admin';
 *  import { Route } from 'react-router-dom';
 *
 *  import PostList from './PostList';
 *  import PostEdit from './PostEdit';
 *  import PostShow from './PostShow';
 *  import PostCreate from './PostCreate';
 *
 *  const UserPreferences = () => {
 *    useDefineAppLocation('myhome.user.preferences');
 *    return <span>My Preferences</span>;
 *  };
 *
 *  const routes = [
 *    <Route exact path="/user/preferences" component={UserPreferences} />,
 *  ];
 *
 *  const MyLayout = ({ children }) => (
 *    <AppLocationContext>
 *      <Layout {...props}>
 *        <Breadcrumb>
 *          <Breadcrumb.ResourceItems />
 *          <Breadcrumb.Item name="myhome" label="Home">
 *            <Breadcrumb.Item name="user" label="User">
 *              <Breadcrumb.Item name="preferences" label="Preferences" />
 *            </Breadcrumb.Item>
 *          </Breadcrumb.Item>
 *        </Breadcrumb>
 *        {children}
 *      </Layout>
 *    </AppLocationContext>
 *  );
 *
 *  const App = () => (
 *    <Admin dataProvider={dataProvider} customRoutes={routes} layout={MyLayout}>
 *      <Resource
 *        name="posts"
 *        list={PostList}
 *        edit={PostEdit}
 *        show={PostShow}
 *        create={PostCreate}
 *      />
 *    </Admin>
 *  );
 *
 * The displayed path will be "Dashboard / User / Preferences" on "/user/preferences"
 *
 * The breadcrumb separator used by default is "/". It can be overridden using a string or a function.
 *
 *   <Breadcrumb separator=">">{items}</Breadcrumb>
 *   <Breadcrumb separator={() => `url('data:image/png;base64,iVBORw0KGgoAA....')`}>
 *      {items}
 *   </Breadcrumb>
 *
 * In some cases, it's useful to override the default resource breadcrumb path
 * eg: to add custom label instead of "Show #1", "Edit #1", ...
 *
 * This can be done by disabling concerned resources (enabling only ones we don't customize) and declare them manually.
 *
 *  import React from 'react';
 *  import { AppLocationContext } from '@react-admin/ra-navigation';
 *  import { Breadcrumb } from '@react-admin/ra-navigation';
 *  import { Admin, Resource, Layout, linkToRecord } from 'react-admin';
 *
 *  import PostList from './PostList';
 *  import PostEdit from './PostEdit';
 *  import PostShow from './PostShow';
 *  import PostCreate from './PostCreate';
 *
 *  const MyLayout = ({ children }) => (
 *    <Layout {...props}>
 *        <Breadcrumb>
 *          <Breadcrumb.ResourceItems resources={['otherResources']} />
 *          <Breadcrumb.Item name="posts" label="Posts">
 *            <Breadcrumb.Item
 *              name="edit"
 *              label={({ record }) => `Edit "${record.title}"`}
 *              to={({ record }) => record && `${linkToRecord('/songs', record.id)}/edit`}
 *            />
 *            <Breadcrumb.Item
 *              name="show"
 *              label={({ record }) => record.title}
 *              to={({ record }) => record && `${linkToRecord('/songs', record.id)}/show`}
 *            />
 *            <Breadcrumb.Item name="list" label="My Post List" />
 *            <Breadcrumb.Item name="create" label="Let's write a Post!" />
 *          </Breadcrumb.Item>
 *        </Breadcrumb>
 *      {children}
 *    </Layout>
 *  );
 *
 *  const App = () => (
 *    <AppLocationContext>
 *      <Admin dataProvider={dataProvider} layout={MyLayout}>
 *        <Resource
 *          name="posts"
 *          list={PostList}
 *          edit={PostEdit}
 *          show={PostShow}
 *          create={PostCreate}
 *        />
 *        <Resource name="otherResource" ... />
 *      </Admin>
 *    </AppLocationContext>
 *  );
 */
export var Breadcrumb = function (_a) {
    var _b;
    var _c = _a.children, children = _c === void 0 ? DefaultChildren : _c, className = _a.className, variant = _a.variant, separator = _a.separator, hasDashboardProp = _a.hasDashboard, props = __rest(_a, ["children", "className", "variant", "separator", "hasDashboard"]);
    var location = useAppLocationState()[0];
    var hasDashboard = useHasDashboard({ hasDashboard: hasDashboardProp });
    var finalHasDashboard = props.dashboard != null ? !!props.dashboard : hasDashboard;
    if (!location.path)
        return null;
    return (React.createElement(Root, __assign({ "aria-label": "Breadcrumb", className: clsx(className, (_b = {},
            _b[BreadcrumbClasses.actions] = variant === 'actions',
            _b)), 
        // @ts-ignore
        separator: separator }, props),
        React.createElement("ul", { className: BreadcrumbClasses.list }, React.Children.map(children, function (child) {
            return React.isValidElement(child)
                ? React.cloneElement(child, {
                    hasDashboard: finalHasDashboard,
                })
                : null;
        }))));
};
Breadcrumb.Item = BreadcrumbItem;
Breadcrumb.DashboardItem = DashboardBreadcrumbItem;
Breadcrumb.ResourceItem = ResourceBreadcrumbItem;
Breadcrumb.ResourceItems = ResourceBreadcrumbItems;
var DefaultChildren = React.createElement(Breadcrumb.ResourceItems, null);
var separatorResolver = function (_a) {
    var separator = _a.separator;
    return typeof separator === 'function'
        ? separator()
        : "\"".concat(separator || ' / ', "\"");
};
var PREFIX = 'RaBreadcrumb';
var BreadcrumbClasses = {
    list: "".concat(PREFIX, "-list"),
    actions: "".concat(PREFIX, "-actions"),
};
var Root = styled('nav', {
    name: 'RaBreadcrumb',
    overridesResolver: function (props, styles) { return styles.root; },
})(function (_a) {
    var _b;
    var theme = _a.theme, props = __rest(_a, ["theme"]);
    return (_b = {},
        _b["& .".concat(BreadcrumbClasses.list)] = {
            listStyle: 'none',
            padding: "".concat(theme.spacing(0.5), " 0 ").concat(theme.spacing(0.5), " 0"),
            margin: "".concat(theme.spacing(0.5), " 0 ").concat(theme.spacing(0.5), " 0"),
            '&:empty': {
                margin: 0,
            },
            '& li': {
                display: 'inline',
                color: theme.palette.text.secondary,
                '&+li::before': {
                    content: separatorResolver(props),
                    padding: "0 ".concat(theme.spacing(1), "px"),
                },
                '&+li:last-child': {
                    color: theme.palette.text.primary,
                },
                '& a': {
                    textDecoration: 'none',
                    '&:hover': {
                        textDecoration: 'underline',
                    },
                },
            },
        },
        _b["& .".concat(BreadcrumbClasses.actions)] = {
            // Same padding as the MuiButton with small text
            padding: '4px 5px',
            // Ensure the breadcrumb is at the left of the view
            marginRight: 'auto',
        },
        _b);
});
