import { Modal, Theme, useMediaQuery, useTheme } from "@mui/material";
import React from "react";
import { DateField, FunctionField, ListView, RaRecord } from "react-admin";
import CustomPagination from "../../_components/CustomPagination";
import { EditableDatagridConfigurable } from "@orwa/entity-id";
import { grantDatagridStyle } from "../_components/grantDatagridStyle";
import SelectPayoutStatus from "./components/SelectPayoutStatus";
import EditPayoutMobile from "./EditPayoutMobile";
import EditPayout from "./EditPayoutRowForm";
import PayoutShow from "./PayoutShow";
import ModalPayoutStatus from "./components/ModalPayoutStatus";
import { CreatePayoutModal } from "./PayoutsPanel";
import {
  buildApplicationOrFilter,
  LEGACY_PAYOUT_SEARCH_KEYS,
} from "../helpers/searchBarTabs";
import { useAutoOpenSearch, useSearchOrMirror } from "../helpers/useGrantSearch";

/** Legacy single-field search key of this tab (stripped by the search mirror). */
const ADMIN_SEARCH_SOURCE = "application][legal_entity_name][$contains";
const LEGACY_ADMIN_SEARCH_KEYS = [
  ADMIN_SEARCH_SOURCE,
  ...LEGACY_PAYOUT_SEARCH_KEYS,
] as const;

/**
 * Administrative payouts — renders inside the framework's ListScope; the
 * permanent grant / status / fiscal-year filter lives in `manifest.tsx`.
 * Sorted by transaction date ascending so the running Balance column is
 * meaningful.
 */
const AdministrativePayoutsPanel = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedPayout, setSelectedPayout] = React.useState<RaRecord>();
  const [payoutStatus, setPayoutStatus] = React.useState<RaRecord | null>(null);

  useSearchOrMirror(buildApplicationOrFilter, LEGACY_ADMIN_SEARCH_KEYS);
  useAutoOpenSearch();

  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));
  const theme = useTheme();

  let runningTotal = 0;

  return (
    <>
      <ListView actions={false} title={" "} pagination={<CustomPagination />}>
        <EditableDatagridConfigurable
          mutationMode="undoable"
          noDelete
          rowClick="expand"
          sx={grantDatagridStyle(theme)}
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
              const value = record.amount || 0;
              const formattedValue = Math.abs(value).toLocaleString("en-US", {
                minimumFractionDigits: 2,
              });
              return (
                <span style={{ color: value < 0 ? "#ff0800" : "inherit" }}>
                  {value < 0 ? `($${formattedValue})` : `$${formattedValue}`}
                </span>
              );
            }}
          />
          <FunctionField
            label="Balance"
            render={(record: RaRecord) => {
              runningTotal += record.amount / 2 || 0;
              return (
                <span>
                  $
                  {runningTotal.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              );
            }}
          />
        </EditableDatagridConfigurable>
      </ListView>
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalPayoutStatus
          selectedPayout={selectedPayout}
          payoutStatus={payoutStatus}
          setIsModalOpen={setIsModalOpen}
        />
      </Modal>
      <CreatePayoutModal />
    </>
  );
};

export default AdministrativePayoutsPanel;
