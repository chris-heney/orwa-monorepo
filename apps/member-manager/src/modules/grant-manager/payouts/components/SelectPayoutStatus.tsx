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
import { getRelationFilterId } from "../../helpers/getRelationFilterId";

interface SelectPayoutStatusProps {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedPayout: Dispatch<SetStateAction<RaRecord<Identifier> | undefined>>;
  setPayoutStatus: Dispatch<SetStateAction<RaRecord<Identifier> | null>>;
}

/** Prefer documentId (stable RA id); fall back to numeric entity id. */
const resolvePayoutStatusId = (
  payoutStatus: RaRecord | Identifier | null | undefined
): Identifier | undefined => {
  if (payoutStatus == null || payoutStatus === "") return undefined;
  if (typeof payoutStatus !== "object") return payoutStatus;
  if (typeof payoutStatus.documentId === "string" && payoutStatus.documentId) {
    return payoutStatus.documentId;
  }
  if (payoutStatus.id != null && payoutStatus.id !== "") return payoutStatus.id;
  return getRelationFilterId(payoutStatus);
};

const SelectPayoutStatus = ({
  setIsModalOpen,
  setSelectedPayout,
  setPayoutStatus,
}: SelectPayoutStatusProps) => {
  const { isLoading } = useListContext();
  const record = useRecordContext();
  const dataProvider = useDataProvider();
  const notify = useNotify();

  const [statusId, setStatusId] = React.useState<Identifier | undefined>(() =>
    resolvePayoutStatusId(record?.payout_status)
  );

  React.useEffect(() => {
    setStatusId(resolvePayoutStatusId(record?.payout_status));
  }, [record?.payout_status]);

  const updateStatus = async (e: { target: { value: string } }) => {
    const { data: payoutStatus } = await dataProvider.getOne(
      "payout-statuses",
      { id: e.target.value, meta: { raw: true } }
    );

    setStatusId(payoutStatus.id);
    setPayoutStatus(payoutStatus);
    setSelectedPayout(record);

    if (payoutStatus?.email_template) {
      setIsModalOpen(true);
    } else {
      try {
        await dataProvider.update("grant-payouts", {
          id: record.id,
          previousData: { ...record },
          data: {
            payout_status:
              payoutStatus.documentId ??
              payoutStatus.id ??
              getRelationFilterId(payoutStatus),
          },
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
      } catch (error) {
        notify(`Error updating Grant Payout to ${payoutStatus.name}`, {
          type: "error",
        });
        console.error(error);
      }
    }

    if (e.target.value === "New Reason") {
      setIsModalOpen(true);
    }
  };

  const { data: rawStatus, isLoading: isRawLoading } = useGetOne(
    "payout-statuses",
    { id: statusId as Identifier, meta: { raw: true, populate: true } },
    { enabled: statusId != null && statusId !== "" }
  );

  const nextIds = React.useMemo(() => {
    const raw = (rawStatus?.next_statuses || []) as any[];
    return raw
      .map((s: any) =>
        typeof s === "object" ? getRelationFilterId(s) ?? s?.id : s
      )
      .filter((id) => id != null && id !== "");
  }, [rawStatus]);

  const filterIds = React.useMemo(() => {
    const current =
      getRelationFilterId(rawStatus) ??
      getRelationFilterId(
        typeof record?.payout_status === "object" ? record.payout_status : null
      ) ??
      (typeof statusId === "number" ||
      (typeof statusId === "string" && /^\d+$/.test(statusId))
        ? statusId
        : undefined);
    const ids = [current, ...nextIds].filter(
      (id) => id != null && id !== ""
    ) as Identifier[];
    return Array.from(new Set(ids));
  }, [rawStatus, record?.payout_status, statusId, nextIds]);

  const { data: statusOptions, isLoading: isStatusLoading } = useGetList(
    "payout-statuses",
    {
      meta: { raw: true, populate: true },
      pagination: { page: 1, perPage: 100 },
      filter: filterIds.length > 0 ? { id: filterIds } : {},
      sort: { field: "order", order: "ASC" },
    },
    { enabled: filterIds.length > 0 }
  );

  if (!statusId) {
    return (
      <Box sx={{ color: "text.secondary", fontStyle: "italic", px: 1 }}>
        No status
      </Box>
    );
  }

  return isLoading || isStatusLoading || isRawLoading || !rawStatus ? (
    <Loading />
  ) : (
    <Box>
      {(rawStatus.next_statuses?.length ?? 0) > 0 ? (
        <Select
          size="small"
          // Both Select value and MenuItem values come from withStableId
          // records (documentId), so they match after Strapi 5 remapping.
          value={rawStatus.id}
          onChange={updateStatus}
          sx={{
            textAlign: "center",
            mr: 2,
            width: 200,
            backgroundColor: rawStatus.color,
            color: getContrastColor(rawStatus.color, 0.3),
            "& .MuiSelect-select": {
              color: "inherit",
            },
            "& .MuiSvgIcon-root": {
              color: "inherit",
            },
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
              key={`status-${status.id}-${index}`}
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

export default SelectPayoutStatus;
