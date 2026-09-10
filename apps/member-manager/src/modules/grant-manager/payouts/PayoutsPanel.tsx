import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Chip,
  Link as MuiLink,
  Modal,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import { Theme } from "@mui/material/styles";
import {
  ListView,
  TextField,
  DateField,
  NumberField,
  FunctionField,
  RaRecord,
} from "react-admin";
import { EditableDatagridConfigurable } from "@orwa/entity-id";
import EditPayout from "./EditPayoutRowForm";
import EditPayoutMobile from "./EditPayoutMobile";
import PayoutShow from "./PayoutShow";
import ModalPayoutStatus from "./components/ModalPayoutStatus";
import TotalPayoutsField from "./components/TotalPayoutField";
import BalanceField from "./components/BalanceField";
import { useGrantContext } from "../GrantContextProvider";
import CustomPagination from "../../_components/CustomPagination";
import { grantDatagridStyle } from "../_components/grantDatagridStyle";
import SelectPayoutStatus from "./components/SelectPayoutStatus";
import { CurrencyOptions } from "../../../config/Settings";
import ModalMakePayout from "../grant-application/components/MadalMakePayout";
import {
  buildApplicationOrFilter,
  LEGACY_PAYOUT_SEARCH_KEYS,
} from "../helpers/searchBarTabs";
import { useAutoOpenSearch, useSearchOrMirror } from "../helpers/useGrantSearch";

/** New Payout modal — opened by the bar's "Payout" action (`NewPayoutAction`). */
export const CreatePayoutModal = () => {
  const { isCreatePayoutModalOpen, closeCreatePayoutModal, grantId, createPayoutType } =
    useGrantContext();
  return (
    <Modal
      open={isCreatePayoutModalOpen}
      onClose={closeCreatePayoutModal}
      aria-labelledby="create-payout-modal"
    >
      <ModalMakePayout
        setIsModalOpen={closeCreatePayoutModal}
        grantId={grantId}
        defaultType={createPayoutType}
      />
    </Modal>
  );
};

/**
 * Award (reimbursement) payouts — renders inside the framework's ListScope;
 * the permanent grant / status / fiscal-year filter lives in `manifest.tsx`.
 */
const PayoutsPanel = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedPayout, setSelectedPayout] = React.useState<RaRecord>();
  const [payoutStatus, setPayoutStatus] = React.useState<RaRecord | null>(null);

  useSearchOrMirror(buildApplicationOrFilter, LEGACY_PAYOUT_SEARCH_KEYS);
  useAutoOpenSearch();

  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));
  const theme = useTheme();

  return (
    <>
      <ListView actions={false} title={" "} pagination={<CustomPagination />}>
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
          {/* Column order must stay in sync with EditPayoutRowForm (Reimbursement). */}
          <FunctionField
            label="Source"
            sortBy="source"
            render={(record: RaRecord) =>
              record?.source === "Applicant Portal" ? (
                <Tooltip title="Submitted by the applicant through the grant portal — expand the row for invoices, documents and signature">
                  <Chip
                    size="small"
                    color="info"
                    variant="outlined"
                    icon={<LanguageIcon />}
                    label="Portal"
                    sx={{ height: 22, "& .MuiChip-label": { px: 0.75, fontSize: 12 } }}
                  />
                </Tooltip>
              ) : null
            }
          />

          {/* Application is already populated on the payout; avoid ReferenceField
              which looks up by nested numeric id and misses documentId-keyed records. */}
          <TextField
            source="application.application_id"
            label="ID"
            noWrap
          />
          <FunctionField
            label="Application"
            sortBy="application.legal_entity_name"
            render={(record: RaRecord) => {
              const app = record?.application;
              const name = app?.legal_entity_name;
              const appId = app?.id ?? app?.documentId ?? app?.entityId;
              if (!name) return null;
              if (appId == null) return <>{name}</>;
              return (
                <MuiLink
                  component={RouterLink}
                  to={`/grant-application-finals/${appId}/show`}
                  underline="hover"
                  onClick={(e) => e.stopPropagation()}
                >
                  {name}
                </MuiLink>
              );
            }}
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

export default PayoutsPanel;
