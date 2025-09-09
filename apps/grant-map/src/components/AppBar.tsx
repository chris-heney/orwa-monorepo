import * as React from "react";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import MenuIcon from "@mui/icons-material/Menu";
import { Button, useMediaQuery, IconButton } from "@mui/material";

import { useAppContext } from "../providers/AppContext";
import { useGetGrantApplications } from "../helpers/APIService";
import { handleSelectFilter, removeFilter } from "../helpers/FiltersService";

import BarChartIcon from "@mui/icons-material/BarChart"; // Import BarChart icon
import WaterDrop from "./WaterDrop";
import { Poop } from "./Poop";
import { Filter } from "../types/Filter";
import CountiesButton from "./CountiesButton";
import StatusButton from "./StatusButton";
import ProjectTypeButton from "./ProjectTypeButton";
import LogoutMenu from "./_components/LogoutMenu";

export const GappBar = () => {
  const [wastewater, setWastewater] = React.useState(0);
  const [drinkingWater, setDrinkingWater] = React.useState(0);
  const [poop, setPoop] = React.useState(false);
  const [waterDrop, setWaterDrop] = React.useState(false);
  const {
    filters,
    setFilters,
    setOpenStatistics,
    setActiveLayer,
    setSelectedRegions,
  } = useAppContext();
  const { setIsSidebarOpen } = useAppContext();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const getGrantApplications = useGetGrantApplications();

  const getLength = async (searchFilters: Filter[]): Promise<number> => {
    const data = await getGrantApplications(searchFilters);
    return data.length;
  };

  const isSmall = useMediaQuery("(max-width:900px)");

  React.useEffect(() => {
    getLength([{ key: "drinking_or_wastewater", value: "Wastewater" }]).then(
      (data) => setWastewater(data)
    );
    getLength([
      { key: "drinking_or_wastewater", value: "Drinking Water" },
    ]).then((data) => setDrinkingWater(data));
  }, []);

  const handleChartOpen = () => setOpenStatistics((prev) => !prev);

  return (
    <>
      <AppBar
        sx={{
          backgroundColor: "black",
          p: 0,
          position: "sticky",
          width: "100%",
          left: 0,
        }}
      >
        <Toolbar disableGutters sx={{ px: 1 }}>
          <Box
            sx={
              isSmall
                ? {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                  }
                : null
            }
          >
            <Button
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              size={isSmall ? "small" : "medium"}
              color="inherit"
              aria-label="open drawer"
              sx={{
                mr: isSmall ? null : 1,
              }}
            >
              <MenuIcon fontSize="small" sx={{ mr: 1, p: 0, pr: 0 }} />
            </Button>

            {/* Counties Button */}
            <CountiesButton setFilters={setFilters} filters={filters} />

            {/* Status Button */}
            <StatusButton setFilters={setFilters} filters={filters} />

            {!isSmall && (
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
                  mr: poop ? 2 : null,
                  filter: poop ? null : "grayscale(100%)",
                }}
              >
                <Badge badgeContent={wastewater} color="primary" max={1000}>
                  <Poop />
                </Badge>
              </Button>
            )}

            {poop && (
              <ProjectTypeButton
                classification="Wastewater"
                setFilters={setFilters}
                filters={filters}
              />
            )}

            {!isSmall && (
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
                  mr: waterDrop ? 2 : null,
                  filter: waterDrop ? null : "grayscale(100%)",
                }}
              >
                <Badge badgeContent={drinkingWater} color="primary" max={1000}>
                  <WaterDrop />
                </Badge>
              </Button>
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
          <Box sx={{ display: "flex", alignItems: "end" }}>
            <img
              height={isSmall ? "20px" : "40px"}
              src="./ORWA-white-300.webp"
            />
            <Typography
              fontWeight={"bold"}
              variant="h6"
              noWrap
              ml={1}
              sx={{ display: { xs: "none", sm: "block" } }}
            >
              Gapp Map
            </Typography>
          </Box>

          {/* Button to open the chart */}
          {!isSmall && (
            <IconButton
              color="inherit"
              onClick={handleChartOpen}
              sx={{ ml: 2 }}
            >
              <BarChartIcon />
            </IconButton>
          )}

          <LogoutMenu />
        </Toolbar>
      </AppBar>
    </>
  );
};

export default GappBar;
