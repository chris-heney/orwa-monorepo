# CHANGELOG

## v4.10.1

> 2023-10-09

-   Update documentation to explain how to use `<StackedFilters>` well.

## v4.10.0

> 2023-10-05

-   Add support for `className` and `sx` props to `<StackedFilters>`, `<StackedFiltersForm>` and `<StackedFiltersActions>` components.

## v4.9.7

> 2023-10-03

-   Fix `<InputSelectorForm>` briefly displays a validation error notification after submitting the form with React 18

## v4.9.6

> 2023-10-03

-   Fix `<InputSelectorForm>` briefly displays a validation error after submitting the form
-   Fix `<BulkUpdateFormButton>` does not close the dialog when providing a custom `onSuccess` callback

## v4.9.5

> 2023-10-02

-   Fix redirection in custom `onSuccess` is ignored by `<CreateDialog>` and `<EditDialog>`

## v4.9.4

> 2023-09-05

-   Fix passing custom onSuccess does not close the dialog

## v4.9.3

> 2023-08-30

-   Fix Dialogs don't pass MUI onClose arguments to their `close` handler

## v4.9.2

> 2023-08-10

-   Fix `<EditInDialogButton>` causes console warning when using the `transform` prop

## v4.9.1

> 2023-08-03

-   Fix `<WizardForm/>` makes it hard to override the progress margins.

## v4.9.0

> 2023-07-06

-   Introduce `<BulkUpdateButton>`
-   Introduce `<InputSelectorForm>`

## v4.8.3

> 2023-06-19

-   Fix `<WizardForm>` to support middlewares.

## v4.8.2

> 2023-06-16

-   Fix exports that are problematic with some bundlers

## v4.8.1

> 2023-06-14

-   Fix `<StackedFilters>` uses an incorrect translation key for the Filters button label (`ra-form-layout.stacked_filters.filters_button_label` is now `ra-form-layout.filters.filters_button_label`)
-   Fix labels in the `<StackedFiltersForm>` now have a hard-coded label supporting translations:
    -   `ra-form-layout.filters.source`
    -   `ra-form-layout.filters.operator`
    -   `ra-form-layout.filters.value`

## v4.8.0

> 2023-05-05

-   Add `<AutoSave>` component to automatically save a form when the user stops typing.
-   Add `useAutoSave` hook
-   Add `<PreviousButton>` for customizing the `<WizardForm>` toolbar.
-   Add `<WizardForm.Step>` shortcut to `<WizardFormStep>`
-   Add `<AccordionForm.Panel>` shortcut to `<AccordionFormPanel>`

This version requires react-admin version 4.11.0 or higher.

## v4.7.1

> 2023-05-30

-   Fix compatibility with latest react-hook-form versions (>= 7.43), and hence with react-admin >= v4.11

## v4.7.0

> 2023-05-24

-   Upgraded to react-admin `4.10.6`

## v4.6.2

> 2023-03-17

-   Fix usage of `cloneElement` by ensuring children are React elements.

## v4.6.1

> 2023-03-02

-   Fix `<EditDialog>` ignores `redirect` prop when passing custom `mutationOptions`
-   Fix MUI warning when passing `mutationMode` to `<EditDialog>`

## v4.6.0

> 2023-02-01

-   Added the `<StackedFilters>` component.

## v4.5.3

> 2023-01-25

-   Fix React warnings about unknown or invalid props

## v4.5.2

> 2022-10-28

-   (fix) Fix `WizardForm` next button `disabled` status
-   (doc) Fix `WizardForm` custom toolbar example

## v4.5.1

> 2022-10-24

-   (fix) Add missing exports for `CreateInDialogButton`, `EditInDialogButton` and `ShowInDialogButton`

## v4.5.0

> 2022-10-12

-   Feat: Add ability to use `CreateDialog`, `EditDialog` and `ShowDialog` standalone, without routing

## v4.4.0

> 2022-08-29

-   Feat: Provide record in context for their title to `EditDialog` & `ShowDialog`

## v4.3.0

> 2022-08-25

