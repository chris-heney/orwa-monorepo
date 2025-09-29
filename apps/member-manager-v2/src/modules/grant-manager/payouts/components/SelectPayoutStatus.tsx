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
} from "react-admin";
import { Box, MenuItem, Select } from "@mui/material";
import getContrastColor from "../../../_helpers/getContrastColor";

interface SelectPayoutStatusProps {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedPayout: Dispatch<SetStateAction<RaRecord<Identifier> | undefined>>;
  setPayoutStatus: Dispatch<SetStateAction<RaRecord<Identifier> | null>>;
}

const SelectPayoutStatus = ({
  setIsModalOpen,
  setSelectedPayout,
  setPayoutStatus,
}: SelectPayoutStatusProps) => {
  const { isLoading } = useListContext();
  const record = useRecordContext();
  const dataProvider = useDataProvider();
  const [status, setStatus] = React.useState<RaRecord>(record.payout_status);

  const notify = useNotify();

  const updateStatus = async (e: { target: { value: string } }) => {
    // if (e.target.value !== 'New Reason') {
    // Only update status and refresh for options other than "New Reason"

    const { data: payoutStatus } = await dataProvider.getOne(
      "payout-statuses",
      { id: e.target.value, meta: { raw: true } }
    );

    setStatus(payoutStatus);
    setPayoutStatus(payoutStatus);
    setSelectedPayout(record);

    if (payoutStatus?.email_template) {
      setIsModalOpen(true);
    } else {
      try {
        await dataProvider.update("grant-payouts", {
          id: record.id,
          previousData: { ...record },
          data: { payout_status: payoutStatus.id },
        });

        if (record.application) {
          notify(
            `Grant Payout for ${record.application.legal_entity_name} was ${payoutStatus.name}`,
            { type: "success" }
          );
        } else {
          notify(`Grant Payout was ${payoutStatus.name} type: ${record.type}`, {
            type: "success",
          });
        }

        // Send Activity to Activity Log
        // await sendActivity(dataProvider, 'grant-application', `Grant Payout for ${record.application.legal_entity_name} was ${payoutStatus?.name} for ${pa}`, [record?.id, record?.application?.id])
      } catch (error) {
        notify(`Error updating Grant Payout to ${payoutStatus.name}`, {
          type: "error",
        });
        console.error(error);
      }
    }
    // if new reasons is selected, open modal to create new status
    if (e.target.value === "New Reason") {
      setIsModalOpen(true);
    }
  };

  const { data: rawStatus, isLoading: isRawLoading } = useGetOne(
    "payout-statuses",
    { id: status?.id, meta: { raw: true, populate: true } }
  );

  const nextIds = React.useMemo(() => {
    const raw = (rawStatus?.next_statuses || []) as any[];
    return raw.map((s: any) => (typeof s === "object" ? s.id : s));
  }, [rawStatus]);

  const filterIds = React.useMemo(() => {
    const ids = [status?.id, ...nextIds].filter(Boolean);
    return Array.from(new Set(ids));
  }, [status?.id, nextIds]);

  const { data: statusOptions, isLoading: isStatusLoading } = useGetList(
    "payout-statuses",
    {
      meta: { raw: true, populate: true },
      pagination: { page: 1, perPage: 100 },
      filter: { id: filterIds },
      sort: { field: "order", order: "ASC" },
    }
  );

  return isLoading || isStatusLoading || isRawLoading ? (
    <Loading />
  ) : (
    <Box>
      {rawStatus.next_statuses.length > 0 ? (
        <Select
          size="small"
          value={status?.id.toString()}
          onChange={updateStatus}
          sx={{
            textAlign: "center",
            mr: 2,
            width: 200,
            backgroundColor: status?.color,
            color: getContrastColor(status?.color, 0.3),
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
          source="payout_status.name"
          sx={{
            backgroundColor: status?.color,
            p: 0.5,
            borderRadius: 1,
            fontWeight: 700,
            color: getContrastColor(status?.color, 0.3),
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

export default SelectPayoutStatus;
