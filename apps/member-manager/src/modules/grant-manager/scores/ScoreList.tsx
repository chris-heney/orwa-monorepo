import React, { useCallback, useEffect } from "react";
import {
  List,
  TextField,
  NumberField,
  DateField,
  ReferenceField,
  BooleanField,
  FunctionField,
  useRecordContext,
  useGetOne,
  useListFilterContext,
} from "react-admin";
import { DatagridConfigurable } from "@orwa/entity-id";
import { grantDatagridStyle } from "../_components/grantDatagridStyle";
import CustomPagination from "../../_components/CustomPagination";
import { Box, Typography, useTheme } from "@mui/material";
import GrantCollapsibleSearch from "../_components/GrantCollapsibleSearch";
import GrantOrLiveSearch from "../_components/GrantOrLiveSearch";
import { useGrantContext } from "../GrantContextProvider";
import { buildScoreFiscalYearFilter } from "../helpers/fiscalYearFilters";
import {
  buildScoresOrFilter,
  LEGACY_SCORE_SEARCH_KEYS,
  stripSearchKeys,
} from "../helpers/searchBarTabs";

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

const ScoresSearchActions = () => {
  const { filterValues, setFilters } = useListFilterContext();
  const { setSearchBarOpenForTab } = useGrantContext();

  const onClearSearch = useCallback(() => {
    setFilters(
      stripSearchKeys(
        filterValues as Record<string, unknown>,
        LEGACY_SCORE_SEARCH_KEYS
      ),
      null
    );
  }, [filterValues, setFilters]);

  useEffect(() => {
    const fv = filterValues as Record<string, unknown>;
    const has =
      Boolean(fv.$or) ||
      LEGACY_SCORE_SEARCH_KEYS.some((k) => Boolean(fv[k]));
    if (has) setSearchBarOpenForTab("application scores", true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- mount only

  return (
    <GrantCollapsibleSearch
      tab="application scores"
      onClearSearch={onClearSearch}
    >
      <GrantOrLiveSearch
        buildOr={buildScoresOrFilter}
        legacyKeys={LEGACY_SCORE_SEARCH_KEYS}
        placeholder="Search by name or ID"
      />
    </GrantCollapsibleSearch>
  );
};

const ScoreList = () => {
  const theme = useTheme();
  const { fiscalYearStart, fiscalYearEnd } = useGrantContext();
  const fyFilter = buildScoreFiscalYearFilter(fiscalYearStart, fiscalYearEnd);
  return (
    <List
      title={" "}
      resource="grant-application-scores"
      pagination={<CustomPagination />}
      actions={<ScoresSearchActions />}
      sort={{ field: "date", order: "DESC" }}
      disableSyncWithLocation
      filter={fyFilter ?? undefined}
      sx={{
        ".RaList-actions": {
          p: 0,
          minHeight: 0,
        },
      }}
    >
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
    </List>
  );
};

export default ScoreList;
