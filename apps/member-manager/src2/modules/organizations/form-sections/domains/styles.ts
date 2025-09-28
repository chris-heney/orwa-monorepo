import { alpha } from '@mui/material';

export const styles = {
  section: {
    mb: 4,
    p: 2,
    borderRadius: 2,
    // bgcolor: '#fff',
    // boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
    transition: 'box-shadow 0.3s ease',
    '&:hover': {
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
    }
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    mb: 2,
    pb: 1,
    borderBottom: '1px solid #f0f0f0'
  },
  icon: {
    color: 'primary.main',
    mr: 1
  },
  recordType: {
    bgcolor: alpha('#f5f5f5', 0.8),
    p: 2,
    borderRadius: 1,
    mb: 2,
    display: 'flex',
    alignItems: 'center'
  },
  recordTypeIcon: {
    mr: 1,
    color: 'text.secondary'
  },
  highlight: {
    bgcolor: alpha('#2196f3', 0.08),
    p: 2,
    borderRadius: 1,
    borderLeft: '4px solid #2196f3',
    mb: 3
  },
  emptyState: {
    textAlign: 'center',
    p: 3,
    color: 'text.secondary'
  },
  dnsRecordContainer: {
    border: '1px solid #eee',
    borderRadius: 1,
    p: 2,
    mb: 2,
    transition: 'all 0.2s ease',
    '&:hover': {
      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
      borderColor: '#ccc'
    }
  }
}; 