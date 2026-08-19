import React from "react";
import { Card, CardContent, Typography, Paper } from "@mui/material";
import { TextAreaInput } from "../_components/TextAreaInput";
import { useFormContext } from "react-hook-form";

const JustificationStep: React.FC = () => {
  const { watch, register } = useFormContext();

  const { ref, ...rest } = register("justification");

  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          What makes the nominee deserving of this award?
        </Typography>

        <TextAreaInput
          label=""
          rows={12}
          required
          helperText={`Please provide as much information in 300 words or less. Be specific! (${(watch("justification") || "").length} characters)`}
          {...rest}
        />
      </CardContent>
    </Card>
  );
};

export default JustificationStep;
