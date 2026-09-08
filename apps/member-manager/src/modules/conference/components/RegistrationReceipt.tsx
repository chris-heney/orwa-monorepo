import React from "react";
import {
  useShowContext,
  TextField,
  ReferenceField,
  ReferenceArrayField,
  NumberField,
  ArrayField,
  FunctionField,
  RaRecord,
  RecordContextProvider,
} from "react-admin";
import { Grid, Typography, Box, Chip } from "@mui/material";
import { CurrencyOptions } from "../../../config/Settings";
import { ISharedMeta } from "../types/IConference";
import { formatNumber } from "../../../helpers/Formators";
import { freeVendorAllowance } from "../helpers/freeVendorAllowance";
import AttendeeTicketPriceField from "./AttendeeTicketPriceField";
import { Datagrid } from "@orwa/entity-id";
import { getDisplayEntityId } from "../../../helpers/strapiIds";
import { buildRegistrationReceiptRecord } from "../helpers/registrationReceiptContestants";

// interface IRegistrant {
//   id: number;
//   registration_date: string;
//   total: number;
//   createdAt: string;
//   updatedAt: string;
//   year: number;
//   wp_eid: null;
//   passport_id: null;
//   payment_method: string;
//   organization: string;
//   type: string;
//   non_member_fee: boolean;
//   registration_source: string;
//   conference: number; //relation to conference
//   registrant: number; //relation to registrant
//   attendees: number[]; //relation to attendees
//   booths: any[]; //relation to booths
//   sponsorships: any[]; //relation to sponsorships
//   address: {
//     id: number;
//     street: string;
//     city: string;
//     state: string;
//     zip: string;
//     name: null;
//   };
//   items: any[];
//   conference_sponsor: {
//     //relation to conference_sponsor
//     data: null;
//   };
//   team: {
//     data: null; //relation to team
//   };
//   contestants: any[]; //relation to contestants
//   taste_test_contestants: any[]; //relation to taste_test_contestants
// }

