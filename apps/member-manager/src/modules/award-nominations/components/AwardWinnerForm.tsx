import React from "react";
import {
  AutocompleteInput,
  BooleanInput,
  ImageField,
  ImageInput,
  NumberInput,
  ReferenceInput,
  SelectInput,
  SimpleForm,
  TextInput,
  required,
  useGetList,
  useGetOne,
  useNotify,
  useRecordContext,
} from "react-admin";
import { useFormContext, useWatch } from "react-hook-form";
import { Link as RouterLink } from "react-router-dom";
import { Box, Button, Grid, Typography } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import FormHeadingBar from "./FormHeadingBar";
import {
  fullFieldSx,
  ReviewSectionCard,
  ReviewToolbar,
  reviewFormSx,
} from "../../_components/review-packet";
import { nominationCycleYear } from "../helpers/listFilters";
import {
  winnerImageUrl,
  type AwardWinnerRecord,
  type AwardWinnerRow,
} from "../helpers/winnerImage";
import {
  awardTypeChoices,
  type AwardTypeRecord,
} from "../helpers/awardTypes";
import {
  nominationOptionText,
  winnerPrefillFromNomination,
  type LinkableNomination,
  type WinnerDraft,
} from "../helpers/winnerLink";

const AWARD_BACK = "/orwa-awards/dashboard";

/** Relations the nomination picker / prefill read. */
const NOMINATION_PICK_META = {
  populate: { watersystem: true, contact: true },
  raw: true,
} as const;

/**
 * ImageInput preview value. The stored upload arrives as a bare numeric id
 * (see `useRawWinner`); react-admin's default formatter would hand that
 * number to FileInputPreview. Only objects are previewable — the id itself
 * stays in the form value, so saving without a new upload keeps the photo.
 */
const formatPhotoInput = (value: unknown) => {
  if (typeof File !== "undefined" && value instanceof File) {
    return { rawFile: value, src: URL.createObjectURL(value), title: value.name };
  }
  return value && typeof value === "object" ? value : null;
};

/**
 * Edit loads the record through the RA formatter (relations collapsed to
 * ids so the inputs work), which leaves `photo` as a bare upload id. Fetch
 * the same winner raw once for display-only pieces (current photo).
 */
const useRawWinner = (record: AwardWinnerRecord | undefined) =>
  useGetOne<AwardWinnerRow>(
    "award-winners",
    { id: record?.id as string, meta: { populate: { photo: true }, raw: true } },
    { enabled: record?.id != null && typeof record?.photo !== "object" }
  );

