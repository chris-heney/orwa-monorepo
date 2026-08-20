import React from "react";
import {
  CreateButton,
  Datagrid,
  DeleteButton,
  EditButton,
  FunctionField,
  List,
  NumberField,
  TextField,
  TopToolbar,
} from "react-admin";
import { Box } from "@mui/material";
import CustomPagination from "../../_components/CustomPagination";
import { useAwardContext } from "../AwardContextProvider";
import { winnerImageUrl, type AwardWinnerRecord } from "../helpers/winnerImage";

const ListActions = () => (
  <TopToolbar>
    <CreateButton resource="award-winners" label="Add Winner" />
  </TopToolbar>
);

const AwardWinnerList = () => {
  const { year } = useAwardContext();

  return (
    <Box sx={{ width: 1, minWidth: 0 }}>
      <List
        resource="award-winners"
        title=" "
        actions={<ListActions />}
        disableSyncWithLocation
        filter={year === "all" ? {} : { award_year: year }}
        sort={{ field: "award_year", order: "DESC" }}
        perPage={50}
        pagination={<CustomPagination />}
        queryOptions={{ meta: { populate: { photo: true }, raw: true } }}
        empty={false}
        sx={{
          "& .RaList-main": { marginTop: 0 },
          "& .RaList-content": { boxShadow: "none" },
        }}
      >
        <Datagrid rowClick="edit" bulkActionButtons={false}>
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
      </List>
    </Box>
  );
};

export default AwardWinnerList;
