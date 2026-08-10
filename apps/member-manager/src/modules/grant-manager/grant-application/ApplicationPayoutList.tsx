import React, { useMemo, useState } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Modal,
  Button,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Chip,
  Theme,
} from "@mui/material";
import { useRecordContext, RaRecord, useGetList } from "react-admin";
import { CurrencyOptions } from "../../../config/Settings";
import { formatDate } from "../../../helpers/dateFormatter";
import ModalMakePayout from "./components/MadalMakePayout";
import { Money } from "@mui/icons-material";
import { getRelationFilterId } from "../helpers/getRelationFilterId";
import getContrastColor from "../../_helpers/getContrastColor";

const statusesForPayout = [
  "Grant Agreement Signed/Sealed/Returned",
  "Revised per COR",
];

const money = (n: number) =>
  new Intl.NumberFormat("en-US", CurrencyOptions).format(n || 0);

type PayoutRow = {
  id: RaRecord["id"];
  date: string;
  statusName: string;
  statusColor?: string;
  amount: number;
  totalPaid: number;
  balance: number;
};

const StatusChip = ({
  name,
  color,
}: {
  name: string;
  color?: string;
}) => {
  const bg = color || "#e0e0e0";
  return (
    <Chip
      size="small"
      label={name}
      sx={{
        height: 24,
        fontWeight: 600,
        fontSize: "0.75rem",
        backgroundColor: bg,
        color: getContrastColor(bg, 0.35),
        "& .MuiChip-label": { px: 1 },
      }}
    />
  );
};

const MoneyCell = ({
  value,
  emphasize,
}: {
  value: number;
  emphasize?: boolean;
}) => (
  <Typography
    component="span"
    sx={{
      fontVariantNumeric: "tabular-nums",
      fontWeight: emphasize ? 700 : 500,
      fontSize: "0.9rem",
      color: emphasize && value === 0 ? "success.main" : "text.primary",
      whiteSpace: "nowrap",
    }}
  >
    {money(value)}
  </Typography>
);

const MobilePayoutCard = ({ row }: { row: PayoutRow }) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 1.5,
        px: 1.75,
        py: 1.5,
        display: "flex",
        flexDirection: "column",
        gap: 1,
        bgcolor: "background.paper",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Typography sx={{ fontWeight: 600, fontSize: "0.95rem" }}>
          {row.date}
        </Typography>
        <StatusChip name={row.statusName} color={row.statusColor} />
      </Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          rowGap: 0.75,
          columnGap: 2,
          pt: 0.5,
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="caption" color="text.secondary">
          This payout
        </Typography>
        <Box sx={{ textAlign: "right" }}>
          <MoneyCell value={row.amount} />
        </Box>
        <Typography variant="caption" color="text.secondary">
          Total paid out
        </Typography>
        <Box sx={{ textAlign: "right" }}>
          <MoneyCell value={row.totalPaid} />
        </Box>
        <Typography variant="caption" color="text.secondary">
          Balance
        </Typography>
        <Box sx={{ textAlign: "right" }}>
          <MoneyCell value={row.balance} emphasize />
        </Box>
      </Box>
    </Box>
  );
};

