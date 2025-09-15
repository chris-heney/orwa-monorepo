import React, { useEffect, useState } from "react";
import {
  TextInput,
  NumberInput,
  SelectInput,
  DateInput,
  FileInput,
  FileField,
  useDataProvider,
} from "react-admin";
import { Box, Grid, Typography, Divider } from "@mui/material";
import CustomEditHeader from "../../_components/CustomFormHeader";
import { useFormContext } from "react-hook-form";

const CreateInvoice = () => {
  const [entityOptions, setEntityOptions] = useState([]);
  const dataProvider = useDataProvider();
  const { setValue, watch } = useFormContext();
  const resource = watch("resource");

  useEffect(() => {
    const fetchEntities = async () => {
      if (!resource) {
        setEntityOptions([]);
        setValue("entity_id", null);
        return;
      }

      try {
        const { data } = await dataProvider.getList(resource, {
          pagination: { page: 1, perPage: 100 },
          sort: { field: "name", order: "ASC" },
          filter: {},
        });
        setEntityOptions(
          data.map((entity) => ({ id: entity.id, name: entity.name }))
        );
      } catch (error) {
        console.error("Error fetching entities:", error);
        setEntityOptions([]);
      }
    };

    fetchEntities();
  }, [resource, dataProvider, setValue]);

  return (
    <>
      <CustomEditHeader />

      <Box sx={{ p: 2 }}>
        {/* Entity Information Section */}
        <Typography variant="h5">Entity Information</Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <SelectInput
              source="resource"
              label="Resource"
              choices={[
                { id: "watersystems", name: "Water Systems" },
                { id: "associates", name: "Associates" },
              ]}
              helperText="Select the entity type"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <SelectInput
              source="entity_id"
              label="Entity"
              choices={entityOptions}
              fullWidth
              optionText="name"
              optionValue="id"
              helperText="Select the entity to create an invoice for"
            />
          </Grid>
        </Grid>

        {/* Transaction Details Section */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5">Transaction Details</Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextInput source="email" label="Email" fullWidth />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextInput source="company" label="Company" fullWidth />
            </Grid>
            <Grid item xs={12} sm={4}>
              <NumberInput source="amount" label="Amount" fullWidth />
            </Grid>
            <Grid item xs={12} sm={4}>
              <SelectInput
                source="payment_method"
                label="Payment Method"
                choices={[
                  { id: "Card", name: "Card" },
                  { id: "Invoice", name: "Invoice" },
                ]}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <DateInput
                defaultValue={new Date()}
                source="payment_date"
                label="Payment Date"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <NumberInput defaultValue={new Date().getFullYear()} source="year" label="Year" fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextInput
                source="payment_details"
                label="Payment Details"
                fullWidth
                multiline
                rows={4}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Additional Information Section */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5">Additional Information</Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            
            
            <Grid item xs={12}>
              <TextInput
                source="context"
                label="Context"
                fullWidth
                defaultValue="membership-forms"
              />
            </Grid>
            <Grid item xs={12}>
              <FileInput source="reciept" label="Upload Receipt" accept="*/*">
                <FileField source="src" title="title" />
              </FileInput>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default CreateInvoice;
