import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import DynamicRecipientList from "./DynamicRecipientList";
import { Alert } from "@mui/material";

interface FormConnectedRecipientListProps {
  maxHeight?: number;
}

const FormConnectedRecipientList: React.FC<FormConnectedRecipientListProps> = ({ 
  maxHeight = 400 
}) => {
  const { watch } = useFormContext();
  
  const entityValue = watch("entity") || "";
  const conditionValue = watch("condition");
  const emailTemplateValue = watch("email_template");
  const taskNameValue = watch("name");
  const taskIdValue = watch("id");

  if (entityValue === "") {
    return <Alert severity="info">Select an entity to preview recipients</Alert>
  }

  return (
    <DynamicRecipientList 
      key={`${entityValue}-${JSON.stringify(conditionValue)}`} // Force re-render when entity or condition changes
      maxHeight={maxHeight}
      entity={entityValue + "s"}
      condition={conditionValue || {}}
      emailTemplate={emailTemplateValue}
      taskId={taskIdValue}
      taskName={taskNameValue}
    />
  );
};

export default FormConnectedRecipientList; 