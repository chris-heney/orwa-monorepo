import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  useTheme,
} from "@mui/material";
import dayjs from "dayjs";
import { IGrantPayout } from "./GrantTypes";
import { formatNumber } from "../../../../helpers/Formators";
import { IGrantApplication } from "../../grant-application/GrantApplicationTypes";
import DownloadIcon from "@mui/icons-material/Download";
import {
  exportApplications,
  exportPayouts,
} from "../../grant-application/helpers/exportGrantFinancials";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { RaRecord, useDataProvider, useNotify, useRefresh } from "react-admin";

interface FinancialBreakdownProps {
  applications: IGrantApplication[];
  payouts: IGrantPayout[];
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const parseCurrency = (value: string | number) => {
  if (typeof value === "number") return value;
  const cleaned = String(value).replace(/[^0-9.]/g, "");
  return parseFloat(cleaned) || 0;
};

type SortField =
  | "date"
  | "name"
  | "amount"
  | "cumulativeAmount"
  | "status"
  | "COR"
  | "ID"
  | "closed";
type SortOrder = "asc" | "desc";
type AmountDisplayType = "award" | "requested" | "balance";

const FinancialBreakdown: React.FC<FinancialBreakdownProps> = ({
  applications,
  payouts,
  setIsModalOpen,
}) => {
  const theme = useTheme();
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const refresh = useRefresh(); // Add refresh hook to reload data
  const [searchApplications, setSearchApplications] = useState<string>("");
  const [searchPayouts, setSearchPayouts] = useState<string>("");
  const [showCalculations, setShowCalculations] = useState<boolean>(false);
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedPayoutType, setSelectedPayoutType] = useState<string>("all");
  const [amountDisplay, setAmountDisplay] =
    useState<AmountDisplayType>("award");


     // Function to toggle closed_out status
  const toggleClosedOut = async (record: RaRecord) => {
    const updatedRecordParams = {
      id: parseInt(record.recordId as string),
      previousData: record,
      data: {
        closed_out: !record.closed 
      },
    };

    try {
      await dataProvider.update(
        "grant-application-finals",
        updatedRecordParams
      );
      notify("Application closed out status updated successfully", {
        type: "success",
      });
      refresh();
    } catch (error) {
      console.error("Error updating closed_out status", error);
      notify("Error updating closed_out status", { type: "error" });
    }
  };

  const applicationStatuses = useMemo(() => {
    const statuses = new Set(applications.map((app) => app.status.name));
    return Array.from(statuses);
  }, [applications]);

  // Prepare application data
  const applicationData = useMemo(() => {
    const sorted = [...applications].sort((a, b) => {
      const aValue = a.application_date || a.createdAt;
      const bValue = b.application_date || b.createdAt;
      return dayjs(aValue).unix() - dayjs(bValue).unix();
    });

    return sorted.map((app) => {

      return {
        type: "Application",
        id: app.application_id ?? app.id,
        recordId: app.id,
        date: app.committee_date,
        name: app.legal_entity_name,
        awardAmount: parseCurrency(app.award_amount) || 0,
        requestedAmount: parseCurrency(app.requested_grant_amount) || 0,
        balance: app.balance || 0,
        status: app.status.name,
        statusColor: app.status?.color || "#FFFFFF",
        COR: app.change_order_request,
        closed: app.closed_out,
      };
    });
  }, [applications]);

  // Prepare payout data
  const payoutData = useMemo(() => {
    const sorted = [...payouts].sort((a, b) => {
      return (
        dayjs(a.transaction_date).unix() - dayjs(b.transaction_date).unix()
      );
    });

    return sorted.map((payout) => ({
      type: "Payout",
      id: payout.id,
      date: payout.transaction_date,
      name: payout.application?.legal_entity_name || "N/A",
      amount: payout.amount,
      status: payout.type,
    }));
  }, [payouts]);

