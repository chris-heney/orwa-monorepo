/* eslint-disable jest/expect-expect */
import * as React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { Basic } from '../../../stories/longForm.stories';

describe('LongForm', () => {
    it('should render children of all sections', async () => {
        render(<Basic />);

        const firstName = (await screen.findByLabelText(
            /First name/
        )) as HTMLInputElement;
        expect(firstName.value).toBe('Alan');
        const occupation = (
            await screen.findAllByLabelText(/Name/)
        )[0] as HTMLInputElement;
        expect(occupation.value).toBe('Construction manager');
        const acceptEmails = (await screen.findByLabelText(
            'Accepts emails from partners'
        )) as HTMLInputElement;
        expect(acceptEmails.value).toBe('on');
    });

    it('should render all section headers', async () => {
        render(<Basic />);

        const headerSelector = { selector: 'h4' };
        await screen.findByText('Identity', headerSelector);
        await screen.findByText('Occupations', headerSelector);
        await screen.findByText('Preferences', headerSelector);
    });

    it('should render TOC', async () => {
        render(<Basic />);

        const listItemSelector = { selector: 'li' };
        await screen.findByText('Identity', listItemSelector);
        await screen.findByText('Occupations', listItemSelector);
        await screen.findByText('Preferences', listItemSelector);
    });

    it('should scroll to the relevant section when clicking TOC item', async () => {
        const scrollToSpy = jest.fn();
        global.scrollTo = scrollToSpy;
        render(<Basic />);

        const listItemSelector = { selector: 'li' };

        const tocListItem = await screen.findByText(
            'Occupations',
            listItemSelector
        );
        fireEvent.click(tocListItem);
        expect(scrollToSpy).toHaveBeenCalledTimes(1); // Actual positions in px are not supported so we can't test much more than this

        scrollToSpy.mockClear();
    });
});
