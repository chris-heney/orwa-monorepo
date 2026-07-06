# CHANGELOG

## v4.8.0

> 2023-10-10

-   Add support for `className` and `sx` props to `<SolarMenu>`

## v4.7.4

> 2023-10-04

-   Fix `useResourceAppLocation` does not URI decode the id when calling `getOne` (fixes compatibility with Api Platform)

## v4.7.3

> 2023-09-13

-   Fix `<Breadcrumb.ResourceItem>` cannot be used within another `<Breadcrumb.Item>`

## v4.7.2

> 2023-09-11

-   Fix `<SolarMenu.ResourceItem>` invalid JSX.
-   Fix `<SolarMenu.ToggleThemeItem>` and `<SolarMenu.ResourceItem>` don't forward refs

## v4.7.1

> 2023-09-10

-   Add `SolarMenu dense>` prop.
-   Add `<LoadingIndicator>` to the `<SolarAppBar>`.
-   Simplify `<SolarMenu>` and `<SolarAppBar>` APIs.
-   Rename `<SolarMenu.Item primaryText>` prop to `<SolarMenu.Item label>`.
-   Fix `<SolarMenu>` UI glitches.

## v4.7.0

> 2023-08-30

-   Introduce the new Solar layout, an alternative layout that has no AppBar and displays a thin menu as a sidebar with a secondary sliding menu.

## v4.6.0

> 2023-08-22

