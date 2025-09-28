import BusinessIcon from '@mui/icons-material/Business';
import DescriptionIcon from '@mui/icons-material/Description';
import ImageIcon from '@mui/icons-material/Image';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import { Box, Divider, Grid2, Typography, alpha } from '@mui/material';
import {
    AutocompleteInput,
    NumberInput,
    ReferenceInput,
    SelectInput,
    TextInput,
    required,
} from 'react-admin';
import { PhoneInput } from '../../../../_components/PhoneInput';
import FileUploadField from '../../../../_components/FileUploadField';
import MarketingBudget from './MarketingBudget';
import { useFormContext } from 'react-hook-form';

const styles = {
    section: {
        p: 2,
        borderRadius: 2,
        border: 'none',
    },
    sectionTitle: {
        display: 'flex',
        alignItems: 'center',
        mb: 1.5,
        pb: 1,
        borderBottom: '1px solid #f0f0f0',
    },
    icon: {
        color: 'primary.main',
        mr: 1,
    },
    inputWrapper: {
        mb: 1.5,
    },
    highlight: {
        bgcolor: alpha('#2196f3', 0.08),
        p: 2,
        borderRadius: 1,
        borderLeft: '4px solid #2196f3',
        mb: 2,
    },
};

const BasicDetailsTab = () => {
    const { getValues } = useFormContext();
    const record = getValues();

    return (
        <Grid2 container spacing={0}>
            <Grid2
                size={{
                    xs: 12,
                }}
            >
                <Box sx={styles.highlight}>
                    <Typography variant="body1">
                        Let's start with basic information about your
                        organization. This information will be used across your
                        account.
                    </Typography>
                </Box>
            </Grid2>

            {/* Left Column - All Form Inputs */}
            <Grid2
                size={{
                    xs: 12,
                    md: 7,
                }}
                container
                spacing={0}
                sx={{ pr: 2 }}
            >
                {/* Organization Identity Section */}
                <Grid2
                    size={{
                        xs: 12,
                    }}
                >
                    <Box sx={styles.sectionTitle}>
                        <BusinessIcon sx={styles.icon} />
                        <Typography variant="h6">
                            Organization Identity
                        </Typography>
                    </Box>

                    <Grid2 container spacing={2}>
                        <Grid2
                            size={{
                                xs: 12,
                                sm: 6,
                            }}
                        >
                            <Box sx={styles.inputWrapper}>
                                <TextInput
                                    source="name"
                                    label="Company Name"
                                    fullWidth
                                    validate={[required()]}
                                    helperText="Official company name"
                                    variant="outlined"
                                />
                            </Box>
                        </Grid2>
                        <Grid2
                            size={{
                                xs: 12,
                                sm: 6,
                            }}
                        >
                            <Box sx={styles.inputWrapper}>
                                <SelectInput
                                    source="organizationType"
                                    label="Organization Type"
                                    choices={[
                                        { id: 'Dealer', name: 'Dealer' },
                                        { id: 'Vendor', name: 'Vendor' },
                                        { id: 'Customer', name: 'Customer' },
                                        {
                                            id: 'Competitor',
                                            name: 'Competitor',
                                        },
                                        {
                                            id: 'DirectoryListing',
                                            name: 'DirectoryListing',
                                        },
                                    ]}
                                    fullWidth
                                    validate={[required()]}
                                    helperText="What type of organization is this?"
                                    variant="outlined"
                                />
                            </Box>
                        </Grid2>
                        <Grid2
                            size={{
                                xs: 12,
                                sm: 6,
                            }}
                        >
                            <Box sx={styles.inputWrapper}>
                                <SelectInput
                                    source="ownershipType"
                                    label="Ownership Type"
                                    choices={[
                                        {
                                            id: 'PRIVATE_EQUITY',
                                            name: 'Private Equity',
                                        },
                                        {
                                            id: 'PARTNERSHIP',
                                            name: 'Partnership',
                                        },
                                        {
                                            id: 'PRIVATELY_OWNED',
                                            name: 'Privately Owned',
                                        },
                                        { id: 'FRANCHISE', name: 'Franchise' },
                                        {
                                            id: 'NON_PROFIT',
                                            name: 'Non-Profit',
                                        },
                                    ]}
                                    fullWidth
                                    validate={[required()]}
                                    helperText="What type of ownership does this organization have?"
                                    variant="outlined"
                                />
                            </Box>
                        </Grid2>
                        <Grid2
                            size={{
                                xs: 12,
                                sm: 6,
                            }}
                        >
                            <Box sx={styles.inputWrapper}>
                                <ReferenceInput
                                    source="industryId"
                                    label="Industry"
                                    reference="industry"
                                    target="id"
                                    perPage={100}
                                    pagination={false}
                                >
                                    <AutocompleteInput
                                        optionText="name"
                                        optionValue="id"
                                        fullWidth
                                        validate={required()}
                                        helperText="What industry does this organization belong to?"
                                        variant="outlined"
                                    />
                                </ReferenceInput>
                            </Box>
                        </Grid2>
                    </Grid2>
                </Grid2>

                {/* Contact Information Section */}
                <Grid2
                    size={{
                        xs: 12,
                    }}
                >
                    <Box sx={styles.sectionTitle}>
                        <PhoneIcon sx={styles.icon} />
                        <Typography variant="h6">
                            Contact Information
                        </Typography>
                    </Box>

                    <Grid2 container spacing={2}>
                        <Grid2
                            size={{
                                xs: 12,
                                sm: 6,
                            }}
                        >
                            <Box sx={styles.inputWrapper}>
                                <PhoneInput
                                    source="phone"
                                    label="Main Phone"
                                    fullWidth
                                    helperText="Primary contact number"
                                    variant="outlined"
                                />
                            </Box>
                        </Grid2>
                        <Grid2
                            size={{
                                xs: 12,
                                sm: 6,
                            }}
                        >
                            <Box sx={styles.inputWrapper}>
                                <TextInput
                                    source="email"
                                    label="Primary Email"
                                    fullWidth
                                    helperText="Main contact email"
                                    variant="outlined"
                                />
                            </Box>
                        </Grid2>
                        <Grid2
                            size={{
                                xs: 12,
                                sm: 6,
                            }}
                        >
                            <Box sx={styles.inputWrapper}>
                                <TextInput
                                    source="currentWebsiteUrl"
                                    label="Current Website URL"
                                    fullWidth
                                    helperText="Your existing website URL"
                                    variant="outlined"
                                />
                            </Box>
                        </Grid2>
                        <Grid2
                            size={{
                                xs: 12,
                                sm: 6,
                            }}
                        >
                            <Box sx={styles.inputWrapper}>
                                <TextInput
                                    source="leadNotificationPhone"
                                    label="Lead Notification Phone"
                                    fullWidth
                                    helperText="Phone number for lead notifications"
                                    variant="outlined"
                                />
                            </Box>
                        </Grid2>
                        <Grid2
                            size={{
                                xs: 12,
                                sm: 6,
                            }}
                        >
                            <Box sx={styles.inputWrapper}>
                                <TextInput
                                    source="leadNotificationEmail"
                                    label="Lead Notification Email"
                                    fullWidth
                                    helperText="Email for lead notifications"
                                    variant="outlined"
                                />
                            </Box>
                        </Grid2>
                    </Grid2>
                </Grid2>

                {/* Description Section */}
                <Grid2
                    size={{
                        xs: 12,
                    }}
                >
                    <Box sx={styles.sectionTitle}>
                        <DescriptionIcon sx={styles.icon} />
                        <Typography variant="h6">
                            Company Description
                        </Typography>
                    </Box>
                    <Grid2 container spacing={2}>
                        <Grid2
                            size={{
                                xs: 12,
                            }}
                        >
                            <Box sx={styles.inputWrapper}>
                                <TextInput
                                    source="description"
                                    label="Company Description"
                                    multiline
                                    rows={3}
                                    fullWidth
                                    helperText="Brief description of your company and services"
                                    variant="outlined"
                                />
                            </Box>
                        </Grid2>
                        <Grid2
                            size={{
                                xs: 12,
                            }}
                        >
                            <Box sx={styles.inputWrapper}>
                                <TextInput
                                    source="tagline"
                                    label="Tagline"
                                    multiline
                                    rows={3}
                                    fullWidth
                                    helperText="Tagline of your company"
                                    variant="outlined"
                                />
                            </Box>
                        </Grid2>
                        <Grid2
                            size={{
                                xs: 12,
                                sm: 6,
                            }}
                        >
                            <Box sx={styles.inputWrapper}>
                                <NumberInput
                                    source="websiteTemplateId"
                                    label="Website Template ID"
                                    fullWidth
                                    helperText="Selected website template ID"
                                    variant="outlined"
                                />
                            </Box>
                        </Grid2>
                        <Grid2
                            size={{
                                xs: 12,
                                sm: 6,
                            }}
                        >
                            <Box sx={styles.inputWrapper}>
                                <TextInput
                                    source="websiteTemplateLink"
                                    label="Website Template Link"
                                    fullWidth
                                    helperText="Link to website template"
                                    variant="outlined"
                                />
                            </Box>
                        </Grid2>
                    </Grid2>
                </Grid2>

                {/* Media Section */}
                <Grid2
                    size={{
                        xs: 12,
                    }}
                    sx={{ mb: 2 }}
                >
                    <Box sx={styles.sectionTitle}>
                        <ImageIcon sx={styles.icon} />
                        <Typography variant="h6">Company Media</Typography>
                    </Box>

                    <Grid2 container spacing={2}>
                        <Grid2
                            size={{
                                xs: 12,
                                sm: 6,
                            }}
                        >
                            <Box sx={styles.inputWrapper}>
                                <TextInput
                                    source="icon"
                                    label="Icon URL"
                                    fullWidth
                                    helperText="URL to company icon (favicon)"
                                    variant="outlined"
                                />
                            </Box>
                        </Grid2>
                        <Grid2
                            size={{
                                xs: 12,
                                sm: 6,
                            }}
                        >
                            <FileUploadField
                                source="primaryLogoId"
                                label="Company Logo"
                                accept="image/*"
                                folderPath={`${
                                    record?.name
                                        ? record?.name?.replace(/ /g, '') +
                                          '/logos'
                                        : '/logos'
                                }`}
                                fullWidth
                            />
                        </Grid2>
                    </Grid2>
                </Grid2>

                {/* Dealer Interests Section */}
                <Grid2
                    size={{
                        xs: 12,
                    }}
                >
                    <Box sx={styles.sectionTitle}>
                        <BusinessIcon sx={styles.icon} />
                        <Typography variant="h6">
                            Dealer Interests
                        </Typography>
                    </Box>
                    <Grid2 container spacing={2}>
                        <Grid2
                            size={{
                                xs: 12,
                            }}
                        >
                            <Box sx={styles.inputWrapper}>
                                <TextInput
                                    source="dealerInterests"
                                    label="Dealer Interests"
                                    multiline
                                    rows={3}
                                    fullWidth
                                    helperText="List dealer interests and services (comma-separated)"
                                    variant="outlined"
                                />
                            </Box>
                        </Grid2>
                    </Grid2>
                </Grid2>
            </Grid2>

            <Grid2
                size={{
                    xs: 12,
                    md: 5,
                }}
            >
                <Grid2 container spacing={2}>
                    <Grid2
                        size={{
                            xs: 12,
                        }}
                    >
                        <Box sx={styles.inputWrapper}>
                            <Typography
                                variant="h6"
                                gutterBottom
                                sx={{ display: 'flex', alignItems: 'center' }}
                            >
                                <MonetizationOnIcon sx={styles.icon} /> Annual
                                Revenue
                            </Typography>
                            <Divider />
                            <NumberInput
                                sx={{ mt: 2.5 }}
                                source="revenue"
                                label="Revenue"
                                fullWidth
                                helperText="Revenue of the company"
                                variant="outlined"
                            />
                        </Box>
                    </Grid2>
                    <Grid2
                        size={{
                            xs: 12,
                        }}
                    >
                        <MarketingBudget />
                    </Grid2>
                    <Grid2
                        size={{
                            xs: 12,
                        }}
                    >
                        <Box sx={styles.inputWrapper}>
                            <Typography variant="h6" gutterBottom mt={-2}>
                                Allocation
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            <Grid2 container spacing={2}>
                                <Grid2
                                    size={{
                                        xs: 12,
                                        sm: 6,
                                    }}
                                >
                                    <NumberInput
                                        source="budgetSeoAiSearch"
                                        label="SEO/AI Search"
                                        fullWidth
                                        helperText="SEO/AI Search budget"
                                        variant="outlined"
                                    />
                                </Grid2>
                                <Grid2
                                    size={{
                                        xs: 12,
                                        sm: 6,
                                    }}
                                >
                                    <NumberInput
                                        source="budgetAiConversionTools"
                                        label="AI Conversion Tools"
                                        fullWidth
                                        helperText="AI Conversion Tools budget"
                                        variant="outlined"
                                    />
                                </Grid2>
                                <Grid2
                                    size={{
                                        xs: 12,
                                        sm: 6,
                                    }}
                                >
                                    <NumberInput
                                        source="budgetLocalMarketing"
                                        label="Local Marketing"
                                        fullWidth
                                        helperText="Local Marketing budget"
                                        variant="outlined"
                                    />
                                </Grid2>
                                <Grid2
                                    size={{
                                        xs: 12,
                                        sm: 6,
                                    }}
                                >
                                    <NumberInput
                                        source="budgetPaidAdvertising"
                                        label="Paid Advertising"
                                        fullWidth
                                        helperText="Paid Advertising budget"
                                        variant="outlined"
                                    />
                                </Grid2>
                                <Grid2
                                    size={{
                                        xs: 12,
                                        sm: 6,
                                    }}
                                >
                                    <NumberInput
                                        source="budgetLsa"
                                        label="LSA (Local Services Ads)"
                                        fullWidth
                                        helperText="Local Services Ads budget"
                                        variant="outlined"
                                    />
                                </Grid2>
                                <Grid2
                                    size={{
                                        xs: 12,
                                        sm: 6,
                                    }}
                                >
                                    <NumberInput
                                        source="budgetSocialMediaOrganic"
                                        label="Social Media Organic"
                                        fullWidth
                                        helperText="Social Media Organic budget"
                                        variant="outlined"
                                    />
                                </Grid2>
                                <Grid2
                                    size={{
                                        xs: 12,
                                        sm: 6,
                                    }}
                                >
                                    <NumberInput
                                        source="budgetSocialMediaAds"
                                        label="Social Media Ads"
                                        fullWidth
                                        helperText="Social Media Ads budget"
                                        variant="outlined"
                                    />
                                </Grid2>
                                <Grid2
                                    size={{
                                        xs: 12,
                                        sm: 6,
                                    }}
                                >
                                    <NumberInput
                                        source="budgetAggregatorDirectory"
                                        label="Aggregator Directory"
                                        fullWidth
                                        helperText="Aggregator Directory budget"
                                        variant="outlined"
                                    />
                                </Grid2>
                                <Grid2
                                    size={{
                                        xs: 12,
                                        sm: 6,
                                    }}
                                >
                                    <NumberInput
                                        source="budgetTraditionalOther"
                                        label="Traditional/Other"
                                        fullWidth
                                        helperText="Traditional/Other marketing budget"
                                        variant="outlined"
                                    />
                                </Grid2>
                            </Grid2>
                        </Box>
                    </Grid2>
                </Grid2>
            </Grid2>
        </Grid2>
    );
};

export default BasicDetailsTab;
