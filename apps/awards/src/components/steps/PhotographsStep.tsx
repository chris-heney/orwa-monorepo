import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import Grid from "@mui/material/GridLegacy";
import FileInput from "../_components/FileInput";

const PHOTO_ACCEPT = [".jpeg", ".jpg", ".png", ".webp"];

const PhotographsStep: React.FC = () => {
  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Photographs
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          Please provide as many high quality photographs and details for the
          awards ceremony.
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FileInput
              label="Photographs"
              name="photographs"
              required
              multiple
              maxSizeMB={10}
              acceptedTypes={PHOTO_ACCEPT}
              helperText="JPEG, JPG, PNG, or WEBP. You can select multiple files."
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default PhotographsStep;
