import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import expect from 'expect';

import {
    Basic,
    Omit,
    PreferenceKey,
    LabelElement,
    NullChildren,
} from '../stories/configurable.stories';

describe('<EditableDatagridConfigurable>', () => {
    it('should render a datagrid with configurable columns', async () => {
        render(<Basic />);
        screen.getByLabelText('Configure this page').click();
        await screen.findByText('Inspector');
        fireEvent.mouseOver(screen.getByText('Streep'));
        await screen.getByTitle('Customize').click();
        await screen.findByText('EditableDatagrid');
        await screen.findByText('Streep');
        // Check it's reflected in the form
        fireEvent.click(screen.getByText('Streep'));
        expect(screen.queryByDisplayValue('Meryl')).not.toBeNull();
        fireEvent.click(screen.getByLabelText('Cancel'));
        screen.getByLabelText('Original title').click();
        expect(screen.queryByText('Meryl')).toBeNull();
        // Check it's reflected in the form
        fireEvent.click(screen.getByText('Streep'));
        expect(screen.queryByDisplayValue('Meryl')).toBeNull();
        fireEvent.click(screen.getByLabelText('Cancel'));
        screen.getByLabelText('Original title').click();
        expect(screen.queryByText('Meryl')).not.toBeNull();
        // Check it's reflected in the form
        fireEvent.click(screen.getByText('Streep'));
        expect(screen.queryByDisplayValue('Meryl')).not.toBeNull();
        fireEvent.click(screen.getByLabelText('Cancel'));
    });
    it('should accept fields with a custom label', async () => {
        render(<Basic />);
        screen.getByLabelText('Configure this page').click();
        await screen.findByText('Inspector');
        fireEvent.mouseOver(screen.getByText('Streep'));
        await screen.getByTitle('Customize').click();
        await screen.findByText('EditableDatagrid');
        expect(screen.queryByText('Meryl')).not.toBeNull();
        screen.getByLabelText('Original title').click();
        expect(screen.queryByText('Meryl')).toBeNull();
        screen.getByLabelText('Original title').click();
        expect(screen.queryByText('Meryl')).not.toBeNull();
    });
    it('should accept fields with a label element', async () => {
        render(<LabelElement />);
        screen.getByLabelText('Configure this page').click();
        await screen.findByText('Inspector');
        fireEvent.mouseOver(screen.getByText('Streep'));
        await screen.getByTitle('Customize').click();
        await screen.findByText('EditableDatagrid');
        expect(screen.queryByText('Meryl')).not.toBeNull();
        screen.getByLabelText('Firstname').click();
        expect(screen.queryByText('Meryl')).toBeNull();
        screen.getByLabelText('Firstname').click();
        expect(screen.queryByText('Meryl')).not.toBeNull();
    });
    it('accepts null children', async () => {
        render(<NullChildren />);
        screen.getByLabelText('Configure this page').click();
        await screen.findByText('Inspector');
        fireEvent.mouseOver(screen.getByText('Streep'));
        expect(screen.queryByText('Id')).toBeNull();
        await screen.getByTitle('Customize').click();
        await screen.findByText('EditableDatagrid');
        expect(screen.queryByText('Meryl')).not.toBeNull();
        expect(screen.queryByText('Id')).toBeNull();
        screen.getByLabelText('Firstname').click();
        expect(screen.queryByText('Meryl')).toBeNull();
        screen.getByLabelText('Firstname').click();
        expect(screen.queryByText('Meryl')).not.toBeNull();
    });
    describe('omit', () => {
        it('should not render omitted columns by default', async () => {
            render(<Omit />);
            await screen.queryByText('Streep');
            expect(screen.queryByText('Firstname')).toBeNull();
            expect(screen.queryByText('Meryl')).toBeNull();
            screen.getByLabelText('Configure this page').click();
            await screen.findByText('Inspector');
            fireEvent.mouseOver(screen.getByText('Streep'));
            await screen.getByTitle('Customize').click();
            await screen.findByText('EditableDatagrid');
            screen.getByLabelText('Firstname').click();
            expect(screen.queryByText('Meryl')).not.toBeNull();
        });
    });
    describe('preferenceKey', () => {
        it('should allow two ConfigurableDatagrid not to share the same preferences', async () => {
            render(<PreferenceKey />);
            await screen.findAllByText('Freddy');
            expect(screen.queryAllByText('Freddy')).toHaveLength(2);
            screen.getByLabelText('Configure this page').click();
            await screen.findByText('Inspector');
            fireEvent.mouseOver(screen.getAllByText('Freddy')[0]);
            await screen.getByTitle('Customize').click();
            await screen.findByText('EditableDatagrid');
            screen.getByLabelText('Firstname').click();
            expect(screen.queryAllByText('Freddy')).toHaveLength(1);
        });
    });
});
