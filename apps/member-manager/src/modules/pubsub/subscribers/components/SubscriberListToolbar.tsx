import React from 'react';
import { UniversalListToolbar } from '../../../../_components';

export const SubscriberListToolbar: React.FC = () => {
    return (
        <UniversalListToolbar
            title="Subscribers"
            showViewToggle={true}
            showSidebarToggle={true}
        />
    );
};
