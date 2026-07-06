/* eslint-disable jest/expect-expect */
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { CustomerForm, getDataProvider } from '../../../stories/common';
import {
    EmployerEditWithFullyControlledDialogs,
    Basic,
    CustomRedirect,
    WithCustomTitles,
    Meta,
    OnClose,
    OnSuccess,
    MutationOptionsRedirect,
} from '../../../stories/dialogForm.stories';
import i18nProvider from '../../../stories/i18nProvider';

import { CreateDialog } from './CreateDialog';
import { FormDialogContext } from './FormDialogContext';
import {
    AdminContext,
    ResourceContextProvider,
    Admin,
    Resource,
} from 'react-admin';

describe('CreateDialog', () => {
    it('should open the create view when the route matches', async () => {
        render(
            <MemoryRouter initialEntries={['/customers/create']}>
                <Basic />
            </MemoryRouter>
        );

        await screen.findByText('Create Customer');
        fireEvent.change(screen.getByLabelText('First name *'), {
            target: { value: 'Roger' },
        });
        fireEvent.change(screen.getByLabelText('Last name *'), {
            target: { value: 'Moore' },
        });
        fireEvent.change(screen.getByLabelText('born *'), {
            target: { value: '1927-10-14' },
        });
        fireEvent.click(screen.getByText('Save'));
        await waitFor(() => {
            expect(screen.queryByText('Create Customer')).toBeNull();
        });
    });

    it('should accept custom redirect prop', async () => {
        render(
            <MemoryRouter initialEntries={['/customers/create']}>
                <CustomRedirect />
            </MemoryRouter>
        );

        await screen.findByText('Create Customer');
        fireEvent.change(screen.getByLabelText('First name *'), {
            target: { value: 'Roger' },
        });
        fireEvent.change(screen.getByLabelText('Last name *'), {
            target: { value: 'Moore' },
        });
        fireEvent.change(screen.getByLabelText('born *'), {
            target: { value: '1927-10-14' },
        });
        fireEvent.click(screen.getByText('Save'));
        await screen.findByText(/Customer #[0-9]/);
        await screen.findByDisplayValue('Moore');
    });

    it('should accept custom mutationOptions with meta', async () => {
        const dataProvider = getDataProvider();
        const createSpy = jest.spyOn(dataProvider, 'create');
        render(<Meta dataProvider={dataProvider} />);
        fireEvent.click(await screen.findByLabelText('Create'));
        await screen.findByText('In Create View');
        fireEvent.change(screen.getByLabelText('Last name *'), {
            target: { value: 'Doeyy' },
        });
        fireEvent.change(screen.getByLabelText('born *'), {
            target: { value: '2007-10-12' },
        });
        fireEvent.click(screen.getByText('Save'));
        // Make sure we have been redirected to the Edit view
        await screen.findByText('In Edit View');
        await screen.findByDisplayValue('Doeyy');
        // Make sure the create fn was called with the meta param
        expect(createSpy).toHaveBeenCalledWith('customers', {
            data: expect.objectContaining({ last_name: 'Doeyy' }),
            meta: { foo: 'bar' },
        });
    });

    it('should accept custom mutationOptions with onSuccess.redirect', async () => {
        const dataProvider = getDataProvider();
        render(<MutationOptionsRedirect dataProvider={dataProvider} />);
        fireEvent.click(await screen.findByLabelText('Create'));
        await screen.findByText('Create Customer');
        fireEvent.change(screen.getByLabelText('Last name *'), {
            target: { value: 'Doeyy' },
        });
        fireEvent.change(screen.getByLabelText('born *'), {
            target: { value: '2007-10-12' },
        });
        fireEvent.click(screen.getByText('Save'));
        // Make sure we have been redirected to the custom route
        await screen.findByText('Create Customers profile');
        await screen.findByDisplayValue('John Doeyy');
        fireEvent.click(screen.getByText('Customers'));
    });

    it('should accept custom mutationOptions with onSuccess', async () => {
        const dataProvider = getDataProvider();
        render(<OnSuccess dataProvider={dataProvider} />);
        fireEvent.click(await screen.findByLabelText('Create'));
        await screen.findByText('In Create View');
        fireEvent.change(screen.getByLabelText('Last name *'), {
            target: { value: 'Doeyy' },
        });
        fireEvent.change(screen.getByLabelText('born *'), {
            target: { value: '2007-10-12' },
        });
        fireEvent.click(screen.getByText('Save'));
        // Make sure we have our custom notification
        await screen.findByText('Created');
        jest.restoreAllMocks();
    });

    it('should display custom title', async () => {
        render(
            <MemoryRouter initialEntries={['/customers/create']}>
                <WithCustomTitles />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.queryByText('Create a new customer')).not.toBeNull();
        });
    });

    it('open/close state should be manageable from context', async () => {
        const TestedComponent = ({ open }: { open: boolean }) => {
            const context = {
                isOpen: open,
                open: jest.fn(),
                close: jest.fn(),
            };
            return (
                <AdminContext>
                    <ResourceContextProvider value="foo">
                        <FormDialogContext.Provider value={context}>
                            <CreateDialog fullWidth maxWidth="md">
                                <CustomerForm />
                            </CreateDialog>
                        </FormDialogContext.Provider>
                    </ResourceContextProvider>
                </AdminContext>
            );
        };
        const { rerender } = render(<TestedComponent open={false} />);
        expect(screen.queryByText('ra.page.create')).toBeNull();
        rerender(<TestedComponent open={true} />);
        await screen.findByText('ra.page.create');
    });

    it('open/close state should be manageable from props', async () => {
        const TestedComponent = ({ open }: { open: boolean }) => {
            return (
                <AdminContext>
                    <ResourceContextProvider value="foo">
                        <CreateDialog fullWidth maxWidth="md" isOpen={open}>
                            <CustomerForm />
                        </CreateDialog>
                    </ResourceContextProvider>
                </AdminContext>
            );
        };
        const { rerender } = render(<TestedComponent open={false} />);
        expect(screen.queryByText('ra.page.create')).toBeNull();
        rerender(<TestedComponent open={true} />);
        await screen.findByText('ra.page.create');
    });

    it('values in the edit form should be isolated from values in the dialog form', async () => {
        const dataProvider = getDataProvider();
        const createSpy = jest
            .spyOn(dataProvider, 'create')
            .mockImplementation((_, { data }) =>
                Promise.resolve({ data: { id: 6, ...data } })
            );
        const updateSpy = jest
            .spyOn(dataProvider, 'update')
            .mockImplementation((_, { id, data }) =>
                Promise.resolve({ data: { id, ...data } })
            );
        render(
            <MemoryRouter initialEntries={['/employers/1']}>
                <Admin dataProvider={dataProvider} i18nProvider={i18nProvider}>
                    <Resource
                        name="employers"
                        edit={EmployerEditWithFullyControlledDialogs}
                    />
                </Admin>
            </MemoryRouter>
        );

        await screen.findByText('Employer #1');
        fireEvent.click(screen.getByLabelText('Create a new customer'));
        await screen.findByText('Create Customer');
        fireEvent.change(screen.getByLabelText('First name *'), {
            target: { value: 'Roger' },
        });
        fireEvent.change(screen.getByLabelText('Last name *'), {
            target: { value: 'Moore' },
        });
        fireEvent.change(screen.getByLabelText('born *'), {
            target: { value: '1927-10-14' },
        });
        fireEvent.click(screen.getAllByText('Save')[1]); // we need the 2nd save button (the one inside the dialog)
        await waitFor(() => {
            expect(screen.queryByText('Create Customer')).toBeNull();
        });
        expect(createSpy).toHaveBeenCalledWith('customers', {
            data: {
                first_name: 'Roger',
                last_name: 'Moore',
                employer_id: 1,
                dob: '1927-10-14',
                sex: undefined,
            },
            meta: undefined,
        });
        fireEvent.change(screen.getByLabelText('Name *'), {
            target: { value: 'Acme2' },
        });
        fireEvent.click(screen.getAllByText('Save')[0]); // we need the 1st save button (the one inside the edit)
        await waitFor(() => {
            expect(updateSpy).toHaveBeenCalledWith('employers', {
                id: '1',
                data: {
                    id: 1,
                    name: 'Acme2',
                    address: '123 Main Street',
                    city: 'Anytown',
                },
                previousData: {
                    id: 1,
                    name: 'Acme',
                    address: '123 Main Street',
                    city: 'Anytown',
                },
                meta: undefined,
            });
        });
    });

    it('should accept a custom close function', async () => {
        const log = jest.spyOn(console, 'log');
        render(<OnClose />);
        fireEvent.click(screen.getByLabelText('Create'));
        fireEvent.click(screen.getByLabelText('Close'));

        await waitFor(() => {
            expect(log).toHaveBeenCalledWith('CreateDialog close: undefined');
        });

        fireEvent.click(screen.getByLabelText('Create'));
        fireEvent.keyDown(
            screen.getByRole('dialog').parentElement as HTMLElement,
            {
                key: 'Esc',
            }
        );

        await waitFor(() => {
            expect(log).toHaveBeenCalledWith(
                'CreateDialog close: escapeKeyDown'
            );
        });

        await waitFor(() => {
            expect(screen.queryByRole('dialog')).toBeNull();
        });
    });
});
