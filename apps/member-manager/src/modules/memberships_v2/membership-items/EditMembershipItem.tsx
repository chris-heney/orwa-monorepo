import React from "react";
import { EditBase, Title } from "react-admin";
import MembershipItemsForm from "./components/MembershipItemsForm";

// No padded Box / Card wrapper: the form's heading bar must sit flush under
// the app bar, and MembershipItemsForm already paints its own section card.
const EditMembershipItem = () => {
  return (
    <EditBase
      hasShow={false}
      redirect={() => "membership-management"}
      mutationMode="pessimistic"
    >
      <Title title="Edit Membership Item" />
      <MembershipItemsForm />
    </EditBase>
  );
};

export default EditMembershipItem;
