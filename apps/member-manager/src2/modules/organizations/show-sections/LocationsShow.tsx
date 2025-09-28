import { Organization } from '@ci-connect/types';
import HomeIcon from '@mui/icons-material/Home';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import {
    Box,
    Card,
    CardContent,
    Chip,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    Skeleton,
    Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useRecordContext } from 'react-admin';

// Map component using Google Maps API
const LocationMap: React.FC<{ locations: any[] }> = ({ locations }) => {
    const [mapLoaded, setMapLoaded] = useState(false);
    const mapRef = React.useRef<HTMLDivElement>(null);
    const [markers, setMarkers] = useState<google.maps.Marker[]>([]);

    const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    // Load Google Maps API
    useEffect(() => {
        // Check if Google Maps API is already loaded
        if (window.google && window.google.maps) {
            setMapLoaded(true);
            return;
        }

        // Load Google Maps API script
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => setMapLoaded(true);
        document.head.appendChild(script);

        return () => {
            // Cleanup
            document.head.removeChild(script);
        };
    }, [GOOGLE_MAPS_API_KEY]);

    // Initialize map when API is loaded and locations are available
    useEffect(() => {
        if (!mapLoaded || !mapRef.current || locations.length === 0) return;

        // Create map
        const googleMap = new window.google.maps.Map(mapRef.current, {
            zoom: locations.length > 1 ? 10 : 15,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
        });

        // Clear existing markers
        markers.forEach(marker => marker.setMap(null));
        setMarkers([]);

        // Create bounds object to fit all markers
        const bounds = new window.google.maps.LatLngBounds();

        // Create markers for each location
        const newMarkers = locations
            .map((location, index) => {
                if (
                    !location.location?.latitude ||
                    !location.location?.longitude
                )
                    return null;

                const position = {
                    lat: parseFloat(location.location.latitude),
                    lng: parseFloat(location.location.longitude),
                };

                // Add position to bounds
                bounds.extend(position);

                // Create marker
                const marker = new window.google.maps.Marker({
                    position,
                    map: googleMap,
                    title: location.location.name || `Location ${index + 1}`,
                    label: {
                        text: (index + 1).toString(),
                        color: 'white',
                    },
                });

                // Create info window
                const infoWindow = new window.google.maps.InfoWindow({
                    content: `
                    <div style="padding: 8px;">
                        <strong>${
                            location.location.name || 'Location'
                        }</strong><br/>
                        ${location.location.address || ''}<br/>
                        ${location.location.city?.name || ''}, ${
                        location.location.state?.code || ''
                    }
                    </div>
                `,
                });

                // Add click listener to show info window
                marker.addListener('click', () => {
                    infoWindow.open(googleMap, marker);
                });

                return marker;
            })
            .filter(Boolean) as google.maps.Marker[];

        setMarkers(newMarkers);

        // Fit map to bounds if there are multiple locations
        if (locations.length > 1 && !bounds.isEmpty()) {
            googleMap.fitBounds(bounds);
        } else if (locations.length === 1) {
            // Center on the single location
            const location = locations[0];
            if (location.location?.latitude && location.location?.longitude) {
                googleMap.setCenter({
                    lat: parseFloat(location.location.latitude),
                    lng: parseFloat(location.location.longitude),
                });
            }
        }
    }, [mapLoaded, locations, markers]);

    return (
        <Box
            ref={mapRef}
            sx={{
                height: 400,
                width: '100%',
                borderRadius: 1,
                overflow: 'hidden',
                border: '1px solid #e0e0e0',
            }}
        >
            {!mapLoaded && (
                <Skeleton variant="rectangular" width="100%" height="100%" />
            )}
        </Box>
    );
};

export const LocationsShow = () => {
    const record = useRecordContext<Organization>();

    if (!record) return null;

    const locations = record.organizationLocations || [];

    return (
        <Paper elevation={0} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <LocationOnIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h5">Business Locations</Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {locations.length === 0 ? (
                <Typography variant="body1" color="textSecondary">
                    No locations have been added for this organization.
                </Typography>
            ) : (
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <LocationMap locations={locations} />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <List disablePadding>
                            {locations.map((location, index) => (
                                <Card
                                    key={location.id || index}
                                    variant="outlined"
                                    sx={{ mb: 2 }}
                                >
                                    <CardContent>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                mb: 1,
                                            }}
                                        >
                                            <Chip
                                                icon={<HomeIcon />}
                                                label={`Location ${index + 1}`}
                                                size="small"
                                                color="primary"
                                                sx={{ mr: 1 }}
                                            />
                                        </Box>

                                        <List dense disablePadding>
                                            <ListItem
                                                disablePadding
                                                sx={{ pb: 1 }}
                                            >
                                                <ListItemIcon
                                                    sx={{ minWidth: 36 }}
                                                >
                                                    <LocationOnIcon
                                                        fontSize="small"
                                                        color="action"
                                                    />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={
                                                        location.location
                                                            ?.address
                                                    }
                                                    secondary={`${
                                                        location.location?.city
                                                            ?.name || ''
                                                    }, ${
                                                        location.location?.city
                                                            ?.state || ''
                                                    }`}
                                                />
                                            </ListItem>
                                        </List>
                                    </CardContent>
                                </Card>
                            ))}
                        </List>
                    </Grid>
                </Grid>
            )}
        </Paper>
    );
};

export default LocationsShow;
