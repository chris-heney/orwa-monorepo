import React from "react";
import { Avatar, Box, styled } from "@mui/material";
import { SxProps } from "@mui/system";
import logo from "../../assets/ORWA-white-300.webp";
import { useGetRecordId, useResourceContext } from "react-admin";
import { useNavigate } from "react-router-dom";
import { formatTitle } from "../../helpers/formatResourceTitle";
import PageHeadingBar from "./PageHeadingBar";
import { ShowAction } from "./heading/HeadingActions";

interface CustomHeaderProps {
  title: string;
  sx?: SxProps;
  url?: string;
  dashboardButton?: boolean;
  redirectUrl?: string;
}

const StyledLogo = styled("img")({
  height: 40,
  marginRight: 8,
});

/**
 * Edit-page heading bar with the record's avatar — PageHeadingBar with the
 * avatar folded into the title, Show + Back (right-most) as heading actions.
 */
const CustomAvatarHeader: React.FC<CustomHeaderProps> = ({
  title,
  sx,
  url,
  dashboardButton = true,
  redirectUrl = "/human-resources/dashboard",
}) => {
  const navigate = useNavigate();
  const recordId = useGetRecordId();
  const resource = useResourceContext();

  // If the route contains a redirect, we need to redirect there on click of the dashboard button
  // Example URL: http://localhost:5173/#/contacts/1987/?redirect=/membership-management
  const hashQuery = window.location.hash.split("?")[1] || "";
  const redirect =
    new URLSearchParams(hashQuery).get("redirect") ||
    new URLSearchParams(window.location.search).get("redirect");

  return (
    <PageHeadingBar
      sx={sx}
      title={
        <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 1.5 }}>
          <Avatar
            src={url}
            sx={{ borderRadius: 0, width: 32, height: 32 }}
          />
          <span>{title}</span>
        </Box>
      }
      actions={
        <>
          <StyledLogo src={logo} alt="ORWA Logo" />
          <ShowAction
            label={`View ${formatTitle(resource)}`}
            onClick={() => navigate(`/${resource}/${recordId}/show`)}
          />
        </>
      }
      onBack={
        dashboardButton
          ? () => navigate(redirect ? redirect : redirectUrl)
          : undefined
      }
      backLabel="Dashboard"
    />
  );
};

export default CustomAvatarHeader;
