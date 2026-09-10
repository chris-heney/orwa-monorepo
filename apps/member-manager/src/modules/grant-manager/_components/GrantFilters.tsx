import React from "react";
import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { usePageManifest } from "../../../framework/PageContext";
import { useGrantContext } from "../GrantContextProvider";
import SummaryRangeSelection from "./SummaryRangeSelect";
import LegendToggleFilter from "./LegendToggleFilter";
import PayoutStatusFilter from "./PayoutStatusFilter";
import SelectFiscalYearRange from "./SelectFiscalYearRange";
import { SavedFiltersSection } from "../../_components/SavedFiltersSection";

const FISCAL_YEAR_TABS = new Set([
  "summary",
  "applications",
  "payouts",
  "Admin Payouts",
  "application scores",
]);

/** Grant selector — the radio list every tab's Filters drawer starts with. */
export const GrantSelector = () => {
  const { grants, grantIndex, selectGrant } = useGrantContext();
  return (
    <Box sx={{ p: 2 }}>
      {/* Renders nothing on the list-less Summary / Map tabs. */}
      <SavedFiltersSection />
      <FormControl>
        <FormLabel>Grants</FormLabel>
        <RadioGroup
          value={grantIndex}
          onChange={(e) => selectGrant(parseInt(e.target.value, 10))}
        >
          {grants.map((grant, i) => (
            <FormControlLabel
              key={`grant-${grant.id ?? i}`}
              sx={{ whiteSpace: "nowrap" }}
              value={i}
              control={<Radio checked={i === grantIndex} />}
              label={grant.name}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

/**
 * Filters drawer body for every Grant Manager tab: grant selector + the
 * tab-specific filters (all backed by the preserved `grants-*` RaStore keys,
 * which the manifest's `list.filter(ctx)` reads).
 */
const GrantFilters = () => {
  const tab = usePageManifest().tab?.key ?? "";
  return (
    <>
      <GrantSelector />
      {tab === "summary" && <SummaryRangeSelection />}
      {tab === "applications" && <LegendToggleFilter />}
      {(tab === "payouts" || tab === "Admin Payouts") && <PayoutStatusFilter />}
      {FISCAL_YEAR_TABS.has(tab) && <SelectFiscalYearRange />}
    </>
  );
};

export default GrantFilters;
