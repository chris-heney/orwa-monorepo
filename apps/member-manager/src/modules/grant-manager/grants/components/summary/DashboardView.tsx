import React from "react";
import { Box, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import PaidRoundedIcon from "@mui/icons-material/PaidRounded";
import { useStore } from "react-admin";
import dayjs from "dayjs";
import { useSummaryTokens, display, money } from "./tokens";
import { useGrantMetrics } from "./useGrantMetrics";
import { StageCard, AmountChip } from "./StatCards";
import FundsExplorer from "./FundsExplorer";
import { IGrantApplication } from "../../../grant-application/GrantApplicationTypes";
import { IGrantPayout } from "../GrantTypes";

type Metrics = ReturnType<typeof useGrantMetrics>;

// ---------------------------------------------------------------------------
// Application Pathways
//
// Variants live in ./pathways/variants/ and are auto-discovered with
// import.meta.glob, so missing files never break the build and new files
// appear via HMR without touching this file. One variant renders at a time;
// each manager's pick persists via react-admin's store (RaStore).
// ---------------------------------------------------------------------------

export interface PathwayVariantProps {
  applications: IGrantApplication[];
  payouts: IGrantPayout[];
  fundsAvailable?: number;
  adminAllocation?: number;
  adminDisbursed?: number;
}

interface PathwayVariantModule {
  default?: React.FC<PathwayVariantProps>;
  variantMeta?: { title: string; blurb: string };
}

const variantModules = import.meta.glob("./pathways/variants/*.tsx", {
  eager: true,
}) as Record<string, PathwayVariantModule>;

/** A broken work-in-progress variant must not take down the dashboard. */
class VariantBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

interface PathwayVariant {
  /** Stable key persisted in the store: the filename without extension. */
  key: string;
  title: string;
  blurb?: string;
  Component: React.FC<PathwayVariantProps>;
}

const PATHWAY_VARIANTS: PathwayVariant[] = Object.entries(variantModules)
  .filter(([, mod]) => typeof mod.default === "function")
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([path, mod]) => {
    const filename = (path.split("/").pop() ?? path).replace(/\.tsx$/, "");
    return {
      key: filename,
      title: mod.variantMeta?.title ?? filename,
      blurb: mod.variantMeta?.blurb,
      Component: mod.default as React.FC<PathwayVariantProps>,
    };
  });

