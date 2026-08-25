import React from "react";
import { Theme, useMediaQuery } from "@mui/material";
import {
  Button,
  ExportButton,
  useRedirect,
} from "react-admin";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import AddIcon from "@mui/icons-material/Add";
import RecordCount from "../../_components/RecordCount";
import PageHeadingBar from "../../_components/PageHeadingBar";
import { useCorporateSponsorsContext } from "../CorporateSponsorsContext";

const CorporateSponsorsHeader = () => {
  const { toggleFilterSidebar } = useCorporateSponsorsContext();
  const redirect = useRedirect();
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));

  return (
    <PageHeadingBar
      title="Corporate Sponsors"
      actions={
        !isSmall ? (
          <>
            <RecordCount />
            <Button
              onClick={() => {
                redirect("/corporate-sponsors/create");
              }}
              sx={{ color: "white" }}
              label="Add Corporate Sponsor"
            >
              <AddIcon />
            </Button>
            <ExportButton sx={{ color: "white" }} />
            <Button
              label="Filter"
              sx={{ color: "white" }}
              onClick={() => {
                toggleFilterSidebar();
              }}
            >
              <FilterAltIcon />
            </Button>
          </>
        ) : undefined
      }
    />
  );
};

export default CorporateSponsorsHeader;
