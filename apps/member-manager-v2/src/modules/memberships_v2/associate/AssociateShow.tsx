import React, { ReactNode } from "react";
import {
  ReferenceField,
  ShowBase,
  SimpleShowLayout,
  TextField,
  Title,
  useShowController,
} from "react-admin";
import {
  List,
  ListItem,
  Card,
  useMediaQuery,
  Box,
  Grid,
  Typography,
} from "@mui/material";
import { Theme } from "@mui/material/styles";
import AssociateLogo from "./fields/Logo";
import { YearMonthDay } from "../../../helpers/Data";
import getExpirationDate from "../../_helpers/getExpirationDate";
import SimpleInvoicesList from '../invoices/SimpleInvoiceList';
import { IAssociate } from "./AssociateInterface";
import CustomShowHeader from "../componenets/CustomShowHeader";
import { oneYearAgoFormatted } from "../helpers/activeOrInactiveMembership";
import { CustomHeader } from "src/_components";

const labelStyle: React.CSSProperties = {
  fontWeight: "bold",
  marginRight: "5px",
};

interface ResponsiveListItemProps {
  label: string;
  value: ReactNode;
  divider: boolean;
}

const ResponsiveListItem: React.FC<ResponsiveListItemProps> = ({
  label,
  value,
  divider,
}) => {
  const isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

  const listItemStyle: React.CSSProperties = {
    justifyContent: "space-between",
    whiteSpace: "pre-line",
    fontSize: isSmall ? "16px" : "20px",
  };

  return (
    <ListItem divider={divider} style={listItemStyle}>
      <Typography component="span" style={labelStyle}>
        {label}
      </Typography>
      <Typography component="span">{value}</Typography>
    </ListItem>
  );
};

const AssociateShow: React.FC = () => {
  const { record } = useShowController<IAssociate>();

  if (!record) return null;

  const formattedApplicationDate = new Date(
    record.application_date
  ).toLocaleString("en-US", YearMonthDay);
  const formattedLastPaymentDate = new Date(
    record.payment_previous_date
  ).toLocaleString("en-US", YearMonthDay);
  const formattedCurrentPaymentDate = new Date(
    record.payment_last_date
  ).toLocaleString("en-US", YearMonthDay);

  const expirationDate = getExpirationDate(
    record.payment_previous_date,
    record.payment_last_date
  );

  return (
    <ShowBase>
      <SimpleShowLayout>
        <Title title="Memberships" />
        <CustomShowHeader />

        <Grid container spacing={2}>
          <Grid item xs={12} md={5}>
            <Card sx={{ marginBottom: 2, padding: 3, borderRadius: 2 }}>
              <Box sx={{ textAlign: "center", marginBottom: 2 }}>
                <AssociateLogo />
              </Box>

              <List>
                <ResponsiveListItem label="Name:" value={record.name} divider />
                {record.primary_ad?.url && (
                  <ResponsiveListItem
                    label="Ad:"
                    value={
                      <img src={record.primary_ad.url} alt="Ad" height={200} />
                    }
                    divider
                  />
                )}
                <ResponsiveListItem
                  label="Mailed:"
                  value={record.directory_mailed ? "Yes" : "No"}
                  divider
                />
                <ResponsiveListItem
                  label="Level:"
                  value={record.member_level}
                  divider
                />
                <ResponsiveListItem
                  label="Level:"
                  value={
                    <ReferenceField
                      source="membership"
                      reference="memberships"
                      link={false}
                    >
                      <TextField source="name" />
                    </ReferenceField>
                  }
                  divider
                />
                <ResponsiveListItem
                  label="Level:"
                  value={
                    record.payment_last_date > oneYearAgoFormatted
                      ? "Active"
                      : "Inactive"
                  }
                  divider
                />
                {record.total_years !== null && (
                  <ResponsiveListItem
                    label="Total Years:"
                    value={record.total_years.toString()}
                    divider
                  />
                )}
                <ResponsiveListItem
                  label="Category:"
                  value={record.category}
                  divider
                />
                <ResponsiveListItem
                  label="Email:"
                  value={<a href={`mailto:${record.email}`}>{record.email}</a>}
                  divider
                />
                <ResponsiveListItem
                  label="Phone Number:"
                  value={
                    <a href={`tel:+1${record.phone.replace(/-/g, "")}`}>
                      {record.phone}
                    </a>
                  }
                  divider
                />
                <ResponsiveListItem
                  label="Website:"
                  value={
                    <a
                      href={`https://${record.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {record.website}
                    </a>
                  }
                  divider
                />
                <ResponsiveListItem
                  label="Primary Mailing Address:"
                  value={`${record.address_street}, ${record.address_state}, ${record.address_zip}`}
                  divider
                />
                {record.mailing_address_state && (
                  <ResponsiveListItem
                    label="Secondary Mailing Address:"
                    value={`${record.mailing_address_street}, ${record.mailing_address_state}, ${record.mailing_address_zip}`}
                    divider
                  />
                )}
                <ResponsiveListItem
                  label="Directory Type:"
                  value={record.membership_directory_type}
                  divider
                />
                {expirationDate && (
                  <ResponsiveListItem
                    label="Expiration Date:"
                    value={expirationDate.format("MMMM D, YYYY")}
                    divider
                  />
                )}
                <ResponsiveListItem
                  label="Current Payment Date:"
                  value={formattedCurrentPaymentDate}
                  divider
                />
                <ResponsiveListItem
                  label="Application Date:"
                  value={formattedApplicationDate}
                  divider
                />
                <ResponsiveListItem
                  label="Last Payment Date:"
                  value={formattedLastPaymentDate}
                  divider
                />
                {record.wp_eid && (
                  <ResponsiveListItem
                    label="WP-EID:"
                    value={record.wp_eid.toString()}
                    divider
                  />
                )}
                {record.wp_uid && (
                  <ResponsiveListItem
                    label="WP-UID:"
                    value={record.wp_uid.toString()}
                    divider
                  />
                )}
                {record.payment_amount && (
                  <ResponsiveListItem
                    label="Payment Amount:"
                    value={`$${record.payment_amount}`}
                    divider
                  />
                )}
              </List>
            </Card>
          </Grid>

          <Grid item xs={12} md={7}>
            <Card sx={{ overflow: "auto", borderRadius: 1 }}>
               <CustomHeader title="Transactions" />
              <SimpleInvoicesList filters={{ entity_id: record.id }} />
            </Card>
          </Grid>
        </Grid>
      </SimpleShowLayout>
    </ShowBase>
  );
};

export default AssociateShow;
