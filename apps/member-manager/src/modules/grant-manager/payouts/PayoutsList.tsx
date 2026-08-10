import React, { useEffect } from "react";
import { Box, Modal, useMediaQuery, useTheme } from "@mui/material";
import { Theme } from "@mui/material/styles";
import {
  List,
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
import { grantDatagridStyle } from "../_components/grantDatagridStyle";
import SelectPayoutStatus from "./components/SelectPayoutStatus";
import { CurrencyOptions } from "../../../config/Settings";

const ReimbursementPayoutsList = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedPayout, setSelectedPayout] = React.useState<RaRecord>();
  const [payoutStatus, setPayoutStatus] = React.useState<RaRecord | null>(null);

  const {
    payoutStatusId,
    setPayoutStatusId,
    grantFilterId,
    fiscalYearStart,
    fiscalYearEnd,
  } = useGrantContext();

  useEffect(() => {
    setPayoutStatusId(1);
  }, []);

  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));
  const theme = useTheme();

  return (
    <>
      <List
        disableSyncWithLocation
        filter={{
          ...{
            grant: grantFilterId,
            type: "Reimbursement",
          },
          ...(payoutStatusId && { payout_status: payoutStatusId }),
          // Financial reporting: reimbursement payouts belong to the fiscal
          // year their application was approved, not the year they were paid.
          ...(fiscalYearStart &&
            fiscalYearEnd && {
              application: {
                committee_date: {
                  $between: [fiscalYearStart, fiscalYearEnd],
                },
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
          sx={grantDatagridStyle(theme)}
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

          {/* Application is already populated on the payout; avoid ReferenceField
              which looks up by nested numeric id and misses documentId-keyed records. */}
          <TextField
            source="application.application_id"
            label="ID"
            noWrap
          />
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
