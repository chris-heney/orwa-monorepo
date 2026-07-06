/* eslint-disable jest/expect-expect */
import * as React from 'react';
import {
    fireEvent,
    render,
    screen,
    waitFor,
    within,
} from '@testing-library/react';
import * as Stories from '../../../stories/stackedFilters.stories';

describe('StackedFilters', () => {
    test('should display a dropdown menu allowing to apply multiple filters', async () => {
        render(<Stories.Basic />);

        // Wait for the data to load
        await screen.findByText('Sed quo et et fugiat modi');

        // Open the filters menu
        fireEvent.click(screen.getByLabelText('Filters'));

        // Add a filter for the "title" field
        const sourceInput = screen.getByLabelText('Source');
        fireEvent.mouseDown(sourceInput); // Don't use click wih AutocompleteInput
        await waitFor(() => screen.getAllByRole('option'));
        fireEvent.click(
            screen.getByText('Title', { selector: '[role="option"]' })
        );
        fireEvent.blur(sourceInput);

        // Select the "contains" operator
        await screen.findByLabelText('Operator');
        const operatorInput = screen.getByLabelText('Operator');
        fireEvent.mouseDown(operatorInput); // Don't use click wih MUI Selects
        await screen.findByText('Contains');
        fireEvent.click(screen.getByText('Contains'));
        fireEvent.blur(operatorInput);

        // Set the filter value
        await screen.findByLabelText('Value');
        fireEvent.change(screen.getByLabelText('Value'), {
            target: { value: 'volup' },
        });

        // Apply the filter
        fireEvent.click(screen.getByText('Apply'));
        await screen.findByText('1-4 of 4');

        // Open the filters menu
        fireEvent.click(screen.getByLabelText('Filters'));
        fireEvent.click(screen.getByText('Add filter'));

        // Add a filter for the "is_public" field
        const sourceInput2 = screen.getAllByLabelText('Source')[1];
        fireEvent.mouseDown(sourceInput2); // Don't use click wih MUI Selects
        await waitFor(() => screen.getAllByRole('option'));
        fireEvent.click(
            screen.getByText('Is public', { selector: '[role="option"]' })
        );
        fireEvent.blur(sourceInput2);
        await screen.findByLabelText('Is true');

        // Set its value to true by checking the checkbox
        fireEvent.click(screen.getByLabelText('Is true'));

        // Apply the filter
        fireEvent.click(screen.getByText('Apply'));
        await screen.findByText('1-1 of 1');
    }, 20000); // The test is long so we need a greater timeout

    test('should display applied filters', async () => {
        render(<Stories.ExistingFilters />);

        // Wait for the data to load
        await screen.findByText('1-1 of 1');

        const filterButton = screen.getByLabelText('Filters');
        await within(filterButton.closest('span') as HTMLElement).findByText(
            '2'
        );

        // Open the filters menu
        fireEvent.click(filterButton);

        // Check that the filters are displayed
        await screen.findByDisplayValue('Title');
        await screen.findByDisplayValue('q');
        await screen.findByDisplayValue('volup');

        await screen.findByDisplayValue('Is public');
    });

    test('should allow to remove one filter', async () => {
        render(<Stories.ExistingFilters />);

        // Wait for the data to load
        await screen.findByText('1-1 of 1');

        const filterButton = screen.getByLabelText('Filters');

        // Open the filters menu
        fireEvent.click(filterButton);

        // Remove the is_public filter
        fireEvent.click(screen.getAllByLabelText('Remove')[1]);

        // Apply the filter
        fireEvent.click(screen.getByText('Apply'));
        await screen.findByText('1-4 of 4');
    });

    test('should allow to remove all filters', async () => {
        render(<Stories.ExistingFilters />);

        // Wait for the data to load
        await screen.findByText('1-1 of 1');

        // Open the filters menu
        const filterButton = screen.getByLabelText('Filters');
        fireEvent.click(filterButton);

        // Remove the all filters
        fireEvent.click(screen.getByText('Remove all filters'));

        await screen.findByText('1-10 of 13');
    });
});
