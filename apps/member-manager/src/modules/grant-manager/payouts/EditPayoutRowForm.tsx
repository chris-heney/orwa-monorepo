import React from "react";
import { RowForm } from "@react-admin/ra-editable-datagrid";
import {
  AutocompleteInput,
  DateInput,
  NumberField,
  NumberInput,
  ReferenceInput,
  TextField,
  TextInput,
  useRecordContext,
} from "react-admin";
import dayjs from "dayjs";
import { CurrencyOptions } from "../../../config/Settings";
import TotalPayoutsField from "./components/TotalPayoutField";
import BalanceField from "./components/BalanceField";

/** Local YYYY-MM-DD string, never a raw Date: an untouched Date default reaches the write payload as-is and used to 400. */
const todayLocal = () => dayjs().format("YYYY-MM-DD");

/** ReferenceInput needs a scalar id; list queries populate payout_status as an object. */
const formatRelationId = (value: unknown) => {
  if (value == null) return value;
  if (typeof value === "object") {
    const rel = value as { documentId?: string; id?: string | number };
    return rel.documentId ?? rel.id ?? value;
  }
  return value;
};

const EditPayout = ({ type }: { type: "Administrative" | "Reimbursement" }) => {
  const record = useRecordContext();

  if (type === "Administrative") {
    return (
      <RowForm expand>
        <DateInput
          defaultValue={todayLocal()}
          source="transaction_date"
          label="Payout Date"
          fullWidth
          helperText={false}
          key="payout-field-4"
        />
        <ReferenceInput
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
            format={formatRelationId}
          />
        </ReferenceInput>
        <NumberInput
          source="amount"
          label="Payout"
          fullWidth
          sx={{ minWidth: 100 }}
          helperText={false}
          key="payout-field-amount"
        />
        <TextInput
          source="comments"
          label="Notes"
          fullWidth
          sx={{ minWidth: 100 }}
          helperText={false}
          key="payout-field-description"
        />
      </RowForm>
    );
  }

  // Column order must match PayoutsList EditableDatagrid columns.
  return (
    <RowForm expand>
      <DateInput
        defaultValue={todayLocal()}
        source="transaction_date"
        label="Payout Date"
        fullWidth
        helperText={false}
        key="payout-field-date"
      />
      <ReferenceInput
        source="payout_status"
        label="Status"
        reference="payout-statuses"
        fullWidth
        helperText={false}
        key="payout-field-status"
      >
        <AutocompleteInput
          optionText="name"
          defaultValue={1}
          helperText={false}
          fullWidth
          format={formatRelationId}
        />
      </ReferenceInput>
      <TextField source="application.application_id" label="ID" noWrap />
      <TextField
        source="application.legal_entity_name"
        label="Application"
        noWrap
      />
      <NumberField
        source="application.award_amount"
        label="Awarded"
        options={CurrencyOptions}
      />
      <TotalPayoutsField applicationId={record?.application?.id} />
      <NumberInput
        source="amount"
        label="Payout"
        fullWidth
        sx={{ minWidth: 100 }}
        helperText={false}
        key="payout-field-amount"
      />
      <BalanceField applicationId={record?.application?.id} />
    </RowForm>
  );
};

export default EditPayout;
