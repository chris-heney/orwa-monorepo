import React from "react";
import { Theme, useMediaQuery } from "@mui/material";
import RecordCount from "../../_components/RecordCount";
import PageHeadingBar from "../../_components/PageHeadingBar";
import {
  CreateAction,
  ExportAction,
  FilterAction,
} from "../../_components/heading/HeadingActions";
import { useCorporateSponsorsContext } from "../CorporateSponsorsContext";

const CorporateSponsorsHeader = () => {
  const { isFilterSidebarOpen, toggleFilterSidebar } =
    useCorporateSponsorsContext();
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));

  return (
    <PageHeadingBar
      title="Corporate Sponsors"
      actions={
        !isSmall ? (
          <>
            <RecordCount />
            <CreateAction
              resource="corporate-sponsors"
              label="Add Corporate Sponsor"
            />
            <ExportAction />
            <FilterAction
              active={isFilterSidebarOpen}
              onClick={toggleFilterSidebar}
            />
          </>
        ) : undefined
      }
    />
  );
};

export default CorporateSponsorsHeader;
