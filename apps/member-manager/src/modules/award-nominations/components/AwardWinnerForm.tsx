import React from "react";
import {
  BooleanInput,
  ImageField,
  ImageInput,
  NumberInput,
  SimpleForm,
  TextInput,
  required,
  useRecordContext,
} from "react-admin";
import { Box, Grid, Typography } from "@mui/material";
import {
  fullFieldSx,
  ReviewPageBar,
  ReviewSectionCard,
  ReviewToolbar,
  reviewFormSx,
} from "../../_components/review-packet";
import { winnerImageUrl, type AwardWinnerRecord } from "../helpers/winnerImage";

const AWARD_BACK = "/orwa-awards/dashboard";

/** Shows the image already saved, whether uploaded to Strapi or linked to orwa.org. */
const CurrentPhoto = () => {
  const record = useRecordContext<AwardWinnerRecord>();
  const url = winnerImageUrl(record, "thumbnail");
  if (!url) return null;

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="caption" color="text.secondary">
        Current photo
      </Typography>
      <Box
        component="img"
        src={url}
        alt=""
        sx={{ display: "block", mt: 0.5, maxWidth: 280, borderRadius: 1 }}
      />
    </Box>
  );
};

const WinnerTitle = () => {
  const record = useRecordContext<AwardWinnerRecord>();
  if (!record?.title) return <>Add Award Winner</>;
  return (
    <>
      {record.award_year} {record.title}
    </>
  );
};

const AwardWinnerForm = () => {
  const record = useRecordContext<AwardWinnerRecord>();

  return (
    <SimpleForm
      sx={reviewFormSx}
      defaultValues={{ is_published: true, sort_order: 0 }}
      toolbar={<ReviewToolbar redirect={AWARD_BACK} />}
    >
      <ReviewPageBar
        title={
          record?.title
            ? `${record.award_year ?? ""} ${record.title}`.trim()
            : "Add Award Winner"
        }
        backTo={AWARD_BACK}
      />
      <Box sx={{ width: 1, px: { xs: 1, sm: 2 }, pb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <ReviewSectionCard title="Award">
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <NumberInput
                    source="award_year"
                    label="Award year"
                    validate={required()}
                    fullWidth
                    sx={fullFieldSx}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextInput
                    source="title"
                    label="Award"
                    helperText="e.g. Man of the Year, Excellence in Operations, 5 Years of Service"
                    validate={required()}
                    fullWidth
                    sx={fullFieldSx}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <NumberInput
                    source="sort_order"
                    label="Order within year"
                    fullWidth
                    sx={fullFieldSx}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextInput
                    source="recipient"
                    label="Recipient"
                    helperText="e.g. Roger McCracken — Lincoln Co RW&SD #4"
                    fullWidth
                    sx={fullFieldSx}
                  />
                </Grid>
              </Grid>
            </ReviewSectionCard>
          </Grid>

          <Grid item xs={12}>
            <ReviewSectionCard title="Photo">
              <CurrentPhoto />
              <ImageInput
                source="photo"
                label=""
                accept={["image/png", "image/jpeg", "image/webp"]}
                helperText="Upload to replace the current photo."
                fullWidth
              >
                <ImageField source="src" title="title" />
              </ImageInput>
              <Grid container spacing={2} sx={{ mt: 0.5 }}>
                <Grid item xs={12} md={6}>
                  <TextInput
                    source="photo_url"
                    label="Photo URL (fallback)"
                    helperText="Used when no photo is uploaded — e.g. an orwa.org image."
                    fullWidth
                    sx={fullFieldSx}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextInput
                    source="thumbnail_url"
                    label="Thumbnail URL (fallback)"
                    fullWidth
                    sx={fullFieldSx}
                  />
                </Grid>
              </Grid>
            </ReviewSectionCard>
          </Grid>

          <Grid item xs={12}>
            <ReviewSectionCard title="Visibility">
              <BooleanInput
                source="is_published"
                label="Show on the public awards page"
              />
            </ReviewSectionCard>
          </Grid>
        </Grid>
      </Box>
    </SimpleForm>
  );
};

export default AwardWinnerForm;
