import React from "react";
import { Box, Tooltip, Typography } from "@mui/material";
import HandshakeRoundedIcon from "@mui/icons-material/HandshakeRounded";
import { RaRecord } from "react-admin";
import { display, money, useSummaryTokens } from "./tokens";
import { MetricChip, Panel, SectionLabel } from "./cards";
import { ConferenceMetrics, num } from "./useConferenceMetrics";

const mediaUrl = (logo: RaRecord | null | undefined): string | null => {
  const url = (logo?.url as string) || null;
  if (!url) return null;
  if (/^https?:\/\//.test(url)) return url;
  // member-manager's VITE_API_ENDPOINT is the host root (no /api suffix).
  return `${import.meta.env.VITE_API_ENDPOINT}${url}`;
};

/**
 * The people paying for the party: dollars raised, a ranked board with share
 * bars, and the logo wall as it will appear on signage.
 */
const SponsorSpotlight: React.FC<{ metrics: ConferenceMetrics }> = ({
  metrics,
}) => {
  const T = useSummaryTokens();
  const { sponsors } = metrics;
  if (sponsors.count === 0) return null;

  const top = sponsors.top.slice(0, 8);
  const maxAmount = Math.max(...top.map((s) => s.amount), 1);
  const logos = sponsors.records
    .map((s) => ({
      org: ((s.organization as string) || "").trim() || "Sponsor",
      url: mediaUrl(s.logo as RaRecord | null),
      amount: num(s.amount),
    }))
    .filter((s) => s.url)
    .sort((a, b) => b.amount - a.amount);

  return (
    <Panel>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 1,
        }}
      >
        <SectionLabel caption="Sponsorship dollars and the logo wall as signage will show it">
          Sponsor Spotlight
        </SectionLabel>
        <Box sx={{ display: "flex", gap: 1.25, flexWrap: "wrap" }}>
          <MetricChip
            label="Sponsors"
            value={sponsors.count}
            tone={T.committed}
          />
          <MetricChip
            label="Sponsorship Dollars"
            value={sponsors.dollars}
            format="money"
            tone={T.committed}
          />
        </Box>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "minmax(280px, 5fr) 7fr" },
          gap: 2.5,
          mt: 1,
        }}
      >
        {/* Ranked board */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
          {top.map((s, i) => (
            <Box key={`${s.name}-${i}`}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  gap: 1,
                }}
              >
                <Typography
                  sx={{ fontSize: 12.5, color: T.textHi, fontWeight: 600 }}
                  noWrap
                >
                  {i + 1}. {s.name}
                </Typography>
                <Typography
                  sx={{
                    ...display,
                    fontSize: 13,
                    fontWeight: 700,
                    color: T.committed,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {money(s.amount)}
                </Typography>
              </Box>
              <Box
                sx={{
                  height: 4,
                  borderRadius: "999px",
                  backgroundColor: T.panelSoft,
                  overflow: "hidden",
                  mt: 0.25,
                }}
              >
                <Box
                  sx={{
                    height: "100%",
                    width: `${(s.amount / maxAmount) * 100}%`,
                    borderRadius: "999px",
                    backgroundColor: T.committed,
                    opacity: 0.8,
                  }}
                />
              </Box>
            </Box>
          ))}
        </Box>

        {/* Logo wall */}
        {logos.length > 0 ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
              gap: 1.25,
              alignContent: "start",
            }}
          >
            {logos.map((s, i) => (
              <Tooltip key={`${s.org}-${i}`} title={s.org} arrow>
                <Box
                  sx={{
                    height: 64,
                    borderRadius: "10px",
                    // Logos are designed for light backgrounds; keep the tile
                    // white in both modes so brand marks stay legible.
                    backgroundColor: "#FFFFFF",
                    border: `1px solid ${T.line}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 1,
                    transition: "transform 180ms ease, box-shadow 180ms ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: T.hoverShadow,
                    },
                  }}
                >
                  <Box
                    component="img"
                    src={s.url as string}
                    alt={s.org}
                    sx={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                  />
                </Box>
              </Tooltip>
            ))}
          </Box>
        ) : (
          <Box
            sx={{
              border: `1px dashed ${T.line}`,
              borderRadius: "12px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              py: 4,
            }}
          >
            <HandshakeRoundedIcon sx={{ color: T.textFaint, fontSize: 32 }} />
            <Typography sx={{ fontSize: 12.5, color: T.textFaint, fontStyle: "italic" }}>
              No sponsor logos uploaded yet.
            </Typography>
          </Box>
        )}
      </Box>
    </Panel>
  );
};

export default SponsorSpotlight;
