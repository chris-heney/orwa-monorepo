import React from "react";
import { EditBase, Title } from "react-admin";
import MembershipItemsForm from "./components/MembershipItemsForm";
import { Box, Card } from "@mui/material";

const EditMembershipItem = () => {
  return (
    <EditBase hasShow={false} redirect={() => "membership-management"}>
      <Title title="Edit Membership Item" />
      <Box py={2}>
        <Card>
          <MembershipItemsForm />
        </Card>
      </Box>
    </EditBase>
  );
};

export default EditMembershipItem;
