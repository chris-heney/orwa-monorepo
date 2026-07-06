import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { StandaloneInSimpleForm } from '../../../stories/dialogForm.stories';

describe('CreateInDialogButton', () => {
    it('should open the dialog on click on the button, and close it on click on the close button', async () => {
        render(
            <MemoryRouter initialEntries={['/employers/1']}>
                <StandaloneInSimpleForm />
            </MemoryRouter>
        );

        await screen.findByText('Employer #1');
        fireEvent.click(screen.getAllByLabelText('Create')[0]);
        await screen.findByText('Create Customer');
        screen.getByLabelText('First name *');
        screen.getByLabelText('Last name *');
        fireEvent.click(screen.getByLabelText('Close'));
        await waitFor(() => {
            expect(screen.queryByText('Create Customer')).toBeNull();
        });
    });

    it('should open the dialog on click on the button, and close it on click on the save button', async () => {
        render(
            <MemoryRouter initialEntries={['/employers/1']}>
                <StandaloneInSimpleForm />
            </MemoryRouter>
        );

        await screen.findByText('Employer #1');
        fireEvent.click(screen.getAllByLabelText('Create')[0]);
        await screen.findByText('Create Customer');
        fireEvent.change(screen.getByLabelText('First name *'), {
            target: { value: 'Roger' },
        });
        fireEvent.change(screen.getByLabelText('Last name *'), {
            target: { value: 'Moore' },
        });
        fireEvent.click(screen.getByText('Informations'));
        fireEvent.change(screen.getByLabelText('born *'), {
            target: { value: '1927-10-14' },
        });
        fireEvent.click(screen.getAllByText('Save')[1]); // we need the 2nd save button (the one inside the dialog)
        await waitFor(() => {
            expect(screen.queryByText('Create Customer')).toBeNull();
        });
        await screen.findByText('Roger');
        await screen.findByText('Moore');
    });
});
