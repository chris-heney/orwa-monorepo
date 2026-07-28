import React, { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { Loading, useGetList, useRedirect } from "react-admin";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import DirectoryRow from "./DirectoryRow";
import {
  display,
  useSummaryTokens,
} from "../../memberships_v2/summary/tokens";

const mediaUrl = (media: unknown): string | undefined => {
  if (media == null) return undefined;
  const file = Array.isArray(media) ? media[0] : media;
  const url = (file as { url?: string } | null)?.url;
  if (!url) return undefined;
  if (url.startsWith("http")) return url;
  return `${import.meta.env.VITE_API_ENDPOINT}${url}`;
};

/**
 * Assets directory — list rows matching the People card language.
 */
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

  if (isLoading) {
    return (
      <Box
        sx={{
          height: "100%",
          borderRadius: "14px",
          border: `1px solid ${T.line}`,
          backgroundColor: T.ink,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Loading />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: "100%",
        borderRadius: "14px",
        border: `1px solid ${T.line}`,
        backgroundColor: T.ink,
        color: T.textHi,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: 1.75,
          pt: 1.5,
          pb: 1,
          borderBottom: `1px solid ${T.line}`,
          flexShrink: 0,
        }}
      >
        <InventoryOutlinedIcon sx={{ fontSize: 22, color: T.water }} />
        <Typography
          sx={{
            ...display,
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: T.textHi,
            flex: 1,
          }}
        >
          Assets Tracked
        </Typography>
        <Box
          sx={{
            minWidth: 28,
            height: 28,
            px: 0.75,
            borderRadius: "999px",
            backgroundColor: T.panelSoft,
            border: `1px solid ${T.line}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            ...display,
            fontSize: 12,
            fontWeight: 700,
            color: T.textLo,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {sorted.length}
        </Box>
      </Box>

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          px: 1,
          py: 1,
          display: "flex",
          flexDirection: "column",
          gap: 0.15,
          scrollbarWidth: "thin",
          scrollbarColor: `${T.line} transparent`,
        }}
      >
        {sorted.length === 0 ? (
          <Typography
            sx={{ px: 1, py: 1.5, fontSize: 12, color: T.textFaint }}
          >
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
      </Box>
    </Box>
  );
};

export default AssetsCard;
