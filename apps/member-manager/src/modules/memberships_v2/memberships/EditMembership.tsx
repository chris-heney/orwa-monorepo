import React from "react";
import { EditBase, Title } from "react-admin";
import MembershipForm from "./components/MembershipForm";
import { Box, Card } from "@mui/material";

const MembershipEdit = () => {
  return (
    <EditBase hasShow={false} redirect={false}>
      <Title title="Memberships" />
      <Box py={2}>
        <Card>
          <MembershipForm />
        </Card>
      </Box>
    </EditBase>
  );
};

export default MembershipEdit;
