import React from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import {
  ListView,
  TextField,
  NumberField,
  RaRecord,
  DateField,
  FunctionField,
  Edit,
  SimpleForm,
  Create,
  useCreate,
  useNotify,
  useUpdate,
  useRemoveFromStore,
} from "react-admin";
import { DatagridConfigurable } from "@orwa/entity-id";
import { Visibility, Edit as EditIcon } from "@mui/icons-material";
import CustomPagination from "../_components/CustomPagination";
import { customDatagridStyle } from "../../css";
import { formResourceShellSx } from "../../css/formLayout";
import SoonerwarnShow from "./SoonerwarnShow";
import SoonerwarnFormFields from "./components/SoonerwarnFormFields";
import { useSoonerwarnContext } from "./SoonerwarnContextProvider";
import CustomSecondaryHeader from "../_components/CustomSecondaryHeader";
import { createRecord } from "../_helpers/createRecord";
import { updateRecord } from "../_helpers/updateRecord";
import CustomToolBar from "../_components/CustomToolbar";
import SelectSoonerwarnStatus from "./components/SelectSoonerwarnStatus";

/**
 * Applications / Volunteer tab panel — renders inside the tab's ListScope
 * (`soonerwarns`); the status filter is a plain list filter value now, set by
 * the Filters drawer.
 */
const SoonerwarnList = () => {
  const [isEditing, setIsEditing] = React.useState(false);
  const { isCreating, setIsCreating, setSelectedApplication } =
    useSoonerwarnContext();
  const [create] = useCreate();
  const [update] = useUpdate();
  const notify = useNotify();
  const remove = useRemoveFromStore();

  return isCreating ? (
    <Create resource="soonerwarns" redirect={false} title={" "} sx={formResourceShellSx}>
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
      <ListView
        component="div"
        title=" "
        actions={false}
        pagination={<CustomPagination />}
      >
        <DatagridConfigurable
          sx={customDatagridStyle}
          bulkActionButtons={false}
          expandSingle={true}
          rowClick="expand"
          isRowExpandable={() => true}
          isRowSelectable={() => false}
          expand={(record: RaRecord) => {
            setSelectedApplication(record.record);
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
                  <Edit resource="soonerwarns" id={record.id} redirect={false}>
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
            render={() => <SelectSoonerwarnStatus status_resource="soonerwarn-statuses" record_resource="soonerwarns"/>}
          />
          <TextField source="system_name" label="System Name" noWrap />
          <TextField source="email" label="Email" noWrap />
          <TextField source="phone" noWrap />
          <DateField source="createdAt" label="Created At" noWrap />
          <DateField source="application_date" label="Date Received" noWrap />
          <TextField source="county" label="County" noWrap />
          <TextField source="physical_address_street" label="Street" noWrap />
          <TextField source="physical_address_city" label="City" noWrap />
          <TextField source="physical_address_state" label="State" noWrap />
          <TextField source="physical_address_zip" label="Zip" noWrap />
        </DatagridConfigurable>
      </ListView>
    </>
  );
};

export default SoonerwarnList;
