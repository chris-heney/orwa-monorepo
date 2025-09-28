import React from 'react';
import { UniversalListToolbar } from '../../../_components';

export const DomainListToolbar: React.FC = () => {
    return (
        <UniversalListToolbar
            title="Domains"
            showViewToggle={true}
            showSidebarToggle={true}
        />
    );
};