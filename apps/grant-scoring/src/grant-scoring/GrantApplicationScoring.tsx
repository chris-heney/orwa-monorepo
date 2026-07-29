import { Box, Button, Divider, Grid, Typography } from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import ScoringComponent from '../grant-scoring/ScoringComponent';
import ApplicationInformation from '../grant-scoring/ApplicationInformation';
import { useGetApplications } from '../helpers/API';
import { useContext, useEffect } from 'react';
import { ApplicationScoringContext } from '../grant-scoring/AppContextProvider';
import { Margin, Resolution, usePDF } from 'react-to-pdf';
import DownloadIcon from '@mui/icons-material/Download';

const GrantApplicationScoring = () => {
  const getApplications = useGetApplications();

  const {
    token,
    applications,
    applicationIndex,
    setApplicationIndex,
    setApplications,
    status
  } = useContext(ApplicationScoringContext);

  if (applications.length === 0) return <Box>No Applications in Queue</Box>;
  if (!ApplicationScoringContext) return <Box>Missing Context</Box>;

  const { toPDF, targetRef } = usePDF({
    filename: `${applications[applicationIndex].legal_entity_name}-Grant-Application.pdf`,
    page: {
      margin: Margin.MEDIUM,
      format: "letter",
    },
    resolution: Resolution.HIGH,
    method: "save",
    overrides: {
      pdf: {
        compress: true,
      }
    }
  });

  useEffect(() => {
    getApplications(status).then(apps => {
      if (!apps) return;
      setApplications(apps);
    });
  }, []);

  const handleDownload = () => {
    const applicantPdf = applications[applicationIndex]?.applicant_pdf;
    if (applicantPdf) {
      const fullUrl = `${import.meta.env.VITE_API_ENDPOINT.replace('/api', '')}${applicantPdf.url}`;
      window.open(fullUrl, '_blank');
    } else {
      toPDF();
    }
  };

  const nextApplication = () => {
    if (applications[applicationIndex + 1]) {
      setApplicationIndex(applicationIndex + 1);
    }
  };

  const previousApplication = () => {
    if (applications?.[applicationIndex - 1]) {
      setApplicationIndex(applicationIndex - 1);
    }
  };

  return applications.length === 0 ? (
    <Box>
      <Typography variant='h5'>No Applications</Typography>
    </Box>
  ) : (
    <Box>
      <Box className="flex items-center justify-between mt-4">
        <Button
          size="large"
          onClick={previousApplication}
          className="white"
          variant="contained"
          disabled={applicationIndex === 0}
        >
          <KeyboardArrowLeftIcon />
        </Button>

        {token.name === 'Committee' &&
          <Button
            variant="contained" onClick={handleDownload}>Download PDF <DownloadIcon sx={{ ml: 1 }} fontSize='small' />
          </Button>
        }

        <Button
          size="large"
          onClick={nextApplication}
          className="white"
          variant="contained"
          disabled={applicationIndex === applications.length - 1}
        >
          <KeyboardArrowRightIcon />
        </Button>
      </Box>
      <Divider sx={{ mb: 3, mt: 1 }} />

      <Box ref={targetRef}>
        <Typography variant='h5' textAlign={'center'} mb={3}>
        #{applications[applicationIndex]?.application_id} - {applications[applicationIndex]?.legal_entity_name} - {new Date(applications[applicationIndex]?.application_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric'})}
        </Typography>
        <Divider sx={{
          mb: 4,
        }} />
        {applications[applicationIndex] && (

          <Grid container spacing={2}>
            {/* Left side: Application Information */}
            <Grid item xs={12} md={6}>
              <ApplicationInformation />
            </Grid>

            {/* Right side: Scoring Card */}
            <Grid item xs={12} md={6}>
              <ScoringComponent />
            </Grid>
          </Grid>
        )}
      </Box>
    </Box>
  );
}

export default GrantApplicationScoring;