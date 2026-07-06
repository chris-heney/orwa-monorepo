import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import type { Theme } from "@mui/material/styles";
import { Title, useNotify } from "react-admin";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DownloadIcon from "@mui/icons-material/Download";
import ViewListIcon from "@mui/icons-material/ViewList";
import GridViewIcon from "@mui/icons-material/GridView";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import ImageIcon from "@mui/icons-material/Image";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { format } from "date-fns";
import uploadService from "../../services/uploadService/uploadService";
import { fetchAllMediaFiles, type MediaLibraryFileRow } from "./mediaLibraryApi";
import { getPublicFileUrl } from "./mediaFileUrl";

export type MediaFileRow = MediaLibraryFileRow;

type MediaSortField = "createdAt" | "name" | "mime" | "ext" | "id";
type MediaSortDir = "asc" | "desc";
type MediaSortKey = `${MediaSortField}:${MediaSortDir}`;

const UPLOAD_DATE_SORT_VALUES = ["createdAt:desc", "createdAt:asc"] as const;

function isUploadDateSort(key: MediaSortKey): key is "createdAt:desc" | "createdAt:asc" {
  return (UPLOAD_DATE_SORT_VALUES as readonly string[]).includes(key);
}

function parseSortKey(key: MediaSortKey): { field: MediaSortField; dir: MediaSortDir } {
  const [field, dir] = key.split(":") as [MediaSortField, MediaSortDir];
  return { field, dir };
}

type MediaTypeFilter = "all" | "images" | "pdf" | "video" | "audio" | "spreadsheets";

const SORT_OPTIONS: { value: MediaSortKey; label: string }[] = [
  { value: "createdAt:desc", label: "Newest uploaded" },
  { value: "createdAt:asc", label: "Oldest uploaded" },
  { value: "name:asc", label: "Name A–Z" },
  { value: "name:desc", label: "Name Z–A" },
  { value: "mime:asc", label: "Type (MIME) A–Z" },
  { value: "mime:desc", label: "Type (MIME) Z–A" },
  { value: "ext:asc", label: "Extension A–Z" },
  { value: "ext:desc", label: "Extension Z–A" },
  { value: "id:desc", label: "ID (highest first)" },
  { value: "id:asc", label: "ID (lowest first)" },
];

function fileExtension(name: string): string {
  const i = name.lastIndexOf(".");
  return i >= 0 ? name.slice(i).toLowerCase() : "";
}

function compareMediaFiles(
  a: MediaFileRow,
  b: MediaFileRow,
  field: MediaSortField,
  dir: MediaSortDir
): number {
  let cmp = 0;
  switch (field) {
    case "name":
      cmp = a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
      break;
    case "mime":
      cmp = (a.mime || "").localeCompare(b.mime || "", undefined, { sensitivity: "base" });
      break;
    case "ext": {
      const ea = fileExtension(a.name);
      const eb = fileExtension(b.name);
      cmp = ea.localeCompare(eb, undefined, { sensitivity: "base" });
      if (cmp === 0) {
        cmp = a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
      }
      break;
    }
    case "id":
      cmp = a.id - b.id;
      break;
    case "createdAt": {
      const ta = new Date(a.createdAt).getTime();
      const tb = new Date(b.createdAt).getTime();
      const na = Number.isNaN(ta) ? 0 : ta;
      const nb = Number.isNaN(tb) ? 0 : tb;
      cmp = na - nb;
      break;
    }
    default:
      break;
  }
  return dir === "asc" ? cmp : -cmp;
}

/** Align search, toggles, and selects on one row (MUI small controls vary slightly). */
const TOOLBAR_CONTROL_HEIGHT = 40;

