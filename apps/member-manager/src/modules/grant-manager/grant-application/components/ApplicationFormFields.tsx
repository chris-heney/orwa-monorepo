import React from "react";
import { Box, Button, Card, Divider, Grid, Typography } from "@mui/material";
import {
  ArrayInput,
  AutocompleteArrayInput,
  DateInput,
  Loading,
  NumberInput,
  ReferenceArrayInput,
  ReferenceInput,
  SelectInput,
  SimpleFormIterator,
  TextInput,
  useRecordContext,
} from "react-admin";
import { useFormContext, useWatch } from "react-hook-form";
import { useGrantContext } from "../../GrantContextProvider";
import ContactsCreateModal from "./ContactsCreateModal";
import FileUploadField from "../../../_components/FileUploadField";
import { formatNumber } from "../../../../helpers/Formators";
import { formSectionCardSx } from "../../../../css/formLayout";

const PROJECT_COST_SOURCE_CHOICES = [
  { id: "applicant", name: "Applicant" },
  { id: "document", name: "Document" },
  { id: "even-split", name: "Even Split" },
];

/** Live sum of project_costs amounts for the disabled Combined Cost field. */
const ProjectCostsCombinedHint = () => {
  const costs = useWatch({ name: "project_costs" }) as
    | Array<{ amount?: number | string }>
    | undefined;
  const sum = Array.isArray(costs)
    ? costs.reduce((acc, row) => {
        const n = Number(row?.amount);
        return acc + (Number.isFinite(n) ? Math.round(n) : 0);
      }, 0)
    : 0;

  return (
    <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: -1, mb: 1 }}>
      Sum of project costs: {formatNumber(sum)} (server recomputes Combined Cost on save)
    </Typography>
  );
};

