import React from 'react';
import { Box, Typography, Grid2, useTheme, useMediaQuery } from '@mui/material';
import { TextInput, BooleanInput, required } from 'react-admin';
import ResourceAutocomplete from '../../../../_components/ResourceAutocomplete';
import { useFormContext } from 'react-hook-form';


const TopicFormFields = () => {
    const { watch, setValue } = useFormContext();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const isResource = watch('isResource') || watch('onCreate') || watch('onUpdate') || watch('onDelete');

    // Handle resource selection
    const handleResourceSelection = (resource: any) => {
        if (resource) {
            // Auto-populate the topic name with the resource label if no name is set
            setValue('name', resource.label);
        }
    };

    return (
        <Box width="100%">
            <Grid2 container spacing={2}>
                <Grid2 size={{ xs: 12 }}>
                    {isResource ? (
                        <ResourceAutocomplete
                            source="name"
                            label="Resource Type"
                            helperText="Resource topics can trigger events when data is created, updated, or deleted"
                            required={isResource}
                            onResourceChange={handleResourceSelection}
                        />
                    ) : (
                        <TextInput
                            source="name"
                            label="Topic Name"
                            fullWidth
                            validate={[required('Topic name is required')]}
                        />
                    )}
                </Grid2>

             

                <Grid2 size={{ xs: 12 }}>
                    <BooleanInput
                        source="isResource"
                        label="Is this a resource?"
                        defaultValue={false}
                    />
                </Grid2>

        

                {isResource && (
                    <Grid2 size={{ xs: 12 }}>
                        <Typography
                            variant="subtitle2"
                            fontWeight={600}
                            gutterBottom
                        >
                            Event Triggers
                        </Typography>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ mb: 2, display: 'block' }}
                        >
                            Select when this topic should be triggered
                        </Typography>

                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: isMobile ? 'column' : 'row',
                                gap: isMobile ? 2 : 1,
                                width: '100%',
                            }}
                        >
                            <Box sx={{ 
                                flex: isMobile ? 'none' : 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: isMobile ? 'space-between' : 'center',
                                minHeight: 48,
                                px: isMobile ? 2 : 1,
                                py: isMobile ? 1 : 0,
                            }}>
                                <BooleanInput
                                    source="onCreate"
                                    label="On Create"
                                    defaultValue={false}
                                />
                            </Box>
                            
                            <Box sx={{ 
                                flex: isMobile ? 'none' : 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: isMobile ? 'space-between' : 'center',
                                minHeight: 48,
                                px: isMobile ? 2 : 1,
                                py: isMobile ? 1 : 0,
                            }}>
                                <BooleanInput
                                    source="onUpdate"
                                    label="On Update"
                                    defaultValue={false}
                                />
                            </Box>
                            
                            <Box sx={{ 
                                flex: isMobile ? 'none' : 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: isMobile ? 'space-between' : 'center',
                                minHeight: 48,
                                px: isMobile ? 2 : 1,
                                py: isMobile ? 1 : 0,
                            }}>
                                <BooleanInput
                                    source="onDelete"
                                    label="On Delete"
                                    defaultValue={false}
                                />
                            </Box>
                        </Box>
                    </Grid2>
                )}
            </Grid2>
        </Box>
    );
};

export default TopicFormFields;