  const sortedApplicationData = useMemo(() => {
    return [...applicationData].sort((a, b) => {
      let aValue: string | number | boolean, bValue: string | number | boolean;

      switch (sortField) {
        case "date":
          aValue = dayjs(a.date).unix();
          bValue = dayjs(b.date).unix();
          break;
        case "ID":
          aValue = a.id;
          bValue = b.id;
          break;

        case "COR":
          aValue = a.COR;
          bValue = b.COR;
          break;
        case "name":
          // Alphabetize names by first letter
          aValue = a.name[0].toLowerCase();
          bValue = b.name[0].toLowerCase();
          break;
        case "amount":
          aValue =
            amountDisplay === "award" ? a.awardAmount : a.requestedAmount;
          bValue =
            amountDisplay === "award" ? b.awardAmount : b.requestedAmount;
          break;
        case "status":
          aValue = a.status.toLowerCase();
          bValue = b.status.toLowerCase();
          break;
        case "closed":
          aValue = a.closed ?? false;
          bValue = b.closed ?? false;
          break;
        default:
          aValue = a.date;
          bValue = b.date;
      }

      // Handle string comparison
      if (typeof aValue === "string" && typeof bValue === "string") {
        const comparison = aValue.localeCompare(bValue);
        return sortOrder === "asc" ? comparison : -comparison;
      }
      if (typeof aValue === "boolean" && typeof bValue === "boolean") {
        return sortOrder === "asc" ? (aValue ? 1 : -1) : aValue ? -1 : 1;
      }
      // Handle numerical comparison
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      }
      // Fallback for other types
      return 0;
    });
  }, [applicationData, sortField, sortOrder, amountDisplay]);

  // Filter applications based on search and selected node
  const filteredApplicationData = useMemo(() => {
    const filtered = sortedApplicationData.filter(
      (app) =>
        app.name.toLowerCase().includes(searchApplications.toLowerCase()) &&
        (selectedStatuses.length === 0 || selectedStatuses.includes(app.status))
    );

    return filtered;
  }, [sortedApplicationData, searchApplications, selectedStatuses]);

  // Filter payouts based on search and selected node
  const filteredPayoutData = useMemo(() => {
    const filtered = payoutData.filter(
      (payout) =>
        payout.name.toLowerCase().includes(searchPayouts.toLowerCase()) &&
        (selectedPayoutType === "all" || payout.status === selectedPayoutType)
    );

    return filtered.sort((a, b) => dayjs(a.date).unix() - dayjs(b.date).unix());
  }, [payoutData, searchPayouts, selectedPayoutType]);

  // Calculate cumulative amounts
  const cumulativeApplicationData = useMemo(() => {
    let cumulativeAmount = 0;
    return filteredApplicationData.map((item) => {
      const amount =
        amountDisplay === "award" ? item.awardAmount : amountDisplay === "balance" ? item.balance : item.requestedAmount;
      cumulativeAmount += amount;
      return {
        ...item,
        cumulativeAmount,
        displayAmount: amount,
      };
    });
  }, [filteredApplicationData, amountDisplay]); // Add amountDisplay to dependencies

  // Calculate cumulative amounts for payouts
  const cumulativePayoutData = useMemo(() => {
    let cumulativeAmount = 0;
    return filteredPayoutData.map((item) => {
      cumulativeAmount += item.amount;
      return { ...item, cumulativeAmount };
    });
  }, [filteredPayoutData]);

  // Calculate breakdown for applications
  // In FinancialBreakdown.tsx
  const totalRequested = useMemo(
    () =>
      applications
        .filter(
          (app) =>
            !["Not Approved", "Change Order"].includes(app.status.name) &&
            !app.status.name.includes("PFY") // Exclude any status with PFY
        )
        .reduce(
          (total, app) =>
            total + (parseInt(app.requested_grant_amount || "0") || 0),
          0
        ),
    [applications]
  );

  const applicationCalculations = useMemo(() => {
    const totalApproved = applications
      .filter((app) => !app.status.name.includes("PFY")) // Exclude any status with PFY
      .filter((app) =>
        [
          "Grant Agreement Signed/Sealed/Returned",
          "Paid in Full",
          "Revised per COR",
          "Authorized by DEQ",
          "Authorized by ORWA",
          "Committee Approved",
          "Award Letter Sent",
        ].includes(app.status.name)
      )
      .reduce((total, app) => total + (app.award_amount || 0), 0);

    const awaitingApproval = totalRequested - totalApproved;

    return { totalRequested, totalApproved, awaitingApproval };
  }, [applications, totalRequested]); // Add totalRequested to dependencies

  // Calculate breakdown for payouts
  const payoutCalculations = useMemo(() => {
    const totalDisbursed = filteredPayoutData
      .filter((payout) => payout.status === "Reimbursement")
      .reduce((total, payout) => total + parseCurrency(payout.amount), 0);
    const totalUndistributed =
      applicationCalculations.totalApproved - totalDisbursed;

    return {
      totalDisbursed,
      totalUndistributed,
    };
  }, [filteredPayoutData, applicationCalculations]);

  const handleAmountHeaderClick = () => {
    setAmountDisplay(
      amountDisplay === "award" ? "requested" : amountDisplay === "requested" ? "balance" : "award"
    );
  };

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.background.paper,
        p: 2,
        borderRadius: "10px",
        color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.text.primary,
        border: theme.palette.mode === 'light' ? `1px solid ${theme.palette.divider}` : 'none',
      }}
    >
      {/* Applications Table */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" sx={{ color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.text.primary, fontSize: "1.1rem" }}>
          Applications Breakdown
        </Typography>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Button
            variant="contained"
            onClick={() => setShowCalculations(!showCalculations)}
            sx={{ backgroundColor: theme.palette.success.main, color: theme.palette.common.white }}
          >
            {showCalculations ? "Hide Summary" : "Show Summary"}
          </Button>
          <Tooltip title="How are applications filtered?">
            <IconButton
              sx={{
                color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.text.primary,
                "&:hover": { color: theme.palette.grey[400] },
              }}
              onClick={() => setIsModalOpen(true)}
            >
              <HelpOutlineIcon />
            </IconButton>
          </Tooltip>
        </div>
      </div>
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <TextField
          fullWidth
          placeholder="Search applications..."
          value={searchApplications}
          onChange={(e) => setSearchApplications(e.target.value)}
          sx={{ backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.background.default, borderRadius: "4px" }}
          InputProps={{ style: { color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.text.primary } }}
        />

        <FormControl fullWidth sx={{ minWidth: 200 }}>
          <InputLabel sx={{ color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.text.primary }}>Filter by Status</InputLabel>
          <Select
            multiple
            value={selectedStatuses}
            onChange={(e) => setSelectedStatuses(e.target.value as string[])}
            sx={{
              backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.background.default,
              color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.text.primary,
              "& .MuiSvgIcon-root": { color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.text.primary },
            }}
          >
            {applicationStatuses.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Tooltip title="Export Applications">
          <IconButton
            sx={{
              color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.text.primary,
              "&:hover": { color: theme.palette.grey[400] },
            }}
            onClick={() =>
              exportApplications(cumulativeApplicationData, amountDisplay)
            }
          >
            <DownloadIcon />
          </IconButton>
        </Tooltip>
      </div>

      <TableContainer
        component={Paper}
        sx={{
          backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.background.default,
          maxHeight: "400px",
          overflowX: "auto",
          mb: 4,
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {[
                "date",
                "ID",
                "COR",
                "name",
                "amount",
                "Cumulative",
                "status",
                "closed",
              ].map((field) => (
                <TableCell
                  key={field}
                  sx={{
                    color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.text.primary,
                    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.background.default,
                    fontSize: "0.9rem",
                    padding: "8px",
                    cursor: "pointer",
                    "&:hover": { backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.action.hover },
                  }}
                  onClick={
                    field === "amount"
                      ? handleAmountHeaderClick
                      : () => handleSort(field as SortField)
                  }
                >
                  {field === "amount" ? (
                    <>
                      {amountDisplay === "award" ? "Awarded" : amountDisplay === "balance" ? "Balance" : "Requested"}
                      {sortField === field && (
                        <span>{sortOrder === "asc" ? " ↑" : " ↓"}</span>
                      )}
                    </>
                  ) : (
                    <>
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                      {sortField === field && (
                        <span>{sortOrder === "asc" ? " ↑" : " ↓"}</span>
                      )}
                    </>
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {cumulativeApplicationData.map((row, index) => (
              <TableRow key={index}>
                <TableCell
                  sx={{ color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.text.primary, fontSize: "0.85rem", padding: "8px" }}
                >
                  {dayjs(row.date).format("MM/DD/YYYY")}
                </TableCell>
                <TableCell
                  sx={{ color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.text.primary, fontSize: "0.85rem", padding: "8px" }}
                >
                  {row.id}
                </TableCell>
                <TableCell
                  sx={{
                    color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.text.primary,
                    fontSize: "0.85rem",
                    padding: "8px",
                    whiteSpace: "wrap",
                    maxWidth: "200px",
                  }}
                >
                  {row.COR}
                </TableCell>
                <TableCell
                  sx={{
                    color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.text.primary,
                    fontSize: "0.85rem",
                    padding: "8px",
                    whiteSpace: "wrap",
                    maxWidth: "200px",
                  }}
                >
                  {row.name}
                </TableCell>
                <TableCell
                  sx={{ color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.text.primary, fontSize: "0.85rem", padding: "8px" }}
                >
                  {formatNumber(row.displayAmount)}
                </TableCell>
                <TableCell
                  sx={{
                    color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.text.primary,
                    fontSize: "0.85rem",
                    padding: "8px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {formatNumber(row.cumulativeAmount)}
                </TableCell>
                <TableCell
                  sx={{
                    color: row.statusColor,
                    fontSize: "0.85rem",
                    padding: "8px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {row.status}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.text.primary,
                    fontSize: "0.85rem",
                    padding: "8px",
                    ":hover": { cursor: "pointer" },
                  }}
                  onClick={() => toggleClosedOut(row)} // Add onClick handler
                >
                  {row.closed ? "✅" : "❌"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {showCalculations && (
        <Grid container spacing={2} mb={2}>
          <Grid item xs={12} md={6}>
            <Box sx={{ backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.background.default, p: 2, borderRadius: "4px" }}>
              <Typography variant="subtitle1" sx={{ color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.text.primary, mb: 1 }}>
                Applications
              </Typography>
              <Typography sx={{ color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.text.primary }}>
                Total Requested:{" "}
                {formatNumber(applicationCalculations.totalRequested)}
              </Typography>
              <Typography sx={{ color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.text.primary }}>
                Funds Approved:{" "}
                {formatNumber(applicationCalculations.totalApproved)}
              </Typography>
              <Typography sx={{ color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.text.primary }}>
                Awaiting Approval:{" "}
                {formatNumber(applicationCalculations.awaitingApproval)}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      )}

      {/* Payouts Table */}
      <Typography
        variant="h6"
        sx={{ mb: 2, color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.text.primary, fontSize: "1.1rem" }}
      >
        Payouts Breakdown
      </Typography>
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <TextField
          fullWidth
          placeholder="Search payouts..."
          value={searchPayouts}
          onChange={(e) => setSearchPayouts(e.target.value)}
          sx={{ backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.background.default, borderRadius: "4px" }}
          InputProps={{ style: { color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.text.primary } }}
        />

        <FormControl fullWidth sx={{ minWidth: 200 }}>
          <InputLabel sx={{ color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.text.primary }}>Filter by Type</InputLabel>
          <Select
            value={selectedPayoutType}
            onChange={(e) => setSelectedPayoutType(e.target.value as string)}
            sx={{
              backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.background.default,
              color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.text.primary,
              "& .MuiSvgIcon-root": { color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.text.primary },
            }}
          >
            <MenuItem value="all">All Types</MenuItem>
            <MenuItem value="Reimbursement">Reimbursement</MenuItem>
            <MenuItem value="Administrative">Administrative</MenuItem>
          </Select>
        </FormControl>
        <Tooltip title="Export Payouts">
          <IconButton
            sx={{
              color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.text.primary,
              "&:hover": { color: theme.palette.grey[400] },
            }}
            onClick={() => exportPayouts(cumulativePayoutData)}
          >
            <DownloadIcon />
          </IconButton>
        </Tooltip>
      </div>
      <TableContainer
        component={Paper}
        sx={{
          backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.background.default,
          maxHeight: "400px",
          overflowX: "auto",
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.text.primary,
                  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.background.default,
                  fontSize: "0.9rem",
                  padding: "8px",
                }}
              >
                Date
              </TableCell>
              <TableCell
                sx={{
                  color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.text.primary,
                  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.background.default,
                  fontSize: "0.9rem",
                  padding: "8px",
                }}
              >
                Name
              </TableCell>
              <TableCell
                sx={{
                  color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.text.primary,
                  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.background.default,
                  fontSize: "0.9rem",
                  padding: "8px",
                }}
              >
                Amount
              </TableCell>
              <TableCell
                sx={{
                  color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.text.primary,
                  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.background.default,
                  fontSize: "0.9rem",
                  padding: "8px",
                }}
              >
                Cumulative Amount
              </TableCell>
              <TableCell
                sx={{
                  color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.text.primary,
                  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.background.default,
                  fontSize: "0.9rem",
                  padding: "8px",
                }}
              >
                Type
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cumulativePayoutData.map((row, index) => (
              <TableRow key={index}>
                <TableCell
                  sx={{ color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.text.primary, fontSize: "0.85rem", padding: "8px" }}
                >
                  {dayjs(row.date).format("MM/DD/YYYY")}
                </TableCell>
                <TableCell
                  sx={{ color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.text.primary, fontSize: "0.85rem", padding: "8px" }}
                >
                  {row.name}
                </TableCell>
                <TableCell
                  sx={{ color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.text.primary, fontSize: "0.85rem", padding: "8px" }}
                >
                  {formatNumber(row.amount)}
                </TableCell>
                <TableCell
                  sx={{ color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.text.primary, fontSize: "0.85rem", padding: "8px" }}
                >
                  {formatNumber(row.cumulativeAmount)}
                </TableCell>
                <TableCell
                  sx={{ color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.text.primary, fontSize: "0.85rem", padding: "8px" }}
                >
                  {row.status}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Toggle for Calculations */}

      {/* Calculations Breakdown */}
      {showCalculations && (
        <Grid mt={2} container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box sx={{ backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.background.default, p: 2, borderRadius: "4px" }}>
              <Typography variant="subtitle1" sx={{ color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.text.primary, mb: 1 }}>
                Payouts
              </Typography>
              <Typography sx={{ color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.text.primary }}>
                Funds Disbursed:{" "}
                {formatNumber(payoutCalculations.totalDisbursed)}
              </Typography>
              <Typography sx={{ color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.text.primary }}>
                Undistributed Funds:{" "}
                {formatNumber(payoutCalculations.totalUndistributed)}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default FinancialBreakdown;
