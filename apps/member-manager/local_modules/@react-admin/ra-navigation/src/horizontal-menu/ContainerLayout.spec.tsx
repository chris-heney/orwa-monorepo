import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import expect from 'expect';

import { Basic, InvalidPage } from './ContainerLayout.stories';

describe('ContainerLayout', () => {
    it('should render A HorizontalMenu and the content', async () => {
        // silence ListGuesser logs
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        jest.spyOn(console, 'log').mockImplementationOnce(() => {});
        render(<Basic />);
        screen.getByText('React Admin');
        const songsMenuItem = await screen.findByText('Songs');
        await waitFor(() => {
            expect(songsMenuItem.getAttribute('aria-selected')).toBe('true');
        });
        screen.getByText('Artists');
        await screen.findByText('Like a Rolling Stone');
    });
    // eslint-disable-next-line jest/expect-expect
    it('should render the menu even on invalid pages', () => {
        render(<InvalidPage />);
        screen.getByText('React Admin');
        screen.getByText('Songs');
        screen.getByText('Artists');
    });
});
