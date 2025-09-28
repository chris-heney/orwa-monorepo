/// <reference types="@types/google.maps" />
import { AutocompleteInput, useRecordContext } from 'react-admin';
import { alpha, Box } from '@mui/material';
import { useState, useEffect, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { GooglePlace } from '../types'

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

interface AutofillAddressInputProps {
    source: string;
    onPlaceSelected?: (place: google.maps.places.PlaceResult) => void;
}

export const AutofillAddressInput = ({ source, onPlaceSelected }: AutofillAddressInputProps) => {
    const { setValue } = useFormContext();
    const record = useRecordContext();
    const [selectedAddress, setSelectedAddress] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [autocompleteService, setAutocompleteService] = useState<any>(null);
    const [placesService, setPlacesService] = useState<any>(null);
    const [suggestions, setSuggestions] = useState<GooglePlace[]>([]);
    const [googleScriptLoaded, setGoogleScriptLoaded] = useState(false);

    // Initialize with record value if it exists
    useEffect(() => {
        if (record && record[source]) {
            setSelectedAddress(record[source]);
            setValue(source, record[source]);
        }
    }, [record, source, setValue]);

    // Initialize map services
    const initializeMapsServices = useCallback(() => {
        if (window.google && window.google.maps) {
            try {
                const autocompleteService =
                    new window.google.maps.places.AutocompleteService();
                const placesService =
                    new window.google.maps.places.PlacesService(
                        document.createElement('div')
                    );

                setAutocompleteService(autocompleteService);
                setPlacesService(placesService);
                setError(null);
            } catch (error) {
                console.error(
                    'Error initializing Google Maps services:',
                    error
                );
                setError(`Error initializing Google Maps: ${error}`);
            }
        } else {
            setError('Google Maps not available');
        }
    }, []);

    // Function to load Google Maps script
    const loadGoogleMapsScript = useCallback(() => {
        if (window.google && window.google.maps && window.google.maps.places) {
            initializeMapsServices();
            setGoogleScriptLoaded(true);
            return;
        }

        const existingScript = document.querySelector(
            'script[src*="maps.googleapis.com/maps/api"]'
        );
        if (existingScript) {
            const checkGoogleExists = setInterval(() => {
                if (
                    window.google &&
                    window.google.maps &&
                    window.google.maps.places
                ) {
                    clearInterval(checkGoogleExists);
                    initializeMapsServices();
                    setGoogleScriptLoaded(true);
                }
            }, 100);
            return;
        }

        window.initGoogleMapsAutocomplete = () => {
            initializeMapsServices();
            setGoogleScriptLoaded(true);
        };

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initGoogleMapsAutocomplete`;
        script.async = true;
        script.defer = true;
        script.onerror = () => setError('Failed to load Google Maps API');
        document.head.appendChild(script);
    }, [initializeMapsServices]);

    useEffect(() => {
        loadGoogleMapsScript();
        return () => {
            if (window.initGoogleMapsAutocomplete) {
                delete window.initGoogleMapsAutocomplete;
            }
        };
    }, [loadGoogleMapsScript]);

    const handleGetPredictions = (input: string) => {
        if (!input || !autocompleteService || input.length < 3) {
            setSuggestions([]);
            return;
        }

        autocompleteService.getPlacePredictions(
            {
                input,
                types: ['address'],
            },
            (predictions: GooglePlace[] | null, status: any) => {
                if (
                    status !== window.google?.maps.places.PlacesServiceStatus.OK
                ) {
                    setSuggestions([]);
                    setError(`Error getting predictions: ${status}`);
                    return;
                }

                setSuggestions(predictions || []);
                setError(null);
            }
        );
    };

    const handleAddressSelect = (value: GooglePlace | null) => {
        if (!value || !placesService) return;

        placesService.getDetails(
            {
                placeId: value.place_id,
                fields: ['address_components', 'formatted_address', 'geometry'],
            },
            (place: google.maps.places.PlaceResult, status: any) => {
                if (
                    status !== window.google?.maps.places.PlacesServiceStatus.OK
                ) {
                    setError(`Error getting place details: ${status}`);
                    return;
                }

                setSelectedAddress(place.formatted_address || '');
                setValue(source, place.formatted_address || '');
                setError(null);

                // Call the onPlaceSelected callback if provided
                if (onPlaceSelected) {
                    onPlaceSelected(place);
                }
            }
        );
    };

    return (
        <Box>
            <AutocompleteInput
                source={source}
                choices={suggestions}
                filterToQuery={searchText => ({ q: searchText })}
                onInputChange={(_, value) => handleGetPredictions(value)}
                onChange={value => {
                    const selected = suggestions.find(
                        s => s.place_id === value
                    );
                    handleAddressSelect(selected || null);
                }}
                optionText="description"
                optionValue="place_id"
                disabled={!googleScriptLoaded}
                isLoading={!googleScriptLoaded}
                helperText={
                    error ||
                    (!googleScriptLoaded
                        ? 'Loading Google Maps API...'
                        : 'Type at least 3 characters to search')
                }
                fullWidth
                defaultValue={selectedAddress}
                inputValue={selectedAddress}
            />

            {selectedAddress && (
                <Box
                    sx={{
                        mt: 1,
                        p: 1.5,
                        borderRadius: 1,
                        backgroundColor: alpha('#2196f3', 0.05),
                        border: `1px solid ${alpha('#2196f3', 0.2)}`,
                        color: 'text.secondary',
                        fontSize: '0.875rem',
                    }}
                >
                    {selectedAddress}
                </Box>
            )}
        </Box>
    );
};
