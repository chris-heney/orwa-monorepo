import React from "react";
import { Box, Theme, Typography, useMediaQuery } from "@mui/material";
import {
  Button,
  ExportButton,
  Loading,
  SelectColumnsButton,
  TopToolbar,
  useListContext,
  useRedirect,
} from "react-admin";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import AddIcon from "@mui/icons-material/Add";
import RecordCount from "../_components/RecordCount";
import { useConferenceContext } from "./ConferenceContext";
import VendorAttendeeExportButton from "./components/VendorAttendeeExportButton";
import { getPrimaryConferenceId } from "./helpers/mergeConferenceAcrossTabFilters";

const ConferenceHeader = () => {
  const {
    selectedTab,
    setIsFilterSidebarOpen,
    conferences,
    resource,
    setIsCreating,
  } = useConferenceContext();

  const { filterValues } = useListContext();
  const titleConferenceId = getPrimaryConferenceId(filterValues);

  const redirect = useRedirect();

  const title = selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1);

  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));


  return conferences.length === 0 ? (
    <Loading />
  ) : (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#262626",
        px: 1,
        py: isSmall ? 1 : 0,
      }}
    >
      <Typography
        variant={isSmall ? "subtitle2" : "h6"}
        sx={{
          alignItems: "center",
          color: "white",
          fontWeight: "bold",
          textTransform: "uppercase",
          textAlign: "left",
        }}
      >
        {titleConferenceId != null
          ? conferences.find((conference) => conference.id === titleConferenceId)
              ?.name
          : "All Conferences"}{" "}
        : {title}
      </Typography>
      {!isSmall && <TopToolbar>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: isSmall ? 0 : 2,
          }}
        >
          {resource !== "" && (
            <>
              {/* remount this componenet on tab change */}
              {/* {!remount&& <FilterLiveSearch
                resettable
                InputProps={{
                  sx: {
                    color: 'white'
                  }
                }} sx={{

                }}
              />} */}
              {!isSmall && <RecordCount />}
              <Button
                onClick={() => {
                  if (selectedTab === "sponsors") {
                    redirect("/conference-sponsors/create");
                  } else {
                    setIsCreating((prev) => !prev);
                  }
                }}
                sx={{
                  color: "white",
                }}
                label={`Add ${
                  title.endsWith("s")
                    ? title.slice(0, -1).split("-").join(" ")
                    : title.split("-").join(" ")
                }`}
              >
                <AddIcon />
              </Button>

              {/* Columns Button */}

              <SelectColumnsButton
                style={{
                  color: "white",
                }}
              />

              {/* Export Button */}
              <ExportButton
                sx={{
                  color: "white",
                }}
              />
              <VendorAttendeeExportButton />
            </>
          )}

          <Button
            label="Filter"
            sx={{
              color: "white",
              mr: isSmall ? 0 : 2,
            }}
            onClick={() => {
              setIsFilterSidebarOpen((prev) => !prev);
              setTimeout(() => {
                window.scrollTo(document.body.scrollWidth, 0);
              }, 150);
            }}
          >
            <FilterAltIcon />
          </Button>
        </Box>
      </TopToolbar>}
    </Box>
  );
};

export default ConferenceHeader;
