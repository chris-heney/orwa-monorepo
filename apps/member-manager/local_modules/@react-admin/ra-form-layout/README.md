# ra-form-layout

New form layouts for complex data entry tasks (accordion, wizard, etc.).

<video controls autoplay playsinline muted loop>
  <source src="./assets/ra-accordion-form-overview.webm" type="video/webm"/>
  <source src="./assets/ra-accordion-form-overview.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

Test it live on [the Enterprise Edition Storybook](https://react-admin.github.io/ra-enterprise/?path=/story/ra-form-layout-dialogform--basic) and in [the e-commerce demo](https://marmelab.com/ra-enterprise-demo/) ([Accordion Form](https://marmelab.com/ra-enterprise-demo/#/products/1), [WizardForm](https://marmelab.com/ra-enterprise-demo/#/customers/create)).

## Installation

```sh
npm install --save @react-admin/ra-form-layout
# or
yarn add @react-admin/ra-form-layout
```

**Tip**: `ra-form-layout` is part of the [React-Admin Enterprise Edition](https://marmelab.com/ra-enterprise/), and hosted in a private npm registry. You need to subscribe to one of the Enterprise Edition plans to access this package.

The package contains new translation messages (in English and French). You should add them to your `i18nProvider`:

```tsx
import { Admin } from 'react-admin';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';
import frenchMessages from 'ra-language-french';

import {
    raFormLayoutLanguageEnglish,
    raFormLayoutLanguageFrench,
} from '@react-admin/ra-form-layout';

const messages = {
    en: { ...englishMessages, ...raFormLayoutLanguageEnglish },
    fr: { ...frenchMessages, ...raFormLayoutLanguageFrench },
};

const i18nProvider = polyglotI18nProvider(locale => messages[locale], 'en');

const App = () => <Admin i18nProvider={is18nProvider}>{/* ... */}</Admin>;
```

## `<AccordionForm>`

Alternative to `<SimpleForm>`, to be used as child of `<Create>` or `<Edit>`. Expects `<AccordionFormPanel>` elements as children.

<video controls autoplay playsinline muted loop>
  <source src="./assets/ra-accordion-form-overview.webm" type="video/webm"/>
  <source src="./assets/ra-accordion-form-overview.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

Test it live in [the e-commerce demo](https://marmelab.com/ra-enterprise-demo/#/products/1).

By default, each child accordion element handles its expanded state independently.

```tsx
import {
    Edit,
    TextField,
    TextInput,
    DateInput,
    SelectInput,
    ArrayInput,
    SimpleFormIterator,
    BooleanInput,
} from 'react-admin';
import { AccordionForm, AccordionFormPanel } from '@react-admin/ra-form-layout';

// don't forget the component="div" prop on the main component to disable the main Card
const CustomerEdit = () => (
    <Edit component="div">
        <AccordionForm autoClose>
            <AccordionFormPanel label="Identity">
                <TextField source="id" />
                <TextInput source="first_name" validate={required()} />
                <TextInput source="last_name" validate={required()} />
                <DateInput source="dob" label="born" validate={required()} />
                <SelectInput source="sex" choices={sexChoices} />
            </AccordionFormPanel>
            <AccordionFormPanel label="Occupations">
                <ArrayInput source="occupations" label="">
                    <SimpleFormIterator>
                        <TextInput source="name" validate={required()} />
                        <DateInput source="from" validate={required()} />
                        <DateInput source="to" />
                    </SimpleFormIterator>
                </ArrayInput>
            </AccordionFormPanel>
            <AccordionFormPanel label="Preferences">
                <SelectInput
                    source="language"
                    choices={languageChoices}
                    defaultValue="en"
                />
                <BooleanInput source="dark_theme" />
                <BooleanInput source="accepts_emails_from_partners" />
            </AccordionFormPanel>
        </AccordionForm>
    </Edit>
);
```

### `autoClose`

When setting `autoClose` in the `<AccordionForm>`, only one accordion remains open at a time. The first accordion is open by default, and when a user opens another one, the current open accordion closes.

```diff
import { Edit, TextField, TextInput, DateInput, SelectInput, ArrayInput, SimpleFormIterator, BooleanInput } from 'react-admin';
import { AccordionForm, AccordionFormPanel } from '@react-admin/ra-form-layout';

// don't forget the component="div" prop on the main component to disable the main Card
const CustomerEdit = (props: EditProps) => (
    <Edit {...props} component="div">
-       <AccordionForm>
+       <AccordionForm autoClose>
            <AccordionFormPanel label="Identity" defaultExpanded>
                <TextField source="id" />
                ...
```

### `toolbar`

You can customize the form Toolbar by passing a custom element in the `toolbar` prop. The form expects the same type of element as `<SimpleForm>`, see [the `<SimpleForm toolbar>` prop documentation](https://marmelab.com/react-admin/CreateEdit.html#toolbar) in the react-admin docs.

### `<AccordionFormPanel>`

The children of `<AccordionForm>` must be `<AccordionFormPanel>` elements.

This component renders a [MUI `<Accordion>` component](https://mui.com/components/accordion/). In the `<AccordionDetails>`, renders each child inside a `<FormInput>` (the same layout as in `<SimpleForm>`).

| Prop              | Required | Type        | Default | Description                                                                                      |
| ----------------- | -------- | ----------- | ------- | ------------------------------------------------------------------------------------------------ |
| `label`           | Required | `string`    | -       | The main label used as the accordion summary. Appears in red when the accordion has errors       |
| `children`        | Required | `ReactNode` | -       | A list of `<Input>` elements                                                                     |
| `secondary`       | Optional | `string`    | -       | The secondary label used as the accordion summary                                                |
| `defaultExpanded` | Optional | `boolean`   | `false` | Set to true to have the accordion expanded by default (except if autoClose = true on the parent) |
| `disabled`        | Optional | `boolean`   | `false` | If true, the accordion will be displayed in a disabled state.                                    |
| `square`          | Optional | `boolean`   | `false` | If true, rounded corners are disabled.                                                           |

```tsx
import {
    Edit,
    TextField,
    TextInput,
    DateInput,
    SelectInput,
    ArrayInput,
    SimpleFormIterator,
    BooleanInput,
} from 'react-admin';

import { AccordionForm, AccordionFormPanel } from '@react-admin/ra-form-layout';

const CustomerEdit = () => (
    <Edit component="div">
        <AccordionForm>
            <AccordionFormPanel label="Identity" defaultExpanded>
                <TextField source="id" />
                <TextInput source="first_name" validate={required()} />
                <TextInput source="last_name" validate={required()} />
                <DateInput source="dob" label="born" validate={required()} />
                <SelectInput source="sex" choices={sexChoices} />
            </AccordionFormPanel>
        </AccordionForm>
    </Edit>
);
```

## `<AccordionSection>`

Renders children (Inputs) inside a MUI `<Accordion>` element without a Card style. To be used as child of a `<SimpleForm>` or a `<TabbedForm>` element.

<video controls autoplay playsinline muted loop>
  <source src="./assets/ra-accordion-section-overview.webm" type="video/webm"/>
  <source src="./assets/ra-accordion-section-overview.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

Prefer `<AccordionSection>` to `<AccordionForm>` to always display a list of important inputs, then offer accordions for secondary inputs.

### Props

| Prop               | Required | Type        | Default | Description                                                   |
| ------------------ | -------- | ----------- | ------- | ------------------------------------------------------------- |
| `Accordion`        | Optional | `Component` | -       | The component to use as the accordion.                        |
| `AccordionDetails` | Optional | `Component` | -       | The component to use as the accordion details.                |
| `AccordionSummary` | Optional | `Component` | -       | The component to use as the accordion summary.                |
| `label`            | Required | `string`    | -       | The main label used as the accordion summary.                 |
| `children`         | Required | `ReactNode` | -       | A list of `<Input>` elements                                  |
| `fullWidth`        | Optional | `boolean`   | `false` | If true, the Accordion take sthe entire form width.           |
| `className`        | Optional | `string`    | -       | A class name to style the underlying `<Accordion>`            |
| `secondary`        | Optional | `string`    | -       | The secondary label used as the accordion summary             |
| `defaultExpanded`  | Optional | `boolean`   | `false` | Set to true to have the accordion expanded by default         |
| `disabled`         | Optional | `boolean`   | `false` | If true, the accordion will be displayed in a disabled state. |
| `square`           | Optional | `boolean`   | `false` | If true, rounded corners are disabled.                        |

```tsx
import {
    Edit,
    TextField,
    TextInput,
    DateInput,
    SelectInput,
    ArrayInput,
    SimpleForm,
    SimpleFormIterator,
    BooleanInput,
} from 'react-admin';

import { AccordionForm, AccordionFormPanel } from '@react-admin/ra-form-layout';

const CustomerEdit = () => (
    <Edit component="div">
        <SimpleForm>
            <TextField source="id" />
            <TextInput source="first_name" validate={required()} />
            <TextInput source="last_name" validate={required()} />
            <DateInput source="dob" label="born" validate={required()} />
            <SelectInput source="sex" choices={sexChoices} />
            <AccordionSection label="Occupations" fullWidth>
                <ArrayInput source="occupations" label="">
                    <SimpleFormIterator>
                        <TextInput source="name" validate={required()} />
                        <DateInput source="from" validate={required()} />
                        <DateInput source="to" />
                    </SimpleFormIterator>
                </ArrayInput>
            </AccordionSection>
            <AccordionSection label="Preferences" fullWidth>
                <SelectInput
                    source="language"
                    choices={languageChoices}
                    defaultValue="en"
                />
                <BooleanInput source="dark_theme" />
                <BooleanInput source="accepts_emails_from_partners" />
            </AccordionSection>
        </SimpleForm>
    </Edit>
);
```

## `<WizardForm>`

Alternative to `<SimpleForm>` that splits a form into a step-by-step interface, to facilitate the entry in long forms.

<video controls autoplay playsinline muted loop>
  <source src="./assets/ra-wizard-form-overview.webm" type="video/webm"/>
  <source src="./assets/ra-wizard-form-overview.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

Test it live in [the e-commerce demo](https://marmelab.com/ra-enterprise-demo/#/customers/create).

Use `<WizardForm>` as the child of `<Create>`. It expects `<WizardFormStep>` elements as children.

```tsx
import React from 'react';
import { Create, TextInput, required } from 'react-admin';
import { WizardForm, WizardFormStep } from '@react-admin/ra-form-layout';

const PostCreate = () => (
    <Create>
        <WizardForm>
            <WizardFormStep label="First step">
                <TextInput source="title" validate={required()} />
            </WizardFormStep>
            <WizardFormStep label="Second step">
                <TextInput source="description" />
            </WizardFormStep>
            <WizardFormStep label="Third step">
                <TextInput source="fullDescription" validate={required()} />
            </WizardFormStep>
        </WizardForm>
    </Create>
);
```

**Note**: You can also use the `<WizardForm>` as child of `<Edit>` but it's considered as a bad practice to provide a wizard form for existing resources.

**Tip**: The `label` prop of the `<WizardFormStep>` component accepts a translation key:

```tsx
import React from 'react';
import { Create, TextInput, required } from 'react-admin';
import { WizardForm, WizardFormStep } from '@react-admin/ra-form-layout';

const PostCreate = () => (
    <Create>
        <WizardForm>
            <WizardFormStep label="myapp.posts.steps.general">
                <TextInput source="title" validate={required()} />
            </WizardFormStep>
            <WizardFormStep label="myapp.posts.steps.description">
                <TextInput source="description" />
            </WizardFormStep>
            <WizardFormStep label="myapp.posts.steps.misc">
                <TextInput source="fullDescription" validate={required()} />
            </WizardFormStep>
        </WizardForm>
    </Create>
);
```

### `toolbar`

You can customize the form toolbar by passing a custom component in the `toolbar` prop.

```tsx
import { Button } from '@mui/material';
import React from 'react';
import { Create, required, TextInput, useSaveContext } from 'react-admin';
import { useFormState } from 'react-hook-form';
import {
    useWizardFormContext,
    WizardForm,
    WizardFormStep,
} from '@react-admin/ra-form-layout';

const MyToolbar = () => {
    const { hasNextStep, hasPreviousStep, goToNextStep, goToPreviousStep } =
        useWizardFormContext();
    const { save } = useSaveContext();
    const { isValidating } = useFormState();

    return (
        <ul>
            {hasPreviousStep ? (
                <li>
                    <Button onClick={() => goToPreviousStep()}>PREVIOUS</Button>
                </li>
            ) : null}
            {hasNextStep ? (
                <li>
                    <Button
                        disabled={isValidating}
                        onClick={() => goToNextStep()}
                    >
                        NEXT
                    </Button>
                </li>
            ) : (
                <li>
                    <Button disabled={isValidating} onClick={save}>
                        SAVE
                    </Button>
                </li>
            )}
        </ul>
    );
};

const PostCreate = () => (
    <Create>
        <WizardForm toolbar={<MyToolbar />}>
            <WizardFormStep label="First step">
                <TextInput source="title" validate={required()} />
            </WizardFormStep>
            <WizardFormStep label="Second step">
                <TextInput source="description" />
            </WizardFormStep>
            <WizardFormStep label="Third step">
                <TextInput source="fullDescription" validate={required()} />
            </WizardFormStep>
        </WizardForm>
    </Create>
);
```

### `progress`

You can also customize the progress stepper by passing a custom component in the `progress` prop.

```tsx
import React from 'react';
import { Create, TextInput, required } from 'react-admin';
import {
    WizardForm,
    WizardFormProgressProps,
    useWizardFormContext,
} from '@react-admin/ra-form-layout';

const MyProgress = (props: WizardFormProgressProps) => {
    const { currentStep, steps } = useWizardFormContext(props);
    return (
        <ul>
            {steps.map((step, index) => {
                const label = React.cloneElement(step, { intent: 'label' });
                return (
                    <li key={`step_${index}`}>
                        <span
                            style={{
                                textDecoration:
                                    currentStep === index
                                        ? 'underline'
                                        : undefined,
                            }}
                        >
                            {label}
                        </span>
                    </li>
                );
            })}
        </ul>
    );
};

const PostCreate = () => (
    <Create>
        <WizardForm progress={<MyProgress />}>
            <WizardForm.Step label="First step">
                <TextInput source="title" validate={required()} />
            </WizardForm.Step>
            <WizardForm.Step label="Second step">
                <TextInput source="description" />
            </WizardForm.Step>
            <WizardForm.Step label="Third step">
                <TextInput source="fullDescription" validate={required()} />
            </WizardForm.Step>
        </WizardForm>
    </Create>
);
```

Any additional props will be passed to the `<Progress>` component.

You can also hide the progress stepper completely by setting `progress` to `false`.

```tsx
import React from 'react';
import { Create, TextInput, required } from 'react-admin';
import { WizardForm } from '@react-admin/ra-form-layout';

const PostCreate = () => (
    <Create>
        <WizardForm progress={false}>
            <WizardForm.Step label="First step">
                <TextInput source="title" validate={required()} />
            </WizardForm.Step>
            <WizardForm.Step label="Second step">
                <TextInput source="description" />
            </WizardForm.Step>
            <WizardForm.Step label="Third step">
                <TextInput source="fullDescription" validate={required()} />
            </WizardForm.Step>
        </WizardForm>
    </Create>
);
```

### Adding a Summary Final Step

In order to add a final step with a summary of the form values before submit, you can leverage `react-hook-form` [`useWatch`](https://react-hook-form.com/docs/usewatch) hook:

```tsx
const FinalStepContent = () => {
    const values = useWatch({
        name: ['title', 'description', 'fullDescription'],
    });

    return values?.length > 0 ? (
        <>
            <Typography>title: {values[0]}</Typography>
            <Typography>description: {values[1]}</Typography>
            <Typography>fullDescription: {values[2]}</Typography>
        </>
    ) : null;
};

const PostCreate = () => (
    <Create>
        <WizardForm>
            <WizardFormStep label="First step">
                <TextInput source="title" validate={required()} />
            </WizardFormStep>
            <WizardFormStep label="Second step">
                <TextInput source="description" />
            </WizardFormStep>
            <WizardFormStep label="Third step">
                <TextInput source="fullDescription" validate={required()} />
            </WizardFormStep>
            <WizardFormStep label="">
                <FinalStepContent />
            </WizardFormStep>
        </WizardForm>
    </Create>
);
```

## `<LongForm>`

Alternative to `<SimpleForm>`, to be used as child of `<Create>` or `<Edit>`. Expects `<LongForm.Section>` elements as children.

<video controls autoplay playsinline muted loop>
  <source src="./assets/ra-longform-overview.webm" type="video/webm"/>
  <source src="./assets/ra-longform-overview.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

Test it live on [the Enterprise Edition Storybook](https://react-admin.github.io/ra-enterprise/?path=/story/ra-form-layout-longform--basic).

This component will come in handy if you need to create a long form, with many input fields divided into several sections. It makes navigation easier, by providing a TOC (Table Of Contents) and by keeping the toolbar fixed at the bottom position.

```tsx
import {
    ArrayInput,
    BooleanInput,
    DateInput,
    Edit,
    required,
    SelectInput,
    SimpleFormIterator,
    TextField,
    TextInput,
    Labeled,
} from 'react-admin';
import { LongForm } from '@react-admin/ra-form-layout';

const sexChoices = [
    { id: 'male', name: 'Male' },
    { id: 'female', name: 'Female' },
];

const languageChoices = [
    { id: 'en', name: 'English' },
    { id: 'fr', name: 'French' },
];

const CustomerEdit = () => (
    <Edit component="div">
        <LongForm>
            <LongForm.Section label="Identity">
                <Labeled label="id">
                    <TextField source="id" />
                </Labeled>
                <TextInput source="first_name" validate={required()} />
                <TextInput source="last_name" validate={required()} />
                <DateInput source="dob" label="born" validate={required()} />
                <SelectInput source="sex" choices={sexChoices} />
            </LongForm.Section>
            <LongForm.Section label="Occupations">
                <ArrayInput source="occupations" label="">
                    <SimpleFormIterator>
                        <TextInput source="name" validate={required()} />
                        <DateInput source="from" validate={required()} />
                        <DateInput source="to" />
                    </SimpleFormIterator>
                </ArrayInput>
            </LongForm.Section>
            <LongForm.Section label="Preferences">
                <SelectInput
                    source="language"
                    choices={languageChoices}
                    defaultValue="en"
                />
                <BooleanInput source="dark_theme" />
                <BooleanInput source="accepts_emails_from_partners" />
            </LongForm.Section>
        </LongForm>
    </Edit>
);
```

### `toolbar`

You can customize the form Toolbar by passing a custom element in the `toolbar` prop. The form expects the same type of element as `<SimpleForm>`, see [the `<SimpleForm toolbar>` prop documentation](https://marmelab.com/react-admin/CreateEdit.html#toolbar) in the react-admin docs.

```tsx
import { Edit, SaveButton, Toolbar as RaToolbar } from 'react-admin';
import { LongForm } from '@react-admin/ra-form-layout';

const CustomerCustomToolbar = props => (
    <RaToolbar {...props}>
        <SaveButton label="Save and return" type="button" variant="outlined" />
    </RaToolbar>
);

const CustomerEditWithToolbar = () => (
    <Edit component="div">
        <LongForm toolbar={<CustomerCustomToolbar />}>
            <LongForm.Section label="Identity">...</LongForm.Section>
            <LongForm.Section label="Occupations">...</LongForm.Section>
            <LongForm.Section label="Preferences">...</LongForm.Section>
        </LongForm>
    </Edit>
);
```

### `sx`: CSS API

The `<LongForm>` component accepts the usual `className` prop. You can also override the styles of the inner components thanks to the `sx` property. This property accepts the following subclasses:

| Rule name               | Description                                                           |
| ----------------------- | --------------------------------------------------------------------- |
| `RaLongForm`            | Applied to the root component                                         |
| `& .RaLongForm-toc`     | Applied to the TOC                                                    |
| `& .RaLongForm-main`    | Applied to the main `<Card>` component                                |
| `& .RaLongForm-toolbar` | Applied to the toolbar                                                |
| `& .RaLongForm-error`   | Applied to the `<MenuItem>` in case the section has validation errors |

### `<LongForm.Section>`

The children of `<LongForm>` must be `<LongForm.Section>` elements.

This component adds a section title (using a `<Typography variant="h4">`), then renders each child inside a [MUI `<Stack>`](https://mui.com/material-ui/react-stack/), and finally adds an MUI `<Divider>` at the bottom of the section.

It accepts the following props:

| Prop          | Required | Type        | Default | Description                                                                          |
| ------------- | -------- | ----------- | ------- | ------------------------------------------------------------------------------------ |
| `label`       | Required | `string`    | -       | The main label used as the section title. Appears in red when the section has errors |
| `children`    | Required | `ReactNode` | -       | A list of `<Input>` elements                                                         |
| `cardinality` | Optional | `number`    | -       | A number to be displayed next to the label in TOC, to quantify it                    |
| `sx`          | Optional | `object`    | -       | An object containing the MUI style overrides to apply to the root component          |

#### `cardinality`

The `cardinality` prop allows to specify a numeral quantity to be displayed next to the section label in the TOC.

![LongForm.Section cardinality](./assets/ra-longform-cardinality.png)

```tsx
import React, { useEffect, useState } from 'react';
import { Edit, TextField } from 'react-admin';

import { LongForm } from '@react-admin/ra-form-layout';

const CustomerEditWithCardinality = () => {
    const [publications, setPublications] = useState([]);
    useEffect(() => {
        setTimeout(() => {
            setPublications([
                { id: 1, title: 'Publication 1' },
                { id: 2, title: 'Publication 2' },
                { id: 3, title: 'Publication 3' },
            ]);
        }, 500);
    }, []);

    return (
        <Edit component="div">
            <LongForm>
                <LongForm.Section label="Identity">...</LongForm.Section>
                <LongForm.Section label="Occupations">...</LongForm.Section>
                <LongForm.Section label="Preferences">...</LongForm.Section>
                <LongForm.Section
                    label="Publications"
                    cardinality={publications.length}
                >
                    <ul>
                        {publications.map(publication => (
                            <li key={publication.id}>
                                <TextField
                                    source="title"
                                    record={publication}
                                />
                            </li>
                        ))}
                    </ul>
                </LongForm.Section>
            </LongForm>
        </Edit>
    );
};
```

## `<CreateDialog>`, `<EditDialog>` & `<ShowDialog>`

Sometimes it makes sense to edit or create a resource without leaving the context of the list page.
For those cases, you can use the `<CreateDialog>`, `<EditDialog>` and `<ShowDialog>` components.

<video controls autoplay playsinline muted loop>
  <source src="./assets/edit-dialog.webm" type="video/webm"/>
  <source src="./assets/edit-dialog.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

They accept a single child which is the form of:

-   either a `<SimpleForm>`, a `<TabbedForm>` or a custom one (just like the `<Create>` and `<Edit>` components) for `<CreateDialog>` and `<EditDialog>`
-   either a `<SimpleShowLayout>`, a `<TabbedShowLayout>` or a custom one (just like the `<Show>` component) for `<ShowDialog>`

### Basic Usage, Based On Routing

By default, the Dialog components will use the [Router](https://marmelab.com/react-admin/Routing.html)'s location to manage their state (open or closed).

This is the easiest way to integrate them in your React-Admin app, because you don't need to manage their state manually. You only need to add them inside your List component.

Here is an example:

```tsx
import React from 'react';
import {
    List,
    Datagrid,
    SimpleForm,
    SimpleShowLayout,
    TextField,
    TextInput,
    DateInput,
    DateField,
    required,
    ShowButton,
} from 'react-admin';
import {
    EditDialog,
    CreateDialog,
    ShowDialog,
} from '@react-admin/ra-form-layout';

const CustomerList = () => (
    <>
        <List hasCreate>
            <Datagrid rowClick="edit">
                ...
                <ShowButton />
            </Datagrid>
        </List>
        <EditDialog>
            <SimpleForm>
                <TextField source="id" />
                <TextInput source="first_name" validate={required()} />
                <TextInput source="last_name" validate={required()} />
                <DateInput
                    source="date_of_birth"
                    label="born"
                    validate={required()}
                />
            </SimpleForm>
        </EditDialog>
        <CreateDialog>
            <SimpleForm>
                <TextField source="id" />
                <TextInput source="first_name" validate={required()} />
                <TextInput source="last_name" validate={required()} />
                <DateInput
                    source="date_of_birth"
                    label="born"
                    validate={required()}
                />
            </SimpleForm>
        </CreateDialog>
        <ShowDialog>
            <SimpleShowLayout>
                <TextField source="id" />
                <TextField source="first_name" />
                <TextField source="last_name" />
                <DateField source="date_of_birth" label="born" />
            </SimpleShowLayout>
        </ShowDialog>
    </>
);
```

**Tip:** In the example above, we added the `hasCreate` prop to the `<List>` component. This is necessary in order to display the "Create" button, because react-admin has no way to know that there exists a creation form for the "customer" resource otherwise.

**Note**: You can't use the `<CreateDialog>` and have a standard `<Edit>` specified on your `<Resource>`, because the `<Routes>` declarations would conflict. If you need this, use the `<CreateInDialogButton>` instead.

### `<CreateInDialogButton>`, `<EditInDialogButton>` and `<ShowInDialogButton>`

In some cases, you might want to use these dialog components outside the List component. For instance, you might want to have an `<Edit>` view, including a `<Datagrid>`, for which you would like the ability to view, edit or add records using dialog components.

For this purpose, we also provide `<CreateInDialogButton>`, `<EditInDialogButton>` and `<ShowInDialogButton>`.

<video controls autoplay playsinline muted loop>
  <source src="./assets/InDialogButtons.webm" type="video/webm"/>
  <source src="./assets/InDialogButtons.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

These components will create a dialog component (`<CreateDialog>`, `<EditDialog>` or `<ShowDialog>` respectively), along with a `<Button>` to open them.

These components are also responsible for creating a `<FormDialogContext>`, used to manage the dialog's state (open or closed), inside which the dialog component will render.

Here is an implementation example:

```tsx
import React, { ReactNode } from 'react';
import {
    Datagrid,
    DateField,
    DateInput,
    Edit,
    ReferenceManyField,
    required,
    SelectField,
    SelectInput,
    SimpleForm,
    SimpleShowLayout,
    TextField,
    TextInput,
    useRecordContext,
} from 'react-admin';
import {
    CreateInDialogButton,
    EditInDialogButton,
    ShowInDialogButton,
} from '@react-admin/ra-form-layout';

const sexChoices = [
    { id: 'male', name: 'Male' },
    { id: 'female', name: 'Female' },
];

const CustomerForm = (props: any) => (
    <SimpleForm defaultValues={{ firstname: 'John', name: 'Doe' }} {...props}>
        <TextInput source="first_name" validate={required()} fullWidth />
        <TextInput source="last_name" validate={required()} fullWidth />
        <DateInput source="dob" label="born" validate={required()} fullWidth />
        <SelectInput source="sex" choices={sexChoices} fullWidth />
    </SimpleForm>
);

const CustomerLayout = (props: any) => (
    <SimpleShowLayout {...props}>
        <TextField source="first_name" fullWidth />
        <TextField source="last_name" fullWidth />
        <DateField source="dob" label="born" fullWidth />
        <SelectField source="sex" choices={sexChoices} fullWidth />
    </SimpleShowLayout>
);

// helper component to add actions buttons in a column (children),
// and also in the header (label) of a Datagrid
const DatagridActionsColumn = ({
    label,
    children,
}: {
    label: ReactNode;
    children: ReactNode;
}) => <>{children}</>;

const NestedCustomersDatagrid = () => {
    const record = useRecordContext();

    const createButton = (
        <CreateInDialogButton
            inline
            fullWidth
            maxWidth="md"
            record={{ employer_id: record?.id }} // pre-populates the employer_id to link the new customer to the current employer
        >
            <CustomerForm />
        </CreateInDialogButton>
    );

    const editButton = (
        <EditInDialogButton fullWidth maxWidth="md">
            <CustomerForm />
        </EditInDialogButton>
    );

    const showButton = (
        <ShowInDialogButton fullWidth maxWidth="md">
            <CustomerLayout />
        </ShowInDialogButton>
    );

    return (
        <ReferenceManyField
            label="Customers"
            reference="customers"
            target="employer_id"
        >
            <Datagrid>
                <TextField source="id" />
                <TextField source="first_name" />
                <TextField source="last_name" />
                <DateField source="dob" label="born" />
                <SelectField source="sex" choices={sexChoices} />
                {/* Using a component as label is a trick to render it in the Datagrid header */}
                <DatagridActionsColumn label={createButton}>
                    {editButton}
                    {showButton}
                </DatagridActionsColumn>
            </Datagrid>
        </ReferenceManyField>
    );
};

const EmployerEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="name" validate={required()} />
            <TextInput source="address" validate={required()} />
            <TextInput source="city" validate={required()} />
            <NestedCustomersDatagrid />
        </SimpleForm>
    </Edit>
);
```

These components accept the following props:

-   `inline`: set to `true` to display only an MUI `<IconButton>` instead of the full `<Button>`. The label will still be available as a `<Tooltip>` though.
-   `icon`: allows to override the default icon.
-   `label`: allows to override the default button label. I18N is supported.
-   `ButtonProps`: object containing props to pass to [MUI's `<Button>`](https://mui.com/material-ui/react-button/).
-   remaining props will be passed to the corresponding dialog component (`<CreateDialog>`, `<EditDialog>` or `<ShowDialog>`).

### Standalone Usage

`<CreateDialog>`, `<EditDialog>` and `<ShowDialog>` also offer the ability to work standalone, without using the Router's location.

To allow for standalone usage, they require the following props:

-   `isOpen`: a boolean holding the open/close state
-   `open`: a function that will be called when a component needs to open the dialog (e.g. a button)
-   `close`: a function that will be called when a component needs to close the dialog (e.g. the dialog's close button)

**Tip:** These props are exactly the same as what is stored inside a `FormDialogContext`. This means that you can also rather provide your own `FormDialogContext` with these values, and render your dialog component inside it, to activate standalone mode.

Below is an example of an `<Edit>` page, including a 'create a new customer' button, that opens a fully controlled `<CreateDialog>`.

<video controls autoplay playsinline muted loop>
  <source src="./assets/FullyControlledCreateDialog.webm" type="video/webm"/>
  <source src="./assets/FullyControlledCreateDialog.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

```tsx
import React, { useCallback, useState } from 'react';
import {
    Button,
    Datagrid,
    DateField,
    DateInput,
    Edit,
    ReferenceManyField,
    required,
    SelectField,
    SelectInput,
    SimpleForm,
    TextField,
    TextInput,
    useRecordContext,
} from 'react-admin';
import { CreateDialog } from '@react-admin/ra-form-layout';

const sexChoices = [
    { id: 'male', name: 'Male' },
    { id: 'female', name: 'Female' },
];

const CustomerForm = (props: any) => (
    <SimpleForm defaultValues={{ firstname: 'John', name: 'Doe' }} {...props}>
        <TextInput source="first_name" validate={required()} fullWidth />
        <TextInput source="last_name" validate={required()} fullWidth />
        <DateInput source="dob" label="born" validate={required()} fullWidth />
        <SelectInput source="sex" choices={sexChoices} fullWidth />
    </SimpleForm>
);

const EmployerSimpleFormWithFullyControlledDialogs = () => {
    const record = useRecordContext();

    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const openCreateDialog = useCallback(() => {
        setIsCreateDialogOpen(true);
    }, []);
    const closeCreateDialog = useCallback(() => {
        setIsCreateDialogOpen(false);
    }, []);

    return (
        <SimpleForm>
            <TextInput source="name" validate={required()} />
            <TextInput source="address" validate={required()} />
            <TextInput source="city" validate={required()} />
            <Button
                label="Create a new customer"
                onClick={() => openCreateDialog()}
                size="medium"
                variant="contained"
                sx={{ mb: 4 }}
            />
            <CreateDialog
                fullWidth
                maxWidth="md"
                record={{ employer_id: record?.id }} // pre-populates the employer_id to link the new customer to the current employer
                isOpen={isCreateDialogOpen}
                open={openCreateDialog}
                close={closeCreateDialog}
                resource="customers"
            >
                <CustomerForm />
            </CreateDialog>
            <ReferenceManyField
                label="Customers"
                reference="customers"
                target="employer_id"
            >
                <Datagrid>
                    <TextField source="id" />
                    <TextField source="first_name" />
                    <TextField source="last_name" />
                    <DateField source="dob" label="born" />
                    <SelectField source="sex" choices={sexChoices} />
                </Datagrid>
            </ReferenceManyField>
        </SimpleForm>
    );
};

const EmployerEdit = () => (
    <Edit>
        <EmployerSimpleFormWithFullyControlledDialogs />
    </Edit>
);
```

### `title`

Unlike the `<Create>`, `<Edit>` and `<Show>` components, with Dialog components the title will be displayed in the `<Dialog>`, not in the `<AppBar>`.

Still, for `<EditDialog>` and `<ShowDialog>`, if you pass a custom title component, it will render in the same `RecordContext` as the dialog's child component. That means you can display non-editable details of the current `record` in the title component.

Here is an example:

```tsx
import React from 'react';
import {
    List,
    Datagrid,
    SimpleForm,
    SimpleShowLayout,
    TextField,
    TextInput,
    DateInput,
    DateField,
    required,
    ShowButton,
    useRecordContext,
} from 'react-admin';
import {
    EditDialog,
    CreateDialog,
    ShowDialog,
} from '@react-admin/ra-form-layout';

const CustomerEditTitle = () => {
    const record = useRecordContext();
    return record ? (
        <span>
            Edit {record.last_name} {record.first_name}
        </span>
    ) : null;
};

const CustomerShowTitle = () => {
    const record = useRecordContext();
    return record ? (
        <span>
            Show {record.last_name} {record.first_name}
        </span>
    ) : null;
};

const CustomerList = () => (
    <>
        <List hasCreate>
            <Datagrid rowClick="edit">
                ...
                <ShowButton />
            </Datagrid>
        </List>
        <EditDialog title={<CustomerEditTitle />}>
            <SimpleForm>
                <TextField source="id" />
                <TextInput source="first_name" validate={required()} />
                <TextInput source="last_name" validate={required()} />
                <DateInput
                    source="date_of_birth"
                    label="born"
                    validate={required()}
                />
            </SimpleForm>
        </EditDialog>
        <CreateDialog title="Create a new customer">
            <SimpleForm>
                <TextField source="id" />
                <TextInput source="first_name" validate={required()} />
                <TextInput source="last_name" validate={required()} />
                <DateInput
                    source="date_of_birth"
                    label="born"
                    validate={required()}
                />
            </SimpleForm>
        </CreateDialog>
        <ShowDialog title={<CustomerShowTitle />}>
            <SimpleShowLayout>
                <TextField source="id" />
                <TextField source="first_name" />
                <TextField source="last_name" />
                <DateField source="date_of_birth" label="born" />
            </SimpleShowLayout>
        </ShowDialog>
    </>
);
```

### Customizing The Dialog

You can also pass the props accepted by the MUI [`<Dialog>`](https://mui.com/api/dialog/) component, like `fullWidth` or `maxWidth`, directly to `<CreateDialog>`, `<EditDialog>` or `<ShowDialog>`.

```tsx
import React from 'react';
import {
    List,
    Datagrid,
    SimpleForm,
    SimpleShowLayout,
    TextField,
    TextInput,
    DateInput,
    DateField,
    required,
    ShowButton,
} from 'react-admin';
import {
    EditDialog,
    CreateDialog,
    ShowDialog,
} from '@react-admin/ra-form-layout';

const CustomerList = () => (
    <>
        <List hasCreate>
            <Datagrid rowClick="edit">
                ...
                <ShowButton />
            </Datagrid>
        </List>
        <EditDialog fullWidth maxWidth="md">
            <SimpleForm>
                <TextField source="id" />
                <TextInput source="first_name" validate={required()} />
                <TextInput source="last_name" validate={required()} />
                <DateInput
                    source="date_of_birth"
                    label="born"
                    validate={required()}
                />
            </SimpleForm>
        </EditDialog>
        <CreateDialog fullWidth maxWidth="md">
            <SimpleForm>
                <TextField source="id" />
                <TextInput source="first_name" validate={required()} />
                <TextInput source="last_name" validate={required()} />
                <DateInput
                    source="date_of_birth"
                    label="born"
                    validate={required()}
                />
            </SimpleForm>
        </CreateDialog>
        <ShowDialog fullWidth maxWidth="md">
            <SimpleShowLayout>
                <TextField source="id" />
                <TextField source="first_name" />
                <TextField source="last_name" />
                <DateField source="date_of_birth" label="born" />
            </SimpleShowLayout>
        </ShowDialog>
    </>
);
```

## `<StackedFilters>`

`<StackedFilters>` is an alternative filter component for `<List>`. It introduces the concept of operators to allow richer filtering.

<video controls autoplay playsinline muted loop>
  <source src="./assets/stackedfilters-overview.webm" type="video/webm"/>
  <source src="./assets/stackedfilters-overview.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

### Usage

```tsx
import {
    BooleanField,
    CreateButton,
    Datagrid,
    List,
    NumberField,
    ReferenceArrayField,
    TextField,
    TopToolbar,
} from 'react-admin';
import {
    StackedFilters,
    FiltersConfig,
    textFilter,
    numberFilter,
    referenceFilter,
    booleanFilter,
} from '@react-admin/ra-form-layout';

const postListFilters: FiltersConfig = {
    title: textFilter(),
    views: numberFilter(),
    tag_ids: referenceFilter({ reference: 'tags' }),
    published: booleanFilter(),
};

const PostListToolbar = () => (
    <TopToolbar>
        <CreateButton />
        <StackedFilters config={postListFilters} />
    </TopToolbar>
);

const PostList = () => (
    <List actions={<PostListToolbar />}>
        <Datagrid>
            <TextField source="title" />
            <NumberField source="views" />
            <ReferenceArrayField tags="tags" source="tag_ids" />
            <BooleanField source="published" />
        </Datagrid>
    </List>
);
```

### Filters Configuration

`<StackedFilters>` and its underlying component, `<StackedFiltersForm>` needs a filter configuration. This is an object defining the operators and UI for each source that can be used as a filter.

It looks like this:

```tsx
import { FiltersConfig } from '@react-admin/ra-form-layout';
import { NumberInput } from 'react-admin';
import { MyNumberRangeInput } from './MyNumberRangeInput';

const postListFilters: FiltersConfig = {
    views: {
        operators: [
            { value: 'eq', label: 'Equals' },
            { value: 'neq', label: 'Not Equals' },
            {
                value: 'between',
                label: 'Between',
                input: ({ source }) => <MyNumberRangeInput source={source} />,
            },
        ],
        input: ({ source }) => <NumberInput source={source} />,
    },
};
```

As you can see, the `source` is the `config` object key. It contains an array of `operators` and a default `input`, used for operators that don't define their own.

An operator is an object that has a `label` and a `value`. The `label` can be a translation key. The `value` will be used as a suffix to the `source` and passed to the list filters. For instance, with the source `views`, the operator `eq` and value set to `0` using the `NumberInput`, the dataProvider will receive the following filter:

```js
{
    views_eq: 0;
}
```

Besides, any operator can provide its own input if it needs.

### Filter Configuration Builders

To make it easier to create a filter configuration, we provide some helper functions. Each of them has predefined operators and inputs. They accept an array of operators if you want to remove some of them.

-   `textFilter`: A filter for text fields. Defines the following operator: `eq`, `neq` and `q`.
-   `numberFilter`: A filter for number fields. Defines the following operator: `eq`, `neq`, `lt` and `gt`.
-   `dateFilter`: A filter for date fields. Defines the following operator: `eq`, `neq`, `lt` and `gt`.
-   `booleanFilter`: A filter for boolean fields. Defines the following operator: `eq`.
-   `choicesFilter`: A filter for fields that accept a value from a list of choices. Defines the following operator: `eq`, `neq`, `eq_any` and `neq_any`.
-   `choicesArrayFilter`: A filter for array fields. Defines the following operator: `inc`, `inc_any` and `ninc_any`.
-   `referenceFilter`: A filter for reference fields. Defines the following operator: `eq`, `neq`, `eq_any` and `neq_any`.

Build your filter configuration by calling the helpers for each source:

```tsx
import {
    FiltersConfig,
    textFilter,
    numberFilter,
    referenceFilter,
    booleanFilter,
} from '@react-admin/ra-form-layout';

const postListFilters: FiltersConfig = {
    title: textFilter(),
    views: numberFilter(),
    tag_ids: referenceFilter({ reference: 'tags' }),
    published: booleanFilter(),
};
```

### Internationalization

The source field names are translatable. `ra-form-layout` uses the react-admin [resource and field name translation system](https://marmelab.com/react-admin/Translation.html#translating-resource-and-field-names). This is an example of an English translation file:

```ts
// in i18n/en.js

export default {
    resources: {
        customer: {
            name: 'Customer |||| Customers',
            fields: {
                first_name: 'First name',
                last_name: 'Last name',
                dob: 'Date of birth',
            },
        },
    },
};
```

`ra-form-layout` also supports internationalization for operators. To leverage it, pass a translation key as the operator label:

```tsx
import { FiltersConfig } from '@react-admin/ra-form-layout';
import DateRangeInput from './DateRangeInput';

const MyFilterConfig: FiltersConfig = {
    published_at: {
        operators: [
            {
                value: 'between',
                label: 'resources.posts.filters.operators.between',
            },
            {
                value: 'nbetween',
                label: 'resources.posts.filters.operators.nbetween',
            },
        ],
        input: ({ source }) => <DateRangeInput source={source} />,
    },
};
```

### `<StackedFilters>`

This component is responsible for showing the Filters button that displays the filtering form inside a MUI Popover. It must be given the [filtering configuration](#filters-configuration) through its `config` prop.

```tsx
import {
    BooleanField,
    CreateButton,
    Datagrid,
    List,
    NumberField,
    ReferenceArrayField,
    TopToolbar
    TextField,
} from 'react-admin';
import {
    StackedFilters,
    FiltersConfig,
    textFilter,
    numberFilter,
    referenceFilter,
    booleanFilter,
} from '@react-admin/ra-form-layout';

const postListFilters: FiltersConfig = {
    title: textFilter(),
    views: numberFilter(),
    tag_ids: referenceFilter({ reference: 'tags' }),
    published: booleanFilter(),
};

const PostListToolbar = () => (
    <TopToolbar>
        <CreateButton />
        <StackedFilters config={postListFilters} />
    </TopToolbar>
);

const PostList = () => (
    <List actions={<PostListToolbar />}>
        <Datagrid>
            <TextField source="title" />
            <NumberField source="views" />
            <ReferenceArrayField tags="tags" source="tag_ids" />
            <BooleanField source="published" />
        </Datagrid>
    </List>
);
```

#### Props

| Prop                      | Required      | Type     | Default         | Description                                            |
| ------------------------- | ------------- | -------- | --------------- | ------------------------------------------------------ |
| `BadgeProps`              | Optional      | object   | -               | Additional props to pass to the [MUI Badge](https://mui.com/material-ui/react-badge/)       |
| `ButtonProps`             | Optional      | object   | -               | Additional props to pass to the [Button](https://marmelab.com/react-admin/Buttons.html#button) |
| `className`               | Optional      | string   | -               | Additional CSS class applied on the root component                                              |
| `config`                  | Required (\*) | object   | -               | The stacked filters configuration                                          |
| `PopoverProps`            | Optional      | Object   | -               | Additional props to pass to the [MUI Popover](https://mui.com/material-ui/react-popover/)   |
| `StackedFiltersFormProps` | Optional      | Object   | -               | Additional props to pass to the [StackedFiltersForm](#stackedfiltersform)              |
| `sx`                      | Optional      | Object   | -               | An object containing the MUI style overrides to apply to the root component               |

#### `BadgeProps`

This prop lets you pass additional props for the [MUI Badge](https://mui.com/material-ui/react-badge/).

```tsx
import { StackedFilters, StackedFiltersProps } from '@react-admin/ra-form-layout';

export const MyStackedFilter = (props: StackedFiltersProps) => (
    <StackedFilters {...props} BadgeProps={{ showZero: true }} />
);
```

#### `ButtonProps`

This prop lets you pass additional props for the [Button](https://marmelab.com/react-admin/Buttons.html#button).

```tsx
import { StackedFilters, StackedFiltersProps } from '@react-admin/ra-form-layout';

export const MyStackedFilter = (props: StackedFiltersProps) => (
    <StackedFilters {...props} ButtonProps={{ variant: 'contained' }} />
);
```

#### `className`

This prop lets you pass additional CSS classes to apply to the root element (a `div`).

```tsx
import { StackedFilters, StackedFiltersProps } from '@react-admin/ra-form-layout';

export const MyStackedFilter = (props: StackedFiltersProps) => (
    <StackedFilters {...props} className="my-css-class" />
);
```

#### `config`

This prop lets you define the filter configuration, which is required. This is an object defining the operators and UI for each source that can be used as a filter:

```tsx
import { FiltersConfig, StackedFilters } from '@react-admin/ra-form-layout';
import { NumberInput } from 'react-admin';
import { MyNumberRangeInput } from './MyNumberRangeInput';

const postListFilters: FiltersConfig = {
    views: {
        operators: [
            { value: 'eq', label: 'Equals' },
            { value: 'neq', label: 'Not Equals' },
            {
                value: 'between',
                label: 'Between',
                input: ({ source }) => <MyNumberRangeInput source={source} />,
            },
        ],
        input: ({ source }) => <NumberInput source={source} />,
    },
};

export const MyStackedFilter = (props: StackedFiltersProps) => (
    <StackedFilters {...props} config={postListFilters} />
);
```

#### `PopoverProps`

This prop lets you pass additional props for the [MUI Popover](https://mui.com/material-ui/react-popover/).

```tsx
import { StackedFilters, StackedFiltersProps } from '@react-admin/ra-form-layout';

export const MyStackedFilter = (props: StackedFiltersProps) => (
    <StackedFilters {...props} PopoverProps={{ elevation: 4 }} />
);
```

#### `StackedFiltersFormProps`

This prop lets you pass additional props for the [StackedFiltersForm](#stackedfiltersform).

```tsx
import { StackedFilters, StackedFiltersProps } from '@react-admin/ra-form-layout';

export const MyStackedFilter = (props: StackedFiltersProps) => (
    <StackedFilters {...props} StackedFiltersForm={{ className: 'my-css-class' }} />
);
```

#### `sx`: CSS API

This prop lets you override the styles of the inner components thanks to the `sx` property. This property accepts the following subclasses:

| Rule name                           | Description                                                              |
| ----------------------------------- | ------------------------------------------------------------------------ |
| `RaStackedFilters`                  | Applied to the root component                                            |
| `& .RaStackedFilters-popover`       | Applied to the [MUI Popover](https://mui.com/material-ui/react-popover/) |
| `& .RaStackedFilters-formContainer` | Applied to the form container (a `div`)                                  |

### `<StackedFiltersForm>`

This component is responsible for handling the filtering form. It must be given the [filtering configuration](#filters-configuration) through its `config` prop.

If you need to be notified when users have applied filters, pass a function to the `onFiltersApplied` prop. This is useful if you want to close the filters container (`<Modal>`, `<Drawer>`, etc.).

```tsx
import {
    Datagrid,
    List,
    TextField,
    NumberField,
    BooleanField,
    ReferenceArrayField,
} from 'react-admin';
import {
    StackedFiltersForm,
    FiltersConfig,
    textFilter,
    numberFilter,
    referenceFilter,
    booleanFilter,
} from '@react-admin/ra-editable-datagrid';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Card,
    Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const postListFilters: FiltersConfig = {
    title: textFilter(),
    views: numberFilter(),
    tag_ids: referenceFilter({ reference: 'tags' }),
    published: booleanFilter(),
};

const PostList = () => (
    <ListBase>
        <Accordion sx={{ my: 1 }}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="filters-content"
                id="filters-header"
            >
                <Typography>Filters</Typography>
            </AccordionSummary>
            <AccordionDetails id="filters-content">
                <StackedFiltersForm config={postListFilters} />
            </AccordionDetails>
        </Accordion>
        <Card>
            <Datagrid>
                <TextField source="title" />
                <NumberField source="views" />
                <ReferenceArrayField tags="tags" source="tag_ids" />
                <BooleanField source="published" />
            </Datagrid>
        </Card>
    </ListBase>
);
```

#### Props

| Prop                      | Required      | Type     | Default         | Description                                            |
| ------------------------- | ------------- | -------- | --------------- | ------------------------------------------------------ |
| `className`               | Optional      | string   | -               | Additional CSS class applied on the root component                                              |
| `config`                  | Required (\*) | object   | -               | The stacked filters configuration                                          |
| `onFiltersApplied`        | Optional      | Function | -               | A function called when users click on the apply button                                           |
| `sx`                      | Optional      | Object   | -               | An object containing the MUI style overrides to apply to the root component               |

#### `className`

This prop lets you pass additional CSS classes to apply to the root element (a `Form`).

```tsx
import { StackedFiltersForm, StackedFiltersFormProps } from '@react-admin/ra-form-layout';

export const MyStackedFilterForm = (props: StackedFiltersFormProps) => (
    <StackedFiltersForm {...props} className="my-css-class" />
);
```

#### `config`

This prop lets you define the filter configuration, which is required. This is an object defining the operators and UI for each source that can be used as a filter:

```tsx
import { FiltersConfig, StackedFiltersForm, StackedFiltersFormProps } from '@react-admin/ra-form-layout';
import { NumberInput } from 'react-admin';
import { MyNumberRangeInput } from './MyNumberRangeInput';

const postListFilters: FiltersConfig = {
    views: {
        operators: [
            { value: 'eq', label: 'Equals' },
            { value: 'neq', label: 'Not Equals' },
            {
                value: 'between',
                label: 'Between',
                input: ({ source }) => <MyNumberRangeInput source={source} />,
            },
        ],
        input: ({ source }) => <NumberInput source={source} />,
    },
};

export const MyStackedFiltersForm = (props: StackedFiltersFormProps) => (
    <StackedFiltersForm {...props} config={postListFilters} />
);
```

#### `onFiltersApplied`

This prop lets you provide a function that will be called when users click the apply button:

```tsx
import { FiltersConfig, StackedFiltersForm } from '@react-admin/ra-form-layout';

export const MyStackedFiltersForm = (props: StackedFiltersProps) => (
    <StackedFiltersForm {...props} onFiltersApplied={() => alert('Filters applied')} />
);
```

#### `sx`: CSS API

This prop lets you override the styles of the inner components thanks to the `sx` property. This property accepts the following subclasses:

| Rule name                               | Description                                                          |
| --------------------------------------- | -------------------------------------------------------------------- |
| `RaStackedFiltersForm`                  | Applied to the root component                                                     |
| `& .RaStackedFiltersForm-sourceInput`   | Applied to the [AutocompleteInput](https://marmelab.com/react-admin/AutocompleteInput.html) that allows users to select the field |
| `& .RaStackedFiltersForm-operatorInput`   | Applied to the [SelectInput](https://marmelab.com/react-admin/SelectInput.html) that allows users to select the field       |
| `& .RaStackedFiltersForm-valueInput`    | Applied to the input that allows users to set  the filter value                                                         |

## `<AutoSave>`

A component that enables autosaving of the form. It's ideal for long data entry tasks, and reduces the risk of data loss.

<video controls autoplay playsinline muted loop>
  <source src="./assets/AutoSave.webm" type="video/webm"/>
  <source src="./assets/AutoSave.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

### Usage

Put `<AutoSave>` inside a react-admin form (`<SimpleForm>`, `<TabbedForm>`, `<LongForm>`, etc.), for instance in a custom toolbar.

Note that you **must** set the `<Form resetOptions>` prop to `{ keepDirtyValues: true }`. If you forget that prop, any change entered by the end user after the autosave but before its acknowledgement by the server will be lost.

If you're using it in an `<Edit>` page, you must also use a `pessimistic` or `optimistic` [`mutationMode`](https://marmelab.com/react-admin/Edit.html#mutationmode) - `<AutoSave>` doesn't work with the default `mutationMode="undoable"`.

```tsx
import { AutoSave } from '@react-admin/ra-form-layout';
import { Edit, SaveButton, SimpleForm, TextInput, Toolbar } from 'react-admin';

const AutoSaveToolbar = () => (
    <Toolbar>
        <SaveButton />
        <AutoSave />
    </Toolbar>
);

const PostEdit = () => (
    <Edit mutationMode="optimistic">
        <SimpleForm
            resetOptions={{ keepDirtyValues: true }}
            toolbar={<AutoSaveToolbar />}
        >
            <TextInput source="title" />
            <TextInput source="teaser" />
        </SimpleForm>
    </Edit>
);
```

The app will save the current form values after 3 seconds of inactivity.

### Props

-   `debounce`: The interval in milliseconds between two autosaves. Defaults to 3000 (3s).
-   `confirmationDuration`: The delay in milliseconds before save confirmation message disappears. Defaults to 3000 (3s). When set to `false`, the confirmation message will not disappear.
-   `typographyProps`: Additional props to pass to the `<Typography>` component that displays the confirmation and error messages.

## `useAutoSave`

A hook that automatically saves the form at a regular interval. It works for the `pessimistic` and `optimistic` [`mutationMode`](https://marmelab.com/react-admin/Edit.html#mutationmode) but not for the `undoable`.

It accepts the following parameters:

-   `debounce`: The interval in ms between two saves. Defaults to 3000 (3s).
-   `onSuccess`: A callback to call when the save request succeeds.
-   `onError`: A callback to call when the save request fails.
-   `transform`: A function to transform the data before saving.

Note that you **must** add the `resetOptions` prop with `{ keepDirtyValues: true }` to avoid having the user changes overridden by the latest update operation result.

```tsx
import { useAutoSave } from '@react-admin/ra-form-layout';
import { Edit, SaveButton, SimpleForm, TextInput, Toolbar } from 'react-admin';

const AutoSave = () => {
    const [lastSave, setLastSave] = useState();
    const [error, setError] = useState();
    useAutoSave({
        interval: 5000,
        onSuccess: () => setLastSave(new Date()),
        onError: error => setError(error),
    });
    return (
        <div>
            {lastSave && <p>Saved at {lastSave.toLocaleString()}</p>}
            {error && <p>Error: {error}</p>}
        </div>
    );
};

const AutoSaveToolbar = () => (
    <Toolbar>
        <SaveButton />
        <AutoSave />
    </Toolbar>
);

const PostEdit = () => (
    <Edit mutationMode="optimistic">
        <SimpleForm
            resetOptions={{ keepDirtyValues: true }}
            toolbar={<AutoSaveToolbar />}
        >
            <TextInput source="title" />
            <TextInput source="teaser" />
        </SimpleForm>
    </Edit>
);
```

`useAutoSave` returns a boolean indicating whether the form is currently being saved.

```jsx
const isSaving = useAutoSave({
    interval: 5000,
    onSuccess: () => setLastSave(new Date()),
    onError: error => setError(error),
});
```

## `<BulkUpdateFormButton>`

This component renders a button allowing to edit multiple records at once.

The button opens a dialog containing the form passed as children. When the form is submitted, it will call the dataProvider's `updateMany` method with the ids of the selected records.

<video controls autoplay playsinline muted loop>
  <source src="./assets/BulkUpdateButton-SimpleForm.webm" type="video/webm"/>
  <source src="./assets/BulkUpdateButton-SimpleForm.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

### Usage

`<BulkUpdateFormButton>` can be used inside `<Datagrid>`'s `bulkActionButtons`.

```tsx
import * as React from 'react';
import {
    Admin,
    BooleanField,
    BooleanInput,
    Datagrid,
    DateField,
    DateInput,
    List,
    Resource,
    SimpleForm,
    TextField,
} from 'react-admin';
import { BulkUpdateFormButton } from '@react-admin/ra-form-layout';

import { dataProvider } from './dataProvider';
import { i18nProvider } from './i18nProvider';

export const App = () => (
    <Admin dataProvider={dataProvider} i18nProvider={i18nProvider}>
        <Resource name="posts" list={PostList} />
    </Admin>
);

const PostBulkUpdateButton = () => (
    <BulkUpdateFormButton>
        <SimpleForm>
            <DateInput source="published_at" />
            <BooleanInput source="is_public" />
        </SimpleForm>
    </BulkUpdateFormButton>
);

const PostList = () => (
    <List>
        <Datagrid bulkActionButtons={<PostBulkUpdateButton />}>
            <TextField source="id" />
            <TextField source="title" />
            <DateField source="published_at" />
            <BooleanField source="is_public" />
        </Datagrid>
    </List>
);
```

**Tip:** You are not limited to using a `<SimpleForm>` as children. You can for instance use an `<InputSelectorForm>`, which allows to select the fields to update.

```tsx
import {
    BulkUpdateFormButton,
    InputSelectorForm,
} from '@react-admin/ra-form-layout';
import * as React from 'react';
import { BooleanInput, DateInput } from 'react-admin';

const PostBulkUpdateButton = () => (
    <BulkUpdateFormButton>
        <InputSelectorForm
            inputs={[
                {
                    label: 'Published at',
                    element: <DateInput source="published_at" />,
                },
                {
                    label: 'Is public',
                    element: <BooleanInput source="is_public" />,
                },
            ]}
        />
    </BulkUpdateFormButton>
);
```

Check out the [`<InputSelectorForm>`](#inputselectorform) documentation for more information.

### Props

| Prop              | Required      | Type     | Default         | Description                                                                                                                        |
| ----------------- | ------------- | -------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `children`        | Required (\*) | Element  | -               | A form component to render inside the Dialog                                                                                       |
| `DialogProps`     | -             | Object   | -               | Additional props to pass to the [MUI Dialog](https://mui.com/material-ui/react-dialog/)                                            |
| `mutationMode`    | -             | `string` | `'pessimistic'` | The mutation mode (`'undoable'`, `'pessimistic'` or `'optimistic'`)                                                                |
| `mutationOptions` | -             | Object   | -               | Mutation options passed to [react-query](https://tanstack.com/query/v3/docs/react/reference/useMutation) when calling `updateMany` |

### `children`

`<BulkUpdateFormButton>` expects a form component as children, such as `<SimpleForm>` or `<InputSelectorForm>`.

```tsx
import { BulkUpdateFormButton } from '@react-admin/ra-form-layout';
import * as React from 'react';
import { BooleanInput, DateInput, SimpleForm } from 'react-admin';

const PostBulkUpdateButton = () => (
    <BulkUpdateFormButton>
        <SimpleForm>
            <DateInput source="published_at" />
            <BooleanInput source="is_public" />
        </SimpleForm>
    </BulkUpdateFormButton>
);
```

### `DialogProps`

The `DialogProps` prop can be used to pass additional props to the [MUI Dialog](https://mui.com/material-ui/react-dialog/).

```tsx
import { Slide } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { BulkUpdateFormButton } from '@react-admin/ra-form-layout';
import * as React from 'react';
import { BooleanInput, DateInput, SimpleForm } from 'react-admin';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="left" ref={ref} {...props} />;
});

const PostBulkUpdateButtonWithTransition = () => (
    <BulkUpdateFormButton DialogProps={{ TransitionComponent: Transition }}>
        <SimpleForm>
            <DateInput source="published_at" />
            <BooleanInput source="is_public" />
        </SimpleForm>
    </BulkUpdateFormButton>
);
```

### `mutationMode`

Use the `mutationMode` prop to specify the [mutation mode](https://marmelab.com/react-admin/Edit.html#mutationmode).

```tsx
import { BulkUpdateFormButton } from '@react-admin/ra-form-layout';
import * as React from 'react';
import { BooleanInput, DateInput, SimpleForm } from 'react-admin';

const PostBulkUpdateButton = () => (
    <BulkUpdateFormButton mutationMode="undoable">
        <SimpleForm>
            <DateInput source="published_at" />
            <BooleanInput source="is_public" />
        </SimpleForm>
    </BulkUpdateFormButton>
);
```

### `mutationOptions` and `meta`

The `mutationOptions` prop can be used to pass options to the [react-query mutation](https://react-query.tanstack.com/reference/useMutation#options) used to call the dataProvider's `updateMany` method.

```tsx
import { BulkUpdateFormButton } from '@react-admin/ra-form-layout';
import * as React from 'react';
import { BooleanInput, DateInput, SimpleForm } from 'react-admin';

const PostBulkUpdateButton = () => (
    <BulkUpdateFormButton mutationOptions={{ retry: false }}>
        <SimpleForm>
            <DateInput source="published_at" />
            <BooleanInput source="is_public" />
        </SimpleForm>
    </BulkUpdateFormButton>
);
```

You can also use this prop to pass a `meta` object, that will be passed to the dataProvider when calling `updateMany`.

```tsx
import { BulkUpdateFormButton } from '@react-admin/ra-form-layout';
import * as React from 'react';
import { BooleanInput, DateInput, SimpleForm } from 'react-admin';

const PostBulkUpdateButton = () => (
    <BulkUpdateFormButton mutationOptions={{ meta: { foo: 'bar' } }}>
        <SimpleForm>
            <DateInput source="published_at" />
            <BooleanInput source="is_public" />
        </SimpleForm>
    </BulkUpdateFormButton>
);
```

### Usage with `<TabbedForm>` or other location based form layouts

`<BulkUpdateFormButton>` can be used with any form layout. However, for form layouts that are based on location by default, such as [`<TabbedForm>`](https://marmelab.com/react-admin/TabbedForm.html), you will need to disable the location syncing feature, as it may conflict with the Edit route declared by React Admin (`/<resource>/<id>`).

For instance, with `<TabbedForm>`, you can use the `syncWithLocation` prop to disable it:

```tsx
import { BulkUpdateFormButton } from '@react-admin/ra-form-layout';
import * as React from 'react';
import { BooleanInput, DateInput, TabbedForm } from 'react-admin';

const PostBulkUpdateButton = () => (
    <BulkUpdateFormButton>
        <TabbedForm syncWithLocation={false}>
            <TabbedForm.Tab label="Publication">
                <DateInput source="published_at" />
            </TabbedForm.Tab>
            <TabbedForm.Tab label="Visibility">
                <BooleanInput source="is_public" />
            </TabbedForm.Tab>
        </TabbedForm>
    </BulkUpdateFormButton>
);
```

### Limitations

If you look under the hood, you will see that `<BulkUpdateFormButton>` provides a `<SaveContext>` to its children, which allows them to call `updateMany` with the ids of the selected records.

However since we are in the context of a list, there is no `<RecordContext>` available. Hence, the following inputs cannot work inside a `<BulkUpdateFormButton>`:

-   `<ReferenceOneInput>`
-   `<ReferenceManyInput>`
-   `<ReferenceManyToManyInput>`

## `<InputSelectorForm>`

This component renders a form allowing to select the fields to update in a record.

<video controls autoplay playsinline muted loop>
  <source src="./assets/BulkUpdateButton-InputSelectorForm.webm" type="video/webm"/>
  <source src="./assets/BulkUpdateButton-InputSelectorForm.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>

### Usage

`<InputSelectorForm>` expects a list of inputs passed in the `inputs` prop. Each input must have a `label` and an `element`.

```tsx
import { InputSelectorForm } from '@react-admin/ra-form-layout';
import * as React from 'react';
import {
    BooleanInput,
    DateInput,
    SelectArrayInput,
    TextInput,
} from 'react-admin';

const PostEdit = () => (
    <InputSelectorForm
        inputs={[
            {
                label: 'Title',
                element: <TextInput source="title" />,
            },
            {
                label: 'Body',
                element: <TextInput source="body" multiline />,
            },
            {
                label: 'Published at',
                element: <DateInput source="published_at" />,
            },
            {
                label: 'Is public',
                element: <BooleanInput source="is_public" />,
            },
            {
                label: 'Tags',
                element: (
                    <SelectArrayInput
                        source="tags"
                        choices={[
                            { id: 'react', name: 'React' },
                            { id: 'vue', name: 'Vue' },
                            { id: 'solid', name: 'Solid' },
                            { id: 'programming', name: 'Programming' },
                        ]}
                    />
                ),
            },
        ]}
    />
);
```

`<InputSelectorForm>` also expects to be used inside a [`<SaveContext>`](https://marmelab.com/react-admin/useSaveContext.html#usage). When the form is submitted, it will call the `save` method from the `<SaveContext>`, with the value of the selected inputs.

**Tip:** `<InputSelectorForm>` is particularily useful when used with [`<BulkUpdateFormButton>`](#bulkupdateformbutton), as it allows to select the fields to update.

```tsx
import {
    BulkUpdateFormButton,
    InputSelectorForm,
} from '@react-admin/ra-form-layout';
import * as React from 'react';
import { BooleanInput, DateInput } from 'react-admin';

const PostBulkUpdateButton = () => (
    <BulkUpdateFormButton>
        <InputSelectorForm
            inputs={[
                {
                    label: 'Published at',
                    element: <DateInput source="published_at" />,
                },
                {
                    label: 'Is public',
                    element: <BooleanInput source="is_public" />,
                },
            ]}
        />
    </BulkUpdateFormButton>
);
```

Check out the [`<BulkUpdateFormButton>`](#bulkupdateformbutton) documentation for more information.

### Props

| Prop     | Required      | Type  | Default | Description                                     |
| -------- | ------------- | ----- | ------- | ----------------------------------------------- |
| `inputs` | Required (\*) | Array | -       | The list of inputs from which the user can pick |

`<InputSelectorForm>` also accepts the same props as [`<WizardForm>`](#wizardform), except the `onSubmit` and `children` props.

### `inputs`

Use the `inputs` prop to specify the list of inputs from which the user can pick. Each input must have a `label` and an `element`.

```tsx
import { InputSelectorForm } from '@react-admin/ra-form-layout';
import * as React from 'react';
import {
    BooleanInput,
    DateInput,
    SelectArrayInput,
    TextInput,
} from 'react-admin';

const PostEdit = () => (
    <InputSelectorForm
        inputs={[
            {
                label: 'Title',
                element: <TextInput source="title" />,
            },
            {
                label: 'Body',
                element: <TextInput source="body" multiline />,
            },
            {
                label: 'Published at',
                element: <DateInput source="published_at" />,
            },
            {
                label: 'Is public',
                element: <BooleanInput source="is_public" />,
            },
            {
                label: 'Tags',
                element: (
                    <SelectArrayInput
                        source="tags"
                        choices={[
                            { id: 'react', name: 'React' },
                            { id: 'vue', name: 'Vue' },
                            { id: 'solid', name: 'Solid' },
                            { id: 'programming', name: 'Programming' },
                        ]}
                    />
                ),
            },
        ]}
    />
);
```

### Internationalization

You can use translation keys as input labels.

```tsx
// in i18n/fr.ts

const customFrenchMessages = {
    resources: {
        posts: {
            name: 'Article |||| Articles',
            fields: {
                published_at: 'Publié le',
                is_public: 'Public',
            },
        },
    },
};

// in posts/postEdit.tsx

import { InputSelectorForm } from '@react-admin/ra-form-layout';
import * as React from 'react';
import { BooleanInput, DateInput } from 'react-admin';

const PostEdit = () => (
    <InputSelectorForm
        inputs={[
            {
                label: 'resources.posts.fields.published_at',
                element: <DateInput source="published_at" />,
            },
            {
                label: 'resources.posts.fields.is_public',
                element: <BooleanInput source="is_public" />,
            },
        ]}
    />
);
```
