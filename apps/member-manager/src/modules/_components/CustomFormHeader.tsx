import React, { ReactNode } from "react";
import PageHeadingBar from "./PageHeadingBar";
import {
  useRecordContext,
  useRedirect,
  useResourceContext,
} from "react-admin";
import { SxProps } from "@mui/material";
import { BackAction, ShowAction } from "./heading/HeadingActions";

interface CustomFormHeaderProps {
  redirectTo?: string;
  displayField?: string;
  hasShow?: boolean;
  customActions?: ReactNode;
  sx?: SxProps;
}

const resourceLabel = (resource: string) => {
  if (resource === "invoices") return "Transaction";
  return (resource.charAt(0).toUpperCase() + resource.slice(1, resource.length - 1)).replace(
    "-",
    " "
  );
};

const CustomFormHeader: React.FC<CustomFormHeaderProps> = ({
  redirectTo = "/membership-management",
  displayField = "name",
  hasShow = true,
  customActions,
  sx,
}) => {
  const redirect = useRedirect();
  const resource = useResourceContext();
  const record = useRecordContext();
  const title = record
    ? `${record[displayField]}`
    : `New ${resourceLabel(resource)}`;

  return (
    <PageHeadingBar
      title={title}
      sx={sx}
      actions={
        <>
          <BackAction onClick={() => redirect(redirectTo)} />
          {hasShow && record?.id != null && (
            <ShowAction
              onClick={() => redirect("show", resource, record.id)}
            />
          )}
          {customActions}
        </>
      }
    />
  );
};

export default CustomFormHeader;
