import React from "react";
import {
  Create,
  Edit,
  SimpleForm,
  TextInput,
  SelectInput,
  BooleanInput,
  ReferenceInput,
  required,
} from "react-admin";
import { cronOptions } from "./types";

const entityOptions = [
  { id: "watersystem", name: "Water System" },
  { id: "grant-application-finals", name: "Grant Application" },
  { id: "associates", name: "Associates" },
];

const ScheduledEmailForm = ({ mode }: { mode: "create" | "edit" }) => {
  const form = (
    <SimpleForm>
      <TextInput source="name" label="Task Name" validate={required()} />
      <SelectInput
        source="cron_rule"
        label="Schedule"
        choices={cronOptions.map(({ label, value }) => ({ id: value, name: label }))}
        validate={required()}
      />
      <ReferenceInput
        source="email_template"
        reference="email-templates"
        label="Email Template"
      >
        <SelectInput optionText="email_name" />
      </ReferenceInput>
      <SelectInput
        source="entity_type"
        label="Entity Type"
        choices={entityOptions}
        validate={required()}
      />
      <TextInput source="condition" label="Condition (JSON)" multiline />
      <BooleanInput source="is_active" label="Active" />
    </SimpleForm>
  );

  return mode === "create" ? (
    <Create>{form}</Create>
  ) : (
    <Edit>{form}</Edit>
  );
};

export default ScheduledEmailForm;