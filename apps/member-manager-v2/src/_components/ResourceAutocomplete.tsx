import React, { useState, useEffect } from 'react';
import {
    Autocomplete,
    CircularProgress,
    Box,
    Typography,
} from '@mui/material';
import { useInput, required, TextInput } from 'react-admin';

interface ResourceType {
    id: number;
    name: string;
    label: string;
    tableName: string;
}

interface ResourceAutocompleteProps {
    source?: string;
    label?: string;
    helperText?: string;
    required?: boolean;
    validate?: any[];
    fullWidth?: boolean;
    disabled?: boolean;
    onResourceChange?: (resource: ResourceType | null) => void;
}

const ResourceAutocomplete: React.FC<ResourceAutocompleteProps> = ({
    source = 'resource',
    label = 'Resource Type',
    helperText,
    required: isRequired = true,
    validate,
    fullWidth = true,
    disabled = false,
    onResourceChange,
}) => {
    const [resourceTypes, setResourceTypes] = useState<ResourceType[]>([]);
    const [loading, setLoading] = useState(true);
    const [inputValue, setInputValue] = useState('');

    const { field, fieldState } = useInput({
        source,
        validate: validate || (isRequired ? [required('Resource type selection is required')] : undefined)
    });

    // Fetch resource types on component mount
    useEffect(() => {
        const fetchResourceTypes = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${import.meta.env.VITE_API_URL}/resource-types`);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const result = await response.json();
                
                if (result.data && Array.isArray(result.data)) {
                    setResourceTypes(result.data);
                }
            } catch (error) {
                console.error('Error fetching resource types:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchResourceTypes();
    }, []);

    // Find the current selected resource type object
    // For edit mode, we might be getting the label in the name field, so check both name and label
    const currentValue = field.value;
    
    const selectedResource = resourceTypes.find(resource => 
        resource.name === currentValue || resource.label === currentValue
    ) || null;

    const handleResourceChange = (event: any, newValue: ResourceType | null) => {
        // If source is "name", we're updating the topic name with the resource label
        // Otherwise, we're updating the resourceType field with the resource name
        if (source === 'name') {
            field.onChange(newValue ? newValue.label : '');
        } else {
            field.onChange(newValue ? newValue.name : '');
        }
        
        if (onResourceChange) {
            onResourceChange(newValue);
        }
    };

    return (
        <Autocomplete
            value={selectedResource}
            onChange={handleResourceChange}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
            }}
            options={resourceTypes}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, value) => option.name === value.name}
            loading={loading}
            disabled={disabled}
            filterOptions={(options, { inputValue }) => {
                const filtered = options.filter(option =>
                    option.label.toLowerCase().includes(inputValue.toLowerCase()) ||
                    option.name.toLowerCase().includes(inputValue.toLowerCase())
                );
                return filtered;
            }}
            renderInput={(params) => (
                <TextInput
                    source={source}
                    {...params}
                    label={label}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message || helperText || `Search through ${resourceTypes.length} available models`}
                    required={isRequired}
                    fullWidth={fullWidth}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                />
            )}
            renderOption={(props, option) => (
                <li {...props} key={option.name}>
                    <Box>
                        <Typography variant="body1">{option.label}</Typography>
                        <Typography variant="caption" color="text.secondary">
                            {option.name} • {option.tableName}
                        </Typography>
                    </Box>
                </li>
            )}
            noOptionsText={loading ? "Loading..." : "No models found"}
            fullWidth={fullWidth}
        />
    );
};

export default ResourceAutocomplete;
