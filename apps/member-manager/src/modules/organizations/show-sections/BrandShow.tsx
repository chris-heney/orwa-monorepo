import { Organization, OrganizationBrand } from '@ci-connect/types';
import BrushIcon from '@mui/icons-material/Brush';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import ImageIcon from '@mui/icons-material/Image';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import StyleIcon from '@mui/icons-material/Style';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import {
    Box,
    Card,
    CardContent,
    Chip,
    Divider,
    Grid2,
    List,
    ListItem,
    ListItemText,
    Paper,
    Typography,
} from '@mui/material';
import { useRecordContext } from 'react-admin';

// Color display component
const ColorBox = ({ color }: { color: string }) => (
    <Box
        sx={{
            width: 36,
            height: 36,
            bgcolor: color,
            borderRadius: 1,
            border: '1px solid rgba(0,0,0,0.12)',
        }}
    />
);

// Field component for brand attributes
const BrandField = ({
    label,
    value,
    isBoolean = false,
}: {
    label: string;
    value?: string | boolean | null;
    isBoolean?: boolean;
}) => (
    <ListItem disableGutters sx={{ mb: 1 }}>
        <ListItemText
            primary={label}
            secondary={
                isBoolean ? (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {value ? (
                            <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                        ) : (
                            <CancelIcon color="error" sx={{ mr: 1 }} />
                        )}
                        <Typography variant="body2">
                            {value ? 'Yes' : 'No'}
                        </Typography>
                    </Box>
                ) : (
                    value || '—'
                )
            }
            primaryTypographyProps={{
                variant: 'body2',
                color: 'textSecondary',
            }}
            secondaryTypographyProps={{ variant: 'body1' }}
        />
    </ListItem>
);

// Array field display component
const ArrayField = ({
    label,
    value,
}: {
    label: string;
    value?: any[] | null;
}) => (
    <ListItem disableGutters sx={{ mb: 1 }}>
        <ListItemText
            primary={label}
            secondary={
                value && value.length > 0 ? (
                    <Box
                        sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 0.5,
                            mt: 0.5,
                        }}
                    >
                        {value.map((item, index) => (
                            <Chip
                                key={index}
                                label={
                                    typeof item === 'string'
                                        ? item
                                        : item.name || item.url || 'Item'
                                }
                                size="small"
                                variant="outlined"
                            />
                        ))}
                    </Box>
                ) : (
                    '—'
                )
            }
            primaryTypographyProps={{
                variant: 'body2',
                color: 'textSecondary',
            }}
        />
    </ListItem>
);

