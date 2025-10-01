import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

export const DashboardHeader = () => {
  const theme = useTheme();
//   const { identity } = useGetIdentity();

  return (
    <Box
      sx={{
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        boxShadow: 3,
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(90deg, ${theme.palette.secondary.main}, ${theme.palette.primary.light})`,
        }
      }}
    >
      <Box
        sx={{
          px: { xs: 2, sm: 3, md: 4 },
          py: 3,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column-reverse', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          {/* Title Section */}
          <Box
            sx={{
              textAlign: { xs: 'center', md: 'left' },
              flex: 1,
            }}
          >
            <Typography
              variant="h3"
              component="h1"
              sx={{
                color: 'white',
                fontWeight: 'bold',
                fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
                letterSpacing: '-0.02em',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                mb: 0.5,
              }}
            >
            DASHBOARD
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: 500,
                fontSize: { xs: '0.875rem', sm: '1rem' },
                opacity: 0.9,
              }}
            >
              Member Management Portal
            </Typography>
          </Box>

          {/* Logo and Profile Section */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            {/* ORWA Logo */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 2,
                px: 2,
                py: 1,
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <img 
                src="/orwa.webp" 
                alt="ORWA Logo"
                style={{
                  height: '64px',
                  width: 'auto',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                }}
              />
            </Box>

            {/* Profile Menu */}
            {/* {identity && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <ProfileMenu />
              </Box>
            )} */}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardHeader;
