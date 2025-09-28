import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LanguageIcon from '@mui/icons-material/Language';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import PinterestIcon from '@mui/icons-material/Pinterest';
import PublicIcon from '@mui/icons-material/Public';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import {
    Box,
    Button,
    FormControl,
    Grid2,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { TextInput, useInput } from 'react-admin';
import { styles } from '../styles';

// Social media platforms with their icons
const platforms = [
    {
        id: 'facebook',
        name: 'Facebook',
        icon: <FacebookIcon />,
        color: '#1877F2',
    },
    {
        id: 'instagram',
        name: 'Instagram',
        icon: <InstagramIcon />,
        color: '#E4405F',
    },
    {
        id: 'linkedin',
        name: 'LinkedIn',
        icon: <LinkedInIcon />,
        color: '#0A66C2',
    },
    {
        id: 'twitter',
        name: 'Twitter (X)',
        icon: <TwitterIcon />,
        color: '#000000',
    },
    { id: 'tiktok', name: 'TikTok', icon: <LanguageIcon />, color: '#000000' },
    { id: 'youtube', name: 'YouTube', icon: <YouTubeIcon />, color: '#FF0000' },
    {
        id: 'pinterest',
        name: 'Pinterest',
        icon: <PinterestIcon />,
        color: '#E60023',
    },
    {
        id: 'nextdoor',
        name: 'NextDoor',
        icon: <LanguageIcon />,
        color: '#00D665',
    },
    { id: 'angi', name: 'Angi', icon: <LanguageIcon />, color: '#FF6B35' },
    { id: 'yelp', name: 'Yelp', icon: <LanguageIcon />, color: '#FF1A1A' },
    { id: 'bbb', name: 'BBB', icon: <LanguageIcon />, color: '#113B92' },
    { id: 'porch', name: 'Porch', icon: <LanguageIcon />, color: '#F68B1F' },
    {
        id: 'homeadvisor',
        name: 'Home Advisor',
        icon: <LanguageIcon />,
        color: '#FF6900',
    },
    {
        id: 'googlebusiness',
        name: 'Google Business',
        icon: <LanguageIcon />,
        color: '#4285F4',
    },
    {
        id: 'bingplaces',
        name: 'Bing Places',
        icon: <LanguageIcon />,
        color: '#00809D',
    },
    {
        id: 'facebookplaces',
        name: 'Facebook Places',
        icon: <FacebookIcon />,
        color: '#1877F2',
    },
];

const SocialPlatforms = () => {
    const [platformToAdd, setPlatformToAdd] = useState('');
    const [customUrl, setCustomUrl] = useState('');

    // Use useInput hook for form integration
    const { field: socialPresenceField } = useInput({
        source: 'social.socialMediaPresence',
    });

    // Get the current social presence object
    const socialPresence =
        typeof socialPresenceField.value === 'string'
            ? JSON.parse(socialPresenceField.value || '{}')
            : socialPresenceField.value || {};

    // Get platforms already added
    const addedPlatforms = Object.keys(socialPresence || {}).map(key => {
        const platform = platforms.find(p => p.id === key);
        return {
            id: key,
            name: platform?.name || key,
            url: socialPresence[key],
        };
    });

    // Function to handle adding a new social platform
    const handleAddPlatform = () => {
        if (platformToAdd && customUrl) {
            const platform = platforms.find(p => p.id === platformToAdd);
            if (platform) {
                // Update social presence object
                const updatedPresence = {
                    ...socialPresence,
                    [platform.id]: customUrl,
                };

                // Update the form
                socialPresenceField.onChange(updatedPresence);

                // Reset inputs
                setPlatformToAdd('');
                setCustomUrl('');
            }
        }
    };

    // Function to handle removing a platform
    const handleRemovePlatform = (platformId: string) => {
        // Update social presence object
        const updatedPresence = { ...socialPresence };
        delete updatedPresence[platformId];

        // Update the form
        socialPresenceField.onChange(updatedPresence);
    };

    // Get platform icon
    const getPlatformIcon = (platformId: string) => {
        const platform = platforms.find(p => p.id === platformId);
        return platform ? platform.icon : <LanguageIcon />;
    };

    // Get platform color
    const getPlatformColor = (platformId: string) => {
        const platform = platforms.find(p => p.id === platformId);
        return platform?.color || '#757575';
    };

    return (
        <Paper sx={styles.section}>
            <Box sx={styles.sectionTitle}>
                <PublicIcon sx={styles.icon} />
                <Typography variant="h6">Social Media Platforms</Typography>
            </Box>

            <Typography variant="body2" paragraph color="text.secondary">
                Enter the URLs for your company's social media profiles. These
                will help customers find and connect with you.
            </Typography>

            <Box sx={{ mt: 4, mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                    Add Social Platforms
                </Typography>

                <Grid2 container spacing={2} alignItems="center">
                    <Grid2 size={{ xs: 12, md: 4 }}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel id="platform-select-label">
                                Platform
                            </InputLabel>
                            <Select
                                labelId="platform-select-label"
                                value={platformToAdd}
                                onChange={e => setPlatformToAdd(e.target.value)}
                                label="Platform"
                            >
                                <MenuItem value="">
                                    <em>Select a platform</em>
                                </MenuItem>
                                {platforms
                                    .filter(p => !socialPresence[p.id]) // Filter out already added platforms
                                    .map(platform => (
                                        <MenuItem
                                            key={platform.id}
                                            value={platform.id}
                                        >
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                {React.cloneElement(
                                                    platform.icon as React.ReactElement,
                                                    {
                                                        style: {
                                                            marginRight: 8,
                                                            color: platform.color,
                                                        },
                                                    } as any
                                                )}
                                                {platform.name}
                                            </Box>
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                    </Grid2>

                    <Grid2 size={{ xs: 12, md: 6 }}>
                        <TextField
                            label="URL"
                            value={customUrl}
                            onChange={e => setCustomUrl(e.target.value)}
                            fullWidth
                            variant="outlined"
                            placeholder="https://"
                        />
                    </Grid2>

                    <Grid2 size={{ xs: 12, md: 2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={handleAddPlatform}
                            fullWidth
                            disabled={!platformToAdd || !customUrl}
                        >
                            Add
                        </Button>
                    </Grid2>
                </Grid2>
            </Box>

            {addedPlatforms.length > 0 && (
                <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                        Added Platforms
                    </Typography>

                    <Paper variant="outlined" sx={{ p: 2 }}>
                        {addedPlatforms.map((platform, index) => (
                            <Box key={index} sx={styles.platformInput}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        flexGrow: 1,
                                    }}
                                >
                                    {React.cloneElement(
                                        getPlatformIcon(
                                            platform.id
                                        ) as React.ReactElement,
                                        {
                                            style: {
                                                marginRight: 8,
                                                color: getPlatformColor(
                                                    platform.id
                                                ),
                                            },
                                        } as any
                                    )}
                                    <Typography variant="body2" sx={{ ml: 1 }}>
                                        <strong>{platform.name}:</strong>{' '}
                                        {platform.url}
                                    </Typography>
                                </Box>
                                <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() =>
                                        handleRemovePlatform(platform.id)
                                    }
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        ))}
                    </Paper>
                </Box>
            )}

            {/* Hidden input that gets updated with the full social media presence object */}
            <Box sx={{ display: 'none' }}>
                <TextInput source="social.socialMediaPresence" />
            </Box>
        </Paper>
    );
};

export default SocialPlatforms;
