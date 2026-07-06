# ra-navigation

Complex admins with many resources need to organize their pages in a tree structure, and provide navigation widgets to help their users find their way in that structure. `ra-navigation` offers specialized React components to implement a **breadcrumb**, **menu hierarchies**, and **sliding menu panels**, together with hooks to handle the user location.

<video controls autoplay playsinline muted loop>
  <source src="./assets/ra-multilevelmenu-categories.webm" type="video/webm"/>
  <source src="./assets/ra-multilevelmenu-categories.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

Test it live in [the Enterprise Edition Storybook](https://react-admin.github.io/ra-enterprise/?path=/story/ra-navigation-iconmenu--basic) and [the e-commerce demo](https://marmelab.com/ra-enterprise-demo/#/tours/ra-navigation).

## Installation

```sh
npm install --save @react-admin/ra-navigation
# or
yarn add @react-admin/ra-navigation
```

**Tip**: `ra-navigation` is part of the [React-Admin Enterprise Edition](https://marmelab.com/ra-enterprise/), and hosted in a private npm registry. You need to subscribe to one of the Enterprise Edition plans to access this package.

## Concepts

`ra-navigation` introduces the concept of **application location** (`AppLocation`) which is distinct from the **browser location**. This distinction is important as it allows displaying a navigation UI independent of the routes (e.g. having multiple resources under the same section, like "Catalog / Products" and "Catalog / Categories", or having sub-resources, like "Customers / John Doe / Orders / R34T").

Each page in a react-admin application can [define its app location](#usedefineapplocation) as a string via a custom hook. `ra-navigation` stores this string in a React context. UI components use that context to display navigation information and controls (menu, breadcrumb, or your custom components) in a consistent way. Pages can also provide data related to the location, such as the current record for example.

By default, standard react-admin views such as List, Edit, Create, and Show define their app location as follows:

-   List: `[resource].list`
-   Create: `[resource].create`
-   Edit: `[resource].edit`. It will also provide the current `record`
-   Show: `[resource].show`. It will also provide the current `record`

Developers can customize these defaults. For instance, a Categories List page can [define its location](#usedefineapplocation) as `'catalog.categories.list'` (instead of the default `'categories.list'`), i.e. as a child of the Catalog location in the app tree structure. That way, when users visit the Categories List Page, they see a [`<Breadcrumb>`](#breadcrumb) looking like the following:

```txt
Dashboard > Catalog > Categories
```

And they should see a [`<MultiLevelMenu>`](#multilevelmenu) looking like the following:

```txt
> Dashboard
> Catalog
   > Categories
   > Products
```

## Usage

### Setting Up The `<AppLocationContext>`

To expose the app location to all react-admin components, wrap the `<Layout>` component inside an `<AppLocationContext>`:

```tsx
import { AppLocationContext } from '@react-admin/ra-navigation';
import { Admin, Resource, Layout } from 'react-admin';

const MyLayout = props => (
    <AppLocationContext>
        <Layout {...props} />
    </AppLocationContext>
);

const App = () => (
    <Admin dataProvider={dataProvider} layout={MyLayout}>
        <Resource name="posts" list={PostList} />
    </Admin>
);
```

You can now either leverage the provided components such as the [`<Breadcrumb>`](#breadcrumb) or [`<MultiLevelMenu>`](#multilevelmenu), or build your own.

### Adding a Breadcrumb Path to Every Page

![A breadcrumb](./assets/breadcrumb.png)

The `<Breadcrumb>` component renders a breadcrumb path. It must be a descendent of `<AppLocationContext>`, as it reads the app location from it.

To add a breadcrumb path to every page, add a `<Breadcrumb>` component in the layout:

```tsx
import { AppLocationContext, Breadcrumb } from '@react-admin/ra-navigation';
import {
    Admin,
    Resource,
    Layout,
    ListGuesser,
    EditGuesser,
    ShowGuesser,
} from 'react-admin';

const MyLayout = ({ children, ...rest }) => (
    <AppLocationContext>
        <Layout {...rest}>
            <Breadcrumb />
            {children}
        </Layout>
    </AppLocationContext>
);

const App = () => (
    <Admin dataProvider={dataProvider} layout={MyLayout}>
        <Resource
            name="posts"
            list={ListGuesser}
            edit={EditGuesser}
            show={ShowGuesser}
        />
        <Resource
            name="comments"
            list={ListGuesser}
            edit={EditGuesser}
            show={ShowGuesser}
        />
        <Resource
            name="users"
            list={ListGuesser}
            edit={EditGuesser}
            show={ShowGuesser}
        />
    </Admin>
);
```

If you don't provide children to `<Breadcrumb />`, it will create a `<Breadcrumb.Item>` for each route of each resource declared under your `<Admin />`. It's basically the same as providing [`<Breadcrumb.ResourceItems>`](#breadcrumbresourceitems) as children.

Hence, in the previous example, the `<Breadcrumb>` component will automatically add breadcrumb items for `posts`, `comments`, and `users` resources. It will for instance display:

-   "Posts" on Post List
-   "Comments" on Comment List
-   "Posts / #1" on Post Show with id = 1
-   "Posts / #1" on Post Edit with id = 1
-   "Posts / Create" on Post Create

**Tip:** If you have set a [recordRepresentation](https://marmelab.com/react-admin/Resource.html#recordrepresentation) on the resources, it will be used to display the breadcrumb path automatically.

You can also choose to customize the breadcrumb path for all (or only specific) pages of your app.

It's the responsibility of its children (`<Breadcrumb.Item>` elements) to render the breadcrumb path according to the app location, a bit like `<Route>` components render their children when they match the current browser location.

For instance, here is a custom breadcrumb component capable of rendering the breadcrumb path for two different resources, with custom labels:

```tsx
import { AppLocationContext, Breadcrumb } from '@react-admin/ra-navigation';

const MyBreadcrumb = () => (
    <Breadcrumb>
        <Breadcrumb.Item name="posts" label="Posts" to="/posts">
            <Breadcrumb.Item
                name="edit"
                label={({ record }) => `Edit #${record.id}`}
                to={({ record }) => `/posts/${record.id}`}
            />
            <Breadcrumb.Item
                name="show"
                label={({ record }) => `Show #${record.id}`}
                to={({ record }) => `/posts/${record.id}/show`}
            />
            <Breadcrumb.Item name="create" label="Create" to="/posts/create" />
        </Breadcrumb.Item>
        <Breadcrumb.Item name="comments" label="Comments" to="/comments">
            <Breadcrumb.Item
                name="edit"
                label={({ record }) => `Edit #${record.id}`}
                to={({ record }) => `/comments/${record.id}`}
            />
            <Breadcrumb.Item
                name="show"
                label={({ record }) => `Show #${record.id}`}
                to={({ record }) => `/comments/${record.id}/show`}
            />
            <Breadcrumb.Item
                name="create"
                label="Create"
                to="/comments/create"
            />
        </Breadcrumb.Item>
    </Breadcrumb>
);

const MyLayout = ({ children, ...rest }) => (
    <AppLocationContext>
        <Layout {...rest}>
            <MyBreadcrumb />
            {children}
        </Layout>
    </AppLocationContext>
);
```

It will display respectively:

-   "Posts" on Post List
-   "Posts / Show #1" on Post Show with id = 1
-   "Posts / Edit #1" on Post Edit with id = 1
-   "Posts / Create" on Post Create

**Tip:** The `ra-enterprise` package exports an alternative `<Layout>`, which contains a pre-configured `<Breadcrumb>` that renders breadcrumb paths for all resources.

### Setting the Dashboard Page as the Root Item

If the app has a home page, you can automatically set the root of the Breadcrumb to this page in three possible ways:

1. By passing the `hasDashboard` prop to the `<AppLocationContext>`

```tsx
const MyLayout = props => (
    <AppLocationContext hasDashboard>
        <Layout {...props} />
    </AppLocationContext>
);
```

2. By passing the `dashboard` prop to the `<Breadcrumb>` component:

```tsx
const MyBreadcrumb = () => <Breadcrumb dashboard={dashboard} />;
```

3. By passing a `hasDashboard` prop to the `<Breadcrumb>` component:

```tsx
const MyBreadcrumb = () => <Breadcrumb hasDashboard />;
```

By doing this, the breadcrumb will now show respectively:

-   "Dashboard / Posts" on Post List
-   "Dashboard / Posts / #1" on Post Show with id = 1
-   "Dashboard / Posts / #1" on Post Edit with id = 1
-   "Dashboard / Posts / Create" on Post Create

### Adding Custom Breadcrumb Items

It's also possible to define a breadcrumb path manually, by adding `<Breadcrumb.Item>` children to `<Breadcrumb>`. This allows custom routes to have their own breadcrumb path, too.

```tsx
import React from 'react';
import { AppLocationContext, Breadcrumb } from '@react-admin/ra-navigation';
import { Admin, Resource, Layout, List } from 'react-admin';
import { Route } from 'react-router-dom';

const UserPreferences = () => {
    useDefineAppLocation('myhome.user.preferences');
    return <span>My Preferences</span>;
};

const routes = [
    <Route exact path="/user/preferences" component={UserPreferences} />,
];

const MyBreadcrumb = () => (
    <Breadcrumb>
        <Breadcrumb.ResourceItems />
        <Breadcrumb.Item name="myhome" label="Home">
            <Breadcrumb.Item name="user" label="User">
                <Breadcrumb.Item name="preferences" label="Preferences" />
                {/* // It also supports translation keys */}
                <Breadcrumb.Item
                    name="preferences"
                    label="myapp.breadcrumb.preferences"
                />
            </Breadcrumb.Item>
        </Breadcrumb.Item>
    </Breadcrumb>
);

const MyLayout = ({ children, ...rest }) => (
    <AppLocationContext hasDashboard={!!props.dashboard}>
        <Layout {...rest}>
            <MyBreadcrumb />
            {children}
        </Layout>
    </AppLocationContext>
);

const App = () => (
    <Admin dataProvider={dataProvider} customRoutes={routes} layout={MyLayout}>
        <Resource name="posts" list={PostList} />
    </Admin>
);
```

The displayed path on the custom page rendered at "/user/preferences" will be "Home / User / Preferences".

**Tip:**: We used `myhome` in this example and not `home` because it is a reserved word used for the Dashboard page when it exists.

### Overriding the Resource Breadcrumb Items

In some cases, it's useful to override the default resource breadcrumb path, e.g. to add a custom label instead of "Show #1", "Edit #1", ...

This can be done by disabling the concerned resources in the `<Breadcrumb.ResourceItems resources>` prop, and declaring them manually.

```tsx
import React from 'react';
import { AppLocationContext, Breadcrumb } from '@react-admin/ra-navigation';
import { Admin, Resource, Layout, useCreatePath, List } from 'react-admin';

const MyBreadcrumb = ({ children, ...props }) => {
    const createPath = useCreatePath();

    return (
        <Breadcrumb>
            {/* no Breadcrumb.ResourceItem for the 'posts' resource */}
            <Breadcrumb.ResourceItems resources={['comments', 'tags']} />
            {/* we define it manually */}
            <Breadcrumb.Item name="posts" label="Posts">
                <Breadcrumb.Item
                    name="edit"
                    label={({ record }) => `Edit "${record.title}"`}
                    to={({ record }) =>
                        record &&
                        createPath({
                            type: 'edit',
                            resource: 'posts',
                            id: record.id,
                        })
                    }
                />
                <Breadcrumb.Item
                    name="show"
                    label={({ record }) => record.title}
                    to={({ record }) =>
                        record &&
                        createPath({
                            type: 'show',
                            resource: 'posts',
                            id: record.id,
                        })
                    }
                />
                <Breadcrumb.Item
                    name="create"
                    label="Create"
                    to={createPath({
                        resource: 'posts',
                        type: 'create',
                    })}
                />
            </Breadcrumb.Item>
        </Breadcrumb>
    );
};

const MyLayout = ({ children, ...rest }) => (
    <AppLocationContext hasDashboard={!!props.dashboard}>
        <Layout {...rest}>
            <MyBreadcrumb />
            {children}
        </Layout>
    </AppLocationContext>
);

const App = () => (
    <Admin dataProvider={dataProvider} layout={MyLayout}>
        <Resource name="posts" list={PostList} />
        <Resource name="comments" list={CommentList} />
        <Resource name="tags" list={TagList} />
    </Admin>
);
```

### Grouping Menus Into Submenus

![MultiLevelMenu](./assets/multilevelmenu.png)

When a React-admin application grows significantly, the default menu might not be the best solution. The `<MultiLevelMenu>` can help unclutter the navigation: it renders a menu with an infinite number of levels and sub-menus. Menu Items that are not at the top level are rendered inside a collapsible panel.

<video controls autoplay playsinline muted loop>
  <source src="./assets/ra-multilevelmenu-item.webm" type="video/webm"/>
  <source src="./assets/ra-multilevelmenu-item.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

The `<MultiLevelMenu>` accepts `<MultiLevelMenu.Item>` components as its children. They are very similar to the default `<MenuItemLink>` from react-admin, except that they accept other `<MultiLevelMenu.Item>` as their children. To use it, the layout of the app must be inside a `<AppLocationContext>`.

The `<MultiLevelMenu.Item>` component accepts a `name`, a `label`, and an optional `icon` prop.

```tsx
import { Admin, Layout, Resource } from 'react-admin';
import { AppLocationContext, MultiLevelMenu } from '@react-admin/ra-navigation';
import { Dashboard } from './Dashboard';
import { dataProvider } from './dataProvider';
import { SongList } from './songs';
import { ArtistList } from './artists';

const MyMenu = () => (
    <MultiLevelMenu>
        <MultiLevelMenu.Item name="dashboard" to="/" exact label="Dashboard" />
        <MultiLevelMenu.Item name="songs" to="/songs" label="Songs" />
        {/* The empty filter is required to avoid falling back to the previously set filter */}
        <MultiLevelMenu.Item
            name="artists"
            to={'/artists?filter={}'}
            label="Artists"
        >
            <MultiLevelMenu.Item
                name="artists.rock"
                to={'/artists?filter={"type":"Rock"}'}
                label="Rock"
            >
                <MultiLevelMenu.Item
                    name="artists.rock.pop"
                    to={'/artists?filter={"type":"Pop Rock"}'}
                    label="Pop Rock"
                />
                <MultiLevelMenu.Item
                    name="artists.rock.folk"
                    to={'/artists?filter={"type":"Folk Rock"}'}
                    label="Folk Rock"
                />
            </MultiLevelMenu.Item>
            <MultiLevelMenu.Item
                name="artists.jazz"
                to={'/artists?filter={"type":"Jazz"}'}
                label="Jazz"
            >
                <MultiLevelMenu.Item
                    name="artists.jazz.rb"
                    to={'/artists?filter={"type":"RB"}'}
                    label="R&B"
                />
            </MultiLevelMenu.Item>
        </MultiLevelMenu.Item>
    </MultiLevelMenu>
);

const MyLayout = props => (
    <AppLocationContext>
        <Layout {...props} menu={MyMenu} />
    </AppLocationContext>
);

export const Basic = () => (
    <Admin dashboard={Dashboard} dataProvider={dataProvider} layout={MyLayout}>
        <Resource name="songs" list={SongList} />
        <Resource name="artists" list={ArtistList} />
    </Admin>
);
```

### Using a Mega Menu

<video controls autoplay playsinline muted loop>
  <source src="./assets/ra-multilevelmenu-categories.webm" type="video/webm"/>
  <source src="./assets/ra-multilevelmenu-categories.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

Sometimes, even menus with sub-menus are not enough to organize the navigation. `ra-navigation` offers an alternative UI for that case: a vertical bar with small items, where the menu label renders underneath the icon. Clicking on any of those items opens a panel containing as many navigation links as you like, laid out as you wish.

To create a menu with that UI, use the `<IconMenu>` component. As children, use `<IconMenu.Item>` elements to define the icon, label, and target of the element. To define the content of the panel, add children to the `<IconMenu.Item>` element.

```tsx
import { Admin, Layout, Resource } from 'react-admin';
import {
    AppLocationContext,
    MenuItemList,
    MenuItemNode,
    IconMenu,
    theme,
} from '@react-admin/ra-navigation';

import { Dashboard } from './Dashboard';
import { dataProvider } from './dataProvider';
import { SongList } from './songs';
import { ArtistList } from './artists';

const MyMenu = () => (
    <IconMenu variant="categories">
        <IconMenu.Item
            name="dashboard"
            to="/"
            exact
            label="Dashboard"
            icon={<DashboardIcon />}
        />
        <IconMenu.Item
            name="songs"
            icon={<MusicIcon />}
            to="/songs"
            label="Songs"
        />
        {/* The empty filter is required to avoid falling back to the previously set filter */}
        <IconMenu.Item
            name="artists"
            to={'/artists?filter={}'}
            label="Artists"
            icon={<PeopleIcon />}
        >
            <CardContent>
                {/* to get consistent spacing */}
                <Typography variant="h3" gutterBottom>
                    Artist Categories
                </Typography>
                {/* Note that we must wrap our MenuItemNode components in a MenuItemList */}
                <MenuItemList>
                    <MenuItemNode
                        name="artists.rock"
                        to={'/artists?filter={"type":"rock"}'}
                        label="Rock"
                    />
                    <MenuItemNode
                        name="artists.jazz"
                        to={'/artists?filter={"type":"jazz"}'}
                        label="Jazz"
                    />
                    <MenuItemNode
                        name="artists.classical"
                        to={'/artists?filter={"type":"classical"}'}
                        label="Rock"
                    />
                </MenuItemList>
            </CardContent>
        </IconMenu.Item>
        <IconMenu.Item
            name="configuration"
            to="/"
            exact
            label="Configuration"
            icon={<SettingsIcon />}
            sx={{ marginTop: 'auto' }}
        />
    </IconMenu>
);

const MyLayout = props => (
    <AppLocationContext>
        <Layout {...props} menu={MyMenu} />
    </AppLocationContext>
);

export const MyApp = () => (
    <Admin
        dataProvider={dataProvider}
        layout={MyLayout}
        dashboard={Dashboard}
        /* Apply the theme provided by ra-navigation */
        theme={theme}
    >
        <Resource name="songs" list={SongList} />
        <Resource name="artists" list={ArtistList} />
    </Admin>
);
```

In order to adjust the size of the React-Admin `<Sidebar>` component according to the categories, you should either apply the `theme` provided by the `@react-admin/ra-navigation` package (as above), or merge it in your own custom theme.

```tsx
import merge from 'lodash/merge';
import { defaultTheme } from 'react-admin';
import { ThemeOptions } from '@react-admin/ra-navigation';

export const theme: ThemeOptions = merge({}, defaultTheme, {
    sidebar: {
        width: 96,
        closedWidth: 48,
    },
    overrides: {
        RaSidebar: {
            fixed: {
                zIndex: 1200,
            },
        },
    },
});
```

**Tip**: With `<IconMenu />`, labels may disappear when the sidebar is in reduced mode. This is because of the internal workings of react-admin. That's why we recommend implementing your own `<AppBar />`, and hiding the Hamburger Button. `<IconMenu />` is thin enough not to interfere with the navigation anyway.

## `<AppLocationContext>`

To define or retrieve the current App Location, your React components must be located inside an `<AppLocationContext>`. This component creates a React context dedicated to the App Location. It must be contained in the `<Admin>` component (in order to read the registered resources), but it must also wrap up all the UI components (that may require access to the app location). So the best place to put it is as a wrapper to the Layout.

```tsx
import { AppLocationContext } from '@react-admin/ra-navigation';
import { Admin, Resource, Layout } from 'react-admin';

const MyLayout = props => (
    <AppLocationContext>
        <Layout {...props} />
    </AppLocationContext>
);

const App = () => (
    <Admin dataProvider={dataProvider} layout={MyLayout}>
        <Resource name="posts" list={PostList} />
    </Admin>
);
```

## `useDefineAppLocation`

Use `useDefineAppLocation` to set the app location from a page component.

In the following example, the `<SongEditForArtist>` component is a [nested resource](https://marmelab.com/react-admin/Resource.html#nested-resources) rendering at the `/artists/:id/songs/:songId` path. It uses `useDefineAppLocation` to define the app location as `artists.edit.songs.edit`, and passes the `record` and `song` objects as parameters to let the breadcrumb component render the record and song names.

```tsx
import { useParams } from 'react-router-dom';
import { Edit, SimpleForm, TextInput, DateInput, useGetOne } from 'react-admin';
import { useDefineAppLocation } from '@react-admin/ra-navigation';

const SongEditForArtist = () => {
    const { id, songId } = useParams<{ id: string; songId: string }>();
    const { data: record } = useGetOne('artists', { id });
    const { data: song } = useGetOne('songs', { id: songId });
    useDefineAppLocation('artists.edit.songs.edit', { record, song });
    return (
        <Edit resource="songs" id={songId} redirect={`/artists/${id}/songs`}>
            <SimpleForm>
                <TextInput source="title" />
                <DateInput source="released" />
                <TextInput source="writer" />
                <TextInput source="producer" />
                <TextInput source="recordCompany" label="Label" />
            </SimpleForm>
        </Edit>
    );
};
```

**Tip**: The `<Edit>` component will call `dataProvider.getOne("songs", { id: songId })` to fetch the song record. Since the `<SongEditForArtist>` component makes the same request, React-admin will deduplicate the calls and only make one request to the dataProvider.

**Tip**: If you don't call `useDefineAppLocation` anywhere on a page, the AppLocationContext will deduce a resource app location from the current URL path (e.g. `artists.edit` for the `/artists/:id` path).

Here is how a custom Breadcrumb would use location `values` to render the record and song names:

```tsx
const MyBreadcrumb = () => (
    <Breadcrumb>
        <Breadcrumb.Item name="artists" label="Artists" to="/artists">
            <Breadcrumb.Item
                name="edit"
                label={({ record }: { record?: Artist }) => record?.name}
                to={({ record }: { record?: Artist }) =>
                    `/artists/${record?.id}`
                }
            >
                <Breadcrumb.Item
                    name="songs"
                    label="Songs"
                    to={({ record }: { record?: Artist }) =>
                        `/artists/${record?.id}/songs`
                    }
                >
                    <Breadcrumb.Item
                        name="edit"
                        label={({ song }: { song?: Song }) => song?.title}
                        to={({ song }: { song?: Song }) =>
                            `/artists/${song?.artist_id}/songs/${song?.id}`
                        }
                    />
                </Breadcrumb.Item>
            </Breadcrumb.Item>
            <Breadcrumb.Item
                name="create"
                label="Create"
                to="/artists/create"
            />
        </Breadcrumb.Item>
    </Breadcrumb>
);
```

<video controls autoplay playsinline muted loop>
  <source src="./assets/breadcumb-nested-resource.webm" type="video/webm"/>
  <source src="./assets/breadcumb-nested-resource.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

## `useAppLocationState`

The `useAppLocationState` hook lets you read and write the current App Location. It's a low-level hook that you should use only when:

-   You build a custom navigation component that needs to read the current app location
-   You need to set the current app location in reaction to a user action (e.g. a click on a menu item).

For any other use case, use `useDefineAppLocation` instead.

Its API is similar to that of the `React.useState()` hook:

```tsx
const [location, setLocation] = useAppLocationState();
```

Here is how to **read the current app location**:

```tsx
import { useAppLocationState } from '@react-admin/ra-navigation';

const MySubComponent = props => {
    const [location] = useAppLocationState();

    return <span>{`Hey! You're on the ${location.path} location!`}</span>;
};
```

To **define the current app location**:

```tsx
const DensityTab = () => {
    const [_, setLocation] = useAppLocationState();

    useEffect(() => {
        setLocation('experiences.parameters.density');
        return () => setLocation();
    }, []);

    // return (/* ... */);
};
```

Notice that the `useEffect` callback must return a function that resets the app location. This is necessary to let the `AppLocationContext` deduce the location from the current URL path for pages with no location.

You can also pass a context object as the second argument to `setLocation`. This can be useful e.g to display the label of the current resource in a breadcrumb path.

```tsx
const DensityTab = ({ density }) => {
    const [_, setLocation] = useAppLocationState();

    useEffect(() => {
        setLocation('experiences.parameters.density', { density });
        return () => setLocation();
    }, [density]);

    // return (/* ... */);
};
```

The values passed as second parameter of `setLocation` are available in `location.values`:

```tsx
const Breadcrumb = () => {
    const [location] = useAppLocationState();
    // location = { path: 'experiences.parameters.density', values: { density: 0.1 } }

    // return (/* ... */);
};
```

**Warning:** The `dashboard` location is a reserved word used for the Dashboard page when it exists.

## `useAppLocationMatcher`

The `useAppLocationMatcher` hook returns a function that checks if the path that is passed as an argument matches the current location path.

If the path matches, the match function returns the current location. If not, it returns `null`. This can be useful to build custom breadcrumb components.

```tsx
import { useAppLocationMatcher } from '@react-admin/ra-navigation';

function PostBreadcrumbItem() {
    const matcher = useAppLocationMatcher();
    const match = matcher('post.edit');
    if (!match) return null;
    return <>Post "{match.record.title}"</>;
}
```

## `<Breadcrumb>`

A component displaying a breadcrumb based on the current AppLocation.

![A breadcrumb](./assets/breadcrumb.png)

Add the breadcrumb component directly to your custom layout or through the extended `<Layout>` available in the [ra-enterprise](https://marmelab.com/ra-enterprise/modules/ra-enterprise#layout) module using its `breadcrumb` property.

Accepts the following props:

-   `children`: Optional. A list of `<Breadcrumb.Item>`, `<Breadcrumb.ResourceItem>` and/or `<Breadcrumb.ResourceItems>` components. `<Breadcrumb.ResourceItems>` is used by default.
-   `className`: Optional. The class name to apply to its root element
-   `separator`: Optional. A custom separator to put inside the items. Either a string or a function returning a string.
-   `dashboard`: Optional. The component you might have specified on the `<Admin>` component. Used to determine whether a dashboard is present. If it is, the dashboard item will be added to the breadcrumb on every page.
-   `hasDashboard`: Optional. A boolean indicating whether a dashboard is present. If it is, the dashboard item will be added to the breadcrumb on every page.

```tsx
import { useCreatePath } from 'react-admin';
import { Breadcrumb } from '@react-admin/ra-navigation';

// default breadcrumb based on resources, using the dashboard as the root
const MyBreadcrumb = ({ children, dashboard, ...props }) => (
    <Breadcrumb dashboard={dashboard} />
);

// custom breadcrumb
const MyCustomBreadcrumb = ({ children, ...props }) => {
    const createPath = useCreatePath();

    return (
        <Breadcrumb>
            <Breadcrumb.ResourceItems resources={['otherResources']} />
            <Breadcrumb.Item name="posts" label="Posts">
                <Breadcrumb.Item
                    name="edit"
                    label={({ record }) => `Edit "${record.title}"`}
                    to={({ record }) =>
                        record &&
                        createPath({
                            type: 'edit',
                            resource: 'songs',
                            id: record.id,
                        })
                    }
                />
                <Breadcrumb.Item
                    name="show"
                    label={({ record }) => record.title}
                    to={({ record }) =>
                        record &&
                        createPath({
                            type: 'show',
                            resource: 'songs',
                            id: record.id,
                        })
                    }
                />
                <Breadcrumb.Item name="list" label="My Post List" />
                <Breadcrumb.Item name="create" label="Let's write a Post!" />
            </Breadcrumb.Item>
        </Breadcrumb>
    );
};
```

### `<Breadcrumb.Item>`

A component displaying a single breadcrumb item if the app location matches its name.

![A breadcrumb item](./assets/breadcrumbItem.png)

Accepts the following props:

-   `name`: Required. Will be used to infer its full path.
-   `label`: Required. The label to display for this item. It accepts translation keys.
-   `path`: Internal prop used to build the item full path.
-   `to`: Optional. The react-router path to redirect to.

```tsx
import { useCreatePath } from 'react-admin';
import { Breadcrumb } from '@react-admin/ra-navigation';

// custom breadcrumb
const MyBreadcrumb = ({ children, ...props }) => {
    const createPath = useCreatePath();

    return (
        <Breadcrumb>
            <Breadcrumb.ResourceItems resources={['otherResources']} />
            <Breadcrumb.Item name="posts" label="Posts">
                <Breadcrumb.Item
                    name="edit"
                    label={({ record }) => `Edit "${record.title}"`}
                    to={({ record }) =>
                        record &&
                        createPath({
                            type: 'edit',
                            resource: 'songs',
                            id: record.id,
                        })
                    }
                />
                <Breadcrumb.Item
                    name="show"
                    label={({ record }) => record.title}
                    to={({ record }) =>
                        record &&
                        createPath({
                            type: 'show',
                            resource: 'songs',
                            id: record.id,
                        })
                    }
                />
                <Breadcrumb.Item name="list" label="My Post List" />
                <Breadcrumb.Item name="create" label="Let's write a Post!" />
            </Breadcrumb.Item>
        </Breadcrumb>
    );
};
```

### `<Breadcrumb.DashboardItem>`

A version of the `<Breadcrumb.Item>` dedicated to the dashboard.

Accepts the following props:

-   `name`: Optional. Will be used to infer its full path.
-   `label`: Optional. The label to display for this item. It accepts translation keys.
-   `path`: Internal prop used to build the item full path.
-   `to`: Optional. The react-router path to redirect to.

### `<Breadcrumb.ResourceItem>`

A component that renders `<Breadcumb.Item>` elements for List, Edit, Show, and Create views for a single resource.

Accepts the following props:

-   `resource`: Required. The resource for which to infer the breadcrumb items.

In the following example:

```tsx
import { Breadcrumb } from '@react-admin/ra-navigation';

const MyBreadcrumb = () => (
    <Breadcrumb>
        <Breadcrumb.ResourceItem resource="posts" />
    </Breadcrumb>
);
```

`<MyBreadcrumb>` will create all `<Breadcumb.Item>` elements required to display respectively:

-   `Posts` on Post List
-   `Posts / #1` on Post Show with id = 1
-   `Posts / #1` on Post Edit with id = 1
-   `Posts / Create` on Post Create

As you can see, by default, the records are displayed using their id (e.g. `Posts / #1`).

However, if you have set a [recordRepresentation](https://marmelab.com/react-admin/Resource.html#recordrepresentation) on the resource, the records will be displayed using this representation instead.

Let's consider the following example:

```tsx
import { AppLocationContext, Breadcrumb } from '@react-admin/ra-navigation';
import { Admin, Resource, Layout, ListGuesser, ShowGuesser } from 'react-admin';

const MyBreadcrumb = () => (
    <Breadcrumb>
        <Breadcrumb.ResourceItem resource="songs" />
    </Breadcrumb>
);

const MyLayout = ({ children, ...rest }) => (
    <AppLocationContext>
        <Layout {...rest}>
            <MyBreadcrumb />
            {children}
        </Layout>
    </AppLocationContext>
);

const App = () => (
    <Admin dataProvider={dataProvider} layout={MyLayout}>
        <Resource
            name="songs"
            list={ListGuesser}
            show={ShowGuesser}
            recordRepresentation="title"
        />
    </Admin>
);
```

In this example, when browsing the `/songs/1/show` page, the breadcrumb will display `Songs / Like a Rolling Stone`, provided song #1 has the title "Like a Rolling Stone".

**Tip:** If you need more fine-grained control over the labels, you can [override the Resource Breadcrumb items](#overriding-the-resource-breadcrumb-items).

### `<Breadcrumb.ResourceItems>`

A component that renders [`<Breadcrumb.ResourceItem>`](#breadcrumbresourceitem) elements for every registered resource.

```tsx
import { Breadcrumb } from '@react-admin/ra-navigation';

const MyBreadcrumb = () => (
    <Breadcrumb>
        <Breadcrumb.ResourceItems />
    </Breadcrumb>
);
```

`<Breadcrumb.ResourceItems>` accepts the following props:

-   `resources`: Optional. The resources for which to infer the breadcrumb items. You don't need to specify this prop if you want all resources to be handled.

For instance, if you only need a breadcrumb for the `comments` and `tags` resources, in an app also declaring a `posts` resource, you can write:

```tsx
import { Breadcrumb } from '@react-admin/ra-navigation';

const MyBreadcrumb = () => (
    <Breadcrumb>
        {/* no Breadcrumb.ResourceItem for the 'posts' resource */}
        <Breadcrumb.ResourceItems resources={['comments', 'tags']} />
    </Breadcrumb>
);
```

The example above is equivalent to:

```tsx
import { Breadcrumb } from '@react-admin/ra-navigation';

const MyBreadcrumb = () => (
    <Breadcrumb>
        <Breadcrumb.ResourceItem resource="comments" />
        <Breadcrumb.ResourceItem resource="tags" />
    </Breadcrumb>
);
```

**Tip:** [`<Breadcrumb.ResourceItem>`](#breadcrumbresourceitem) supports [recordRepresentation](https://marmelab.com/react-admin/Resource.html#recordrepresentation), which is a convenient way to display the record name instead of its id.

**Tip:** If you need more fine-grained control over the labels, you can [override the Resource Breadcrumb items](#overriding-the-resource-breadcrumb-items).

## `<MultiLevelMenu>`

A menu to use instead of the default react-admin menu, which supports multi-level items. Users can show/hide child menu items like a classic collapsible menu.

![MultiLevelMenu](./assets/multilevelmenu.png)

The `<MultiLevelMenu>` accepts the following props:

-   `initialOpen`: Whether the menu items with sub menus should be open initially. Has no effect if using the `categories` variant. Defaults to `false`.

-   `openItemList`: Optional. List of names of menu items that should be opened by default. If the menu item to be opened is nested, you have to fill in the name of all the parent items. Ex: `['artists', 'artists.rock', 'artists.rock.pop']`

```tsx
import { MultiLevelMenu } from '@react-admin/ra-navigation';

import { Dashboard } from './Dashboard';
import { dataProvider } from './dataProvider';
import { SongList } from './songs';
import { ArtistList } from './artists';

const MyMenu = () => (
    <MultiLevelMenu>
        <MultiLevelMenu.Item name="dashboard" to="/" exact label="Dashboard" />
        <MultiLevelMenu.Item name="songs" to="/songs" label="Songs" />
        {/* The empty filter is required to avoid falling back to the previously set filter */}
        <MultiLevelMenu.Item
            name="artists"
            to={'/artists?filter={}'}
            label="Artists"
        >
            <MultiLevelMenu.Item
                name="artists.rock"
                to={'/artists?filter={"type":"Rock"}'}
                label="Rock"
            >
                <MultiLevelMenu.Item
                    name="artists.rock.pop"
                    to={'/artists?filter={"type":"Pop Rock"}'}
                    label="Pop Rock"
                />
                <MultiLevelMenu.Item
                    name="artists.rock.folk"
                    to={'/artists?filter={"type":"Folk Rock"}'}
                    label="Folk Rock"
                />
            </MultiLevelMenu.Item>
            <MultiLevelMenu.Item
                name="artists.jazz"
                to={'/artists?filter={"type":"Jazz"}'}
                label="Jazz"
            >
                <MultiLevelMenu.Item
                    name="artists.jazz.rb"
                    to={'/artists?filter={"type":"RB"}'}
                    label="R&B"
                />
            </MultiLevelMenu.Item>
        </MultiLevelMenu.Item>
    </MultiLevelMenu>
);
```

In addition to the props of react-router [`<NavLink>`](https://reactrouter.com/web/api/NavLink) and those of material-ui [`<ListItem>`](https://material-ui.com/api/list-item/), `<MultiLevelMenu.Item>` accepts the following props:

-   `icon`: Optional. An icon element to display in front of the item
-   `name`: Required: The name of the item. Used to manage its open/closed state.
-   `label`: Optional. The label to display for this item. Accepts translation keys.

**Tip:** You can omit the `to` property for `<MultiLevelMenu.Item>` elements that have a child menu item.

## `<IconMenu>`

An alternative menu component rendering a reduced menu bar with a sliding panel for second-level menu items. This menu UI saves a lot of screen real estate and allows for sub-menus of any level of complexity.

<video controls autoplay playsinline muted loop>
  <source src="./assets/ra-multilevelmenu-categories.webm" type="video/webm"/>
  <source src="./assets/ra-multilevelmenu-categories.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

```tsx
import { Admin, Layout, Resource } from 'react-admin';
import {
    AppLocationContext,
    IconMenu,
    MenuItemList,
    MenuItemNode,
    theme,
} from '@react-admin/ra-navigation';

import { Dashboard } from './Dashboard';
import { dataProvider } from './dataProvider';
import { SongList } from './songs';
import { ArtistList } from './artists';

const MyMenu = () => (
    <IconMenu>
        <IconMenu.Item
            name="dashboard"
            to="/"
            exact
            label="Dashboard"
            icon={<DashboardIcon />}
        />
        <IconMenu.Item
            name="songs"
            icon={<MusicIcon />}
            to="/songs"
            label="Songs"
        />
        <IconMenu.Item
            name="artists"
            to={'/artists?filter={}'}
            label="Artists"
            icon={<PeopleIcon />}
        >
            <CardContent>
                {/* to get consistent spacing */}
                <Typography variant="h3" gutterBottom>
                    Artist Categories
                </Typography>
                {/* Note that we must wrap our MenuItemNode components in a MenuItemList */}
                <MenuItemList>
                    <MenuItemNode
                        name="artists.rock"
                        to={'/artists?filter={"type":"rock"}'}
                        label="Rock"
                    />
                    <MenuItemNode
                        name="artists.jazz"
                        to={'/artists?filter={"type":"jazz"}'}
                        label="Jazz"
                    />
                    <MenuItemNode
                        name="artists.classical"
                        to={'/artists?filter={"type":"classical"}'}
                        label="Rock"
                    />
                </MenuItemList>
            </CardContent>
        </IconMenu.Item>
        <IconMenu.Item
            name="configuration"
            to="/"
            exact
            label="Configuration"
            icon={<SettingsIcon />}
            sx={{ marginTop: 'auto' }}
        />
    </IconMenu>
);

const MyLayout = props => (
    <AppLocationContext>
        <Layout {...props} menu={MyMenu} />
    </AppLocationContext>
);

export const MyApp = () => (
    <Admin
        dataProvider={dataProvider}
        layout={MyLayout}
        dashboard={Dashboard}
        /* Apply the theme provided by ra-navigation */
        theme={theme}
    >
        <Resource name="songs" list={SongList} />
        <Resource name="artists" list={ArtistList} />
    </Admin>
);
```

In addition to the props of react-router [`<NavLink>`](https://reactrouter.com/web/api/NavLink) and those of material-ui [`<ListItem>`](https://material-ui.com/api/list-item/), `<IconMenu.Item>` accepts the following props:

-   `icon`: Optional. An icon element to display in front of the item
-   `name`: Required: The name of the item. Used to manage its open/closed state.
-   `label`: Optional. The label to display for this item. Accepts translation keys.

### `<IconMenuResources>`

A `<IconMenu>` configured to render one menu item per resource, plus an item for the dashboard if it is present.

This component doesn't need any configuration as it reads the resources from the `<Admin>` context.

```jsx
import { Layout } from 'react-admin';
import {
    IconMenuResources,
    AppLocationContext,
} from '@react-admin/ra-navigation';

export const MyLayout = props => (
    <AppLocationContext>
        <Layout {...props} menu={IconMenuResources} />
    </AppLocationContext>
);
```

### `<MenuItemNode>`

This menu item component is the same as `<MultiLevelMenu.Item>`. When used in standalone, it must be a child of a `<MenuItemList>` component. It can have other `<MenuItemNode>` children.

```jsx
import { MenuItemList, MenuItemNode } from '@react-admin/ra-navigation';
import { CardContent, Typography } from '@mui/material';

const MenuPopover = () => (
    <CardContent>
        <Typography variant="h3" gutterBottom>
            Artist Categories
        </Typography>
        <MenuItemList>
            <MenuItemNode
                name="artists.rock"
                to={'/artists?filter={"type":"rock"}'}
                label="Rock"
            />
            <MenuItemNode
                name="artists.jazz"
                to={'/artists?filter={"type":"jazz"}'}
                label="Jazz"
            />
            <MenuItemNode
                name="artists.classical"
                to={'/artists?filter={"type":"classical"}'}
                label="Rock"
            />
        </MenuItemList>
    </CardContent>
);
```

### `<MenuItemList>`

A wrapper to display a list of `<MenuItemNode>` with proper styles (see above).

Accepts the same props as the material-ui `<List>` component. See [https://material-ui.com/api/list/](https://material-ui.com/api/list/).

## `<ContainerLayout>`

An alternative to react-admin's `<Layout>` for applications with a limited number of resources. This layout replaces the sidebar menu by an AppBar menu, and displays the content in a centered container.

![Container layout](./assets/container-layout.png)

### Usage

Set `<ContainerLayout>` as the `<Admin layout>` value:

```jsx
import { Admin, Resource } from 'react-admin';
import { ContainerLayout } from '@react-admin/ra-navigation';

export const App = () => (
    <Admin dataProvider={dataProvider} layout={ContainerLayout}>
        <Resource name="songs" list={SongList} />
        <Resource name="artists" list={ArtistList} />
    </Admin>
);
```

`<ContainerLayout>` accepts the following props:

-   `menu`: The menu component to use. Defaults to `<HorizontalMenu>`.
-   `appBar`: The component to use to render the top AppBar. Defaults to `<Header>`
-   `toolbar`: The buttons to render on the top right of the toolbar.
-   `maxWidth`: The maximum width of the content `<Container>`. Defaults to `md`.
-   `fixed`: Whether the content `<Container>` should be fixed. Defaults to false.

### `appBar`

If you want to use a different color for the AppBar, or to make it sticky, pass a custom `appBar` element based on `<Header>`, which is a simple wrapper around [MUI's `<AppBar>` component](https://mui.com/material-ui/react-app-bar/#main-content).

```jsx
import { ContainerLayout, Header } from '@react-admin/ra-navigation';

const myAppBar = <Header color="primary" position="sticky" />;
const MyLayout = props => <ContainerLayout {...props} appBar={myAppBar} />;
```

### `fixed`

If you prefer to design for a fixed set of sizes instead of trying to accommodate a fully fluid viewport, you can set the `fixed` prop. The max-width matches the min-width of the current breakpoint.

```jsx
import { ContainerLayout } from '@react-admin/ra-navigation';

const MyLayout = props => <ContainerLayout {...props} fixed />;
```

### `maxWidth`

This prop allows to set the maximum width of the content [`<Container>`](https://mui.com/material-ui/react-container/#main-content). It accepts a string, one of `xs`, `sm`, `md`, `lg`, `xl`, or `false` to remove side margins and occupy the full width of the screen.

```jsx
import { ContainerLayout } from '@react-admin/ra-navigation';

const MyLayout = props => <ContainerLayout {...props} maxWidth="md" />;
```

### `menu`

By default, `<ContainerLayout>` renders one menu item per resource in the admin. To reorder the menu, omit resources, or add custom pages, pass a custom menu element to the `menu` prop. This element should be a `<HorizontalMenu>` component with `<HorizontalMenu.Item>` children. Each child should have a `value` corresponding to the [application location](#concepts) of the target, and can have a `to` prop corresponding to the target location if different from the app location.

```jsx
import {
    Admin,
    Resource,
    CustomRoutes,
    ListGuesser,
    EditGuesser,
} from 'react-admin';
import { Route } from 'react-router-dom';
import {
    ContainerLayout,
    HorizontalMenu,
    useDefineAppLocation,
} from '@react-admin/ra-navigation';

const Menu = () => (
    <HorizontalMenu>
        <HorizontalMenu.Item label="Dashboard" to="/" value="" />
        <HorizontalMenu.Item label="Songs" to="/songs" value="songs" />
        <HorizontalMenu.Item label="Artists" to="/artists" value="artists" />
        <HorizontalMenu.Item label="Custom" to="/custom" value="custom" />
    </HorizontalMenu>
);

const MyLayout = props => <ContainerLayout {...props} menu={<Menu />} />;

const CustomPage = () => {
    useDefineAppLocation('custom');
    return <h1>Custom page</h1>;
};

const Dashboard = () => <h1>Dashboard</h1>;
const CustomPage = () => <h1>Custom page</h1>;

export const App = () => (
    <Admin dataProvider={dataProvider} layout={MyLayout} dashboard={Dashboard}>
        <Resource name="songs" list={ListGuesser} edit={EditGuesser} />
        <Resource name="artists" list={ListGuesser} edit={EditGuesser} />
        <CustomRoutes>
            <Route path="custom" element={<CustomPage />} />
        </CustomRoutes>
    </Admin>
);
```

### `sx`

The `sx` prop allows to customize the style of the layout, and the underlying component. It accepts a [MUI `sx` prop](https://mui.com/system/the-sx-prop/#main-content).

```jsx
import { ContainerLayout } from '@react-admin/ra-navigation';

const MyLayout = props => (
    <ContainerLayout
        {...props}
        sx={{
            '& .MuiToolbar-root': { padding: 0 },
        }}
    />
);
```

### `toolbar`

The `toolbar` prop allows to add buttons to the top right of the toolbar. It accepts an element.

```jsx
import { LocalesMenuButton, LoadingIndicator } from 'react-admin';
import { ContainerLayout } from '@react-admin/ra-navigation';

const toolbar = (
    <>
        <LocalesMenuButton />
        <LoadingIndicator />
    </>
);
const MyLayout = props => <ContainerLayout {...props} toolbar={toolbar} />;
```

### `userMenu`

By default, the `<ContainerLayout>` shows a user menu with a single item (logout) when the application has an `authProvider`. You can customize the user menu by passing a custom element to the `userMenu` prop.

```jsx
import { Logout, UserMenu, useUserMenu } from 'react-admin';
import { MenuList, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { ContainerLayout } from '@react-admin/ra-navigation';

const ConfigurationMenu = React.forwardRef((props, ref) => {
    const { onClose } = useUserMenu();
    return (
        <MenuItem
            ref={ref}
            {...props}
            to="/configuration"
            onClick={onClose}
            sx={{ color: 'text.secondary' }}
        >
            <ListItemIcon>
                <SettingsIcon />
            </ListItemIcon>
            <ListItemText>Configuration</ListItemText>
        </MenuItem>
    );
});

const CustomUserMenu = () => (
    <UserMenu>
        <MenuList>
            <ConfigurationMenu />
            <Logout />
        </MenuList>
    </UserMenu>
);

export const MyLayout = props => (
    <ContainerLayout {...props} userMenu={<CustomUserMenu />} />
);
```

### `<HorizontalMenu>`

A horizontal menu component, alternative to react-admin's `<Menu>`, to be used in the AppBar of the `<ContainerLayout>`.

![Container layout](./assets/container-layout.png)

#### Usage

Create a menu component based on `<HorizontalMenu>` and `<HorizontalMenu.Item>` children. Each child should have a `value` corresponding to the [application location](#concepts) of the target, and can have a `to` prop corresponding to the target location if different from the app location.

```jsx
import { HorizontalMenu } from '@react-admin/ra-navigation';

export const Menu = () => (
    <HorizontalMenu>
        <HorizontalMenu.Item label="Dashboard" to="/" value="" />
        <HorizontalMenu.Item label="Songs" to="/songs" value="songs" />
        <HorizontalMenu.Item label="Artists" to="/artists" value="artists" />
    </HorizontalMenu>
);
```

Then pass it to the `<ContainerLayout>`:

```jsx
import { Admin, Resource } from 'react-admin';
import { ContainerLayout } from '@react-admin/ra-navigation';

import { Menu } from './Menu';

const MyLayout = props => <ContainerLayout {...props} menu={<Menu />} />;

const App = () => (
    <Admin dataProvider={dataProvider} layout={MyLayout}>
        ...
    </Admin>
);
```

## `<SolarLayout>`

An alternative application layout without top bar, and using a narrow menu to maximize the usable screen real estate. The menu items can reveal a secondary panel to show sub menus, preference forms, a search engine, etc. Ideal for applications with a large number of resources.

<video controls autoplay playsinline muted loop>
  <source src="./assets/ra-solar-layout.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

On mobile, it shows the AppBar to allow opening the navigation menu:

<video controls autoplay playsinline muted loop>
  <source src="./assets/ra-solar-layout-small.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

It includes and leverages the [`AppLocationContext`](#applocationcontext)

### Usage

```tsx
import { Admin, Resource, ListGuesser } from 'react-admin';
import { SolarLayout } from '@react-admin/ra-navigation';

export const App = () => (
    <Admin dataProvider={dataProvider} layout={SolarLayout}>
        <Resource name="songs" list={ListGuesser} />
        <Resource name="artists" list={ListGuesser} />
    </Admin>
);
```

By default, `<SolarLayout>` creates a menu based on the `<Resource>` components passed to `<Admin>`. You can customize the menu by passing a custom menu component to [the `menu` prop](#menu).

### Props

| Prop        | Required | Type      | Default     | Description                                                                                        |
| ----------- | -------- | --------- | ----------- | -------------------------------------------------------------------------------------------------- |
| `appBar`    | Optional | Component | SolarAppBar | Allows to customize the AppBar                                                                     |
| `className` | Optional | string    |             | A class name to apply to the AppBar container.                                                     |
| `error`     | Optional | Component |             | A React component rendered in the content area in case of error                                    |
| `logo`      | Optional | Component |             | A React component used as the dashboard icon                                                       |
| `menu`      | Optional | Component | SolarMenu   | A React component used as the sidebar menu. Pass a custom SolarMenu to leverage this layout design |
| `sx`        | Optional | `SxProps` |             | Style overrides, powered by MUI System                                                             |

### `appBar`

You can customize the AppBar that appears on Mobile by setting the `appBar` prop. For instance, here's how you could customize its colors and add some extra content to its far right:

```tsx
import { Admin, Resource, ListGuesser } from 'react-admin';
import {
    SolarAppBar,
    SolarLayoutProps,
    SolarLayout,
} from '@react-admin/ra-navigation';

const CustomAppBar = () => (
    <SolarAppBar
        sx={{ color: 'text.secondary', bgcolor: 'background.default' }}
        toolbar={
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
            >
                <Box mr={1}>Custom toolbar</Box>
                <Box mr={1}>with</Box>
                <Box mr={1}>multiple</Box>
                <Box mr={1}>elements</Box>
            </Box>
        }
    />
);

const CustomLayout = (props: SolarLayoutProps) => (
    <SolarLayout {...props} appBar={CustomAppBar} />
);

export const App = () => (
    <Admin layout={CustomLayout}>
        <Resource name="songs" list={ListGuesser} />
        <Resource name="artists" list={ListGuesser} />
    </Admin>
);
```

### `className`

`className` is passed to the root `<div>` component. It lets you style the layout with CSS - but the `sx` prop is preferred.

### `error`

Whenever a client-side error happens in react-admin, the user sees an error page. React-admin uses [React's Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary) to render this page when any component in the page throws an unrecoverable error.

If you want to customize this page, or log the error to a third-party service, create your own `<Error>` component, and pass it to a custom Layout, as follows:

```tsx
// in src/MyLayout.tsx
import { Layout } from 'react-admin';
import { MyError } from './MyError';

export const MyLayout = props => <Layout {...props} error={MyError} />;
```

The following snippet is a simplified version of the react-admin `Error` component, that you can use as a base for your own:

```tsx
// in src/MyError.tsx
import * as React from 'react';
import Button from '@mui/material/Button';
import ErrorIcon from '@mui/icons-material/Report';
import History from '@mui/icons-material/History';
import { Title, useTranslate } from 'react-admin';
import { useLocation } from 'react-router-dom';

export const MyError = ({
    error,
    resetErrorBoundary,
}: {
    error: any;
    errorInfo: any;
    resetErrorBoundary: (...args: any[]) => void;
}) => {
    const { pathname } = useLocation();
    const originalPathname = useRef(pathname);

    // Effect that resets the error state whenever the location changes
    useEffect(() => {
        if (pathname !== originalPathname.current) {
            resetErrorBoundary();
        }
    }, [pathname, resetErrorBoundary]);

    const translate = useTranslate();
    return (
        <div>
            <Title title="Error" />
            <h1>
                <ErrorIcon /> Something Went Wrong{' '}
            </h1>
            <div>
                A client error occurred and your request couldn't be completed.
            </div>
            {process.env.NODE_ENV !== 'production' && (
                <details>
                    <h2>{translate(error.toString())}</h2>
                    {errorInfo.componentStack}
                </details>
            )}
            <div>
                <Button
                    variant="contained"
                    startIcon={<History />}
                    onClick={() => history.go(-1)}
                >
                    Back
                </Button>
            </div>
        </div>
    );
};
```

**Tip:** [React's Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary) are used internally to display the Error Page whenever an error occurs. Error Boundaries only catch errors during rendering, in lifecycle methods, and in constructors of the components tree. This implies in particular that errors during event callbacks (such as 'onClick') are not concerned. Also note that the Error Boundary component is only set around the main container of React Admin. In particular, you won't see it for errors thrown by the [sidebar Menu](./Menu.md), nor the [AppBar](#customizing-the-appbar-content). This ensures the user is always able to navigate away from the Error Page.

### `logo`

You can customize the icon of the dashboard menu item of the default menu by setting the `logo` prop:

```tsx
import { Admin, Resource, ListGuesser } from 'react-admin';
import { SolarLayoutProps, SolarLayout } from '@react-admin/ra-navigation';
import { Dashboard } from './Dashboard';
import { Logo } from './Logo';

const CustomLayout = (props: SolarLayoutProps) => (
    <SolarLayout {...props} logo={<Logo />} />
);

export const WithDashboardAndCustomLogo = () => (
    <Admin dashboard={Dashboard} layout={CustomLayout}>
        <Resource name="songs" list={SongList} />
        <Resource name="artists" list={ArtistList} />
    </Admin>
);
```

### `menu`

If you need a customized menu, pass it to the `menu` prop. It's recommended to pass a customized [`<SolarMenu>`](#solarmenu) to leverage this layout. This is useful to organize many resources into categories or to provide shortcuts to filtered lists:

```tsx
import { Admin, Resource, ListGuesser } from 'react-admin';
import {
    SolarLayoutProps,
    SolarLayout,
    SolarMenu,
} from '@react-admin/ra-navigation';

export const App = () => (
    <Admin
        dashboard={Dashboard}
        dataProvider={dataProvider}
        layout={CustomLayout}
    >
        <Resource name="songs" icon={MusicNote} list={ListGuesser} />
        <Resource name="artists" icon={People} list={ListGuesser} />
    </Admin>
);

const CustomLayout = ({ children, ...props }: SolarLayoutProps) => (
    <SolarLayout {...props} menu={CustomMenu}>
        {children}
    </SolarLayout>
);

const CustomMenu = () => (
    <SolarMenu>
        <SolarMenu.Item
            label="Sales"
            subMenu={
                <SolarMenu.List>
                    <SolarMenu.ResourceItem name="orders" />
                    <SolarMenu.ResourceItem name="invoices" />
                </SolarMenu.List>
            }
        />
        <SolarMenu.Item
            label="Catalog"
            subMenu={
                <SolarMenu.List>
                    <SolarMenu.ResourceItem name="products" />
                    <SolarMenu.ResourceItem name="categories" />
                </SolarMenu.List>
            }
        />
        <SolarMenu.Item
            label="Customers"
            subMenu={
                <SolarMenu.List>
                    <SolarMenu.Item
                        name="customers.all"
                        label="All customers"
                        to={`/customers?filter=${encodeURIComponent(
                            JSON.stringify({ filter: {} })
                        )}`}
                    />
                    <SolarMenu.Item
                        name="customers.new"
                        label="New customers"
                        to={`/customers?filter=${encodeURIComponent(
                            JSON.stringify({
                                filter: {
                                    last_seen_gte:
                                        endOfYesterday().toISOString(),
                                },
                            })
                        )}`}
                    />
                </SolarMenu.List>
            }
        />
        <SolarMenu.Item
            label="Reviews"
            subMenu={
                <SolarMenu.List>
                    <SolarMenu.Item
                        name="reviews.all"
                        label="New reviews"
                        to={`/reviews?filter=${encodeURIComponent(
                            JSON.stringify({ filter: {} })
                        )}`}
                    />
                    <SolarMenu.Item
                        name="reviews.pending"
                        label="Pending reviews"
                        to={`/reviews?filter=${encodeURIComponent(
                            JSON.stringify({ filter: { status: 'pending' } })
                        )}`}
                    />
                    <SolarMenu.Item
                        name="reviews.bad"
                        label="Bad reviews"
                        to={`/reviews?filter=${encodeURIComponent(
                            JSON.stringify({ filter: { rating_lte: 2 } })
                        )}`}
                    />
                </SolarMenu.List>
            }
        />
        <SolarMenu.ResourceItem name="stores" />
        <SolarMenu.ResourceItem name="events" />
    </SolarMenu>
);
```

### `sx`

The `sx` prop allows you to customize the layout styles using a MUI [SX](https://marmelab.com/react-admin/SX.html) object:

```tsx
import { Admin, Resource, ListGuesser } from 'react-admin';
import { SolarLayoutProps, SolarLayout } from '@react-admin/ra-navigation';

const CustomLayout = (props: SolarLayoutProps) => (
    <SolarLayout {...props} sx={{ bgcolor: 'white' }} />
);

export const App = () => (
    <Admin layout={CustomLayout}>
        <Resource name="songs" list={ListGuesser} />
        <Resource name="artists" list={ListGuesser} />
    </Admin>
);
```

The `<SolarLayout>` component accepts the usual `className` prop. You can also override the styles of the inner components thanks to the `sx` property. This property accepts the following subclasses:

| Rule name                             | Description                                                           |
| ------------------------------------- | --------------------------------------------------------------------- |
| `RaSolarLayout`                       | Applied to the root component                                         |
| `& .RaSolarLayout-appFrame`           | Applied to the application frame containing the appBar, the sidebar, and the main content |
| `& .RaSolarLayout-contentWithSidebar` | Applied to the main part containing the sidebar and the content       |
| `& .RaSolarLayout-content`            | Applied to the content area                                           |

### `<SolarMenu>`

The default menu for the `<SolarLayout>`. It displays a thin sidebar with menu items and a second sliding sidebar for its items that have children. On small devices, it is hidden and can be displayed by clicking on the `<SolarAppBar>` toggle button.

By default, just like the classic react-admin menu, it contains menu items for each resource and the dashboard if present, without any secondary sliding menu.

#### Props

| Prop            | Required | Type      | Default | Description                                                  |
| --------------- | -------- | --------- | ------- | ------------------------------------------------------------ |
| `bottomToolbar` | Optional | ReactNode |         | The content to render inside the bottom section of the menu. |
| `children`      | Optional | ReactNode |         | The content to render inside the top section of the menu.    |
| `className`     | Optional | string    |         | A class name to apply to the AppBar container.               |
| `dense`         | Optional | boolean   | false   | Whether the menu should be dense.                            |
| `logo`          | Optional | Component |         | A React component used as the dashboard icon                 |
| `userMenu`      | Optional | Component |         | Allows to customize the user menu                            |
| `sx`            | Optional | `SxProps` |         | Style overrides, powered by MUI System                       |

In addition, the `SolarMenu` object provides shortcuts to its items components:

-   [`SolarMenu.Item`](#solarmenuitem), the base item
-   [`SolarMenu.ResourceItem`](#solarmenuresourceitem), an item generated from a resource definition
-   [`SolarMenu.DashboardItem`](#solarmenudashboarditem), an item for the dashboard
-   [`SolarMenu.UserItem`](#solarmenuuseritem), an item for the user menu
-   [`SolarMenu.LoadingIndicatorItem`](#solarmenuloadingindicatoritem) an item for the loading indicator and refresh button
-   [`SolarMenu.List`](#solarmenulist) a list of menu items
-   [`SolarMenu.LocalesItem`](#solarmenulocalesitem) an item that displays the list of supported locales
-   [`SolarMenu.ToggleThemeItem`](#solarmenutogglethemeitem) an item that displays the theme switcher
-   [`SolarMenu.UserProfileItem`](#solarmenuuserprofileitem) an item that displays the user full name and/or the logout button

#### `children`

The `children` prop is the primary way to leverage the `<SolarMenu>` component. It allows you to pass the menu items that are displayed in the top section of the sidebar while keeping the bottom section defaults.

For instance, here's how to group resources into categories or provide shortcuts to pre-filtered lists:

```tsx
import { Admin, Resource, ListGuesser } from 'react-admin';
import {
    SolarLayoutProps,
    SolarLayout,
    SolarMenu,
} from '@react-admin/ra-navigation';
import { dataProvider } from './dataProvider';

const CustomMenu = () => (
    <SolarMenu>
        <SolarMenu.Item
            label="Sales"
            subMenu={
                <SolarMenu.List>
                    <SolarMenu.ResourceItem name="orders" />
                    <SolarMenu.ResourceItem name="invoices" />
                </SolarMenu.List>
            }
        />
        <SolarMenu.Item
            label="Catalog"
            subMenu={
                <SolarMenu.List>
                    <SolarMenu.ResourceItem name="products" />
                    <SolarMenu.ResourceItem name="categories" />
                </SolarMenu.List>
            }
        />
        <SolarMenu.Item
            label="Customers"
            subMenu={
                <SolarMenu.List>
                    <SolarMenu.Item
                        name="customers.all"
                        label="All customers"
                        to={`/customers?filter=${encodeURIComponent(
                            JSON.stringify({ filter: {} })
                        )}`}
                    />
                    <SolarMenu.Item
                        name="customers.new"
                        label="New customers"
                        to={`/customers?filter=${encodeURIComponent(
                            JSON.stringify({
                                filter: {
                                    last_seen_gte:
                                        endOfYesterday().toISOString(),
                                },
                            })
                        )}`}
                    />
                </SolarMenu.List>
            }
        />
        <SolarMenu.Item
            label="Reviews"
            subMenu={
                <SolarMenu.List>
                    <SolarMenu.Item
                        name="reviews.all"
                        label="New reviews"
                        to={`/reviews?filter=${encodeURIComponent(
                            JSON.stringify({ filter: {} })
                        )}`}
                    />
                    <SolarMenu.Item
                        name="reviews.pending"
                        label="Pending reviews"
                        to={`/reviews?filter=${encodeURIComponent(
                            JSON.stringify({ filter: { status: 'pending' } })
                        )}`}
                    />
                    <SolarMenu.Item
                        name="reviews.bad"
                        label="Bad reviews"
                        to={`/reviews?filter=${encodeURIComponent(
                            JSON.stringify({ filter: { rating_lte: 2 } })
                        )}`}
                    />
                </SolarMenu.List>
            }
        />
        <SolarMenu.ResourceItem name="stores" />
        <SolarMenu.ResourceItem name="events" />
    </SolarMenu>
);
```

#### `className`

`className` is passed to the root `<div>` component. It lets you style the layout with CSS - but the `sx` prop is preferred.

#### `dense`

Set the `dense` prop to `true` to reduce the vertical space between items:

```tsx
import { Admin, Resource, ListGuesser } from 'react-admin';
import {
    SolarLayoutProps,
    SolarLayout,
    SolarMenu,
} from '@react-admin/ra-navigation';
import { ListItemButton } from '@mui/material';
import { dataProvider } from './dataProvider';

const CustomMenu = () => <SolarMenu dense />;

const CustomLayout = (props: SolarLayoutProps) => (
    <SolarLayout {...props} menu={CustomMenu} />
);

export const App = () => (
    <Admin dataProvider={dataProvider} layout={CustomLayout}>
        <Resource name="songs" list={ListGuesser} />
        <Resource name="artists" list={ListGuesser} />
    </Admin>
);
```

#### `userMenu`

The `userMenu` prop allows you to customize the very last menu item of the sidebar.

By default, if you have an `authProvider`, this menu item will have the user avatar as its icon when available from the `authProvider.getIdentity` function. If not available, it will display a user icon.

If you don't have an `authProvider` but have configured a dark theme or your `i18nProvider` supports multiple locales, this menu item will have a settings icon.

Besides, this default menu has a secondary sliding panel.

If you have an `authProvider`, this secondary sliding panel will show the user full name when available from the `authProvider.getIdentity` function and a logout button. If the user full name is not available, it will display a the logout button only.

If you have configured a dark theme, the secondary sliding panel will show a button to toggle it.

If your `i18nProvider` supports multiple locales, it will display a list of the supported locales so that users can switch to them.

You can customize it by passing your own content to the `userMenu` prop.
For instance, here's how to only show a logout button:

```tsx
import { Admin, Resource, ListGuesser } from 'react-admin';
import {
    SolarLayoutProps,
    SolarLayout,
    SolarMenu,
} from '@react-admin/ra-navigation';
import { ListItemButton } from '@mui/material';
import { dataProvider } from './dataProvider';

const CustomUserMenu = () => {
    const logout = useLogout();

    return (
        <ListItemButton onClick={() => logout()} aria-label="Logout">
            <ExitIcon />
        </ListItemButton>
    );
};

const CustomMenu = () => <SolarMenu userMenu={<CustomUserMenu />} />;

const CustomLayout = ({ children, ...props }: SolarLayoutProps) => (
    <SolarLayout {...props} menu={CustomMenu}>
        {children}
    </SolarLayout>
);

export const App = () => (
    <Admin
        dashboard={Dashboard}
        dataProvider={dataProvider}
        layout={CustomLayout}
    >
        <Resource name="songs" list={ListGuesser} />
        <Resource name="artists" list={ListGuesser} />
    </Admin>
);
```

#### `bottomToolbar`

The bottom section of the `<SolarMenu>` contains the refresh button and the user menu by default.

You can customize it by passing your own content to the `bottomToolbar` prop.

For instance, here's how to show a settings menu item in addition to the existing bottom menu items:

```tsx
import { Admin, Resource, ListGuesser } from 'react-admin';
import {
    SolarLayoutProps,
    SolarLayout,
    SolarMenu,
} from '@react-admin/ra-navigation';
import { ListItemButton } from '@mui/material';
import { dataProvider } from './dataProvider';

const CustomBottomToolbar = () => (
    <SolarMenu.List>
        <SolarMenu.Item
            name="settings"
            label="Settings"
            to="/settings"
            icon={<Settings />}
        />
        <SolarMenu.LoadingIndicatorItem />
        <SolarMenu.UserItem />
    </SolarMenu.List>
);

const CustomMenu = () => <SolarMenu bottomToolbar={<CustomBottomToolbar />} />;

const CustomLayout = (props: SolarLayoutProps) => (
    <SolarLayout {...props} menu={CustomMenu} />
);

export const App = () => (
    <Admin dataProvider={dataProvider} layout={CustomLayout}>
        <Resource name="songs" list={ListGuesser} />
        <Resource name="artists" list={ListGuesser} />
    </Admin>
);
```


#### `sx`

The `sx` prop allows you to customize the menu styles using a MUI [SX](https://marmelab.com/react-admin/SX.html) object:

```tsx
import { Admin, Resource, ListGuesser } from 'react-admin';
import { SolarLayoutProps, SolarLayout, SolarMenu, SolarMenuProps } from '@react-admin/ra-navigation';

const CustomMenu = (props: SolarMenuProps) => (
    <SolarMenu
        sx={{
            '& .RaSolarPrimarySidebar-root .MuiDrawer-paper': {
                backgroundColor: '#C724B1',

                '& .MuiButtonBase-root': {
                    color: '#ffffff',
                },
                '& .MuiButtonBase-root.Mui-selected': {
                    backgroundColor: '#3A3A59',
                    color: '#ffffff',
                },
            },
        }}
        {...props}
    />
);

const CustomLayout = (props: SolarLayoutProps) => (
    <SolarLayout {...props} menu={CustomMenu} />
);

export const App = () => (
    <Admin layout={CustomLayout}>
        <Resource name="songs" list={ListGuesser} />
        <Resource name="artists" list={ListGuesser} />
    </Admin>
);
```


The `<SolarMenu>` component accepts the usual `className` prop. You can also override the styles of the inner components thanks to the `sx` property. This property accepts the following subclasses:

| Rule name                         | Description                                                           |
| --------------------------------- | --------------------------------------------------------------------- |
| `RaSolarMenu`                     | Applied to the root component                                         |
| `& .RaSolarMenu-topToolbar`       | Applied to the upper section of the menu                              |
| `& .RaSolarMenu-bottomToolbar`    | Applied to the lower section of the menu                              |
| `& .RaSolarPrimarySidebar-root`   | Applied to the primary sidebar                                        |
| `& .RaSolarSecondarySidebar-root` | Applied to the secondary sidebar                                      |

### `<SolarMenu.Item>`

An item for the `<SolarMenu>` component. `<SolarMenu.Item>` components require an `icon` and a `label`, as well as a `name` to determine if they match the current app location.

There are two types of item components:

1. Those that render a link to a resource or a custom page, and contain a `to` prop:

```jsx
<SolarMenu.Item
    label="Customers"
    icon={<PeopleOutlined />}
    name="customers"
    to="/customers"
/>
```

2. Those that render a sub menu when clicked, and contain a `subMenu` prop:

```jsx
<SolarMenu.Item
    label="Reports"
    icon={<ReportsIcon />}
    name="reports"
    subMenu={
        <SolarMenu.List dense disablePadding sx={{ gap: 0 }}>
            <Typography variant="h6" sx={{ px: 1, my: 1 }}>
                Reports
            </Typography>
            <SolarMenu.Item
                name="reports.password_reports"
                to="/reports/password_reports"
                label="Password Reports"
            />
            <SolarMenu.Item
                name="reports.user_reports"
                to="/reports/user_reports"
                label="User Reports"
            />
            <SolarMenu.Item
                name="reports.general_reports"
                to="/reports/general_reports"
                label="General Reports"
            />
            <SolarMenu.Item
                name="reports.compliance_reports"
                to="/reports/compliance_reports"
                label="Compliance Reports"
            />
            <SolarMenu.Item
                name="reports.custom_reports"
                to="/reports/custom_reports"
                label="Custom Reports"
            />
            <SolarMenu.Item
                name="reports.certificate_reports"
                to="/reports/certificate_reports"
                label="Certificate Reports"
            />
            <SolarMenu.Item
                name="reports.ssh_key_reports"
                to="/reports/ssh_key_reports"
                label="SSH Key Reports"
            />
        </SolarMenu.List>
    }
/>
```

Notice how sub menus are also collections of `<SolarMenu.Item>` components.

#### Props

| Prop           | Required | Type           | Default | Description                                                                                                   |
| -------------- | -------- | -------------- | ------- | ------------------------------------------------------------------------------------------------------------- |
| `children`     | Optional | ReactNode      |         | The content to render inside the secondary sliding sidebar when this item is clicked.                         |
| `icon`         | Optional | ReactNode      |         | The icon. Required for the primary sidebar, optional for the secondary sliding sidebar                        |
| `label`        | Optional | string         |         | The text to display as a tooltip inside the primary sidebar or in plain inside the secondary sliding sidebar. |
| `subMenu`      | Optional | ReactNode      |         | The content to display inside the secondary sliding sidebar when this item is clicked.                        |
| `to`           | Optional | string or `To` |         | The path to which users must be redirected when clicking this item.                                           |
| `tooltipProps` | Optional | object         |         | The props for the `Tooltip` component.                                                                        |

Additional props are passed to the underlying Material-UI `<ListItem>` component.

### `<SolarMenu.ResourceItem>`

An item for the `<SolarMenu>` component. Its children will be rendered inside the secondary sliding sidebar.

It accepts the same props as MUI's `<SolarMenuItem>` component.

| Prop   | Required | Type   | Default | Description                                    |
| ------ | -------- | ------ | ------- | ---------------------------------------------- |
| `name` | Required | string |         | The name of the resource this item represents. |

If you provided an icon on the `<Resource>` component, it will be used by default. It sets the `<SolarMenuItem>` `to` prop to the resource list page and the `label` prop to the resource label.

### `<SolarMenuDashboardItem>`

An item for the `<SolarMenu>` component. Its children will be rendered inside the secondary sliding sidebar.

It accepts the same props as MUI's `<SolarMenuItem>` component. It sets the `<SolarMenuItem>` `to` prop to the root page and the `label` prop to the `ra.page.dashboard`. You can override its default icon by either passing the `logo` prop to the `<SolarMenu>` component or setting the `icon` prop on this component directly.

### `<SolarAppBar>`

An AppBar alternative for the SolarLayout that is only shown on small devices. It displays the app title if provided and the button allowing to open the sidebar.

#### Usage

You can customize it by passing children:

```tsx
import { Admin, AppBarProps, Resource, LoadingIndicator } from 'react-admin';
import {
    SolarAppBar,
    SolarLayout,
    SolarLayoutProps,
} from '@react-admin/ra-navigation';
import { Search } from '@react-admin/ra-search';

const CustomAppBar = () => (
    <SolarAppBar>
        <Search />
        <LoadingIndicator />
    </SolarAppBar>
);

export const CustomLayout = (props: SolarLayoutProps) => (
    <SolarLayout {...props} appBar={CustomAppBar} />
);

export const App = () => (
    <Admin dataProvider={dataProvider} layout={CustomLayout}>
        <Resource name="songs" list={SongList} />
        <Resource name="artists" list={ArtistList} />
    </Admin>
);
```

#### Props

| Prop        | Required | Type        | Default      | Description                                                                                                                                                                                                                                   |
| ----------- | -------- | ----------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `alwaysOn`  | Optional | boolean     | false        | This prop is injected by Layout. You should not use it directly unless you are using a custom layout. If you are using the default layout, use `<Layout appBarAlwaysOn>` instead. On small devices, this prop make the AppBar always visible. |
| `children`  | Optional | ReactNode   |              | The content to render inside the AppBar.                                                                                                                                                                                                      |
| `className` | Optional | string      |              | A class name to apply to the AppBar container.                                                                                                                                                                                                |
| `color`     | Optional | string      | 'secondary'  | The color of the AppBar. Can be primary, secondary, or inherit. Defaults to secondary.                                                                                                                                                        |
| `container` | Optional | ElementType | HideOnScroll | The component used for the root node.                                                                                                                                                                                                         |

### `<SolarMenu.UserItem>`

A `<SolarMenu>` item that displays a user menu item when an authProvider is available or a settings menu item when no authProvider is available but the `<Admin>` has a darkTheme set or the i18nProvider supports multiple locales.

It accepts the same props as the `<SolarMenuItem>` component.

### `<SolarMenu.LocalesItem>`

Language selector. Changes the locale in the app and persists it in the store so that the app opens with the right locale in the future.

Uses `i18nProvider.getLocales()` to get the list of available locales.
Enabled by default in the `<SolarMenu>` when the `<i18nProvider.getLocales()>` returns multiple locales.
Meant to be used in the secondary sidebar of the `<SolarMenu>` component.

It accepts the same props as MUI's `<ListItem>` component.

```tsx
import { SolarMenu } from '@react-admin/navigation';

const MyMenu = () => (
    <SolarMenu>
        <SolarMenu.LocalesItem />
    </SolarMenu>
);
```

### `<SolarMenu.ToggleThemeItem>`

Button toggling the theme (light or dark).
Enabled by default in the `<SolarMenu>` when the `<Admin>` component has a darkMode.
It accepts the same props as MUI's `<ListItem>` component.

```tsx
import { SolarMenu } from '@react-admin/navigation';

const MyMenu = () => (
    <SolarMenu>
        <SolarMenu.ToggleThemeItem />
    </SolarMenu>
);
```

### `<SolarMenu.UserProfileItem>`

This `<SolarMenu>` item displays the user name from the `authProvider.getIdentity` if available and a logout button.
Meant to be used in the secondary sidebar of the `<SolarMenu>` component.
Used by default in the `<SolarMenu.UserItem>` component.
It accepts the same props as MUI's `<ListItem>` component.

| Prop       | Required | Type   | Default | Description                                                                                                                    |
| ---------- | -------- | ------ | ------- | ------------------------------------------------------------------------------------------------------------------------------ |
| redirectTo | Optional | string | false   | The location to redirect the user to when clicking on the logout button. Defaults to '/'. Set to false to disable redirection. |
