import * as React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import {
    required,
    Create,
    TextInput,
    AdminContext,
    testDataProvider,
    useRegisterMutationMiddleware,
    Middleware,
    UseCreateResult,
} from 'react-admin';

import { WizardForm } from './WizardForm';
import { WizardFormStep } from './WizardFormStep';

const defaultCreateProps = {
    resource: 'posts',
};

const PostCreate = props => (
    <Create {...props}>
        <WizardForm>
            <WizardFormStep label="First step">
                <TextInput source="title" validate={required()} />
            </WizardFormStep>
            <WizardFormStep label="Second step">
                <TextInput source="description" validate={required()} />
            </WizardFormStep>
            <WizardFormStep label="Third step">
                <TextInput source="fullDescription" validate={required()} />
            </WizardFormStep>
        </WizardForm>
    </Create>
);

describe('WizardForm', () => {
    it('should display the same number of steps as declared WizardFormStep', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <PostCreate {...defaultCreateProps} />
            </AdminContext>
        );

        // 2 for each step: (step indicator + step fieldset legend)
        expect(screen.queryAllByText('First step')).toHaveLength(2);
        expect(screen.queryAllByText('Second step')).toHaveLength(2);
        expect(screen.queryAllByText('Third step')).toHaveLength(2);

        expect(
            screen.queryByText('resources.posts.fields.title')
        ).not.toBeNull();
    });

    it('should disable next button when current step is not valid', async () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <PostCreate {...defaultCreateProps} />
            </AdminContext>
        );

        await waitFor(() => {
            expect(
                screen.getByText('ra-form-layout.action.next')['disabled']
            ).toEqual(true);
        });
    });

    it('should enable next button when current step is valid', async () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <PostCreate {...defaultCreateProps} record={{ title: '' }} />
            </AdminContext>
        );

        await waitFor(() => {
            screen.getByLabelText('resources.posts.fields.title *');
        });

        fireEvent.change(
            screen.getByLabelText('resources.posts.fields.title *'),
            {
                target: { value: 'My title' },
            }
        );

        await waitFor(() => {
            expect(
                screen.getByText('ra-form-layout.action.next')['disabled']
            ).toEqual(false);
        });
    });

    it('should have validation working independently on every step', async () => {
        render(
            <AdminContext
                dataProvider={testDataProvider({
                    create: jest.fn().mockResolvedValue({ data: { id: 123 } }),
                })}
            >
                <PostCreate {...defaultCreateProps} record={{ title: '' }} />
            </AdminContext>
        );

        await waitFor(() => {
            screen.getByLabelText('resources.posts.fields.title *');
        });

        await waitFor(() => {
            expect(
                screen.getByText('ra-form-layout.action.next')['disabled']
            ).toEqual(true);
        });
        fireEvent.change(
            screen.getByLabelText('resources.posts.fields.title *'),
            {
                target: { value: 'My title' },
            }
        );
        await waitFor(() => {
            expect(
                screen.getByText('ra-form-layout.action.next')['disabled']
            ).toEqual(false);
        });
        fireEvent.click(screen.getByText('ra-form-layout.action.next'));
        await waitFor(() => {
            expect(
                screen.getByText('ra-form-layout.action.next')['disabled']
            ).toEqual(true);
        });
        fireEvent.change(
            screen.getByLabelText('resources.posts.fields.description *'),
            {
                target: { value: 'My desc' },
            }
        );
        await waitFor(() => {
            expect(
                screen.getByText('ra-form-layout.action.next')['disabled']
            ).toEqual(false);
        });
        fireEvent.click(screen.getByText('ra-form-layout.action.next'));
        await waitFor(() => {
            expect(screen.getByText('ra.action.save')['disabled']).toEqual(
                true
            );
        });
        fireEvent.change(
            screen.getByLabelText('resources.posts.fields.fullDescription *'),
            {
                target: { value: 'My full desc' },
            }
        );
        await waitFor(() => {
            expect(screen.getByText('ra.action.save')['disabled']).toEqual(
                false
            );
        });
        fireEvent.click(screen.getByText('ra.action.save'));
    });

    it('should go to the next step on next button click', async () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <PostCreate {...defaultCreateProps} record={{ title: 'Foo' }} />
            </AdminContext>
        );

        const nextButton = await screen.findByLabelText(
            'ra-form-layout.action.next'
        );
        fireEvent.click(nextButton);

        expect(
            (await screen.findByText('First step', { selector: 'button *' }))
                .closest('button')
                ?.getAttribute('aria-current')
        ).toEqual(null);
        expect(
            (await screen.findByText('Second step', { selector: 'button *' }))
                .closest('button')
                ?.getAttribute('aria-current')
        ).toEqual('step');
    });

    it('should go back on previous button click', async () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <PostCreate {...defaultCreateProps} record={{ title: 'Foo' }} />
            </AdminContext>
        );

        const nextButton = await screen.findByLabelText(
            'ra-form-layout.action.next'
        );
        fireEvent.click(nextButton);
        await waitFor(() => {
            expect(
                screen
                    .getByText('Second step', {
                        selector: 'button *',
                    })
                    .closest('button')
                    ?.getAttribute('aria-current')
            ).toEqual('step');
        });

        const previousButton = await screen.findByLabelText(
            'ra-form-layout.action.previous'
        );
        fireEvent.click(previousButton);
        await waitFor(() => {
            expect(
                screen
                    .getByText('Second step', {
                        selector: 'button *',
                    })
                    .closest('button')
                    ?.getAttribute('aria-current')
            ).toEqual(null);
        });
        expect(
            screen
                .getByText('First step', {
                    selector: 'button *',
                })
                .closest('button')
                ?.getAttribute('aria-current')
        ).toEqual('step');
    });

    it('should display a save button instead of next at the last step', async () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <PostCreate
                    {...defaultCreateProps}
                    record={{ title: 'Foo', description: 'Foo desc' }}
                />
            </AdminContext>
        );

        let nextButton = await screen.findByLabelText(
            'ra-form-layout.action.next'
        );
        fireEvent.click(nextButton);
        nextButton = await screen.findByLabelText('ra-form-layout.action.next');
        fireEvent.click(nextButton);

        await waitFor(() => {
            expect(screen.queryByText('ra.action.save')).not.toBeNull();
        });
    });

    it('should be able to navigate back and then forth again even when the last step is invalid', async () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <PostCreate
                    {...defaultCreateProps}
                    record={{ title: 'Foo', description: 'Foo desc' }}
                />
            </AdminContext>
        );

        let nextButton = await screen.findByLabelText(
            'ra-form-layout.action.next'
        );
        fireEvent.click(nextButton);
        await waitFor(() => {
            expect(
                screen
                    .getByText('Second step', {
                        selector: 'button *',
                    })
                    .closest('button')
                    ?.getAttribute('aria-current')
            ).toEqual('step');
        });

        nextButton = await screen.findByLabelText('ra-form-layout.action.next');
        fireEvent.click(nextButton);
        await waitFor(() => {
            expect(
                screen
                    .getByText('Third step', {
                        selector: 'button *',
                    })
                    .closest('button')
                    ?.getAttribute('aria-current')
            ).toEqual('step');
        });

        const previousButton = await screen.findByLabelText(
            'ra-form-layout.action.previous'
        );
        fireEvent.click(previousButton);
        await waitFor(() => {
            expect(
                screen
                    .getByText('Second step', {
                        selector: 'button *',
                    })
                    .closest('button')
                    ?.getAttribute('aria-current')
            ).toEqual('step');
        });

        nextButton = await screen.findByLabelText('ra-form-layout.action.next');
        fireEvent.click(nextButton);
        await waitFor(() => {
            expect(
                screen
                    .getByText('Third step', {
                        selector: 'button *',
                    })
                    .closest('button')
                    ?.getAttribute('aria-current')
            ).toEqual('step');
        });
    });

    it('supports middlewares on all steps', async () => {
        const dataProvider = testDataProvider({
            create: jest.fn().mockResolvedValue({ data: { id: 123 } }),
        });

        const MiddlewareInput = props => {
            const middleware = React.useCallback<
                Middleware<UseCreateResult[0]>
            >(
                (resource, params, options, next) => {
                    if (
                        params?.data &&
                        params.data[props.source] !== undefined
                    ) {
                        const newData = { ...params.data };
                        newData[props.source] = `${
                            params.data[props.source]
                        } (modified)`;
                        return next(
                            resource,
                            { ...params, data: newData },
                            options
                        );
                    }

                    return next(resource, params, options);
                },
                [props.source]
            );

            useRegisterMutationMiddleware(middleware);

            return <TextInput {...props} />;
        };

        const PostCreate = () => (
            <Create
                {...defaultCreateProps}
                redirect={false}
                record={{
                    title: 'test-title',
                    description: 'test-description',
                }}
            >
                <WizardForm>
                    <WizardFormStep label="First step">
                        <MiddlewareInput source="title" />
                    </WizardFormStep>
                    <WizardFormStep label="Second step">
                        <MiddlewareInput source="description" />
                    </WizardFormStep>
                    <WizardFormStep label="Third step">
                        <MiddlewareInput source="fullDescription" />
                    </WizardFormStep>
                </WizardForm>
            </Create>
        );

        render(
            <AdminContext dataProvider={dataProvider}>
                <PostCreate />
            </AdminContext>
        );

        let nextButton = await screen.findByLabelText(
            'ra-form-layout.action.next'
        );
        fireEvent.click(nextButton);
        nextButton = await screen.findByLabelText('ra-form-layout.action.next');
        fireEvent.click(nextButton);

        fireEvent.change(
            screen.getByLabelText('resources.posts.fields.fullDescription'),
            {
                target: { value: 'test-fullDescription' },
            }
        );

        await waitFor(() => {
            expect(screen.queryByText('ra.action.save')).not.toBeNull();
        });
        fireEvent.click(screen.getByText('ra.action.save'));

        await waitFor(() => {
            expect(dataProvider.create).toHaveBeenCalledWith('posts', {
                data: {
                    title: 'test-title (modified)',
                    description: 'test-description (modified)',
                    fullDescription: 'test-fullDescription (modified)',
                },
            });
        });
    });
});