const GrantApplicationFormFields = () => {
  const grantContext = useGrantContext();

  const record = useRecordContext();

  const [createContact, setCreateContact] = React.useState(false);

  const form = useFormContext();
  const projectType = form.watch("drinking_or_wastewater");
  const projectCosts = useWatch({ name: "project_costs" }) as unknown[] | undefined;
  const hasProjectCosts = Array.isArray(projectCosts) && projectCosts.length > 0;

  return !grantContext || !form.getValues() ? (
    <Loading />
  ) : (
    <Grid
      container
      spacing={0}
      gap={0}
      alignItems={"stretch"}
      justifyItems={"stretch"}
      alignSelf={"stretch"}
    >
      {/* Column 1 */}
      <Grid
        item
        xs={12}
        md={6}
        sm={12}
        alignItems={"stretch"}
        justifyItems={"stretch"}
        alignSelf={"stretch"}
      >
        {/* system information and contacts */}
        <Card sx={formSectionCardSx}>
          <Typography variant="h5">System Information</Typography>
          <Divider />
          <Grid container spacing={1}>
            <Grid item xs={12} md={6} sm={12}>
              <TextInput
                source="legal_entity_name"
                label="System Name"
                fullWidth
                helperText={false}
              />
            </Grid>
            <Grid item xs={12} md={6} sm={12}>
              <TextInput
                source="previous_application_id"
                label="Previous Application ID"
                fullWidth
                helperText={false}
              />
            </Grid>
            <Grid item xs={12} md={6} sm={12}>
              <TextInput
                source="facility_id"
                label="Facility ID"
                fullWidth
                helperText={false}
              />
            </Grid>
            <Grid item xs={12} md={6} sm={12}>
              <NumberInput
                source="population_served"
                label="Population Served"
                fullWidth
                helperText={false}
              />
            </Grid>
            <Grid item xs={12} md={6} sm={12}>
              <TextInput
                source="county"
                label="County"
                fullWidth
                helperText={false}
              />
            </Grid>
            <Grid item xs={12} md={6} sm={12}>
              {/* hidden status input, grant-denial-reasons*/}
              {/* <ReferenceInput source="status" reference="grant-statuses" defaultValue={12} fullWidth helperText={false} hidden>
                <AutocompleteInput optionText="name" hidden defaultValue={12} />
              </ReferenceInput>
              <ReferenceInput source="grant" reference="grants" defaultValue={grantContext.id} fullWidth helperText={false} >
                <AutocompleteInput optionText="name" defaultValue={grantContext.id}  />
              </ReferenceInput> */}
            </Grid>
          </Grid>
        </Card>

        {record && (
          // proposals, uploaded_engineering_report, uploaded_notice_of_violation, consent_order, applicant_pdf, award_letter, uploaded_additional_files
          <Card sx={formSectionCardSx}>
            <Typography variant="h5">Media</Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container columnSpacing={2} rowSpacing={1}>
              <FileUploadField
                source="proposals"
                label="Proposal Bids"
                multiple={true}
              />
              <FileUploadField source="applicant_pdf" label="Applicant PDF" />
              <FileUploadField source="award_letter" label="Award Letter" />
              <FileUploadField source="consent_order" label="Consent Order" />
              <FileUploadField
                source="uploaded_engineering_report"
                label="Uploaded Engineering Report"
              />
              <FileUploadField
                source="uploaded_notice_of_violation"
                label="Uploaded Notice of Violation"
              />
              <FileUploadField
                source="uploaded_additional_files"
                label="Uploaded Additional Files"
                multiple={true}
              />
            </Grid>
          </Card>
        )}

        {/* Mailing */}
        <Card sx={formSectionCardSx}>
          <Typography variant='h5'>Mailing Address</Typography>
          <Divider />
          <Grid container spacing={1}>
            <Grid item xs={12} md={6} sm={12}>
              <TextInput source="mailing_address_street" label="Street" fullWidth helperText={false} />
            </Grid>
            <Grid item xs={12} md={6} sm={12}>
              <TextInput source="mailing_address_line_two" label="Line 2" fullWidth helperText={false} />
            </Grid>
            <Grid item xs={12} md={6} sm={12}>
              <TextInput source="mailing_address_city" label="City" fullWidth helperText={false} />
            </Grid>
            <Grid item xs={12} md={6} sm={12}>
              <TextInput source="mailing_address_state" label="State" fullWidth helperText={false} />
            </Grid>
            <Grid item xs={12} md={6} sm={12}>
              <TextInput source="mailing_address_zip" label="Zip" fullWidth helperText={false} />
            </Grid>
          </Grid>
        </Card>


        {/* Financials */}

      
        <Card sx={formSectionCardSx}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={6} sm={12}>
              <DateInput
                source="application_date"
                label="Application Date"
                fullWidth
                helperText={false}
              />
            </Grid>
            <Grid item xs={12} md={6} sm={12}>
              <DateInput
                source="committee_date"
                label="Committee Date"
                fullWidth
                helperText={false}
              />
            </Grid>
          </Grid>
        </Card>
      </Grid>
      {/* COlUMN 2 */}
      <Grid
        item
        xs={12}
        md={6}
        sm={12}
        alignItems={"stretch"}
        justifyItems={"stretch"}
        alignSelf={"stretch"}
      >
        {/* Physical Address */}
        <Card sx={formSectionCardSx}>
          <Typography variant="h5">Physical Address</Typography>
          <Divider />
          <Grid container spacing={1}>
            <Grid item xs={12} md={6} sm={12}>
              <TextInput
                source="physical_address_street"
                label="Street"
                fullWidth
                helperText={false}
              />
            </Grid>
            <Grid item xs={12} md={6} sm={12}>
              <TextInput
                source="physical_address_line_two"
                label="Line 2"
                fullWidth
                helperText={false}
              />
            </Grid>
            <Grid item xs={12} md={6} sm={12}>
              <TextInput
                source="physical_address_city"
                label="City"
                fullWidth
                helperText={false}
              />
            </Grid>
            <Grid item xs={12} md={6} sm={12}>
              <TextInput
                source="physical_address_state"
                label="State"
                fullWidth
                helperText={false}
              />
            </Grid>
            <Grid item xs={12} md={6} sm={12}>
              <TextInput
                source="physical_address_zip"
                label="Zip"
                fullWidth
                helperText={false}
              />
            </Grid>
          </Grid>
        </Card>

        {/* Point of Contact */}

        <Card sx={formSectionCardSx}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h5">Point of Contact</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setCreateContact(true);
              }}
            >
              Add Point of Contact
            </Button>
          </Box>
          <Divider />
          <Grid container spacing={1}>
            <Grid item xs={12} md={6} sm={12}>
              <ReferenceInput
                source="point_of_contact"
                label="Point of Contact"
                reference="contacts"
                fullWidth
                helperText={false}
              >
                <AutocompleteArrayInput
                  optionText={(record) => record.first + " " + record.last}
                />
              </ReferenceInput>
            </Grid>
            <Grid item xs={12} md={6} sm={12}>
              <ReferenceInput
                source="chairman"
                label="Chairman"
                reference="contacts"
                fullWidth
                helperText={false}
              >
                <AutocompleteArrayInput
                  optionText={(record) => record.first + " " + record.last}
                />
              </ReferenceInput>
            </Grid>
            <Grid item xs={12} md={12} sm={12}>
              <ReferenceArrayInput
                source="additional_contacts"
                label="Additional Contacts"
                reference="contacts"
                fullWidth
              >
                <AutocompleteArrayInput
                  label="Additional Contacts"
                  helperText={false}
                  optionText={(record) => record.first + " " + record.last}
                />
              </ReferenceArrayInput>
            </Grid>
            <Grid item xs={12} md={6} sm={12}>
              <TextInput
                source="signatory_name"
                label="Signatory Name"
                fullWidth
                helperText={false}
              />
            </Grid>
            <Grid />
            <Grid item xs={12} md={6} sm={12}>
              <TextInput
                source="signatory_title"
                label="Signatory Title"
                fullWidth
                helperText={false}
              />
            </Grid>
            <Grid item xs={12} md={12} sm={12}>
              <TextInput
                source="signature"
                label="Signature"
                fullWidth
                helperText={false}
                multiline
                rows={5}
              />
            </Grid>
          </Grid>
        </Card>
        {/* Proposals and Information */}
        <Grid item xs={12} md={12} sm={12}>
          <Card sx={formSectionCardSx}>
            <Typography variant="h5">
              Project Description - Justification - Estimated Cost
            </Typography>
            <Divider />
            <SelectInput
              source="drinking_or_wastewater"
              label="Drinking or Wastewater"
              fullWidth
              helperText={false}
              choices={[
                { id: "Drinking Water", name: "Drinking Water" },
                { id: "Wastewater", name: "Wastewater" },
                { id: "Other", name: "Other" },
              ]}
            />
            <ReferenceInput
              source="selected_projects"
              reference="project-types"
              filter={projectType ? { classification: projectType } : {}}
              perPage={1000}
              fullWidth
            >
              <AutocompleteArrayInput
                optionText="name"
                helperText={"Filtered Based on Project Type"}
              />
            </ReferenceInput>
            <ReferenceInput
              source="approved_projects"
              reference="project-types"
              filter={projectType ? { classification: projectType } : {}}
              perPage={1000}
              fullWidth
              helperText={false}
            >
              <AutocompleteArrayInput
                helperText={"Filtered Based on Project Type"}
                optionText="name"
              />
            </ReferenceInput>
            <TextInput
              source="change_order_request"
              label="Change Order Request"
              fullWidth
              helperText={false}
            />
            <Grid item xs={12} md={6} sm={12}>
              <TextInput
                source="previous_application_id"
                label="Previous Application ID"
                fullWidth
                helperText={"If Applicable"}
              />
            </Grid>
          {/* description_justification_estimated_cost */}
            <TextInput
              source="description_justification_estimated_cost"
              label="Description - Justification - Estimated Cost"
              fullWidth
              helperText={false}
              multiline
              rows={5}
            />
            {/* additional_information */}
            <TextInput 
              source="additional_information" 
              label="Additional Information" 
              fullWidth 
              helperText={false} 
              multiline 
              rows={5}
            />
            {/* <TextInput source="other_describe" label="Other Describe" fullWidth helperText={false}   multiline rows={3}/> */}
          </Card>
          {/* Engineer Information */}

          {/* <Card sx={formSectionCardSx}>
          <Typography variant='h5'>Engineer Information</Typography>
          <Divider />
          <ReferenceInput source="engineer" label="Engineer" reference="contacts" fullWidth helperText={false}>
            <AutocompleteArrayInput optionText={(record) => record.first + ' ' + record.last} />
          </ReferenceInput>
          <TextInput source="engineering_report" label="Engineering Report" fullWidth helperText={false} />
          <TextInput source="upload_engineering_report" label="Upload Engineering Report" fullWidth helperText={false} />
          <TextInput source="report_approved_by_deq" label="Report Approved by DEQ" fullWidth helperText={false} />
          <TextInput source="resolves_violation" label="Resolves Violation" fullWidth helperText={false} />
          <TextInput source="notice_of_violation" label="Notice of Violation" fullWidth helperText={false} />
        </Card> */}
        </Grid>

        <Card sx={formSectionCardSx}>
          <Typography variant="h5">Financials</Typography>
          <Divider />
          {hasProjectCosts && (
            <Box sx={{ mt: 1.5, mb: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                Project Costs
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Edit per-type amounts below. Combined Cost is recomputed from these
                rows when you save.
              </Typography>
              <ArrayInput source="project_costs" label={false}>
                <SimpleFormIterator
                  inline
                  fullWidth
                  disableAdd
                  disableRemove
                  disableReordering
                  disableClear
                  sx={{
                    "& .RaSimpleFormIterator-line": {
                      borderBottom: 1,
                      borderColor: "divider",
                      pb: 1,
                      mb: 1,
                      alignItems: "flex-start",
                    },
                    "& .RaSimpleFormIterator-form": {
                      flex: 1,
                      gap: 1,
                    },
                  }}
                >
                  {/* Preserve Strapi component id on update when present */}
                  <NumberInput source="id" sx={{ display: "none" }} />
                  <NumberInput
                    source="project_type_id"
                    sx={{ display: "none" }}
                  />
                  <TextInput
                    source="classification"
                    sx={{ display: "none" }}
                  />
                  <TextInput
                    source="name"
                    label="Project Type"
                    helperText={false}
                    InputProps={{ readOnly: true }}
                    sx={{
                      flex: "1 1 40%",
                      minWidth: 160,
                      "& .MuiInputBase-input": {
                        color: "text.primary",
                        WebkitTextFillColor: "unset",
                      },
                    }}
                  />
                  <NumberInput
                    source="amount"
                    label="Amount"
                    helperText={false}
                    sx={{ flex: "0 1 140px", minWidth: 120 }}
                  />
                  <SelectInput
                    source="source"
                    label="Source"
                    choices={PROJECT_COST_SOURCE_CHOICES}
                    helperText={false}
                    sx={{ flex: "0 1 160px", minWidth: 140 }}
                  />
                </SimpleFormIterator>
              </ArrayInput>
              <ProjectCostsCombinedHint />
            </Box>
          )}
          <Grid container spacing={1}>
            <Grid item xs={12} md={6} sm={12}>
              <NumberInput
                source="combined_cost_of_projects"
                label="Combined Cost of Projects"
                fullWidth
                helperText={
                  hasProjectCosts
                    ? "Read-only — recomputed from project costs on save"
                    : false
                }
                disabled={hasProjectCosts}
              />
            </Grid>
            <Grid item xs={12} md={6} sm={12}>
              <NumberInput
                source="requested_grant_amount"
                label="Requested Grant Amount"
                fullWidth
                helperText={false}
              />
            </Grid>
            <Grid item xs={12} md={6} sm={12}>
              <NumberInput
                source="portion_matched_by_recipient"
                label="Portion Matched by Recipient"
                fullWidth
                helperText={false}
              />
            </Grid>
            <Grid item xs={12} md={6} sm={12}>
              <TextInput
                source="minimum_utility_financial_contribution"
                label="Minimum Utility Financial Contribution"
                fullWidth
                helperText={false}
              />
            </Grid>
            <Grid item xs={12} md={6} sm={12}>
              <NumberInput
                source="award_amount"
                label="Award Amount"
                fullWidth
                helperText={false}
              />
            </Grid>
            <Grid item xs={12} md={6} sm={12}>
              <NumberInput
                source="expected_utility_match"
                label="Expected Utility Match"
                fullWidth
                helperText={false}
              />
            </Grid>
          </Grid>
        </Card>
      </Grid>

      <ContactsCreateModal
        createContact={createContact}
        setCreateContact={setCreateContact}
      />
    </Grid>
  );
};

export default GrantApplicationFormFields;
