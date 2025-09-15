import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  Typography,
  Tooltip,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { TextInput, required } from "react-admin";
import React from "react";

interface RecipientDetailsProps {
  onFieldFocus: (field: string, e: React.FocusEvent<HTMLInputElement>) => void;
  onInsertFieldClick: (field: string) => void;
  inputRefs: React.MutableRefObject<{ [key: string]: HTMLInputElement | null }>;
}

const RecipientDetails = ({ 
  onFieldFocus, 
  onInsertFieldClick, 
  inputRefs 
}: RecipientDetailsProps) => {
  // Group fields into rows
  const fieldRows = [
    ["to", "cc"], // First row
    ["bcc", "subject"], // Second row
    ["from_email", "from_name"] // Third row
  ];
  
  return (
    <Accordion
      disableGutters
      square
      sx={{
        boxShadow: "none",
        borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="recipient-details-content"
        id="recipient-details-header"
      >
        <Typography variant="subtitle1" fontWeight="medium">Recipient Details</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          {fieldRows.map((row, rowIndex) => (
            <React.Fragment key={`row-${rowIndex}`}>
              {row.map((field) => (
                <Grid item xs={12} md={6} key={field} sx={{ display: 'flex', alignItems: 'center' }}>
                  <Grid container spacing={1} alignItems="center">
                    <Grid item xs={11}>
                      <TextInput
                        source={field}
                        fullWidth
                        label={field.charAt(0).toUpperCase() + field.slice(1).replace('_', ' ')}
                        inputRef={(el) => (inputRefs.current[field] = el)}
                        onFocus={(e) => onFieldFocus(field, e as any)}
                        onClick={(e) => onFieldFocus(field, e as any)}
                        validate={["to", "from_email", "from_name", "subject"].includes(field) ? required(`${field} is required`) : undefined}
                      />
                    </Grid>
                    <Grid item xs={1}>
                      <Tooltip title={`Insert template field into ${field}`}>
                        <IconButton
                          onClick={() => onInsertFieldClick(field)}
                          size="small"
                        >
                          <AddCircleOutlineIcon />
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </Grid>
              ))}
            </React.Fragment>
          ))}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default RecipientDetails; 