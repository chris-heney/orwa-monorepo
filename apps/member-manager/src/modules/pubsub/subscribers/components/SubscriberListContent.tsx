import React from 'react';
import { UniversalListContent } from '../../../../_components';
import { SubscriberDataGrid } from './SubscriberDataGrid';
import { SubscriberMobileList } from './SubscriberMobileList';
import { SubscriberGridView } from './SubscriberGridView';
import { SubscriberMobileGrid } from './SubscriberMobileGrid';

export const SubscriberListContent: React.FC = () => {
    return (
        <UniversalListContent
            desktopListComponent={SubscriberDataGrid}
            desktopGridComponent={SubscriberGridView}
            mobileListComponent={SubscriberMobileList}
            mobileGridComponent={SubscriberMobileGrid}
        />
    );
};
