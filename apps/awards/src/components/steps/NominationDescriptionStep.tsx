import React from "react";
import { Card, CardContent, Typography, Paper } from "@mui/material";
import { TextAreaInput } from "../_components/TextAreaInput";
import { useFormContext } from "react-hook-form";

const NominationDescriptionStep: React.FC = () => {
  const { watch } = useFormContext();

  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Nomination Description
        </Typography>

        <Paper sx={{ p: 2, mb: 3, backgroundColor: "#f5f5f5" }}>
          <Typography variant="body2" color="textSecondary">
            What makes this nominee deserving of this award.
          </Typography>
        </Paper>

        <TextAreaInput
          label="What makes the nominee deserving of this award?"
          name="nomination_description"
          rows={12}
          required
          helperText={`Please provide as much information in 300 words or less. Be specific! (${(watch("nomination_description") || "").length} characters)`}
        />
      </CardContent>
    </Card>
  );
};

export default NominationDescriptionStep;