-   Remove `<JsonSchemaForm>` component. (new location in `ra-json-schema-form`)

## v4.2.0

> 2022-07-29

-   Add `<JsonSchemaForm>` component.

## v4.1.5

> 2022-07-21

-   Fix `redirect` prop is ignored by `<CreateDialog>` and `<EditDialog>`

## v4.1.4

> 2022-07-01

-   Fix `<AccordionSection>` style (summary height, bottom border, etc.)

## v4.1.3

> 2022-06-29

-   Fix: Replace `classnames` with `clsx`

## v4.1.2

> 2022-06-21

-   Fix `<EditDialog>` not calling `dataProvider.update` when `mutationMode` is undefined
-   Fix Dialog Forms not working properly with `<TabbedForm>`
-   Doc: Add `hasCreate` in the Dialog Forms examples

## v4.1.1

> 2022-06-20

-   Fix Dialog Forms are not displayed when `<Admin>` has its `basename` prop set.

## v4.1.0

> 2022-06-16

-   Add `<LongForm>` component

## v4.0.3

> 2022-06-10

-   (fix) Fix `<EditDialog>` and `<CreateDialog>` scroll to top on submit and on cancel

## v4.0.2

> 2022-06-10

-   (fix) Fix `<WizardForm>` does not trigger save action

## v4.0.1

> 2022-06-08

-   (fix) Update peer dependencies ranges (support React 18)

## v4.0.0

> 2022-06-07

-   Upgrade to react-admin v4

## v1.9.0

> 2022-01-05

-   (feat) Add `<ShowDialog>` component

## v1.8.1

> 2021-12-17

-   (fix) Fix sanitize mutationMode out of WizardFormView
-   (fix) Fix change justify for justifyContent prop

## v1.8.0

> 2021-11-12

-   (feat) Add ability to pass custom `<Stepper>` props to `<WizardProgress>`

## v1.7.0

> 2021-08-03

-   (feat) Add translation key support for the `label` prop of the `<WizardFormStep>`

## v1.6.2

> 2021-07-06

-   (doc) Add an example of summary step for the `<WizardForm>`

## v1.6.1

> 2021-06-29

-   (fix) Update peer dependencies ranges (support react 17)

## v1.6.0

> 2021-05-17

-   (chore) Update `AccordionForm` to use `FormGroupContext` for error tracking.
-   (feat) Ensure `AccordionFormPanel`, `AccordionFormToolbar` and `FormDialogTitle` styles are overridable through Material UI theme by providing it a key (`RaAccordionFormPanel`, `RaAccordionFormToolbar` and `RaFormDialogTitle`).

## v1.5.5

> 2021-04-29

-   (fix) Allow additional properties on `AccordionSection` component

## v1.5.4

> 2021-01-29

-   (fix) Fix wizard form does not handle submit on enter correctly

## v1.5.3

> 2021-01-18

-   (fix) Fix dialog forms

## v1.5.2

> 2020-11-04

-   (fix) Fix dialog forms prop interfaces

## v1.5.1

> 2020-11-03

-   (fix) Fix providing sub-components (`Accordion`, `<AccordionSummary>` and `<AccordionDetails>`) should not be required.

## v1.5.0

> 2020-11-02

-   (feat) Allow customizing the accordion sub-components (`Accordion`, `<AccordionSummary>` and `<AccordionDetails>`) by providing your own.

## v1.4.0

> 2020-10-26

-   (feat) Allow customizing the accordion sub-components (`Accordion`, `<AccordionSummary>` and `<AccordionDetails>`)
-   (feat) Add types for the `<AccordionSection>`

## v1.3.0

> 2020-10-05

-   (deps) Upgrade react-admin to v3.9.0

## v1.2.0

> 2020-10-01

-   (feat) Dialog Form (CreateDialog & EditDialog)

## v1.1.0

> 2020-09-28

-   (feat) Wizard Form

## v1.0.1

> 2020-09-22

-   (fix) Fix Storybook error on `history.replace`

## v1.0.0

> 2020-09-22

-   First release
