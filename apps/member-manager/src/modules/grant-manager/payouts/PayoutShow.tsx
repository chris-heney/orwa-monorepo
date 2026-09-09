import React from "react";
import { Identifier, RaRecord, Show, TextField, useRecordContext } from "react-admin";
import {
  Box,
  Chip,
  Divider,
  Link,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableRow,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { mediaUrl } from "../../dashboard/_components/mediaUrl";

interface PayoutShowProps {
  id: Identifier;
}

type StrapiFile = {
  id?: Identifier;
  name?: string;
  url?: string;
  size?: number;
  mime?: string;
};

type InvoiceLine = {
  id?: Identifier;
  vendor?: string;
  invoice_number?: string;
  amount?: number | string;
  description?: string;
};

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});
const money = (value: unknown) => currency.format(Number(value) || 0);

const fileSize = (kb?: number) => {
  if (!kb) return "";
  return kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(kb))} KB`;
};

/** Applicant-portal submissions carry the request details; admin-entered payouts do not. */
const isPortalRequest = (record?: RaRecord) =>
  record?.source === "Applicant Portal" ||
  (Array.isArray(record?.invoices) && record.invoices.length > 0);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <Typography
    variant="overline"
    sx={{ display: "block", letterSpacing: 1.2, color: "text.secondary", lineHeight: 1.6 }}
  >
    {children}
  </Typography>
);

const FileList = ({
  label,
  files,
  emptyText = "None attached",
}: {
  label: string;
  files: StrapiFile[] | null | undefined;
  emptyText?: string;
}) => {
  const list = Array.isArray(files) ? files : [];
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
        {label}
      </Typography>
      {list.length === 0 ? (
        <Typography variant="body2" sx={{ color: "text.disabled", fontStyle: "italic" }}>
          {emptyText}
        </Typography>
      ) : (
        <Stack spacing={0.25}>
          {list.map((file, index) => (
            <Link
              key={String(file.id ?? index)}
              href={mediaUrl(file)}
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              variant="body2"
              onClick={(e) => e.stopPropagation()}
              sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, minWidth: 0 }}
            >
              <AttachFileIcon sx={{ fontSize: 16, opacity: 0.7 }} />
              <Box component="span" sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {file.name ?? "file"}
              </Box>
              {file.size ? (
                <Box component="span" sx={{ color: "text.secondary", fontSize: 12 }}>
                  ({fileSize(file.size)})
                </Box>
              ) : null}
            </Link>
          ))}
        </Stack>
      )}
    </Box>
  );
};

const Field = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <Box>
    <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
      {label}
    </Typography>
    <Typography variant="body2" component="div">
      {value ?? "—"}
    </Typography>
  </Box>
);

/** Full applicant-submitted request: requester, invoices, documents, certification. */
const ReimbursementRequestDetails = () => {
  const record = useRecordContext<RaRecord>();
  const theme = useTheme();
  if (!record || !isPortalRequest(record)) return null;

  const invoices = (Array.isArray(record.invoices) ? record.invoices : []) as InvoiceLine[];
  const invoiceTotal =
    record.invoice_total != null
      ? Number(record.invoice_total)
      : invoices.reduce((sum, line) => sum + (Number(line.amount) || 0), 0);
  const amount = Number(record.amount) || 0;
  const capped = invoiceTotal > 0 && amount + 0.005 < invoiceTotal;
  const statusName = record.payout_status?.name ?? record.status;
  const isPortal = record.source === "Applicant Portal";

  const panelBg =
    theme.palette.mode === "dark"
      ? alpha(theme.palette.primary.light, 0.06)
      : alpha(theme.palette.primary.main, 0.04);
  const cappedBg = alpha(theme.palette.warning.main, theme.palette.mode === "dark" ? 0.18 : 0.12);

  return (
    <Box
      sx={{
        mb: 3,
        p: 2,
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: panelBg,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1.5} flexWrap="wrap" useFlexGap sx={{ mb: 1.5 }}>
        <Typography variant="h6" sx={{ m: 0 }}>
          Reimbursement Request
        </Typography>
        {isPortal ? (
          <Chip
            size="small"
            color="info"
            variant="outlined"
            icon={<LanguageIcon />}
            label="Submitted via applicant portal"
          />
        ) : (
          <Chip size="small" variant="outlined" label="Entered by admin" />
        )}
        {statusName ? <Chip size="small" label={statusName} /> : null}
        {record.entityId != null ? (
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Request #{record.entityId}
          </Typography>
        ) : null}
      </Stack>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1fr) minmax(0, 1.4fr)" },
          gap: 2.5,
        }}
      >
        {/* Left: requester + documents + certification */}
        <Stack spacing={2.5} sx={{ minWidth: 0 }}>
          <Box>
            <SectionTitle>Requester</SectionTitle>
            <Stack spacing={1} sx={{ mt: 0.5 }}>
              <Field
                label="Name / title"
                value={
                  [record.requester_name, record.requester_title].filter(Boolean).join(", ") || "—"
                }
              />
              <Field
                label="Email"
                value={
                  record.requester_email ? (
                    <Link
                      href={`mailto:${record.requester_email}`}
                      underline="hover"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {record.requester_email}
                    </Link>
                  ) : (
                    "—"
                  )
                }
              />
              <Field label="Phone" value={record.requester_phone || "—"} />
            </Stack>
          </Box>

          <Box>
            <SectionTitle>Required documentation</SectionTitle>
            <Stack spacing={1.5} sx={{ mt: 0.5 }}>
              <FileList label="Paid invoices / pay applications" files={record.paid_invoices} />
              <FileList label="Proof of payment" files={record.proof_of_payment} />
              <FileList
                label="Project photos"
                files={record.project_photos}
                emptyText={
                  record.photos_not_applicable
                    ? "Marked not applicable by requester"
                    : "None attached"
                }
              />
            </Stack>
          </Box>

          {record.applicant_notes ? (
            <Box>
              <SectionTitle>Notes from requester</SectionTitle>
              <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", mt: 0.5 }}>
                {record.applicant_notes}
              </Typography>
            </Box>
          ) : null}
        </Stack>

        {/* Right: invoice table + certification */}
        <Stack spacing={2.5} sx={{ minWidth: 0 }}>
          <Box>
            <SectionTitle>Invoice / pay application details</SectionTitle>
            <Table
              size="small"
              sx={{
                mt: 0.5,
                "& td, & th": { borderColor: theme.palette.divider, px: 1 },
                "& th": { fontWeight: 600, color: "text.secondary", whiteSpace: "nowrap" },
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: 32 }}>#</TableCell>
                  <TableCell>Vendor invoice</TableCell>
                  <TableCell>Invoice #</TableCell>
                  <TableCell align="right">Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} sx={{ color: "text.disabled", fontStyle: "italic" }}>
                      No invoice lines recorded
                    </TableCell>
                  </TableRow>
                ) : (
                  invoices.map((line, index) => (
                    <TableRow key={String(line.id ?? index)}>
                      <TableCell sx={{ color: "text.secondary" }}>{index + 1}</TableCell>
                      <TableCell sx={{ wordBreak: "break-word" }}>
                        {line.vendor || "—"}
                        {line.description ? (
                          <Typography variant="caption" sx={{ display: "block", color: "text.secondary" }}>
                            {line.description}
                          </Typography>
                        ) : null}
                      </TableCell>
                      <TableCell sx={{ wordBreak: "break-word" }}>{line.invoice_number || "—"}</TableCell>
                      <TableCell align="right" sx={{ fontVariantNumeric: "tabular-nums" }}>
                        {money(line.amount)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3} align="right" sx={{ fontWeight: 600, color: "text.primary" }}>
                    Total invoices
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontWeight: 600, color: "text.primary", fontVariantNumeric: "tabular-nums" }}
                  >
                    {money(invoiceTotal)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={3} align="right" sx={{ fontWeight: 700, color: "text.primary" }}>
                    This payout
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontWeight: 700, color: "text.primary", fontVariantNumeric: "tabular-nums" }}
                  >
                    {money(amount)}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
            {capped ? (
              <Box
                sx={{
                  mt: 1,
                  px: 1.5,
                  py: 1,
                  borderRadius: 1,
                  bgcolor: cappedBg,
                  color: "text.primary",
                  fontSize: 13,
                }}
              >
                Invoices exceeded the remaining award balance; the request was capped at{" "}
                <strong>{money(amount)}</strong> ({money(invoiceTotal - amount)} not reimbursable).
              </Box>
            ) : null}
          </Box>

          <Box>
            <SectionTitle>Certification</SectionTitle>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              {record.certified ? (
                <>
                  <strong>{record.requester_name || "The requester"}</strong> certified that the
                  information provided is true and correct and that the requested reimbursement is
                  for eligible expenses related to the approved RIG project.
                </>
              ) : (
                <Box component="span" sx={{ color: "warning.main" }}>
                  Certification was not recorded for this request.
                </Box>
              )}
            </Typography>
            {record.requester_signature ? (
              <Box
                sx={{
                  mt: 1,
                  display: "inline-block",
                  p: 1,
                  borderRadius: 1,
                  border: `1px solid ${theme.palette.divider}`,
                  // Signature PNGs have a transparent background and dark ink; keep
                  // a light card behind them in both modes so the strokes read.
                  bgcolor: "#fff",
                }}
              >
                <Box
                  component="img"
                  src={record.requester_signature}
                  alt={`Signature of ${record.requester_name ?? "requester"}`}
                  sx={{ display: "block", maxHeight: 90, maxWidth: 360 }}
                />
                <Typography variant="caption" sx={{ display: "block", color: "#555", mt: 0.5 }}>
                  Signed {record.transaction_date ?? ""}
                </Typography>
              </Box>
            ) : null}
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

const PayoutShow = ({ id }: PayoutShowProps) => {
  return (
    // raw: keep populated media/relations as objects (the default RA shaping
    // collapses `paid_invoices` etc. to bare ids, which hides file names/urls).
    <Show
      component={"div"}
      title={" "}
      id={id}
      resource="grant-payouts"
      queryOptions={{ meta: { raw: true } }}
    >
      <ReimbursementRequestDetails />
      <Typography variant="h6">Payout Notes</Typography>
      <Divider sx={{ mb: 2 }} />
      <TextField variant="subtitle1" source="comments" emptyText="No notes" />
    </Show>
  );
};

export default PayoutShow;
