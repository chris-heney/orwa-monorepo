import { memo } from 'react';
import { AppBar, InspectorButton } from 'react-admin';
import { Box, Theme, Typography, styled, useMediaQuery } from '@mui/material';
import React from 'react';
import logo from '../../assets/ORWA-white-300.webp';
import RolePreviewChip from '../../modules/rbac-manager/RolePreviewChip';
import ImpersonationChip from '../../components/ImpersonationChip';

const DefaultAppBar = memo((props) => {
  const isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  const Logo = styled('img')({
    marginRight: 20,
    width: 'auto',
    height: isSmall ? 35 : 40,
    marginBottom: isSmall ? 0 : 10,
  });

  return (
    <AppBar
      sx={{
        backgroundColor: 'black',
        alignContent: 'space-between',
        backgroundImage: `url(${logo})`,
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
      }}
      {...props}
    >
      <Typography
        fontSize={isSmall ? 14 : 18}
        flex="1"
        variant="h6"
        flexGrow={0}
        display="flex"
        alignItems="center"
        whiteSpace="nowrap"
        mr="auto"
        id="react-admin-title"
      />
      <ImpersonationChip />
      <RolePreviewChip />
      {/* <InspectorButton placeholder={<></>}/> */}
      {/* <Logo src={logo} alt="ORWA Logo" sx={{ mx: 'auto' }} /> */}
    </AppBar>
  );
});

DefaultAppBar.displayName = 'AdminAppBar';

export default DefaultAppBar;
