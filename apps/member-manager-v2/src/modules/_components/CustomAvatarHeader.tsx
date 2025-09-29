import React from "react";
import {
  Avatar,
  Box,
  IconButton,
  Tooltip,
  Typography,
  styled,
} from "@mui/material";
import { SxProps } from "@mui/system";
// import logo from "./ORWA-white-300.webp";
import { useGetRecordId, useResourceContext } from "react-admin";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { Visibility } from "@mui/icons-material";
import { formatTitle } from "../../helpers/formatResourceTitle";

interface CustomHeaderProps {
  title: string;
  sx?: SxProps;
  url?: string;
  dashboardButton?: boolean;
  redirectUrl?: string;
}

const StyledLogo = styled("img")({
  height: 60,
  marginBottom: 10,
  marginRight: 10,
});

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

  // Extract the query string from the hash part of the URL
  const hashQuery = window.location.hash.split('?')[1] || '';
  const redirect = new URLSearchParams(hashQuery).get("redirect") || 
                   new URLSearchParams(window.location.search).get("redirect");

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        width: "100%",
        backgroundColor: "#262626",
      }}
    >
      {/* Left Section: Avatar and Title */}
      <Box sx={{ display: "flex", alignItems: "flex-end" }}>
        <Avatar
          src={url}
          sx={{ borderRadius: 0, width: 70, height: 70, marginRight: 2 }}
        />
        <Typography
          variant="h6"
          sx={{
            color: "white",
            fontWeight: "bold",
            textTransform: "uppercase",
            paddingLeft: 1,
            ...sx,
          }}
        >
          {title}
        </Typography>
      </Box>

      {/* Right Section: Logo and Buttons */}
      <Box sx={{ display: "flex", alignItems: "center", mr: 2, gap: 1 }}>
        <StyledLogo src={"/ORWA-white-300.webp"} alt="ORWA Logo" />
        <Tooltip title={`View ${formatTitle(resource)}`}>
          <IconButton
            onClick={() => navigate(`/${resource}/${recordId}/show`)}
            sx={{ color: "white" }}
          >
            <Visibility sx={{ color: "white" }} />
          </IconButton>
        </Tooltip>
        {dashboardButton && (
          <Tooltip title="Dashboard">
            <IconButton onClick={() => navigate(redirect ? redirect : redirectUrl)}>
              <ArrowBackIcon sx={{ color: "white" }} />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
};

export default CustomAvatarHeader;
