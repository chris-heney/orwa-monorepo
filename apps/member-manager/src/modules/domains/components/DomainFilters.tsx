import React from 'react';
import { useGetList } from 'react-admin';
import { UniversalFilters } from '../../../_components';

const technologyOptions = [
    { id: 'WordPress', name: 'WordPress' },
    { id: 'Webflow', name: 'Webflow' },
    { id: 'Static', name: 'Static HTML' },
    { id: 'React', name: 'React' },
    { id: 'Vue', name: 'Vue.js' },
    { id: 'Angular', name: 'Angular' },
    { id: 'Other', name: 'Other' },
];



export const DomainFilters = ({ header = true }: { header?: boolean }) => {
    // Get hosting providers for the filter
    const { data: hostingProviders = [] } = useGetList('hosting-provider', {
        pagination: { page: 1, perPage: 100 },
        sort: { field: 'name', order: 'ASC' },
    });

    const multiSelectFilters = [
        {
            source: 'technology',
            label: 'Technology',
            options: technologyOptions,
            chipColor: 'secondary' as const,
        },
        {
            source: 'hostingProviderId',
            label: 'Hosting Provider',
            options: hostingProviders.map((provider: any) => ({
                id: provider.id,
                name: provider.name,
            })),
            chipColor: 'primary' as const,
            showAvatar: true,
        },
    ];

    return (
        <UniversalFilters
            header={header}
            searchPlaceholder="Search domains..."
            multiSelectFilters={multiSelectFilters}
        />
    );
};
