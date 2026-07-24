import {
  Box,
  Button,
  Divider,
  Grid,
  Theme,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React from "react";
import {
  AutocompleteArrayInput,
  AutocompleteInput,
  BooleanInput,
  Create,
  DatagridConfigurable,
  List,
  NumberInput,
  RaRecord,
  ReferenceArrayInput,
  ReferenceInput,
  SimpleForm,
  SimpleList,
  TextField,
  TextInput,
  useCreate,
  useNotify,
  useRemoveFromStore,
  useUpdate,
} from "react-admin";
import AddIcon from "@mui/icons-material/Add";
import ColorWheel from "../../_components/ColorWheel";
import { updateRecord } from "../../_helpers/updateRecord";
import { createRecord } from "../../_helpers/createRecord";
import CustomToolBar from "../../_components/CustomToolbar";
import { formatTitle } from "../../../helpers/formatResourceTitle";
import getContrastColor from "../../_helpers/getContrastColor";

interface GrantStatusesProps {
  context:
    | "grant-sub-statuses"
    | "grant-statuses"
    | "payout-statuses"
    | "soonerwarn-statuses"
    | "request-statuses";
}

const GrantStatusesInterface = ({ context }: GrantStatusesProps) => {
  const [color, setColor] = React.useState("#FF0000");
  const [create] = useCreate();
  const [update] = useUpdate();
  const remove = useRemoveFromStore();
  const notify = useNotify();

  const [isCreating, setIsCreating] = React.useState(false);
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));

  return isCreating ? (
    <Create title={" "} component={"div"} redirect={false} resource={context}>
      <Button
        onClick={() =>
          isCreating ? setIsCreating(false) : setIsCreating(true)
        }
      >
        Back
      </Button>
      <SimpleForm
        onSubmit={(formData) =>
          createRecord(
            { ...formData, color: color },
            create,
            notify,
            setIsCreating,
            context
          )
        }
      >
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextInput
              source="name"
              label="Name"
              fullWidth
              helperText={false}
            />
          </Grid>
          <Grid item xs={6}>
            <NumberInput
              source="order"
              label="Order"
              fullWidth
              helperText={false}
            />
          </Grid>
          <Grid item xs={6}>
            <BooleanInput
              source="is_active"
              label="Is Active"
              helperText={"Counts towards approved applications"}
            />
          </Grid>

          <Grid item xs={6}>
            <Box sx={{ marginTop: "1rem" }}>
              <ColorWheel color={color} setColor={setColor} />
            </Box>
          </Grid>

          <Grid item xs={6}>
            <TextInput
              source="description"
              label="Description"
              fullWidth
              helperText={false}
              multiline
              rows={10}
            />
          </Grid>

          {(context === "grant-statuses" ||
            context === "soonerwarn-statuses" ||
            context === "request-statuses") && (
            <Grid item xs={6}>
              <ReferenceArrayInput
                source="next_statuses"
                reference={context}
                fullWidth
              >
                <AutocompleteArrayInput
                  optionText="name"
                  label="Next Statuses"
                  helperText={"Select Next Available Statuses"}
                />
              </ReferenceArrayInput>
            </Grid>
          )}

          {context === "grant-statuses" && (
            <Grid item xs={6}>
              <ReferenceArrayInput
                source="grant_sub_statuses"
                reference="grant-sub-statuses"
                fullWidth
              >
                <AutocompleteArrayInput
                  optionText="name"
                  label="Sub Status"
                  helperText={"Select Sub Statuses"}
                />
              </ReferenceArrayInput>
            </Grid>
          )}

          {context === "grant-statuses" && (
            <Grid item xs={6}>
              <ReferenceArrayInput
                source="email_templates"
                reference="email-templates"
                fullWidth
              >
                <AutocompleteArrayInput
                  optionText="email_name"
                  label="Emails Sent"
                  helperText={"Emails Triggered on Status Change"}
                />
              </ReferenceArrayInput>
            </Grid>
          )}

          {(context === "payout-statuses" ||
            context === "request-statuses" ||
            context === "soonerwarn-statuses") && (
            <Grid item xs={6}>
              <ReferenceInput
                source="email_template"
                reference="email-templates"
                fullWidth
              >
                <AutocompleteInput
                  optionText="email_name"
                  label="Email Sent"
                  helperText={"Emails Triggered on Status Change"}
                />
              </ReferenceInput>
            </Grid>
          )}

          {context === "grant-sub-statuses" && (
            <Grid item xs={6}>
              <ReferenceArrayInput
                source="grant_statuses"
                reference="grant-statuses"
                fullWidth
              >
                <AutocompleteArrayInput
                  optionText="name"
                  label="Parent Status"
                />
              </ReferenceArrayInput>
            </Grid>
          )}

          {context === "grant-sub-statuses" && (
            <Grid item xs={6}>
              <ReferenceInput
                source="email_template"
                reference="email-templates"
                fullWidth
              >
                <AutocompleteInput
                  optionText="email_name"
                  label="Emails Sent"
                  helperText={"Email Triggered on Status Change"}
                />
              </ReferenceInput>
            </Grid>
          )}
        </Grid>
      </SimpleForm>
    </Create>
  ) : (
    <Box>
      {/* place button far right */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography ml={2} variant="h6">
          {formatTitle(context)}
        </Typography>
        <Button onClick={() => setIsCreating(true)}>
          Add New Status
          <AddIcon />
        </Button>
      </Box>
      <Divider />
      <List
        sort={{ field: "order", order: "ASC" }}
        disableSyncWithLocation
        title={" "}
        resource={context}
        actions={false}
        exporter={false}
      >
        {isSmall ? (
          <SimpleList
            primaryText={(record) => record.name}
            secondaryText={(record) => record.order}
            tertiaryText={(record) => record.color}
          />
        ) : (
          <DatagridConfigurable
            bulkActionButtons={false}
            expandSingle={true}
            isRowExpandable={() => true}
            isRowSelectable={() => false}
            rowSx={(record) => {
              const fg = getContrastColor(record.color);
              // Status color must win over shared RaDatagrid-rowOdd zebra.
              return {
                backgroundColor: record.color,
                color: fg,
                "&.RaDatagrid-rowOdd, &.RaDatagrid-rowEven": {
                  backgroundColor: record.color,
                },
                "&:hover, &.RaDatagrid-rowOdd:hover, &.RaDatagrid-rowEven:hover":
                  {
                    backgroundColor: record.color,
                  },
                "& .MuiTableCell-root": {
                  color: fg,
                  backgroundColor: "transparent",
                },
              };
            }}
            expand={(record: RaRecord) => {
              return (
                <SimpleForm
                  onSubmit={(formData) =>
                    updateRecord(
                      formData,
                      record,
                      update,
                      notify,
                      remove,
                      context
                    )
                  }
                  toolbar={<CustomToolBar />}
                  defaultValues={record.record}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextInput
                        source="name"
                        label="Name"
                        fullWidth
                        helperText={false}
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <NumberInput
                        source="order"
                        label="Order"
                        fullWidth
                        helperText={false}
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <TextInput source="color" label="Color" fullWidth />
                    </Grid>
                    {/* 
                        <Grid item xs={6} >
            <Box sx={{ marginTop: '1rem' }}>
              <ColorWheel color={color} setColor={setColor} />
            </Box>
          </Grid> */}
                    {(context === "grant-statuses" ||
                      context === "soonerwarn-statuses" ||
                      context === "request-statuses" ||
                      context === "payout-statuses") && (
                      <Grid item xs={6}>
                        <ReferenceArrayInput
                          source="next_statuses"
                          reference={context}
                          fullWidth
                        >
                          <AutocompleteArrayInput
                            optionText="name"
                            label="Next Statuses"
                            helperText={"Select Next Available Statuses"}
                          />
                        </ReferenceArrayInput>
                      </Grid>
                    )}

                    <Grid item xs={6}>
                      <BooleanInput
                        source="is_active"
                        label="Is Active"
                        helperText={"Counts towards approved applications"}
                      />
                    </Grid>

                    {context === "grant-statuses" && (
                      <Grid item xs={6}>
                        <ReferenceArrayInput
                          source="grant_sub_statuses"
                          reference="grant-sub-statuses"
                          fullWidth
                        >
                          <AutocompleteArrayInput
                            optionText="name"
                            label="Sub Status"
                            helperText={"Select Sub Statuses"}
                          />
                        </ReferenceArrayInput>
                      </Grid>
                    )}

                    {context === "grant-statuses" && (
                      <Grid item xs={6}>
                        <ReferenceArrayInput
                          source="email_templates"
                          reference="email-templates"
                          filter={{
                            module: context.includes(
                              "grant" ? "Grant Manager" : "Soonerwarn Managment"
                            ),
                          }}
                          fullWidth
                        >
                          <AutocompleteArrayInput
                            optionText="email_name"
                            label="Emails Sent"
                            helperText={"Emails Triggered on Status Change"}
                          />
                        </ReferenceArrayInput>
                      </Grid>
                    )}

                    {(context === "payout-statuses" ||
                      context === "soonerwarn-statuses" ||
                      context === "request-statuses") && (
                      <Grid item xs={6}>
                        <ReferenceInput
                          source="email_template"
                          reference="email-templates"
                          fullWidth
                          filter={{
                            module: context.includes("grant")
                              ? "Grant Manager"
                              : "Soonerwarn Managment",
                          }}
                        >
                          <AutocompleteInput
                            optionText="email_name"
                            label="Email Sent"
                            helperText={"Email Triggered on Status Change"}
                          />
                        </ReferenceInput>
                      </Grid>
                    )}

                    {context === "grant-sub-statuses" && (
                      <Grid item xs={6}>
                        <ReferenceInput
                          source="email_template"
                          reference="email-templates"
                          filter={{ module: "Grant Management" }}
                          fullWidth
                        >
                          <AutocompleteInput
                            optionText="email_name"
                            label="Emails Sent"
                            helperText={"Email Triggered on Status Change"}
                          />
                        </ReferenceInput>
                      </Grid>
                    )}
                    {context === "grant-sub-statuses" && (
                      <Grid item xs={6}>
                        <ReferenceArrayInput
                          source="grant_statuses"
                          reference="grant-statuses"
                          fullWidth
                        >
                          <AutocompleteArrayInput
                            optionText="name"
                            label="Parent Status"
                          />
                        </ReferenceArrayInput>
                      </Grid>
                    )}
                    <Grid item xs={6}>
                      <TextInput
                        source="description"
                        label="Description"
                        fullWidth
                        helperText={false}
                        multiline
                        rows={10}
                      />
                    </Grid>
                  </Grid>
                </SimpleForm>
              );
            }}
            sx={{
              "& .css-dsuxgy-MuiTableCell-root": {
                padding: "0px",
                alignItems: "center",
              },
            }}
          >
            <TextField source="name" />
            <TextField source="color" />
            <TextField source="description" />
            <TextField source="order" />
          </DatagridConfigurable>
        )}
      </List>
    </Box>
  );
};

export default GrantStatusesInterface;