const RegistrationReceipt = () => {
  const { record } = useShowContext();
  const receiptRecord = React.useMemo(
    () => (record ? buildRegistrationReceiptRecord(record) : record),
    [record]
  );

  if (!record) return <Typography>Loading...</Typography>;

  const boothCount = Array.isArray(record.booths) ? record.booths.length : 0;
  const freeVendorSlots = freeVendorAllowance(boothCount);
  const activeContestants = receiptRecord?.active_contestants ?? [];
  const cancelledContestants = receiptRecord?.cancelled_contestants ?? [];

  return (
    <RecordContextProvider value={receiptRecord}>
    <Box p={4} maxWidth="lg" mx="auto">
      {/* Header */}
      <Typography variant="h6" fontWeight="bold" mb={4}>
        Registration Details
      </Typography>

      {/* Registration Details */}
      <Box mb={4}>
        <Grid container spacing={2} alignItems="center">
          {(getDisplayEntityId(record) ?? record.id) != null && (
            <Grid item xs={12} sm={6} md={4}>
              <Typography>
                <strong>ID:</strong> {getDisplayEntityId(record) ?? record.id}
              </Typography>
            </Grid>
          )}
          {record.registration_date && (
            <Grid item xs={12} sm={6} md={4}>
              <Typography>
                <strong>Date:</strong> {record.registration_date}
              </Typography>
            </Grid>
          )}
          {record.total !== undefined && (
            <Grid item xs={12} sm={6} md={4}>
              <Typography>
                <strong>Total:</strong> ${record.total}
              </Typography>
            </Grid>
          )}
          {record.payment_method && (
            <Grid item xs={12} sm={6} md={4}>
              <Typography>
                <strong>Payment Method:</strong> {record.payment_method}
              </Typography>
            </Grid>
          )}
          {record.organization && (
            <Grid item xs={12} sm={6} md={4}>
              <Typography>
                <strong>Organization:</strong> {record.organization}
              </Typography>
            </Grid>
          )}
          {record.type && (
            <Grid item xs={12} sm={6} md={4}>
              <Typography>
                <strong>Type:</strong> {record.type}
              </Typography>
            </Grid>
          )}
        </Grid>
      </Box>

      {/* Registrant Details */}
      {record.registrant && (
        <Box mb={4}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <Typography>
                <strong>Registrant: </strong>
                <ReferenceField source="registrant" reference="contacts">
                  <TextField source="first" /> {""} <TextField source="last" />
                </ReferenceField>
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <ReferenceField
                source="registrant"
                reference="contacts"
                link={false}
              >
                <Typography>
                  <strong>Email:</strong> <TextField source="email" />
                </Typography>
              </ReferenceField>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <ReferenceField
                source="registrant"
                reference="contacts"
                link={false}
              >
                <Typography>
                  <strong>Phone:</strong> <TextField source="phone" />
                </Typography>
              </ReferenceField>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Attendees */}
      {record.attendees && record.attendees.length > 0 && (
        <Box mb={4}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Attendees ({record.attendees.length})
          </Typography>
          {freeVendorSlots > 0 && (
            <Typography variant="body2" color="text.secondary" mb={1}>
              First {freeVendorSlots} Vendor ticket
              {freeVendorSlots === 1 ? "" : "s"} included with booth
              (list price struck through; shown as “Included with booth”).
            </Typography>
          )}
          <ReferenceArrayField
            source="attendees"
            reference="conference-attendees"
          >
            <Datagrid bulkActionButtons={false}>
              <FunctionField
                label="Name"
                noWrap
                render={(record: RaRecord) => {
                  return `${record.first} ${record.last}`;
                }}
              />
              <ReferenceField
                source="conference_ticket"
                reference="conference-tickets"
              
              >
                <TextField source="name" label="Ticket Type" />
              </ReferenceField>
              <FunctionField
                label="Price"
                render={() => (
                  <AttendeeTicketPriceField boothCount={boothCount} />
                )}
              />
              <FunctionField
                sx={{ display: "flex", gap: "5px" , flexWrap: "wrap" }}
                label="Items"
                sortBy="items.label"
                render={(record: RaRecord) => {
                  return record.items.map(
                    (item: ISharedMeta, index: number) => {
                      return (
                        <Chip
                          key={`item-${record.id}-${item.key + " " + index}`}
                          label={`${item.label} ${
                            parseInt(item.value) > 0
                              ? formatNumber(parseInt(item.value))
                              : ""
                          }`}
                        />
                      );
                    }
                  );
                }}
              />
            </Datagrid>
          </ReferenceArrayField>
        </Box>
      )}

      {/* Booths */}
      {record.booths && record.booths.length > 0 && (
        <Box mb={4}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Booths ({record.booths.length})
          </Typography>
          <ReferenceArrayField source="booths" reference="conference-booths">
            <Datagrid bulkActionButtons={false}>
              <NumberField
                source="subtotal"
                label="Subtotal"
                options={CurrencyOptions}
              />
              <TextField source="organization" label="Organization" />
              <FunctionField
                sx={{ display: "flex", gap: "5px" , flexWrap: "wrap"}}
                label="Items"
                sortBy="items.label"
                render={(record: RaRecord) => {
                  return record.items.map(
                    (item: ISharedMeta, index: number) => {
                      return (
                        <Chip
                          key={`item-${record.id}-${item.key + " " + index}`}
                          label={`${item.label} ${formatNumber(
                            parseInt(item.value)
                          )}`}
                        />
                      );
                    }
                  );
                }}
              />
            </Datagrid>
          </ReferenceArrayField>
        </Box>
      )}

      {/* Contestants */}
      {activeContestants.length > 0 && (
        <Box mb={4}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Contestants ({activeContestants.length})
          </Typography>
          <ArrayField source="active_contestants">
            <Datagrid bulkActionButtons={false}>
              <TextField source="first" label="First" />
              <TextField source="last" label="Last" />
              <FunctionField
                label="Type"
                render={(record: RaRecord) => record.ticket}
              />
              <NumberField source="fee" label="Fee" options={CurrencyOptions} />
              <FunctionField
                label="Team Name"
                render={(record: RaRecord) => record.team}
              />
            </Datagrid>
          </ArrayField>
        </Box>
      )}

      {cancelledContestants.length > 0 && (
        <Box
          mb={4}
          p={2}
          border={1}
          borderColor="warning.main"
          borderRadius={2}
          bgcolor="action.hover"
        >
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Cancelled Contestants — retained for refund history (
            {cancelledContestants.length})
          </Typography>
          <ArrayField source="cancelled_contestants">
            <Datagrid bulkActionButtons={false}>
              <FunctionField
                label="Name"
                render={(record: RaRecord) =>
                  `${record.first ?? ""} ${record.last ?? ""}`.trim() ||
                  "Unnamed contestant"
                }
              />
              <FunctionField
                label="Ticket"
                render={(record: RaRecord) => record.ticket}
              />
              <NumberField source="fee" label="Fee" options={CurrencyOptions} />
              <FunctionField
                sx={{ display: "flex", gap: "5px", flexWrap: "wrap" }}
                label="Mulligans"
                render={(record: RaRecord) => {
                  const mulligans = record.mulligans as string[];
                  if (mulligans.length === 0) return "None";
                  return mulligans.map((label: string, index: number) => (
                    <Chip
                      key={`cancelled-mulligan-${record.id}-${index}`}
                      label={label}
                    />
                  ));
                }}
              />
              <FunctionField
                label="Cancelled At"
                render={(record: RaRecord) =>
                  record.cancelled_at
                    ? new Date(record.cancelled_at as string).toLocaleString()
                    : "Unrecorded"
                }
              />
              <TextField source="cancelled_reason" label="Reason" />
              <TextField source="cancelled_by" label="Cancelled By" />
            </Datagrid>
          </ArrayField>
        </Box>
      )}

      {/* Team */}
      {record.team && record.team.data && (
        <Box mb={4}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Team Details
          </Typography>
          <ReferenceField source="team" reference="teams" link={false}>
            <TextField source="name" label="Team Name" />
          </ReferenceField>
        </Box>
      )}

      {/* Items */}
      {record.items && record.items.length > 0 && (
        <Box mb={4}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Addons
          </Typography>
          {record.items.map(
            (item: { label: string; value: number; key: string }) => (
              <Box key={item.key} mb={2}>
                <Typography>
                  <strong>{item.label}:</strong> ${item.value}
                </Typography>
              </Box>
            )
          )}
        </Box>
      )}

      {/* Taste Test Contestants */}
      {record.taste_test_contestants &&
        record.taste_test_contestants.length > 0 && (
          <Box mb={4}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Taste Test Contestant
            </Typography>
            <ReferenceArrayField
              source="taste_test_contestants"
              reference="taste-test-contestants"
            >
              <Datagrid bulkActionButtons={false}>
                <TextField source="id" label="ID" />
                <TextField source="first" label="First Name" />
                <TextField source="last" label="Last Name" />
                <ReferenceField source="watersystem" reference="watersystems">
                  <TextField source="name" label="Water System" />
                </ReferenceField>
                <ReferenceField source="watersystem" reference="watersystems" label="County" link={false}>
                  <TextField source="county" label="County" />
                </ReferenceField>
              </Datagrid>
            </ReferenceArrayField>
          </Box>
        )}

      {/* Conference Sponsor */}
      {record.conference_sponsor && typeof record.conference_sponsor === "number" && (
        <Box mb={4}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Conference Sponsor :{" "}
            <ReferenceField
              source="conference_sponsor"
              reference="conference-sponsors"
            >
              <TextField source="organization" />
            </ReferenceField>
          </Typography>

          <ReferenceField
            source="conference_sponsor"
            reference="conference-sponsors"
          >
            <ArrayField source="sponsorship_items">
              <Datagrid bulkActionButtons={false}>
                <TextField source="label" label="Label" />
                <NumberField
                  source="value"
                  label="Value"
                  options={CurrencyOptions}
                />
              </Datagrid>
            </ArrayField>
            {/* Logo */}

            
          </ReferenceField>
        </Box>
      )}
    </Box>
    </RecordContextProvider>
  );
};

export default RegistrationReceipt;
