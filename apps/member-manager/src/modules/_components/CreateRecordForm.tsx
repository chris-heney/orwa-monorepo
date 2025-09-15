import React from "react";
import {
  Button,
  Create,
  RedirectionSideEffect,
  SimpleForm,
  useRedirect,
} from "react-admin";
import CustomHeader from "./CustomHeader";
import { useLocation } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const CreateRecordForm = ({
  children,
  redirectPath,
  redirectOnSave,
}: {
  children: React.ReactNode;
  redirectOnSave?: RedirectionSideEffect;
  redirectPath: string;
}) => {
  const redirect = useRedirect();
  const location = useLocation();
  const path = location.pathname;

  const resource = path.split("/")[1];

  const title = resource.endsWith("s")
    ? resource
        .slice(0, -1)
        .replace("-", " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
    : resource.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const RedirectButton = () => {
    return (
      <Button
        onClick={() => redirect(redirectPath)}
        sx={{
          color: "white",
          mr: 2,
        }}
        label="Back"
      >
        <ArrowBackIcon />
      </Button>
    );
  };

  return (
    <Create sx={{mt: 1}} title={`New ${title}`} redirect={redirectOnSave ?? "edit"}>
      <CustomHeader
        title={`New ${title}`}
        Component={() => <RedirectButton />}
      />
      <SimpleForm>{children}</SimpleForm>
    </Create>
  );
};

export default CreateRecordForm;
