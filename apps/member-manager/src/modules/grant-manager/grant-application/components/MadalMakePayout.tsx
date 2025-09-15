import * as React from "react";
import {
  AutocompleteInput,
  Create,
  DateInput,
  Identifier,
  NumberInput,
  ReferenceInput,
  SelectInput,
  SimpleForm,
  useCreate,
  useNotify,
} from "react-admin";
import Grid from "@mui/material/Grid";
import { Box, Theme, useMediaQuery } from "@mui/material";
import { FieldValues } from "react-hook-form";
import CustomSecondaryHeader from "../../../_components/CustomSecondaryHeader";

interface ModalMakePayoutProps {
  setIsModalOpen: () => void;
  name?: string;
  id?: Identifier;
  grantId?: Identifier;
}

const ModalMakePayout = ({
  setIsModalOpen,
  name,
  id,
  grantId,
}: ModalMakePayoutProps) => {
  const isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));
  const [create] = useCreate();
  const notify = useNotify();

  const postSave = (data: FieldValues) => {
    try {
      create("grant-payouts", {
        data,
      });
    } catch (error) {
      notify(`Error: ${error}`, { type: "error" });
    }

    notify(`Payout Was Created ${name}`, { type: "success" });
    setIsModalOpen()
  };

  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: isSmall ? "80vw" : "50vw",
        bgcolor: "background.paper",
        border: "2px solid #000",
        boxShadow: 24,
      }}
    >
      <CustomSecondaryHeader
        sx={{ textAlign: "center" }}
        title={name !== " " ? `Payout For ${name}` : "New Payout"}
      />
      <Box>
        <Create title={" "} resource="grant-payouts" redirect={false}>
          <SimpleForm resource="grant-payouts" onSubmit={postSave}>
            <Grid container spacing={2}>
              <Grid xs={6}>
                <ReferenceInput
                  perPage={1000}
                  reference="grant-application-finals"
                  source="application"
                  label="Name"
                  fullWidth
                  helperText={false}
                  hidden
                >
                  <AutocompleteInput
                    defaultValue={id}
                    hidden
                    optionText="legal_entity_name"
                  />
                </ReferenceInput>
              </Grid>
              <Grid xs={6}>
                <ReferenceInput
                  perPage={1000}
                  reference="grants"
                  source="grant"
                  label="Grant"
                  fullWidth
                  helperText={false}
                >
                  <AutocompleteInput
                    defaultValue={grantId}
                    hidden
                    optionText="name"
                  />
                </ReferenceInput>
              </Grid>
              <Grid xs={6}>
                <NumberInput
                  source="amount"
                  label="Amount"
                  fullWidth
                  helperText={false}
                />
              </Grid>
              <Grid xs={6}>
                <DateInput
                  defaultValue={new Date()}
                  source="transaction_date"
                  label="Transaction Date"
                  fullWidth
                  helperText={false}
                />
              </Grid>
              <Grid xs={12}>
                <ReferenceInput
                  perPage={1000}
                  reference="payout-statuses"
                  source="payout_status"
                  label="Name"
                  fullWidth
                  helperText={false}
                >
                  <AutocompleteInput defaultValue={id} optionText="name" />
                </ReferenceInput>
                <Grid sx={{
                  display: "none"
                }} xs={12} md={6}>
                  <SelectInput
                    source="type"
                    label="Type"
                    choices={[
                      { id: "Reimbursement", name: "Reimbursement" },
                      { id: "Administrative", name: "Administrative" },
                    ]}
                    defaultValue={"Reimbursement"}
                    fullWidth
                    hidden
                    helperText={false}
                    key="payout-field-6"
                  />
                </Grid>
              </Grid>
            </Grid>
          </SimpleForm>
        </Create>
      </Box>
    </Box>
  );
};
export default ModalMakePayout;
