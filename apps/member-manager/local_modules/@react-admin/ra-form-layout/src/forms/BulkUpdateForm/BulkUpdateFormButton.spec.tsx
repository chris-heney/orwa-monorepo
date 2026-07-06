/* eslint-disable jest/expect-expect */
import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import {
    Basic,
    OnSuccess,
    Validation,
    dataProvider,
} from './BulkUpdateFormButton.stories';

describe('BulkUpdateFormButton', () => {
    it('should render a button', async () => {
        render(<Basic />);
        fireEvent.click(
            (await screen.findAllByLabelText('Select this row'))[0]
        );
        expect(await screen.findByText('1 item selected')).not.toBeNull();
        expect(
            await screen.findByRole('button', { name: 'Update' })
        ).not.toBeNull();
    });

    it('should open a dialog on click', async () => {
        render(<Basic />);
        fireEvent.click(
            (await screen.findAllByLabelText('Select this row'))[0]
        );
        fireEvent.click(
            (await screen.findAllByLabelText('Select this row'))[1]
        );
        fireEvent.click(await screen.findByRole('button', { name: 'Update' }));
        expect(await screen.findByText('Update selected Posts')).not.toBeNull();
        expect(await screen.findByLabelText('Published at')).not.toBeNull();
        expect(await screen.findByLabelText('Is public')).not.toBeNull();
    });

    it('should close the dialog on save', async () => {
        render(<Basic />);
        fireEvent.click(
            (await screen.findAllByLabelText('Select this row'))[0]
        );
        fireEvent.click(await screen.findByRole('button', { name: 'Update' }));
        expect(await screen.findByText('Update selected Post')).not.toBeNull();
        fireEvent.click(await screen.findByLabelText('Is public'));
        await waitFor(() => {
            expect(
                screen.getByLabelText('Save').getAttribute('disabled')
            ).toBeNull();
        });
        fireEvent.click(screen.getByLabelText('Save'));
        await waitFor(() => {
            expect(screen.queryByText('Update selected Post')).toBeNull();
        });
    });

    it('should call updateMany on save', async () => {
        const updateMany = jest.fn().mockResolvedValue({ data: [] });
        const mockedDataProvider = {
            ...dataProvider,
            updateMany,
        };
        render(<Basic dataProvider={mockedDataProvider} />);
        fireEvent.click(
            (await screen.findAllByLabelText('Select this row'))[0]
        );
        fireEvent.click(await screen.findByRole('button', { name: 'Update' }));
        fireEvent.click(await screen.findByLabelText('Is public'));
        await waitFor(() => {
            expect(
                screen.getByLabelText('Save').getAttribute('disabled')
            ).toBeNull();
        });
        fireEvent.click(screen.getByLabelText('Save'));
        await waitFor(() => {
            expect(updateMany).toHaveBeenCalledWith(
                'posts',
                expect.objectContaining({
                    ids: [1],
                    data: { is_public: true, published_at: undefined },
                })
            );
        });
    });

    it('should pass the meta prop to the dataProvider', async () => {
        const updateMany = jest.fn().mockResolvedValue({ data: [] });
        const mockedDataProvider = {
            ...dataProvider,
            updateMany,
        };
        render(
            <Basic dataProvider={mockedDataProvider} meta={{ foo: 'bar' }} />
        );
        fireEvent.click(
            (await screen.findAllByLabelText('Select this row'))[0]
        );
        fireEvent.click(await screen.findByRole('button', { name: 'Update' }));
        fireEvent.click(await screen.findByLabelText('Is public'));
        await waitFor(() => {
            expect(
                screen.getByLabelText('Save').getAttribute('disabled')
            ).toBeNull();
        });
        fireEvent.click(screen.getByLabelText('Save'));
        await waitFor(() => {
            expect(updateMany).toHaveBeenCalledWith('posts', {
                ids: [1],
                data: { is_public: true, published_at: undefined },
                meta: { foo: 'bar' },
            });
        });
    });

    it('should support undoable mutation mode', async () => {
        const updateMany = jest.fn().mockResolvedValue({ data: [] });
        const mockedDataProvider = {
            ...dataProvider,
            updateMany,
        };
        render(
            <Basic dataProvider={mockedDataProvider} mutationMode="undoable" />
        );
        fireEvent.click(
            (await screen.findAllByLabelText('Select this row'))[0]
        );
        fireEvent.click(await screen.findByRole('button', { name: 'Update' }));
        fireEvent.click(await screen.findByLabelText('Is public'));
        await waitFor(() => {
            expect(
                screen.getByLabelText('Save').getAttribute('disabled')
            ).toBeNull();
        });
        fireEvent.click(screen.getByLabelText('Save'));
        fireEvent.click(await screen.findByText('Undo'));
        expect(updateMany).not.toHaveBeenCalled();
    });

    it('should not call updateMany if the form is not valid', async () => {
        const updateMany = jest.fn().mockResolvedValue({ data: [] });
        const mockedDataProvider = {
            ...dataProvider,
            updateMany,
        };
        render(<Validation dataProvider={mockedDataProvider} />);
        fireEvent.click(
            (await screen.findAllByLabelText('Select this row'))[0]
        );
        fireEvent.click(await screen.findByRole('button', { name: 'Update' }));
        fireEvent.change(await screen.findByLabelText('Published at *'), {
            target: { value: '2023-01-01' },
        });
        await waitFor(() => {
            expect(
                screen.getByLabelText('Save').getAttribute('disabled')
            ).toBeNull();
        });
        fireEvent.click(screen.getByLabelText('Save'));
        await waitFor(() => {
            expect(
                screen.queryByText(
                    'The form is not valid. Please check for errors'
                )
            ).not.toBeNull();
        });
    });

    it('should support translation', async () => {
        render(<Basic />);
        fireEvent.click(await screen.findByRole('button', { name: 'English' }));
        fireEvent.click(
            await screen.findByRole('menuitem', { name: 'Français' })
        );
        fireEvent.click(
            (await screen.findAllByLabelText('Sélectionner cette ligne'))[0]
        );
        fireEvent.click(
            (await screen.findAllByLabelText('Sélectionner cette ligne'))[1]
        );
        fireEvent.click(
            await screen.findByRole('button', { name: 'Modifier' })
        );
        expect(await screen.findByText('Modifier les Articles')).not.toBeNull();
    });

    it('should support custom onSuccess', async () => {
        render(<OnSuccess />);
        fireEvent.click(
            (await screen.findAllByLabelText('Select this row'))[0]
        );
        fireEvent.click(await screen.findByRole('button', { name: 'Update' }));
        expect(await screen.findByText('Update selected Post')).not.toBeNull();
        fireEvent.click(await screen.findByLabelText('Is public'));
        await waitFor(() => {
            expect(
                screen.getByLabelText('Save').getAttribute('disabled')
            ).toBeNull();
        });
        fireEvent.click(screen.getByLabelText('Save'));
        await waitFor(() => {
            expect(screen.queryByText('Update selected Post')).toBeNull();
        });
        await screen.findByText('Custom success message!');
    });
});
