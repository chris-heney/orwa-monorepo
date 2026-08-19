import React from "react";
import { Card, CardContent, Typography, Paper, Box } from "@mui/material";
import Grid from "@mui/material/GridLegacy";
import FileInput from "../_components/FileInput";
import { useFormContext } from "react-hook-form";

const DOCUMENT_ACCEPT = [".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx"];

const SupportingDocumentsStep: React.FC = () => {
  const { watch } = useFormContext();
  const supportingDocuments = watch("supporting_documents") || [];

  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Supporting Documents
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          Upload any additional documents that support this nomination
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2, backgroundColor: "#f5f5f5" }}>
              <Typography variant="subtitle1" gutterBottom>
                Document Guidelines
              </Typography>
              <Typography variant="body2" component="ul" sx={{ pl: 2 }}>
                <li>
                  Supporting documents can include letters of recommendation,
                  news articles, certificates, etc.
                </li>
                <li>Files should be in PDF, JPG, PNG, DOC, or DOCX format</li>
                <li>Maximum file size: 10MB per file</li>
                <li>You can upload multiple supporting documents</li>
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ mb: 3 }}>
              <FileInput
                label="Supporting Documents"
                name="supporting_documents"
                multiple
                maxSizeMB={10}
                acceptedTypes={DOCUMENT_ACCEPT}
                helperText="PDF, JPG, PNG, DOC, or DOCX. You can select multiple files."
              />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 2, backgroundColor: "#e3f2fd" }}>
              <Typography variant="subtitle2" gutterBottom>
                Uploaded Files Summary
              </Typography>
              <Typography variant="body2">
                Supporting Documents:{" "}
                {Array.isArray(supportingDocuments)
                  ? supportingDocuments.length
                  : 0}{" "}
                file(s)
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default SupportingDocumentsStep;
