import React from "react";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import RightDrawer, { RightDrawerProps } from "./drawer/RightDrawer";

export type FilterSidebarShellProps = Omit<
  RightDrawerProps,
  "title" | "icon" | "closeLabel"
> & {
  title?: string;
};

/**
 * The list Filters drawer — `RightDrawer` with the Tune icon and a "Filters"
 * title. Callers own open state (RaStore) and the filter body children; pass
 * `context={listDrawerContext(...)}` when the body needs the current list.
 */
const FilterSidebarShell: React.FC<FilterSidebarShellProps> = ({
  title = "Filters",
  ...rest
}) => (
  <RightDrawer
    title={title}
    icon={<TuneRoundedIcon fontSize="small" />}
    closeLabel="Collapse filters"
    {...rest}
  />
);

export default FilterSidebarShell;
