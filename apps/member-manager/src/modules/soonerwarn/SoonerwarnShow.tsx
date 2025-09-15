import React from "react";
import { Box, Button, Divider, Grid, Typography } from "@mui/material";
import { useRecordContext } from "react-admin";
import ResponsiveListItem from "../_components/ResponsiveListItem";
import { positionStickyComponent } from "../../css";
import { formatDate } from "../../helpers/dateFormatter";
import { Link } from "react-router-dom";
import { Create, Edit, Visibility } from "@mui/icons-material";

const SoonerwarnShow: React.FC = ({}) => {
  const record = useRecordContext();

  const displayContacts = (contacts: any) => (
    <Box display="flex" flexDirection="column" gap={1}>
      {contacts.map((contact: any, index: number) => (
        <Box key={index}>
          <Link
            to={`/contacts/${contact.id}`}
            style={{ textDecoration: "none", color: "purple" }}
          >
            <Typography>
              {contact.first} {contact.last} - {contact.title}
            </Typography>
          </Link>
        </Box>
      ))}
    </Box>
  );

  return (
    <Box sx={{ ...positionStickyComponent, maxWidth: "90vw" }}>
      <Box sx={{ width: "100%", px: 3 }}>
        <Box display="flex" justifyContent="space-between">
          {record?.applicant_pdf && (
            <Button
              variant="contained"
              size="small"
              color="primary"
              onClick={() =>
                window.open(
                  `${import.meta.env.VITE_API_ENDPOINT}${
                    record.applicant_pdf.url
                  }`,
                  "_blank"
                )
              }
            >
              View Applicant PDF
            </Button>
          )}
        </Box>

        <Grid container spacing={2} sx={{ p: 2 }}>
          {/* System Information */}
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              System Information
            </Typography>
            <Divider />
            {record?.county && (
              <ResponsiveListItem
                label="County"
                value={record.county}
                divider
              />
            )}
            {record?.system_name && (
              <ResponsiveListItem
                label="System Name"
                value={record.system_name}
                divider
              />
            )}
            {record?.application_date && (
              <ResponsiveListItem
                label="Application Date"
                value={formatDate(record.application_date)}
                divider
              />
            )}
             {record?.member_since && (
              <ResponsiveListItem
                label="Application Date"
                value={formatDate(record.member_since)}
                divider
              />
            )}
            {record?.email && (
              <ResponsiveListItem label="Email" value={record.email} divider />
            )}
            {record?.phone && (
              <ResponsiveListItem label="Phone" value={record.phone} divider />
            )}
            {record?.primary_contact && (
              <ResponsiveListItem
                label="Primary Contact"
                value={displayContacts([record.primary_contact])}
                divider
              />
            )}
            {/* secondary */}
            {record?.secondary_contact && (
              <ResponsiveListItem
                label="Secondary Contact"
                value={displayContacts([record.secondary_contact])}
                divider
              />
            )}

            {record?.contacts && (
              <ResponsiveListItem
                label="Contacts"
                value={displayContacts(record.contacts)}
                divider
              />
            )}
          </Grid>

          {/* Address Information */}
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Address Information
            </Typography>
            <Divider />
            {record?.physical_address_street && (
              <ResponsiveListItem
                label="Physical Address"
                value={record.physical_address_street}
                divider
              />
            )}
            {record?.physical_address_line_two && (
              <ResponsiveListItem
                label="Physical Address Line 2"
                value={record.physical_address_line_two}
                divider
              />
            )}
            {record?.physical_address_city && (
              <ResponsiveListItem
                label="Physical Address City"
                value={record.physical_address_city}
                divider
              />
            )}
            {record?.physical_address_state && (
              <ResponsiveListItem
                label="Physical Address State"
                value={record.physical_address_state}
                divider
              />
            )}
            {record?.physical_address_zip && (
              <ResponsiveListItem
                label="Physical Address Zip"
                value={record.physical_address_zip}
                divider
              />
            )}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default SoonerwarnShow;
