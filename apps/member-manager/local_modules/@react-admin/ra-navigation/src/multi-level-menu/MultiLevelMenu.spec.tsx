import * as React from 'react';
import { AdminContext } from 'react-admin';
import { fireEvent, render, screen } from '@testing-library/react';

import { AppLocationContext } from '../app-location';
import { MenuItemNode, MultiLevelMenu } from './';
import { MultiLevelMenuProps } from './MultiLevelMenu';
import { NoLocation } from '../../stories/MultiLevelMenu.stories';

const BasicMultiLevelMenu = (
    props: MultiLevelMenuProps
): React.ReactElement => (
    <MultiLevelMenu {...props}>
        <MenuItemNode name="dashboard" to="/" end label="Dashboard" />
        <MenuItemNode name="songs" to="/songs" label="Songs" />
        <MenuItemNode name="artists" to={'/artists?filter={}'} label="Artists">
            <MenuItemNode
                name="artists.rock"
                to={'/artists?filter={"type":"Rock"}'}
                label="Rock"
            >
                <MenuItemNode
                    name="artists.rock.pop"
                    to={'/artists?filter={"type":"Pop Rock"}'}
                    label="Pop Rock"
                />
                <MenuItemNode
                    name="artists.rock.folk"
                    to={'/artists?filter={"type":"Folk Rock"}'}
                    label="Folk Rock"
                />
            </MenuItemNode>
            <MenuItemNode
                name="artists.jazz"
                to={'/artists?filter={"type":"Jazz"}'}
                label="Jazz"
            >
                <MenuItemNode
                    name="artists.jazz.rb"
                    to={'/artists?filter={"type":"RB"}'}
                    label="R&B"
                />
            </MenuItemNode>
        </MenuItemNode>
        <MenuItemNode name="mixtape" label="Mixtape">
            <MenuItemNode name="mixtape.rap" label="Rap">
                <MenuItemNode
                    name="mixtape.rap.hiphop"
                    label="Hip Hop"
                    to={'/artists?filter={type: "Hip Hop"}'}
                />
            </MenuItemNode>
        </MenuItemNode>
    </MultiLevelMenu>
);

