/* eslint-disable jest/expect-expect */
import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import {
    Basic,
    I18N,
    InBulkUpdateFormButton,
    Validation,
    dataProvider,
} from './InputSelectorForm.stories';

describe('InputSelectorForm', () => {
    it('should allow to select fields', async () => {
        render(<Basic />);
        fireEvent.click(await screen.findByLabelText('Title'));
        fireEvent.click(await screen.findByLabelText('Tags'));
        fireEvent.click(await screen.findByLabelText('Next'));
        expect(
            (
                (await screen.findByLabelText('Title', {
                    selector: 'input[type="text"]',
                })) as HTMLInputElement
            ).value
        ).toBe(
            'Accusantium qui nihil voluptatum quia voluptas maxime ab similique'
        );
        expect(screen.queryByText('React')).not.toBeNull();
        expect(screen.queryByText('Programming')).not.toBeNull();
        expect(
            screen.getByLabelText('Save').getAttribute('disabled')
        ).toBeNull();
    });

    it('should only update the selected fields', async () => {
        const update = jest.fn().mockResolvedValue({ data: { id: '1' } });
        const mockedDataProvider = {
            ...dataProvider,
            update,
        };
        render(<Basic dataProvider={mockedDataProvider} />);
        fireEvent.click(await screen.findByLabelText('Title'));
        fireEvent.click(await screen.findByLabelText('Next'));
        fireEvent.change(
            await screen.findByLabelText('Title', {
                selector: 'input[type="text"]',
            }),
            { target: { value: 'New title' } }
        );
        await new Promise(resolve => setTimeout(resolve, 100));
        fireEvent.click(screen.getByLabelText('Save'));
        await waitFor(() => {
            expect(update).toHaveBeenCalledWith(
                'posts',
                expect.objectContaining({
                    id: '1',
                    data: {
                        title: 'New title',
                    },
                })
            );
        });
    });

    it('should require at least one field to be selected', async () => {
        const update = jest.fn().mockResolvedValue({ data: { id: '1' } });
        const mockedDataProvider = {
            ...dataProvider,
            update,
        };
        render(<Basic dataProvider={mockedDataProvider} />);
        await screen.findByLabelText('Title');
        expect(
            screen.getByLabelText('Next').getAttribute('disabled')
        ).not.toBeNull();
        fireEvent.click(await screen.findByLabelText('Title'));
        await waitFor(() => {
            expect(
                screen.getByLabelText('Next').getAttribute('disabled')
            ).toBeNull();
        });
        fireEvent.click(screen.getByLabelText('Next'));
        expect(
            (
                (await screen.findByLabelText('Title', {
                    selector: 'input[type="text"]',
                })) as HTMLInputElement
            ).value
        ).toBe(
            'Accusantium qui nihil voluptatum quia voluptas maxime ab similique'
        );
        expect(update).not.toHaveBeenCalled();
    });

    it('should support validation', async () => {
        const update = jest.fn().mockResolvedValue({ data: { id: '1' } });
        const mockedDataProvider = {
            ...dataProvider,
            update,
        };
        render(<Validation dataProvider={mockedDataProvider} />);
        fireEvent.click(await screen.findByLabelText('Title'));
        fireEvent.click(await screen.findByLabelText('Next'));
        fireEvent.change(
            await screen.findByLabelText('Title *', {
                selector: 'input',
            }),
            { target: { value: '' } }
        );
        await waitFor(() => {
            expect(
                screen.getByLabelText('Save').getAttribute('disabled')
            ).toBeNull();
        });
        fireEvent.click(screen.getByLabelText('Save'));
        await waitFor(() => {
            expect(screen.getByText('Required')).not.toBeNull();
        });
        expect(update).not.toHaveBeenCalled();
    });

    it('should support translation', async () => {
        render(<I18N />);
        fireEvent.click(await screen.findByRole('button', { name: 'English' }));
        fireEvent.click(
            await screen.findByRole('menuitem', { name: 'Français' })
        );
        await screen.findByText('Sélectionnez les champs', {
            selector: 'legend',
        });
        fireEvent.click(await screen.findByLabelText('Catégories'));
        fireEvent.click(await screen.findByLabelText('Suivant'));
        await screen.findByLabelText('Catégories', {
            selector: ':not(input[type="checkbox"])',
        });
        await screen.findByText('React');
        await screen.findByText('Programming');
    });

    it('should support being used inside a BulkUpdateFormButton', async () => {
        const updateMany = jest.fn().mockResolvedValue({ data: [] });
        const mockedDataProvider = {
            ...dataProvider,
            updateMany,
        };
        render(<InBulkUpdateFormButton dataProvider={mockedDataProvider} />);
        fireEvent.click(
            (await screen.findAllByLabelText('Select this row'))[0]
        );
        fireEvent.click(
            await screen.findByRole('button', {
                name: 'Update',
            })
        );
        fireEvent.click(await screen.findByLabelText('Is public'));
        fireEvent.click(await screen.findByLabelText('Next'));
        await waitFor(() => {
            expect(screen.getAllByLabelText('Is public')).toHaveLength(2);
        });
        fireEvent.click(screen.getAllByLabelText('Is public')[1]);
        await new Promise(resolve => setTimeout(resolve, 100));
        fireEvent.click(screen.getByLabelText('Save'));
        await waitFor(() => {
            expect(updateMany).toHaveBeenCalledWith(
                'posts',
                expect.objectContaining({
                    ids: [1],
                    data: { is_public: true },
                })
            );
        });
    });

    it('should reset the form after submission', async () => {
        const update = jest.fn().mockResolvedValue({ data: { id: '1' } });
        const mockedDataProvider = {
            ...dataProvider,
            update,
        };
        render(<Basic dataProvider={mockedDataProvider} />);
        fireEvent.click(await screen.findByLabelText('Title'));
        fireEvent.click(await screen.findByLabelText('Next'));
        fireEvent.change(
            await screen.findByLabelText('Title', {
                selector: 'input[type="text"]',
            }),
            { target: { value: 'New title' } }
        );
        await new Promise(resolve => setTimeout(resolve, 100));
        fireEvent.click(screen.getByLabelText('Save'));
        await waitFor(() => {
            expect(update).toHaveBeenCalledWith(
                'posts',
                expect.objectContaining({
                    id: '1',
                    data: {
                        title: 'New title',
                    },
                })
            );
        });
        await screen.findByLabelText('Body');
        expect(screen.queryByText('Required')).toBeNull();
    });
});
