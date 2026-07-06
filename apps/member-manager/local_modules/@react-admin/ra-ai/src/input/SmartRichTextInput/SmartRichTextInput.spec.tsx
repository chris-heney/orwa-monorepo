import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Basic } from './SmartRichTextInput.stories';

describe('SmartRichTextInput', () => {
    /* eslint-disable jest/expect-expect */
    it('should show 4 new buttons', () => {
        render(<Basic />);
        screen.getByRole('button', { name: 'Auto-correct' });
        screen.getByRole('button', { name: 'Rephrase' });
        screen.getByRole('button', { name: 'Summarize' });
        screen.getByRole('button', { name: 'Continue writing' });
    });
    /* eslint-enable jest/expect-expect */

    it('should allow smart completion', async () => {
        const { container } = render(<Basic />);
        const contentEditableDiv = container.querySelector('div.ProseMirror');
        if (!contentEditableDiv) throw new Error('contentEditableDiv is null');
        await waitFor(() => {
            expect(contentEditableDiv.innerHTML).toEqual(
                '<p>Lorem ipsum dolor sit amet</p>'
            );
        });
        // select the first word
        const range = document.createRange();
        const selection = window.getSelection();
        range.selectNodeContents(contentEditableDiv);
        selection?.removeAllRanges();
        selection?.addRange(range);
        screen.getByRole('button', { name: 'Continue writing' }).click();

        await waitFor(
            () =>
                expect(contentEditableDiv.innerHTML).toEqual(
                    '<p>Ipsum lorem sit dolor ametLorem ipsum dolor sit amet</p>'
                ),
            { timeout: 10000 }
        );
    });
});
