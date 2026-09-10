import React from "react";
import {
  ListView,
  TextField,
  NumberField,
  DateField,
  ReferenceField,
  BooleanField,
  FunctionField,
  useRecordContext,
  useGetOne,
} from "react-admin";
import { DatagridConfigurable } from "@orwa/entity-id";
import { grantDatagridStyle } from "../_components/grantDatagridStyle";
import CustomPagination from "../../_components/CustomPagination";
import { Box, Typography, useTheme } from "@mui/material";
import {
  buildScoresOrFilter,
  LEGACY_SCORE_SEARCH_KEYS,
} from "../helpers/searchBarTabs";
import { useAutoOpenSearch, useSearchOrMirror } from "../helpers/useGrantSearch";

const ScoreSheetLink = () => {
  const record = useRecordContext();
  const { data: application } = useGetOne("grant-application-finals", {
    id: record.grant_application,
  });

  if (!application) return "No Application Found";

  return (
    <a
      href={`https://orwa.org/application-search/?email=${
        application.application_id ?? application.id
      }`}
      target="_blank"
      rel="noopener noreferrer"
    >
      View
    </a>
  );
};

/**
 * Scoresheets tab — renders inside the framework's ListScope; the fiscal-year
 * filter lives in `manifest.tsx`, the search row's `q` is mirrored into the
 * `grant_application` `$or` filter.
 */
const ScorePanel = () => {
  const theme = useTheme();
  useSearchOrMirror(buildScoresOrFilter, LEGACY_SCORE_SEARCH_KEYS);
  useAutoOpenSearch();
  return (
    <ListView actions={false} title={" "} pagination={<CustomPagination />}>
      <DatagridConfigurable
        bulkActionButtons={false}
        sx={grantDatagridStyle(theme)}
        expandSingle={true}
        rowClick="expand"
        isRowExpandable={() => true}
        isRowSelectable={() => false}
        expand={(record) => {
          return (
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Notes:
              </Typography>
              {record.record.notes ? (
                <TextField source="notes" label="Notes" />
              ) : (
                "No notes"
              )}
            </Box>
          );
        }}
      >
        <ReferenceField
          source="grant_application"
          reference="grant-application-finals"
          label="ID"
          link={false}
          sortBy="grant_application.application_id"
        >
          <TextField source="application_id" label="Name" noWrap />
        </ReferenceField>
        <ReferenceField
          source="grant_application"
          reference="grant-application-finals"
          label="COR"
          link={false}
          sortBy="grant_application.change_order_request"
        >
          <TextField source="change_order_request" label="COR" noWrap />
        </ReferenceField>
        <ReferenceField
          source="grant_application"
          reference="grant-application-finals"
          label="Applicant"
          link={false}
          sortBy="grant_application.legal_entity_name"
        >
          <TextField source="legal_entity_name" label="Name" noWrap />
        </ReferenceField>

        <NumberField source="score" label="Score" noWrap />
        <DateField source="date" label="Date" noWrap />
        <BooleanField source="approved" label="Approved" />
        <ReferenceField
          source="grant_application"
          reference="grant-application-finals"
          label="Email"
          link={false}
          sortBy="grant_application.point_of_contact.email"
        >
          <FunctionField
            render={(record) =>
              record.email ? (
                <TextField source="email" label="Name" noWrap />
              ) : (
                <ReferenceField
                  source="point_of_contact"
                  reference="contacts"
                  label="Email"
                >
                  <TextField source="email" noWrap />
                </ReferenceField>
              )
            }
          />
        </ReferenceField>
        <FunctionField label="Score Sheet" render={() => <ScoreSheetLink />} />
      </DatagridConfigurable>
    </ListView>
  );
};

export default ScorePanel;
