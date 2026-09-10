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
import { Box } from "@mui/material";
import CustomPagination from "../../_components/CustomPagination";
import { customDatagridStyle } from "../../../css";
import { winnerImageUrl, type AwardWinnerRecord } from "../helpers/winnerImage";

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
