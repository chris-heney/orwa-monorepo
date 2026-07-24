import React from "react";
import { Box, IconButton, Modal, Typography } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import { useSummaryTokens, display, SummaryTokens } from "./tokens";

/**
 * Plain-language glossary for the dimensional money model. Written for an
 * 8th-grade reading level: every entry says what the term is AND why it
 * matters. Grouped by the model's dimensions.
 */

interface GlossaryEntry {
  term: string;
  what: string;
  why: string;
}

interface GlossaryGroup {
  heading: string;
  tone: (T: SummaryTokens) => string;
  entries: GlossaryEntry[];
}

const GROUPS: GlossaryGroup[] = [
  {
    heading: "The pot — where the money starts",
    tone: (T) => T.deepWater,
    entries: [
      {
        term: "Total Funding",
        what: "All the money in the program for the year: the grant pool plus the administration budget.",
        why: "Every other number on this page is a piece of this one pot.",
      },
      {
        term: "Administration",
        what: "Money set aside to run the program itself — staff time, paperwork, overhead. It never goes to projects.",
        why: "Keeping it separate means operating costs can never quietly eat into project money.",
      },
      {
        term: "Grant",
        what: "The money that actually goes out to water systems for their projects.",
        why: "This is the pool that applications compete for.",
      },
      {
        term: "Previous FY Rollover",
        what: "Money carried in from earlier years: grant dollars that were never awarded, plus money returned by projects that finished under budget.",
        why: "It gets added to this year's pool. Without it, a year that spends old money would wrongly look like it overspent.",
      },
      {
        term: "Closeout Returns",
        what: "When a project finishes without using its whole award, the unused part comes back to the program.",
        why: "Returned money isn't lost — it rolls forward so future projects can use it.",
      },
    ],
  },
  {
    heading: "Availability — can we still promise this money?",
    tone: (T) => T.inflow,
    entries: [
      {
        term: "Available",
        what: "Money nobody has a claim on right now.",
        why: "This is what the program can still promise to new projects.",
      },
      {
        term: "Unavailable (Reserved)",
        what: "Money that is spoken for — promised to a project, or claimed by an application that is still being decided.",
        why: "Reserved money can't be promised to anyone else, even if the check hasn't been written yet.",
      },
      {
        term: "Reserved",
        what: "The total money requested, capped at (max) the funds we actually have available.",
        why: "Once it's reserved, we can't promise it to anyone else, even if the check hasn't been written yet. Withdrawn and denied applications never count — their money went straight back to the pool.",
      },
      {
        term: "Requested",
        what: "The total money asked for through the application process, regardless of whether we have that much.",
        why: "It measures demand. When Requested is bigger than the pool, more systems need help than we can fund this year.",
      },
      {
        term: "Unclaimed",
        what: "The part of the pool with nothing reserved against it: funds available minus Reserved.",
        why: "This is the money the committee can still say yes to. It's a dollars-only figure — there's no application attached to it.",
      },
    ],
  },
  {
    heading: "Approval — what did the committee decide?",
    tone: (T) => T.committed,
    entries: [
      {
        term: "Approved",
        what: "The committee said yes and committed money to the project.",
        why: "From this moment the award amount is locked up until it's paid out or the project closes.",
      },
      {
        term: "Under Review",
        what: "Applications that are still being decided.",
        why: "Their asked-for money stays reserved so we never promise the same dollar twice.",
      },
      {
        term: "Awaiting Committee",
        what: "New applications waiting for their first committee review.",
        why: "Shows how much demand is sitting in the queue.",
      },
      {
        term: "Awaiting Approval",
        what: "Applications that have been looked at but don't have a final decision yet (including change-order revisions).",
        why: "These are the closest to a yes or no — and their money is still tied up.",
      },
      {
        term: "On Hold",
        what: "Applications that are paused, usually while something gets sorted out.",
        why: "Paused isn't dead: their money stays reserved until they resolve one way or the other.",
      },
      {
        term: "Unapproved",
        what: "Applications that asked for money but won't get it — denied or withdrawn.",
        why: "Their dollars go straight back to being available for someone else.",
      },
      {
        term: "Denied",
        what: "The committee said no — including denials for being over the population limit, an insufficient application, or not being eligible.",
        why: "A no frees the money immediately for other projects.",
      },
      {
        term: "Withdrawn",
        what: "The applicant pulled out, or the application was tabled and set aside.",
        why: "Just like a denial, the money returns to the pool.",
      },
    ],
  },
  {
    heading: "Distribution — has the money started moving?",
    tone: (T) => T.water,
    entries: [
      {
        term: "Disbursed",
        what: "Approved awards where at least one payment has gone out the door.",
        why: "This is the difference between a promise and actual money reaching a community.",
      },
      {
        term: "Undisbursed",
        what: "Approved awards where no money has been paid yet.",
        why: "The money is committed but idle — usually waiting on paperwork or an invoice.",
      },
    ],
  },
  {
    heading: "Completeness — how finished is it?",
    tone: (T) => T.violet,
    entries: [
      {
        term: "Paid in Full",
        what: "The whole award has been paid out.",
        why: "The promise is fully kept; nothing more will leave the pool for this project.",
      },
      {
        term: "Paid in Partial",
        what: "Some of the award has been paid, but not all of it.",
        why: "The rest stays reserved until the project finishes or closes out.",
      },
      {
        term: "Needing Signature",
        what: "Approved, but the grant agreement hasn't been signed yet.",
        why: "No money can move until the contract is executed — a bottleneck worth watching.",
      },
      {
        term: "Awaiting Payment Request",
        what: "The agreement is signed, and we're waiting for the water system to ask for its money.",
        why: "The ball is in the applicant's court; the funds sit reserved in the meantime.",
      },
    ],
  },
];

