import React, { ReactNode } from "react";
import CustomHeader from "./CustomHeader";
import {
  Button,
  ShowButton,
  useRecordContext,
  useRedirect,
  useResourceContext,
} from "react-admin";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { SxProps } from "@mui/material";

interface CustomFormHeaderProps {
  redirectTo?: string;
  displayField?: string;
  hasShow?: boolean;
  customActions?: ReactNode; // Allow custom buttons to be injected
  sx?: SxProps;
}

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
    : `New ${resource === "invoices"
        ? "Transaction"
        : (resource.charAt(0).toUpperCase() +
            resource.slice(1, resource.length - 1)
          ).replace("-", " ")
      }`;

  return (
    <CustomHeader
      title={title}
      sx={sx}
      Component={() => {
        return (
          <>
            <Button
              onClick={() => redirect(redirectTo)}
              sx={{
                color: "primary.contrastText",
                mr: 2,
              }}
              label="Back"
            >
              <ArrowBackIcon />
            </Button>
            {(hasShow) && (
              <ShowButton
                sx={{
                  color: "primary.contrastText",
                  mr: 2,
                }}
                resource={resource}
              />
            )}
            {customActions}
          </>
        );
      }}
    />
  );
};

export default CustomFormHeader;