import React from 'react';
import { UniversalListToolbar } from '../../../_components';

export const OrganizationListToolbar: React.FC = () => {
    return (
        <UniversalListToolbar
            title="Organizations"
            showViewToggle={true}
            showSidebarToggle={true}
        />
    );
};
