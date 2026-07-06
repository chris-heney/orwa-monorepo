import * as React from 'react';
import { ComponentType, DetailedHTMLProps, HTMLAttributes, ReactElement, ReactNode } from 'react';
import { SxProps } from '@mui/material';
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
export declare const Breadcrumb: {
    ({ children, className, variant, separator, hasDashboard: hasDashboardProp, ...props }: BreadcrumbProps): ReactElement;
    Item: (props: import("./BreadcrumbItem").BreadcrumbItemProps) => React.ReactElement<any, string | React.JSXElementConstructor<any>>;
    DashboardItem: ({ children, label, ...props }: import("./DashboardBreadcrumbItem").DashboardBreadcrumbItemProps) => React.JSX.Element;
    ResourceItem: ({ resource, path, }: import("./ResourceBreadcrumbItem").ResourceBreadcrumbItemProps) => React.ReactElement<any, string | React.JSXElementConstructor<any>>;
    ResourceItems: ({ resources: selectedResources, ...props }: import("./ResourceBreadcrumbItems").ResourceBreadcrumbItemsProps) => React.ReactElement<any, string | React.JSXElementConstructor<any>>;
};
export type BreadcrumbVariant = 'default' | 'actions';
export interface BreadcrumbProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
    children?: ReactNode;
    separator?: string | GetSeparatorFunction;
    className?: string;
    dashboard?: ComponentType;
    hasDashboard?: boolean;
    /**
     * @deprecated
     */
    variant?: BreadcrumbVariant;
    sx?: SxProps;
}
type GetSeparatorFunction = () => string;
export {};
//# sourceMappingURL=Breadcrumb.d.ts.map