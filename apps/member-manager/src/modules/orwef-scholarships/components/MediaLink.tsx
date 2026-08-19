import React from "react";
import { Box, Link, Typography } from "@mui/material";
import { resolveMediaUrl } from "../helpers/resolveMediaUrl";

type MediaValue = {
  url?: string | null;
  name?: string | null;
  mime?: string | null;
} | null;

const asItems = (file: MediaValue | MediaValue[] | undefined | unknown) => {
  const list = Array.isArray(file) ? file : [file];
  return list.filter(
    (item): item is NonNullable<MediaValue> =>
      item != null &&
      typeof item === "object" &&
      Boolean((item as MediaValue)?.url)
  );
};

const MediaLink = ({
  file,
  label,
  variant = "inline",
}: {
  file: MediaValue | MediaValue[] | undefined | unknown;
  label: string;
  variant?: "inline" | "packet" | "cell";
}) => {
  const items = asItems(file);

  if (items.length === 0) {
    if (variant === "cell") {
      return (
        <Typography variant="body2" color="text.secondary" component="span">
          —
        </Typography>
      );
    }
    return (
      <Typography variant="body2" color="text.secondary">
        {label}: none
      </Typography>
    );
  }

  if (variant === "cell") {
    const first = items[0];
    const href = resolveMediaUrl(first.url as string) || "#";
    const name = first.name || label;
    return (
      <Typography
        variant="body2"
        component="span"
        sx={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis" }}
      >
        <Link
          href={href}
          target="_blank"
          rel="noreferrer"
          onClick={(event) => event.stopPropagation()}
          sx={{ overflowWrap: "anywhere" }}
        >
          {name}
        </Link>
        {items.length > 1 ? ` · ${items.length} files` : null}
      </Typography>
    );
  }

  if (variant === "packet") {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75, minWidth: 0 }}>
        {items.map((item, index) => {
          const href = resolveMediaUrl(item.url as string) || "#";
          const isImage = (item.mime || "").startsWith("image/");
          const typeLabel = item.mime || "file";
          return (
            <Box key={`${item.url}-${index}`} sx={{ minWidth: 0 }}>
              {isImage ? (
                <Box
                  component="img"
                  src={href}
                  alt={item.name || label}
                  sx={{
                    display: "block",
                    maxWidth: { xs: "100%", sm: 280 },
                    maxHeight: 220,
                    objectFit: "cover",
                    borderRadius: 0.5,
                    border: 1,
                    borderColor: "divider",
                    mb: 0.75,
                  }}
                />
              ) : null}
              <Link
                href={href}
                target="_blank"
                rel="noreferrer"
                sx={{ overflowWrap: "anywhere", wordBreak: "break-word" }}
              >
                {item.name || "Download"}
              </Link>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mt: 0.25 }}
              >
                {typeLabel}
              </Typography>
            </Box>
          );
        })}
      </Box>
    );
  }

  return (
    <Typography variant="body2" component="div" sx={{ minWidth: 0 }}>
      {label}:{" "}
      {items.map((item, index) => (
        <React.Fragment key={`${item.url}-${index}`}>
          {index > 0 ? ", " : null}
          <Link
            href={resolveMediaUrl(item.url as string) || "#"}
            target="_blank"
            rel="noreferrer"
            sx={{ overflowWrap: "anywhere" }}
          >
            {item.name || "Download"}
          </Link>
        </React.Fragment>
      ))}
    </Typography>
  );
};

export default MediaLink;
