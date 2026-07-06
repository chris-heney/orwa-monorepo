import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import expect from 'expect';

import { Basic, DetectLocation, FromResources } from './HorizontalMenu.stories';

describe('HorizontalMenu', () => {
    it('should render the basic HorizontalMenu', () => {
        render(<Basic />);
        const dashboardMenuItem = screen.getByText('Dashboard');
        expect(dashboardMenuItem.getAttribute('aria-selected')).toBe('true');
        screen.getByText('Songs');
        screen.getByText('Artists');
    });

    it('should read location from the AppLocation', async () => {
        render(<DetectLocation />);
        const customMenuItem = screen.getByText('Custom');
        await waitFor(() =>
            expect(customMenuItem.getAttribute('aria-selected')).toBe('true')
        );
    });

    it('should infer the items from resource definitions', () => {
        render(<FromResources />);
        screen.getByText('Posts');
        screen.getByText('Comments');
        expect(screen.queryByText('resources.tags.name')).toBeNull();
    });
});
