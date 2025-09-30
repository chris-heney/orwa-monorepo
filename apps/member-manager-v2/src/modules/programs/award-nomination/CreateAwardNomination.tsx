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
import AwardFormFields from "./components/AwardFormFields";
import { FieldValues } from "react-hook-form";

const CreateAwardNomination = () => {
  const [create] = useCreate();
  const notify = useNotify();
  const redirect = useRedirect();

  const handleSubmit = async (data: FieldValues) => {
    try {
      // Set default status to Submitted if not provided
      const nominationData = {
        ...data,
        nomination_status: data.nomination_status || "Submitted",
        submission_date: data.nomination_status === "Submitted" ? new Date().toISOString() : null,
        award_year: data.award_year || new Date().getFullYear(),
      };

      const result = await create("award-nominations", { 
        data: nominationData 
      });

      notify("Award Nomination created successfully", { type: "success" });
      redirect("show", "award-nominations", result.id);
    } catch (error) {
      console.error("Error creating award nomination:", error);
      notify("Error creating award nomination", { type: "error" });
    }
  };

  return (
    <Box sx={{ py: 2 }}>
      <Create 
        resource="award-nominations" 
        title="Create Award Nomination"
        redirect="show"
      >
        <Card sx={{ borderRadius: 0 }}>
          <CustomHeader 
            title="New Award Nomination" 
            sx={{ textAlign: "center" }} 
          />
          <SimpleForm 
            onSubmit={handleSubmit}
            toolbar={<CustomToolBar />}
            defaultValues={{
              nomination_status: "Submitted",
              award_year: new Date().getFullYear(),
              state: "OK",
            }}
          >
            <AwardFormFields />
          </SimpleForm>
        </Card>
      </Create>
    </Box>
  );
};

export default CreateAwardNomination;
