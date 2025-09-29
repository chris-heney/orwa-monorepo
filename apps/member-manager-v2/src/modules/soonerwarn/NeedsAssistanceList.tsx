import React from "react";
import {
  Box,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { Theme } from "@mui/material/styles";
import {
  List,
  DatagridConfigurable,
  NumberField,
  RaRecord,
  DateField,
  FunctionField,
  FilterLiveSearch,
  Edit,
  SimpleForm,
  Create,
  useCreate,
  useNotify,
  useUpdate,
  useRemoveFromStore,
} from "react-admin";
import { Visibility, Edit as EditIcon } from "@mui/icons-material";
import CustomPagination from "../_components/CustomPagination";
import { customDatagridStyle } from "../../css";
import SoonerwarnShow from "./SoonerwarnShow";
import SoonerwarnFormFields from "./components/SoonerwarnFormFields";
import { useSoonerwarnContext } from "./SoonerwarnContextProvider";
import CustomSecondaryHeader from "../_components/CustomSecondaryHeader";
import { createRecord } from "../_helpers/createRecord";
import { updateRecord } from "../_helpers/updateRecord";
import CustomToolBar from "../_components/CustomToolbar";
import SelectSoonerwarnStatus from "./components/SelectSoonerwarnStatus";

const NeedsAssistanceList = () => {
  const [isEditing, setIsEditing] = React.useState(false);
  const {
    isCreating,
    setIsCreating,
    selectedRequestedStatuses,
    setSelectedApplication,
  } = useSoonerwarnContext();
  const [create] = useCreate();
  const [update] = useUpdate();
  const notify = useNotify();
  const remove = useRemoveFromStore();

  return isCreating ? (
    <Create
      resource="soonerwarn-requests"
      redirect={false}
      title={" "}
      sx={{ mt: -2 }}
    >
      <CustomSecondaryHeader title="New Soonerwarn Application" />
      <SimpleForm
        onSubmit={(formData) =>
          createRecord(formData, create, notify, setIsCreating, "soonerwarns")
        }
      >
        <SoonerwarnFormFields />
      </SimpleForm>
    </Create>
  ) : (
    <>
      <List
        disableSyncWithLocation
        component="div"
        title=" "
        resource="soonerwarn-requests"
        actions={<FilterLiveSearch />}
        filter={{ status: selectedRequestedStatuses }}
        queryOptions={{
          meta: {
            raw: true,
          },
        }}
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
          sx={customDatagridStyle}
          bulkActionButtons={false}
          expandSingle={true}
          rowClick="expand"
          isRowExpandable={() => true}
          isRowSelectable={() => false}
          expand={(record: RaRecord) => {
            setSelectedApplication(record.record.system);
            return (
              <>
                <Box display="flex" justifyContent="flex-end" sx={{ p: 1 }}>
                  <Tooltip title={isEditing ? "View" : "Edit"}>
                    <IconButton
                      color="secondary"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      {isEditing ? <Visibility /> : <EditIcon />}
                    </IconButton>
                  </Tooltip>
                </Box>
                {isEditing ? (
                  <Edit
                    resource="soonerwarn-requests"
                    id={record.id}
                    redirect={false}
                  >
                    <SimpleForm
                      onSubmit={(formData) =>
                        updateRecord(
                          formData,
                          record,
                          update,
                          notify,
                          remove,
                          "soonerwarns"
                        )
                      }
                      toolbar={<CustomToolBar />}
                    >
                      <SoonerwarnFormFields />
                    </SimpleForm>
                  </Edit>
                ) : (
                  <SoonerwarnShow />
                )}
              </>
            );
          }}
        >
          <NumberField source="id" label="ID" />
          <FunctionField
            label="Status"
            render={() => (
              <SelectSoonerwarnStatus
                status_resource="request-statuses"
                record_resource="soonerwarn"
              />
            )}
          />
          <DateField source="createdAt" label="Date Received" noWrap />

          <FunctionField
            label="System"
            noWrap
            render={(record: any) => {
              return <Typography>{record.system.system_name}</Typography>;
            }}
          />
          <FunctionField
            label="Email"
            render={(record: any) => {
              return <Typography>{record.system.email}</Typography>;
            }}
          />

          {/* phone */}

          <FunctionField
            label="Phone"
            render={(record: any) => {
              return <Typography>{record.system.phone}</Typography>;
            }}
          />

          <FunctionField
            label="Address"
            noWrap
            render={(record: any) => {
              return (
                <Typography>
                  {record.system.physical_address_city +
                    ", " +
                    record.system.physical_address_state +
                    " " +
                    record.system.physical_address_zip}
                </Typography>
              );
            }}
          />
        </DatagridConfigurable>
      </List>
    </>
  );
};

export default NeedsAssistanceList;
