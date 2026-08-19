import React from "react";
import {
  FunctionField,
  List,
  TextField,
  useStore,
} from "react-admin";
import { Box } from "@mui/material";
import AgDatagrid from "../../_components/AgDatagrid";
import type { AgDatagridPrefs } from "../../_components/AgDatagrid";
import CustomPagination from "../../_components/CustomPagination";
import { useAwardContext } from "../AwardContextProvider";
import { buildAwardListFilter } from "../helpers/listFilters";

const AG_PREFS_KEY = "agGrid.award-nominations";

const AwardNominationList = () => {
  const { search, status, year } = useAwardContext();
  const [agPrefs] = useStore<AgDatagridPrefs>(AG_PREFS_KEY, {});
  const listPerPage = agPrefs.pageSize || 50;

  return (
    <Box sx={{ width: 1, minWidth: 0 }}>
      <List
        resource="award-nominations"
        title=" "
        actions={false}
        disableSyncWithLocation
        filter={buildAwardListFilter(search, status, year)}
        sort={{ field: "award_year", order: "DESC" }}
        perPage={listPerPage}
        pagination={<CustomPagination />}
        sx={{
          "& .RaList-main": { marginTop: 0 },
          "& .RaList-content": { boxShadow: "none" },
          ".RaList-actions": { p: 0, minHeight: 0 },
        }}
      >
        <AgDatagrid preferenceKey={AG_PREFS_KEY} rowClick="show">
          <TextField source="nominee_name" label="Nominee" />
          <TextField source="email" label="Email" />
          <TextField source="system_name" label="System" />
          <TextField source="award_type" label="Award" />
          <TextField source="award_year" label="Year" />
          <TextField source="nomination_status" label="Status" />
          <FunctionField
            label="County"
            sortBy="county"
            render={(record: { county?: string }) => record.county || ""}
          />
        </AgDatagrid>
      </List>
    </Box>
  );
};

export default AwardNominationList;
