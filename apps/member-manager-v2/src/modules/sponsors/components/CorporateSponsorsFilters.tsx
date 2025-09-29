import React, { useState } from "react";
import {
  Card,
  CardContent,
  Divider,
  IconButton,
  useMediaQuery,
  Tooltip,
} from "@mui/material";
import { Theme } from "@mui/material/styles";
import { FilterList, FilterListItem, FilterLiveSearch } from "react-admin";
import { useCorporateSponsorsContext } from "../CorporateSponsorsContext";
import { Favorite } from "@mui/icons-material";
import CustomHeader from "../../_components/CustomHeader";
import ActiveIcon from "@mui/icons-material/CheckCircle";
import { isSelected, toggleFilter } from "../../conference/helpers/selectFilters";
import SavedFilters from "../../_components/SavedFilters";

const CorporateSponsorsFilters = () => {
  const { isFilterSidebarOpen, savingQuery, setSavingQuery } =
    useCorporateSponsorsContext();

  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));
  if (!isFilterSidebarOpen && !isSmall) {
    return null;
  }

    return (
    <Card
      sx={{
        // order: -1,
        width: 250,
        position: isSmall ? "absolute" : "relative",
        zIndex: isSmall ? 100 : "auto",
        backgroundColor: "white",
        boxShadow: isSmall ? 3 : 1,
        p: 0,
        mb: 2,
      }}
    >
      <CustomHeader
        title="Filters"
        Component={() => {
          return (
            <Tooltip title="Close Filters">
              <IconButton onClick={() => setSavingQuery((prev) => !prev)} color="primary">
                <Favorite
                  fontSize="small"
                  sx={{
                    color: "white",
                  }}
                />
              </IconButton>
            </Tooltip>
          );
        }}
      />
      <CardContent sx={{ p: 1 }}>

      <SavedFilters
          resource={"corporate-sponsors"} 
          savingQuery={savingQuery}
          setSavingQuery={setSavingQuery}
        />

        <FilterLiveSearch
          source="name][$contains"
          label="Search by Name"
          alwaysOn
        />

        <Divider sx={{ mb: 2 }} />

        <FilterList label="Status" icon={<ActiveIcon />}>
          <FilterListItem
            label="Active"
            value={{ active: true }}
            isSelected={isSelected}
            toggleFilter={(val, filters) =>
              toggleFilter(val, filters, undefined, false)
            }
          />
          <FilterListItem
            label="Inactive"
            value={{ active: false }}
            isSelected={isSelected}
            toggleFilter={(val, filters) =>
              toggleFilter(val, filters, undefined, false)
            }
          />
          {/* <FilterListItem label="All" value={{}} /> */}
        </FilterList>
      </CardContent>
    </Card>
  );
};

export default CorporateSponsorsFilters;
