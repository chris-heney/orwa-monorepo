import React from "react";
import { Box, Theme, Typography, useMediaQuery } from "@mui/material";
import {
  Button,
  ExportButton,
  SelectColumnsButton,
  TopToolbar,
  useRedirect,
} from "react-admin";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import AddIcon from "@mui/icons-material/Add";
import RecordCount from "../../_components/RecordCount";
import { useCorporateSponsorsContext } from "../CorporateSponsorsContext";

const CorporateSponsorsHeader = () => {
  const {
    toggleFilterSidebar,
  } = useCorporateSponsorsContext();

  const redirect = useRedirect();

  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#262626",
        px: 1,
        py: 0,
        borderTopRightRadius: 3,
        borderTopLeftRadius: 3,
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
       Corporate Sponsors
      </Typography>
      {!isSmall && <TopToolbar>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: isSmall ? 0 : 2,
          }}
        >
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
                  redirect("/corporate-sponsors/create");
                }}
                sx={{
                  color: "white",
                }}
                label={`Add Corporate Sponsor`}
              >
                <AddIcon />
              </Button>

              {/* Columns Button */}
{/* 
              <SelectColumnsButton
                style={{
                  color: "white",
                }}
              /> */}

              {/* Export Button */}
              <ExportButton
                sx={{
                  color: "white",
                }}
              />
            </>

          <Button
            label="Filter"
            sx={{
              color: "white",
              mr: isSmall ? 0 : 2,
            }}
            onClick={() => {
              toggleFilterSidebar();
            }}
          >
            <FilterAltIcon />
          </Button>
        </Box>
      </TopToolbar>}
    </Box>
  );
};

export default CorporateSponsorsHeader;
