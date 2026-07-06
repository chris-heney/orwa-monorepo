/* eslint-disable jest/expect-expect */
import React from 'react';
import {
    Resource,
    List,
    SingleFieldList,
    ChipField,
    ReferenceManyField,
    Admin,
    DataProvider,
    AdminContext,
    ResourceContextProvider,
    RecordContextProvider,
} from 'react-admin';
import { MemoryRouter } from 'react-router-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { EditDialog } from './EditDialog';
import {
    CustomRedirect,
    Meta,
    OnClose,
    WithRecordTitle,
    OnSuccess,
} from '../../../stories/dialogForm.stories';
import { CustomerForm, getDataProvider } from '../../../stories/common';
import { FormDialogContext } from './FormDialogContext';

const fakeFataProvider: DataProvider = {
    create: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
    update: jest.fn().mockResolvedValue({ data: { id: 1, name: 'Plop' } }),
    updateMany: jest.fn(),
    getList: jest
        .fn()
        .mockResolvedValue({ data: [{ id: 1, name: 'Plop' }], total: 1 }),
    getMany: jest.fn(),
    getOne: jest.fn().mockResolvedValue({ data: { id: 1, name: 'Plop' } }),
    getManyReference: jest.fn().mockResolvedValue({ data: [], total: 0 }),
};

