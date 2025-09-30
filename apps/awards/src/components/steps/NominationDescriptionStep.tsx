import React from "react";
import { Card, CardContent, Typography, Paper } from "@mui/material";
import { TextAreaInput } from "../_components/TextAreaInput";
import { useFormContext } from "react-hook-form";

const NominationDescriptionStep: React.FC = () => {
  const { watch } = useFormContext();

  const getPromptText = () => {
    const awardType = watch("award_type");
    switch (awardType) {
      case 'Water/Wastewater System of the Year':
        return 'Please describe why this water/wastewater system deserves recognition. Include specific achievements, contributions to water quality, safety records, innovative solutions, and community service.';
      case 'Excellence in Operations':
        return 'Please describe the operations\'s leadership, dedication, and contributions to the water system. Include specific initiatives, policy improvements, and community engagement efforts.';
      case 'Excellence in Management':
        return 'Please describe what makes this rural water system exceptional. Include improvements in service delivery, infrastructure upgrades, customer satisfaction, and community impact.';
      case 'Excellence in Office Operations':
        return 'Please describe the wastewater system\'s achievements in treatment efficiency, environmental protection, regulatory compliance, and innovation.';
      default:
        return 'Please provide a detailed description explaining why this nominee deserves this award. Include specific achievements, contributions, and impact.';
    }
  };

  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Nomination Description
        </Typography>
        
        <Paper sx={{ p: 2, mb: 3, backgroundColor: '#f5f5f5' }}>
          <Typography variant="body2" color="textSecondary">
            {getPromptText()}
          </Typography>
        </Paper>
        
        <TextAreaInput
          label="Nomination Description"
          name="nomination_description"
          rows={12}
          required    
          helperText={`${(watch("nomination_description") || "").length} characters`}
        />
        
        <Paper sx={{ p: 2, mt: 3, backgroundColor: '#e3f2fd' }}>
          <Typography variant="subtitle2" gutterBottom>
            Tips for a Strong Nomination:
          </Typography>
          <Typography variant="body2" component="ul" sx={{ pl: 2 }}>
            <li>Be specific and provide concrete examples</li>
            <li>Include measurable achievements and outcomes</li>
            <li>Highlight unique contributions or innovations</li>
            <li>Describe the impact on the community or industry</li>
            <li>Include any awards, certifications, or recognitions</li>
            <li>Mention leadership, mentorship, or training contributions</li>
          </Typography>
        </Paper>
      </CardContent>
    </Card>
  );
};

export default NominationDescriptionStep;
