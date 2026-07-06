import { resolveResourceLocationInfo } from './resolveResourceLocationInfo';

const fakeResource = {
    name: 'songs',
    hasList: true,
    hasEdit: true,
    hasCreate: true,
    hasShow: true,
};

const fakeResource2 = {
    name: 'songsReleased',
    hasList: true,
    hasEdit: true,
    hasCreate: true,
    hasShow: true,
};

describe('resolveResourceLocationInfo', () => {
    it('should return the right ResourceLocationInfo from pathname and resources', () => {
        expect(
            resolveResourceLocationInfo('/songs', [fakeResource, fakeResource2])
        ).toEqual({
            resource: 'songs',
            type: 'list',
        });

        expect(
            resolveResourceLocationInfo('/songsReleased', [
                fakeResource,
                fakeResource2,
            ])
        ).toEqual({
            resource: 'songsReleased',
            type: 'list',
        });

        expect(
            resolveResourceLocationInfo('/songs/create', [fakeResource])
        ).toEqual({ resource: 'songs', type: 'create' });

        // Support for tabbed form with tabs having paths
        expect(
            resolveResourceLocationInfo('/songs/create/view', [fakeResource])
        ).toEqual({ resource: 'songs', type: 'create' });

        expect(
            resolveResourceLocationInfo('/songs/42/show', [fakeResource])
        ).toEqual({ resource: 'songs', type: 'show', recordId: '42' });

        // Support for tabbed layouts with tabs having paths
        expect(
            resolveResourceLocationInfo('/songs/42/show/view', [fakeResource])
        ).toEqual({ resource: 'songs', type: 'show', recordId: '42' });

        expect(
            resolveResourceLocationInfo('/songs/42', [fakeResource])
        ).toEqual({ resource: 'songs', type: 'edit', recordId: '42' });

        // Support for tabbed form with tabs having paths
        expect(
            resolveResourceLocationInfo('/songs/42/view', [fakeResource])
        ).toEqual({ resource: 'songs', type: 'edit', recordId: '42' });

        expect(
            resolveResourceLocationInfo('/others', [fakeResource])
        ).toBeNull();
    });
});
