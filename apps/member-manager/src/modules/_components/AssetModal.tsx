import React from "react";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import DownloadIcon from "@mui/icons-material/Download";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

export interface AssetModalFile {
  url: string;
  name?: string;
  mime?: string;
}

interface AssetModalProps {
  open: boolean;
  onClose: () => void;
  file: AssetModalFile | null;
  /** Preview pane height (defaults to 75vh) */
  height?: string | number;
}

const IMAGE_EXTENSIONS = /\.(png|jpe?g|gif|webp|svg|bmp|avif)(\?.*)?$/i;
const PDF_EXTENSIONS = /\.pdf(\?.*)?$/i;

const isImage = (file: AssetModalFile) =>
  file.mime?.startsWith("image/") || IMAGE_EXTENSIONS.test(file.url);

const isPdf = (file: AssetModalFile) =>
  file.mime === "application/pdf" || PDF_EXTENSIONS.test(file.url);

export const getAssetUrl = (url: string) =>
  url.startsWith("http")
    ? url
    : `${import.meta.env.VITE_API_ENDPOINT}${url}`;

/**
 * Reusable in-app preview for uploaded assets (images and PDFs), with
 * open-in-new-tab and download escape hatches. Anything that isn't
 * previewable falls back to a download prompt.
 */
const AssetModal = ({ open, onClose, file, height = "75vh" }: AssetModalProps) => {
  if (!file) return null;

  const fullUrl = getAssetUrl(file.url);
  const fileName = file.name || file.url.split("/").pop() || "file";

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          py: 1,
        }}
      >
        <Typography
          component="span"
          variant="subtitle1"
          sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
        >
          {fileName}
        </Typography>
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="Open in new tab">
            <IconButton
              size="small"
              component="a"
              href={fullUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <OpenInNewIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Download">
            <IconButton size="small" component="a" href={fullUrl} download={fileName}>
              <DownloadIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Close">
            <IconButton size="small" onClick={onClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ p: 0, backgroundColor: "#525659" }}>
        {isImage(file) ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height,
              p: 2,
            }}
          >
            <Box
              component="img"
              src={fullUrl}
              alt={fileName}
              sx={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
            />
          </Box>
        ) : isPdf(file) ? (
          <Box
            component="iframe"
            src={fullUrl}
            title={fileName}
            sx={{ width: "100%", height, border: 0, display: "block" }}
          />
        ) : (
          <Stack
            alignItems="center"
            justifyContent="center"
            spacing={2}
            sx={{ height: "40vh", color: "white" }}
          >
            <InsertDriveFileIcon sx={{ fontSize: 64 }} />
            <Typography>No inline preview available for this file type.</Typography>
            <Typography variant="body2">
              Use the open or download buttons above.
            </Typography>
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AssetModal;
