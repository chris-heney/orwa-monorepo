import React from "react";
import { EditBase, RaRecord, SimpleForm, Title } from "react-admin";
import { Box, Card } from "@mui/material";
import CustomFormHeader from "../../_components/CustomFormHeader";
import CustomToolBar from "../../_components/CustomToolbar";
import ScholarshipFormFields from "./components/ScholarshipFormFields";

const EditScholarshipApplication = () => {
  return (
    <Box sx={{ py: 2 }}>
      <EditBase title="Edit Scholarship Application" redirect="show">
        <Card sx={{ borderRadius: 0 }}>
          <Title title="Scholarship Application Edit" />
          <CustomFormHeader
            display={(record: RaRecord) => 
              `${record?.applicant_first_name} ${record?.applicant_last_name}`
            }
            redirectTo="/scholarship/dashboard"
          />
          <SimpleForm toolbar={<CustomToolBar />}>
            <ScholarshipFormFields />
          </SimpleForm>
        </Card>
      </EditBase>
    </Box>
  );
};

export default EditScholarshipApplication;
