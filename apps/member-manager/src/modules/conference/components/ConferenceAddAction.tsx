import React from "react";
import AddIcon from "@mui/icons-material/Add";
import type { ActionManifest } from "../../../framework/manifest";
import { AddAction } from "../../_components/heading/HeadingActions";
import { useConferenceContext } from "../ConferenceContext";

/**
 * "Add <thing>" for tabs whose create form is INLINE in the panel (the panel
 * swaps its grid for a `<Create>` while `isCreating`), unlike `createAction`
 * which navigates to `/<resource>/create`.
 */
const InlineAddAction = ({ label }: { label: string }) => {
  const { isCreating, setIsCreating } = useConferenceContext();
  return (
    <AddAction
      label={label}
      active={isCreating}
      onClick={() => setIsCreating((prev) => !prev)}
    />
  );
};

export const inlineAddAction = (
  resource: string,
  label: string
): ActionManifest => {
  const Component: ActionManifest["component"] = () => (
    <InlineAddAction label={label} />
  );
  Component.displayName = `InlineAddAction(${resource})`;
  return {
    id: `add-${resource}`,
    label,
    icon: AddIcon,
    scope: "list",
    can: ["create", resource],
    component: Component,
    order: 60,
  };
};

export default InlineAddAction;
