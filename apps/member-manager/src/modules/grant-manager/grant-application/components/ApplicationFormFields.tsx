import React from "react";
import { Box, Button, Card, Divider, Grid, Typography } from "@mui/material";
import {
  AutocompleteArrayInput,
  DateInput,
  Loading,
  NumberInput,
  ReferenceArrayInput,
  ReferenceInput,
  SelectInput,
  TextInput,
  useRecordContext,
} from "react-admin";
import { useFormContext } from "react-hook-form";
import { useGrantContext } from "../../GrantContextProvider";
import ContactsCreateModal from "./ContactsCreateModal";
import FileUploadField from "../../../_components/FileUploadField";

const GrantApplicationFormFields = () => {
  const grantContext = useGrantContext();

  const record = useRecordContext();

  const [createContact, setCreateContact] = React.useState(false);

  const form = useFormContext();
  const projectType = form.watch("drinking_or_wastewater");

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
        <Card sx={{ p: 2, my: 2, mx: 1 }}>
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
          <Card sx={{ p: 2, my: 2, mx: 1 }}>
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
        <Card sx={{ p: 2, my: 2, mx: 1 }}>
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

      
        <Card sx={{ p: 2, my: 2, mx: 1 }}>
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
        <Card sx={{ p: 2, my: 2, mx: 1 }}>
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

        <Card sx={{ p: 2, my: 2, mx: 1 }}>
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
          <Card sx={{ p: 2, my: 2, mx: 1 }}>
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

          {/* <Card sx={{ p: 2, my: 2, mx: 1 }}>
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

        <Card sx={{ p: 2, my: 2, mx: 1 }}>
          <Typography variant="h5">Financials</Typography>
          <Divider />
          <Grid container spacing={1}>
            <Grid item xs={12} md={6} sm={12}>
              <NumberInput
                source="combined_cost_of_projects"
                label="Combined Cost of Projects"
                fullWidth
                helperText={false}
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