const GlossaryModal: React.FC<{ open: boolean; onClose: () => void }> = ({
  open,
  onClose,
}) => {
  const T = useSummaryTokens();
  return (
    <Modal open={open} onClose={onClose} aria-labelledby="summary-glossary-title">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(720px, calc(100vw - 32px))",
          maxHeight: "85vh",
          display: "flex",
          flexDirection: "column",
          backgroundColor: T.panel,
          border: `1px solid ${T.line}`,
          borderRadius: "16px",
          boxShadow: T.hoverShadow,
          overflow: "hidden",
          outline: "none",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.25,
            px: 3,
            py: 2,
            borderBottom: `1px solid ${T.line}`,
            backgroundColor: T.panelSoft,
          }}
        >
          <MenuBookRoundedIcon sx={{ color: T.water }} />
          <Box sx={{ flex: 1 }}>
            <Typography
              id="summary-glossary-title"
              sx={{
                ...display,
                fontSize: 20,
                fontWeight: 700,
                color: T.textHi,
                lineHeight: 1.2,
              }}
            >
              Glossary — how we talk about the money
            </Typography>
            <Typography sx={{ fontSize: 12, color: T.textLo }}>
              Every category in the funding model, in plain language
            </Typography>
          </Box>
          <IconButton onClick={onClose} aria-label="Close glossary" size="small">
            <CloseRoundedIcon sx={{ color: T.textLo }} />
          </IconButton>
        </Box>

        {/* Scrollable body */}
        <Box
          sx={{
            overflowY: "auto",
            px: 3,
            py: 2.5,
            display: "flex",
            flexDirection: "column",
            gap: 3,
            "&::-webkit-scrollbar": { width: 8 },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: T.panelSoft,
              borderRadius: 4,
            },
          }}
        >
          {GROUPS.map((group) => {
            const tone = group.tone(T);
            return (
              <Box key={group.heading}>
                <Typography
                  sx={{
                    ...display,
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: tone,
                    mb: 1.25,
                  }}
                >
                  {group.heading}
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
                  {group.entries.map((entry) => (
                    <Box
                      key={entry.term}
                      sx={{
                        borderLeft: `3px solid ${tone}`,
                        backgroundColor: T.mode === "dark" ? `${tone}0d` : `${tone}0a`,
                        borderRadius: "0 10px 10px 0",
                        px: 1.75,
                        py: 1.1,
                      }}
                    >
                      <Typography
                        sx={{
                          ...display,
                          fontSize: 14.5,
                          fontWeight: 700,
                          color: T.textHi,
                          lineHeight: 1.3,
                        }}
                      >
                        {entry.term}
                      </Typography>
                      <Typography sx={{ fontSize: 13, color: T.textHi, mt: 0.25 }}>
                        {entry.what}
                      </Typography>
                      <Typography sx={{ fontSize: 12.5, color: T.textLo, mt: 0.4 }}>
                        <Box component="span" sx={{ fontWeight: 600, color: tone }}>
                          Why it matters:{" "}
                        </Box>
                        {entry.why}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Modal>
  );
};

export default GlossaryModal;
