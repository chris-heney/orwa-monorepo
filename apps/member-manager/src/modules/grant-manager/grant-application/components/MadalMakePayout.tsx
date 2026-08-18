import * as React from "react";
import {
  AutocompleteInput,
  Create,
  DateInput,
  Identifier,
  NumberInput,
  ReferenceInput,
  required,
  SelectInput,
  SimpleForm,
  useCreate,
  useGetList,
  useNotify,
  useRefresh,
} from "react-admin";
import Grid from "@mui/material/Grid";
import { Box, Theme, useMediaQuery } from "@mui/material";
import dayjs from "dayjs";
import { FieldValues } from "react-hook-form";
import CustomSecondaryHeader from "../../../_components/CustomSecondaryHeader";
import {
  normalizePayoutCreateData,
  payoutEligibleApplicationFilter,
  PayoutType,
  resolveDefaultPayoutStatusId,
  shouldShowApplicationPicker,
} from "../../payouts/helpers/payoutCreateDefaults";

interface ModalMakePayoutProps {
  setIsModalOpen: () => void;
  name?: string;
  id?: Identifier;
  grantId?: Identifier;
  defaultType?: PayoutType;
}

const applicationOptionText = (record: {
  legal_entity_name?: string;
  application_id?: string | number;
  id?: Identifier;
}) =>
  `${record.legal_entity_name ?? ""} | Applicant #${
    record.application_id ?? record.id
  }`;

const ModalMakePayout = React.forwardRef<HTMLDivElement, ModalMakePayoutProps>(
  function ModalMakePayout(
    {
      setIsModalOpen,
      name,
      id,
      grantId,
      defaultType = "Reimbursement",
    },
    ref
  ) {
  const isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));
  const [create] = useCreate();
  const notify = useNotify();
  const refresh = useRefresh();
  const { data: payoutStatuses } = useGetList("payout-statuses", {
    pagination: { page: 1, perPage: 100 },
    sort: { field: "id", order: "ASC" },
  });
  const defaultStatusId = resolveDefaultPayoutStatusId(payoutStatuses);
  const showApplicationPicker = shouldShowApplicationPicker(id, defaultType);
  const title =
    name && name.trim() && name !== " " ? `Payout For ${name}` : "New Payout";

  const postSave = async (data: FieldValues) => {
    try {
      const payload = normalizePayoutCreateData(data, {
        type: defaultType,
        grantId,
        applicationId: id,
        payoutStatusId: defaultStatusId,
      });
      await create(
        "grant-payouts",
        { data: payload },
        { returnPromise: true }
      );
      notify(
        name && name.trim() && name !== " "
          ? `Payout Was Created ${name}`
          : "Payout Was Created",
        { type: "success" }
      );
      refresh();
      setIsModalOpen();
    } catch (error) {
      notify(`Error: ${error}`, { type: "error" });
    }
  };

  return (
    <Box
      ref={ref}
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: isSmall ? "80vw" : "50vw",
        bgcolor: "background.paper",
        border: "2px solid",
        borderColor: "divider",
        boxShadow: 24,
      }}
    >
      <CustomSecondaryHeader
        sx={{ textAlign: "center" }}
        title={title}
      />
      <Box>
        <Create title={" "} resource="grant-payouts" redirect={false}>
          <SimpleForm
            resource="grant-payouts"
            onSubmit={postSave}
            defaultValues={{
              type: defaultType,
              grant: grantId,
              application: id,
              payout_status: defaultStatusId,
              // Local YYYY-MM-DD string, never a raw Date: an untouched Date
              // default reaches the write payload as-is and used to 400.
              transaction_date: dayjs().format("YYYY-MM-DD"),
            }}
          >
            <Grid container spacing={2}>
              {showApplicationPicker && (
                <Grid item xs={12}>
                  <ReferenceInput
                    perPage={1000}
                    reference="grant-application-finals"
                    source="application"
                    label="Name"
                    fullWidth
                    helperText={false}
                    sort={{ field: "legal_entity_name", order: "ASC" }}
                    filter={payoutEligibleApplicationFilter(grantId)}
                  >
                    <AutocompleteInput
                      optionText={applicationOptionText}
                      validate={required()}
                      helperText={false}
                      fullWidth
                    />
                  </ReferenceInput>
                </Grid>
              )}
              {!showApplicationPicker && id != null && (
                <Grid item xs={12} sx={{ display: "none" }}>
                  <ReferenceInput
                    perPage={1000}
                    reference="grant-application-finals"
                    source="application"
                    label="Name"
                    fullWidth
                    helperText={false}
                  >
                    <AutocompleteInput
                      defaultValue={id}
                      hidden
                      optionText="legal_entity_name"
                    />
                  </ReferenceInput>
                </Grid>
              )}
              <Grid item xs={12} sx={{ display: "none" }}>
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
              <Grid item xs={6}>
                <NumberInput
                  source="amount"
                  label="Amount"
                  fullWidth
                  helperText={false}
                  validate={required()}
                />
              </Grid>
              <Grid item xs={6}>
                <DateInput
                  defaultValue={dayjs().format("YYYY-MM-DD")}
                  source="transaction_date"
                  label="Transaction Date"
                  fullWidth
                  helperText={false}
                />
              </Grid>
              <Grid item xs={12}>
                <ReferenceInput
                  perPage={1000}
                  reference="payout-statuses"
                  source="payout_status"
                  label="Payout status"
                  fullWidth
                  helperText={false}
                >
                  <AutocompleteInput
                    key={`payout-status-${defaultStatusId}`}
                    defaultValue={defaultStatusId}
                    optionText="name"
                  />
                </ReferenceInput>
                <Grid sx={{ display: "none" }} item xs={12} md={6}>
                  <SelectInput
                    source="type"
                    label="Type"
                    choices={[
                      { id: "Reimbursement", name: "Reimbursement" },
                      { id: "Administrative", name: "Administrative" },
                    ]}
                    defaultValue={defaultType}
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
  }
);
export default ModalMakePayout;
