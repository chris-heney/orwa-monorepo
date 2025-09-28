import React from 'react';
import { UniversalListContent } from '../../../_components';
import DomainDatagrid from './DomainDataGrid';
import { DomainGridView } from './DomainGridView';
import { DomainMobileGrid } from './DomainMobileGrid';
import { DomainMobileList } from './DomainMobileList';

export const DomainListContent: React.FC = () => {
    return (
        <UniversalListContent
            desktopListComponent={DomainDatagrid}
            desktopGridComponent={DomainGridView}
            mobileListComponent={DomainMobileList}
            mobileGridComponent={DomainMobileGrid}
        />
    );
};
