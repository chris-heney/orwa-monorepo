import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import expect from 'expect';

import { Basic, Grouped } from './ResourceBreadcrumbItem.stories';

describe('Breadcrumb.ResourceItem', () => {
    it('should render one item per CRUD page', async () => {
        render(<Basic />);
        const breadcrumb = screen.getByLabelText('Breadcrumb');
        expect(breadcrumb.textContent).toEqual('Songs');
        const imagineSong = await screen.findByText('Imagine');
        imagineSong.click();
        expect(breadcrumb.textContent).toEqual('SongsImagine');
        // navigate to Artists
        (await screen.findByText('Artists')).click();
        await waitFor(() => expect(breadcrumb.textContent).toEqual('Artists'));
        (await screen.findByText('Bob Dylan')).click();
        expect(breadcrumb.textContent).toEqual('ArtistsBob Dylan');
        (await screen.findByText('Songs')).click();
    });

    it('should render when inside another Resource.Item', async () => {
        render(<Grouped />);
        const breadcrumb = screen.getByLabelText('Breadcrumb');
        expect(breadcrumb.textContent).toEqual('MusicSongs');
        const imagineSong = await screen.findByText('Imagine');
        imagineSong.click();
        expect(breadcrumb.textContent).toEqual('MusicSongsImagine');
        // navigate to Artists
        (await screen.findByText('Artists')).click();
        await waitFor(() =>
            expect(breadcrumb.textContent).toEqual('MusicArtists')
        );
        (await screen.findByText('Create')).click();
        expect(breadcrumb.textContent).toEqual('MusicArtistsCreate');
    });
});
