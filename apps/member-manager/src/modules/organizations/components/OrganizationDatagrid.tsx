import React from 'react';
import {
    Avatar,
    Box,
    Typography,
    useMediaQuery,
    useTheme,
    Tooltip,
    Badge,
    Chip,
} from '@mui/material';
import {
    Business as BusinessIcon,
    Group as GroupIcon,
    CheckCircle as CheckCircleIcon,
    Work as WorkIcon,
    TrendingUp as TrendingUpIcon,
    Person as PersonIcon,
} from '@mui/icons-material';
import { 
    DatagridConfigurable, 
    FunctionField, 
    SimpleList,
    TextField,
    EmailField,
    DateField,
    NumberField,
    ChipField,
    BooleanField,
    ReferenceField,
    Link,
} from 'react-admin';
import { Organization } from '@ci-connect/types';
import { customDatagridStyle } from '../../../themes/customDatagridStyles';
import { DatagridActionsField } from '../../../_components';
import OrganizationListActions from './OrganizationListActions';



// Helper function to get status indicators
const getStatusIndicators = (record: Organization) => {
    const indicators = [];
    
    if (record.projectDetails?.currentWebsiteUrl) {
        indicators.push({ icon: <CheckCircleIcon fontSize="small" />, color: 'success', tooltip: 'Has Website' });
    }
    
    if (record.organizationLocations && record.organizationLocations.length > 0) {
        indicators.push({ icon: <WorkIcon fontSize="small" />, color: 'info', tooltip: 'Has Locations' });
    }
    
    if (record.organizationContact && record.organizationContact.length > 0) {
        indicators.push({ icon: <GroupIcon fontSize="small" />, color: 'primary', tooltip: 'Has Contacts' });
    }
    
    if (record.marketingBudget && record.marketingBudget > 0) {
        indicators.push({ icon: <TrendingUpIcon fontSize="small" />, color: 'warning', tooltip: 'Has Budget' });
    }
    
    if (record.revenue && record.revenue > 0) {
        indicators.push({ icon: <TrendingUpIcon fontSize="small" />, color: 'success', tooltip: 'Has Revenue' });
    }
    
    if (record.primaryServices || record.secondaryServices) {
        indicators.push({ icon: <WorkIcon fontSize="small" />, color: 'info', tooltip: 'Has Services' });
    }
    
    if (record.authorNameAndTitle) {
        indicators.push({ icon: <PersonIcon fontSize="small" />, color: 'primary', tooltip: 'Has Author' });
    }
    
    return indicators;
};

