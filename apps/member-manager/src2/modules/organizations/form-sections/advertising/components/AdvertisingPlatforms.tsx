import FacebookIcon from '@mui/icons-material/Facebook';
import GoogleIcon from '@mui/icons-material/Google';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import MovieIcon from '@mui/icons-material/Movie';
import PinterestIcon from '@mui/icons-material/Pinterest';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TwitterIcon from '@mui/icons-material/Twitter';
import MicrosoftIcon from '@mui/icons-material/Window';
import YouTubeIcon from '@mui/icons-material/YouTube';
import {
    Box,
    Card,
    CardContent,
    Grid2,
    Paper,
    Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useRecordContext } from 'react-admin';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { styles } from '../styles';

// Common ad platforms with icons
const adPlatforms = [
    {
        id: 'google_ads',
        name: 'Google Ads',
        description: 'Search, Display, and YouTube ads',
        icon: <GoogleIcon sx={{ color: '#4285F4' }} />,
    },
    {
        id: 'facebook_ads',
        name: 'Facebook Ads',
        description: 'Facebook and Instagram ads',
        icon: <FacebookIcon sx={{ color: '#1877F2' }} />,
    },
    {
        id: 'linkedin_ads',
        name: 'LinkedIn Ads',
        description: 'Professional audience targeting',
        icon: <LinkedInIcon sx={{ color: '#0A66C2' }} />,
    },
    {
        id: 'bing_ads',
        name: 'Bing Ads',
        description: 'Microsoft Search Network',
        icon: <MicrosoftIcon sx={{ color: '#00A4EF' }} />,
    },
    {
        id: 'twitter_ads',
        name: 'Twitter Ads',
        description: 'Promoted tweets and trends',
        icon: <TwitterIcon sx={{ color: '#1DA1F2' }} />,
    },
    {
        id: 'tiktok_ads',
        name: 'TikTok Ads',
        description: 'Short-form video ads',
        icon: <MovieIcon sx={{ color: '#000000' }} />,
    },
    {
        id: 'youtube_ads',
        name: 'YouTube Ads',
        description: 'Video advertising',
        icon: <YouTubeIcon sx={{ color: '#FF0000' }} />,
    },
    {
        id: 'pinterest_ads',
        name: 'Pinterest Ads',
        description: 'Visual discovery engine',
        icon: <PinterestIcon sx={{ color: '#E60023' }} />,
    },
];

const AdvertisingPlatforms = () => {
    const record = useRecordContext();
    const { control } = useFormContext();
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'paidAdvertising.adPlatforms',
    });

    // Initialize with existing values if present
    useEffect(() => {
        if (record?.paidAdvertising?.adPlatforms) {
            let platforms: string[] = [];
            if (Array.isArray(record.paidAdvertising.adPlatforms)) {
                // Convert from array of string values to platform IDs
                const platformNames = record.paidAdvertising.adPlatforms;
                adPlatforms.forEach(platform => {
                    if (platformNames.includes(platform.name)) {
                        platforms.push(platform.id);
                    }
                });
            }
            setSelectedPlatforms(platforms);

            // Clear existing values and set new ones
            if (fields.length > 0) {
                for (let i = fields.length - 1; i >= 0; i--) {
                    remove(i);
                }
            }

            // Convert platform IDs to names for the form
            const platformNames = platforms
                .map(id => {
                    const platform = adPlatforms.find(p => p.id === id);
                    return platform ? platform.name : '';
                })
                .filter(name => name !== '');

            // Add each platform name to the field array
            platformNames.forEach(name => {
                append(name);
            });
        }
    }, [append, fields.length, record?.paidAdvertising?.adPlatforms, remove]);

    // Handle platform selection
    const handlePlatformToggle = (platformId: string) => {
        setSelectedPlatforms(prev => {
            const newPlatforms = prev.includes(platformId)
                ? prev.filter(id => id !== platformId)
                : [...prev, platformId];

            // Convert to platform names
            const platformNames = newPlatforms
                .map(id => {
                    const platform = adPlatforms.find(p => p.id === id);
                    return platform ? platform.name : '';
                })
                .filter(name => name !== '');

            // Update form field array
            if (fields.length > 0) {
                for (let i = fields.length - 1; i >= 0; i--) {
                    remove(i);
                }
            }

            platformNames.forEach(name => {
                append(name);
            });

            return newPlatforms;
        });
    };

    return (
        <Paper sx={styles.section}>
            <Box sx={styles.sectionTitle}>
                <TrendingUpIcon sx={styles.icon} />
                <Typography variant="h6">Advertising Platforms</Typography>
            </Box>

            <Typography variant="body2" paragraph color="text.secondary">
                Select the advertising platforms you're using or planning to
                use. Different platforms reach different audiences.
            </Typography>

            <Grid2 container spacing={2}>
                {adPlatforms.map(platform => (
                    <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={platform.id}>
                        <Card
                            sx={{
                                ...styles.platformCard,
                                ...(selectedPlatforms.includes(platform.id)
                                    ? styles.cardSelected
                                    : {}),
                            }}
                            variant="outlined"
                            onClick={() => handlePlatformToggle(platform.id)}
                        >
                            <CardContent>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        mb: 1,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            mr: 1.5,
                                            display: 'flex',
                                            alignItems: 'center',
                                        }}
                                    >
                                        {platform.icon}
                                    </Box>
                                    <Typography
                                        variant="subtitle1"
                                        sx={{ flexGrow: 1 }}
                                    >
                                        {platform.name}
                                    </Typography>
                                </Box>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    {platform.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid2>
                ))}
            </Grid2>

            {/* Field array is managed in the component state, no need for visible inputs */}
            <Box sx={{ display: 'none' }}>
                {fields.map((field, index) => (
                    <div key={field.id}>{`Platform ${
                        index + 1
                    }: ${field}`}</div>
                ))}
            </Box>
        </Paper>
    );
};

export default React.memo(AdvertisingPlatforms);
