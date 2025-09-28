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
    Chip,
    Box,
    TextField,
    Grid2,
    Divider,
    Alert,
} from '@mui/material';
import {
    Code as CodeIcon,
    Person as PersonIcon,
    Business as BusinessIcon,
    Event as EventIcon,
    Close as CloseIcon,
} from '@mui/icons-material';
import { useDataProvider } from 'react-admin';
import { useFormContext } from 'react-hook-form';

interface MergeTagPickerProps {
    open: boolean;
    onClose: () => void;
    onInsertTag: (tag: string) => void;
    recordId?: number;
}

interface FieldDefinition {
    path: string;
    label: string;
    type: 'string' | 'number' | 'date' | 'boolean' | 'object' | 'array';
    icon?: React.ReactNode;
}

// Dynamic field definitions loaded from the API
let FIELD_DEFINITIONS_CACHE: Record<string, FieldDefinition[]> = {};

// Helper function to fetch field definitions from API
const fetchResourceFields = async (
    resourceType: string
): Promise<FieldDefinition[]> => {
    if (FIELD_DEFINITIONS_CACHE[resourceType]) {
        return FIELD_DEFINITIONS_CACHE[resourceType];
    }

    try {
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/resource-types/${resourceType}/fields`
        );
        if (!response.ok) {
            throw new Error(`Failed to fetch fields for ${resourceType}`);
        }

        const data = await response.json();
        const fields: FieldDefinition[] = data.data.map((field: any) => ({
            path: field.path.replace('{record.', '').replace('}', ''),
            label: field.label,
            type: mapApiTypeToPickerType(field.type),
            icon: getIconForFieldType(field.type, field.name),
        }));

        FIELD_DEFINITIONS_CACHE[resourceType] = fields;
        return fields;
    } catch (error) {
        console.error(`Error fetching fields for ${resourceType}:`, error);
        return []; // Return empty array on error
    }
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
        number: 'number',
        date: 'date',
        boolean: 'boolean',
        json: 'object',
        relation: 'object',
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
            return <BusinessIcon />;
    }
};

const MergeTagPicker: React.FC<MergeTagPickerProps> = ({
    open,
    onClose,
    onInsertTag,
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRecord, setSelectedRecord] = useState<any>(null);
    const [previewData, setPreviewData] = useState<any>(null);
    const [resourceFields, setResourceFields] = useState<FieldDefinition[]>([]);
    const dataProvider = useDataProvider();
    const { watch } = useFormContext();
    const resourceType = watch('resource')

    // Load resource fields when resource type changes
    React.useEffect(() => {
        if (resourceType) {
            fetchResourceFields(resourceType)
                .then(fields => {
                    setResourceFields(fields);
                })
                .catch(error => {
                    console.error('Failed to load resource fields:', error);
                    setResourceFields([]);
                })
        }
    }, [resourceType]);

    // Filter fields based on search term
    const filteredFields = resourceFields.filter(
        field =>
            field.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
            field.path.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Load preview data when a record is selected
    useEffect(() => {
        if (selectedRecord?.id && resourceType) {
            dataProvider
                .getOne(resourceType, { id: selectedRecord.id })
                .then(({ data }) => setPreviewData(data))
                .catch(console.error);
        }
    }, [selectedRecord, resourceType, dataProvider]);

    const handleInsertTag = (fieldPath: string) => {
        const tag = `{record.${fieldPath}}`;
        onInsertTag(tag);
        onClose();
    };

    const getFieldValue = (fieldPath: string): string => {
        if (!previewData) return 'N/A';

        // Handle nested paths like 'point_of_contact.email'
        const parts = fieldPath.split('.');
        let value = previewData;

        for (const part of parts) {
            if (value && typeof value === 'object' && part in value) {
                value = value[part];
            } else {
                return 'N/A';
            }
        }

        return String(value || 'N/A');
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
                Insert Merge Tag
                <Typography variant="body2" color="text.secondary">
                    Select a field to insert into your template
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
                            <TextField
                                fullWidth
                                label="Search fields..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                sx={{ mb: 2 }}
                                size="small"
                            />

                            <Typography variant="h6" gutterBottom>
                                Available Fields
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
                                <List dense>
                                    {filteredFields.map(field => (
                                        <ListItem
                                            key={field.path}
                                            disablePadding
                                        >
                                            <ListItemButton
                                                onClick={() =>
                                                    handleInsertTag(field.path)
                                                }
                                            >
                                                <ListItemIcon
                                                    sx={{ minWidth: 32 }}
                                                >
                                                    {getFieldIcon(field)}
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={field.label}
                                                    secondary={
                                                        <Box
                                                            sx={{
                                                                display: 'flex',
                                                                alignItems:
                                                                    'center',
                                                                gap: 1,
                                                            }}
                                                        >
                                                            <Typography
                                                                variant="caption"
                                                                color="text.secondary"
                                                            >
                                                                {`{record.${field.path}}`}
                                                            </Typography>
                                                            <Chip
                                                                label={
                                                                    field.type
                                                                }
                                                                size="small"
                                                                variant="outlined"
                                                            />
                                                        </Box>
                                                    }
                                                />
                                            </ListItemButton>
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>
                        </Box>
                    </Grid2>

                    {/* Right Panel - Preview */}
                    <Grid2 size={{ xs: 12, md: 6 }} sx={{ height: '100%' }}>
                        <Box
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <Typography variant="h6" gutterBottom>
                                Preview with Record
                            </Typography>

                            <Box sx={{ mb: 2 }}>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Select a record to preview field values
                                </Typography>
                                <TextField
                                    fullWidth
                                    label="Record ID (for preview)"
                                    value={selectedRecord?.id || ''}
                                    onChange={e =>
                                        setSelectedRecord({
                                            id: e.target.value,
                                        })
                                    }
                                    size="small"
                                    placeholder="Enter record ID to preview values"
                                />
                            </Box>

                            {previewData ? (
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
                                    <Typography
                                        variant="subtitle2"
                                        gutterBottom
                                    >
                                        Field Values for Selected Record:
                                    </Typography>
                                    <List dense>
                                        {resourceFields.map(field => (
                                            <ListItem
                                                key={field.path}
                                                sx={{ py: 0.5 }}
                                            >
                                                <ListItemText
                                                    primary={
                                                        <Box
                                                            sx={{
                                                                display: 'flex',
                                                                justifyContent:
                                                                    'space-between',
                                                                alignItems:
                                                                    'center',
                                                            }}
                                                        >
                                                            <Typography
                                                                variant="body2"
                                                                fontWeight="medium"
                                                            >
                                                                {field.label}
                                                            </Typography>
                                                            <Typography
                                                                variant="body2"
                                                                color="text.secondary"
                                                                sx={{
                                                                    fontFamily:
                                                                        'monospace',
                                                                }}
                                                            >
                                                                {getFieldValue(
                                                                    field.path
                                                                )}
                                                            </Typography>
                                                        </Box>
                                                    }
                                                    secondary={
                                                        <Typography
                                                            variant="caption"
                                                            color="text.secondary"
                                                            sx={{
                                                                fontFamily:
                                                                    'monospace',
                                                            }}
                                                        >
                                                            {`{record.${field.path}}`}
                                                        </Typography>
                                                    }
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Box>
                            ) : (
                                <Alert severity="info">
                                    Select a record above to preview field
                                    values
                                </Alert>
                            )}
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
                    Tip: Click on any field to insert its merge tag
                </Typography>
                <Button onClick={onClose} startIcon={<CloseIcon />}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default MergeTagPicker;
