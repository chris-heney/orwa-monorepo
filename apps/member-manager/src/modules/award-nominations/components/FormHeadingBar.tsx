import React from "react";
import { useRedirect } from "react-admin";
import PageHeadingBar from "../../_components/PageHeadingBar";
import { reviewResourceSx } from "../../_components/review-packet";

/**
 * Heading bar for the legacy react-admin Edit / Create forms that still live
 * inside `<SimpleForm>`: same `PageHeadingBar` as the framework, Back rendered
 * far right via `onBack` (replaces `ReviewPageBar`, whose Back sat first).
 */
const FormHeadingBar = ({ title, backTo }: { title: string; backTo: string }) => {
  const redirect = useRedirect();
  return <PageHeadingBar title={title} onBack={() => redirect(backTo)} />;
};

export default FormHeadingBar;

/**
 * `reviewResourceSx` + no gap above the bar: react-admin adds `margin-top: 1em`
 * to Edit / Create / Show when `actions={false}` (`.Ra*-noActions`).
 */
export const formPageSx = {
  ...reviewResourceSx,
  "& .RaEdit-noActions, & .RaCreate-noActions, & .RaShow-noActions": {
    mt: 0,
  },
};