export const OrganizationDatagrid: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    if (isMobile) {
        return (
            <SimpleList
                primaryText={(record: Organization) => (
                    <Box display="flex" alignItems="center" gap={2}>
                        <Badge
                            badgeContent={getStatusIndicators(record).length}
                            color="primary"
                        >
                        <Avatar
                            src={
                                record.primaryLogo?.fileUrl
                                    ? record.primaryLogo?.fileUrl
                                    : undefined
                                    
                            }
                            alt={record.name}
                            sx={{ width: 40, height: 40 }}
                        >
                            <BusinessIcon />
                        </Avatar>
                        </Badge>
                        <Box>
                            <Typography variant="body2" fontWeight={600}>
                                {record.name}
                            </Typography>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                {record.organizationType} • {record.industry?.name || 'No Industry'}
                            </Typography>
                        </Box>
                    </Box>
                )}
                secondaryText={(record: Organization) => (
                    <Box>
                        {record.email && (
                            <Typography variant="caption" display="block">
                                {record.email}
                            </Typography>
                        )}
                        {record.phone && (
                            <Typography variant="caption" display="block">
                                {record.phone}
                            </Typography>
                        )}
                        {(record.revenue || record.marketingBudget) && (
                            <Typography variant="caption" display="block">
                                {record.revenue && `Rev: $${(record.revenue / 100).toLocaleString()}`}
                                {record.revenue && record.marketingBudget && ' • '}
                                {record.marketingBudget && `Budget: $${(record.marketingBudget / 100).toLocaleString()}`}
                            </Typography>
                        )}
                        {(record.primaryServices || record.secondaryServices) && (
                            <Typography variant="caption" display="block">
                                <WorkIcon fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
                                {record.primaryServices || record.secondaryServices}
                            </Typography>
                        )}
                    </Box>
                )}
                linkType="show"
                sx={{
                    width: '100%',
                    '& .MuiList-root': { width: '100%', padding: 0 },
                    '& .MuiListItem-root': {
                        padding: 1,
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
            sx={{
                ...customDatagridStyle,
                width: '100%',
                height: '100%',
                borderRadius: 0,
                border: 'none',
                overflow: 'auto',
                '& .RaDatagrid-table': {
                    minWidth: '1600px', // Ensure minimum width for all columns
                },
                '& .RaDatagrid-headerCell': {
                    position: 'sticky',
                    top: 0,
                    backgroundColor: theme.palette.background.paper,
                    zIndex: 2,
                },
            }}
            bulkActionButtons={false}
        >
            {/* Organization Info */}
            <FunctionField
                label="Organization"
                noWrap
                render={(record: Organization) => (
                    <Box display="flex" alignItems="center" gap={2}>   
                        <Avatar
                            src={
                                record?.primaryLogo?.fileUrl || undefined
                            }
                            alt={record.name}
                            sx={{ width: 40, height: 40 }}
                        >
                            <BusinessIcon />
                        </Avatar>
                        <Box>
                            <Typography variant="body2" fontWeight={600}>
                                {record.name}
                            </Typography>
                            {record.dba && (
                                <Typography variant="caption" color="text.secondary">
                                    DBA: {record.dba}
                                </Typography>
                            )}
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{
                                    fontFamily: 'monospace',
                                    display: 'block',
                                }}
                            >
                                ID: {record.id}
                            </Typography>
                        </Box>
                    </Box>
                )}
                sx={{
                    '& .RaDatagrid-headerCell': {
                        width: '200px',
                        minWidth: '200px',
                        whiteSpace: 'nowrap',
                    },
                    '& .RaDatagrid-cell': {
                        whiteSpace: 'nowrap',
                    },
                }}
            />

            {/* Organization Type */}
            <ChipField
                source="organizationType"
                label="Type"
                sx={{
                    '& .RaDatagrid-headerCell': {
                        width: '120px',
                        minWidth: '120px',
                        whiteSpace: 'nowrap',
                    },
                    '& .RaDatagrid-cell': {
                        whiteSpace: 'nowrap',
                    },
                }}
            />

            {/* Industry */}
            <ReferenceField
                source="industryId"
                reference="industry"
                label="Industry"
               
            >
                <TextField noWrap source="name" />
            </ReferenceField>

            {/* Email */}
            <EmailField
                noWrap
                source="email"
                label="Email"
                sx={{
                    '& .RaDatagrid-headerCell': {
                        width: '150px',
                        minWidth: '150px',
                        whiteSpace: 'nowrap',
                    },
                    '& .RaDatagrid-cell': {
                        whiteSpace: 'nowrap',
                    },
                }}
            />

            {/* Phone */}
            <TextField
                noWrap
                source="phone"
                label="Phone"
                sx={{
                    '& .RaDatagrid-headerCell': {
                        width: '120px',
                        minWidth: '120px',
                        whiteSpace: 'nowrap',
                    },
                    '& .RaDatagrid-cell': {
                        whiteSpace: 'nowrap',
                    },
                }}
            />

   

            <FunctionField
                noWrap
                source="currentWebsiteUrl"
                label="Website"
                render={(record: Organization) => {
                    return <Link href={record.currentWebsiteUrl} to={`https://${record.currentWebsiteUrl}`} target="_blank">{record.currentWebsiteUrl}</Link>;
                }}
            />

            {/* Locations Count */}
            <FunctionField
                noWrap
                label="Locations"
                render={(record: Organization) => {
                    return record.organizationLocations.length > 0 ? record.organizationLocations.map((orgLocation) => {
                        return <Chip
                            key={orgLocation.id}
                            label={orgLocation.location.address}
                            size="small"
                            variant="outlined"
                            color="primary"
                            sx={{ mr: 1 }}
                            // on click, open the location in a new tab
                            onClick={() => {
                                // open in google maps
                                window.open(`https://www.google.com/maps/search/?api=1&query=${orgLocation.location.address}`, '_blank');
                            }}
                        />
                    }) : (
                        <Typography variant="body2" color="text.secondary">
                            No locations
                        </Typography>
                    );
                }}
            />

          
            {/* Revenue */}
            <NumberField
                noWrap
                source="revenue"
                label="Revenue"
                options={{
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                }}
            />

            {/* Marketing Budget */}
            <NumberField
                noWrap
                source="marketingBudget"
                label="Marketing Budget"
                options={{
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                }}
                             
            />

            {/* Allocations */}

            <NumberField
                source="budgetSeoAiSearch"
                label="SEO AI Search"
                noWrap
                options={{
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                }}
            />
            <NumberField
                source="budgetAiConversionTools"
                label="AI Conversion Tools"
                noWrap
                options={{
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                }}
            />
            <NumberField
                source="budgetLocalMarketing"
                label="Local Marketing"
                noWrap
                options={{
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                }}
            />
            <NumberField
                source="budgetPaidAdvertising"
                label="Paid Advertising"
                noWrap
                options={{
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                }}
            />
            <NumberField
                source="budgetLsa"
                label="LSA"
                noWrap
                options={{
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                }}
            />
            <NumberField
                source="budgetSocialMediaOrganic"
                label="Social Media Organic"
                noWrap
                options={{
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                }}
            />
            <NumberField
                source="budgetSocialMediaAds"
                label="Social Media Ads"
                noWrap
                options={{
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                }}
            />
            <NumberField
                source="budgetAggregatorDirectory"
                label="Aggregator Directory"
                noWrap
                options={{
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                }}
            />
            <NumberField
                source="budgetTraditionalOther"
                label="Traditional Other"
                noWrap
                options={{
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                }}
            />

            {/* Services */}
            <FunctionField
                label="Services"
                render={(record: Organization) => {
                    const services = [];
                    if (record?.primaryServices) services.push(record.primaryServices);
                    if (record?.secondaryServices) services.push(record.secondaryServices);
                    
                    return services.length > 0 ? (
                        <Box display="flex" alignItems="center" gap={0.5}>
                            <WorkIcon fontSize="small" color="action" />
                            <Typography variant="body2" sx={{ 
                                    maxWidth: '120px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                            }}>
                                {services.join(', ')}
                            </Typography>
                        </Box>
                    ) : (
                        <Typography variant="body2" color="text.secondary">
                            No services
                        </Typography>
                    );
                }}
                sx={{
                    '& .RaDatagrid-headerCell': {
                        width: '150px',
                        minWidth: '150px',
                        whiteSpace: 'nowrap',
                    },
                    '& .RaDatagrid-cell': {
                        whiteSpace: 'nowrap',
                    },
                }}
            />

            {/* Lead Source */}
            <TextField
                source="leadSource"
                label="Lead Source"
                sx={{
                    '& .RaDatagrid-headerCell': {
                        width: '120px',
                        minWidth: '120px',
                        whiteSpace: 'nowrap',
                    },
                    '& .RaDatagrid-cell': {
                        whiteSpace: 'nowrap',
                    },
                }}
            />

            {/* Ownership Type */}
            <ChipField
                source="ownershipType"
                label="Ownership"
                sx={{
                    '& .RaDatagrid-headerCell': {
                        width: '120px',
                        minWidth: '120px',
                        whiteSpace: 'nowrap',
                    },
                    '& .RaDatagrid-cell': {
                        whiteSpace: 'nowrap',
                    },
                }}
            />

            {/* Author Info */}
            <TextField
                source="authorNameAndTitle"
                label="Author"
                sx={{
                    '& .RaDatagrid-headerCell': {
                        width: '120px',
                        minWidth: '120px',
                        whiteSpace: 'nowrap',
                    },
                    '& .RaDatagrid-cell': {
                        whiteSpace: 'nowrap',
                    },
                }}
            />

            {/* Description */}
            <TextField
                source="description"
                label="Description"
                sx={{
                    '& .RaDatagrid-headerCell': {
                        width: '150px',
                        minWidth: '150px',
                        whiteSpace: 'nowrap',
                    },
                    '& .RaDatagrid-cell': {
                        whiteSpace: 'nowrap',
                    },
                }}
            />

            {/* Tagline */}
            <TextField
                source="tagline"
                label="Tagline"
                sx={{
                    '& .RaDatagrid-headerCell': {
                        width: '150px',
                        minWidth: '150px',
                        whiteSpace: 'nowrap',
                    },
                    '& .RaDatagrid-cell': {
                        whiteSpace: 'nowrap',
                    },
                }}
            />

            {/* SEO Features */}
            <BooleanField
                source="localSeoEnabled"
                label="Local SEO"
                sx={{
                    '& .RaDatagrid-headerCell': {
                        width: '100px',
                        minWidth: '100px',
                        whiteSpace: 'nowrap',
                    },
                    '& .RaDatagrid-cell': {
                        whiteSpace: 'nowrap',
                    },
                }}
            />

            {/* Content Publishing */}
            <BooleanField
                source="automatedBlogPosting"
                label="Auto Blog"
                sx={{
                    '& .RaDatagrid-headerCell': {
                        width: '100px',
                        minWidth: '100px',
                        whiteSpace: 'nowrap',
                    },
                    '& .RaDatagrid-cell': {
                        whiteSpace: 'nowrap',
                    },
                }}
            />

            {/* Backlink Building */}
            <BooleanField
                source="backlinkBuildingEnabled"
                label="Backlinks"
                sx={{
                    '& .RaDatagrid-headerCell': {
                        width: '100px',
                        minWidth: '100px',
                        whiteSpace: 'nowrap',
                    },
                    '& .RaDatagrid-cell': {
                        whiteSpace: 'nowrap',
                    },
                }}
            />

            {/* Google Business Profile */}
            <BooleanField
                source="accessGbp"
                label="GBP Access"
                sx={{
                    '& .RaDatagrid-headerCell': {
                        width: '100px',
                        minWidth: '100px',
                        whiteSpace: 'nowrap',
                    },
                    '& .RaDatagrid-cell': {
                        whiteSpace: 'nowrap',
                    },
                }}
            />

            {/* Created Date */}
            <DateField
                source="createdAt"
                label="Created"
                sx={{
                    '& .RaDatagrid-headerCell': {
                        width: '120px',
                        minWidth: '120px',
                        whiteSpace: 'nowrap',
                    },
                    '& .RaDatagrid-cell': {
                        whiteSpace: 'nowrap',
                    },
                }}
            />

            {/* Status Indicators */}
            <FunctionField
                label="Status"
                render={(record: Organization) => {
                    const indicators = getStatusIndicators(record);
                    return (
                        <Box display="flex" gap={0.5}>
                            {indicators.map((indicator, index) => (
                                <Tooltip key={index} title={indicator.tooltip}>
                                    <Box color={`${indicator.color}.main`}>
                                        {indicator.icon}
                                    </Box>
                                </Tooltip>
                            ))}
                        </Box>
                    );
                }}
                sx={{
                    '& .RaDatagrid-headerCell': {
                        width: '100px',
                        minWidth: '100px',
                        whiteSpace: 'nowrap',
                    },
                    '& .RaDatagrid-cell': {
                        whiteSpace: 'nowrap',
                    },
                }}
            />

            {/* Actions */}
            <FunctionField
                label="Actions"
                render={() => (
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 0.5,
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                        }}
                    >
                        <DatagridActionsField hasEdit={true} hasDelete={true}>
                            <OrganizationListActions
                                size="small"
                                showLabels={false}
                            />
                        </DatagridActionsField>
                    </Box>
                )}
                sx={{
                    '& .RaDatagrid-headerCell': {
                        width: '100px',
                        minWidth: '100px',
                        textAlign: 'right',
                    },
                    '& .RaDatagrid-cell': {
                        textAlign: 'right',
                    },
                }}
            />
        </DatagridConfigurable>
    );
};
