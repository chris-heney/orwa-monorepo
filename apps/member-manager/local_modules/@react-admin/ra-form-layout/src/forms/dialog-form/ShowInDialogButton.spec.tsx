import {
    fireEvent,
    render,
    screen,
    waitFor,
    within,
} from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { StandaloneInSimpleForm } from '../../../stories/dialogForm.stories';

describe('ShowInDialogButton', () => {
    it('should open the dialog on click on the button, and close it on click on the close button', async () => {
        render(
            <MemoryRouter initialEntries={['/employers/1']}>
                <StandaloneInSimpleForm />
            </MemoryRouter>
        );

        await screen.findByText('Employer #1');
        fireEvent.click(screen.getAllByLabelText('Show')[0]);
        await screen.findByText('Customer #4');
        const dialog = screen.getByTestId('show-dialog');
        within(dialog).getByText('First name');
        within(dialog).getByText('Anita');
        within(dialog).getByText('Last name');
        within(dialog).getByText('Johnson');
        fireEvent.click(screen.getByText('Informations'));
        within(dialog).getByText('born');
        within(dialog).getByText(new Date('1942-07-13').toLocaleDateString());
        within(dialog).getByText('Sex');
        within(dialog).getByText('Female');
        fireEvent.click(screen.getByLabelText('Close'));
        await waitFor(() => {
            expect(screen.queryByText('Customer #4')).toBeNull();
        });
    });
});
