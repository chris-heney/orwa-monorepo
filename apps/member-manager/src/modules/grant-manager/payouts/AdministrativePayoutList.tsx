import { Modal, Theme, useMediaQuery, useTheme } from "@mui/material";
import React, { useCallback, useEffect } from "react";
import {
  DateField,
  FilterLiveSearch,
  FunctionField,
  List,
  RaRecord,
  useListFilterContext,
} from "react-admin";
import { useGrantContext } from "../GrantContextProvider";
import CustomPagination from "../../_components/CustomPagination";
import { EditableDatagridConfigurable } from "@react-admin/ra-editable-datagrid";
import { grantDatagridStyle } from "../_components/grantDatagridStyle";
import SelectPayoutStatus from "./components/SelectPayoutStatus";
import EditPayoutMobile from "./EditPayoutMobile";
import EditPayout from "./EditPayoutRowForm";
import PayoutShow from "./PayoutShow";
import ModalPayoutStatus from "../payouts/components/ModalPayoutStatus";
import GrantCollapsibleSearch from "../_components/GrantCollapsibleSearch";
import { LEGACY_PAYOUT_SEARCH_KEYS, stripSearchKeys } from "../helpers/searchBarTabs";

const ADMIN_SEARCH_SOURCE = "application][legal_entity_name][$contains";

const AdminPayoutsSearchActions = () => {
  const { filterValues, setFilters } = useListFilterContext();
  const { setSearchBarOpenForTab } = useGrantContext();

  const onClearSearch = useCallback(() => {
    setFilters(
      stripSearchKeys(filterValues as Record<string, unknown>, [
        ADMIN_SEARCH_SOURCE,
        ...LEGACY_PAYOUT_SEARCH_KEYS,
      ]),
      null
    );
  }, [filterValues, setFilters]);

  useEffect(() => {
    const fv = filterValues as Record<string, unknown>;
    if (fv[ADMIN_SEARCH_SOURCE]) {
      setSearchBarOpenForTab("Admin Payouts", true);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- mount only

  return (
    <GrantCollapsibleSearch
      tab="Admin Payouts"
      onClearSearch={onClearSearch}
    >
      <FilterLiveSearch
        helperText="Search by application name"
        source={ADMIN_SEARCH_SOURCE}
      />
    </GrantCollapsibleSearch>
  );
};

const AdministrativePayoutsList = () => {
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

  let runningTotal = 0;

  return (
    <>
      <List
        disableSyncWithLocation
        filter={{
          ...{
            grant: grantFilterId,
            type: "Administrative",
          },
          ...(payoutStatusId && { payout_status: payoutStatusId }),
          ...(fiscalYearStart &&
            fiscalYearEnd && {
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
        actions={<AdminPayoutsSearchActions />}
        sx={{
          ".RaList-actions": {
            p: 0,
            minHeight: 0,
          },
        }}
      >
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
