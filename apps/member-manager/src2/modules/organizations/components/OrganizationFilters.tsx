import React from 'react';
import { UniversalFilters } from '../../../_components';

const organizationTypes = [
    { id: 'Dealer', name: 'Dealer' },
    { id: 'Vendor', name: 'Vendor' },
    { id: 'Customer', name: 'Customer' },
    { id: 'Competitor', name: 'Competitor' },
    { id: 'DirectoryListing', name: 'DirectoryListing' },
];

export const OrganizationFilters = ({ header = true }: { header?: boolean }) => {
    const multiSelectFilters = [
        {
            source: 'organizationType',
            label: 'Organization Type',
            options: organizationTypes,
            chipColor: 'primary' as const,
            showAvatar: true,
        },
    ];

    return (
        <UniversalFilters
            header={header}
            searchPlaceholder="Search organizations..."
            multiSelectFilters={multiSelectFilters}
        />
    );
};
