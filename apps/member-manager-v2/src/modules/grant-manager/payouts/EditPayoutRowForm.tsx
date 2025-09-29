import React from "react";
import { RowForm } from "@react-admin/ra-editable-datagrid";
import {
  AutocompleteInput,
  DateInput,
  NumberInput,
  ReferenceField,
  ReferenceInput,
  TextInput,
} from "react-admin";

const EditPayout = ({ type }: { type: "Administrative" | "Reimbursement" }) => {
  return (
    <RowForm expand>
      <DateInput
        defaultValue={new Date()}
        source="transaction_date"
        label="Payout Date"
        fullWidth
        helperText={false}
        key="payout-field-4"
      />
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
      {type === "Reimbursement" && <>{}</>}

      <>
        <NumberInput
          source="amount"
          label="Payout"
          fullWidth
          sx={{
            minWidth: 100,
          }}
          helperText={false}
          key="payout-field-amounbt"
        />
        {type !== "Reimbursement" && (
          <TextInput
            source="comments"
            label="Notes"
            fullWidth
            sx={{
              minWidth: 100,
            }}
            helperText={false}
            key="payout-field-description"
          />
        )}
      </>
      {type === "Reimbursement" && <>{}</>}
      {type === "Reimbursement" && <>{}</>}
      {type === "Reimbursement" && <>{}</>}
    </RowForm>
  );
};

export default EditPayout;