const PathwaysShowcase: React.FC<PathwayVariantProps> = (props) => {
  const T = useSummaryTokens();
  // Per-user/browser preference; falls back to the first variant (by
  // filename) when unset or when the stored variant no longer exists.
  const [storedKey, setStoredKey] = useStore<string>(
    "grant.pathwaysVariant",
    PATHWAY_VARIANTS[0]?.key ?? ""
  );
  const active =
    PATHWAY_VARIANTS.find((v) => v.key === storedKey) ?? PATHWAY_VARIANTS[0];

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 1,
          mb: 1,
        }}
      >
        <Box>
          <Typography
            sx={{
              ...display,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: T.textLo,
            }}
          >
            Application Pathways
          </Typography>
          {active?.blurb && (
            <Typography sx={{ fontSize: 11, color: T.textFaint }}>
              {active.blurb}
            </Typography>
          )}
        </Box>

        {PATHWAY_VARIANTS.length > 1 && (
          <ToggleButtonGroup
            size="small"
            exclusive
            value={active?.key}
            onChange={(_, v) => v && setStoredKey(v)}
            sx={{
              backgroundColor: T.panel,
              border: `1px solid ${T.line}`,
              borderRadius: "12px",
              "& .MuiToggleButton-root": {
                color: T.textLo,
                border: "none",
                px: 1.75,
                py: 0.5,
                textTransform: "none",
                fontSize: 12,
                "&.Mui-selected": {
                  color: T.textHi,
                  backgroundColor: T.panelSoft,
                  boxShadow: `inset 0 -2px 0 ${T.water}`,
                },
                "&:hover": { backgroundColor: T.panelSoft },
              },
            }}
          >
            {PATHWAY_VARIANTS.map((v) => (
              <ToggleButton key={v.key} value={v.key} aria-label={v.title}>
                {v.title}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        )}
      </Box>

      {active ? (
        <Box
          sx={{
            backgroundColor: T.panel,
            border: `1px solid ${T.line}`,
            borderRadius: "14px",
            p: 2,
          }}
        >
          <VariantBoundary
            key={active.key}
            fallback={
              <Typography sx={{ fontSize: 12, color: T.exit }}>
                This view hit an error while rendering.
              </Typography>
            }
          >
            <active.Component {...props} />
          </VariantBoundary>
        </Box>
      ) : (
        <Box
          sx={{
            border: `1px dashed ${T.line}`,
            borderRadius: "14px",
            px: 2.5,
            py: 3,
            textAlign: "center",
          }}
        >
          <Typography sx={{ fontSize: 13, color: T.textFaint, fontStyle: "italic" }}>
            Pathway views will appear here as they land.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const T = useSummaryTokens();
  return (
    <Typography
      sx={{
        ...display,
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: T.textLo,
        mb: 1,
      }}
    >
      {children}
    </Typography>
  );
};

const LastPayoutCard: React.FC<{ payout: Metrics["lastPayout"] }> = ({
  payout,
}) => {
  const T = useSummaryTokens();
  if (!payout) return null;
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        px: 2,
        py: 1.25,
        borderRadius: "10px",
        border: `1px solid ${T.line}`,
        background: `linear-gradient(120deg, ${T.inflow}1f, ${T.panel} 55%)`,
        minWidth: 240,
      }}
    >
      <PaidRoundedIcon sx={{ color: T.inflow, fontSize: 30 }} />
      <Box>
        <Typography
          sx={{
            fontSize: 10.5,
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: T.textLo,
          }}
        >
          Last payout · {dayjs(payout.transaction_date.toString()).format("MMM D, YYYY")}
        </Typography>
        <Typography
          sx={{
            ...display,
            fontSize: 20,
            fontWeight: 700,
            color: T.textHi,
            fontVariantNumeric: "tabular-nums",
            lineHeight: 1.2,
          }}
        >
          {money(payout.amount)}
          <Box component="span" sx={{ fontSize: 12, color: T.textLo, ml: 1 }}>
            {payout.type}
          </Box>
        </Typography>
        <Typography sx={{ fontSize: 11.5, color: T.textLo }} noWrap>
          {payout.application?.legal_entity_name || "Administrative"}
        </Typography>
      </Box>
    </Box>
  );
};

const DashboardView: React.FC<{
  metrics: Metrics;
  applications: IGrantApplication[];
  payouts: IGrantPayout[];
}> = ({ metrics, applications, payouts }) => {
  const T = useSummaryTokens();
  const { exits, pool, insights, lastPayout, breakdown, edgeBreakdown } =
    metrics;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Signature: the pathways explorer (style is a per-user preference) */}
      <PathwaysShowcase
        applications={applications}
        payouts={payouts}
        fundsAvailable={pool.fundsAvailable}
        adminAllocation={pool.annualAdmin}
        adminDisbursed={pool.adminDisbursed}
      />

      {/* Off-ramp stages (only ones with data render) */}
      {exits.length > 0 && (
        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
          {exits.map((stage) => (
            <Box key={stage.key} sx={{ flex: "0 1 220px" }}>
              <StageCard stage={stage} dense />
            </Box>
          ))}
        </Box>
      )}

      {/* The pool: amount-only figures (zero values hide themselves) */}
      <Box>
        <SectionLabel>The pool</SectionLabel>
        <Box sx={{ display: "flex", gap: 1.25, flexWrap: "wrap" }}>
          <AmountChip label="Annual Allocation" value={pool.annualGrant} tone={T.water} />
          <AmountChip
            label="Previous FY Rollover"
            value={pool.previousFyRollover}
            tone={T.deepWater}
            hint="Unawarded allocation and closeout returns carried in from every earlier fiscal year"
          />
          <AmountChip label="Funds Available" value={pool.fundsAvailable} tone={T.inflow} />
          <AmountChip
            label="Reserved"
            value={pool.reserved}
            tone={T.committed}
            hint="Total money requested, capped at funds available — withdrawn and denied applications never count"
          />
          <AmountChip
            label="Still Available"
            value={pool.fundsStillAvailable}
            tone={T.inflow}
            hint="Funds available minus what the committee has approved"
          />
          <AmountChip label="Undistributed" value={pool.undistributed} tone={T.committed}
            hint="Approved but not yet paid out" />
          <AmountChip label="Closeout Returns" value={pool.closeoutReturned} tone={T.deepWater}
            hint="Money returned by closed-out applications this fiscal year" />
          <AmountChip label="Admin Allocation" value={pool.annualAdmin} tone={T.violet} />
          <AmountChip label="Admin Disbursed" value={pool.adminDisbursed} tone={T.violet} />
          <AmountChip label="Admin Available" value={pool.adminAvailable} tone={T.violet} />
        </Box>
      </Box>

      {/* Insights + last payout */}
      <Box>
        <SectionLabel>Signals</SectionLabel>
        <Box sx={{ display: "flex", gap: 1.25, flexWrap: "wrap", alignItems: "stretch" }}>
          <LastPayoutCard payout={lastPayout} />
          <AmountChip label="Average Award" value={insights.avgAward} tone={T.committed} />
          <AmountChip label="Median Award" value={insights.medianAward} tone={T.committed} />
          <AmountChip label="Largest Award" value={insights.largestAward} tone={T.committed} />
          <AmountChip label="Average Payout" value={insights.avgPayout} tone={T.inflow} />
          <AmountChip
            label="Avg. Days to Decision"
            value={insights.avgDaysToDecision}
            format="days"
            tone={T.water}
            hint="From application submission to committee decision, approved applications"
          />
          <AmountChip
            label="Approval Ratio"
            value={insights.approvalRatio}
            format="percent"
            tone={T.water}
            hint="Approved share of reviewed applications"
          />
          <AmountChip
            label="Oklahomans Served"
            value={insights.populationServed}
            format="count"
            tone={T.inflow}
            hint="Combined population served by approved systems"
          />
          <AmountChip
            label="Counties Reached"
            value={insights.countiesServed}
            format="count"
            tone={T.water}
          />
        </Box>
      </Box>

      {/* Where the money goes */}
      <FundsExplorer breakdown={breakdown} edgeBreakdown={edgeBreakdown} />

      <Typography sx={{ fontSize: 11, color: T.textFaint, fontStyle: "italic" }}>
        Figures attribute payouts and awards to the fiscal year of each
        application&apos;s committee approval date. Closeout returns accrue as
        open awards close out, so a past year&apos;s rollover grows over time —
        every view reflects the books as of today.
      </Typography>
    </Box>
  );
};

export default DashboardView;
