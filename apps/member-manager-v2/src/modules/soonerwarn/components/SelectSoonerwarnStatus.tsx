import React, { Dispatch, SetStateAction } from "react";
import {
  Identifier,
  Loading,
  RaRecord,
  TextField,
  useDataProvider,
  useGetList,
  useGetOne,
  useListContext,
  useNotify,
  useRecordContext,
  useRefresh,
} from "react-admin";
import { Box, MenuItem, Select } from "@mui/material";
import getContrastColor from "../../_helpers/getContrastColor";
import { sendActivity } from "../../../helpers/sendActivity";

const SelectSoonerwarnStatus = ({
  status_resource,
  record_resource

}: {
  status_resource: string;
  record_resource: string;
}) => {
  const { isLoading } = useListContext();
  const record = useRecordContext();

  const [status, setStatus] = React.useState(
    record.status === null ? 5 : record.status.id
  );
  const dataProvider = useDataProvider();

  const notify = useNotify();
  const refresh = useRefresh();

  const updateStatus = async (e: { target: { value: string } }) => {
    // if (e.target.value !== 'New Reason') {
    // Only update status and refresh for options other than "New Reason"
    const { data: status } = await dataProvider.getOne(status_resource, {
      id: e.target.value,
      meta: { raw: true },
    });

    setStatus(status.id);

    try {
      await dataProvider.update(record_resource, {
        id: record.id,
        previousData: { ...record },
        data: { status: status },
      });
      notify(`Soonerwarn application was updated to ${status.name}`, {
        type: "success",
      });

      // Send Activity to Activity Log
      await sendActivity(
        dataProvider,
        "soonerwarn-activities",
        `Soonerwarn application was updated to ${status?.name}`,
        [record?.id]
      );
    } catch (error) {
      notify(`Error updating soonerwarn application to ${status.name}`, {
        type: "error",
      });
      console.error(error);
    }

    refresh();
  };

  const { data: rawStatus, isLoading: isRawLoading } = useGetOne(
    status_resource,
    { id: status }
  );

  const { data: statusOptions, isLoading: isStatusLoading } = useGetList(
    status_resource,
    {
      meta: { raw: true, populate: true },
      pagination: { page: 1, perPage: 100 },
      filter: {
        id: rawStatus?.next_statuses.concat(rawStatus.id),
      },
      sort: { field: "order", order: "ASC" },
    }
  );

  return isLoading || isStatusLoading || isRawLoading ? (
    <Loading />
  ) : (
    <Box>
      {typeof statusOptions !== "undefined" && statusOptions?.length > 0 ? (
        <Select
          size="small"
          value={rawStatus.id}
          onChange={updateStatus}
          sx={{
            textAlign: "center",
            mr: 2,
            width: 220,
            backgroundColor: rawStatus.color,
            color: getContrastColor(rawStatus.color, 0.3),
            "& .css-6hp17o-MuiList-root-MuiMenu-list": {
              paddingTop: 0,
              paddingBottom: 0,
            },
          }}
          MenuProps={{
            MenuListProps: {
              disablePadding: true,
            },
          }}
          SelectDisplayProps={{
            style: {
              padding: 2,
              paddingLeft: 10,
              paddingRight: 10,
            },
          }}
          fullWidth
        >
          {/* Create New Reason Button */}
          {/* <MenuItem value={'New Reason'}>New Status</MenuItem> */}
          {statusOptions?.map((status, index) => (
            <MenuItem
              sx={{
                backgroundColor: status.color,
                color: getContrastColor(status.color, 0.3),
                py: 0.1,
                justifyContent: "center",
                ":hover": {
                  opacity: 0.8,
                  backgroundColor: status.color,
                  color: getContrastColor(status.color, 0.3),
                },
                "&.Mui-selected": {
                  backgroundColor: status.color,
                  color: getContrastColor(status.color, 0.3),
                  "&:hover": {
                    backgroundColor: status.color,
                    color: getContrastColor(status.color, 0.3),
                  },
                },
              }}
              key={`status-${index}`}
              value={status.id}
            >
              {status.name}
            </MenuItem>
          ))}
        </Select>
      ) : (
        <TextField
          source="status.name"
          sx={{
            whiteSpace: "nowrap",
            backgroundColor: rawStatus.color,
            p: 0.5,
            borderRadius: 1,
            fontWeight: 700,
            color: getContrastColor(rawStatus.color, 0.3),
            width: "93%",
            display: "block",
            textAlign: "center",
          }}
          label="Status"
        />
      )}
    </Box>
  );
};

export default SelectSoonerwarnStatus;
