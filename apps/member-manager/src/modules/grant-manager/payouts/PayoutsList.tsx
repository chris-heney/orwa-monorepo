import React, { useEffect } from "react";
import { Box, Modal, useMediaQuery } from "@mui/material";
import { Theme } from "@mui/material/styles";
import {
  List,
  ReferenceField,
  TextField,
  DateField,
  NumberField,
  FunctionField,
  RaRecord,
  FilterLiveSearch,
  CreateButton,
} from "react-admin";
import { EditableDatagridConfigurable } from "@react-admin/ra-editable-datagrid";
import EditPayout from "./EditPayoutRowForm";
import EditPayoutMobile from "./EditPayoutMobile";
import PayoutShow from "./PayoutShow";
import ModalPayoutStatus from "../payouts/components/ModalPayoutStatus";
import TotalPayoutsField from "./components/TotalPayoutField";
import BalanceField from "./components/BalanceField";
import { useGrantContext } from "../GrantContextProvider";
import CustomPagination from "../../_components/CustomPagination";
import { customDatagridStyle } from "../../../css";
import SelectPayoutStatus from "./components/SelectPayoutStatus";
import { CurrencyOptions } from "../../../config/Settings";

const ReimbursementPayoutsList = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedPayout, setSelectedPayout] = React.useState<RaRecord>();
  const [payoutStatus, setPayoutStatus] = React.useState<RaRecord | null>(null);

  const {
    payoutStatusId,
    setPayoutStatusId,
    grantId,
    fiscalYearStart,
    fiscalYearEnd,
  } = useGrantContext();

  useEffect(() => {
    setPayoutStatusId(1);
  }, []);

  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));

  return (
    <>
      <List
        disableSyncWithLocation
        filter={{
          ...{
            grant: grantId,
            type: "Reimbursement",
          },
          ...(payoutStatusId && { payout_status: payoutStatusId }),
          ...(fiscalYearStart &&
            fiscalYearEnd && {
              transaction_date: {
                $between: [fiscalYearStart, fiscalYearEnd],
              },
            }),
        }}
        title={" "}
        resource="grant-payouts"
        perPage={50}
        queryOptions={{ meta: { raw: true, populate: true } }}
        pagination={<CustomPagination />}
        actions={
          <Box
            sx={{
              display: "flex",
              gap: 2,
            }}
          >
            <FilterLiveSearch
              helperText="Search by application name"
              source="application][legal_entity_name][$contains"
            />
            <FilterLiveSearch
              helperText="Search by application ID"
              source="application][application_id][$contains"
            />
            <CreateButton
              label="Payout"
              sx={{
                ml: 2,
                backgroundColor: "primary.main",
                color: "white",
                "&:hover": {
                  backgroundColor: "primary.dark",
                },
                my: "auto",
              }}
            />
          </Box>
        }
        sx={{
          " .RaList-actions": {
            display: "flex",
            justifyContent: "flex-start",
            px: 2,
          },
        }}
      >
        <EditableDatagridConfigurable
          mutationMode="undoable"
          noDelete
          rowClick="expand"
          sx={customDatagridStyle}
          editForm={
            isSmall ? <EditPayoutMobile /> : <EditPayout type="Reimbursement" />
          }
          expandSingle
          expand={(record: RaRecord) => <PayoutShow id={record.id} />}
          bulkActionButtons={false}
        >
          <DateField source="transaction_date" label="Submittal Date" />
          <FunctionField
            label="Status"
            sortBy="status"
            render={() => (
              <SelectPayoutStatus
                setPayoutStatus={setPayoutStatus}
                setSelectedPayout={setSelectedPayout}
                setIsModalOpen={setIsModalOpen}
              />
            )}
          />

          <ReferenceField
            source="application.id"
            reference="grant-application-finals"
            label="ID"
            link={false}
          >
            <TextField source="application_id" noWrap label="Application ID" />
          </ReferenceField>

          <ReferenceField
            source="application.id"
            reference="grant-application-finals"
            label="Application"
            link={false}
          >
            <TextField source="legal_entity_name" noWrap label="System Name" />
          </ReferenceField>
          <ReferenceField
            source="application.id"
            reference="grant-application-finals"
            label="Awarded"
            link={false}
          >
            <NumberField
              options={CurrencyOptions}
              source="award_amount"
              label="Awarded"
            />
          </ReferenceField>
          <FunctionField
            label="Total Paid Out"
            render={(record: RaRecord) => (
              <TotalPayoutsField applicationId={record.application?.id} />
            )}
          />
          <NumberField
            options={CurrencyOptions}
            source="amount"
            label="This Payout"
          />
          <FunctionField
            label="Balance"
            render={(record: RaRecord) => (
              <BalanceField applicationId={record.application?.id} />
            )}
          />
        </EditableDatagridConfigurable>
      </List>
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalPayoutStatus
          selectedPayout={selectedPayout}
          payoutStatus={payoutStatus}
          setIsModalOpen={setIsModalOpen}
        />
      </Modal>
    </>
  );
};

export default ReimbursementPayoutsList;
