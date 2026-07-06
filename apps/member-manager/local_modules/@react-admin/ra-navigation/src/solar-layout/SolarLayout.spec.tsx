/* eslint-disable jest/expect-expect */
import * as React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import {
    Basic,
    WithDashboard,
    WithPageTitle,
    WithDefaultUserMenu,
    WithLocalesSupport,
    WithThemeSupport,
    WithDefaultUserMenuAndThemeAndLocalesSupport,
    WithCustomAppbar,
} from '../../stories/solar-layout/basic.stories';
import { Basic as CustomMenuBasic } from '../../stories/solar-layout/custom-menu.stories';

describe('SolarLayout', () => {
    it('should render a default menu with the registered resources', async () => {
        render(<Basic />);
        await screen.findByLabelText('Songs');
        await screen.findByLabelText('Artists');
        expect(screen.queryByLabelText('Dashboard')).toBeNull();
    });
    it('should render a default menu with the registered resources and dashboard when provided', async () => {
        render(<WithDashboard />);
        await screen.findByLabelText('Songs');
        await screen.findByLabelText('Artists');
        await screen.findByLabelText('Dashboard');
    });
    it('should allow customizing the layout', async () => {
        render(<WithPageTitle />);
        await screen.findByLabelText('Dashboard');
        await screen.findByText('Dashboard');
        fireEvent.click(await screen.findByLabelText('Songs'));
        await screen.findByText('Songs');
    });
    it('should leverage the app location to show the current page in the menu', async () => {
        render(<WithPageTitle />);
        await screen.findByLabelText('Dashboard');
        fireEvent.click(await screen.findByLabelText('Songs'));
        await screen.findByText('Songs');
        expect(
            screen.getByLabelText('Songs').getAttribute('aria-current')
        ).toEqual('page');
        expect(
            screen.getByLabelText('Artists').getAttribute('aria-current')
        ).toBeNull();
    });
    it('should display a user menu when an authProvider is specified', async () => {
        render(<WithDefaultUserMenu />);
        await screen.findByLabelText('Dashboard');
        fireEvent.click(await screen.findByLabelText('Profile'));
        await screen.findByText('Jane Doe');
        await screen.findByLabelText('Logout');
        // Close the menu to avoid issues with the other tests
        fireEvent.click(await screen.findByLabelText('Profile'));
    });
    it('should display a refresh button', async () => {
        render(<Basic />);
        await screen.findByLabelText('Refresh');
    });
    it('should display a settings menu when no authProvider is specified and an i18nProvider supporting multiple locales is specified', async () => {
        render(<WithLocalesSupport />);
        await screen.findByLabelText('Dashboard');
        fireEvent.click(await screen.findByLabelText('Customize'));
        await screen.findByText('Français');
        await screen.findByText('English');
        // Close the menu to avoid issues with the other tests
        fireEvent.click(await screen.findByLabelText('Customize'));
    });
    it('should display a settings menu when no authProvider is specified and a dark theme is specified', async () => {
        render(<WithThemeSupport />);
        await screen.findByLabelText('Dashboard');
        fireEvent.click(await screen.findByLabelText('Customize'));
        await screen.findByText('Toggle Theme');
        // Close the menu to avoid issues with the other tests
        fireEvent.click(await screen.findByLabelText('Customize'));
    });
    it('should display a user menu when an authProvider, and an i18nProvider supporting multiple locales and a dark theme are specified', async () => {
        render(<WithDefaultUserMenuAndThemeAndLocalesSupport />);
        await screen.findByLabelText('Dashboard');

        fireEvent.click(await screen.findByLabelText('Profile'));
        await screen.findByText('Jane Doe');
        await screen.findByLabelText('Logout');
        await screen.findByText('Français');
        await screen.findByText('English');
        await screen.findByText('Toggle Theme');
        // Close the menu to avoid issues with the other tests
        fireEvent.click(await screen.findByLabelText('Profile'));
    });
    it('should display a secondary drawer when a menu item has children', async () => {
        render(<CustomMenuBasic />);
        await screen.findByLabelText('Dashboard');

        fireEvent.click(await screen.findByLabelText('Songs'));
        await screen.findByText('All Songs');
        // Close the menu to avoid issues with the other tests
        fireEvent.click(await screen.findByLabelText('Songs'));
    });
    it('should close the secondary drawer when one of its item is clicked', async () => {
        render(<CustomMenuBasic />);
        await screen.findByLabelText('Dashboard');

        fireEvent.click(await screen.findByLabelText('Songs'));
        await screen.findByText('All Songs');
        fireEvent.click(await screen.findByText('Rock Songs'));

        await waitFor(() => {
            expect(screen.queryByText('All Songs')).toBeNull();
        });
    });
    it('should switch the secondary drawer content when one of its item is clicked but another one was displayed', async () => {
        render(<CustomMenuBasic />);
        await screen.findByLabelText('Dashboard');

        fireEvent.click(await screen.findByLabelText('Songs'));
        await screen.findByText('All Songs');
        fireEvent.click(await screen.findByLabelText('Artists'));
        await screen.findByText('All Artists');
        // Close the menu to avoid issues with the other tests
        fireEvent.click(await screen.findByLabelText('Artists'));
    });
    it('should accept a custom appbar', async () => {
        render(<WithCustomAppbar />);
        await screen.findByText('Custom toolbar');
    });
});
