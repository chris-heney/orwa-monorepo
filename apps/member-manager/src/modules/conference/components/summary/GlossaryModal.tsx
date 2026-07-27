import React from "react";
import { Box, Dialog, DialogContent, IconButton, Typography } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { display, useSummaryTokens } from "./tokens";

const TERMS: { term: string; definition: string }[] = [
  {
    term: "Registration",
    definition:
      "One checkout by one organization. A single registration can bring many attendees, booths, sponsorships, and contestants.",
  },
  {
    term: "Headcount",
    definition:
      "People walking through the door — every attendee except Voter Only badges. This is the number catering and seating should plan around.",
  },
  {
    term: "Voter Only",
    definition:
      "Badges issued solely to cast a vote at the business meeting. They are counted separately and excluded from meal planning.",
  },
  {
    term: "Total Revenue",
    definition:
      "The sum of every registration's checkout total for the selected conference and year — tickets, extras, booths, sponsorships, and contest fees together.",
  },
  {
    term: "Revenue by Source",
    definition:
      "Booth, sponsorship, and contest dollars come off their own records; whatever remains of the checkout totals is attributed to tickets & extras.",
  },
  {
    term: "Plates to Order",
    definition:
      "Counted extras (meals and similar) tallied across attendees, booths, and registrations — the kitchen numbers.",
  },
  {
    term: "Registration Pace",
    definition:
      "Registrations placed per calendar day. The dotted line replays last year's pace on the same calendar dates so you can tell early-bird energy from a slow year.",
  },
  {
    term: "Training Seats",
    definition:
      "Attendees who requested Operator or Board credit. People taking both sit in both rooms, so the two numbers can add up to more than headcount.",
  },
  {
    term: "Voting Floor",
    definition:
      "Registered ORWA and ORWAAG voting delegates and alternates — your quorum tracker for the business meeting.",
  },
  {
    term: "Booths Sold / Remaining",
    definition:
      "Purchased vendor booths against the booth inventory configured on the conference. Conferences without a real cap don't show a gauge.",
  },
];

/** Plain-language glossary, mirroring the Grant Manager treatment. */
const GlossaryModal: React.FC<{ open: boolean; onClose: () => void }> = ({
  open,
  onClose,
}) => {
  const T = useSummaryTokens();
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: T.ink,
          backgroundImage: "none",
          border: `1px solid ${T.line}`,
          borderRadius: "18px",
        },
      }}
    >
      <DialogContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography
            sx={{
              ...display,
              fontSize: 22,
              fontWeight: 700,
              color: T.textHi,
            }}
          >
            What these numbers mean
          </Typography>
          <IconButton onClick={onClose} sx={{ color: T.textLo }} aria-label="Close glossary">
            <CloseRoundedIcon />
          </IconButton>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {TERMS.map((t) => (
            <Box
              key={t.term}
              sx={{
                backgroundColor: T.panel,
                border: `1px solid ${T.line}`,
                borderRadius: "12px",
                px: 2,
                py: 1.25,
              }}
            >
              <Typography
                sx={{
                  ...display,
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: T.water,
                }}
              >
                {t.term}
              </Typography>
              <Typography sx={{ fontSize: 13, color: T.textLo, mt: 0.25 }}>
                {t.definition}
              </Typography>
            </Box>
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default GlossaryModal;
