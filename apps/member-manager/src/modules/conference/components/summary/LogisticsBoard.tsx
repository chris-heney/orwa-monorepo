import React from "react";
import { Box, CircularProgress, Tooltip, Typography } from "@mui/material";
import RestaurantRoundedIcon from "@mui/icons-material/RestaurantRounded";
import { display, money, useSummaryTokens } from "./tokens";
import { MetricChip, Panel, SectionLabel } from "./cards";
import { ConferenceMetrics } from "./useConferenceMetrics";

/**
 * The kitchen-and-floor numbers: plates to order per counted extra, booth
 * inventory, and the loose ends that bite during event week.
 */
const LogisticsBoard: React.FC<{ metrics: ConferenceMetrics }> = ({ metrics }) => {
  const T = useSummaryTokens();
  const {
    catering,
    headcount,
    booths,
    sourceMix,
    attendeesMissingEmail,
    sponsors,
    feedbackCount,
  } = metrics;

  // Uploaded meal icons are black SVG/PNGs; recolor per palette mode.
  const iconFilter =
    T.mode === "dark" ? "brightness(0) invert(1)" : "brightness(0)";

  // Extras with a per-option breakdown render as their own block below the
  // plain totals grid.
  const simpleCatering = (catering ?? []).filter(
    (item) => !item.options || item.options.length === 0
  );
  const groupedCatering = (catering ?? []).filter(
    (item) => item.options && item.options.length > 0
  );

  return (
    <Panel sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box>
        <SectionLabel caption="Counted extras across attendees, booths, and registrations — the numbers to hand the caterer">
          Plates to Order
        </SectionLabel>

        {catering === null ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
            <CircularProgress size={22} sx={{ color: T.water }} />
          </Box>
        ) : catering.length === 0 ? (
          <Typography sx={{ fontSize: 13, color: T.textFaint, fontStyle: "italic", py: 2 }}>
            No counted extras for this selection.
          </Typography>
        ) : (
          <>
            {simpleCatering.length > 0 && (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                  gap: 1.25,
                }}
              >
                {simpleCatering.map((item) => (
                  <Box
                    key={item.name}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.25,
                      px: 1.5,
                      py: 1.25,
                      borderRadius: "12px",
                      backgroundColor: T.panelSoft,
                      border: `1px solid ${T.line}`,
                    }}
                  >
                    {item.icon ? (
                      <Box
                        component="img"
                        src={item.icon}
                        alt=""
                        aria-hidden
                        sx={{
                          width: 26,
                          height: 26,
                          objectFit: "contain",
                          filter: iconFilter,
                          opacity: 0.85,
                        }}
                      />
                    ) : (
                      <RestaurantRoundedIcon sx={{ color: T.water, fontSize: 26 }} />
                    )}
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        sx={{
                          ...display,
                          fontSize: 20,
                          fontWeight: 700,
                          color: T.textHi,
                          lineHeight: 1.1,
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {item.count.toLocaleString()}
                      </Typography>
                      <Typography sx={{ fontSize: 11, color: T.textLo }} noWrap>
                        {item.name}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}

            {/* Extras grouped by selected option (e.g. "Free T-Shirt" by Shirt
                Size): total in the header, one mini-card per option; the
                option counts always sum to the total. */}
            {groupedCatering.map((item) => (
              <Box
                key={item.name}
                sx={{
                  mt: simpleCatering.length > 0 ? 1.25 : 0,
                  px: 1.5,
                  py: 1.25,
                  borderRadius: "12px",
                  backgroundColor: T.panelSoft,
                  border: `1px solid ${T.line}`,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.25,
                    mb: 1,
                  }}
                >
                  {item.icon ? (
                    <Box
                      component="img"
                      src={item.icon}
                      alt=""
                      aria-hidden
                      sx={{
                        width: 26,
                        height: 26,
                        objectFit: "contain",
                        filter: iconFilter,
                        opacity: 0.85,
                      }}
                    />
                  ) : (
                    <RestaurantRoundedIcon sx={{ color: T.water, fontSize: 26 }} />
                  )}
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography
                      sx={{
                        ...display,
                        fontSize: 20,
                        fontWeight: 700,
                        color: T.textHi,
                        lineHeight: 1.1,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {item.count.toLocaleString()}
                    </Typography>
                    <Typography sx={{ fontSize: 11, color: T.textLo }} noWrap>
                      {item.name}
                    </Typography>
                  </Box>
                  {item.selectionName && (
                    <Typography
                      sx={{
                        fontSize: 10,
                        fontWeight: 600,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: T.textFaint,
                      }}
                    >
                      by {item.selectionName}
                    </Typography>
                  )}
                </Box>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(92px, 1fr))",
                    gap: 1,
                  }}
                >
                  {(item.options ?? []).map((option) => (
                    <Box
                      key={option.name}
                      sx={{
                        px: 1.25,
                        py: 0.75,
                        borderRadius: "10px",
                        backgroundColor: T.panel,
                        border: `1px solid ${T.line}`,
                        borderLeft: `3px solid ${
                          option.name === "Unspecified" ? T.committed : T.water
                        }`,
                      }}
                    >
                      <Typography
                        sx={{
                          ...display,
                          fontSize: 16,
                          fontWeight: 700,
                          color: T.textHi,
                          lineHeight: 1.1,
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {option.count.toLocaleString()}
                      </Typography>
                      <Typography sx={{ fontSize: 10.5, color: T.textLo }} noWrap>
                        {option.name}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            ))}
          </>
        )}

        {headcount > 0 && (
          <Typography sx={{ fontSize: 11, color: T.textFaint, mt: 1 }}>
            Reference: {headcount.toLocaleString()} people through the door.
          </Typography>
        )}
      </Box>

      {(booths.sold > 0 || booths.remaining != null) && (
        <Box>
          <SectionLabel caption="Vendor booth inventory">Conference Floor</SectionLabel>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
            {booths.capacity != null && (
              <Tooltip
                title={`${booths.sold} sold of ${booths.capacity} total booths`}
                arrow
              >
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      mb: 0.5,
                    }}
                  >
                    <Typography
                      sx={{
                        ...display,
                        fontSize: 22,
                        fontWeight: 700,
                        color: T.textHi,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {booths.sold}
                      <Box component="span" sx={{ fontSize: 13, color: T.textLo }}>
                        {" "}
                        / {booths.capacity} sold
                      </Box>
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: T.committed, fontWeight: 600 }}>
                      {booths.remaining} left
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      height: 8,
                      borderRadius: "999px",
                      backgroundColor: T.panelSoft,
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        height: "100%",
                        width: `${Math.min(
                          (booths.sold / Math.max(booths.capacity, 1)) * 100,
                          100
                        )}%`,
                        borderRadius: "999px",
                        background: `linear-gradient(90deg, ${T.deepWater}, ${T.water})`,
                        transition: "width 600ms ease",
                      }}
                    />
                  </Box>
                </Box>
              </Tooltip>
            )}
            <Box sx={{ display: "flex", gap: 1.25, flexWrap: "wrap", mt: 0.75 }}>
              <MetricChip label="Booths Sold" value={booths.sold} tone={T.deepWater} />
              {booths.available != null && (
                <MetricChip
                  label="Booths Available"
                  value={booths.available}
                  sub={money(booths.availableValue)}
                  showZero
                  tone={booths.available === 0 ? T.committed : T.inflow}
                  hint={
                    booths.available === 0
                      ? "The expo floor is sold out"
                      : `Open booths worth ${money(
                          booths.availableValue
                        )} at each conference's booth price`
                  }
                />
              )}
              <MetricChip
                label="Booth Revenue"
                value={booths.revenue}
                format="money"
                tone={T.deepWater}
              />
              <MetricChip
                label="Unassigned Numbers"
                value={booths.unnumbered}
                tone={T.exit}
                hint="Sold booths without a booth number — assign before the floor map goes out"
              />
            </Box>
          </Box>
        </Box>
      )}

      <Box>
        <SectionLabel caption="Loose ends worth clearing before event week">
          Signals
        </SectionLabel>
        <Box sx={{ display: "flex", gap: 1.25, flexWrap: "wrap" }}>
          <MetricChip
            label="Missing Emails"
            value={attendeesMissingEmail}
            tone={T.exit}
            hint="Attendees with no email on file — no confirmations, no training credit"
          />
          <MetricChip
            label="Sponsor Logos Missing"
            value={sponsors.missingLogo}
            tone={T.exit}
            hint="Sponsors without an uploaded logo — chase these before signage prints"
          />
          <MetricChip
            label="Kiosk Registrations"
            value={sourceMix.kiosk}
            tone={T.violet}
            hint="Walk-up registrations taken at the kiosk"
          />
          <MetricChip
            label="Online Registrations"
            value={sourceMix.online}
            tone={T.water}
          />
          <MetricChip
            label="Feedback Received"
            value={feedbackCount}
            tone={T.inflow}
          />
        </Box>
      </Box>
    </Panel>
  );
};

export default LogisticsBoard;
