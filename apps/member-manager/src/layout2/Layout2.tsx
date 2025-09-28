import React from 'react';
import { LayoutProps } from 'react-admin';
import { 
  AppBarProps,
  Sidebar as DefaultSidebar,
  MenuProps,
  Error,
  ErrorProps,
  SkipNavigationButton,
  Inspector,
} from 'react-admin';
import { Box } from '@mui/material';
import { AppLocationContext } from '@react-admin/ra-navigation';
import { Menu } from './Menu2';

const Layout = (props: LayoutProps) => {
  const {
    children,
    dashboard,
    error,
    title,
  } = props;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1,
        minHeight: '100vh',
        backgroundColor: 'background.default',
        '& .RaLayout-appFrame': {
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        },
        '& .RaLayout-contentWithSidebar': {
          display: 'flex',
          flexGrow: 1,
        },
        '& .RaLayout-content': {
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 2,
          padding: 0,
          paddingTop: '3em',
          zIndex: 2,
        },
      }}
    >
      <SkipNavigationButton />
      <Box
        component="nav"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: '0 0 15em',
          zIndex: 2,
        }}
      >
        <DefaultSidebar>
          <AppLocationContext>
            <Menu />
          </AppLocationContext>
        </DefaultSidebar>
      </Box>
      <Box
        component="main"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          padding: 0,
          paddingTop: '3em',
          zIndex: 2,
        }}
      >
        {children}
      </Box>
      <Inspector />
    </Box>
  );
};

export default Layout;