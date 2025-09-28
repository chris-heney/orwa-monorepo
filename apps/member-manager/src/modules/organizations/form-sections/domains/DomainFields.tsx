import React from 'react';
import { Box } from '@mui/material';
import DomainBasicInfo from './DomainBasicInfo';
import DnsRecordsSection from './DnsRecordsSection';

interface DomainFieldsProps {
  prefix?: string;
}

const DomainFields: React.FC<DomainFieldsProps> = ({ prefix = '' }) => {
  return (
    <Box sx={{ width: '100%' }}>
      <DomainBasicInfo prefix={prefix} />
      <DnsRecordsSection prefix={prefix} />
    </Box>
  );
};

export default DomainFields; 