const MediaLibraryPage: React.FC = () => {
  const notify = useNotify();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [allFiles, setAllFiles] = useState<MediaFileRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(24);
  const [refreshNonce, setRefreshNonce] = useState(0);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sortKey, setSortKey] = useState<MediaSortKey>("createdAt:desc");
  const [typeFilter, setTypeFilter] = useState<MediaTypeFilter>("all");
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedQuery(search.trim()), 400);
    return () => window.clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, pageSize, sortKey, typeFilter]);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const rows = await fetchAllMediaFiles();
        if (cancelled) return;
        setAllFiles(rows);
      } catch (e) {
        console.error(e);
        if (!cancelled) {
          setError("Could not load files. Check your connection and permissions.");
          setAllFiles([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [refreshNonce]);

  const filtered = useMemo(() => {
    const q = debouncedQuery.toLowerCase();
    let rows = !q
      ? allFiles
      : allFiles.filter(
          (f) =>
            f.name.toLowerCase().includes(q) ||
            (f.mime || "").toLowerCase().includes(q)
        );

    switch (typeFilter) {
      case "images":
        rows = rows.filter((f) => (f.mime || "").startsWith("image/"));
        break;
      case "pdf":
        rows = rows.filter((f) => (f.mime || "").toLowerCase().includes("pdf"));
        break;
      case "video":
        rows = rows.filter((f) => (f.mime || "").startsWith("video/"));
        break;
      case "audio":
        rows = rows.filter((f) => (f.mime || "").startsWith("audio/"));
        break;
      case "spreadsheets":
        rows = rows.filter((f) => {
          const m = (f.mime || "").toLowerCase();
          const n = f.name.toLowerCase();
          return (
            m.includes("sheet") ||
            m.includes("csv") ||
            m.includes("excel") ||
            n.endsWith(".csv") ||
            n.endsWith(".xlsx") ||
            n.endsWith(".xls")
          );
        });
        break;
      default:
        break;
    }

    return rows;
  }, [allFiles, debouncedQuery, typeFilter]);

  const setSortForField = (field: MediaSortField) => {
    const { field: curField, dir: curDir } = parseSortKey(sortKey);
    if (curField === field) {
      const next: MediaSortDir = curDir === "asc" ? "desc" : "asc";
      setSortKey(`${field}:${next}` as MediaSortKey);
    } else {
      const defaultDir: MediaSortDir = field === "createdAt" ? "desc" : "asc";
      setSortKey(`${field}:${defaultDir}` as MediaSortKey);
    }
  };

  const sortedFiltered = useMemo(() => {
    const [field, dir] = sortKey.split(":") as [MediaSortField, MediaSortDir];
    const out = [...filtered];
    out.sort((a, b) => compareMediaFiles(a, b, field, dir));
    return out;
  }, [filtered, sortKey]);

  const total = sortedFiltered.length;
  const pageCount = useMemo(
    () => Math.max(1, Math.ceil(total / pageSize) || 1),
    [total, pageSize]
  );

  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  const pageFiles = useMemo(
    () => sortedFiltered.slice((page - 1) * pageSize, page * pageSize),
    [sortedFiltered, page, pageSize]
  );

  const copyUrl = async (file: MediaFileRow) => {
    const full = getPublicFileUrl(file.url);
    try {
      await navigator.clipboard.writeText(full);
      notify("Link copied to clipboard", { type: "success" });
    } catch {
      notify("Could not copy link", { type: "warning" });
    }
  };

  const sanitizeFilename = (name: string, id: number) => {
    const base = name?.trim() || `file-${id}`;
    return base.replace(/[/\\?%*:|"<>]/g, "-");
  };

  const downloadFile = async (file: MediaFileRow) => {
    const fullUrl = getPublicFileUrl(file.url);
    const filename = sanitizeFilename(file.name, file.id);

    const triggerAnchor = (href: string, downloadAttr: string) => {
      const a = document.createElement("a");
      a.href = href;
      a.download = downloadAttr;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      document.body.appendChild(a);
      a.click();
      a.remove();
    };

    try {
      const res = await fetch(fullUrl, { mode: "cors" });
      if (!res.ok) throw new Error(String(res.status));
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      triggerAnchor(blobUrl, filename);
      notify("Download started", { type: "success" });
      window.setTimeout(() => URL.revokeObjectURL(blobUrl), 2500);
    } catch {
      try {
        triggerAnchor(fullUrl, filename);
        notify("Opened file in a new tab (browser may not force download)", {
          type: "info",
        });
      } catch {
        notify("Could not download file", { type: "warning" });
      }
    }
  };

  const onPickFiles = async (list: FileList | null) => {
    if (!list?.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(list)) {
        await uploadService.uploadFile(file, true);
      }
      notify(`Uploaded ${list.length} file(s)`, { type: "success" });
      setPage(1);
      setRefreshNonce((n) => n + 1);
    } catch (e) {
      console.error(e);
      notify("Upload failed", { type: "error" });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onPickFiles(e.dataTransfer.files);
  };

  const formatWhen = (iso: string) => {
    if (!iso) return "—";
    try {
      return format(new Date(iso), "MMM d, yyyy HH:mm");
    } catch {
      return iso;
    }
  };

  const isImage = (mime: string) => mime?.startsWith("image/");

  const rangeStart = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, total);
  const { field: activeSortField, dir: activeSortDir } = parseSortKey(sortKey);

  const SortableHeaderCell = ({
    field,
    label,
    tooltip,
  }: {
    field: MediaSortField;
    label: string;
    tooltip: string;
  }) => {
    const active = activeSortField === field;
    return (
      <TableCell
        component="th"
        align="left"
        scope="col"
        onClick={() => setSortForField(field)}
        sx={{
          cursor: "pointer",
          userSelect: "none",
          whiteSpace: "nowrap",
          fontWeight: 600,
          "&:hover": { bgcolor: "action.hover" },
        }}
      >
        <Tooltip title={tooltip}>
          <Box
            component="span"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.5,
              verticalAlign: "middle",
            }}
          >
            {label}
            {active ? (
              activeSortDir === "asc" ? (
                <ArrowUpwardIcon fontSize="small" color="primary" aria-hidden />
              ) : (
                <ArrowDownwardIcon fontSize="small" color="primary" aria-hidden />
              )
            ) : (
              <UnfoldMoreIcon
                fontSize="small"
                sx={{ color: "text.secondary", opacity: 0.65 }}
                aria-hidden
              />
            )}
          </Box>
        </Tooltip>
      </TableCell>
    );
  };

  return (
    <Box sx={{ width: 1, minWidth: 0, boxSizing: "border-box", p: 2 }}>
      <Title title="Media Library" />
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1,
          backgroundColor: "#262626",
          px: 1.5,
          py: 0.75,
          minHeight: 48,
          mb: 1.5,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.25, minWidth: 0 }}>
          <Typography
            variant="h6"
            component="h1"
            sx={{
              fontSize: isSmall ? "0.75rem" : undefined,
              color: "white",
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "0.02em",
            }}
          >
            Media Library
          </Typography>
          <Tooltip
            title="Upload, search, and filter files in your browser. Copy or download public URLs for emails and the site. In list view, use column headers to sort."
            placement="bottom-start"
            arrow
          >
            <IconButton
              size="small"
              aria-label="About this page"
              sx={{ color: "grey.400", p: 0.5, "&:hover": { color: "common.white" } }}
            >
              <InfoOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            flexWrap: "wrap",
            justifyContent: "flex-end",
          }}
        >
          <Box sx={{ textAlign: "right" }}>
            <Typography
              variant="body2"
              sx={{
                color: "white",
                fontWeight: 700,
                fontSize: isSmall ? "0.7rem" : "0.8125rem",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                opacity: loading ? 0.75 : 1,
              }}
            >
              {loading ? "…" : `${total.toLocaleString()} ${total === 1 ? "file" : "files"}`}
            </Typography>
            {!loading &&
            allFiles.length > 0 &&
            (debouncedQuery || typeFilter !== "all") &&
            total !== allFiles.length ? (
              <Typography
                variant="caption"
                sx={{ color: "grey.400", display: "block", lineHeight: 1.2 }}
              >
                {allFiles.length.toLocaleString()} in library
              </Typography>
            ) : null}
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Button
              variant="contained"
              size="small"
              startIcon={
                uploading ? <CircularProgress size={16} color="inherit" /> : <CloudUploadIcon />
              }
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
            >
              Upload
            </Button>
            <Tooltip title="Refresh library">
              <IconButton
                onClick={() => setRefreshNonce((n) => n + 1)}
                disabled={loading}
                aria-label="Refresh library"
                size="medium"
                sx={{ color: "white" }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        hidden
        onChange={(e) => onPickFiles(e.target.files)}
      />

      <Paper
        elevation={0}
        sx={{
          p: 1.5,
          mb: 2,
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          border: 1,
          borderColor: "divider",
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDrop={onDrop}
      >
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1.5,
            alignItems: "center",
          }}
        >
          <TextField
            size="small"
            placeholder="Search by name or type…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              flex: "2 1 220px",
              minWidth: 180,
              maxWidth: { md: 360 },
              "& .MuiOutlinedInput-root": {
                height: TOOLBAR_CONTROL_HEIGHT,
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
            }}
          />
          <ToggleButtonGroup
            size="small"
            value={view}
            exclusive
            onChange={(_, v) => v && setView(v)}
            sx={{
              height: TOOLBAR_CONTROL_HEIGHT,
              "& .MuiToggleButton-root": {
                px: 1.25,
                py: 0,
                lineHeight: 1.25,
                textTransform: "none",
              },
            }}
          >
            <ToggleButton value="grid" aria-label="Grid view">
              <GridViewIcon fontSize="small" sx={{ mr: 0.5 }} />
              Grid
            </ToggleButton>
            <ToggleButton value="list" aria-label="List view">
              <ViewListIcon fontSize="small" sx={{ mr: 0.5 }} />
              List
            </ToggleButton>
          </ToggleButtonGroup>
          <FormControl
            size="small"
            sx={{
              flex: "1 1 160px",
              minWidth: 160,
              maxWidth: 260,
              "& .MuiOutlinedInput-root": { height: TOOLBAR_CONTROL_HEIGHT },
            }}
          >
            <InputLabel id="media-sort-label">Sort</InputLabel>
            <Select
              labelId="media-sort-label"
              label="Sort"
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as MediaSortKey)}
            >
              {SORT_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl
            size="small"
            sx={{
              flex: "1 1 140px",
              minWidth: 148,
              maxWidth: 200,
              "& .MuiOutlinedInput-root": { height: TOOLBAR_CONTROL_HEIGHT },
            }}
          >
            <InputLabel id="media-upload-date-label" shrink>
              Upload date
            </InputLabel>
            <Select
              labelId="media-upload-date-label"
              label="Upload date"
              displayEmpty
              value={isUploadDateSort(sortKey) ? sortKey : ""}
              onChange={(e) => {
                const v = e.target.value as MediaSortKey;
                if (v) setSortKey(v);
              }}
              renderValue={(selected) => {
                if (selected === "createdAt:desc") return "Newest first";
                if (selected === "createdAt:asc") return "Oldest first";
                return (
                  <Typography component="span" color="text.secondary" sx={{ fontWeight: 400 }}>
                    Not sorting by date
                  </Typography>
                );
              }}
              inputProps={{ "aria-label": "Sort by upload date" }}
            >
              <MenuItem value="createdAt:desc">Newest first</MenuItem>
              <MenuItem value="createdAt:asc">Oldest first</MenuItem>
            </Select>
          </FormControl>
          <FormControl
            size="small"
            sx={{
              width: 112,
              flexShrink: 0,
              "& .MuiOutlinedInput-root": { height: TOOLBAR_CONTROL_HEIGHT },
            }}
          >
            <InputLabel id="media-page-size-label">Per page</InputLabel>
            <Select
              labelId="media-page-size-label"
              label="Per page"
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
            >
              {[24, 48, 72, 96].map((n) => (
                <MenuItem key={n} value={n}>
                  {n}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Divider />

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 1,
            justifyContent: "space-between",
            rowGap: 1.25,
          }}
        >
          <Stack direction="row" flexWrap="wrap" alignItems="center" spacing={0.75}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}
            >
              Type
            </Typography>
            {(
              [
                ["all", "All"],
                ["images", "Images"],
                ["pdf", "PDF"],
                ["video", "Video"],
                ["audio", "Audio"],
                ["spreadsheets", "Sheets / CSV"],
              ] as const
            ).map(([value, label]) => (
              <Chip
                key={value}
                label={label}
                size="small"
                variant={typeFilter === value ? "filled" : "outlined"}
                color={typeFilter === value ? "primary" : "default"}
                onClick={() => setTypeFilter(value)}
                sx={{ borderRadius: 1, height: 28 }}
              />
            ))}
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
            {loading
              ? "Loading…"
              : total === 0
                ? allFiles.length === 0
                  ? "No files"
                  : "No matches"
                : `Showing ${rangeStart}–${rangeEnd} of ${total.toLocaleString()}`}
            {debouncedQuery || typeFilter !== "all" ? " · filtered" : ""}
          </Typography>
        </Box>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress />
        </Box>
      ) : pageFiles.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography color="text.secondary">
            {allFiles.length === 0
              ? "No files yet. Upload or drop files above."
              : debouncedQuery || typeFilter !== "all"
                ? "No files match your search or filters. Try adjusting Show chips or search."
                : "No files on this page."}
          </Typography>
        </Paper>
      ) : view === "grid" ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, 1fr)",
              sm: "repeat(3, 1fr)",
              md: "repeat(4, 1fr)",
              lg: "repeat(5, 1fr)",
              xl: "repeat(6, 1fr)",
            },
            gap: 2,
          }}
        >
          {pageFiles.map((file) => {
            const fullUrl = getPublicFileUrl(file.url);
            return (
              <Card key={file.id} variant="outlined" sx={{ overflow: "hidden" }}>
                <Box
                  sx={{
                    height: 140,
                    bgcolor: "action.hover",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {isImage(file.mime) ? (
                    <Box
                      component="img"
                      src={fullUrl}
                      alt={file.name}
                      sx={{
                        width: "100%",
                        height: 140,
                        objectFit: "cover",
                      }}
                    />
                  ) : file.mime?.includes("pdf") ? (
                    <InsertDriveFileIcon sx={{ fontSize: 56, color: "error.main" }} />
                  ) : (
                    <ImageIcon sx={{ fontSize: 56, color: "text.disabled" }} />
                  )}
                </Box>
                <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    noWrap
                    title={file.name}
                  >
                    {file.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block" noWrap>
                    {file.mime || "—"} · {formatWhen(file.createdAt)}
                  </Typography>
                  <Stack
                    direction="column"
                    spacing={1}
                    sx={{ mt: 1.5, width: 1, alignItems: "stretch" }}
                  >
                    <Button
                      fullWidth
                      size="small"
                      variant="outlined"
                      startIcon={<ContentCopyIcon />}
                      onClick={() => copyUrl(file)}
                      sx={{ justifyContent: "center" }}
                    >
                      Copy URL
                    </Button>
                    <Button
                      fullWidth
                      size="small"
                      variant="outlined"
                      startIcon={<DownloadIcon />}
                      onClick={() => downloadFile(file)}
                      sx={{ justifyContent: "center" }}
                    >
                      Download
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      ) : (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell width={72} component="th" scope="col">
                Preview
              </TableCell>
              <SortableHeaderCell
                field="name"
                label="Name"
                tooltip="Sort by file name (A–Z / Z–A)"
              />
              <SortableHeaderCell
                field="mime"
                label="Type"
                tooltip="Sort by MIME type"
              />
              <SortableHeaderCell
                field="createdAt"
                label="Uploaded"
                tooltip="Sort by upload date (newest or oldest first)"
              />
              <TableCell align="right" component="th" scope="col">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pageFiles.map((file) => {
              const fullUrl = getPublicFileUrl(file.url);
              return (
                <TableRow key={file.id} hover>
                  <TableCell>
                    {isImage(file.mime) ? (
                      <Box
                        component="img"
                        src={fullUrl}
                        alt=""
                        sx={{ width: 48, height: 48, objectFit: "cover", borderRadius: 1 }}
                      />
                    ) : (
                      <InsertDriveFileIcon color="action" />
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500} noWrap sx={{ maxWidth: 280 }}>
                      {file.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap display="block">
                      {fullUrl}
                    </Typography>
                  </TableCell>
                  <TableCell>{file.mime || "—"}</TableCell>
                  <TableCell>{formatWhen(file.createdAt)}</TableCell>
                  <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                    <Box
                      component="span"
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        gap: 0.25,
                        verticalAlign: "middle",
                      }}
                    >
                      <Tooltip title="Copy public URL">
                        <IconButton
                          size="small"
                          onClick={() => copyUrl(file)}
                          aria-label={`Copy URL for ${file.name}`}
                        >
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Download file">
                        <IconButton
                          size="small"
                          onClick={() => downloadFile(file)}
                          aria-label={`Download ${file.name}`}
                        >
                          <DownloadIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      {!loading && total > 0 && pageCount > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3, mb: 2 }}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
            showFirstButton
            showLastButton
            size="large"
          />
        </Box>
      )}
    </Box>
  );
};

export default MediaLibraryPage;
