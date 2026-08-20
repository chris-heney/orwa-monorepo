import React from 'react';
import { Box, Divider } from '@mui/material';
import { useCan } from '../rbac-manager/useCan';
import FinancialAuditDashboard from './FinancialAuditDashboard';
import MembershipHeader from './summary/MembershipHeader';
import RosterPanel from './summary/RosterPanel';
import YearReportPanel from './summary/YearReportPanel';
import { useMembershipMetrics } from './summary/useMembershipMetrics';
import { useSummaryTokens } from './summary/tokens';

/**
 * Membership Summary / reporting shell — mirrors Grant Manager Financial
 * Summary: ink canvas, sectioned hierarchy, shared water-ledger tokens
 * for light + dark.
 */
const MembershipsSummary = () => {
  const { canAction } = useCan();
  const T = useSummaryTokens();
  const metrics = useMembershipMetrics();
  // financial-audit is a custom-routes-only api (no CRUD `find` action); the
  // dashboard hits its getUnearned* handlers, so gate on that action UID.
  const showAudits = canAction(
    'api::financial-audit.financial-audit.getUnearnedDues'
  );

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        backgroundColor: T.ink,
        borderRadius: '0 0 18px 18px',
        p: { xs: 2, md: 3 },
        overflow: 'hidden',
        isolation: 'isolate',
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: `
            radial-gradient(ellipse 70% 50% at 10% 0%, ${T.water}14 0%, transparent 55%),
            radial-gradient(ellipse 50% 40% at 90% 20%, ${T.inflow}10 0%, transparent 50%)
          `,
          zIndex: 0,
        }}
      />

      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 3.5,
        }}
      >
        <MembershipHeader />

        <RosterPanel metrics={metrics} />

        <Divider sx={{ borderColor: T.line }} />

        <YearReportPanel />

        {showAudits && (
          <>
            <Divider sx={{ borderColor: T.line }} />
            <FinancialAuditDashboard />
          </>
        )}
      </Box>
    </Box>
  );
};

export default MembershipsSummary;
