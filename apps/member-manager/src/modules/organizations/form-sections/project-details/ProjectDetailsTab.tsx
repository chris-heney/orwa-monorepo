import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import BugReportIcon from '@mui/icons-material/BugReport';
import BusinessIcon from '@mui/icons-material/Business';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import CodeIcon from '@mui/icons-material/Code';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import DomainIcon from '@mui/icons-material/Domain';
import EmailIcon from '@mui/icons-material/Email';
import EngineeringIcon from '@mui/icons-material/Engineering';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FlagIcon from '@mui/icons-material/Flag';
import GavelIcon from '@mui/icons-material/Gavel';
import HistoryIcon from '@mui/icons-material/History';
import HomeIcon from '@mui/icons-material/Home';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import StyleIcon from '@mui/icons-material/Style';
import WebIcon from '@mui/icons-material/Web';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Divider,
    Grid,
    Typography,
    alpha,
} from '@mui/material';
import { BooleanInput, NumberInput, TextInput } from 'react-admin';

const styles = {
    section: {
        mb: 4,
        p: 2,
        borderRadius: 2,
        bgcolor: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
        transition: 'box-shadow 0.3s ease',
        '&:hover': {
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        },
    },
    sectionTitle: {
        display: 'flex',
        alignItems: 'center',
        mb: 2,
        pb: 1,
        borderBottom: '1px solid #f0f0f0',
    },
    icon: {
        color: 'primary.main',
        mr: 1,
    },
    highlight: {
        bgcolor: alpha('#2196f3', 0.08),
        p: 2,
        borderRadius: 1,
        borderLeft: '4px solid #2196f3',
        mb: 3,
    },
    inputWrapper: {
        mb: 3,
    },
    accordion: {
        mb: 2,
        '&:before': {
            display: 'none',
        },
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        '&.Mui-expanded': {
            margin: 0,
            mb: 2,
        },
    },
    accordionSummary: {
        backgroundColor: alpha('#f5f5f5', 0.6),
        '&.Mui-expanded': {
            minHeight: 48,
            borderBottom: '1px solid #eaeaea',
        },
    },
    accordionDetails: {
        padding: 2,
        pt: 3,
    },
    fieldGroup: {
        mb: 3,
        pb: 2,
        borderBottom: '1px dashed #eaeaea',
    },
    fieldGroupTitle: {
        display: 'flex',
        alignItems: 'center',
        mb: 2,
        color: 'text.primary',
        fontWeight: 500,
    },
    fieldIcon: {
        mr: 1,
        color: 'text.secondary',
        fontSize: '1.2rem',
    },
};

