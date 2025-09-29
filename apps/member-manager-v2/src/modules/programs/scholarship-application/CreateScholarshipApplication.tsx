import React from "react";
import {
  Create,
  SimpleForm,
  useCreate,
  useNotify,
  useRedirect,
} from "react-admin";
import { Box, Card } from "@mui/material";
import CustomHeader from "../../_components/CustomHeader";
import CustomToolBar from "../../_components/CustomToolbar";
import ScholarshipFormFields from "./components/ScholarshipFormFields";
import { FieldValues } from "react-hook-form";

const CreateScholarshipApplication = () => {
  const [create] = useCreate();
  const notify = useNotify();
  const redirect = useRedirect();

  const handleSubmit = async (data: FieldValues) => {
    try {
      // Set default status to Draft if not provided
      const applicationData = {
        ...data,
        application_status: data.application_status || "Draft",
        submission_date: data.application_status === "Submitted" ? new Date().toISOString() : null,
      };

      const result = await create("scholarship-applications", { 
        data: applicationData 
      });

      notify("Scholarship Application created successfully", { type: "success" });
      redirect("show", "scholarship-applications", result.id);
    } catch (error) {
      console.error("Error creating scholarship application:", error);
      notify("Error creating scholarship application", { type: "error" });
    }
  };

  return (
    <Box sx={{ py: 2 }}>
      <Create 
        resource="scholarship-applications" 
        title="Create Scholarship Application"
        redirect="show"
      >
        <Card sx={{ borderRadius: 0 }}>
          <CustomHeader 
            title="New Scholarship Application" 
            sx={{ textAlign: "center" }} 
          />
          <SimpleForm 
            onSubmit={handleSubmit}
            toolbar={<CustomToolBar />}
            defaultValues={{
              application_status: "Draft",
            }}
          >
            <ScholarshipFormFields />
          </SimpleForm>
        </Card>
      </Create>
    </Box>
  );
};

export default CreateScholarshipApplication;
