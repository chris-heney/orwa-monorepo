/* eslint-disable jest/expect-expect */
import * as React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Basic } from '../../stories/solar-layout/SolarMenuLocalesItem.stories';

describe('SolarMenuLocalesItem', () => {
    it('should allow to change language', async () => {
        render(<Basic />);

        await screen.findByText('Dashboard');
        fireEvent.click(screen.getByText('Français'));
        await waitFor(() => {
            screen.getByText('Tableau de bord');
        });

        fireEvent.click(screen.getByText('English'));
        await waitFor(() => {
            screen.getByText('Dashboard');
        });
    });
});