-   (feat) Add ability to use `<Breadcrumb>` with no children. It will render a `<Breadcrumb.ResourceItems>` by default.
-   (feat) Introduce `<Breadcrumb.ResourceItem>`.
-   (feat) Use the [recordRepresentation](https://marmelab.com/react-admin/Resource.html#recordrepresentation) in `<Breadcrumb.ResourceItems>` and `<Breadcrumb.ResourceItem>` by default.

## v4.5.0

> 2023-05-24

-   Upgraded to react-admin `4.10.6`

## v4.4.3

> 2023-04-13

-   Fix `<MultiLevelMenu.Item>` ignores the `onClick` prop.

## v4.4.2

> 2023-03-23

-   Fix `<MenuItemNode>` clickable surface. The whole node is now clickable.

## v4.4.1

> 2023-03-17

-   Fix usage of `cloneElement` by ensuring children are React elements.

## v4.4.0

> 2023-02-08

-   Expose `<BreadcrumbItem>` as `<Breadcrumb.Item>`
-   Expose `<ResourceBreadcrumbItems>` as `<Breadcrumb.ResourceItems>`
-   Expose `<DashboardBreadcrumbItem>` as `<Breadcrumb.DashboardItem>`
-   Fix `<Breadcrumb>` for nested views

**Breaking Change**

If you use `useAppLocationState` to set the location in a `useEffect` hook, you must now return a cleanup function that returns an empty location on unmount:

```diff
const DensityTab = () => {
    const [_, setLocation] = useAppLocationState();

    useEffect(() => {
        setLocation('experiences.parameters.density');
+       return () => setLocation();
    }, []);

    // return (/* ... */);
};
```

`useAppLocationState` is considered a low-level hook and should not be used often - that's why we decided to publish this change in a minor version.

## v4.3.5

> 2023-01-05

-   Fix `<ContainerLayout>` declares `<ScopedCssBaseline>` twice

## v4.3.4

> 2023-01-04

-   Fix `<ContainerLayout>` ignores `sx` prop.

## v4.3.3

> 2022-12-13

-   (fix) Fix `<AppLocationContext>` ignore location changes in development mode

## v4.3.2

> 2022-11-03

-   (fix) Fix `<BreadcrumbItem>` link not correcly set using `<Admin basename>`

## v4.3.1

> 2022-11-02

-   (fix) Fix `<Breadcrumb>` does not support `<Admin basename>`

## v4.3.0

> 2022-11-02

-   (feat) Add the `<ContainerLayout>` and `<HorizontalMenu>` components

## v4.2.0

> 2022-08-05

-   (feat) Add the `openItemList` prop on the `<MultiLevelMenu>`. Defines which menu items should be open by default.
-   (feat) Add ability to omit the `<MultiLevelMenu.Item to>` prop

## v4.1.2

> 2022-07-19

-   (fix) Add support for `sx` prop in `<IconMenu.Item>`
-   (doc) Fix documentation still referring to 3.x `Breadcrumb` integration methods

## v4.1.1

> 2022-07-05

-   Doc: Fix wrong imports in some examples.

## v4.1.0

> 2022-07-01

-   Add `<IconMenu>` and `<IconMenu.Item>` components.
-   Add `<MultiLevelMenu.Item>` component
-   Fix `<MenuItemNode>` component left arrows appear too close to the menu items

## v4.0.7

> 2022-06-29

-   Fix: Replace `classnames` with `clsx`

## v4.0.6

> 2022-06-20

-   (fix) Fix missing export `<DashboardBreadcrumbItem>`

## v4.0.5

> 2022-06-14

-   (fix) Fix `<MenuItemCategory>` slider doesn't use the theme transitions duration

## v4.0.4

> 2022-06-10

-   (fix) Fix navigating to a record page redirects to the list page after a few seconds.

## v4.0.3

> 2022-06-08

-   (fix) Update peer dependencies ranges (support React 18)

## v4.0.2

> 2022-06-08

-   Fix `<MenuItemCategory>` sub items popup backdrop prevents navigating when open

## v4.0.1

> 2022-06-07

-   Fix user defined locations are sometime ignored

## v4.0.0

> 2022-06-07

-   Upgrade to react-admin v4

**Breaking Changes**

-   `<MenuItem>` was renamed to `<MenuItemNode>`, to avoid conflicts with `<MenuItem>` from `react-admin`

```diff
-import { MultiLevelMenu, MenuItem } from '@react-admin/ra-navigation';
+import { MultiLevelMenu, MenuItemNode } from '@react-admin/ra-navigation';

const MyMenu = () => (
    <MultiLevelMenu>
-       <MenuItem name="dashboard" to="/" exact label="Dashboard" />
+       <MenuItemNode name="dashboard" to="/" exact label="Dashboard" />
-       <MenuItem name="songs" to="/songs" label="Songs" />
+       <MenuItemNode name="songs" to="/songs" label="Songs" />
    </MultiLevelMenu>
);
```

-   `<Menu>` was renamed to `<MenuItemList>`, to avoid conflicts with `<Menu>` from `react-admin`

```diff
const MyMenu = () => (
    <MultiLevelMenu variant="categories">
        <MenuItemCategory name="dashboard" to="/" exact label="Dashboard" icon={<DashboardIcon />} />
        <MenuItemCategory name="songs" icon={<MusicIcon />} to="/songs" label="Songs" />
        <MenuItemCategory
            name="artists"
            {/* The empty filter is required to avoid falling back to the previously set filter */}
            to={'/artists?filter={}'}
            label="Artists"
            icon={<PeopleIcon />}
        >
            <CardContent> {/* to get consistent spacing */}
                <Typography variant="h3" gutterBottom>Artist Categories</Typography>
                {/* Note that we must wrap our MenuItemNode components in a MenuItemList */}
-               <Menu>
-                   <MenuItem name="artists.rock" to={'/artists?filter={"type":"rock"}'} label="Rock" />
-                   <MenuItem name="artists.jazz" to={'/artists?filter={"type":"jazz"}'} label="Jazz" />
-                   <MenuItem name="artists.classical" to={'/artists?filter={"type":"classical"}'} label="Rock" />
-               </Menu>
+               <MenuItemList>
+                   <MenuItemNode name="artists.rock" to={'/artists?filter={"type":"rock"}'} label="Rock" />
+                   <MenuItemNode name="artists.jazz" to={'/artists?filter={"type":"jazz"}'} label="Jazz" />
+                   <MenuItemNode name="artists.classical" to={'/artists?filter={"type":"classical"}'} label="Rock" />
+               </MenuItemList>
            </CardContent>
        </MenuItemCategory>
        <MenuItemCategory
            name="configuration"
            to="/"
            exact
            label="Configuration"
            icon={<SettingsIcon />}
            sx={{ marginTop: 'auto' }}
        />
    </MultiLevelMenu>
);
```

## v3.0.1

> 2021-09-13

-   (fix) Fix breadcrumb does not match paths correctly when there is a dashboard

## v3.0.0

> 2021-09-08

-   (fix) **Breaking change**: Following the upgrade to react-admin 3.18, we now have to specify the width of the sidebar with an arbitrary default value. You might have to adjust it with a custom theme.

```tsx
import { defaultTheme } from 'react-admin';
import { ThemeOptions } from '@react-admin/ra-navigation';

export const theme: ThemeOptions = {
    ...defaultTheme,
    overrides: {
        RaSidebar: {
            drawerPaper: {
                width: 96,
            },
            fixed: {
                zIndex: 1200,
            },
        },
    },
};
```

## v2.3.5

> 2021-09-03

-   (fix) Fix `useAppLocationMatcher` should not confuse resources with names starting with the same characters (`product` and `productCatalog` for instance)

## v2.3.4

> 2021-07-16

-   (fix) Fix "cannot read prop style of undefined" error in `<MenuItem>`

## v2.3.3

> 2021-07-07

-   (fix) Fix resource path resolution to support TabbedForm and TabbedShowLayout tabs with path
-   (fix) Fix resource path resolution to support multiple resources which have names starting with the same characters

## v2.3.2

> 2021-06-29

-   (fix) Update peer dependencies ranges (support react 17)

## v2.3.1

> 2021-06-21

-   (doc) Update the documentation

## v2.3.0

> 2021-06-16

-   (feat) Add translation key support on `<BreadcrumbItem>`

## v2.2.4

> 2021-06-15

-   (fix) Fix custom routes for a resource might be inferred as the edit view for that resource

## v2.2.3

> 2021-05-06

-   (fix) Fix Breadcrumb resource items for details views are not translated

## v2.2.2

> 2021-05-03

-   (fix) Fix Breadcrumb Dark Mode Support

## v2.2.1

> 2021-04-27

-   (fix) Fix split on undefined in `getDeepestLocation`

## v2.2.0

> 2021-04-22

-   (feat) Add the `initialOpen` prop on the `<MultiLevelMenu>`. Defines whether the menu items with sub menus should be open initialy.

## v2.1.0

> 2021-04-08

-   (feat) Add the `hasDashboard` prop on the `<AppLocationContext>`
    This allows to avoid specifying this prop on the `<Breacrumb>` itself.
    It's used in `ra-enterprise` to set up the breadcrumb automatically regarding the dashboard.

-   (feat) Introduce the `useHasDashboard` hook to check if a dashboard has been defined.

-   (fix) Ensure the AppLocation and breadcrumb behave correctly when views are included in other views (Create/Edit/Show in aside for example).

## v2.0.0

> 2021-04-01

**Breaking change**

-   (feat) Introduce variant prop on `<Breadcrumb>`.

```diff
import * as React from "react";
import { TopToolbar, ShowButton } from 'react-admin';
-import { BreadcrumbForActions } from '@react-admin/ra-navigation';
+import { Breadcrumb } from '@react-admin/ra-navigation';

const PostEditActions = ({ basePath, data, resource }) => (
    <TopToolbar>
-        <BreadcrumbForActions />
+        <Breadcrumb variant="actions" />
        <ShowButton basePath={basePath} record={data} />
    </TopToolbar>
);

export const PostEdit = (props) => (
    <Edit actions={<PostEditActions />} {...props}>
        ...
    </Edit>
);
```

## v1.3.3

> 2021-03-23

-   (fix) Allow to Override BreadcrumbForActions className

## v1.3.2

> 2021-03-22

-   (fix) Fix BreacrumbForActions props interface

## v1.3.1

> 2021-03-19

-   (fix) Fix Breacrumb Styles
-   (fix) Move Breadcrumb out of Layout

## v1.3.0

> 2021-03-18

-   (feat) Added `<BreadcrumbForActions>`, a `Breadcrumb` variation with custom styles to make it fit inside an actions toolbar.

```tsx
import * as React from 'react';
import { TopToolbar, ShowButton } from 'react-admin';
import { BreadcrumbForActions } from '@react-admin/ra-navigation';

const PostEditActions = ({ basePath, data, resource }) => (
    <TopToolbar>
        <BreadcrumbForActions />
        <ShowButton basePath={basePath} record={data} />
    </TopToolbar>
);

export const PostEdit = props => (
    <Edit actions={<PostEditActions />} {...props}>
        ...
    </Edit>
);
```

## v1.2.5

> 2021-03-17

-   (fix) Fix MenuItemCategory popover is always at the page top

## v1.2.4

> 2020-11-27

-   (fix) Fix `MenuItem` inside `<MenuItemCategory>` do not display their label when sidebar is collapsed
-   (fix) Fix custom menu cannot be collapsed in ra-enterprise by upgrading react-admin

## v1.2.3

> 2020-11-03

-   (fix) Fix `<MenuItemCategory>` blocks scroll

## v1.2.2

> 2020-10-23

-   (fix) Fix `<MenuItemCategory>` sometimes hidden by the `<AppBar>`

## v1.2.1

> 2020-10-15

-   (feat) Show by default which `<MenuItem>` is hovered by using a grey background
-   (fix) Clicking on `<MenuItem>` borders wasn't possible

## v1.2.0

> 2020-10-05

-   Upgrade to react-admin `3.9`

## v1.1.5

> 2020-10-01

-   (fix) Fix menu overlapping when passing from a `<MenuItemCtagory />` to another one

## v1.1.4

> 2020-09-30

-   Update Readme

## v1.1.3

> 2020-09-29

-   (fix) Export breadcrumb types

## v1.1.2

> 2020-09-25

-   (fix) Render the `<BreadcrumbItem>` using material-ui `<Typography>` and `<Link>`

## v1.1.1

> 2020-09-17

-   (fix) Fix `<MenuItemCategory>` props types

## v1.1.0

> 2020-09-17

-   (feat) Replace `home` by `dashboard`
-   (fix) Ensure the label of the dashboard `<BreadcrumbItem>` is translatable and uses react-admin defaults

## v1.0.5

> 2020-09-16

-   (feat) Add a hover effect for the `<MenuItemCategory>`
-   (fix) Fix the dark mode for the `<MultiLevelMenu>`
-   (deps) Upgrade dependencies

## v1.0.4

> 2020-09-03

-   (feat) Add a home link to the `<Breadcrumb>`
-   (feat) Allow to design the `<Breadcrumb`
-   (fix) Fix the breadcrumbs when used in the home page
-   (deps) Upgrade dependencies

## v1.0.3

> 2020-08-21

-   (fix) Fix the `<MenuItemCategory>` blur

## v1.0.2

> 2020-08-21

-   (feat) Allow the `<MenuItemCategory>` customization

## v1.0.1

> 2020-08-20

-   (feat) Introduce the `<MultiLevelMenu>`
-   (doc) Improve the documentation
-   (deps) Upgrade dependencies

## v1.0.0

> 2020-07-31

-   First release
