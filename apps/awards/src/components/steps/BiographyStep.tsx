import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import Grid from "@mui/material/GridLegacy";
import { useFormContext } from "react-hook-form";
import { RadioGroupInput } from "../_components/RadioGroupInput";
import { TextAreaInput } from "../_components/TextAreaInput";
import FileInput from "../_components/FileInput";

const biographyMethodOptions = [
  {
    value: "Copy/Paste or Type Biography",
    label: "Copy/Paste or Type Biography",
  },
  { value: "Upload Biography", label: "Upload Biography" },
];

const DOCUMENT_ACCEPT = [".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx"];

const BiographyStep: React.FC = () => {
  const { watch } = useFormContext();
  const method = watch("biography_method");

  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Biography
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <RadioGroupInput
              name="biography_method"
              label="How would you like to provide your biography?"
              options={biographyMethodOptions}
              required
            />
          </Grid>

          {method === "Copy/Paste or Type Biography" && (
            <Grid item xs={12}>
              <TextAreaInput
                label="Biography"
                name="biography_text"
                rows={10}
                required
              />
            </Grid>
          )}

          {method === "Upload Biography" && (
            <Grid item xs={12}>
              <FileInput
                label="Biography"
                name="biography_file"
                required
                multiple={false}
                maxSizeMB={10}
                acceptedTypes={DOCUMENT_ACCEPT}
                helperText="PDF, JPG, PNG, DOC, or DOCX. Max 10MB."
              />
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default BiographyStep;