/** Shows the image already saved — uploaded `photo` first, legacy URLs second. */
const CurrentPhoto = () => {
  const record = useRecordContext<AwardWinnerRecord>();
  const { data: raw } = useRawWinner(record);
  const source =
    record && typeof record.photo === "object" && record.photo
      ? record
      : raw ?? record;
  const url = winnerImageUrl(source, "thumbnail");
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

/**
 * Nomination picker + one-shot prefill. When staff pick a nomination, the
 * blank Award / Recipient / Water System / Year fields are filled from it —
 * anything already typed is left alone. Must render inside the form.
 */
const NominationLink = () => {
  const record = useRecordContext<AwardWinnerRecord>();
  const { setValue, getValues } = useFormContext();
  const nominationId = useWatch({ name: "award_nomination" }) as
    | string
    | number
    | null
    | undefined;
  const awardYear = useWatch({ name: "award_year" }) as number | null | undefined;
  const appliedFor = React.useRef<string | number | null | undefined>(
    (record as { award_nomination?: string | number | null } | undefined)?.award_nomination ?? null
  );

  const { data: nomination } = useGetOne<LinkableNomination & { id: string | number }>(
    "award-nominations",
    { id: nominationId as string, meta: NOMINATION_PICK_META },
    { enabled: nominationId != null && nominationId !== "" }
  );

  React.useEffect(() => {
    if (!nomination || nominationId == null || nominationId === "") return;
    if (appliedFor.current === nominationId) return;
    appliedFor.current = nominationId;
    const patch = winnerPrefillFromNomination(nomination, getValues() as WinnerDraft);
    (Object.keys(patch) as (keyof WinnerDraft)[]).forEach((key) => {
      setValue(key, patch[key], { shouldDirty: true, shouldTouch: true });
    });
  }, [nomination, nominationId, getValues, setValue]);

  const yearFilter =
    typeof awardYear === "number" && Number.isFinite(awardYear)
      ? { award_year: awardYear }
      : {};

  return (
    <>
      <ReferenceInput
        source="award_nomination"
        reference="award-nominations"
        filter={yearFilter}
        sort={{ field: "nominee_name", order: "ASC" }}
        perPage={50}
        queryOptions={{ meta: NOMINATION_PICK_META }}
      >
        <AutocompleteInput
          label="Linked nomination"
          optionText={nominationOptionText}
          filterToQuery={(q: string) => ({ q })}
          fullWidth
          sx={fullFieldSx}
          helperText={
            yearFilter.award_year
              ? `Nominations for ${yearFilter.award_year}. Picking one fills the blank fields below.`
              : "Picking a nomination fills the blank fields below."
          }
        />
      </ReferenceInput>
      {nominationId ? (
        <Button
          component={RouterLink}
          to={`/award-nominations/${nominationId}/show`}
          size="small"
          startIcon={<OpenInNewIcon />}
          sx={{ mt: -1, mb: 1 }}
        >
          Open nomination
        </Button>
      ) : null}
    </>
  );
};

const AwardWinnerForm = () => {
  const record = useRecordContext<AwardWinnerRecord>();
  const notify = useNotify();
  const { data, isError } = useGetList<AwardTypeRecord>("award-types", {
    pagination: { page: 1, perPage: 200 },
    sort: { field: "order", order: "ASC" },
  });
  const typeChoices = awardTypeChoices(data, record?.title || null);

  React.useEffect(() => {
    if (isError) {
      notify(
        "Could not load award types. Using the previous hardcoded list.",
        { type: "warning" }
      );
    }
  }, [isError, notify]);

  return (
    <SimpleForm
      sx={reviewFormSx}
      defaultValues={{
        is_published: true,
        sort_order: 0,
        award_year: nominationCycleYear(),
      }}
      toolbar={<ReviewToolbar redirect={AWARD_BACK} />}
    >
      <FormHeadingBar
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
            <ReviewSectionCard title="Nomination">
              <NominationLink />
            </ReviewSectionCard>
          </Grid>

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
                <Grid item xs={12} md={9}>
                  <SelectInput
                    source="title"
                    label="Award"
                    choices={typeChoices}
                    validate={required()}
                    fullWidth
                    sx={fullFieldSx}
                    helperText="Award types from Settings, including ceremony and historical titles"
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <NumberInput
                    source="sort_order"
                    label="Order"
                    helperText="Display order within the year"
                    fullWidth
                    sx={fullFieldSx}
                  />
                </Grid>
                <Grid item xs={12} md={9}>
                  <TextInput
                    source="recipient"
                    label="Recipient"
                    helperText="e.g. Roger McCracken — Lincoln Co RW&SD #4"
                    fullWidth
                    sx={fullFieldSx}
                  />
                </Grid>
                <Grid item xs={12}>
                  {/*
                    Keyed by numeric PK: the data provider's media heuristic
                    (`url != null`) treats watersystem rows as uploads and
                    collapses the relation to its numeric id on read, so a
                    documentId-keyed picker would never show the saved value.
                    Numeric relation ids are accepted on write.
                  */}
                  <ReferenceInput
                    source="watersystem"
                    reference="watersystems"
                    sort={{ field: "name", order: "ASC" }}
                    perPage={50}
                  >
                    <AutocompleteInput
                      label="Water system"
                      optionText="name"
                      optionValue="entityId"
                      filterToQuery={(q: string) => ({ q })}
                      fullWidth
                      sx={fullFieldSx}
                      helperText="Optional — the member system this recipient represents"
                    />
                  </ReferenceInput>
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
                accept="image/png,image/jpeg,image/webp"
                helperText="Upload to replace the current photo."
                format={formatPhotoInput}
                fullWidth
                sx={{
                  "& .RaFileInput-dropZone": {
                    bgcolor: "action.hover",
                    color: "text.primary",
                    border: "2px dashed",
                    borderColor: "divider",
                    borderRadius: 1,
                    py: 3,
                    "&:hover": {
                      borderColor: "primary.main",
                      bgcolor: "action.selected",
                    },
                  },
                }}
              >
                <ImageField source="src" title="title" />
              </ImageInput>
              <Grid container spacing={2} sx={{ mt: 0.5 }}>
                <Grid item xs={12} md={6}>
                  <TextInput
                    source="photo_url"
                    label="Photo URL (fallback)"
                    helperText="Used only when no photo is uploaded — e.g. an orwa.org image."
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
