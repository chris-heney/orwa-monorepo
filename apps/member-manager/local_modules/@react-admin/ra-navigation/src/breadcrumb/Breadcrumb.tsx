import * as React from 'react';
import {
    ComponentType,
    DetailedHTMLProps,
    HTMLAttributes,
    ReactElement,
    ReactNode,
} from 'react';
import { styled, SxProps } from '@mui/material';
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
export const Breadcrumb = ({
    children = DefaultChildren,
    className,
    variant,
    separator,
    hasDashboard: hasDashboardProp,
    ...props
}: BreadcrumbProps): ReactElement => {
    const [location] = useAppLocationState();
    const hasDashboard = useHasDashboard({ hasDashboard: hasDashboardProp });
    const finalHasDashboard =
        props.dashboard != null ? !!props.dashboard : hasDashboard;

    if (!location.path) return null;

    return (
        <Root
            aria-label="Breadcrumb"
            className={clsx(className, {
                [BreadcrumbClasses.actions]: variant === 'actions',
            })}
            // @ts-ignore
            separator={separator}
            {...props}
        >
            <ul className={BreadcrumbClasses.list}>
                {React.Children.map(children, child =>
                    React.isValidElement(child)
                        ? React.cloneElement<any>(child, {
                              hasDashboard: finalHasDashboard,
                          })
                        : null
                )}
            </ul>
        </Root>
    );
};

Breadcrumb.Item = BreadcrumbItem;
Breadcrumb.DashboardItem = DashboardBreadcrumbItem;
Breadcrumb.ResourceItem = ResourceBreadcrumbItem;
Breadcrumb.ResourceItems = ResourceBreadcrumbItems;

const DefaultChildren = <Breadcrumb.ResourceItems />;

export type BreadcrumbVariant = 'default' | 'actions';

export interface BreadcrumbProps
    extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
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
const separatorResolver = ({ separator }: BreadcrumbProps): string => {
    return typeof separator === 'function'
        ? separator()
        : `"${separator || ' / '}"`;
};

const PREFIX = 'RaBreadcrumb';
const BreadcrumbClasses = {
    list: `${PREFIX}-list`,
    actions: `${PREFIX}-actions`,
};

const Root = styled<'nav'>('nav', {
    name: 'RaBreadcrumb',
    overridesResolver: (props, styles) => styles.root,
})(({ theme, ...props }) => ({
    [`& .${BreadcrumbClasses.list}`]: {
        listStyle: 'none',
        padding: `${theme.spacing(0.5)} 0 ${theme.spacing(0.5)} 0`,
        margin: `${theme.spacing(0.5)} 0 ${theme.spacing(0.5)} 0`,
        '&:empty': {
            margin: 0,
        },
        '& li': {
            display: 'inline',
            color: theme.palette.text.secondary,
            '&+li::before': {
                content: separatorResolver(props),
                padding: `0 ${theme.spacing(1)}px`,
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
    [`& .${BreadcrumbClasses.actions}`]: {
        // Same padding as the MuiButton with small text
        padding: '4px 5px',
        // Ensure the breadcrumb is at the left of the view
        marginRight: 'auto',
    },
}));
