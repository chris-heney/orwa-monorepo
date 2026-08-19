import React from "react";
import {
  DateField,
  FunctionField,
  List,
  TextField,
  useStore,
} from "react-admin";
import { Box } from "@mui/material";
import AgDatagrid from "../../_components/AgDatagrid";
import type { AgDatagridPrefs } from "../../_components/AgDatagrid";
import CustomPagination from "../../_components/CustomPagination";
import { useOrwefContext } from "../OrwefContextProvider";
import { buildScholarshipListFilter } from "../helpers/listFilters";
import { SCHOLARSHIP_SELECTED_IDS_KEY } from "./ScholarshipPrintButton";

const AG_PREFS_KEY = "agGrid.scholarship-applications";

const ScholarshipApplicationList = () => {
  const { search, status, year } = useOrwefContext();
  const [agPrefs] = useStore<AgDatagridPrefs>(AG_PREFS_KEY, {});
  const listPerPage = agPrefs.pageSize || 50;

  return (
    <Box sx={{ width: 1, minWidth: 0 }}>
      <List
        resource="scholarship-applications"
        title=" "
        actions={false}
        disableSyncWithLocation
        filter={buildScholarshipListFilter(search, status, year)}
        sort={{ field: "submission_date", order: "DESC" }}
        perPage={listPerPage}
        pagination={<CustomPagination />}
        sx={{
          "& .RaList-main": { marginTop: 0 },
          "& .RaList-content": { boxShadow: "none" },
          ".RaList-actions": { p: 0, minHeight: 0 },
        }}
      >
        <AgDatagrid
          preferenceKey={AG_PREFS_KEY}
          rowClick="show"
          rowSelection
          selectionStoreKey={SCHOLARSHIP_SELECTED_IDS_KEY}
        >
          <FunctionField
            label="Applicant"
            sortBy="applicant_last_name"
            render={(record: {
              applicant_first_name?: string;
              applicant_last_name?: string;
            }) =>
              `${record.applicant_first_name || ""} ${
                record.applicant_last_name || ""
              }`.trim()
            }
          />
          <TextField source="applicant_email" label="Email" />
          <TextField source="applicant_phone" label="Phone" />
          <TextField source="system_name" label="Water System" />
          <TextField source="gpa" label="GPA" />
          <TextField source="application_status" label="Status" />
          <DateField source="submission_date" label="Submitted" />
        </AgDatagrid>
      </List>
    </Box>
  );
};

export default ScholarshipApplicationList;
