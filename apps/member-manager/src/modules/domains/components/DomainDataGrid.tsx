import React from 'react';
import { useMediaQuery, useTheme } from '@mui/material';
import {
    DateField,
    FunctionField,
    ReferenceField,
    TextField as RaTextField,
    SimpleList,
    DatagridConfigurable,
} from 'react-admin';
import { customDatagridStyle } from '../../../themes/customDatagridStyles';
import {
    DnsRecordsSummary,
    DomainBulkActions,
    DomainQuickActions,
    DomainStatusField,
    DomainUrlField,
} from './index';
import DomainMobileCard from './DomainMobileCard';

export const DomainDatagrid = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    if (isMobile) {
        // Use SimpleList with custom mobile card renderer
        return (
            <SimpleList
                primaryText={(record: any) => (
                    <DomainMobileCard record={record} />
                )}
                linkType={false}
                sx={{
                    width: '100%',
                    '& .MuiList-root': { width: '100%', padding: 0 },
                    '& .MuiListItem-root': {
                        padding: 0,
                        marginBottom: 1,
                        width: '100%',
                    },
                    '& .MuiListItemText-root': { margin: 0, width: '100%' },
                }}
            />
        );
    }
    return (
        <DatagridConfigurable
            rowClick="show"
            bulkActionButtons={<DomainBulkActions />}
            sx={{
                ...customDatagridStyle,
                width: '100%',
                borderRadius: 0,
                maxHeight: 'calc(100vh - 200px)',
                border: 'none',
                overflow: 'visible',
                '& .RaDatagrid-headerCell': {
                    position: 'sticky',
                    top: 0,
                    backgroundColor: theme.palette.background.paper,
                    zIndex: 2,
                },
            }}
        >
            <FunctionField
                source="url"
                label="URL"
                render={() => <DomainUrlField />}
                sx={{ display: { xs: 'none', sm: 'table-cell' } }}
            />
            <FunctionField
                source="status"
                label="Status"
                render={() => <DomainStatusField />}
            />
            <FunctionField
                source="dnsRecords"
                label="DNS"
                render={() => <DnsRecordsSummary />}
                sx={{ display: { xs: 'none', md: 'table-cell' } }}
            />
            <ReferenceField
                source="hostingProviderId"
                reference="hosting-provider"
                label="Provider"
                link={false}
                sx={{ display: { xs: 'none', lg: 'table-cell' } }}
            >
                <RaTextField source="name" />
            </ReferenceField>
            <RaTextField
                source="technology"
                label="Tech"
                emptyText="Not specified"
                sx={{ display: { xs: 'none', md: 'table-cell' } }}
            />
            <ReferenceField
                source="organizationId"
                reference="organization"
                label="Organization"
                link={false}
                emptyText="Unassigned"
                sx={{ display: { xs: 'none', lg: 'table-cell' } }}
            >
                <RaTextField source="name" />
            </ReferenceField>
            <DateField
                source="updatedAt"
                label="Updated"
                showTime={false}
                sx={{ display: { xs: 'none', sm: 'table-cell' } }}
            />
            <FunctionField
                source="createdAt"
                sortable={false}
                cellClassName="align-right"
                label="Actions"
                render={() => <DomainQuickActions size="small" />}
            />
        </DatagridConfigurable>
    );
};

export default DomainDatagrid;
