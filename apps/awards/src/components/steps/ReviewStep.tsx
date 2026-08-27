import React from "react";
import { Card, CardContent, Typography, Divider, Box, Chip, Paper } from "@mui/material";
import Grid from "@mui/material/GridLegacy";
import { useFormContext } from "react-hook-form";
import { IAwardNominationPayload } from "../../types/types";
import { isSystemOfTheYearAward } from "../../helpers/awardType";
import ReviewMetricTile from "../_components/ReviewMetricTile";

const DOCUMENT_ID_SHAPE = /^[a-z0-9]{16,64}$/;

const humanSystemName = (payload: IAwardNominationPayload) => {
  const picker = String(payload.system_name || "").trim();
  if (picker && !DOCUMENT_ID_SHAPE.test(picker)) return picker;
  const printed = String(payload.award_name_printed || "").trim();
  if (printed && !DOCUMENT_ID_SHAPE.test(printed)) return printed;
  return picker || "System";
};
// Helper function to format dates
const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

const ReviewStep: React.FC = () => {
  const { watch } = useFormContext<IAwardNominationPayload>();
  const awardNominationFormPayload = watch();
  const showEmployeeCounts = isSystemOfTheYearAward(
    awardNominationFormPayload.award_type
  );

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
                {renderField(
                  "Name as printed on award",
                  awardNominationFormPayload.award_name_printed
                )}
                {renderField("Email", awardNominationFormPayload.email)}
                {renderField("Phone", awardNominationFormPayload.daytime_phone)}
                {renderField("Address", awardNominationFormPayload.address)}
                {renderField("City", awardNominationFormPayload.city)}
                {renderField("State", awardNominationFormPayload.state)}
                {renderField("ZIP", awardNominationFormPayload.zip)}
              </>
            ))}
          </Grid>

          <Grid item xs={12} md={6}>
            {renderSection("Nominator Information", (
              <>
                {renderField(
                  "Name",
                  [awardNominationFormPayload.nominator_first_name, awardNominationFormPayload.nominator_last_name]
                    .filter(Boolean)
                    .join(" ")
                )}
                {renderField("Email", awardNominationFormPayload.nominator_email)}
                {renderField("Phone", awardNominationFormPayload.nominator_phone)}
                {renderField("Mailing Address", awardNominationFormPayload.nominator_address)}
                {renderField("Address Line 2", awardNominationFormPayload.nominator_address_2)}
                {renderField("City", awardNominationFormPayload.nominator_city)}
                {renderField("State", awardNominationFormPayload.nominator_state)}
                {renderField("ZIP", awardNominationFormPayload.nominator_zip)}
                {renderField("Country", awardNominationFormPayload.nominator_country)}
              </>
            ))}
          </Grid>

          <Grid item xs={12}>
            {renderSection(humanSystemName(awardNominationFormPayload), (
              <>
                {renderField("Date System Began Operation", awardNominationFormPayload.operation_start_date)}
                {renderField("Date Employed", awardNominationFormPayload.employment_date)}
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 2,
                    mt: 0.5,
                  }}
                >
                  <Box sx={{ flex: "1 1 160px", minWidth: 140, maxWidth: 240 }}>
                    <ReviewMetricTile
                      value={awardNominationFormPayload.beginning_members}
                      label="Beginning Meter Connections"
                    />
                  </Box>
                  <Box sx={{ flex: "1 1 160px", minWidth: 140, maxWidth: 240 }}>
                    <ReviewMetricTile
                      value={awardNominationFormPayload.current_members}
                      label="Current Meter Connections"
                    />
                  </Box>
                  {showEmployeeCounts && (
                    <>
                      <Box sx={{ flex: "1 1 160px", minWidth: 140, maxWidth: 240 }}>
                        <ReviewMetricTile
                          value={awardNominationFormPayload.clerical_employees}
                          label="Clerical Employees"
                        />
                      </Box>
                      <Box sx={{ flex: "1 1 160px", minWidth: 140, maxWidth: 240 }}>
                        <ReviewMetricTile
                          value={awardNominationFormPayload.operation_maintenance_employees}
                          label="O&M Employees"
                        />
                      </Box>
                      <Box sx={{ flex: "1 1 160px", minWidth: 140, maxWidth: 240 }}>
                        <ReviewMetricTile
                          value={awardNominationFormPayload.management_employees}
                          label="Management"
                        />
                      </Box>
                    </>
                  )}
                </Box>
              </>
            ))}
          </Grid>

          <Grid item xs={12}>
            {renderSection("What made the nominee deserving of this award", (
              <Paper sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                  {awardNominationFormPayload.justification ||
                    awardNominationFormPayload.nomination_description ||
                    'No description provided'}
                </Typography>
              </Paper>
            ))}
          </Grid>

          <Grid item xs={12}>
            {renderSection("Biography", (
              <Box>
                {renderField("Method", awardNominationFormPayload.biography_method)}
                {awardNominationFormPayload.biography_method ===
                  "Copy/Paste or Type Biography" && (
                  <Paper sx={{ p: 2, backgroundColor: "#f5f5f5", mt: 1 }}>
                    <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                      {awardNominationFormPayload.biography_text || "—"}
                    </Typography>
                  </Paper>
                )}
                {awardNominationFormPayload.biography_method ===
                  "Upload Biography" && (
                  <Typography variant="body1">
                    Biography file:{" "}
                    {Array.isArray(awardNominationFormPayload.biography_file)
                      ? awardNominationFormPayload.biography_file[0]?.title ||
                        "Uploaded"
                      : awardNominationFormPayload.biography_file
                        ? "Uploaded"
                        : "Not uploaded"}
                  </Typography>
                )}
              </Box>
            ))}
          </Grid>

          <Grid item xs={12}>
            {renderSection("Photographs", (
              <Box>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Photographs: {awardNominationFormPayload.photographs?.length || 0}{" "}
                  file(s)
                </Typography>
                {awardNominationFormPayload.photographs?.map((file, index) => (
                  <Chip
                    key={index}
                    label={file.title}
                    size="small"
                    sx={{ mr: 1, mb: 1 }}
                  />
                ))}
              </Box>
            ))}
          </Grid>

        </Grid>

        <Paper sx={{ p: 2, mt: 3, backgroundColor: '#fff3e0', textAlign: 'left', overflow: 'visible' }}>
          <Typography variant="subtitle1" gutterBottom>
            Important Notes:
          </Typography>
          <Box
            component="ol"
            sx={{
              m: 0,
              pl: 3.25,
              listStyleType: 'decimal',
              listStylePosition: 'outside',
              '& > li': {
                display: 'list-item',
                listStyleType: 'decimal',
                listStylePosition: 'outside',
                mb: 0.75,
                pl: 0.25,
                '&:last-child': { mb: 0 },
              },
            }}
          >
            <li>Please ensure all information is accurate before submitting</li>
            <li>Once submitted, you will receive a confirmation email</li>
            <li>The awards committee will evaluate all nominations and select the award recipients</li>
            <li>Winners will be announced at the annual conference in November</li>
            <li>Nominator will be the only person notified for any winner or non-winner</li>
          </Box>
        </Paper>
      </CardContent>
    </Card>
  );
};

export default ReviewStep;
