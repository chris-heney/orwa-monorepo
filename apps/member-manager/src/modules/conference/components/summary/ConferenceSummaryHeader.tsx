import React from "react";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CelebrationRoundedIcon from "@mui/icons-material/CelebrationRounded";
import dayjs from "dayjs";
import { RaRecord } from "react-admin";
import { display, useSummaryTokens, SummaryTokens } from "./tokens";
import GlossaryModal from "./GlossaryModal";
import { Showtime } from "./useConferenceMetrics";

const statusTone = (status: string | undefined, T: SummaryTokens): string => {
  switch (status) {
    case "Online Registration":
      return T.inflow;
    case "Kiosk Registration":
    case "Online Registration Closed":
      return T.committed;
    case "Coming Soon":
      return T.water;
    case "Closed":
    case "Archived":
      return T.exit;
    default:
      return T.textFaint;
  }
};

const Chip: React.FC<{ color: string; children: React.ReactNode; hint?: string }> = ({
  color,
  children,
  hint,
}) => {
  const T = useSummaryTokens();
  const chip = (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.75,
        px: 1.5,
        py: 0.5,
        borderRadius: "999px",
        border: `1px solid ${color}66`,
        backgroundColor: `${color}1a`,
        color,
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </Box>
  );
  return hint ? (
    <Tooltip title={hint} arrow>
      {chip}
    </Tooltip>
  ) : (
    chip
  );
};

const showtimeChip = (showtime: Showtime | null, T: SummaryTokens) => {
  if (!showtime) return null;
  switch (showtime.mode) {
    case "countdown":
      return (
        <Chip
          color={T.water}
          hint={`Doors open ${dayjs(showtime.startDate).format("dddd, MMMM D, YYYY")}`}
        >
          T-minus {showtime.days} {showtime.days === 1 ? "day" : "days"}
        </Chip>
      );
    case "live":
      return (
        <Chip color={T.inflow} hint="The event is underway right now">
          <Box
            component="span"
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: T.inflow,
              display: "inline-block",
              animation: "pulse 1.6s ease-in-out infinite",
              "@keyframes pulse": {
                "0%, 100%": { opacity: 1 },
                "50%": { opacity: 0.35 },
              },
            }}
          />
          Live — Day {showtime.days} of {showtime.eventLengthDays}
        </Chip>
      );
    case "wrapped":
      return (
        <Chip
          color={T.committed}
          hint={`Ended ${dayjs(showtime.endDate).format("MMMM D, YYYY")}`}
        >
          <CelebrationRoundedIcon sx={{ fontSize: 14 }} />
          Wrapped {showtime.days === 0 ? "today" : `${showtime.days}d ago`}
        </Chip>
      );
    case "archive":
      return (
        <Chip color={T.textFaint} hint="Viewing a past year — countdowns apply to the current edition only">
          Archive view
        </Chip>
      );
  }
};

/**
 * Command Center masthead: conference identity, live status chips, and the
 * glossary latch. Mirrors the Grant Manager SummaryHeader.
 */
const ConferenceSummaryHeader: React.FC<{
  conference?: RaRecord;
  year?: number;
  showtime: Showtime | null;
}> = ({ conference, year, showtime }) => {
  const T = useSummaryTokens();
  const [glossaryOpen, setGlossaryOpen] = React.useState(false);

  const name = (conference?.name as string) || "All Conferences";
  const status = conference?.status as string | undefined;
  const dateRange =
    showtime?.startDate &&
    `${dayjs(showtime.startDate).format("MMM D")} – ${dayjs(showtime.endDate).format(
      "MMM D, YYYY"
    )}`;
  const venue = conference?.venue as
    | { city?: string; state?: string }
    | undefined;
  const place = venue?.city
    ? `${venue.city}${venue.state ? `, ${venue.state}` : ""}`
    : null;

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "flex-end",
        justifyContent: "space-between",
        gap: 2,
        mb: 3,
      }}
    >
      <Box>
        <Typography
          sx={{
            ...display,
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: T.water,
          }}
        >
          {name}
          {year ? ` · ${year}` : " · All Years"}
        </Typography>
        <Typography
          component="h1"
          sx={{
            ...display,
            fontSize: { xs: 26, md: 34 },
            fontWeight: 700,
            color: T.textHi,
            lineHeight: 1.1,
          }}
        >
          Event Command Center
        </Typography>
        {(dateRange || place) && (
          <Typography sx={{ fontSize: 12.5, color: T.textLo, mt: 0.5 }}>
            {[dateRange, place].filter(Boolean).join(" · ")}
          </Typography>
        )}
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
        {showtimeChip(showtime, T)}
        {status && <Chip color={statusTone(status, T)}>{status}</Chip>}
        <Tooltip title="Glossary — what these numbers mean" arrow>
          <IconButton
            onClick={() => setGlossaryOpen(true)}
            aria-label="Open glossary"
            sx={{
              color: T.textLo,
              border: `1px solid ${T.line}`,
              borderRadius: "12px",
              backgroundColor: T.panel,
              "&:hover": { color: T.water, backgroundColor: T.panelSoft },
            }}
          >
            <InfoOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <GlossaryModal open={glossaryOpen} onClose={() => setGlossaryOpen(false)} />
    </Box>
  );
};

export default ConferenceSummaryHeader;
