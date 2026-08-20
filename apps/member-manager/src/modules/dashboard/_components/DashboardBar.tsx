import { memo } from 'react';
import { AppBar } from 'react-admin';
import { Theme, Typography, styled, useMediaQuery } from '@mui/material';
import React from 'react';
import logo from '../../../assets/ORWA-white-300.webp';
import RolePreviewChip from '../../rbac-manager/RolePreviewChip';
import ImpersonationChip from '../../../components/ImpersonationChip';

export const AgentAppBar = memo((props) => {
  const isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  const Logo = styled('img')({
    marginRight: 20,
    width: 'auto',
    height: isSmall ? 20 : 40,
    marginBottom: isSmall ? 0 : 10,
  });

  return (
    <AppBar sx={{ backgroundColor: 'black' }} {...props}>
      <Typography fontSize={isSmall ? 14 : 22} flex="1" variant="h6">
        Admin Dashboard
      </Typography>
      {/* <InspectorButton placeholder={<></>} /> */}
      <Logo src={logo} alt="ORWA Logo" />
      <ImpersonationChip />
      <RolePreviewChip />
    </AppBar>
  );
});

AgentAppBar.displayName = 'AdminAppBar';

export default AgentAppBar;
