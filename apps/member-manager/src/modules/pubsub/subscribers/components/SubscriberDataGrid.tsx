import React from 'react';
import { useMediaQuery, useTheme } from '@mui/material';
import {
    DateField,
    FunctionField,
    ReferenceField,
    TextField,
    SimpleList,
    DatagridConfigurable,
} from 'react-admin';
import { customDatagridStyle } from '../../../../themes/customDatagridStyles';
import { SubscriberStatusField } from './SubscriberStatusField';
import { SubscriberQuickActions } from './SubscriberQuickActions';
import { SubscriberMobileCard } from './SubscriberMobileCard';

export const SubscriberDataGrid = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    if (isMobile) {
        // Use SimpleList with custom mobile card renderer
        return (
            <SimpleList
                primaryText={(record: any) => (
                    <SubscriberMobileCard record={record} />
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
            bulkActionButtons={false}
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
            <ReferenceField
                source="topicId"
                reference="pub-sub-topic"
                label="Topic"
                link="show"
                sx={{ display: { xs: 'none', sm: 'table-cell' } }}
            >
                <TextField source="name" />
            </ReferenceField>

            <TextField source="type" label="Type" />

            <FunctionField
                source="isActive"
                label="Status"
                render={() => <SubscriberStatusField />}
            />

            <FunctionField
                source="deliveries"
                label="Deliveries"
                sortable={false}
                render={(record: any) => {
                    return record.deliveries.length;
                }}
            />

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
                render={() => <SubscriberQuickActions size="small" />}
            />
        </DatagridConfigurable>
    );
};

export default SubscriberDataGrid;
