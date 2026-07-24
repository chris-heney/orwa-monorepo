import * as React from "react";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import MenuIcon from "@mui/icons-material/Menu";
import { Button, useMediaQuery, Tooltip } from "@mui/material";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";

import { useAppContext } from "../providers/AppContext";
import { handleSelectFilter, removeFilter } from "../helpers/FiltersService";

import WaterDrop from "./WaterDrop";
import { Poop } from "./Poop";
import CountiesButton from "./CountiesButton";
import StatusButton from "./StatusButton";
import ProjectTypeButton from "./ProjectTypeButton";
import LogoutMenu from "./_components/LogoutMenu";
import { FySelect } from "./insights/InsightsPanel";
import { T, display } from "../theme/tokens";

const barButtonSx = {
  color: T.textLo,
  textTransform: "none" as const,
  borderRadius: "10px",
  "&:hover": { color: T.textHi, backgroundColor: T.panelSoft },
};

export const GappBar = () => {
  const [poop, setPoop] = React.useState(false);
  const [waterDrop, setWaterDrop] = React.useState(false);
  const {
    filters,
    setFilters,
    insightsOpen,
    setInsightsOpen,
    setActiveLayer,
    setSelectedRegions,
    allApplications,
  } = useAppContext();
  const { setIsSidebarOpen } = useAppContext();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Counts come from the already-loaded full set — no extra API round trips.
  const wastewater = React.useMemo(
    () =>
      allApplications.filter((a) => a.drinking_or_wastewater === "Wastewater")
        .length,
    [allApplications]
  );
  const drinkingWater = React.useMemo(
    () =>
      allApplications.filter(
        (a) => a.drinking_or_wastewater === "Drinking Water"
      ).length,
    [allApplications]
  );

  const isSmall = useMediaQuery("(max-width:900px)");

  return (
    <>
      <AppBar
        elevation={0}
        sx={{
          backgroundColor: T.ink,
          backgroundImage: "none",
          borderBottom: `1px solid ${T.line}`,
          p: 0,
          position: "sticky",
          width: "100%",
          left: 0,
        }}
      >
        <Toolbar disableGutters sx={{ px: 1, gap: 0.5 }}>
          {/* Brand */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mr: 1.5 }}>
            <img
              height={isSmall ? "22px" : "34px"}
              src="./ORWA-white-300.webp"
              alt="ORWA"
            />
            <Box sx={{ display: { xs: "none", sm: "block" }, textAlign: "left" }}>
              <Typography
                sx={{
                  ...display,
                  fontSize: 9,
                  fontWeight: 600,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: T.water,
                  lineHeight: 1.1,
                }}
              >
                Rural Infrastructure Grant
              </Typography>
              <Typography
                sx={{
                  ...display,
                  fontSize: 19,
                  fontWeight: 700,
                  color: T.textHi,
                  lineHeight: 1.1,
                  whiteSpace: "nowrap",
                }}
              >
                Grant Map
              </Typography>
            </Box>
          </Box>

          <Box
            sx={
              isSmall
                ? {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                  }
                : { display: "flex", alignItems: "center", gap: 0.5 }
            }
          >
            <Tooltip title="Application list" arrow>
              <Button
                onClick={() => setIsSidebarOpen((prev) => !prev)}
                size={isSmall ? "small" : "medium"}
                aria-label="open drawer"
                sx={barButtonSx}
              >
                <MenuIcon fontSize="small" />
              </Button>
            </Tooltip>

            {/* Fiscal year scope */}
            <FySelect compact />

            {/* Counties Button */}
            <CountiesButton setFilters={setFilters} filters={filters} />

            {/* Status Button */}
            <StatusButton setFilters={setFilters} filters={filters} />

            {!isSmall && (
              <Tooltip title="Wastewater systems" arrow>
                <Button
                  onClick={() => {
                    poop
                      ? removeFilter(
                          "drinking_or_wastewater",
                          "Wastewater",
                          filters,
                          setFilters
                        )
                      : handleSelectFilter(
                          "drinking_or_wastewater",
                          "Wastewater",
                          filters,
                          setFilters
                        );
                    poop ? setPoop(false) : setPoop(true);
                  }}
                  sx={{
                    ...barButtonSx,
                    mr: poop ? 2 : null,
                    filter: poop ? null : "grayscale(100%)",
                    opacity: poop ? 1 : 0.65,
                  }}
                >
                  <Badge badgeContent={wastewater} color="primary" max={1000}>
                    <Poop />
                  </Badge>
                </Button>
              </Tooltip>
            )}

            {poop && (
              <ProjectTypeButton
                classification="Wastewater"
                setFilters={setFilters}
                filters={filters}
              />
            )}

            {!isSmall && (
              <Tooltip title="Drinking water systems" arrow>
                <Button
                  onClick={() => {
                    waterDrop
                      ? removeFilter(
                          "drinking_or_wastewater",
                          "Drinking Water",
                          filters,
                          setFilters
                        )
                      : handleSelectFilter(
                          "drinking_or_wastewater",
                          "Drinking Water",
                          filters,
                          setFilters
                        );
                    waterDrop ? setWaterDrop(false) : setWaterDrop(true);
                  }}
                  sx={{
                    ...barButtonSx,
                    mr: waterDrop ? 2 : null,
                    filter: waterDrop ? null : "grayscale(100%)",
                    opacity: waterDrop ? 1 : 0.65,
                  }}
                >
                  <Badge badgeContent={drinkingWater} color="primary" max={1000}>
                    <WaterDrop />
                  </Badge>
                </Button>
              </Tooltip>
            )}

            {waterDrop && (
              <ProjectTypeButton
                classification="Drinking Water"
                setFilters={setFilters}
                filters={filters}
              />
            )}
            <Button
              size={isSmall ? "small" : "medium"}
              sx={{
                ...barButtonSx,
                p: 0,
                minWidth: isSmall ? 0 : null,
                mr: isSmall ? 1 : null,
              }}
              disabled={!poop && !waterDrop && filters.length === 0}
              onClick={() => {
                if (user.email === "rig@orwa.org") {
                  setFilters([
                    {
                      key: "status",
                      value: [3, 6, 8, 12, 13, 14],
                    },
                  ]);
                } else {
                  setFilters([]);
                }
                setPoop(false);
                setWaterDrop(false);
                setActiveLayer(null);
                setSelectedRegions([]);
              }}
            >
              Clear
            </Button>
          </Box>
          <Box sx={{ flexGrow: 1 }} />

          {/* Insights toggle */}
          {!isSmall && (
            <Button
              onClick={() => setInsightsOpen((prev) => !prev)}
              startIcon={<InsightsRoundedIcon fontSize="small" />}
              sx={{
                ...display,
                fontWeight: 600,
                textTransform: "none",
                color: insightsOpen ? T.textHi : T.textLo,
                backgroundColor: insightsOpen ? T.panelSoft : T.panel,
                border: `1px solid ${T.line}`,
                borderRadius: "10px",
                boxShadow: insightsOpen ? `inset 0 -2px 0 ${T.water}` : "none",
                px: 1.75,
                mr: 1,
                "&:hover": { backgroundColor: T.panelSoft, color: T.textHi },
              }}
            >
              Insights
            </Button>
          )}

          <LogoutMenu />
        </Toolbar>
      </AppBar>
    </>
  );
};

export default GappBar;
