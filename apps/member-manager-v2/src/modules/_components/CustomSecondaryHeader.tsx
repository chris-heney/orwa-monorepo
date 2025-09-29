import React, { JSX } from "react";
import { Box, Typography } from "@mui/material";
import { SxProps } from "@mui/system";

interface CustomHeaderProps {
  title: string;
  sx?: SxProps;
  Component?: () => JSX.Element
}

const CustomSecondaryHeader: React.FC<CustomHeaderProps> = ({ title, sx , Component}) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        backgroundColor: "#262626",
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        justifyContent: 'space-between',
      }}
    >
      <Typography
        variant="h6"
        sx={{
          alignItems: "center",
          color: "white",
          flexGrow: 1,
          p: 0.5,
          ml: 1,
          ...sx,
        }}
      >
        {title}
      </Typography>
      {Component && <Box><Component/></Box>}
    </Box>
  );
};

export default CustomSecondaryHeader;
