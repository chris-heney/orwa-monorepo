import React, { useEffect } from "react";
import { Box, Checkbox, Modal, useMediaQuery } from "@mui/material";
import { Theme } from "@mui/material/styles";
import {
  ListView,
  TextField,
  NumberField,
  RaRecord,
  DateField,
  useRefresh,
  FunctionField,
  useDataProvider,
  ChipField,
  useNotify,
} from "react-admin";
import { CurrencyOptions } from "../../../config/Settings";
import ModalDenialReason from "./components/ModalDenialReason";
import BalanceField from "../payouts/components/BalanceField";
import { isAwardPaidInFull } from "../payouts/helpers/payoutAmounts";
import { getGrantStatus } from "../../emails-magement/Helper";
import CustomPagination from "../../_components/CustomPagination";
import TotalPayoutsField from "../payouts/components/TotalPayoutField";
import AgDatagrid from "../../_components/AgDatagrid";
import { IProject } from "../types";
import coloredSurfaceSx from "../../_helpers/coloredSurfaceSx";
import { useAutoOpenSearch } from "../helpers/useGrantSearch";

export const AG_PREFS_KEY = "agGrid.grant-application-finals";

/**
 * Applications tab panel — renders inside the framework's ListScope (the
 * permanent grant / status / fiscal-year filter comes from `manifest.tsx`),
 * so there is no second `List` here: count, Export, Columns, Search and the
 * Filters drawer all share this ListBase.
 */
