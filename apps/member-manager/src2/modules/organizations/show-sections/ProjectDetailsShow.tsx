import { Organization, ProjectDetails } from '@ci-connect/types';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BusinessIcon from '@mui/icons-material/Business';
import CodeIcon from '@mui/icons-material/Code';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StyleIcon from '@mui/icons-material/Style';
import WebIcon from '@mui/icons-material/Web';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Card,
    CardContent,
    Divider,
    Grid2,
    List,
    ListItem,
    ListItemText,
    Paper,
    Typography,
} from '@mui/material';
import { useRecordContext } from 'react-admin';

// Field component for project details attributes
const DetailField = ({
    label,
    value,
}: {
    label: string;
    value?: string | number | boolean | null;
}) => (
    <ListItem disableGutters sx={{ mb: 1 }}>
        <ListItemText
            primary={label}
            secondary={
                typeof value === 'boolean'
                    ? value
                        ? 'Yes'
                        : 'No'
                    : value || '—'
            }
            primaryTypographyProps={{
                variant: 'body2',
                color: 'textSecondary',
            }}
            secondaryTypographyProps={{ variant: 'body1' }}
        />
    </ListItem>
);

export const ProjectDetailsShow = () => {
    const record = useRecordContext<Organization>();

    if (!record) return null;

    const projectDetails = record.projectDetails || ({} as ProjectDetails);

    return (
        <Paper elevation={0} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <WebIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h5">Project Details</Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Grid2 container spacing={3}>
                {/* Website Details */}
                <Grid2
                    size={{
                        xs: 12,
                    }}
                >
                    <Accordion defaultExpanded>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            sx={{ bgcolor: 'background.paper' }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <WebIcon color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6">
                                    Website Details
                                </Typography>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid2 container spacing={3}>
                                <Grid2
                                    size={{
                                        xs: 12,
                                        md: 6,
                                    }}
                                >
                                    <Card
                                        variant="outlined"
                                        sx={{ height: '100%' }}
                                    >
                                        <CardContent>
                                            <List disablePadding>
                                                <DetailField
                                                    label="Website Type"
                                                    value={
                                                        projectDetails.websiteType
                                                    }
                                                />

                                                <DetailField
                                                    label="Website Issues"
                                                    value={
                                                        projectDetails.websiteIssues
                                                    }
                                                />

                                                <DetailField
                                                    label="Preferred Website Style"
                                                    value={
                                                        projectDetails.preferredWebsiteStyle
                                                    }
                                                />
                                            </List>
                                        </CardContent>
                                    </Card>
                                </Grid2>

                                <Grid2
                                    size={{
                                        xs: 12,
                                        md: 6,
                                    }}
                                >
                                    <Card
                                        variant="outlined"
                                        sx={{ height: '100%' }}
                                    >
                                        <CardContent>
                                            <List disablePadding>
                                                <DetailField
                                                    label="Pages Required"
                                                    value={projectDetails.pagesRequired
                                                        ?.map(
                                                            (page: any) =>
                                                                page.name
                                                        )
                                                        .join(', ')}
                                                />

                                                <DetailField
                                                    label="Competitor Websites"
                                                    value={projectDetails.competitorWebsites
                                                        ?.map(
                                                            (website: any) =>
                                                                website.name
                                                        )
                                                        .join(', ')}
                                                />

                                                <DetailField
                                                    label="Primary Website Goals"
                                                    value={
                                                        projectDetails.primaryWebsiteGoals
                                                    }
                                                />
                                            </List>
                                        </CardContent>
                                    </Card>
                                </Grid2>
                            </Grid2>
                        </AccordionDetails>
                    </Accordion>
                </Grid2>

                {/* Technical Information */}
                <Grid2
                    size={{
                        xs: 12,
                    }}
                >
                    <Accordion defaultExpanded>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            sx={{ bgcolor: 'background.paper' }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <CodeIcon color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6">
                                    Technical Information
                                </Typography>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid2 container spacing={3}>
                                <Grid2
                                    size={{
                                        xs: 12,
                                        md: 6,
                                    }}
                                >
                                    <Card
                                        variant="outlined"
                                        sx={{ height: '100%' }}
                                    >
                                        <CardContent>
                                            <List disablePadding>
                                                <DetailField
                                                    label="Sitemap Status"
                                                    value={
                                                        projectDetails.sitemapStatus
                                                    }
                                                />

                                                <DetailField
                                                    label="Domain Registrar"
                                                    value={
                                                        projectDetails.domainRegistrar
                                                    }
                                                />

                                                <DetailField
                                                    label="Content Management System"
                                                    value={
                                                        projectDetails.contentManagementSystem
                                                    }
                                                />
                                            </List>
                                        </CardContent>
                                    </Card>
                                </Grid2>

                                <Grid2
                                    size={{
                                        xs: 12,
                                        md: 6,
                                    }}
                                >
                                    <Card
                                        variant="outlined"
                                        sx={{ height: '100%' }}
                                    >
                                        <CardContent>
                                            <List disablePadding>
                                                <DetailField
                                                    label="Need Website Maintenance Plan"
                                                    value={
                                                        projectDetails.needWebsiteMaintenancePlan
                                                    }
                                                />

                                                <DetailField
                                                    label="Legal Compliance Requirements"
                                                    value={
                                                        projectDetails.legalComplianceRequirements
                                                    }
                                                />

                                                <DetailField
                                                    label="Required Redirects"
                                                    value={
                                                        projectDetails.requiredRedirects
                                                    }
                                                />
                                            </List>
                                        </CardContent>
                                    </Card>
                                </Grid2>
                            </Grid2>
                        </AccordionDetails>
                    </Accordion>
                </Grid2>

                {/* Business Information */}
                <Grid2
                    size={{
                        xs: 12,
                    }}
                >
                    <Accordion defaultExpanded>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            sx={{ bgcolor: 'background.paper' }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <BusinessIcon color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6">
                                    Business Information
                                </Typography>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid2 container spacing={3}>
                                <Grid2
                                    size={{
                                        xs: 12,
                                        md: 6,
                                    }}
                                >
                                    <Card
                                        variant="outlined"
                                        sx={{ height: '100%' }}
                                    >
                                        <CardContent>
                                            <List disablePadding>
                                                <DetailField
                                                    label="Legal Business Name"
                                                    value={
                                                        projectDetails.legalBusinessName
                                                    }
                                                />

                                                <DetailField
                                                    label="Company Address"
                                                    value={
                                                        projectDetails.companyAddress
                                                    }
                                                />

                                                <DetailField
                                                    label="Business License"
                                                    value={
                                                        projectDetails.businessLicense
                                                    }
                                                />
                                            </List>
                                        </CardContent>
                                    </Card>
                                </Grid2>

                                <Grid2
                                    size={{
                                        xs: 12,
                                        md: 6,
                                    }}
                                >
                                    <Card
                                        variant="outlined"
                                        sx={{ height: '100%' }}
                                    >
                                        <CardContent>
                                            <List disablePadding>
                                                <DetailField
                                                    label="Certifications"
                                                    value={
                                                        projectDetails.certifications
                                                    }
                                                />

                                                <DetailField
                                                    label="Years in Business"
                                                    value={
                                                        projectDetails.yearsInBusiness
                                                    }
                                                />

                                                <DetailField
                                                    label="Business Hours"
                                                    value={
                                                        projectDetails.businessHours
                                                    }
                                                />
                                            </List>
                                        </CardContent>
                                    </Card>
                                </Grid2>
                            </Grid2>
                        </AccordionDetails>
                    </Accordion>
                </Grid2>

                {/* Brand & Marketing */}
                <Grid2
                    size={{
                        xs: 12,
                    }}
                >
                    <Accordion defaultExpanded>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            sx={{ bgcolor: 'background.paper' }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <StyleIcon color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6">
                                    Brand & Marketing
                                </Typography>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid2 container spacing={3}>
                                <Grid2
                                    size={{
                                        xs: 12,
                                        md: 6,
                                    }}
                                >
                                    <Card
                                        variant="outlined"
                                        sx={{ height: '100%' }}
                                    >
                                        <CardContent>
                                            <List disablePadding>
                                                <DetailField
                                                    label="Mission and Values"
                                                    value={
                                                        projectDetails.missionAndValues
                                                    }
                                                />

                                                <DetailField
                                                    label="Elevator Pitch"
                                                    value={
                                                        projectDetails.elevatorPitch
                                                    }
                                                />

                                                <DetailField
                                                    label="Unique Selling Proposition"
                                                    value={projectDetails.usp}
                                                />
                                            </List>
                                        </CardContent>
                                    </Card>
                                </Grid2>

                                <Grid2
                                    size={{
                                        xs: 12,
                                        md: 6,
                                    }}
                                >
                                    <Card
                                        variant="outlined"
                                        sx={{ height: '100%' }}
                                    >
                                        <CardContent>
                                            <List disablePadding>
                                                <DetailField
                                                    label="Company Tagline"
                                                    value={
                                                        projectDetails.companyTagline
                                                    }
                                                />

                                                <DetailField
                                                    label="Company History"
                                                    value={
                                                        projectDetails.companyHistory
                                                    }
                                                />

                                                <DetailField
                                                    label="Current Website URL"
                                                    value={
                                                        projectDetails.currentWebsiteUrl
                                                    }
                                                />
                                            </List>
                                        </CardContent>
                                    </Card>
                                </Grid2>
                            </Grid2>
                        </AccordionDetails>
                    </Accordion>
                </Grid2>

                {/* Project Timeline */}
                <Grid2
                    size={{
                        xs: 12,
                    }}
                >
                    <Accordion defaultExpanded>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            sx={{ bgcolor: 'background.paper' }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <AccessTimeIcon
                                    color="primary"
                                    sx={{ mr: 1 }}
                                />
                                <Typography variant="h6">
                                    Project Timeline
                                </Typography>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid2 container spacing={3}>
                                <Grid2
                                    size={{
                                        xs: 12,
                                        md: 6,
                                    }}
                                >
                                    <Card
                                        variant="outlined"
                                        sx={{ height: '100%' }}
                                    >
                                        <CardContent>
                                            <List disablePadding>
                                                <DetailField
                                                    label="Onboarding Date"
                                                    value={projectDetails.onboardingDate?.toString()}
                                                />

                                                <DetailField
                                                    label="Project Launch Date"
                                                    value={projectDetails.projectLaunchDate?.toString()}
                                                />

                                                <DetailField
                                                    label="Milestone Deadlines"
                                                    value={projectDetails.milestoneDeadlines
                                                        ?.map(
                                                            (milestone: any) =>
                                                                milestone.name
                                                        )
                                                        .join(', ')}
                                                />
                                            </List>
                                        </CardContent>
                                    </Card>
                                </Grid2>

                                <Grid2
                                    size={{
                                        xs: 12,
                                        md: 6,
                                    }}
                                >
                                    <Card
                                        variant="outlined"
                                        sx={{ height: '100%' }}
                                    >
                                        <CardContent>
                                            <List disablePadding>
                                                <DetailField
                                                    label="Assigned Team Members"
                                                    value={projectDetails.assignedTeamMembers
                                                        ?.map(
                                                            (member: any) =>
                                                                member.name
                                                        )
                                                        .join(', ')}
                                                />

                                                <DetailField
                                                    label="Approval Process"
                                                    value={
                                                        projectDetails.approvalProcess
                                                    }
                                                />

                                                <DetailField
                                                    label="Ongoing Support Needs"
                                                    value={
                                                        projectDetails.ongoingSupportNeeds
                                                    }
                                                />
                                            </List>
                                        </CardContent>
                                    </Card>
                                </Grid2>
                            </Grid2>
                        </AccordionDetails>
                    </Accordion>
                </Grid2>
            </Grid2>
        </Paper>
    );
};

export default ProjectDetailsShow;
