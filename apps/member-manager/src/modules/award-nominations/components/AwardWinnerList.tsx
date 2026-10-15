import React from "react";
import {
  Datagrid,
  DeleteButton,
  EditButton,
  FunctionField,
  ListView,
  NumberField,
  TextField,
} from "react-admin";
import { Link as RouterLink } from "react-router-dom";
import { Box, Chip, Tooltip } from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import CustomPagination from "../../_components/CustomPagination";
import { customDatagridStyle } from "../../../css";
import { winnerImageUrl, type AwardWinnerRecord } from "../helpers/winnerImage";
import { nominationOptionText } from "../helpers/winnerLink";

/** Relations the Winners grid reads (manifest `list.meta.populate`). */
export const WINNER_LIST_POPULATE = {
  photo: true,
  award_nomination: { populate: { watersystem: true } },
};

/**
 * Linked-nomination cell: legacy gallery rows (imported from orwa.org) have
 * no nomination, so staff can see at a glance which entries still need a
 * link — or were simply never nominated through the form. Hover for the
 * nominee / award / year; click opens the nomination.
 */
const NominationCell = ({ record }: { record: AwardWinnerRecord }) => {
  const nomination = record.award_nomination;
  if (!nomination || typeof nomination !== "object") {
    return (
      <Chip
        icon={<LinkOffIcon />}
        label="Not linked"
        size="small"
        variant="outlined"
        sx={{ color: "text.secondary", borderColor: "divider" }}
      />
    );
  }
  const system = nomination.watersystem?.name || nomination.system_name || "";
  return (
    <Tooltip title={nominationOptionText(nomination)} arrow>
      <Chip
        component={RouterLink}
        to={`/award-nominations/${nomination.id}/show`}
        clickable
        icon={<LinkIcon />}
        label={system || nomination.nominee_name || "Linked"}
        size="small"
        color="primary"
        variant="outlined"
        onClick={(event: React.MouseEvent) => event.stopPropagation()}
        sx={{ fontWeight: 600, maxWidth: 240 }}
      />
    </Tooltip>
  );
};

/**
 * Winners tab panel — renders inside the framework's ListScope (year filter
 * from `manifest.tsx`); count and "Add Winner" in the bar share this ListBase.
 */
const AwardWinnerList = () => (
  <ListView
    actions={false}
    title=" "
    component="div"
    empty={false}
    pagination={<CustomPagination />}
    sx={{
      width: 1,
      minWidth: 0,
      "& .RaList-main": { marginTop: 0 },
      "& .RaList-content": { boxShadow: "none" },
      ".RaList-actions": { p: 0, minHeight: 0 },
    }}
  >
    <Datagrid rowClick="edit" bulkActionButtons={false} sx={customDatagridStyle}>
      <FunctionField
        label="Photo"
        render={(record: AwardWinnerRecord) => {
          const url = winnerImageUrl(record, "thumbnail");
          return url ? (
            <Box
              component="img"
              src={url}
              alt=""
              loading="lazy"
              sx={{
                width: 84,
                height: 56,
                objectFit: "cover",
                borderRadius: 1,
              }}
            />
          ) : null;
        }}
      />
      <NumberField
        source="award_year"
        label="Year"
        options={{ useGrouping: false }}
      />
      <TextField source="title" label="Award" />
      <TextField source="recipient" label="Recipient" />
      <FunctionField
        label="Nomination"
        sortable={false}
        render={(record: AwardWinnerRecord) => <NominationCell record={record} />}
      />
      <NumberField source="sort_order" label="Order" />
      <FunctionField
        label="Published"
        render={(record: AwardWinnerRecord) =>
          record.is_published === false ? "Hidden" : "Yes"
        }
      />
      <EditButton />
      <DeleteButton mutationMode="pessimistic" />
    </Datagrid>
  </ListView>
);

export default AwardWinnerList;