const ProjectDetailsTab = () => {
    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Box sx={styles.highlight}>
                    <Typography variant="body1">
                        Please provide detailed information about your website
                        project. This will help us understand your requirements
                        and deliver the best results.
                    </Typography>
                </Box>
            </Grid>

            {/* Website Details Section */}
            <Grid item xs={12}>
                <Accordion
                    defaultExpanded
                    disableGutters
                    elevation={0}
                    sx={styles.accordion}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={styles.accordionSummary}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <WebIcon sx={styles.icon} />
                            <Typography variant="subtitle1">
                                Website Details
                            </Typography>
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails sx={styles.accordionDetails}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Box sx={styles.fieldGroup}>
                                    <Box sx={styles.fieldGroupTitle}>
                                        <WebIcon sx={styles.fieldIcon} />
                                        <Typography>Website Type</Typography>
                                    </Box>
                                    <TextInput
                                        source="projectDetails.websiteType"
                                        label="Website Type"
                                        fullWidth
                                        helperText="e.g., Redesign, New Build, Landing Page"
                                        variant="outlined"
                                    />
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Box sx={styles.fieldGroup}>
                                    <Box sx={styles.fieldGroupTitle}>
                                        <BugReportIcon sx={styles.fieldIcon} />
                                        <Typography>
                                            Current Website Issues
                                        </Typography>
                                    </Box>
                                    <TextInput
                                        source="projectDetails.websiteIssues"
                                        label="Website Issues"
                                        fullWidth
                                        multiline
                                        rows={2}
                                        helperText="e.g., Slow load times, outdated design"
                                        variant="outlined"
                                    />
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Box sx={styles.fieldGroup}>
                                    <Box sx={styles.fieldGroupTitle}>
                                        <StyleIcon sx={styles.fieldIcon} />
                                        <Typography>
                                            Design Preferences
                                        </Typography>
                                    </Box>
                                    <TextInput
                                        source="projectDetails.preferredWebsiteStyle"
                                        label="Preferred Website Style"
                                        fullWidth
                                        helperText="e.g., Modern and minimalist, Bold and colorful"
                                        variant="outlined"
                                    />
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Box sx={styles.fieldGroup}>
                                    <Box sx={styles.fieldGroupTitle}>
                                        <AccountTreeIcon
                                            sx={styles.fieldIcon}
                                        />
                                        <Typography>Sitemap Status</Typography>
                                    </Box>
                                    <TextInput
                                        source="projectDetails.sitemapStatus"
                                        label="Sitemap Status"
                                        fullWidth
                                        helperText="e.g., Completed, In Progress, Not Started"
                                        variant="outlined"
                                    />
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Box sx={styles.fieldGroup}>
                                    <Box sx={styles.fieldGroupTitle}>
                                        <DomainIcon sx={styles.fieldIcon} />
                                        <Typography>
                                            Domain Information
                                        </Typography>
                                    </Box>
                                    <TextInput
                                        source="projectDetails.domainRegistrar"
                                        label="Domain Registrar"
                                        fullWidth
                                        helperText="e.g., GoDaddy, Namecheap"
                                        variant="outlined"
                                    />
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Box sx={styles.fieldGroup}>
                                    <Box sx={styles.fieldGroupTitle}>
                                        <CodeIcon sx={styles.fieldIcon} />
                                        <Typography>
                                            Content Management
                                        </Typography>
                                    </Box>
                                    <TextInput
                                        source="projectDetails.contentManagementSystem"
                                        label="Content Management System"
                                        fullWidth
                                        helperText="e.g., WordPress, Shopify, Custom"
                                        variant="outlined"
                                    />
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Box sx={styles.fieldGroup}>
                                    <Box sx={styles.fieldGroupTitle}>
                                        <EngineeringIcon
                                            sx={styles.fieldIcon}
                                        />
                                        <Typography>
                                            Maintenance Plan
                                        </Typography>
                                    </Box>
                                    <BooleanInput
                                        source="projectDetails.needWebsiteMaintenancePlan"
                                        label="Need Website Maintenance Plan?"
                                        helperText="Regular updates, security patches, and support"
                                    />
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Box sx={styles.fieldGroup}>
                                    <Box sx={styles.fieldGroupTitle}>
                                        <GavelIcon sx={styles.fieldIcon} />
                                        <Typography>
                                            Legal Compliance
                                        </Typography>
                                    </Box>
                                    <TextInput
                                        source="projectDetails.legalComplianceRequirements"
                                        label="Legal Compliance Requirements"
                                        fullWidth
                                        helperText="e.g., GDPR, CCPA, ADA"
                                        variant="outlined"
                                    />
                                </Box>
                            </Grid>

                            <Grid item xs={12}>
                                <Box sx={styles.fieldGroup}>
                                    <Box sx={styles.fieldGroupTitle}>
                                        <CompareArrowsIcon
                                            sx={styles.fieldIcon}
                                        />
                                        <Typography>Redirects</Typography>
                                    </Box>
                                    <TextInput
                                        source="projectDetails.requiredRedirects"
                                        label="Required Redirects"
                                        fullWidth
                                        multiline
                                        rows={2}
                                        helperText="e.g., http://oldsite.com -> https://www.newsite.com"
                                        variant="outlined"
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                    </AccordionDetails>
                </Accordion>
            </Grid>

            {/* Business Information Section */}
            <Grid item xs={12}>
                <Accordion
                    defaultExpanded
                    disableGutters
                    elevation={0}
                    sx={styles.accordion}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={styles.accordionSummary}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <BusinessIcon sx={styles.icon} />
                            <Typography variant="subtitle1">
                                Business Information
                            </Typography>
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails sx={styles.accordionDetails}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Box sx={styles.fieldGroup}>
                                    <Box sx={styles.fieldGroupTitle}>
                                        <BusinessIcon sx={styles.fieldIcon} />
                                        <Typography>
                                            Legal Business Name
                                        </Typography>
                                    </Box>
                                    <TextInput
                                        source="projectDetails.legalBusinessName"
                                        label="Legal Business Name"
                                        fullWidth
                                        helperText="Official registered name"
                                        variant="outlined"
                                    />
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Box sx={styles.fieldGroup}>
                                    <Box sx={styles.fieldGroupTitle}>
                                        <HomeIcon sx={styles.fieldIcon} />
                                        <Typography>
                                            Business Address
                                        </Typography>
                                    </Box>
                                    <TextInput
                                        source="projectDetails.companyAddress"
                                        label="Company Address"
                                        fullWidth
                                        helperText="Physical location"
                                        variant="outlined"
                                    />
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Box sx={styles.fieldGroup}>
                                    <Box sx={styles.fieldGroupTitle}>
                                        <CardMembershipIcon
                                            sx={styles.fieldIcon}
                                        />
                                        <Typography>
                                            Business License
                                        </Typography>
                                    </Box>
                                    <TextInput
                                        source="projectDetails.businessLicense"
                                        label="Business License"
                                        fullWidth
                                        helperText="License or registration number"
                                        variant="outlined"
                                    />
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Box sx={styles.fieldGroup}>
                                    <Box sx={styles.fieldGroupTitle}>
                                        <CardMembershipIcon
                                            sx={styles.fieldIcon}
                                        />
                                        <Typography>Certifications</Typography>
                                    </Box>
                                    <TextInput
                                        source="projectDetails.certifications"
                                        label="Certifications"
                                        fullWidth
                                        helperText="Industry certifications, awards"
                                        variant="outlined"
                                    />
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Box sx={styles.fieldGroup}>
                                    <Box sx={styles.fieldGroupTitle}>
                                        <HistoryIcon sx={styles.fieldIcon} />
                                        <Typography>
                                            Years in Business
                                        </Typography>
                                    </Box>
                                    <NumberInput
                                        source="projectDetails.yearsInBusiness"
                                        label="Years in Business"
                                        fullWidth
                                        helperText="How long has your business been operating?"
                                        variant="outlined"
                                    />
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Box sx={styles.fieldGroup}>
                                    <Box sx={styles.fieldGroupTitle}>
                                        <AccessTimeIcon sx={styles.fieldIcon} />
                                        <Typography>Business Hours</Typography>
                                    </Box>
                                    <TextInput
                                        source="projectDetails.businessHours"
                                        label="Business Hours"
                                        fullWidth
                                        helperText="e.g., 9 AM - 5 PM, Monday to Friday"
                                        variant="outlined"
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                    </AccordionDetails>
                </Accordion>
            </Grid>

            {/* Contact Information Section */}
            <Grid item xs={12}>
                <Accordion
                    defaultExpanded
                    disableGutters
                    elevation={0}
                    sx={styles.accordion}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={styles.accordionSummary}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <PermContactCalendarIcon sx={styles.icon} />
                            <Typography variant="subtitle1">
                                Contact Information
                            </Typography>
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails sx={styles.accordionDetails}>
                        <Grid container spacing={3}>
                            {/* Primary Contact */}
                            <Grid item xs={12}>
                                <Typography
                                    variant="subtitle2"
                                    gutterBottom
                                    color="primary"
                                >
                                    Primary Contact
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Box sx={styles.fieldGroup}>
                                    <Box sx={styles.fieldGroupTitle}>
                                        <PersonIcon sx={styles.fieldIcon} />
                                        <Typography>
                                            Primary Contact Name
                                        </Typography>
                                    </Box>
                                    <TextInput
                                        source="projectDetails.primaryContactName"
                                        label="Primary Contact Name"
                                        fullWidth
                                        helperText="Main project contact person"
                                        variant="outlined"
                                    />
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Box sx={styles.fieldGroup}>
                                    <Box sx={styles.fieldGroupTitle}>
                                        <EmailIcon sx={styles.fieldIcon} />
                                        <Typography>
                                            Primary Contact Email
                                        </Typography>
                                    </Box>
                                    <TextInput
                                        source="projectDetails.primaryContactEmail"
                                        label="Primary Contact Email"
                                        fullWidth
                                        helperText="Email for project communications"
                                        variant="outlined"
                                    />
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Box sx={styles.fieldGroup}>
                                    <Box sx={styles.fieldGroupTitle}>
                                        <PhoneIcon sx={styles.fieldIcon} />
                                        <Typography>
                                            Primary Contact Phone
                                        </Typography>
                                    </Box>
                                    <TextInput
                                        source="projectDetails.primaryContactPhone"
                                        label="Primary Contact Phone"
                                        fullWidth
                                        helperText="Include country code if applicable"
                                        variant="outlined"
                                    />
                                </Box>
                            </Grid>

                            {/* Business Owner */}
                            <Grid item xs={12}>
                                <Typography
                                    variant="subtitle2"
                                    gutterBottom
                                    color="primary"
                                >
                                    Business Owner Information
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Box sx={styles.fieldGroup}>
                                    <Box sx={styles.fieldGroupTitle}>
                                        <PersonIcon sx={styles.fieldIcon} />
                                        <Typography>
                                            Business Owner Name
                                        </Typography>
                                    </Box>
                                    <TextInput
                                        source="projectDetails.businessOwnerName"
                                        label="Business Owner Name"
                                        fullWidth
                                        helperText="Name of the business owner or CEO"
                                        variant="outlined"
                                    />
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Box sx={styles.fieldGroup}>
                                    <Box sx={styles.fieldGroupTitle}>
                                        <PhoneAndroidIcon
                                            sx={styles.fieldIcon}
                                        />
                                        <Typography>
                                            Business Owner Contact
                                        </Typography>
                                    </Box>
                                    <TextInput
                                        source="projectDetails.businessOwnerContact"
                                        label="Business Owner Contact"
                                        fullWidth
                                        helperText="Phone number for the business owner"
                                        variant="outlined"
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                    </AccordionDetails>
                </Accordion>
            </Grid>

            {/* Marketing Information Section */}
            <Grid item xs={12}>
                <Accordion
                    defaultExpanded
                    disableGutters
                    elevation={0}
                    sx={styles.accordion}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={styles.accordionSummary}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <FlagIcon sx={styles.icon} />
                            <Typography variant="subtitle1">
                                Marketing & Branding
                            </Typography>
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails sx={styles.accordionDetails}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Box sx={styles.fieldGroup}>
                                    <Box sx={styles.fieldGroupTitle}>
                                        <FlagIcon sx={styles.fieldIcon} />
                                        <Typography>
                                            Mission and Values
                                        </Typography>
                                    </Box>
                                    <TextInput
                                        source="projectDetails.missionAndValues"
                                        label="Mission and Values"
                                        fullWidth
                                        multiline
                                        rows={3}
                                        helperText="Your company's mission statement and core values"
                                        variant="outlined"
                                    />
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Box sx={styles.fieldGroup}>
                                    <Box sx={styles.fieldGroupTitle}>
                                        <FlagIcon sx={styles.fieldIcon} />
                                        <Typography>Elevator Pitch</Typography>
                                    </Box>
                                    <TextInput
                                        source="projectDetails.elevatorPitch"
                                        label="Elevator Pitch"
                                        fullWidth
                                        multiline
                                        rows={3}
                                        helperText="Brief description of what your company does"
                                        variant="outlined"
                                    />
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Box sx={styles.fieldGroup}>
                                    <Box sx={styles.fieldGroupTitle}>
                                        <FlagIcon sx={styles.fieldIcon} />
                                        <Typography>
                                            Unique Selling Proposition (USP)
                                        </Typography>
                                    </Box>
                                    <TextInput
                                        source="projectDetails.usp"
                                        label="USP"
                                        fullWidth
                                        helperText="What makes your business unique?"
                                        variant="outlined"
                                    />
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Box sx={styles.fieldGroup}>
                                    <Box sx={styles.fieldGroupTitle}>
                                        <FlagIcon sx={styles.fieldIcon} />
                                        <Typography>Company Tagline</Typography>
                                    </Box>
                                    <TextInput
                                        source="projectDetails.companyTagline"
                                        label="Company Tagline"
                                        fullWidth
                                        helperText="Your business slogan or tagline"
                                        variant="outlined"
                                    />
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Box sx={styles.fieldGroup}>
                                    <Box sx={styles.fieldGroupTitle}>
                                        <HistoryIcon sx={styles.fieldIcon} />
                                        <Typography>Company History</Typography>
                                    </Box>
                                    <TextInput
                                        source="projectDetails.companyHistory"
                                        label="Company History"
                                        fullWidth
                                        multiline
                                        rows={3}
                                        helperText="Brief history of your company"
                                        variant="outlined"
                                    />
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Box sx={styles.fieldGroup}>
                                    <Box sx={styles.fieldGroupTitle}>
                                        <BugReportIcon sx={styles.fieldIcon} />
                                        <Typography>
                                            Marketing Pain Points
                                        </Typography>
                                    </Box>
                                    <TextInput
                                        source="projectDetails.marketingPainPoints"
                                        label="Marketing Pain Points"
                                        fullWidth
                                        multiline
                                        rows={3}
                                        helperText="Current marketing challenges you face"
                                        variant="outlined"
                                    />
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Box sx={styles.fieldGroup}>
                                    <Box sx={styles.fieldGroupTitle}>
                                        <WebIcon sx={styles.fieldIcon} />
                                        <Typography>
                                            Current Website URL
                                        </Typography>
                                    </Box>
                                    <TextInput
                                        source="projectDetails.currentWebsiteUrl"
                                        label="Current Website URL"
                                        fullWidth
                                        helperText="URL of your existing website, if any"
                                        variant="outlined"
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                    </AccordionDetails>
                </Accordion>
            </Grid>
        </Grid>
    );
};

export default ProjectDetailsTab;
