import { Box, Stack, styled } from '@mui/material';
import omit from 'lodash/omit';
import React, { useCallback, useEffect } from 'react';
import {
    Middleware,
    UseUpdateManyResult,
    required,
    useSaveContext,
    useTranslate,
} from 'react-admin';
import { useFormContext, useWatch } from 'react-hook-form';
import {
    WizardForm,
    WizardFormProps,
    WizardFormStep,
    useWizardFormContext,
} from '../wizard-form';
import { InputSelector } from './InputSelector';

/**
 * This component renders a form allowing to select the fields to update in a record.
 *
 * `<InputSelectorForm>` expects a list of inputs passed in the `inputs` prop. Each input must have a `label` and an `element`.
 *
 * `<InputSelectorForm>` also expects to be used inside a [`<SaveContext>`](https://marmelab.com/react-admin/useSaveContext.html#usage).
 * When the form is submitted, it will call the `save` method from the `<SaveContext>`, with the value of the selected inputs.
 *
 * @example
 * ```tsx
 * import { InputSelectorForm } from '@react-admin/ra-form-layout';
 * import * as React from 'react';
 * import {
 *     BooleanInput,
 *     DateInput,
 *     SelectArrayInput,
 *     TextInput,
 * } from 'react-admin';
 *
 * const PostEdit = () => (
 *     <InputSelectorForm
 *         inputs={[
 *             {
 *                 label: 'Title',
 *                 element: <TextInput source="title" />,
 *             },
 *             {
 *                 label: 'Body',
 *                 element: <TextInput source="body" multiline />,
 *             },
 *             {
 *                 label: 'Published at',
 *                 element: <DateInput source="published_at" />,
 *             },
 *             {
 *                 label: 'Is public',
 *                 element: <BooleanInput source="is_public" />,
 *             },
 *             {
 *                 label: 'Tags',
 *                 element: (
 *                     <SelectArrayInput
 *                         source="tags"
 *                         choices={[
 *                             { id: 'react', name: 'React' },
 *                             { id: 'vue', name: 'Vue' },
 *                             { id: 'solid', name: 'Solid' },
 *                             { id: 'programming', name: 'Programming' },
 *                         ]}
 *                     />
 *                 ),
 *             },
 *         ]}
 *     />
 * );
 * ```
 */
export const InputSelectorForm = (props: InputSelectorFormProps) => {
    const { inputs, ...rest } = props;
    const translate = useTranslate();
    const saveContext = useSaveContext();
    if (
        !saveContext?.save ||
        !saveContext?.registerMutationMiddleware ||
        !saveContext?.unregisterMutationMiddleware
    ) {
        if (process.env.NODE_ENV === 'development') {
            throw new Error(
                '<InputSelectorForm> can only be used inside a <SaveContext>. Please use <SaveContextProvider> to provide a <SaveContext>.'
            );
        }
    }
    const handleSubmit = async data => {
        await saveContext.save(data, {});
    };

    const selectInputsLabel = translate(
        'ra-form-layout.input_selector_form.select_inputs',
        {
            _: 'Select fields',
        }
    );
    const selectValuesLabel = translate(
        'ra-form-layout.input_selector_form.select_values',
        {
            _: 'Select values',
        }
    );

    return (
        <WizardForm onSubmit={handleSubmit} shouldUnregister {...rest}>
            <WizardFormStep label={selectInputsLabel}>
                <InputSelector
                    source={inputSelectorFormInputs}
                    inputs={inputs.map(input => input.label)}
                    validate={required()}
                />
            </WizardFormStep>
            <WizardFormStep label={selectValuesLabel}>
                <SelectedInputs inputs={inputs} />
                <RegisterTemporaryInput />
            </WizardFormStep>
        </WizardForm>
    );
};

export interface InputSelectorFormProps
    extends Omit<WizardFormProps, 'onSubmit' | 'children'> {
    inputs: InputOption[];
}

export interface InputOption {
    label: string;
    element: React.ReactNode;
}

export const inputSelectorFormInputs =
    '@@ra-form-layout-input-selector-form-inputs';

const RegisterTemporaryInput = () => {
    const { reset } = useFormContext();
    const { goToStep } = useWizardFormContext();
    const { registerMutationMiddleware, unregisterMutationMiddleware } =
        useSaveContext();
    const middleware: Middleware<UseUpdateManyResult[0]> = useCallback(
        async (resource, params, options, next) => {
            // We don't want to save the temporary field
            const sanitizedParams = {
                ...params,
                data: omit(params.data, inputSelectorFormInputs),
            };
            await next(resource, sanitizedParams, options);
            // We go back to the first step
            goToStep(0);
            // We reset the form after the save, and after the navigation to first step is completed
            queueMicrotask(() => {
                reset();
            });
        },
        [reset, goToStep]
    );
    useEffect(() => {
        registerMutationMiddleware(middleware);
        return () => unregisterMutationMiddleware(middleware);
    }, [middleware, registerMutationMiddleware, unregisterMutationMiddleware]);
    return null;
};

const SelectedInputs = ({ inputs }: { inputs: InputOption[] }) => {
    const selectedInputNames: string[] = useWatch({
        name: inputSelectorFormInputs,
    });
    const selectedInputs =
        (selectedInputNames &&
            selectedInputNames.map(selectedInput =>
                inputs.find(input => input.label === selectedInput)
            )) ??
        [];
    return (
        <StyledBox className={SelectedInputsClasses.root}>
            <Stack paddingX={1}>
                {selectedInputs.map((selectedInput?: InputOption) =>
                    selectedInput ? (
                        <React.Fragment key={selectedInput.label}>
                            {selectedInput.element}
                        </React.Fragment>
                    ) : null
                )}
            </Stack>
        </StyledBox>
    );
};

const SelectedInputsPrefix = 'RaSelectedInputs';

const SelectedInputsClasses = {
    root: `${SelectedInputsPrefix}-root`,
};

const StyledBox = styled(Box, {
    name: SelectedInputsPrefix,
    overridesResolver: (props, styles) => styles.root,
})({
    maxHeight: 'max(calc(100vh - 300px), 100px)',
    overflow: 'auto',
});
