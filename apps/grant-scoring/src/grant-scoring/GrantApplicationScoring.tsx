import { Box, Button, Divider, Grid, Typography } from '@mui/material'
import ScoringComponent from './ScoringComponent'
import ApplicationInformation from './ApplicationInformation'
import { useContext } from 'react'
import { DirectoryContext, useScoringCriterias } from './helpers/AppContextProvider'
import DownloadIcon from '@mui/icons-material/Download'
import { YearMonthDayMinute } from './types'
import { generatePDF } from '../helpers/generateScoringPacket'

const GrantApplicationScoring = () => {

  const { applications, applicationIndex, score } = useContext(DirectoryContext)
  const {scoringCriterias} = useScoringCriterias();


  if (applications.length === 0) return <Box>Missing Applications</Box>


  const getApprovedCriterias = (selectedProjects: string[]) => {
    return scoringCriterias
      .filter((criteria) => {
        return (
          criteria.project_type.data &&  selectedProjects.includes(
            criteria.project_type.data.id.toString()
          )
        );
      })
      .map((criteria) => {
        return [criteria.order, criteria.label, criteria.score];
      });
  }

  const handleGeneratePDF = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    console.log("Generating PDF...");
    try {
      const pdfBytes = await generatePDF(
        applications[applicationIndex], 
        getApprovedCriterias(applications[applicationIndex].approved_projects.data.map((project) => project.id.toString()))
      )
    
      const generatedFile = new File([pdfBytes], `${applications[applicationIndex].legal_entity_name}.pdf`, {
        type: "application/pdf",
      });

      const url = URL.createObjectURL(generatedFile);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${applications[applicationIndex].legal_entity_name}-Ranking-Packet-${new Date().toLocaleDateString("en-US", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
      })}.pdf`;
      a.click();
      URL.revokeObjectURL(url);

      // Download the PDF
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return applications.length === 0 ? (
    <Box>
      <Typography variant='h5'>No Applications</Typography>
    </Box>
  ) : (
    <Box>
      <Box className="flex justify-center">
       
          <Button
            variant="contained" onClick={(e) => handleGeneratePDF(e)}>Download Ranking Packet<DownloadIcon sx={{ ml: 1 }} fontSize='small' />
          </Button>

        {/* <ManualUploadTest/> */}
      </Box>
      <Divider sx={{ mb: 3, mt: 1 }} />

      <Box>
        <Box display={'flex'} flexDirection={'column'}>
        <Typography variant='h5' textAlign={'center'} mb={1}>
          #{applications[applicationIndex]?.application_id} - {applications[applicationIndex]?.legal_entity_name} - {applications[applicationIndex]?.application_date?.toLocaleString('en-US', YearMonthDayMinute)}
        </Typography>
        {/* committee date */}
        {applications[applicationIndex]?.committee_date && <Typography variant='h6' textAlign={'center'} mb={1}>
        Committee Date: {applications[applicationIndex]?.committee_date.toLocaleString('en-US', YearMonthDayMinute)}
        </Typography>}
        {/* Score */}
        {score.score && <Typography variant='h6' textAlign={'center'} mb={3}>
          Score: {score.score}
        </Typography>}
        </Box>
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
  )
}

export default GrantApplicationScoring
