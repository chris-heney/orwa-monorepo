import {Box, Card, Grid} from "@mui/material";
import React from "react";
import EmailInterface from "../emails-magement/emails-templates/EmailInterface";
import GrantStatusesInterface from "../grant-manager/_components/StatusesInterface";

const SoonerwarnManagementSettings = () => {
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid xs={12} md={6}>
          <Card>
            <GrantStatusesInterface context="soonerwarn-statuses" />
          </Card>
        </Grid>

        <Grid xs={12} md={6}>
          <Card>
            <EmailInterface module="Soonerwarn Managment" />
          </Card>
        </Grid>

        <Grid xs={12} md={6}>
          <Card>
            <GrantStatusesInterface context="request-statuses" />
          </Card>
        </Grid>

        {/* <Grid xs={12} md={6}>
          <Card>
            <CustomInterface
              rows={[
                { source: 'name', label: 'Name', type: 'string' },
                { source: 'default_member_name', label: 'Defualt Name', type: 'string' },
                { source: 'default_member_email', label: 'Default Email', type: 'string' },
              ]}
              inputs={[
                {source: 'name', label: 'Name', type: 'string'},
                {source: 'public_key', label: 'Public Key', type: 'string'},
                { source: 'default_member_name', label: 'Defualt Name', type: 'string' },
                { source: 'default_member_email', label: 'Default Email', type: 'string' },
                { source: 'order', label: 'Order', type: 'number' },
                {source: 'application_status', label: 'Application Status', type: 'reference', refernece: 'grant-statuses'},
                {source: 'next_status', label: 'Next Status', type: 'reference', refernece: 'grant-statuses'},
              ]}
              resource='grant-scoring-tokens'
              title='Gapp Scoring Tokens'
              createTitle='New Gapp Scoring Token'
            />
          </Card>
        </Grid> */}
      </Grid>
    </Box>
  );
};

export default SoonerwarnManagementSettings;
