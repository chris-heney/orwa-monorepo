import React from 'react';
import { 
  IconButton, 
  Avatar, 
  Menu, 
  MenuItem, 
  Typography,
  Box,
  Divider 
} from '@mui/material';
import { 
  AccountCircle, 
  Settings, 
  Logout,
  Person 
} from '@mui/icons-material';
import { useGetIdentity, useAuthProvider } from 'react-admin';

export const ProfileMenu = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { identity } = useGetIdentity();
  const authProvider = useAuthProvider();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    authProvider.logout();
    handleClose();
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton
        size="large"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
          },
        }}
      >
        {identity?.avatar ? (
          <Avatar
            src={identity.avatar}
            alt={identity.fullName}
            sx={{ width: 32, height: 32 }}
          />
        ) : (
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(255, 255, 255, 0.2)' }}>
            {identity?.fullName?.charAt(0) || <Person />}
          </Avatar>
        )}
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 200,
            boxShadow: 3,
            borderRadius: 2,
          }
        }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle2" color="text.secondary">
            {identity?.fullName || 'User'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {identity?.email || ''}
          </Typography>
        </Box>
        <Divider />
        <MenuItem onClick={handleClose}>
          <Person sx={{ mr: 1 }} />
          Profile
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Settings sx={{ mr: 1 }} />
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <Logout sx={{ mr: 1 }} />
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default ProfileMenu;
