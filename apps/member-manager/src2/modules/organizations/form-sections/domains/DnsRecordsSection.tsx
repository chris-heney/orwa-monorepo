import React from 'react';
import { Typography, Divider } from '@mui/material';
import Grid from '@mui/material/Grid2';
import DnsSectionFields from './DnsSectionFields';

interface DnsRecordsSectionProps {
  prefix?: string;
}

const DnsRecordsSection: React.FC<DnsRecordsSectionProps> = ({ prefix = '' }) => {
  return (
    <>
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6" gutterBottom>
        DNS Records
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        DNS records configure how your domain connects to various services. Below you can add common record types.
      </Typography>
      
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <DnsSectionFields
            prefix={prefix}
            recordType="CNAME"
            description="CNAME records are used to alias one name to another."
            source="cnameRecords"
            placeholder="blog.example.com"
            helperText="e.g., custom.domain.com"
          />
        </Grid>
        
        <Grid size={{ xs: 12, md: 6 }}>
          <DnsSectionFields
            prefix={prefix}
            recordType="TXT"
            description="TXT records store text information for various services like SPF or domain verification."
            source="txtRecords"
            placeholder="v=spf1 include:_spf.google.com ~all"
            helperText="e.g., verification codes, SPF records"
          />
        </Grid>
        
        <Grid size={{ xs: 12, md: 6 }}>
          <DnsSectionFields
            prefix={prefix}
            recordType="A"
            description="A records map a domain to an IP address."
            source="aRecords"
            placeholder="192.168.1.1"
            helperText="e.g., 123.45.67.89"
          />
        </Grid>
        
        <Grid size={{ xs: 12, md: 6 }}>
          <DnsSectionFields
            prefix={prefix}
            recordType="MX"
            description="MX records specify mail servers responsible for accepting email for your domain."
            source="mxRecords"
            placeholder="mail.example.com"
            helperText="e.g., aspmx.l.google.com"
          />
        </Grid>
        
        <Grid size={{ xs: 12, md: 6 }}>
          <DnsSectionFields
            prefix={prefix}
            recordType="NS"
            description="NS records specify the authoritative name servers for your domain."
            source="nsRecords"
            placeholder="ns1.example.com"
            helperText="e.g., ns1.nameserver.com"
          />
        </Grid>
      </Grid>
    </>
  );
};

export default DnsRecordsSection; 