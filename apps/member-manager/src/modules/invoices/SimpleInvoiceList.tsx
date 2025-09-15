import React, { useState } from "react";
import {
  TextField,
  DatagridConfigurable,
  useStore,
  SimpleList,
  NumberField,
  Pagination,
  List,
  RaRecord,
  DateField,
  Empty,
} from "react-admin";
import { Box, Button, useMediaQuery, Typography, Divider } from "@mui/material";
import { Theme } from "@mui/material/styles";
import { CurrencyOptions } from "../../config/Settings";
import ResponsiveListItem from "../_components/ResponsiveListItem";
import { customDatagridStyle } from "../../css";

const SimpleInvoicesList = ({ filters }: { filters: any }) => {
  const [filterListOpen, setFilterListOpen] = useState(false);
  const selectedIds = useStore("companies.selectedIds")[0] ?? [];
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));

  return (
    <List
      component={"div"}
      resource="invoices"
      filter={filters}
      disableSyncWithLocation
      title={" "}
      actions={false}
      empty={<Empty resource="transactions" />}
      sx={{
        mt: selectedIds.length > 0 ? 6 : 0,
      }}
      pagination={
        <Box sx={{ maxWidth: "32vw", position: "sticky", left: 0 }}>
          <Pagination
            rowsPerPageOptions={[10, 25, 50, 100]}
            sx={{ flexDirection: "row-reverse" }}
          />
        </Box>
      }
    >
      {isSmall && (
        <Button
          onClick={() =>
            filterListOpen ? setFilterListOpen(false) : setFilterListOpen(true)
          }
        >
          {filterListOpen ? "Hide Filters" : "Add Filters"}
        </Button>
      )}
      <DatagridConfigurable
        sx={customDatagridStyle}
        expandSingle={true}
        rowClick="expand"
        bulkActionButtons={false}
        isRowExpandable={() => true}
        isRowSelectable={() => false}
        expand={(record: RaRecord) => {
          return (
            <Box
              sx={{
                mt: 2,
                width: "50%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography variant="h6">Transaction Details</Typography>
              <Divider />
              <ResponsiveListItem
                label="Network Transaction Id"
                value={record.record.network_trans_id}
                divider
              />
              <ResponsiveListItem
                label="Transaction Id"
                value={record.record.transaction_id}
                divider
              />
              <ResponsiveListItem
                label="Auth Code"
                value={record.record.auth_code}
                divider
              />
              <ResponsiveListItem
                label="Payment Method"
                value={record.record.payment_method}
                divider
              />
              <Typography variant="h6" mt={3}>
                Payment Details
              </Typography>
              <Divider />
              <Typography
                variant="body1"
                ml={2}
                style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}
              >
                {record.record.payment_details}
              </Typography>
            </Box>
          );
        }}
      >
        <NumberField
          source="amount"
          label="Amount"
          options={CurrencyOptions}
          noWrap
        />
        <DateField source="createdAt" label="Recieved Date" noWrap />
        <DateField source="payment_date" label="Payment Date" noWrap />
        <TextField source="year" label="Year" noWrap />
      </DatagridConfigurable>
    </List>
  );
};

export default SimpleInvoicesList;
