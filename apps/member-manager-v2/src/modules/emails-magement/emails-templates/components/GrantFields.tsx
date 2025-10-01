import {Grid} from "@mui/material";
import { 
  AutocompleteArrayInput, 
  AutocompleteInput, 
  ReferenceArrayInput, 
  ReferenceInput 
} from "react-admin";
import React from "react";

interface GrantFieldsProps {
  status: any;
}

const GrantFields = ({ status }: GrantFieldsProps) => {
  return (
    <>
      <Grid item xs={12}>
        <ReferenceArrayInput
          source="grant_status"
          reference="grant-statuses"
          fullWidth
        >
          <AutocompleteArrayInput
            optionText="name"
            label="Trigger Statuses"
            helperText={"Select When This Email is Sent"}
          />
        </ReferenceArrayInput>
      </Grid>
      <Grid item xs={12}>
        <ReferenceInput
          source="grant_sub_status"
          reference="grant-sub-statuses"
          filter={{ grant_statuses: status }}
          fullWidth
        >
          <AutocompleteInput
            optionText="name"
            label="Trigger Sub Statuses"
            helperText={"Select When This Email is Sent"}
          />
        </ReferenceInput>
      </Grid>
    </>
  );
};

export default GrantFields; 