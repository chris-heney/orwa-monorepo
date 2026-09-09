import React from "react";
import { EditBase, Title } from "react-admin";
import MembershipForm from "./components/MembershipForm";

// No padded Box / Card wrapper: the form's heading bar must sit flush under
// the app bar, and MembershipForm already paints its own section card.
const MembershipEdit = () => {
  return (
    <EditBase hasShow={false} redirect={false} mutationMode="pessimistic">
      <Title title="Memberships" />
      <MembershipForm />
    </EditBase>
  );
};

export default MembershipEdit;
