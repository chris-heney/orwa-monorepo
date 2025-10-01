import React, { useState } from "react";
import { useMembershipContext } from "../MembershipsContextProvider";
import {
  Box,
  Theme,
  Typography,
  useMediaQuery,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  useTheme,
} from "@mui/material";
import {
  Button,
  ConfigurableDatagridColumn,
  ListBase,
  SelectColumnsButton,
  TopToolbar,
  useStore,
  useDataProvider,
} from "react-admin";
import CustomCreateButton from "../../_components/CustomCreateButton";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import GridViewIcon from "@mui/icons-material/GridView";
import ViewListIcon from "@mui/icons-material/ViewList";
import RecordCount from "../../_components/RecordCount";
import { NaylorExportWaterSystem } from "../helpers/naylorExportWaterSystem";
import { NaylorExportAssociate } from "../helpers/naylorExportAssociate";
import useCurrentUser from "../../_helpers/useCurrentUser";
import { defaultWatersystemExport } from "../helpers/defaultWatersystemExport";
import { defaultAssociateExport } from "../helpers/defaultAssociateExport";

const Membershipheader = () => {
  const theme = useTheme();
  const {
    selectedTab,
    setIsFilterSidebarOpen,
    watersystemFilters,
    associateFilters,
    isSettingsOpen,
    isGridView,
    setIsGridView,
  } = useMembershipContext();

  const { role } = useCurrentUser();

  const resource = selectedTab === "summary" ? null : selectedTab;
  const title =
    selectedTab === "invoices"
      ? "Transactions"
      : selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1);

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
  const [exportType, setExportType] = useState<string>("");

  const handleExport = async (exportType: string) => {
    if (!resource) {
      console.error("Resource is null, cannot perform export.");
      return;
    }

    const { data: records } = await dataProvider.getList(resource, {
      pagination: { page: 1, perPage: 1000 }, // Adjust pagination as needed
      sort: { field: "id", order: "ASC" }, // Adjust sorting as needed
      filter:
        exportType === "default"
          ? resource === "watersystems"
            ? watersystemFilters
            : associateFilters
          : {},
    });

    if (exportType === "default") {
      if (resource === "watersystems") {
        defaultWatersystemExport(
          records,
          availableColumns,
          columnIds,
          `${title}-${new Date().toLocaleDateString()}`
        );
      } else if (resource === "associates") {
        defaultAssociateExport(
          records,
          availableColumns,
          columnIds,
          `${title}-${new Date().toLocaleDateString()}`,
          dataProvider
        );
      }
    } else if (exportType === "naylor") {
      if (resource === "watersystems") {
        NaylorExportWaterSystem(
          records,
          availableColumns,
          columnIds,
          `${title}-${new Date().toLocaleDateString()}`
        );
      } else if (resource === "associates") {
        NaylorExportAssociate(
          records,
          `${title}-${new Date().toLocaleDateString()}`,
          dataProvider
        );
      }
    }

    // Reset the select input after export
    setExportType("");
  };

  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));

  const handleViewToggle = () => {
    setIsGridView(!isGridView);
  };

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
            filter={
              resource === "watersystems"
                ? watersystemFilters
                : resource === "associates"
                ? associateFilters
                : {}
            }
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
              {role === "Admin" && (
                <CustomCreateButton
                  sx={{
                    color: "primary.contrastText",
                  }}
                  label={`Add ${title.slice(0, title.length - 1)}`}
                />
              )}

              <SelectColumnsButton
                sx={{
                  color: "primary.contrastText",
                }}
              />

              <Select
                value={exportType}
                displayEmpty
                sx={{
                  color: "primary.contrastText",
                }}
                size="small"
                onChange={(e) => {
                  setExportType(e.target.value as string);
                  handleExport(e.target.value as string);
                }}
              >
                <MenuItem value="" disabled>
                  Select Export
                </MenuItem>
                <MenuItem value="default">Default Export</MenuItem>
                <MenuItem value="naylor">Naylor Export</MenuItem>
              </Select>

              {/* Grid View Toggle Button - Only show for associates */}
              {resource === "associates" && (
                <Tooltip title={isGridView ? "Switch to List View" : "Switch to Grid View"}>
                  <IconButton
                    onClick={handleViewToggle}
                    sx={{
                      color: "primary.contrastText",
                    }}
                  >
                    {isGridView ? <ViewListIcon /> : <GridViewIcon />}
                  </IconButton>
                </Tooltip>
              )}

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
      </TopToolbar>
    </Box>
  );
};

export default Membershipheader;
