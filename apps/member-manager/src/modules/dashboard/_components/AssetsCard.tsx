import React, { useMemo } from "react";
import { Typography } from "@mui/material";
import { useGetList, useRedirect } from "react-admin";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import DirectoryRow from "./DirectoryRow";
import DashboardCard from "./DashboardCard";
import { mediaUrl } from "./mediaUrl";
import { useSummaryTokens } from "../../memberships_v2/summary/tokens";

/** Assets directory — list rows matching the People card language. */
const AssetsCard = () => {
  const T = useSummaryTokens();
  const redirect = useRedirect();
  const { data: assets, isLoading } = useGetList("assets", {
    meta: { raw: true },
    pagination: { page: 1, perPage: 1000 },
  });

  const sorted = useMemo(
    () =>
      [...(assets ?? [])].sort((a, b) =>
        String(a?.name ?? "").localeCompare(String(b?.name ?? ""))
      ),
    [assets]
  );

  return (
    <DashboardCard
      icon={<InventoryOutlinedIcon />}
      title="Assets Tracked"
      count={isLoading ? undefined : sorted.length}
      loading={isLoading}
      bodySx={{ px: 1, py: 1, gap: 0.15 }}
    >
      {sorted.length === 0 ? (
        <Typography sx={{ px: 1, py: 1.5, fontSize: 12, color: T.textFaint }}>
          No assets tracked
        </Typography>
      ) : (
        sorted.map((asset) => (
          <DirectoryRow
            key={asset.id}
            primary={asset?.name || "Untitled asset"}
            secondary={
              [asset?.make, asset?.model].filter(Boolean).join(" · ") ||
              undefined
            }
            imageUrl={mediaUrl(asset?.images)}
            square
            onClick={() => redirect(`/assets/${asset.id}/show`)}
          />
        ))
      )}
    </DashboardCard>
  );
};

export default AssetsCard;
