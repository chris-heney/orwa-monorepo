import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  useCreate,
  useGetList,
  useNotify,
  useRedirect,
  useRefresh,
} from "react-admin";
import { Alert, Box, Button, Chip, Typography } from "@mui/material";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useCan } from "../../rbac-manager/useCan";
import {
  isWinnerStatus,
  winnerFromNomination,
  type LinkableNomination,
} from "../helpers/winnerLink";
import type { AwardWinnerRow } from "../helpers/winnerImage";

/**
 * Nomination → Winners gallery bridge. Shown on the nomination show page and
 * inside the review form.
 *
 * - Linked winner exists → "View Winner" (one source of truth, no re-entry).
 * - Saved status is Winner / Runner Up and nothing is linked → non-blocking
 *   notice + "Add to Winners" (the click is the intent; nothing auto-creates).
 * - Form status is Winner / Runner Up but not saved yet → tell staff to save
 *   first, so a winner is never created for a status that was then discarded.
 *
 * Creating the winner never touches `nomination_status` — that stays
 * staff-owned on the nomination.
 */
const NominationWinnerPanel = ({
  record,
  pendingStatus,
}: {
  record: LinkableNomination | undefined;
  /** Live form value when rendered inside AwardForm. */
  pendingStatus?: string | null;
}) => {
  const notify = useNotify();
  const redirect = useRedirect();
  const refresh = useRefresh();
  const { canOnResource } = useCan();
  const [create, { isLoading: creating }] = useCreate();

  const nominationId = record?.id;
  const { data, isLoading } = useGetList<AwardWinnerRow>(
    "award-winners",
    {
      filter: nominationId != null ? { award_nomination: nominationId } : {},
      pagination: { page: 1, perPage: 1 },
      sort: { field: "award_year", order: "DESC" },
      meta: { populate: { photo: true }, raw: true },
    },
    { enabled: nominationId != null }
  );
  const winner = data?.[0];

  if (!record || nominationId == null || isLoading) return null;

  const savedStatus = record.nomination_status ?? null;
  const savedIsWinner = isWinnerStatus(savedStatus);
  const pendingIsWinner =
    pendingStatus != null && pendingStatus !== savedStatus && isWinnerStatus(pendingStatus);

  if (winner) {
    return (
      <Box sx={{ mt: 1.5 }} data-testid="nomination-winner-linked">
        <Chip
          icon={<MilitaryTechIcon />}
          label={
            winner.is_published === false
              ? "In Winners gallery · hidden"
              : "In Winners gallery"
          }
          size="small"
          color={winner.is_published === false ? "default" : "success"}
          variant="outlined"
          sx={{ fontWeight: 700, mb: 1 }}
        />
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {[winner.award_year, winner.title].filter(Boolean).join(" ")}
          {winner.recipient ? ` — ${winner.recipient}` : ""}
        </Typography>
        <Button
          component={RouterLink}
          to={`/award-winners/${winner.id}`}
          size="small"
          variant="outlined"
          startIcon={<OpenInNewIcon />}
        >
          View Winner
        </Button>
      </Box>
    );
  }

  if (!savedIsWinner && !pendingIsWinner) return null;

  if (!savedIsWinner && pendingIsWinner) {
    return (
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: "block", mt: 1.5 }}
        data-testid="nomination-winner-save-first"
      >
        Save the nomination as {pendingStatus} to add it to the Winners gallery.
      </Typography>
    );
  }

  const onAdd = () => {
    create(
      "award-winners",
      { data: winnerFromNomination(record), meta: { populate: "*" } },
      {
        onSuccess: (created: { id?: string | number }) => {
          notify("Added to the Winners gallery (hidden until published).", {
            type: "success",
          });
          refresh();
          if (created?.id != null) redirect(`/award-winners/${created.id}`);
        },
        onError: (error: unknown) => {
          notify(
            (error as { message?: string })?.message || "Could not add to Winners.",
            { type: "error" }
          );
        },
      }
    );
  };

  return (
    <Alert
      severity="info"
      icon={<MilitaryTechIcon fontSize="inherit" />}
      sx={{ mt: 1.5, "& .MuiAlert-message": { width: 1 } }}
      data-testid="nomination-winner-missing"
    >
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        Not yet in the Winners gallery.
      </Typography>
      {canOnResource("create", "award-winners") ? (
        <Button
          size="small"
          variant="contained"
          color="primary"
          onClick={onAdd}
          disabled={creating}
          sx={{ mt: 1, whiteSpace: "nowrap" }}
        >
          Add to Winners
        </Button>
      ) : null}
    </Alert>
  );
};

export default NominationWinnerPanel;
