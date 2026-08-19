import React, { ReactNode } from "react";
import { Button, EditButton, useRedirect } from "react-admin";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PageHeadingBar from "../PageHeadingBar";

type ReviewPageBarProps = {
  title: string;
  backTo: string;
  showEdit?: boolean;
  /** Extra heading actions (e.g. Print) rendered before Edit. */
  extraActions?: ReactNode;
};

const ReviewPageBar = ({
  title,
  backTo,
  showEdit = false,
  extraActions,
}: ReviewPageBarProps) => {
  const redirect = useRedirect();

  return (
    <PageHeadingBar
      title={title}
      actions={
        <>
          <Button
            onClick={() => redirect(backTo)}
            sx={{ color: "white" }}
            label="Back"
          >
            <ArrowBackIcon />
          </Button>
          {extraActions}
          {showEdit ? (
            <EditButton sx={{ color: "white" }} label="Review" />
          ) : null}
        </>
      }
    />
  );
};

export default ReviewPageBar;
