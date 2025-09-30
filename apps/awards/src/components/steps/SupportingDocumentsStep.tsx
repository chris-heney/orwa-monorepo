import React, { useContext } from "react";
import { Card, CardContent, Typography, Paper, Box } from "@mui/material";
import Grid from "@mui/material/GridLegacy";
import FileInput from "../_components/FileInput";
import { StrapiFormattedFile } from "../../types/types";
import { FormContext } from "../../providers/AppContextProvider";

const SupportingDocumentsStep: React.FC = () => {
  const { awardNominationFormPayload, setAwardNominationFormPayload } = useContext(FormContext);

  const handleFileChange = (name: string, files: StrapiFormattedFile[] | StrapiFormattedFile | null) => {
    setAwardNominationFormPayload((prev) => ({
      ...prev,
      [name]: files,
    }));
  };

  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Supporting Documents
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          Upload any documents that support this nomination
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
              <Typography variant="subtitle1" gutterBottom>
                Document Guidelines
              </Typography>
              <Typography variant="body2" component="ul" sx={{ pl: 2 }}>
                <li>Supporting documents can include photos, letters of recommendation, news articles, certificates, etc.</li>
                <li>Files should be in PDF, JPG, PNG, or DOC format</li>
                <li>Maximum file size: 10MB per file</li>
                <li>You can upload multiple supporting documents</li>
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Supporting Documents
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Upload photos, letters, articles, or other documents that support this nomination
              </Typography>
              <FileInput
                label="Supporting Documents"
                name="supporting_documents"
                multiple={true}
                helperText="You can select multiple files at once"
              />
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Complete Nomination PDF (Optional)
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                If you have already prepared a complete nomination package as a PDF, you can upload it here
              </Typography>
              <FileInput
                label="Nomination PDF"
                name="nomination_pdf"
                multiple={false}
                helperText="Upload a single PDF file containing the complete nomination"
              />
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Paper sx={{ p: 2, backgroundColor: '#e3f2fd' }}>
              <Typography variant="subtitle2" gutterBottom>
                Uploaded Files Summary
              </Typography>
              <Typography variant="body2">
                Supporting Documents: {awardNominationFormPayload.supporting_documents?.length || 0} file(s)
              </Typography>
              <Typography variant="body2">
                Nomination PDF: {awardNominationFormPayload.nomination_pdf ? '1 file' : 'Not uploaded'}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default SupportingDocumentsStep;
