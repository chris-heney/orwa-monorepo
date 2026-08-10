import React, { useEffect, useRef } from "react";
import { Box, Collapse } from "@mui/material";
import { useGrantContext } from "../GrantContextProvider";
import type { SearchableTab } from "../helpers/searchBarTabs";

type Props = {
  tab: SearchableTab;
  /** Clears list filters (+ any persisted store) when the bar closes. */
  onClearSearch: () => void;
  children: React.ReactNode;
};

/**
 * Accordion wrapper for grant list search actions. Height collapses to zero
 * when closed; transitioning open → closed invokes `onClearSearch`.
 */
const GrantCollapsibleSearch = ({ tab, onClearSearch, children }: Props) => {
  const { searchBarOpen } = useGrantContext();
  const open = searchBarOpen[tab];
  const prevOpen = useRef(open);

  useEffect(() => {
    if (prevOpen.current && !open) {
      onClearSearch();
    }
    prevOpen.current = open;
  }, [open, onClearSearch]);

  return (
    <Collapse in={open} timeout={200} unmountOnExit>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          px: 2,
          py: open ? 1 : 0,
          gap: 2,
          width: "100%",
        }}
      >
        {children}
      </Box>
    </Collapse>
  );
};

export default GrantCollapsibleSearch;
