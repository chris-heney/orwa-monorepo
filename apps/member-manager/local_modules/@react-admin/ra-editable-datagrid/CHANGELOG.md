# CHANGELOG

## v4.6.4

> 2024-04-11

- Fix `EditableDatagrid` does not display validation errors on pristine fields when there are custom side effects

## v4.6.3

> 2024-04-02

- Fix `EditableDatagrid` expands all rows

## v4.6.2

> 2024-02-26

- Fix `EditableDatagrid` does not work with custom `ListContext`  

## v4.6.1

> 2023-11-21

- Remove `<DatagridAG>`, as it has been moved to its own package `@react-admin/ra-datagrid-ag`.

## v4.6.0

> 2023-11-14

- Make `<DatagridAG>` persist columns order and size in the Store
- Enable [lazy loading](https://react.dev/reference/react/lazy#suspense-for-code-splitting) for `<DatagridAG>` to avoid including it in the bundle when not used (see [related issue](https://github.com/ag-grid/ag-grid/issues/7241) on ag-grid's repo)
- Transpiled ESM version of the code now targets ES2020 instead of ES2015
- Remove default notification on edit success (for a better spreadsheet-like experience)

## v4.5.1

> 2023-10-30

- Fix `<DatagridAG>` default `defaultColDef` are mutated when a `defaultColDef` prop is provided

## v4.5.0

> 2023-10-20

- Introduce `<DatagridAG>`

## v4.4.0

> 2023-09-29

- Add `<EditableDatagridConfigurable>` and `<RowFormConfigurable>` components

## v4.3.2

> 2023-09-19

-   Add support for in `<EditableDatagrid rowSx>` prop

## v4.3.1

> 2023-07-11

-   Fix `<EditableDatagrid>` does not forward the `header` and `size` props to `<Datagrid>`

## v4.3.0

> 2023-05-24

-   Fix `<RowForm>` does not pass `mutationOptions` with only `meta`
-   Fix `<DeleteRowButton>` does not support `mutationOptions`
-   Upgraded to react-admin `4.10.6`

## v4.2.2

> 2023-04-26

-   Fix `<SaveRowButton>` is not disabled while saving.

## v4.2.1

> 2023-04-07

-   Fix `<RowForm>` doesn't call the provided `transform` function when submitting with the Enter key

## v4.2.0

> 2023-03-06

-   Fix `<EditableDatagrid>` doesn't render the table headers when creating the first row
-   Upgraded to react-admin `4.8.2`

## v4.1.4

> 2023-02-09

-   Fix `<EditableDatagrid>` doesn't render a Create button when used inside a `ListContextProvider` and having a `createForm`

## v4.1.3

> 2023-01-31

-   Fix `<EditableDatagrid>` might enter a infinite render loop when empty and a custom `empty` component was provided.

## v4.1.2

> 2023-01-05

-   Fix `DeleteWithConfirmIconButton` props: added `mutationOptions`, `translateOptions` and removed unused `invalid`, `pristine`, `saving`
-   Fix `DeleteWithConfirmIconButton` ignores `onClick`
-   Fix propTypes definition in `EditableDatagrid`
-   Fix custom `empty` component is not rendered when using `EditableDatagrid` in list view
-   Fix `useEditableDatagridContext` is not exported
-   Fix `EditableDatagridProps` type

## v4.1.1

> 2022-11-07

-   (feat) Add ability to use `useEditableDatagridContext` callbacks even when in a List view

## v4.1.0

> 2022-09-26

-   (feat) Add `EditableDatagridContext` with `useEditableDatagridContext` hook, and allow customization of the create button with the `empty` prop in case there is no data inside an `<EditableDatagrid>`

## v4.0.7

> 2022-09-27

-   (fix) Fix ability to pass `sx` prop to `EditableDatagrid`

## v4.0.6

> 2022-09-19

-   Fix `rowClick="show"` disables row edition

## v4.0.5

> 2022-09-05

-   (fix) Fix `transform` is not called when no `mutationOptions` are provided
-   Storybook: add stories to demonstrate `transform`

## v4.0.4

> 2022-08-23

-   (fix) Remove `mutationMode` prop from `<RowForm>` (`mutationMode` is supported on `<EditableDatagrid>` only)
-   Doc fixes
    -   `handleSuccess` example was using `response.data` instead of `data`
    -   undoable notification example was wrong
    -   link to OSS `mutationMode` was broken
    -   one `<EditableDatagrid>` example still mentioned `undoable` prop instead of `mutationMode`
-   Storybook: add stories to demonstrate `mutationMode` and side effects

## v4.0.3

> 2022-08-04

-   Fix: Passing custom actions to an `<EditableDatagrid>` used inside a `<ReferenceManyField>` no longer hide the Create button.

## v4.0.2

> 2022-06-29

-   Fix: Replace `classnames` with `clsx`

## v4.0.1

> 2022-06-08

-   (fix) Update peer dependencies ranges (support React 18)

## v4.0.0

> 2022-06-07

-   Upgrade to react-admin v4

**Breaking changes**

-   The `useCreateRowContext` and `useEditRowContext` hooks have been replaced by a single `useRowContext`.

```diff
import {
    RowForm,
-    useCreateRowContext,
-    useEditRowContext,
+    useRowContext,
} from '@react-admin/ra-editable-datagrid';

const ArtistEditForm = () => {
    const notify = useNotify();
-    const { close } = useEditRowContext();
+    const { close } = useRowContext();

    const handleSuccess = response => {
        notify(
            `Artist ${response.name} ${response.firstName} has been updated`
        );
        close();
    };

    return (
        <RowForm mutationOptions={{ onSuccess: handleSuccess }}>
            // ...
        </RowForm>
    );
};

const ArtistCreateForm = () => {
    const notify = useNotify();
-    const { close } = useCreateRowContext();
+    const { close } = useRowContext();

    const handleSuccess = response => {
        notify(
            `Artist ${response.name} ${response.firstName} has been added`
        );
        close();
    };

    return (
        <RowForm mutationOptions={{ onSuccess: handleSuccess }}>
            // ...
        </RowForm>
    );
};
```

-   The `undoable` prop has been removed, use `mutationMode` instead. It accepts the following values: `pessimistic`, `optimistic`, and `undoable`. See react-admin documentation about [mutationMode](https://marmelab.com/react-admin/CreateEdit.html#mutationmode).

```diff
<EditableDatagrid
-    undoable
+    mutationMode="undoable"
```

>

    // ...

</EditableDatagrid>
```

## v2.1.2

> 2021-11-19

-   (fix) Fix sanitize title prop out of EditDialog component

## v2.1.1

> 2021-09-20

-   (fix) fix error happening after clicking the create button in an empty Datagrid with expand

## v2.1.0

> 2021-09-06

-   (feat) allows to disable submit on enter with the `submitOnEnter` prop on `RowForm`

## v2.0.1

> 2021-08-06

-   (fix) Correctly handle prop `actions` when set to `false`

## v2.0.0

> 2021-08-04

-   (fix) Correctly handle prop `actions` when set to `false`

-   (fix) **Breaking change**: Renamed `CreateResourceButton` to `CreateButton`

-   (feat) Add support for the `mutationMode` prop introduced in `react-admin@3.12.0`.

    The `undoable` prop is deprecated, use `mutationMode` instead. It accepts the following values: `pessimistic`, `optimistic`, and `undoable`. See react-admin documentation about [mutationMode](https://marmelab.com/react-admin/CreateEdit.html#mutationmode).

-   (feat) Add support for custom actions on `<EditableDatagrid>` through the `actions` prop.

For instance, you could provide your own `DeleteButton` with confirmation and undoable notification:

```tsx
import React from 'react';
import { List, TextField } from 'react-admin';
import {
    DeleteWithConfirmIconButton,
    EditableDatagrid,
    EditRowButton,
} from '@react-admin/ra-editable-datagrid';
import { ArtistForm } from './ArtistForm';

const CustomAction = () => (
    <>
        <EditRowButton />
        <DeleteWithConfirmIconButton mutationMode="undoable" />
    </>
);

const ArtistList = (props: ListProps) => (
    <List
        {...props}
        hasCreate
        sort={{ field: 'id', order: 'DESC' }}
        empty={false}
    >
        <EditableDatagrid
            actions={<CustomAction />}
            // The mutation mode is still applied to updates
            mutationMode="undoable"
            editForm={<ArtistForm />}
        >
            <TextField source="id" />
            <TextField source="firstname" />
            <TextField source="name" />
        </EditableDatagrid>
    </List>
);
```

## v1.3.5

> 2021-07-28

-   (fix) Ensure submitting on enter does not discard validation errors

## v1.3.4

> 2021-07-27

-   (fix) Update Delete Icon buttons to use ra-core hooks

## v1.3.3

> 2021-07-19

-   (fix) Fix creating a record fails when the Datagrid is empty

## v1.3.2

> 2021-07-16

-   (fix) Fix Edit button does not respond to click

## v1.3.1

> 2021-06-29

-   (fix) Update peer dependencies ranges (support react 17)

## v1.3.0

> 2021-06-14

-   (feat) Add support for side effects on `<RowForm>`.

You can now provide your own side effects in response to successful/failed update/creation in an `<EditableDatagrid>` by passing functions to the `onSuccess` or `onFailure` props:

```tsx
import {
    DateInput,
    SelectInput,
    TextField,
    TextInput,
    useNotify,
} from 'react-admin';
import {
    RowForm,
    RowFormProps,
    useEditRowContext,
    useCreateRowContext,
} from '@react-admin/ra-editable-datagrid';

const ArtistEditForm = (props: RowFormProps) => {
    const notify = useNotify();
    const { close } = useEditRowContext();

    const handleSuccess = response => {
        notify(
            `Artist ${response.data.name} ${response.data.firstName} has been updated`
        );
        close();
    };

    return (
        <RowForm onSuccess={handleSuccess} {...props}>
            <TextField source="id" />
            <TextInput source="firstname" validate={required()} />
            <TextInput source="name" validate={required()} />
            <DateInput source="dob" label="born" validate={required()} />
            <SelectInput
                source="prof"
                label="Profession"
                choices={professionChoices}
            />
        </RowForm>
    );
};

const ArtistCreateForm = props => {
    const notify = useNotify();
    const { close } = useCreateRowContext();

    const handleSuccess = response => {
        notify(
            `Artist ${response.data.name} ${response.data.firstName} has been added`
        );
        close();
    };

    return (
        <RowForm onSuccess={handleSuccess} {...props}>
            <TextInput source="firstname" validate={required()} />
            <TextInput source="name" validate={required()} />
            <DateInput source="dob" label="born" validate={required()} />
            <SelectInput
                source="prof"
                label="Profession"
                choices={professionChoices}
            />
        </RowForm>
    );
};
```

Note that we provide two additional side effects hooks: `useEditRowContext` and `useCloseCreateRow`, which allow you to close the form.

Besides, the `<RowForm>` also accepts a function for its `transform` prop, allowing you to alter the data before sending it to the dataProvider:

```tsx
const ArtistCreateForm = props => {
    const handleTransform = data => {
        return {
            ...data,
            fullName: `${data.firstName} ${data.name}`,
        };
    };

    return (
        <RowForm transform={handleTransform} {...props}>
            <TextInput source="firstname" validate={required()} />
            <TextInput source="name" validate={required()} />
            <DateInput source="dob" label="born" validate={required()} />
            <SelectInput
                source="prof"
                label="Profession"
                choices={professionChoices}
            />
        </RowForm>
    );
};
```

## v1.2.0

> 2021-05-17

-   (chore) Upgrade to react-admin 3.15
-   (feat) Ensure all components with custom styles are overridable through MUI theme by providing their key (`RaEditableDatagrid`, `RaEditableDatagridRow` and `RaRowForm`).

## v1.1.2

> 2021-05-11

-   Fix `<EditableDatagrid>` fails when wrapped

## v1.1.1

> 2020-11-03

-   Add the `noDelete` prop to `<EditableDatagrid>` to disable the inline Delete button

## v1.1.0

> 2020-10-05

-   Upgrade to react-admin `3.9`

## v1.0.4

> 2020-09-30

-   Update Readme

## v1.0.3

> 2020-09-17

-   (fix) Fix crash on row deletion and impossible row creation

## v1.0.2

> 2020-09-16

-   (deps) Upgrade dependencies

## v1.0.1

> 2020-09-07

-   (feat) Add support for `expand`

## v1.0.0

> 2020-08-05

-   First release
