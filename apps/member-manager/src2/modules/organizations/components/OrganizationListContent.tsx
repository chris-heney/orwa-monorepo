import React from 'react';
import { UniversalListContent } from '../../../_components';
import { OrganizationMobileGrid } from './OrganizationMobileGrid';
import { OrganizationMobileList } from './OrganizationMobileList';
import { OrganizationDatagrid } from './OrganizationDatagrid';
import { OrganizationGridView } from './OrganizationGridView';

export const OrganizationListContent: React.FC = () => {
    return (
        <UniversalListContent
            desktopListComponent={OrganizationDatagrid}
            desktopGridComponent={OrganizationGridView}
            mobileListComponent={OrganizationMobileList}
            mobileGridComponent={OrganizationMobileGrid}
        />
    );
};
