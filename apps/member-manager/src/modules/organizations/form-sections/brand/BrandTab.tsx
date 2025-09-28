import React from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Paper, 
  Divider,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tab,
  Tabs
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { 
  TextInput, 
  BooleanInput, 
  useRecordContext
} from 'react-admin';
// import ColorPickerInput from '../inputs/ColorPickerInput';
// import TagArrayInput from '../inputs/TagArrayInput';
import FileUploadField from '../../../../_components/FileUploadField';

const StepBranding: React.FC = () => {
  const record = useRecordContext();
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
          Brand Identity & Guidelines
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          Define your brand&apos;s visual identity and guidelines
        </Typography>
      </Box>

      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Brand Overview" />
          <Tab label="Logo & Colors" />
          <Tab label="Typography" />
          <Tab label="Voice & Tone" />
          <Tab label="Additional Guidelines" />
        </Tabs>

        {/* Brand Overview Tab */}
        {tabValue === 0 && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextInput 
                  source="organizationBrand.brandName" 
                  label="Brand Name" 
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextInput 
                  source="organizationBrand.tagline" 
                  label="Brand Tagline" 
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextInput
                  source="organizationBrand.mission"
                  label="Mission Statement"
                  multiline
                  rows={3}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextInput
                  source="organizationBrand.vision"
                  label="Vision Statement"
                  multiline
                  rows={3}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextInput
                  source="organizationBrand.brandStyleDescription"
                  label="Brand Style Description"
                  multiline
                  rows={3}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <BooleanInput
                  source="organizationBrand.hasBrandStyleGuide"
                  label="I have an existing brand style guide"
                />
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Logo & Colors Tab */}
        {tabValue === 1 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>Logo</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{ p: 2 }}>
                  <FileUploadField
                    source="primaryLogoId"
                    label="Primary Logo"
                    accept="image/*"
                    fullWidth
                    folderPath={`${
                        record?.name
                            ? record?.name?.replace(/ /g, '') +
                              '/logos'
                            : '/logos'
                    }`}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ p: 2 }}>
                  <FileUploadField
                    source="secondaryLogoId"
                    label="Secondary Logo / Icon"
                    accept="image/*"
                    fullWidth
                    folderPath={`${
                        record?.name
                            ? record?.name?.replace(/ /g, '') +
                              '/logos'
                            : '/logos'
                    }`}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextInput
                  source="organizationBrand.primaryLogoUsage"
                  label="Primary Logo Usage Guidelines"
                  multiline
                  rows={3}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextInput
                  source="organizationBrand.secondaryLogoUsage"
                  label="Secondary Logo Usage Guidelines"
                  multiline
                  rows={3}
                  fullWidth
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h6" sx={{ mb: 3 }}>Color Palette</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                {/* <ReactAdminColorPicker
                  source="organizationBrand.primaryColors"
                  label="Primary Brand Colors"
                  helperText="Add your main brand colors (up to 3)"
                  multiple
                  maxColors={3}
                /> */}
              </Grid>
              <Grid item xs={12}>
                {/* <ReactAdminColorPicker
                  source="organizationBrand.secondaryColors"
                  label="Secondary Brand Colors"
                  helperText="Add your secondary or accent colors (up to 5)"
                  multiple
                  maxColors={5}
                /> */}
              </Grid>
              <Grid item xs={12}>
                <TextInput
                  source="organizationBrand.colorUsageGuidelines"
                  label="Color Usage Guidelines"
                  multiline
                  rows={3}
                  fullWidth
                />
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Typography Tab */}
        {tabValue === 2 && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextInput 
                  source="organizationBrand.primaryFontName" 
                  label="Primary Font" 
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextInput 
                  source="organizationBrand.secondaryFontName" 
                  label="Secondary Font" 
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextInput
                  source="organizationBrand.primaryFontUsage"
                  label="Primary Font Usage"
                  multiline
                  rows={3}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextInput
                  source="organizationBrand.secondaryFontUsage"
                  label="Secondary Font Usage"
                  multiline
                  rows={3}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextInput
                  source="organizationBrand.typographyGuidelines"
                  label="Typography Guidelines"
                  multiline
                  rows={3}
                  fullWidth
                />
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Voice & Tone Tab */}
        {tabValue === 3 && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextInput
                  source="organizationBrand.brandVoice"
                  label="Brand Voice"
                  multiline
                  rows={3}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextInput
                  source="organizationBrand.marketingTone"
                  label="Marketing Tone"
                  multiline
                  rows={3}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextInput
                  source="organizationBrand.customerServiceTone"
                  label="Customer Service Tone"
                  multiline
                  rows={3}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextInput
                  source="organizationBrand.wordUsageGuidelines"
                  label="Word Usage Guidelines"
                  multiline
                  rows={3}
                  fullWidth
                />
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Additional Guidelines Tab */}
        {tabValue === 4 && (
          <Box sx={{ p: 3 }}>
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">Imagery Guidelines</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextInput
                      source="organizationBrand.photographyStyle"
                      label="Photography Style"
                      multiline
                      rows={3}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextInput
                      source="organizationBrand.stockImageUsage"
                      label="Stock Image Usage"
                      multiline
                      rows={3}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">Social Media Guidelines</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextInput
                      source="organizationBrand.socialPostStyle"
                      label="Social Post Style"
                      multiline
                      rows={3}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    {/* <ReactAdminTagArray
                      source="organizationBrand.socialHashtags"
                      label="Brand Hashtags"
                      placeholder="Add a hashtag (without #)"
                      prefix="#"
                    /> */}
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">Additional Notes</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TextInput
                  source="organizationBrand.brandingNotes"
                  label="Additional Branding Notes"
                  multiline
                  rows={5}
                  fullWidth
                />
              </AccordionDetails>
            </Accordion>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default StepBranding;