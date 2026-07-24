import { useState } from "react";
import { Box, Switch, Typography } from "@mui/material";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { T, display } from "../theme/tokens";
import { MAP_STAGE_LEGEND } from "../helpers/stages";
import { useMapContext } from "../providers/MapContext";

/**
 * Bottom-left map legend: the county funding heat ramp (with its toggle) and
 * the lifecycle stage colors the application markers use.
 */
const MapLegend = () => {
  const { showChoropleth, setShowChoropleth } = useMapContext();
  const [collapsed, setCollapsed] = useState(window.innerWidth < 900);

  return (
    <Box
      sx={{
        position: "absolute",
        bottom: 24,
        left: 12,
        zIndex: 900,
        backgroundColor: `${T.panel}F0`,
        border: `1px solid ${T.line}`,
        borderRadius: "14px",
        px: 1.75,
        py: 1.25,
        width: 208,
        boxShadow: T.hoverShadow,
        textAlign: "left",
      }}
    >
      <Box
        onClick={() => setCollapsed((prev) => !prev)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
        }}
      >
        <Typography
          sx={{
            ...display,
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: T.textLo,
          }}
        >
          Legend
        </Typography>
        <KeyboardArrowDownRoundedIcon
          sx={{
            fontSize: 18,
            color: T.textLo,
            transform: collapsed ? "rotate(180deg)" : "none",
            transition: "transform 200ms ease",
          }}
        />
      </Box>

      {!collapsed && (
        <>
          {/* Funding heat */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mt: 1,
            }}
          >
            <Typography sx={{ fontSize: 12, color: T.textHi }}>
              County funding heat
            </Typography>
            <Switch
              size="small"
              checked={showChoropleth}
              onChange={(e) => setShowChoropleth(e.target.checked)}
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": { color: T.water },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                  backgroundColor: T.water,
                },
              }}
            />
          </Box>
          {showChoropleth && (
            <Box sx={{ mb: 1 }}>
              <Box
                sx={{
                  height: 8,
                  borderRadius: 4,
                  background: `linear-gradient(90deg, ${T.water}08, ${T.water}A0)`,
                  border: `1px solid ${T.line}`,
                }}
              />
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography sx={{ fontSize: 10, color: T.textFaint }}>
                  $0 approved
                </Typography>
                <Typography sx={{ fontSize: 10, color: T.textFaint }}>
                  most approved
                </Typography>
              </Box>
            </Box>
          )}

          {/* Stage colors */}
          <Typography
            sx={{
              fontSize: 10.5,
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: T.textFaint,
              mt: 0.5,
              mb: 0.5,
            }}
          >
            Application markers
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              rowGap: 0.4,
              columnGap: 1,
            }}
          >
            {MAP_STAGE_LEGEND.map((entry) => (
              <Box
                key={entry.key}
                sx={{ display: "flex", alignItems: "center", gap: 0.6 }}
              >
                <Box
                  sx={{
                    width: 9,
                    height: 9,
                    borderRadius: "50%",
                    backgroundColor: T.stage[entry.key],
                    border: "1px solid rgba(255,255,255,0.4)",
                    flexShrink: 0,
                  }}
                />
                <Typography
                  sx={{ fontSize: 10.5, color: T.textLo, whiteSpace: "nowrap" }}
                >
                  {entry.label}
                </Typography>
              </Box>
            ))}
          </Box>
          <Typography sx={{ fontSize: 10, color: T.textFaint, mt: 0.75 }}>
            Marker size scales with award amount
          </Typography>
        </>
      )}
    </Box>
  );
};

export default MapLegend;
