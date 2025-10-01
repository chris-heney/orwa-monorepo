import { Box, Modal, Theme, useMediaQuery } from "@mui/material";
import React, { useEffect } from "react";
import {
  CreateButton,
  DateField,
  FilterLiveSearch,
  FunctionField,
  List,
  RaRecord,
} from "react-admin";
import { useGrantContext } from "../GrantContextProvider";
import CustomPagination from "../../_components/CustomPagination";
import { EditableDatagridConfigurable } from "@react-admin/ra-editable-datagrid";
import { customDatagridStyle } from "../../../css";
import SelectPayoutStatus from "./components/SelectPayoutStatus";
import EditPayoutMobile from "./EditPayoutMobile";
import EditPayout from "./EditPayoutRowForm";
import PayoutShow from "./PayoutShow";
import ModalPayoutStatus from "../payouts/components/ModalPayoutStatus";

const AdministrativePayoutsList = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedPayout, setSelectedPayout] = React.useState<RaRecord>();
  const [payoutStatus, setPayoutStatus] = React.useState<RaRecord | null>(null);

  const { payoutStatusId, setPayoutStatusId, grantId, fiscalYearStart, fiscalYearEnd} = useGrantContext();

  useEffect(() => {
    setPayoutStatusId(1);
  }, []);

  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));

  let runningTotal = 0;

  return (
    <>
      <List
        disableSyncWithLocation
        filter={{
          ...{
            grant: grantId,
            type: "Administrative",
          },
          ...(payoutStatusId && { payout_status: payoutStatusId }),
          ...(fiscalYearStart && fiscalYearEnd && {
              transaction_date: {
                $between: [fiscalYearStart, fiscalYearEnd],
              },
          }),
        }}
        sort={{ field: "transaction_date", order: "ASC" }}
        title={" "}
        resource="grant-payouts"
        perPage={50}
        queryOptions={{ meta: { raw: true, populate: true } }}
        pagination={<CustomPagination />}
        actions={
          <Box
            sx={{
              display: "flex",
            }}
          >
            <FilterLiveSearch
              helperText="Search by application name"
              source="application][legal_entity_name][$contains"
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
          '& .RaList-noActions': {
            mt: '0',
          },
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
            isSmall ? (
              <EditPayoutMobile />
            ) : (
              <EditPayout type="Administrative" />
            )
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
          <FunctionField
            label="Amount"
            render={(record: RaRecord) => {
              const value = record.amount || 0; // Ensure there's a value
              const formattedValue = Math.abs(value).toLocaleString("en-US", {
                minimumFractionDigits: 2,
              }); // Format with 2 decimal places
              return (
                <span style={{ color: value < 0 ? "#ff0800" : "inherit" }}>
                  {value < 0 ? `($${formattedValue})` : `$${formattedValue}`}
                </span>
              );
            }}
          />
          {/* Running Balance Column */}
          <FunctionField
            label="Balance"
            render={(record: RaRecord) => {
              runningTotal += record.amount / 2 || 0;
              return (
                <span>
                  ${runningTotal.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              ); // Display the running balance
            }}
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

export default AdministrativePayoutsList;
