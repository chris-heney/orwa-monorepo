import React from "react";
import {
  List,
  TextField,
  DatagridConfigurable,
  NumberField,
  DateField,
  ReferenceField,
  BooleanField,
  FunctionField,
  useRecordContext,
  useGetOne,
  FilterLiveSearch,
} from "react-admin";
import { customDatagridStyle } from "../../../css";
import CustomPagination from "../../_components/CustomPagination";
import { Box, Typography } from "@mui/material";

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

const ScoreList = () => {
  return (
    <List
      title={" "}
      resource="grant-application-scores"
      pagination={<CustomPagination />}
      actions={
        <Box sx={{ display: "flex", gap: 2 }}>
          <FilterLiveSearch
            helperText="Search by application id"
            // or application_id
            source="grant_application][application_id][$contains"
          />
          <FilterLiveSearch
            helperText="Search by application name"
            source="grant_application][legal_entity_name][$contains"
          />
        </Box>
      }
      sort={{ field: "date", order: "DESC" }}
      disableSyncWithLocation
      sx={{
        " .RaList-actions": {
          display: "flex",
          justifyContent: "flex-start",
          px: 2,
        },
      }}
    >
      <DatagridConfigurable
        bulkActionButtons={false}
        sx={customDatagridStyle}
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
        {/* link to the scoring sheets orwa.org/application-search/?key=email */}
        <FunctionField label="Score Sheet" render={() => <ScoreSheetLink />} />
      </DatagridConfigurable>
    </List>
  );
};

export default ScoreList;
