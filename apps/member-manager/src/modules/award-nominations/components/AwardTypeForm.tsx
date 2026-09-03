import React from "react";
import {
  BooleanInput,
  SimpleForm,
  TextInput,
  required,
  useRecordContext,
} from "react-admin";
import { Box, Grid } from "@mui/material";
import {
  fullFieldSx,
  ReviewPageBar,
  ReviewSectionCard,
  ReviewToolbar,
  reviewFormSx,
} from "../../_components/review-packet";
import type { AwardTypeRecord } from "../helpers/awardTypes";

const SETTINGS_BACK = "/orwa-awards/dashboard";

/**
 * Award-type create/edit. Fields match Strapi `award-type`: name, description,
 * nominatable. Order is drag-controlled on Settings — not shown here.
 */
const AwardTypeForm = () => {
  const record = useRecordContext<AwardTypeRecord>();

  return (
    <SimpleForm
      sx={reviewFormSx}
      defaultValues={{ nominatable: true }}
      toolbar={<ReviewToolbar redirect={SETTINGS_BACK} />}
    >
      <ReviewPageBar
        title={record?.name ? `Award Type · ${record.name}` : "Add Award Type"}
        backTo={SETTINGS_BACK}
      />
      <Box sx={{ width: 1, px: { xs: 1, sm: 2 }, pb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <ReviewSectionCard title="Award Type">
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextInput
                    source="name"
                    label="Name"
                    helperText="e.g. Man of the Year, Excellence in Operations, 5 Years of Service"
                    validate={required()}
                    fullWidth
                    sx={fullFieldSx}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextInput
                    source="description"
                    label="Description"
                    multiline
                    minRows={3}
                    fullWidth
                    sx={fullFieldSx}
                  />
                </Grid>
                <Grid item xs={12}>
                  <BooleanInput
                    source="nominatable"
                    label="Nominatable (show on the public form)"
                  />
                </Grid>
              </Grid>
            </ReviewSectionCard>
          </Grid>
        </Grid>
      </Box>
    </SimpleForm>
  );
};

export default AwardTypeForm;
