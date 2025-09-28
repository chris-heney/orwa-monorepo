import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    ListItemIcon,
    Box,
    TextField,
    Chip,
    Grid2,
    Divider,
} from '@mui/material';
import {
    Code as CodeIcon,
    Person as PersonIcon,
    Business as BusinessIcon,
    Event as EventIcon,
    SmartToy as AIIcon,
    Search as SearchIcon,
} from '@mui/icons-material';
import { useDataProvider } from 'react-admin';

interface AIFieldPickerProps {
    open: boolean;
    onClose: () => void;
    selectedFields: string[];
    onFieldsChange: (fields: string[]) => void;
}

interface FieldDefinition {
    path: string;
    label: string;
    type: 'string' | 'number' | 'date' | 'boolean' | 'object' | 'array';
    icon?: React.ReactNode;
}

// Cache for organization fields
let ORGANIZATION_FIELDS_CACHE: FieldDefinition[] = [];

// Helper function to fetch organization fields from API
const fetchOrganizationFields = async (dataProvider: any): Promise<FieldDefinition[]> => {
    if (ORGANIZATION_FIELDS_CACHE.length > 0) {
        return ORGANIZATION_FIELDS_CACHE;
    }

    try {
        // Fetch base organization fields
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/resource-types/organization/fields`
        );

        const data = await response.json();

        const fields: FieldDefinition[] = data.data.map((field: any) => ({
            path: field.path.replace('{record.', '').replace('}', ''),
            label: field.label,
            type: mapApiTypeToPickerType(field.type),
            icon: getIconForFieldType(field.type, field.name),
        }));

        // Add nested fields for important relations like cortex
        const nestedFields = await fetchNestedFields();
        
        // Combine fields
        const allFields = [...fields, ...nestedFields];

        ORGANIZATION_FIELDS_CACHE = allFields;
        return allFields;
    } catch (error) {
        console.error('Error fetching organization fields:', error);
        return [];
    }
};

// Helper function to fetch nested fields from important relations
const fetchNestedFields = async (): Promise<FieldDefinition[]> => {
    const nestedFields: FieldDefinition[] = [];
    
    try {
        // Add OrganizationCortex fields
        const cortexFields = [
            // Company Strategy & Positioning fields
            { name: 'companyStrategy', label: 'Company Strategy', type: 'string' },
            { name: 'customerAvatar', label: 'Customer Avatar', type: 'string' },
            { name: 'descriptionShort', label: 'Short Description', type: 'string' },
            { name: 'brandColor', label: 'Brand Color', type: 'string' },
            
            // SEO Configuration
            { name: 'seoObjective', label: 'SEO Objective', type: 'string' },
            { name: 'publishContentMode', label: 'Publish Content Mode', type: 'string' },
            { name: 'localSeoEnabled', label: 'Local SEO Enabled', type: 'boolean' },
            { name: 'localSeoLocations', label: 'Local SEO Locations', type: 'array' },
            
            // Content Review & Approval
            { name: 'customerArticleReviewMode', label: 'Article Review Mode', type: 'string' },
            
            // Author Configuration
            { name: 'authorNameAndTitle', label: 'Author Name & Title', type: 'string' },
            { name: 'authorPointOfView', label: 'Author Point of View', type: 'string' },
            { name: 'mentionAuthorInArticles', label: 'Mention Author in Articles', type: 'boolean' },
            { name: 'authorOverride', label: 'Author Override', type: 'string' },
            
            // Link Management
            { name: 'internalLinkTargets', label: 'Internal Link Targets', type: 'array' },
            { name: 'enableExternalLinks', label: 'Enable External Links', type: 'boolean' },
            
            // CTA & Pricing
            { name: 'ctaQuantity', label: 'CTA Quantity', type: 'string' },
            { name: 'mentionPricing', label: 'Mention Pricing', type: 'string' },
            
            // Image Configuration
            { name: 'imageCustomUploaded', label: 'Custom Uploaded Images', type: 'number' },
            { name: 'imageCustomInfographics', label: 'Custom Infographics', type: 'boolean' },
            { name: 'imageStockEnabled', label: 'Stock Images Enabled', type: 'boolean' },
            { name: 'aiImagesEnabled', label: 'AI Images Enabled', type: 'boolean' },
            { name: 'imageQuantity', label: 'Image Quantity', type: 'string' },
            { name: 'imageLogoInclusion', label: 'Logo Inclusion', type: 'string' },
            { name: 'infographicsAccuracySetting', label: 'Infographics Accuracy', type: 'string' },
            { name: 'customImageInstructions', label: 'Custom Image Instructions', type: 'string' },
            
            // Article Configuration
            { name: 'articleLengthMode', label: 'Article Length Mode', type: 'string' },
            { name: 'automatedBlogPosting', label: 'Automated Blog Posting', type: 'boolean' },
            
            // Backlink & PR Configuration
            { name: 'backlinkAuthorName', label: 'Backlink Author Name', type: 'string' },
            { name: 'backlinkAuthorLinkedin', label: 'Backlink Author LinkedIn', type: 'string' },
            { name: 'backlinkAuthorHeadshot', label: 'Backlink Author Headshot', type: 'string' },
            { name: 'backlinkBio', label: 'Backlink Bio', type: 'string' },
            { name: 'prOutreachTopics', label: 'PR Outreach Topics', type: 'array' },
            { name: 'findMoreTopicsAi', label: 'Find More Topics with AI', type: 'boolean' },
            { name: 'backlinkBuildingType', label: 'Backlink Building Type', type: 'string' },
            { name: 'backlinkBuildingEnabled', label: 'Backlink Building Enabled', type: 'boolean' },
            
            // Google Business Profile & Local Posting
            { name: 'accessGbp', label: 'Access GBP', type: 'boolean' },
            { name: 'publishNewPosts', label: 'Publish New Posts', type: 'boolean' },
            { name: 'postFrequency', label: 'Post Frequency', type: 'string' },
            { name: 'imageSource', label: 'Image Source', type: 'string' },
            { name: 'brandImages', label: 'Brand Images', type: 'boolean' },
            { name: 'callToActions', label: 'Call to Actions', type: 'array' },
            { name: 'approvals', label: 'Approvals', type: 'string' },
            { name: 'minimumRating', label: 'Minimum Rating', type: 'number' },
            { name: 'publishReviews', label: 'Publish Reviews', type: 'boolean' },
            { name: 'facebookEnabled', label: 'Facebook Enabled', type: 'boolean' },
            { name: 'facebookPageUrl', label: 'Facebook Page URL', type: 'string' },
            { name: 'instagramEnabled', label: 'Instagram Enabled', type: 'boolean' },
            { name: 'instagramPageUrl', label: 'Instagram Page URL', type: 'string' },
            
            // Review Management
            { name: 'reviewResponseAutomated', label: 'Review Response Automated', type: 'boolean' },
            { name: 'reviewResponseAutomaticMinRating', label: 'Automatic Min Rating', type: 'number' },
            { name: 'reviewResponseAutomaticApproval', label: 'Automatic Approval', type: 'boolean' },
        ];
        
        // Map cortex fields to FieldDefinition format with proper path
        cortexFields.forEach(field => {
            nestedFields.push({
                path: `cortex.${field.name}`,
                label: `Cortex: ${field.label}`,
                type: mapApiTypeToPickerType(field.type),
                icon: getIconForFieldType(field.type, field.name),
            });
        });
        
        // Add other important relations here if needed
        
    } catch (error) {
        console.error('Error fetching nested fields:', error);
    }
    
    return nestedFields;
};

// Map API field types to picker types
const mapApiTypeToPickerType = (
    apiType: string
): 'string' | 'number' | 'date' | 'boolean' | 'object' | 'array' => {
    const typeMap: Record<
        string,
        'string' | 'number' | 'date' | 'boolean' | 'object' | 'array'
    > = {
        text: 'string',
        string: 'string',
        number: 'number',
        date: 'date',
        boolean: 'boolean',
        json: 'object',
        relation: 'object',
        array: 'array',
    };
    return typeMap[apiType] || 'string';
};

// Get appropriate icon for field type
const getIconForFieldType = (fieldType: string, fieldName: string) => {
    // Specific field name patterns
    if (fieldName.toLowerCase().includes('email')) return <PersonIcon />;
    if (fieldName.toLowerCase().includes('phone')) return <PersonIcon />;
    if (fieldName.toLowerCase().includes('name')) return <PersonIcon />;
    if (
        fieldName.toLowerCase().includes('date') ||
        fieldName.toLowerCase().includes('time')
    )
        return <EventIcon />;
    if (
        fieldName.toLowerCase().includes('organization') ||
        fieldName.toLowerCase().includes('company')
    )
        return <BusinessIcon />;

    // Field type patterns
    switch (fieldType) {
        case 'date':
            return <EventIcon />;
        case 'relation':
            return <BusinessIcon />;
        case 'number':
            return <BusinessIcon />;
        case 'boolean':
            return <BusinessIcon />;
        default:
            return <CodeIcon />;
    }
};

const AIFieldPicker: React.FC<AIFieldPickerProps> = ({
    open,
    onClose,
    selectedFields,
    onFieldsChange,
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [availableFields, setAvailableFields] = useState<FieldDefinition[]>([]);
    const [loading, setLoading] = useState(false);
    const dataProvider = useDataProvider();

    // Load organization fields when component mounts
    useEffect(() => {
        if (open) {
            setLoading(true);
            fetchOrganizationFields(dataProvider)
                .then(fields => {
                    setAvailableFields(fields);
                })
                .catch(error => {
                    console.error('Failed to load organization fields:', error);
                    setAvailableFields([]);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [open, dataProvider]);

    // Filter fields based on search term
    const filteredFields = availableFields.filter(
        field => {
            const searchLower = searchTerm.toLowerCase();
            return field.label.toLowerCase().includes(searchLower) ||
                field.path.toLowerCase().includes(searchLower) ||
                // Special handling for nested fields
                (field.path.includes('.') && field.path.split('.')[0].toLowerCase().includes(searchLower));
        }
    );
    
    // Group fields by category for better organization
    const groupedFields = filteredFields.reduce((groups: Record<string, FieldDefinition[]>, field) => {
        const category = field.path.includes('.') ? field.path.split('.')[0] : 'base';
        if (!groups[category]) {
            groups[category] = [];
        }
        groups[category].push(field);
        return groups;
    }, {});

    const handleToggleField = (fieldPath: string) => {
        if (selectedFields.includes(fieldPath)) {
            onFieldsChange(selectedFields.filter(f => f !== fieldPath));
        } else {
            onFieldsChange([...selectedFields, fieldPath]);
        }
    };

    const handleRemoveField = (fieldPath: string) => {
        onFieldsChange(selectedFields.filter(f => f !== fieldPath));
    };

    const getFieldIcon = (field: FieldDefinition) => {
        return field.icon || <CodeIcon />;
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    height: '80vh',
                    display: 'flex',
                    flexDirection: 'column',
                },
            }}
        >
            <DialogTitle>
                <Box display="flex" alignItems="center">
                    <AIIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6">Select Fields for AI Generation</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                    Choose which organization fields should be AI-generated for this deck
                </Typography>
            </DialogTitle>

            <DialogContent sx={{ flexGrow: 1, overflow: 'hidden' }}>
                <Grid2 container spacing={2} sx={{ height: '100%' }}>
                    {/* Left Panel - Field Selection */}
                    <Grid2 size={{ xs: 12, md: 6 }} sx={{ height: '100%' }}>
                        <Box
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <SearchIcon sx={{ color: 'action.active', mr: 1 }} />
                                <TextField
                                    fullWidth
                                    placeholder="Search fields..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    size="small"
                                    variant="outlined"
                                />
                            </Box>

                            <Typography variant="subtitle1" gutterBottom>
                                Available Organization Fields
                            </Typography>

                            <Box
                                sx={{
                                    flexGrow: 1,
                                    overflow: 'auto',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderRadius: 1,
                                }}
                            >
                                {loading ? (
                                    <Box sx={{ p: 2 }}>
                                        <Typography>Loading fields...</Typography>
                                    </Box>
                                ) : (
                                    <>
                                        {filteredFields.length === 0 ? (
                                            <Box sx={{ p: 2 }}>
                                                <Typography color="text.secondary">
                                                    No matching fields found
                                                </Typography>
                                            </Box>
                                        ) : (
                                            Object.entries(groupedFields).map(([category, fields]) => (
                                                <Box key={category} sx={{ mb: 2 }}>
                                                    {/* Category header */}
                                                    {category !== 'base' && (
                                                        <Box 
                                                            sx={{ 
                                                                px: 2, 
                                                                py: 1, 
                                                                bgcolor: 'primary.main',
                                                                color: 'primary.contrastText',
                                                                borderTopLeftRadius: 1,
                                                                borderTopRightRadius: 1,
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'space-between'
                                                            }}
                                                        >
                                                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                                                {category.charAt(0).toUpperCase() + category.slice(1)} Fields
                                                            </Typography>
                                                            <Chip 
                                                                label={`${fields.length} fields`} 
                                                                size="small" 
                                                                sx={{ 
                                                                    bgcolor: 'rgba(255,255,255,0.2)',
                                                                    color: 'primary.contrastText'
                                                                }} 
                                                            />
                                                        </Box>
                                                    )}
                                                    
                                                    {/* Fields list */}
                                                    <List dense>
                                                        {fields.map(field => (
                                                            <ListItem
                                                                key={field.path}
                                                                disablePadding
                                                            >
                                                                <ListItemButton
                                                                    onClick={() => handleToggleField(field.path)}
                                                                    selected={selectedFields.includes(field.path)}
                                                                >
                                                                    <ListItemIcon
                                                                        sx={{ minWidth: 36 }}
                                                                    >
                                                                        {getFieldIcon(field)}
                                                                    </ListItemIcon>
                                                                    <ListItemText
                                                                        primary={field.label}
                                                                        secondary={
                                                                            <Box
                                                                                sx={{
                                                                                    display: 'flex',
                                                                                    alignItems: 'center',
                                                                                    gap: 1,
                                                                                }}
                                                                            >
                                                                                <Typography
                                                                                    variant="caption"
                                                                                    color="text.secondary"
                                                                                >
                                                                                    {field.path}
                                                                                </Typography>
                                                                                <Chip
                                                                                    label={field.type}
                                                                                    size="small"
                                                                                    variant="outlined"
                                                                                />
                                                                            </Box>
                                                                        }
                                                                    />
                                                                    {selectedFields.includes(field.path) && (
                                                                        <Chip 
                                                                            label="Selected" 
                                                                            size="small" 
                                                                            color="primary" 
                                                                            variant="outlined"
                                                                            sx={{ ml: 1 }}
                                                                        />
                                                                    )}
                                                                </ListItemButton>
                                                            </ListItem>
                                                        ))}
                                                    </List>
                                                </Box>
                                            ))
                                        )}
                                    </>
                                )}
                            </Box>
                        </Box>
                    </Grid2>

                    {/* Right Panel - Selected Fields */}
                    <Grid2 size={{ xs: 12, md: 6 }} sx={{ height: '100%' }}>
                        <Box
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <Typography variant="subtitle1" gutterBottom>
                                Selected Fields for AI Generation ({selectedFields.length})
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                These fields will be automatically generated using AI when creating organizations with this deck
                            </Typography>

                            <Box
                                sx={{
                                    flexGrow: 1,
                                    overflow: 'auto',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderRadius: 1,
                                    p: 2,
                                }}
                            >
                                {selectedFields.length === 0 ? (
                                    <Box sx={{ 
                                        height: '100%', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center',
                                        flexDirection: 'column',
                                        gap: 2,
                                        color: 'text.secondary'
                                    }}>
                                        <AIIcon sx={{ fontSize: 40 }} />
                                        <Typography>
                                            No fields selected for AI generation
                                        </Typography>
                                        <Typography variant="body2">
                                            Select fields from the list on the left
                                        </Typography>
                                    </Box>
                                ) : (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {selectedFields.map(fieldPath => {
                                            const field = availableFields.find(f => f.path === fieldPath);
                                            return (
                                                <Chip
                                                    key={fieldPath}
                                                    label={field?.label || fieldPath}
                                                    onDelete={() => handleRemoveField(fieldPath)}
                                                    color="primary"
                                                    icon={field?.icon ? React.cloneElement(field.icon as React.ReactElement, { 
                                                        style: { fontSize: '1rem' } 
                                                    } as any) : undefined}
                                                />
                                            );
                                        })}
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    </Grid2>
                </Grid2>
            </DialogContent>

            <Divider />

            <DialogActions sx={{ p: 2 }}>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ flexGrow: 1 }}
                >
                    {selectedFields.length} field(s) selected for AI generation
                </Typography>
                <Button onClick={onClose} variant="contained" color="primary">
                    Done
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AIFieldPicker;
