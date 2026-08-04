import { useState } from "react";
import { Button, useDataProvider, useListContext, useNotify } from "react-admin";
import { useConferenceContext } from "../ConferenceContext";
import exportVendorAttendeeRoster from "../helpers/exportVendorAttendeeRoster";
import {
  getConferenceFilterId,
  getPrimaryConferenceId,
} from "../helpers/mergeConferenceAcrossTabFilters";

/**
 * Attendees tab only: exports vendor ticket rows with primary registrant email
 * and rep (attendee) email/phone.
 */
const VendorAttendeeExportButton = () => {
  const { filterValues, sort, resource } = useListContext();
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const { conferences } = useConferenceContext();
  const [loading, setLoading] = useState(false);

  if (resource !== "conference-attendees") {
    return null;
  }

  const handleClick = async () => {
    setLoading(true);
    try {
      const { data } = await dataProvider.getList("conference-attendees", {
        pagination: { page: 1, perPage: 10000 },
        sort: sort ?? { field: "id", order: "ASC" },
        filter: filterValues ?? {},
      });

      const conferenceName =
        conferences.find(
          (c) =>
            getConferenceFilterId(c) ===
            getPrimaryConferenceId(filterValues ?? {})
        )?.name ?? "";

      const count = await exportVendorAttendeeRoster(
        data,
        dataProvider,
        `${conferenceName} Vendor roster-${new Date().toLocaleDateString()}`
      );

      if (count === 0) {
        notify("No vendor attendees match the current filters.", {
          type: "warning",
        });
      } else {
        notify(`Exported ${count} vendor roster row(s).`, { type: "success" });
      }
    } catch (e) {
      console.error(e);
      notify("Vendor roster export failed.", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      label="Export vendors"
      onClick={handleClick}
      disabled={loading}
      sx={{ color: "white" }}
    />
  );
};

export default VendorAttendeeExportButton;
