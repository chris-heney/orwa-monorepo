import React from "react";
import {
  Box,
  Theme,
  Typography,
  useMediaQuery,
  useTheme,
  // Tooltip,
  // IconButton,
} from "@mui/material";
import { Button, CreateButton, ListBase, SelectColumnsButton, TopToolbar } from "react-admin";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
// import SettingsIcon from "@mui/icons-material/Settings";
import { useEmailManagementContext } from "./EmailManagementContextProvider";
import RecordCount from "../_components/RecordCount";

const EmailManagemenHeader = () => {

  const theme = useTheme();

  const {
    selectedTab,
    setIsFilterSidebarOpen,
    isSettingsOpen,
  } = useEmailManagementContext();

  const resource = selectedTab;
  const title = (
    selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)
  ).replace(/-/g, " ");
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        px: 1,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontSize: isSmall ? "10px" : null,
          alignItems: "center",
          color: "primary.contrastText",
          fontWeight: "bold",
          textTransform: "uppercase",
          textAlign: "left",
          ml: 1,
        }}
      >
        {isSettingsOpen ? "Settings" : title}
      </Typography>
      <TopToolbar>
        {resource !== null && !isSettingsOpen && (
          <ListBase
            disableSyncWithLocation
            exporter={undefined}
            resource={resource}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: 2,
                alignItems: "center",
              }}
            >
              <RecordCount />
            
              {selectedTab !==  "email-logs"  && <CreateButton size="small" sx={{ color: "primary.contrastText" }}/>}

              <SelectColumnsButton
                sx={{
                  color: "primary.contrastText",
                }}
              />

              <Button
                label="Filter"
                sx={{
                  color: "primary.contrastText",
                  mr: 2,
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
          </ListBase>
        )}
        {/* <Tooltip title="Settings">
          <IconButton
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            size="small"
            color="primary"
          >
            <SettingsIcon
              fontSize="small"
              sx={{
                "&:hover": {
                  color: "white",
                },
              }}
              style={!isSettingsOpen ? { stroke: "white" } : { fill: "white" }}
            />
          </IconButton>
        </Tooltip> */}
      </TopToolbar>
    </Box>
  );
};

export default EmailManagemenHeader;