export const BrandShow = () => {
    const record = useRecordContext<Organization>();

    if (!record) return null;

    const brand = (record as any).brand || ({} as OrganizationBrand);
    const brandColors = brand.brandColors
        ? Array.isArray(brand.brandColors)
            ? brand.brandColors
            : []
        : [];
    const logoFiles = brand.logoFiles
        ? Array.isArray(brand.logoFiles)
            ? brand.logoFiles
            : []
        : [];
    const subBrands = brand.subBrands
        ? Array.isArray(brand.subBrands)
            ? brand.subBrands
            : []
        : [];
    const moodBoardLinks = brand.moodBoardLinks
        ? Array.isArray(brand.moodBoardLinks)
            ? brand.moodBoardLinks
            : []
        : [];

    // Extract font names from the stored value (format: "Heading: Font1, Body: Font2")
    const extractFontNames = (fontString?: string | null) => {
        if (!fontString) return { heading: '—', body: '—' };

        const headingMatch = fontString.match(/Heading:\s*([^,]+)/i);
        const bodyMatch = fontString.match(/Body:\s*([^,]+)/i);

        return {
            heading: headingMatch ? headingMatch[1].trim() : '—',
            body: bodyMatch ? bodyMatch[1].trim() : '—',
        };
    };

    const fonts = extractFontNames(brand.preferredFonts);

    return (
        <Paper elevation={0} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <BrushIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h5">Brand Information</Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Grid2 container spacing={3}>
                {/* Brand Style Guide */}
                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    mb: 2,
                                }}
                            >
                                <StyleIcon color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6">
                                    Brand Style Guide
                                </Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />

                            <List disablePadding>
                                <BrandField
                                    label="Has Brand Style Guide"
                                    value={brand.hasBrandStyleGuide}
                                    isBoolean={true}
                                />

                                <BrandField
                                    label="Need Logo Refresh"
                                    value={brand.needLogoRefresh}
                                    isBoolean={true}
                                />

                                <BrandField
                                    label="Tagline Development Needs"
                                    value={brand.taglineDevelopmentNeeds}
                                    isBoolean={true}
                                />
                            </List>
                        </CardContent>
                    </Card>
                </Grid2>

                {/* Brand Colors */}
                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    mb: 2,
                                }}
                            >
                                <ColorLensIcon color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6">
                                    Brand Colors
                                </Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />

                            {brandColors.length > 0 ? (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: 2,
                                    }}
                                >
                                    {brandColors.map(
                                        (color: any, index: number) => (
                                            <Box
                                                key={index}
                                                sx={{ textAlign: 'center' }}
                                            >
                                                <ColorBox
                                                    color={color.hex || color}
                                                />
                                                <Typography
                                                    variant="caption"
                                                    display="block"
                                                    sx={{ mt: 0.5 }}
                                                >
                                                    {color.name ||
                                                        color.hex ||
                                                        color}
                                                </Typography>
                                            </Box>
                                        )
                                    )}
                                </Box>
                            ) : (
                                <Typography
                                    variant="body2"
                                    color="textSecondary"
                                >
                                    No brand colors have been defined.
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid2>

                {/* Typography & Logo */}
                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    mb: 2,
                                }}
                            >
                                <TextFieldsIcon
                                    color="primary"
                                    sx={{ mr: 1 }}
                                />
                                <Typography variant="h6">
                                    Typography & Logo
                                </Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />

                            <List disablePadding>
                                <ListItem disableGutters>
                                    <ListItemText
                                        primary="Font Combination"
                                        secondary={
                                            brand.preferredFonts ? (
                                                <Box sx={{ mt: 1 }}>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            fontWeight: 'bold',
                                                        }}
                                                    >
                                                        Heading: {fonts.heading}
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        Body: {fonts.body}
                                                    </Typography>
                                                </Box>
                                            ) : (
                                                '—'
                                            )
                                        }
                                        primaryTypographyProps={{
                                            variant: 'body2',
                                            color: 'textSecondary',
                                        }}
                                    />
                                </ListItem>

                                <ArrayField
                                    label="Logo Files"
                                    value={logoFiles}
                                />

                                <ArrayField
                                    label="Sub-brands"
                                    value={subBrands}
                                />

                                {typeof (record as any).logo === 'string' &&
                                    (record as any).logo && (
                                        <ListItem disableGutters sx={{ mt: 2 }}>
                                            <ListItemText
                                                primary="Organization Logo"
                                                secondary={
                                                    <Box sx={{ mt: 1 }}>
                                                        <img
                                                            src={(record as any).logo}
                                                            alt="Company Logo"
                                                            style={{
                                                                maxWidth:
                                                                    '100%',
                                                                maxHeight: 100,
                                                            }}
                                                        />
                                                    </Box>
                                                }
                                                primaryTypographyProps={{
                                                    variant: 'body2',
                                                    color: 'textSecondary',
                                                }}
                                            />
                                        </ListItem>
                                    )}
                            </List>
                        </CardContent>
                    </Card>
                </Grid2>

                {/* Visual Style */}
                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    mb: 2,
                                }}
                            >
                                <ImageIcon color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6">
                                    Visual Style
                                </Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />

                            <List disablePadding>
                                <BrandField
                                    label="Iconography Style"
                                    value={brand.iconography}
                                />

                                <BrandField
                                    label="Image Style Preferences"
                                    value={brand.imageStylePreferences}
                                />

                                <ArrayField
                                    label="Mood Board Links"
                                    value={moodBoardLinks}
                                />
                            </List>
                        </CardContent>
                    </Card>
                </Grid2>

                {/* Brand Voice */}
                <Grid2 size={{ xs: 12 }}>
                    <Card variant="outlined">
                        <CardContent>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    mb: 2,
                                }}
                            >
                                <RecordVoiceOverIcon
                                    color="primary"
                                    sx={{ mr: 1 }}
                                />
                                <Typography variant="h6">
                                    Brand Voice
                                </Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />

                            <Grid2 container spacing={2}>
                                <Grid2 size={{ xs: 12, md: 6 }}>
                                    <BrandField
                                        label="Brand Voice & Tone"
                                        value={brand.brandVoiceTone}
                                    />
                                </Grid2>

                                <Grid2 size={{ xs: 12, md: 6 }}>
                                    <BrandField
                                        label="Words to Avoid"
                                        value={brand.wordsToAvoid}
                                    />
                                </Grid2>
                            </Grid2>
                        </CardContent>
                    </Card>
                </Grid2>
            </Grid2>
        </Paper>
    );
};

export default BrandShow;
