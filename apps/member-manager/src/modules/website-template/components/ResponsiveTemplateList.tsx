import { DatagridActionsField } from '../../../_components';
import WebsiteTemplateMobileCard from './WebsiteTemplateMobileCard';
import { customDatagridStyle } from '../../../themes/customDatagridStyles';
import { Box, Chip, useMediaQuery, useTheme } from '@mui/material';
import {
    BooleanField,
    Datagrid,
    DateField,
    FunctionField,
    ReferenceField,
    SimpleList,
    TextField,
} from 'react-admin';

// Responsive list component
const ResponsiveWebsiteTemplateList = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    if (isMobile) {
        return (
            <Box sx={{ p: 1 }}>
                <SimpleList
                    primaryText={record => (
                        <WebsiteTemplateMobileCard record={record} />
                    )}
                    linkType={false}
                    sx={{
                        '& .MuiListItem-root': {
                            padding: 0,
                            marginBottom: 1,
                        },
                        '& .MuiListItemText-root': {
                            margin: 0,
                        },
                    }}
                />
            </Box>
        );
    }

    return (
        <Datagrid
            bulkActionButtons={false}
            rowClick="show"
            sx={{
                ...customDatagridStyle,
                width: '100%',
                '& .RaDatagrid-table': {
                    width: '100%',
                    minWidth: '100%',
                    borderCollapse: 'separate',
                    borderSpacing: 0,
                },
                '& .RaDatagrid-thead': {
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                    backgroundColor: theme.palette.background.default,
                },
                '& .RaDatagrid-headerCell': {
                    padding: { xs: '12px 8px', sm: '16px 12px' },
                    fontSize: { xs: '0.875rem', sm: '0.875rem' },
                    fontWeight: 600,
                    borderBottom: `2px solid ${theme.palette.divider}`,
                    backgroundColor: theme.palette.background.default,
                    whiteSpace: 'nowrap',
                    position: 'sticky',
                    top: 0,
                },
                '& .RaDatagrid-cell': {
                    padding: { xs: '12px 8px', sm: '16px 12px' },
                    fontSize: { xs: '0.875rem', sm: '0.875rem' },
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    verticalAlign: 'middle',
                },
                '& .RaDatagrid-row': {
                    '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                    },
                },
            }}
        >
            <TextField source="name" label="Name" />
            <TextField source="slug" label="Slug" />
            <ReferenceField
                source="industryId"
                reference="industry"
                label="Industry"
            >
                <TextField source="name" />
            </ReferenceField>
            <FunctionField
                source="style"
                label="Style"
                render={(record: any) => (
                    <Chip
                        label={record.style}
                        size="small"
                        color="primary"
                        variant="outlined"
                    />
                )}
            />
            <BooleanField source="isActive" label="Active" />
            <DateField source="updatedAt" label="Updated" showTime={false} />
            <FunctionField
                source="createdAt"
                sortable={false}
                cellClassName="align-right"
                label="Actions"
                render={() => {
                    return <DatagridActionsField hasEdit />;
                }}
            />
        </Datagrid>
    );
};

export default ResponsiveWebsiteTemplateList;