describe('EditDialog', () => {
    it('should only render the edit view and call getManyReferences once the record has been fetched', async () => {
        const SongsList = () => (
            <>
                <List>
                    <SingleFieldList>
                        <ChipField source="id" />
                    </SingleFieldList>
                </List>
                <EditDialog>
                    <ReferenceManyField reference="artists" target="song_id">
                        <SingleFieldList>
                            <ChipField source="id" />
                        </SingleFieldList>
                    </ReferenceManyField>
                </EditDialog>
            </>
        );

        render(
            <MemoryRouter initialEntries={['/songs/1']}>
                <Admin dataProvider={fakeFataProvider}>
                    <Resource name="songs" list={SongsList} />
                    <Resource name="artists" />
                </Admin>
            </MemoryRouter>
        );

        // at first getManyReference should not be called
        expect(fakeFataProvider.getManyReference).toHaveBeenCalledTimes(0);

        // wait until result of getOne is obtained
        await waitFor(() => {
            expect(fakeFataProvider.getOne).toHaveBeenCalled();
        });
        expect(fakeFataProvider.getManyReference).toHaveBeenCalledWith(
            'artists',
            {
                target: 'song_id',
                id: 1,
                pagination: expect.anything(),
                sort: expect.anything(),
                filter: expect.anything(),
            }
        );
        expect(fakeFataProvider.getManyReference).toHaveBeenCalledTimes(1);
    });
    it('should accept custom redirect prop', async () => {
        render(
            <MemoryRouter initialEntries={['/customers/1']}>
                <CustomRedirect />
            </MemoryRouter>
        );

        await waitFor(() => {
            screen.getByLabelText('First name *');
        });
        fireEvent.change(screen.getByLabelText('First name *'), {
            target: { value: 'Plip' },
        });
        fireEvent.click(screen.getByText('Save'));
        await waitFor(() => {
            expect(
                screen.queryByText('John', { selector: '[role=dialog] *' })
            ).not.toBeNull();
        });
    });

    it('should accept custom mutationOptions with meta', async () => {
        const dataProvider = getDataProvider();
        const updateSpy = jest.spyOn(dataProvider, 'update');
        render(<Meta dataProvider={dataProvider} />);
        fireEvent.click(await screen.findByText('Smith'));
        fireEvent.change(await screen.findByLabelText('Last name *'), {
            target: { value: 'Smithee' },
        });
        fireEvent.click(screen.getByText('Save'));
        // Make sure we have been redirected to the Show view
        await screen.findByText('In Show View');
        // Make sure the update fn was called with the meta param
        expect(updateSpy).toHaveBeenCalledWith('customers', {
            id: '5',
            data: expect.objectContaining({ last_name: 'Smithee' }),
            previousData: expect.objectContaining({ last_name: 'Smith' }),
            meta: { foo: 'bar' },
        });

        fireEvent.click(await screen.findByLabelText('Close'));
        await waitFor(() => {
            expect(screen.queryByRole('dialog')).toBeNull();
        });
    });

    it('should display title for record context', async () => {
        render(
            <MemoryRouter initialEntries={['/customers/1']}>
                <WithRecordTitle />
            </MemoryRouter>
        );

        await waitFor(() => {
            screen.getByLabelText('First name *');
        });
        expect(screen.getByText('Record Customer #1')).not.toBeNull();
    });

    it('open/close state should be manageable from context', async () => {
        const TestedComponent = ({ open }: { open: boolean }) => {
            const context = {
                isOpen: open,
                open: jest.fn(),
                close: jest.fn(),
            };
            return (
                <AdminContext dataProvider={fakeFataProvider}>
                    <ResourceContextProvider value="foo">
                        <RecordContextProvider value={{ id: 1 }}>
                            <FormDialogContext.Provider value={context}>
                                <EditDialog fullWidth maxWidth="md">
                                    <CustomerForm />
                                </EditDialog>
                            </FormDialogContext.Provider>
                        </RecordContextProvider>
                    </ResourceContextProvider>
                </AdminContext>
            );
        };
        const { rerender } = render(<TestedComponent open={false} />);
        expect(screen.queryByText('ra.page.edit')).toBeNull();
        rerender(<TestedComponent open={true} />);
        await screen.findByText('ra.page.edit');
    });

    it('open/close state should be manageable from props', async () => {
        const TestedComponent = ({ open }: { open: boolean }) => {
            return (
                <AdminContext dataProvider={fakeFataProvider}>
                    <ResourceContextProvider value="foo">
                        <RecordContextProvider value={{ id: 1 }}>
                            <EditDialog fullWidth maxWidth="md" isOpen={open}>
                                <CustomerForm />
                            </EditDialog>
                        </RecordContextProvider>
                    </ResourceContextProvider>
                </AdminContext>
            );
        };
        const { rerender } = render(<TestedComponent open={false} />);
        expect(screen.queryByText('ra.page.edit')).toBeNull();
        rerender(<TestedComponent open={true} />);
        await screen.findByText('ra.page.edit');
    });

    it('should accept a custom close function', async () => {
        const log = jest.spyOn(console, 'log');
        render(<OnClose />);
        fireEvent.click(await screen.findByText('Smith'));
        fireEvent.click(screen.getByLabelText('Close'));

        await waitFor(() => {
            expect(log).toHaveBeenCalledWith('EditDialog close: undefined');
        });

        fireEvent.click(await screen.findByText('Smith'));
        fireEvent.keyDown(
            screen.getByRole('dialog').parentElement as HTMLElement,
            {
                key: 'Esc',
            }
        );

        await waitFor(() => {
            expect(log).toHaveBeenCalledWith('EditDialog close: escapeKeyDown');
        });
        await waitFor(() => {
            expect(screen.queryByRole('dialog')).toBeNull();
        });
    });

    it('should accept custom mutationOptions with onSuccess', async () => {
        const dataProvider = getDataProvider();
        render(<OnSuccess dataProvider={dataProvider} />);
        fireEvent.click(await screen.findByText('Smith'));
        await screen.findByText('In Edit View');
        fireEvent.change(screen.getByLabelText('Last name *'), {
            target: { value: 'Doeyy' },
        });
        fireEvent.change(screen.getByLabelText('born *'), {
            target: { value: '2007-10-12' },
        });
        fireEvent.click(screen.getByText('Save'));
        // Make sure we have our custom notification
        await screen.findByText('Updated');
        jest.restoreAllMocks();
    });
});
