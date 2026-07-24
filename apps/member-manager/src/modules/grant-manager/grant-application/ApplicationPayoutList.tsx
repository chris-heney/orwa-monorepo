import React, { useState, useEffect } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Modal,
  Button,
  Box,
  Typography,
  useTheme,
} from "@mui/material";
import { useRecordContext, useDataProvider, RaRecord, useGetList } from "react-admin";
import { CurrencyOptions } from "../../../config/Settings";
import { grantDatagridStyle } from "../_components/grantDatagridStyle";
import { formatDate } from "../../../helpers/dateFormatter";
import ModalMakePayout from "./components/MadalMakePayout";
import { Money } from "@mui/icons-material";

const statusesForPayout = [
  "Grant Agreement Signed/Sealed/Returned",
  "Revised per COR",
];

const ApplicationPayoutList = () => {
  const record = useRecordContext<RaRecord>();
  const dataProvider = useDataProvider();
  const theme = useTheme();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const payoutMade = () => {
    setIsModalOpen(false);
  }

  const {data: payouts, isLoading: payoutsLoading} = useGetList("grant-payouts", {
    pagination: { page: 1, perPage: 100 },
    sort: { field: "id", order: "ASC" },
    meta: { raw: true, populate: ["payout_status"] },
    filter: { application: record.id }, // Filter by application (record.id)
  })  

  if (!record || payoutsLoading) {
    return <div>Loading payouts...</div>;
  }

  // Calculate the balance decrementally
  let totalPaid = 0;

  const rowSx = {
    color: "text.primary",
    textAlign: "right",
  };

  return (
    <>
      {/* Make Payout Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          py: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Payouts
        </Typography>
        {statusesForPayout.includes(record?.status?.name?.replace(" PFY", "")) && (
          <Button
            size="small"
            variant="contained"
            color="primary"
            endIcon={<Money />}
            onClick={() => setIsModalOpen(!isModalOpen)}
          >
            Make Payout
          </Button>
        )}
      </Box>

      <Table
        sx={{
          ...grantDatagridStyle(theme),
          borderCollapse: "collapse",
          width: "100%",
          boxShadow: "0 1px 5px 0 rgba(0,0,0,0.2)",
          borderRadius: "4px",
          overflow: "hidden",
        }}
      >
        <TableHead
          sx={{
            backgroundColor: "#262626",
            color: "white",
            fontWeight: "bold",
            fontSize: "1.1em",
            boxShadow: "0 1px 5px 0 rgba(0,0,0,0.2)",
          }}
        >
          <TableCell sx={rowSx}>Date</TableCell>
          <TableCell sx={rowSx}>Status</TableCell>
          <TableCell sx={rowSx}>Total Paid Out</TableCell>
          <TableCell sx={rowSx}>This Payout</TableCell>
          <TableCell sx={rowSx}>Balance</TableCell>
        </TableHead>
        <TableBody>
          {payouts?.map((payout: RaRecord) => {
            totalPaid += payout.amount; // Track the total paid for balance calculation
            const payoutBalance = record.award_amount - totalPaid;

            return (
              <TableRow key={payout.id} sx={{ borderBottom: "1px solid #ccc" }}>
                {/* Payout Date */}
                <TableCell align="right">
                  {formatDate(payout?.transaction_date)}
                </TableCell>
   
                {/* Payout Status */}
                <TableCell align="right">
                  {payout?.payout_status?.name || "N/A"}
                </TableCell>

                {/* Total Paid Out */}
                <TableCell align="right">
                  {new Intl.NumberFormat("en-US", CurrencyOptions).format(
                    totalPaid
                  )}
                </TableCell>

                {/* Payout Amount */}
                <TableCell align="right">
                  {new Intl.NumberFormat("en-US", CurrencyOptions).format(
                    payout?.amount
                  )}
                </TableCell>

                {/* Balance */}
                <TableCell align="right">
                  {new Intl.NumberFormat("en-US", CurrencyOptions).format(
                    payoutBalance
                  )}
                </TableCell>
              </TableRow>
            );
          })}
          {payouts?.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} sx={{ textAlign: "center" }}>
                No payouts found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        {/* @TODO: Cleanup: Figure out how to incorporate ref to TopicModal so we don't have to wrap it in a fragment */}
        <>
          <ModalMakePayout
            name={record ? record.legal_entity_name : " "}
            setIsModalOpen={payoutMade}
            id={record ? record.id : undefined}
            grantId={record ? record.grant : undefined}
          />
        </>
      </Modal>
    </>
  );
};

export default ApplicationPayoutList;
