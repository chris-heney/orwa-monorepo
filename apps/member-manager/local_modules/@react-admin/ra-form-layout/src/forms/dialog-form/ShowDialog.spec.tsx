import React from 'react';
import {
    Resource,
    List,
    SingleFieldList,
    ChipField,
    ReferenceManyField,
    DataProvider,
    Admin,
    AdminContext,
    RecordContextProvider,
    ResourceContextProvider,
} from 'react-admin';
import { MemoryRouter } from 'react-router-dom';
import {
    render,
    waitFor,
    screen,
    fireEvent,
    within,
} from '@testing-library/react';

import { ShowDialog } from '.';
import { OnClose, WithRecordTitle } from '../../../stories/dialogForm.stories';
import { CustomerForm } from '../../../stories/common';
import { FormDialogContext } from './FormDialogContext';

const fakeFataProvider: DataProvider = {
    create: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
    getList: jest.fn().mockResolvedValue({ data: [], total: 0 }),
    getMany: jest.fn(),
    getOne: jest.fn().mockResolvedValue({ data: { id: 1 } }),
    getManyReference: jest.fn().mockResolvedValue({ data: [], total: 0 }),
};

describe('ShowDialog', () => {
    it('should only render the Show view and call getManyReferences once the record has been fetched', async () => {
        const MyShowDialog = (props: any) => (
            <>
                <List {...props}>
                    <SingleFieldList>
                        <ChipField source="id" />
                    </SingleFieldList>
                </List>
                <ShowDialog {...props} emptyWhileLoading>
                    <ReferenceManyField reference="artists" target="song_id">
                        <SingleFieldList>
                            <ChipField source="id" />
                        </SingleFieldList>
                    </ReferenceManyField>
                </ShowDialog>
            </>
        );

        render(
            <MemoryRouter initialEntries={['/songs/1/show']}>
                <Admin dataProvider={fakeFataProvider}>
                    <Resource name="songs" list={MyShowDialog} />
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

    it('should display title for record context', async () => {
        render(
            <MemoryRouter initialEntries={['/customers/1/show']}>
                <WithRecordTitle />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Record Customer #1')).not.toBeNull();
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
                <AdminContext dataProvider={fakeFataProvider}>
                    <ResourceContextProvider value="foo">
                        <RecordContextProvider value={{ id: 1 }}>
                            <FormDialogContext.Provider value={context}>
                                <ShowDialog fullWidth maxWidth="md">
                                    <CustomerForm />
                                </ShowDialog>
                            </FormDialogContext.Provider>
                        </RecordContextProvider>
                    </ResourceContextProvider>
                </AdminContext>
            );
        };
        const { rerender } = render(<TestedComponent open={false} />);
        expect(screen.queryByText('ra.page.show')).toBeNull();
        rerender(<TestedComponent open={true} />);
        await screen.findByText('ra.page.show');
    });

    it('open/close state should be manageable from props', async () => {
        const TestedComponent = ({ open }: { open: boolean }) => {
            return (
                <AdminContext dataProvider={fakeFataProvider}>
                    <ResourceContextProvider value="foo">
                        <RecordContextProvider value={{ id: 1 }}>
                            <ShowDialog fullWidth maxWidth="md" isOpen={open}>
                                <CustomerForm />
                            </ShowDialog>
                        </RecordContextProvider>
                    </ResourceContextProvider>
                </AdminContext>
            );
        };
        const { rerender } = render(<TestedComponent open={false} />);
        expect(screen.queryByText('ra.page.show')).toBeNull();
        rerender(<TestedComponent open={true} />);
        await screen.findByText('ra.page.show');
    });
    it('should accept a custom close function', async () => {
        const log = jest.spyOn(console, 'log');
        render(<OnClose />);
        fireEvent.click(
            within(
                (await screen.findByText('Smith')).closest('tr') as HTMLElement
            ).getByLabelText('Show')
        );
        fireEvent.click(screen.getByLabelText('Close'));

        await waitFor(() => {
            expect(log).toHaveBeenCalledWith('ShowDialog close: undefined');
        });

        fireEvent.click(
            within(
                (await screen.findByText('Smith')).closest('tr') as HTMLElement
            ).getByLabelText('Show')
        );
        fireEvent.keyDown(
            screen.getByRole('dialog').parentElement as HTMLElement,
            {
                key: 'Esc',
            }
        );

        await waitFor(() => {
            expect(log).toHaveBeenCalledWith('ShowDialog close: escapeKeyDown');
        });
        await waitFor(() => {
            expect(screen.queryByRole('dialog')).toBeNull();
        });
    });
});
