import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Divider,
  Button,
} from "@mui/material";
import { RaRecord, useDataProvider } from "react-admin";

const ConfirmInvoicePaymentModal = ({
  open,
  onClose,
  record,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  record: RaRecord | null;
  onConfirm: (data: { payment_date: string }) => void;
}) => {
  const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [currentTotalYears, setCurrentTotalYears] = useState<number | null>(
    null
  );
  const dataProvider = useDataProvider();

  useEffect(() => {
    if (record?.entity_id && record?.resource) {
      // Fetch the entity details to get current total years
      dataProvider
        .getOne(record.resource, { id: record.entity_id })
        .then(({ data }) => {
          setCurrentTotalYears(data.total_years || 0);
        })
        .catch((error) => {
          console.error("Error fetching entity details:", error);
        });
    }
  }, [record, dataProvider]);

  const handleConfirm = () => {
    onConfirm({ payment_date: paymentDate });
    setPaymentDate("");
  };

  if (!record) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle bgcolor={'#262626'} color={'white'}>Mark Invoice Payment</DialogTitle>
      <Divider />
      <DialogContent>
        <Typography>
          Confirm the payment for the invoice with the following details:
        </Typography>
        <Divider />
        <Box mt={2}>
          <Typography>
            <strong>Company:</strong> {record.company}
          </Typography>
          <Typography>
            <strong>Email:</strong> {record.email}
          </Typography>
          <Typography>
            <strong>Amount:</strong> ${record.amount}
          </Typography>
          {currentTotalYears !== null && (
            <Typography>
              <strong>Years Active:</strong> {currentTotalYears} {" → "}{" "}
              {currentTotalYears + 1}
            </Typography>
          )}
          <Divider sx={{ my: 2 }} />
          <Typography>Enter Payment Date:</Typography>
          <input
            type="date"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
            style={{ width: "90%", marginTop: "8px", padding: "8px" }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          color="success"
          disabled={!paymentDate}
        >
          Mark Payment
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmInvoicePaymentModal;