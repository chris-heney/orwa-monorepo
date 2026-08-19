import React from "react";
import { DeleteButton, SaveButton, Toolbar, useRecordContext } from "react-admin";
import { toolbarSx } from "./styles";

const ReviewToolbar = ({ redirect }: { redirect: string }) => {
  const record = useRecordContext();
  return (
    <Toolbar sx={toolbarSx}>
      <SaveButton variant="contained" />
      {record?.id != null ? (
        <DeleteButton mutationMode="pessimistic" redirect={redirect} />
      ) : null}
    </Toolbar>
  );
};

export default ReviewToolbar;
