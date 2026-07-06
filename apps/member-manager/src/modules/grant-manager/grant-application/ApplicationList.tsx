import React, { useEffect } from "react";
import { Box, Checkbox, Modal, useMediaQuery } from "@mui/material";
import { Theme } from "@mui/material/styles";
import {
  List,
  TextField,
  DatagridConfigurable,
  NumberField,
  RaRecord,
  DateField,
  useRefresh,
  FunctionField,
  useDataProvider,
  ChipField,
  FilterLiveSearch,
  useNotify,
  useListContext,
} from "react-admin";
import { CurrencyOptions } from "../../../config/Settings";
import GrantApplicationCreateForm from "./CreateGrantApplication";
import ModalDenialReason from "./components/ModalDenialReason";
import BalanceField, { balance } from "../payouts/components/BalanceField";
import { getGrantStatus } from "../../emails-magement/Helper";
import { useGrantContext } from "../GrantContextProvider";
import CustomPagination from "../../_components/CustomPagination";
import TotalPayoutsField from "../payouts/components/TotalPayoutField";
import { customDatagridStyle } from "../../../css";
import { IProject } from "../types";
import getContrastColor from "../../_helpers/getContrastColor";

const PersistentFilterLiveSearch = () => {
  const { applicationSearchFilter, setApplicationSearchFilter } =
    useGrantContext();
  const { filterValues } = useListContext();

  useEffect(() => {
    if (filterValues.q !== applicationSearchFilter) {
      setApplicationSearchFilter(filterValues.q || "");
    }
  }, [filterValues.q]);

  return <FilterLiveSearch />;
};

const GrantApplicationList = () => {
  const refresh = useRefresh();
  const notify = useNotify();
  const [isCreating, setIsCreating] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const { grantId, applicationStatuses, applicationSearchFilter } =
    useGrantContext();
  const dataProvider = useDataProvider();
  // useEffect(() => {
  //   refresh();
  // }, [applicationStatus, isModalOpen]);

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

    const filteredRecords = await Promise.all(
      records.map(async (record) => {
        const appBalance = await balance(dataProvider, record.id);
        return { record, appBalance };
      })
    );

    const zeroBalances = filteredRecords
      .filter(({ appBalance }) => appBalance === 0)
      .map(({ record }) => record);

    zeroBalances.map(async (record) => {
      if (record.payouts.length === 0) return;
      const updatedRecordParams = {
        id: record.id,
        previousData: record,
        data: {
          status: statusId,
        },
      };
      return dataProvider.update(
        "grant-application-finals",
        updatedRecordParams
      );
    });
  };

  useEffect(() => {
    const fetchDataAndUpdate = async () => {
      const ids = [
        await getGrantStatus(
          dataProvider,
          "Grant Agreement Signed/Sealed/Returned"
        ),
        await getGrantStatus(dataProvider, "Revised per COR"),
      ];

      const { data } = await dataProvider.getList("grant-application-finals", {
        pagination: { page: 1, perPage: 1000 },
        sort: { field: "id", order: "ASC" },
        filter: { status: ids },
      });
      if (data.length === 0) return;
      checkAndUpdateRecords(data);
    };

    fetchDataAndUpdate();
  }, []);

  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));
  return isCreating ? (
    <GrantApplicationCreateForm
      setIsCreating={setIsCreating}
      isCreating={isCreating}
    />
  ) : (
    <>
      <List
        disableSyncWithLocation
        component="div"
        filterDefaultValues={applicationSearchFilter.length > 0 ? { q: applicationSearchFilter } : {}}
        filter={
          applicationStatuses.length > 0
            ? { grant: grantId, status: applicationStatuses }
            : { grant: grantId }
        }
        title={" "}
        resource="grant-application-finals"
        actions={<PersistentFilterLiveSearch />}
        queryOptions={{
          meta: {
            raw: true,
          },
        }}
        sort={{ field: "application_date", order: "DESC" }}
        perPage={50}
        pagination={<CustomPagination />}
        sx={{
          ".RaList-actions": {
            display: "flex",
            justifyContent: "flex-start",
            px: 2,
          },
        }}
      >
        <DatagridConfigurable
          sx={{
            ...customDatagridStyle,
            "& .RaDatagrid-row": {
              padding: "0", // Remove default padding for rows
            },
            "& .RaDatagrid-cell": {
              padding: "4px 8px", // Add tighter padding for cells
            },
            " .th": {
              padding: "4px 8px",
              fontWeight: "bold",
              fontSize: "0.9rem",
              color: "rgba(0, 0, 0, 0.54)",
              backgroundColor: "#f5f5f5",
            },
          }}
          bulkActionButtons={false}
          rowClick={(id, resource, record) => {
            const isCheckboxCell = document
              .getElementById(`checkbox-cell-${record.id}`)
              ?.contains(event?.target as Node);

            if (isCheckboxCell) {
              return false; // Do not expand the row
            }
            return "show"; // Expand the row for other cells
          }}
        >
          <FunctionField
            sortBy="closed_out"
            label="Closed"
            render={(record: RaRecord) => (
              <div
                id={`checkbox-cell-${record.id}`}
                onClick={(e) => e.stopPropagation()} // Stop event propagation
              >
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
            render={(record: RaRecord) => {
              return record.change_order_request ? record.change_order_request.includes("Yes") ? "Yes" : "No" : "No";
            }}
          />
          <FunctionField
            label="Status"
            sx={{
              maxWidth: 10,
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
            noWrap
            render={(record) => (
              <Box
                sx={{
                  backgroundColor: record.status.color,
                  padding: 0.5,
                  color: getContrastColor(record.status.color),
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  maxWidth: "40px",
                  width: "40px",
                  display: "inline-block",
                }}
              >
                {record.status.name}
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
            sx={{ display: "block", textAlign: "right" }}
            textAlign="right"
            render={(record: RaRecord) => (
              <TotalPayoutsField applicationId={record.id} />
            )}
            noWrap
          />
          <FunctionField
            label="Balance"
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
            noWrap
            render={(record: RaRecord) => {
              return displayProjects(record.selected_projects);
            }}
          />
          <FunctionField
            label="Projects Approved"
            noWrap
            render={(record: RaRecord) => {
              return displayProjects(record.approved_projects);
            }}
          />
        </DatagridConfigurable>
      </List>
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
export default GrantApplicationList;
