import React from "react";
import { Box, Theme, Typography, useMediaQuery, useTheme } from "@mui/material";
import {
  Button,
  ConfigurableDatagridColumn,
  ListBase,
  SelectColumnsButton,
  TopToolbar,
  useStore,
  useDataProvider,
  ExportButton,
} from "react-admin";
import CustomCreateButton from "../../_components/CustomCreateButton";
import CustomExportFunction from "../../../helpers/custom-export-function";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import RecordCount from "../../_components/RecordCount";
import { useHumanResourcesContext } from "../HumanResourcesContext";
import CreateUserModal from "../users/CreateUserModal";
import SettingsIcon from "@mui/icons-material/Settings";
import { formatTitle } from "../../../helpers/formatResourceTitle";
import CustomContactExport from "../contacts/CustomContactExport";
import useCurrentUser from "../../_helpers/useCurrentUser";
import RolesContextProvider from "../../../context/RolesContextProvider";

const HumanResourcesHeader = () => {
  const theme = useTheme();
  const {
    selectedTab,
    setIsFilterSidebarOpen,
    setIsSettingsOpen,
    isSettingsOpen,
    contactFilters,
    staffFilters,
    instructorFilters,
    userFilters,
  } = useHumanResourcesContext();

  const { role } = useCurrentUser();

  const resource = selectedTab;

  const preferenceKey = `${resource}.datagrid`;

  const [availableColumns] = useStore<ConfigurableDatagridColumn[]>(
    `preferences.${preferenceKey}.availableColumns`,
    []
  );

  const [columnIds] = useStore<string[]>(
    `preferences.${preferenceKey}.columns`,
    []
  );

  const dataProvider = useDataProvider();

  // Get current filters based on selected tab
  const getCurrentFilters = () => {
    switch (selectedTab) {
      case "contacts":
        return contactFilters || {};
      case "staff":
        return staffFilters || {};
      case "training-instructors":
        return instructorFilters || {};
      case "users":
        return userFilters || {};
      default:
        return {};
    }
  };

  const handleExport = async () => {
    if (!resource) {
      console.error("Resource is null, cannot perform export.");
      return;
    }

    const { data: records } = await dataProvider.getList(resource, {
      pagination: { page: 1, perPage: 1000 }, // Adjust pagination as needed
      sort: { field: "id", order: "ASC" }, // Adjust sorting as needed
      filter: getCurrentFilters(),
    });

    if (selectedTab === "contacts") {
      CustomContactExport(
        "contacts",
        availableColumns,
        columnIds,
        dataProvider,
        `${formatTitle(resource)}-${new Date().toLocaleDateString()}`
      );
    } else {
      CustomExportFunction(
        records,
        availableColumns,
        columnIds,
        `${formatTitle(resource)}-${new Date().toLocaleDateString()}`
      );
    }
  };

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
        }}
      >
        {isSettingsOpen ? "Settings" : formatTitle(resource)}
      </Typography>
      <TopToolbar>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 1,
          }}
        >
          {resource !== null && !isSettingsOpen && (
            <ListBase
              disableSyncWithLocation
              exporter={() => handleExport()}
              resource={resource}
              filter={getCurrentFilters()}
              filterDefaultValues={getCurrentFilters()}
            >
              {resource !== "users" && <RecordCount />}

              {selectedTab === "contacts" && (
                <SelectColumnsButton
                  sx={{
                    color: "primary.contrastText",
                  }}
                />
              )}

              {resource !== "users" && (
                <ExportButton
                  size="small"
                  sx={{
                    color: "primary.contrastText",
                  }}
                />
              )}
              {resource === "users" && (
                <RolesContextProvider>
                  <CreateUserModal isSmall />
                </RolesContextProvider>
              )}

              {resource !== "users" && role === "Admin" && (
                <CustomCreateButton
                  size="small"
                  sx={{
                    color: "primary.contrastText",
                  }}
                  label=""
                />
              )}

              <Button
                sx={{
                  color: "primary.contrastText",
                }}
                size="small"
                onClick={() => {
                  setIsFilterSidebarOpen((prev) => !prev);
                  setTimeout(() => {
                    window.scrollTo(document.body.scrollWidth, 0);
                  }, 150);
                }}
              >
                <FilterAltIcon />
              </Button>
            </ListBase>
          )}
          {role === "Admin" && (
            <Button
              onClick={() => {
                setIsSettingsOpen((prev) => !prev);
              }}
              size="small"
            >
              <SettingsIcon
                fontSize="small"
                sx={{
                  color: "primary.contrastText",
                  "&:hover": {
                    color: "primary.contrastText",
                  },
                }}
              />
            </Button>
          )}
        </Box>
      </TopToolbar>
    </Box>
  );
};

export default HumanResourcesHeader;
