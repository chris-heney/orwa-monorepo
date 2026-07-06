import React from "react";
import {
  AutocompleteInput,
  Button,
  Create,
  DateInput,
  NumberInput,
  ReferenceInput,
  SelectInput,
  SimpleForm,
  TextInput,
  useDataProvider,
  useNotify,
  useRedirect,
} from "react-admin";
import { Grid } from "@mui/material";
import CustomHeader from "../../_components/CustomHeader";
import { FieldValues } from "react-hook-form";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const CreatePayout = () => {
  const notify = useNotify();
  const redirect = useRedirect();
  const dataProvider = useDataProvider();

  const createPayout = async (data: FieldValues) => {
    try {
      await dataProvider.create("grant-payouts", { data: data });
      notify(`Grant Payout was Submitted`, {
        type: "success",
      });
      redirect("/grant/dashboard");
    } catch (error) {
      console.error("Error Submitting Grant Application", error);
      notify("Error Submitting Grant Application", { type: "error" });
    }
  };

  return (
    <Create resource="grant-payouts" title={"Grant Manager"}>
      <CustomHeader
        title="Create Payout"
        Component={() => {
          return (
            <Button
              onClick={() => redirect("/grant/dashboard")}
              sx={{
                color: "white",
                mr: 2,
              }}
              label="Back"
            >
              <ArrowBackIcon />
            </Button>
          );
        }}
      />

      <SimpleForm onSubmit={(data: FieldValues) => createPayout(data)}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <ReferenceInput
              perPage={1000}
              reference="grant-application-finals"
              source="application"
              label="Name"
              fullWidth
              helperText={false}
              key="payout-field-1"
              sort={{ field: "legal_entity_name", order: "ASC" }}
              filter={{ status: [3, 6] }}
            >
              <AutocompleteInput
                optionText={(record) =>
                  record.legal_entity_name +
                  " | Applicant #" +
                  `${record.application_id ?? record.id}`
                }
                filter={""}
                helperText={false}
                fullWidth
              />
            </ReferenceInput>
          </Grid>
          <Grid item xs={12} md={6}>
            <NumberInput
              source="amount"
              label="Amount"
              fullWidth
              helperText={false}
              key="payout-field-2"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <DateInput
              defaultValue={new Date()}
              source="transaction_date"
              label="Transaction Date"
              fullWidth
              helperText={false}
              key="payout-field-4"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <ReferenceInput
              defaultValue={"Requested"}
              source="payout_status"
              label="Status"
              reference="payout-statuses"
              fullWidth
              helperText={false}
              key="payout-field-3"
            >
              <AutocompleteInput
                optionText="name"
                defaultValue={1}
                helperText={false}
                fullWidth
              />
            </ReferenceInput>
          </Grid>
          <Grid item xs={12} md={6}>
            <ReferenceInput
              perPage={1000}
              reference="grants"
              source="grant"
              key={"owihefowh"}
            >
              <AutocompleteInput
                optionText="name"
                helperText={false}
                defaultValue={4}
                fullWidth
              />
            </ReferenceInput>
          </Grid>
          <Grid item xs={12} md={6}>
            <SelectInput
              source="type"
              label="Type"
              choices={[
                { id: "Reimbursement", name: "Reimbursement" },
                { id: "Administrative", name: "Administrative" },
              ]}
              defaultValue={"Administrative"}
              fullWidth
              helperText={false}
              key="payout-field-6"
            />
          </Grid>
          <Grid item xs={12}>
            <TextInput
              source="comments"
              label="Notes"
              fullWidth
              helperText={false}
              key="payout-field-7"
            />
          </Grid>
        </Grid>
      </SimpleForm>
    </Create>
  );
};

export default CreatePayout;