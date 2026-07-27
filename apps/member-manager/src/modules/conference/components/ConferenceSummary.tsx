import React from "react";
import { Box, Typography } from "@mui/material";
import { Loading, useListContext } from "react-admin";
import dayjs from "dayjs";
import { money, useSummaryTokens } from "./summary/tokens";
import { MetricChip, StatCard } from "./summary/cards";
import { useConferenceMetrics } from "./summary/useConferenceMetrics";
import ConferenceSummaryHeader from "./summary/ConferenceSummaryHeader";
import RegistrationMomentum from "./summary/RegistrationMomentum";
import RevenueMix from "./summary/RevenueMix";
import CrowdPanel from "./summary/CrowdPanel";
import LogisticsBoard from "./summary/LogisticsBoard";
import SponsorSpotlight from "./summary/SponsorSpotlight";

/**
 * Conference Event Command Center — the Grant Manager summary treatment
 * applied to event operations: ink canvas, duotone stat cards, water-ledger
 * tokens in light and dark, zero-value widgets staying out of the way.
 */
const ConferenceSummary = () => {
  const T = useSummaryTokens();
  const { filterValues } = useListContext();
  const metrics = useConferenceMetrics(filterValues);
  const { showtime, revenue, booths, sponsors, contest } = metrics;

  if (metrics.isLoading) return <Loading />;

  const eventDates =
    showtime?.startDate &&
    `${dayjs(showtime.startDate).format("MMM D")} – ${dayjs(
      showtime.endDate
    ).format("MMM D, YYYY")}`;

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        backgroundColor: T.ink,
        borderRadius: "0 0 18px 18px",
        p: { xs: 2, md: 3 },
        overflow: "hidden",
        isolation: "isolate",
      }}
    >
      {/* Ambient wash, same recipe as the membership summary */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: `
            radial-gradient(ellipse 70% 50% at 10% 0%, ${T.water}14 0%, transparent 55%),
            radial-gradient(ellipse 50% 40% at 90% 20%, ${T.committed}10 0%, transparent 50%)
          `,
          zIndex: 0,
        }}
      />

      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <ConferenceSummaryHeader
          conference={metrics.conference}
          year={metrics.year}
          showtime={showtime}
        />

        {/* Showtime rail */}
        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
          {showtime?.mode === "countdown" && (
            <StatCard
              label="Doors Open"
              value={String(showtime.days)}
              valueSuffix={showtime.days === 1 ? "day out" : "days out"}
              caption={eventDates || ""}
              color={T.water}
              progress={showtime.regWindowProgress ?? undefined}
              footer={
                showtime.regWindowOpen && showtime.regDaysLeft != null
                  ? `Online registration closes in ${showtime.regDaysLeft} days`
                  : undefined
              }
              hint="Days until the event begins"
            />
          )}
          {showtime?.mode === "live" && (
            <StatCard
              label="Live Now"
              value={`Day ${showtime.days}`}
              valueSuffix={`of ${showtime.eventLengthDays}`}
              caption={eventDates || ""}
              color={T.inflow}
              progress={showtime.days / showtime.eventLengthDays}
            />
          )}
          {showtime?.mode === "wrapped" && (
            <StatCard
              label="Wrapped"
              value={String(showtime.days)}
              valueSuffix="days ago"
              caption={eventDates || ""}
              color={T.committed}
            />
          )}

          <StatCard
            label="Registrations"
            value={metrics.registrationCount.toLocaleString()}
            caption="Checkouts for this selection"
            footer={`${metrics.attendeeRegistrations} attendee · ${metrics.vendorRegistrations} vendor`}
            color={T.water}
          />
          <StatCard
            label="Headcount"
            value={metrics.headcount.toLocaleString()}
            caption="People through the door"
            footer={
              metrics.voterOnly > 0
                ? `+${metrics.voterOnly} voter only`
                : undefined
            }
            color={T.inflow}
            hint="Every attendee except Voter Only badges"
          />
          <StatCard
            label="Revenue"
            value={money(revenue.total, true)}
            caption="All checkout dollars"
            footer={
              revenue.sponsorships > 0
                ? `incl. ${money(revenue.sponsorships, true)} sponsorships`
                : undefined
            }
            color={T.committed}
          />
          {(booths.sold > 0 || booths.capacity != null) && (
            <StatCard
              label="Booths"
              value={String(booths.sold)}
              valueSuffix={booths.capacity != null ? `of ${booths.capacity}` : "sold"}
              caption={
                booths.remaining != null
                  ? `${booths.remaining} still on the floor`
                  : "Vendor booths sold"
              }
              footer={booths.revenue > 0 ? money(booths.revenue) : undefined}
              color={T.deepWater}
              progress={
                booths.capacity != null
                  ? booths.sold / Math.max(booths.capacity, 1)
                  : undefined
              }
            />
          )}
          {sponsors.count > 0 && (
            <StatCard
              label="Sponsors"
              value={money(sponsors.dollars, true)}
              caption="Sponsorship dollars raised"
              footer={`${sponsors.count} sponsor${sponsors.count === 1 ? "" : "s"}`}
              color={T.violet}
            />
          )}
        </Box>

        {/* Pace + take */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "7fr 5fr" },
            gap: 2.5,
            alignItems: "stretch",
          }}
        >
          <RegistrationMomentum
            registrations={metrics.registrations}
            priorRegistrations={metrics.priorRegistrations}
            year={metrics.year}
            showtime={showtime}
          />
          <RevenueMix metrics={metrics} />
        </Box>

        {/* Crowd + logistics */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "6fr 6fr" },
            gap: 2.5,
            alignItems: "stretch",
          }}
        >
          <CrowdPanel metrics={metrics} />
          <LogisticsBoard metrics={metrics} />
        </Box>

        {/* Contest corner (tournament conferences only) */}
        {(contest.contestants > 0 || contest.tasteTest > 0) && (
          <Box>
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: T.textLo,
                mb: 1,
              }}
            >
              Contest Corner
            </Typography>
            <Box sx={{ display: "flex", gap: 1.25, flexWrap: "wrap" }}>
              {contest.byType.map((c) => (
                <MetricChip
                  key={c.name}
                  label={c.name}
                  value={c.count}
                  tone={T.water}
                />
              ))}
              <MetricChip label="Teams" value={contest.teams} tone={T.inflow} />
              <MetricChip
                label="Taste Test Entries"
                value={contest.tasteTest}
                tone={T.violet}
              />
              <MetricChip
                label="Contest Fees"
                value={contest.fees}
                format="money"
                tone={T.committed}
              />
            </Box>
          </Box>
        )}

        <SponsorSpotlight metrics={metrics} />

        <Typography sx={{ fontSize: 11, color: T.textFaint, fontStyle: "italic" }}>
          Figures reflect the selected conference and year as of right now.
          Revenue splits booth, sponsorship, and contest dollars off their own
          records; the remainder of each checkout is attributed to tickets &
          extras. Headcounts exclude Voter Only badges.
        </Typography>
      </Box>
    </Box>
  );
};

export default ConferenceSummary;
