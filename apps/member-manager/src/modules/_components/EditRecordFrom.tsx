import React from "react";
import { Edit, SimpleForm } from "react-admin";
import { useLocation } from "react-router-dom";
import CustomHeader from "./CustomHeader";

const CreateRecordFrom = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const path = location.pathname;

  const resource = path.split("/")[1];

  const title = resource.endsWith("s")
      ? resource
          .slice(0, -1)
          .replace("-", " ")
          .replace(/\b\w/g, (c) => c.toUpperCase())
      : resource.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <Edit title={`Edit ${title}`} redirect="list">
      <CustomHeader title={`Edit ${title}`}  />
      <SimpleForm>{children}</SimpleForm>
    </Edit>
  );
};

export default CreateRecordFrom;
