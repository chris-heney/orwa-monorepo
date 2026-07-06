import * as React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import expect from 'expect';

import {
    Basic,
    MultilineAutoSize,
    Type,
    PromptGenerator,
    Debounce,
    Context,
    MaxSize,
    Stop,
    Temperature,
} from './PredictiveTextInput.stories';

describe('PredictiveTextInput', () => {
    it('should render a text input with the record value', () => {
        render(<Basic />);
        expect((screen.getByLabelText('Title') as HTMLInputElement).value).toBe(
            'Lorem'
        );
    });
    it('should show a completion on click', async () => {
        render(<Basic />);
        screen.getByLabelText('Title').focus();
        const completionInput = screen.getByTestId(
            'ra-ai.title.completion'
        ) as HTMLInputElement;
        await waitFor(() =>
            expect(completionInput.value).toBe('Lorem dolor sit amet')
        );
    });
    it('should accept the completion on tab', async () => {
        render(<Basic />);
        screen.getByLabelText('Title').focus();
        const completionInput = screen.getByTestId(
            'ra-ai.title.completion'
        ) as HTMLInputElement;
        await waitFor(() =>
            expect(completionInput.value).toBe('Lorem dolor sit amet')
        );
        fireEvent.keyDown(screen.getByLabelText('Title'), { key: 'Tab' });
        expect((screen.getByLabelText('Title') as HTMLInputElement).value).toBe(
            'Lorem dolor sit amet'
        );
    });
    // eslint-disable-next-line jest/expect-expect
    it('should call dataProvider.getCompletion() on focus', async () => {
        render(<Debounce debounce={100} />);
        await screen.findByText('0 calls to the dataProvider');
        const input = screen.getByLabelText('Title');
        input.focus();
        await screen.findByText('1 calls to the dataProvider');
    });
    describe('multiline', () => {
        it('should render a textarea with the record value', () => {
            render(<MultilineAutoSize />);
            expect(
                (screen.getByLabelText('Title') as HTMLInputElement).value
            ).toBe('Lorem ipsum');
        });
        it('should show a completion on click', async () => {
            render(<MultilineAutoSize />);
            screen.getByLabelText('Title').focus();
            const completionInput = screen.getByTestId(
                'ra-ai.title.completion'
            ) as HTMLInputElement;
            await waitFor(() =>
                expect(completionInput.value).toBe('Lorem ipsum dolor sit amet')
            );
        });
        it('should accept the completion on tab', async () => {
            render(<MultilineAutoSize />);
            screen.getByLabelText('Title').focus();
            const completionInput = screen.getByTestId(
                'ra-ai.title.completion'
            ) as HTMLInputElement;
            await waitFor(() =>
                expect(completionInput.value).toBe('Lorem ipsum dolor sit amet')
            );
            fireEvent.keyDown(screen.getByLabelText('Title'), { key: 'Tab' });
            expect(
                (screen.getByLabelText('Title') as HTMLInputElement).value
            ).toBe('Lorem ipsum dolor sit amet');
        });
    });
    describe('type', () => {
        it('should render an input with the right type', () => {
            render(<Type />);
            const input = screen.getByLabelText(
                'Social security'
            ) as HTMLInputElement;
            expect(input.type).toBe('number');
            expect(input.value).toBe('123');
        });
        it('should show a completion on click', async () => {
            render(<Type />);
            screen.getByLabelText('Social security').focus();
            const completionInput = screen.getByTestId(
                'ra-ai.socialSecurity.completion'
            ) as HTMLInputElement;
            await waitFor(() =>
                expect(completionInput.value).toBe('123456789')
            );
        });
    });
    describe('promptGenerator', () => {
        // eslint-disable-next-line jest/expect-expect
        it('should use the promptGenerator to generate the prompt', async () => {
            render(<PromptGenerator />);
            screen.getByLabelText('Title').focus();
            await screen.findByText(
                'Custom prompt is: {"resource":"users","name":"title","value":"Lorem","record":{"title":"Lorem"},"locale":"en"}'
            );
        });
    });
    describe('maxSize', () => {
        // eslint-disable-next-line jest/expect-expect
        it('should be passed to the dataProvider.getCompletion()', async () => {
            render(<MaxSize />);
            screen.getByLabelText('Title').focus();
            await screen.findByText('Custom maxSize param is: 128');
        });
    });
    describe('stop', () => {
        // eslint-disable-next-line jest/expect-expect
        it('should be passed to the dataProvider.getCompletion()', async () => {
            render(<Stop />);
            screen.getByLabelText('Title').focus();
            await screen.findByText('Custom stop param is: ["ipsum","sic"]');
        });
    });
    describe('temperature', () => {
        // eslint-disable-next-line jest/expect-expect
        it('should be passed to the dataProvider.getCompletion()', async () => {
            render(<Temperature />);
            screen.getByLabelText('Title').focus();
            await screen.findByText('Custom temperature param is: 0.5');
        });
    });
    describe('debounce', () => {
        // eslint-disable-next-line jest/expect-expect
        it('should debounce the completion', async () => {
            render(<Debounce debounce={100} />);
            await screen.findByText('0 calls to the dataProvider');
            const input = screen.getByLabelText('Title');
            input.focus();
            await screen.findByText('1 calls to the dataProvider');
            fireEvent.change(input, { target: { value: 'A' } });
            await new Promise(resolve => setTimeout(resolve, 50)); // wait for 50ms
            fireEvent.change(input, { target: { value: 'B' } });
            await new Promise(resolve => setTimeout(resolve, 50)); // wait for 50ms
            fireEvent.change(input, { target: { value: 'C' } });
            await screen.findByText('2 calls to the dataProvider');
        });
    });
    describe('context', () => {
        it('should pass the record to the promptGenerator', async () => {
            render(<Context />);
            screen.getByLabelText('Email').focus();
            const completionInput = screen.getByTestId(
                'ra-ai.email.completion'
            ) as HTMLInputElement;
            await waitFor(() =>
                expect(completionInput.value).toBe('john.doe@acme.com')
            );
        });
    });
});