const ApplicationPayoutList = () => {
  const record = useRecordContext<RaRecord>();
  const theme = useTheme();
  const isSmall = useMediaQuery<Theme>((t) => t.breakpoints.down("sm"));
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Prefer numeric entityId when present; documentId also works via adapter rewrite.
  const applicationFilterId =
    getRelationFilterId(record) ?? record?.id ?? undefined;

  const { data: payouts, isLoading: payoutsLoading } = useGetList(
    "grant-payouts",
    {
      pagination: { page: 1, perPage: 100 },
      sort: { field: "id", order: "ASC" },
      meta: { raw: true, populate: ["payout_status"] },
      filter: applicationFilterId ? { application: applicationFilterId } : {},
    },
    { enabled: applicationFilterId != null }
  );

  const rows: PayoutRow[] = useMemo(() => {
    if (!record || !payouts?.length) return [];
    let running = 0;
    return payouts.map((payout: RaRecord) => {
      running += payout.amount || 0;
      return {
        id: payout.id,
        date: formatDate(payout?.transaction_date) || "—",
        statusName: payout?.payout_status?.name || "N/A",
        statusColor: payout?.payout_status?.color,
        amount: payout.amount || 0,
        totalPaid: running,
        balance: (record.award_amount || 0) - running,
      };
    });
  }, [payouts, record]);

  if (!record || payoutsLoading) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
        Loading payouts…
      </Typography>
    );
  }

  const payoutMade = () => setIsModalOpen(false);

  const headCellSx = {
    color: "text.secondary",
    fontWeight: 700,
    fontSize: "0.7rem",
    letterSpacing: "0.06em",
    textTransform: "uppercase" as const,
    borderBottom: `1px solid ${theme.palette.divider}`,
    py: 1.25,
    px: 1.5,
    bgcolor: "transparent",
    whiteSpace: "nowrap" as const,
  };

  const bodyCellSx = {
    py: 1.25,
    px: 1.5,
    borderBottom: `1px solid ${theme.palette.divider}`,
    fontSize: "0.9rem",
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          py: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Payouts
        </Typography>
        {statusesForPayout.includes(
          record?.status?.name?.replace(" PFY", "")
        ) && (
          <Button
            size="small"
            variant="contained"
            color="primary"
            endIcon={<Money />}
            onClick={() => setIsModalOpen(true)}
          >
            Make Payout
          </Button>
        )}
      </Box>

      {rows.length === 0 ? (
        <Box
          sx={{
            border: `1px dashed ${theme.palette.divider}`,
            borderRadius: 1.5,
            py: 3,
            textAlign: "center",
            color: "text.secondary",
          }}
        >
          No payouts found
        </Box>
      ) : isSmall ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
          {rows.map((row) => (
            <MobilePayoutCard key={row.id} row={row} />
          ))}
        </Box>
      ) : (
        <TableContainer
          sx={{
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 1.5,
            overflow: "hidden",
          }}
        >
          <Table size="small" sx={{ tableLayout: "fixed", width: "100%" }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ ...headCellSx, width: "18%", textAlign: "left" }}>
                  Date
                </TableCell>
                <TableCell sx={{ ...headCellSx, width: "22%", textAlign: "left" }}>
                  Status
                </TableCell>
                <TableCell sx={{ ...headCellSx, width: "20%", textAlign: "right" }}>
                  Total Paid Out
                </TableCell>
                <TableCell sx={{ ...headCellSx, width: "20%", textAlign: "right" }}>
                  This Payout
                </TableCell>
                <TableCell sx={{ ...headCellSx, width: "20%", textAlign: "right" }}>
                  Balance
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.id}
                  hover
                  sx={{
                    "&:last-child td": { borderBottom: 0 },
                  }}
                >
                  <TableCell sx={{ ...bodyCellSx, textAlign: "left" }}>
                    {row.date}
                  </TableCell>
                  <TableCell sx={{ ...bodyCellSx, textAlign: "left" }}>
                    <StatusChip
                      name={row.statusName}
                      color={row.statusColor}
                    />
                  </TableCell>
                  <TableCell sx={{ ...bodyCellSx, textAlign: "right" }}>
                    <MoneyCell value={row.totalPaid} />
                  </TableCell>
                  <TableCell sx={{ ...bodyCellSx, textAlign: "right" }}>
                    <MoneyCell value={row.amount} />
                  </TableCell>
                  <TableCell sx={{ ...bodyCellSx, textAlign: "right" }}>
                    <MoneyCell value={row.balance} emphasize />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <>
          <ModalMakePayout
            name={record ? record.legal_entity_name : " "}
            setIsModalOpen={payoutMade}
            id={applicationFilterId ?? record?.id}
            grantId={
              getRelationFilterId(
                typeof record?.grant === "object" ? record.grant : null
              ) ?? record?.grant
            }
          />
        </>
      </Modal>
    </>
  );
};

export default ApplicationPayoutList;