const ApplicationPanel = () => {
  const refresh = useRefresh();
  const notify = useNotify();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const dataProvider = useDataProvider();
  useAutoOpenSearch();

  // function to displaty projects in a chipfield

  const displayProjects = (projects: IProject[]) => {
    return projects.map((project: IProject) => (
      <ChipField
        key={project.id}
        record={project}
        source="name"
        sx={{ marginRight: 0.5, marginBottom: 0.25, fontSize: "0.85rem" }}
      />
    ));
  };

  const handleClosedOutChange = async (record: RaRecord, checked: boolean) => {
    const updatedRecordParams = {
      id: record.id,
      previousData: record,
      data: {
        closed_out: checked,
      },
    };
    await dataProvider.update("grant-application-finals", updatedRecordParams);
    notify("Application closed out successfully");
    refresh();
  };

  const checkAndUpdateRecords = async (records: RaRecord[]) => {
    const statusId = await getGrantStatus(dataProvider, "Paid in Full");
    if (statusId == null) return;

    // Only Paid reimbursements count. Admin draws, Requested/Not Approved
    // rows, and Strapi decimal-string concatenation used to look like a $0
    // remaining balance and flip these to Paid in Full.
    const fullyPaid = records.filter((record) =>
      isAwardPaidInFull(record as Parameters<typeof isAwardPaidInFull>[0])
    );

    await Promise.all(
      fullyPaid.map((record) =>
        dataProvider.update("grant-application-finals", {
          id: record.id,
          previousData: record,
          data: { status: statusId },
        })
      )
    );
  };

  useEffect(() => {
    const fetchDataAndUpdate = async () => {
      const ids = [
        await getGrantStatus(
          dataProvider,
          "Grant Agreement Signed/Sealed/Returned"
        ),
        await getGrantStatus(dataProvider, "Revised per COR"),
      ].filter((id) => id != null);

      if (ids.length === 0) return;

      const { data } = await dataProvider.getList("grant-application-finals", {
        pagination: { page: 1, perPage: 1000 },
        sort: { field: "id", order: "ASC" },
        filter: { status: ids },
        meta: {
          raw: true,
          populate: { payouts: { populate: { payout_status: true } } },
        },
      });
      if (data.length === 0) return;
      checkAndUpdateRecords(data);
    };

    fetchDataAndUpdate();
  }, []);

  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));

  return (
    <>
      <ListView
        actions={false}
        component="div"
        title={" "}
        pagination={<CustomPagination />}
      >
        <AgDatagrid preferenceKey={AG_PREFS_KEY} rowClick="show">
          <FunctionField
            sortBy="closed_out"
            label="Closed"
            render={(record: RaRecord) => (
              <div data-ag-skip-row-click onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  sx={{
                    padding: 0,
                  }}
                  checked={record.closed_out || false}
                  onChange={(e) =>
                    handleClosedOutChange(record, e.target.checked)
                  }
                />
              </div>
            )}
          />
          <TextField source="application_id" label="ID" />
          <FunctionField
            label="COR"
            sortable={false}
            render={(record: RaRecord) => {
              return record.change_order_request ? record.change_order_request.includes("Yes") ? "Yes" : "No" : "No";
            }}
          />
          <FunctionField
            label="Status"
            sortable={false}
            render={(record) => (
              <Box
                sx={coloredSurfaceSx(record.status?.color || "#cccccc", {
                  padding: "2px 8px",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  maxWidth: "100%",
                  display: "inline-block",
                })}
                title={record.status?.name}
              >
                {record.status?.name}
              </Box>
            )}
          />
          <TextField source="legal_entity_name" label="System Name" noWrap />
          <FunctionField
            label="Email"
            sortBy="point_of_contact.email"
            render={(record: RaRecord) => {
              return record.email ? record.email : record.point_of_contact?.email
            }}
            noWrap
            />
          <TextField source="point_of_contact.phone" label="Phone" noWrap />
          <FunctionField
            label="Total Paid Out"
            sortable={false}
            sx={{ display: "block", textAlign: "right" }}
            textAlign="right"
            render={(record: RaRecord) => (
              <TotalPayoutsField applicationId={record.id} />
            )}
            noWrap
          />
          <FunctionField
            label="Balance"
            sortable={false}
            textAlign="right"
            render={(record: RaRecord) => (
              <BalanceField applicationId={record.id} />
            )}
            noWrap
          />
          {!isSmall && (
            <DateField
              source="committee_date"
              label="Commitee Date"
              sx={{ px: 2 }}
            />
          )}
          {!isSmall && (
            <NumberField
              options={CurrencyOptions}
              source="combined_cost_of_projects"
              label="Combined Cost of Project"
              noWrap
            />
          )}
          {!isSmall && (
            <NumberField
              options={CurrencyOptions}
              label="Approved Cost"
              source="approved_project_cost"
              noWrap
            />
          )}
          {!isSmall && (
            <NumberField
              options={CurrencyOptions}
              label="Requested Amount"
              source="requested_grant_amount"
              noWrap
            />
          )}
          {!isSmall && (
            <NumberField
              options={CurrencyOptions}
              label="Award Amount"
              source="award_amount"
              noWrap
            />
          )}
          <TextField
            source="drinking_or_wastewater"
            label="Classification"
            noWrap
          />
          <DateField source="createdAt" label="Created At" noWrap />
          <DateField source="application_date" label="Date Received" noWrap />
          <TextField source="county" label="County" noWrap />
          <TextField source="physical_address_street" label="Street" noWrap />
          <TextField source="physical_address_city" label="City" noWrap />
          <TextField source="physical_address_state" label="State" noWrap />
          <TextField source="physical_address_zip" label="Zip" noWrap />
          <NumberField source="population_served" label="Population" noWrap />
          <TextField source="facility_id" label="Facility ID" noWrap />
          <FunctionField
            label="Selected Projects"
            sortable={false}
            noWrap
            render={(record: RaRecord) => {
              return displayProjects(record.selected_projects);
            }}
          />
          <FunctionField
            label="Projects Approved"
            sortable={false}
            noWrap
            render={(record: RaRecord) => {
              return displayProjects(record.approved_projects);
            }}
          />
        </AgDatagrid>
      </ListView>
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <>
          <ModalDenialReason setIsModalOpen={setIsModalOpen} />
        </>
      </Modal>
    </>
  );
};
export default ApplicationPanel;
