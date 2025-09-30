import React, { useContext } from "react";
import { Card, CardContent, Typography, Divider, Box, Chip, Paper } from "@mui/material";
import Grid from "@mui/material/GridLegacy";
import { FormContext } from "../../providers/AppContextProvider";
// Helper function to format dates
const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

const ReviewStep: React.FC = () => {
  const { awardNominationFormPayload } = useContext(FormContext);

  const renderSection = (title: string, content: React.ReactNode) => (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        {title}
      </Typography>
      <Divider sx={{ mb: 2 }} />
      {content}
    </Box>
  );

  const renderField = (label: string, value: any) => {
    if (value === null || value === undefined || value === "") {
      return null;
    }
    return (
      <Box sx={{ mb: 1.5 }}>
        <Typography variant="body2" color="textSecondary" component="span">
          {label}:
        </Typography>
        <Typography variant="body1" component="span" sx={{ ml: 1, fontWeight: 500 }}>
          {value}
        </Typography>
      </Box>
    );
  };

  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Review Your Nomination
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          Please review all the information below before submitting your nomination
        </Typography>

        <Paper sx={{ p: 2, mb: 3, backgroundColor: '#e3f2fd' }}>
          <Typography variant="h6" gutterBottom>
            Award Type
          </Typography>
          <Chip 
            label={awardNominationFormPayload.award_type || 'Not Selected'} 
            color="primary" 
            sx={{ fontSize: '1.1rem', py: 2, px: 1 }}
          />
        </Paper>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            {renderSection("Nominee Information", (
              <>
                {renderField("Name", awardNominationFormPayload.nominee_name)}
                {renderField("Email", awardNominationFormPayload.email)}
                {renderField("Phone", awardNominationFormPayload.daytime_phone)}
                {renderField("Address", awardNominationFormPayload.address)}
                {renderField("City", awardNominationFormPayload.city)}
                {renderField("State", awardNominationFormPayload.state)}
                {renderField("ZIP", awardNominationFormPayload.zip)}
                {renderField("County", awardNominationFormPayload.county)}
                {renderField("Award Year", awardNominationFormPayload.award_year)}
              </>
            ))}
          </Grid>

          <Grid item xs={12} md={6}>
            {renderSection("System Information", (
              <>
                {renderField("System Name", awardNominationFormPayload.system_name)}
                {renderField("Water System ID", awardNominationFormPayload.watersystem)}
                {renderField("Operation Start Date", awardNominationFormPayload.operation_start_date)}
                {renderField("Employment Date", awardNominationFormPayload.employment_date)}
                {renderField("Current Members", awardNominationFormPayload.current_members)}
                {renderField("Beginning Members", awardNominationFormPayload.beginning_members)}
              </>
            ))}
          </Grid>

          <Grid item xs={12}>
            {renderSection("Employee Counts", (
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      {awardNominationFormPayload.clerical_employees || 0}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Clerical Employees
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      {awardNominationFormPayload.operation_maintenance_employees || 0}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      O&M Employees
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      {awardNominationFormPayload.management_employees || 0}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Management
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            ))}
          </Grid>

          <Grid item xs={12}>
            {renderSection("Nomination Description", (
              <Paper sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                  {awardNominationFormPayload.nomination_description || 'No description provided'}
                </Typography>
              </Paper>
            ))}
          </Grid>

          <Grid item xs={12}>
            {renderSection("Supporting Documents", (
              <Box>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Supporting Documents: {awardNominationFormPayload.supporting_documents?.length || 0} file(s)
                </Typography>
                {awardNominationFormPayload.supporting_documents?.map((file, index) => (
                  <Chip key={index} label={file.title} size="small" sx={{ mr: 1, mb: 1 }} />
                ))}
                <Typography variant="body1" sx={{ mt: 2 }}>
                  Nomination PDF: {awardNominationFormPayload.nomination_pdf ? 
                    <Chip label={awardNominationFormPayload.nomination_pdf.title} size="small" /> : 
                    'Not uploaded'}
                </Typography>
              </Box>
            ))}
          </Grid>
        </Grid>

        <Paper sx={{ p: 2, mt: 3, backgroundColor: '#fff3e0' }}>
          <Typography variant="subtitle1" gutterBottom>
            Important Notes:
          </Typography>
          <Typography variant="body2" component="ul" sx={{ pl: 2 }}>
            <li>Please ensure all information is accurate before submitting</li>
            <li>Once submitted, you will receive a confirmation email</li>
            <li>The review committee will evaluate all nominations</li>
            <li>Winners will be announced at the annual conference</li>
          </Typography>
        </Paper>
      </CardContent>
    </Card>
  );
};

export default ReviewStep;