describe('MultiLevelMenu', () => {
    test('should display a menu with sub menus', () => {
        const { queryByText, queryAllByLabelText, unmount } = render(
            <AdminContext>
                <AppLocationContext>
                    <BasicMultiLevelMenu />
                </AppLocationContext>
            </AdminContext>
        );

        expect(queryByText('Dashboard')).not.toBeNull();
        expect(queryByText('Songs')).not.toBeNull();
        expect(queryByText('Mixtape')).not.toBeNull();
        expect(queryByText('Artists')).not.toBeNull();

        let expandButtons = queryAllByLabelText('ra.action.expand');
        expect(expandButtons).toHaveLength(2);

        fireEvent.click(expandButtons[0]);
        expect(queryByText('Rock')).not.toBeNull();
        expect(queryByText('Jazz')).not.toBeNull();

        const closeButtons = queryAllByLabelText('ra.action.close');
        expect(closeButtons).toHaveLength(1);

        expandButtons = queryAllByLabelText('ra.action.expand');
        expect(expandButtons).toHaveLength(3);
        fireEvent.click(expandButtons[0]);
        expect(queryByText('Pop Rock')).not.toBeNull();
        expect(queryByText('Folk Rock')).not.toBeNull();

        // For some reason, the react tree is not cleaned up up before running subsequent tests
        // This ensure it does not interfere with them
        unmount();
    });

    test('should open sub menus according to current app location', () => {
        const { queryByText, queryAllByLabelText, unmount } = render(
            <AdminContext>
                <AppLocationContext
                    initialLocation={{ path: 'artists.jazz.rb', values: {} }}
                >
                    <BasicMultiLevelMenu />
                </AppLocationContext>
            </AdminContext>
        );

        expect(queryByText('Dashboard')).not.toBeNull();
        expect(queryByText('Songs')).not.toBeNull();
        expect(queryByText('Mixtape')).not.toBeNull();
        expect(queryByText('Rap')).toBeNull();
        expect(queryByText('Hip Hop')).toBeNull();
        expect(queryByText('Artists')).not.toBeNull();
        expect(queryByText('Rock')).not.toBeNull();
        expect(queryByText('Pop Rock')).toBeNull();
        expect(queryByText('Folk Rock')).toBeNull();
        expect(queryByText('Jazz')).not.toBeNull();
        expect(queryByText('R&B')).not.toBeNull();

        const expandButtons = queryAllByLabelText('ra.action.expand');
        // Only Rock
        expect(expandButtons).toHaveLength(2);

        const closeButtons = queryAllByLabelText('ra.action.close');
        // Artists and Jazz
        expect(closeButtons).toHaveLength(2);

        // For some reason, the react tree is not cleaned up up before running subsequent tests
        // This ensure it does not interfere with them
        unmount();
    });

    test('should open sub menus immediately if initialOpen is set to true', () => {
        const { queryByText, unmount } = render(
            <AdminContext>
                <AppLocationContext>
                    <BasicMultiLevelMenu initialOpen />
                </AppLocationContext>
            </AdminContext>
        );

        expect(queryByText('Dashboard')).not.toBeNull();
        expect(queryByText('Songs')).not.toBeNull();
        expect(queryByText('Mixtape')).not.toBeNull();
        expect(queryByText('Rap')).not.toBeNull();
        expect(queryByText('Hip Hop')).not.toBeNull();
        expect(queryByText('Artists')).not.toBeNull();
        expect(queryByText('Rock')).not.toBeNull();
        expect(queryByText('Pop Rock')).not.toBeNull();
        expect(queryByText('Folk Rock')).not.toBeNull();
        expect(queryByText('Jazz')).not.toBeNull();
        expect(queryByText('R&B')).not.toBeNull();

        // For some reason, the react tree is not cleaned up up before running subsequent tests
        // This ensure it does not interfere with them
        unmount();
    });

    test('should open sub menus selected by openItemList', () => {
        const { queryByText, unmount } = render(
            <AdminContext>
                <AppLocationContext>
                    <BasicMultiLevelMenu
                        openItemList={['artists', 'artists.rock']}
                    />
                </AppLocationContext>
            </AdminContext>
        );

        expect(queryByText('Dashboard')).not.toBeNull();
        expect(queryByText('Songs')).not.toBeNull();
        expect(queryByText('Mixtape')).not.toBeNull();
        expect(queryByText('Artists')).not.toBeNull();
        expect(queryByText('Rock')).not.toBeNull();
        expect(queryByText('Pop Rock')).not.toBeNull();
        expect(queryByText('Folk Rock')).not.toBeNull();
        expect(queryByText('Jazz')).not.toBeNull();
        expect(queryByText('R&B')).toBeNull();

        // For some reason, the react tree is not cleaned up up before running subsequent tests
        // This ensure it does not interfere with them
        unmount();
    });

    test('should open sub menus when item without location is clicked', () => {
        const { queryByText, queryAllByLabelText, queryAllByText, unmount } =
            render(<NoLocation />);

        expect(queryByText('Songs')).not.toBeNull();
        expect(queryByText('Artists')).not.toBeNull();
        expect(queryByText('Rock')).toBeNull();
        expect(queryByText('Pop Rock')).toBeNull();

        const expandButtons = queryAllByLabelText('Expand');
        // Only Artists
        expect(expandButtons).toHaveLength(1);

        fireEvent.click(expandButtons[0]);

        const rock = queryAllByText('Rock');
        expect(rock).not.toBeNull();

        fireEvent.click(rock[0]);
        expect(queryByText('Pop Rock')).not.toBeNull();

        // For some reason, the react tree is not cleaned up up before running subsequent tests
        // This ensure it does not interfere with them
        unmount();
    });

    test('should display an error if MenuItem has no props to or children', () => {
        jest.spyOn(console, 'error').mockImplementation(() => jest.fn());
        expect(() =>
            render(
                <AdminContext>
                    <AppLocationContext>
                        <MultiLevelMenu>
                            <MenuItemNode name="artists" label="Artists" />
                        </MultiLevelMenu>
                    </AppLocationContext>
                </AdminContext>
            )
        ).toThrow(
            'A menu item must have at least one property to or have children'
        );
    });

    test('should support the onClick prop', () => {
        const onClick = jest.fn();
        render(
            <AdminContext>
                <AppLocationContext>
                    <MultiLevelMenu>
                        <MenuItemNode
                            name="dashboard"
                            to="/"
                            end
                            label="Dashboard"
                            onClick={() => onClick('dashboard')}
                        />
                        <MenuItemNode
                            name="songs"
                            to="/songs"
                            label="Songs"
                            onClick={() => onClick('songs')}
                        />
                    </MultiLevelMenu>
                </AppLocationContext>
            </AdminContext>
        );
        fireEvent.click(screen.getByText('Dashboard'));
        expect(onClick).toHaveBeenCalledWith('dashboard');
        fireEvent.click(screen.getByText('Songs'));
        expect(onClick).toHaveBeenCalledWith('songs');
    });
});
