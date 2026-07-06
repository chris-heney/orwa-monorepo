import * as React from 'react';
import {
    HtmlHTMLAttributes,
    isValidElement,
    ReactNode,
    useCallback,
    useMemo,
    useState,
} from 'react';
import clsx from 'clsx';
import {
    CardContentInner,
    FormGroupContextProvider,
    FormGroupsProvider,
    FormProps,
    OptionalRecordContextProvider,
    useAugmentedForm,
    useRecordContext,
} from 'react-admin';
import { FormProvider } from 'react-hook-form';

import { WizardProgress } from './WizardProgress';
import { WizardToolbar } from './WizardToolbar';
import { WizardFormContext, WizardFormContextValue } from './WizardFormContext';
import { WizardFormStepProvider } from './WizardFormStepProvider';
import { WizardFormStep } from './WizardFormStep';

/**
 * Form component rendering a wizard form with stepper
 *
 * Alternative to <SimpleForm>, to be used as child of <Create>.
 * Expects <WizardFormStep> elements as children.
 *
 * @param {ComponentType} toolbar An alternative toolbar element (to customize form buttons)
 * @param {ComponentType} progress An alternative progress bar element (to customize stepper)
 *
 * @example
 *
 * import React from 'react';
 * import { Create, TextInput, required } from 'react-admin';
 * import { WizardForm, WizardFormStep } from '@react-admin/ra-form-layout';
 *
 * const PostCreate = props => (
 *   <Create>
 *       <WizardForm>
 *           <WizardFormStep label="First step">
 *               <TextInput source="title" validate={required()} />
 *           </WizardFormStep>
 *           <WizardFormStep label="Second step">
 *               <TextInput source="description" />
 *           </WizardFormStep>
 *           <WizardFormStep label="Third step">
 *               <TextInput source="fullDescription" validate={required()} />
 *           </WizardFormStep>
 *       </WizardForm>
 *   </Create>
 * );
 */
export const WizardForm = (props: WizardFormProps) => {
    const { children, progress, toolbar, ...rest } = props;
    const record = useRecordContext(props);
    const { form, formHandleSubmit } = useAugmentedForm({
        mode: 'onChange',
        ...rest,
    });
    return (
        <OptionalRecordContextProvider value={record}>
            <FormProvider {...form}>
                <FormGroupsProvider>
                    <WizardFormView
                        onSubmit={formHandleSubmit}
                        progress={progress}
                        toolbar={toolbar}
                    >
                        {children}
                    </WizardFormView>
                </FormGroupsProvider>
            </FormProvider>
        </OptionalRecordContextProvider>
    );
};

const DefaultProgress = <WizardProgress />;
const DefaultToolbar = <WizardToolbar />;

const WizardFormView = ({
    children,
    className,
    onSubmit,
    toolbar = DefaultToolbar,
    progress = DefaultProgress,
    ...rest
}: WizardFormViewProps) => {
    const [currentStep, setCurrentStep] = useState(0);

    const goToNextStep = useCallback((): void => {
        setCurrentStep(step => step + 1);
    }, []);

    const goToPreviousStep = useCallback((): void => {
        setCurrentStep(step => step - 1);
    }, []);

    // We can't go forward using the progress stepper
    // So we don't need extra checks here
    const goToStep = useCallback((index: number): void => {
        setCurrentStep(index);
    }, []);

    const steps = React.Children.toArray(children).filter(isValidElement);

    const hasPreviousStep = currentStep > 0;
    const hasNextStep = currentStep < steps.length - 1;

    const context = useMemo<WizardFormContextValue>(
        () => ({
            currentStep,
            hasPreviousStep,
            hasNextStep,
            goToNextStep,
            goToPreviousStep,
            goToStep,
            steps,
        }),
        [
            currentStep,
            hasPreviousStep,
            hasNextStep,
            goToNextStep,
            goToPreviousStep,
            goToStep,
            steps,
        ]
    );

    return (
        <WizardFormContext.Provider value={context}>
            {progress}
            {/* eslint-disable-next-line */}
            <form
                className={clsx('wizard-form', className)}
                onSubmit={onSubmit}
                {...rest}
            >
                <CardContentInner>
                    {steps.map((step, index) => (
                        <FormGroupContextProvider
                            key={step.key}
                            name={`step-${index}`}
                        >
                            <WizardFormStepProvider key={step.key} step={index}>
                                {step}
                            </WizardFormStepProvider>
                        </FormGroupContextProvider>
                    ))}
                </CardContentInner>
                {toolbar}
            </form>
        </WizardFormContext.Provider>
    );
};

WizardForm.Step = WizardFormStep;

interface WizardFormViewProps
    extends Omit<
        HtmlHTMLAttributes<HTMLFormElement>,
        'defaultValue' | 'children'
    > {
    children: ReactNode;
    progress?: ReactNode;
    toolbar?: ReactNode;
}

export interface WizardFormProps
    extends FormProps,
        Omit<WizardFormViewProps, 'onSubmit'> {}
