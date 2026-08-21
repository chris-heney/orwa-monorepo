import React, { forwardRef } from 'react';
import {
  ListItemIcon,
  ListItemText,
  MenuItem,
  Switch,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LabelIcon from '@mui/icons-material/Label';
import { Logout, UserMenu, useUserMenu } from 'react-admin';
import { useNavigate } from 'react-router-dom';
import { useActionLabels } from '../../helpers/useActionLabels';

/**
 * "My Profile" entry. forwardRef + useUserMenu so react-admin can close the
 * popover after navigation (RA clones menu children and wires the ref).
 */
const ProfileMenuItem = forwardRef<HTMLLIElement>((props, ref) => {
  const navigate = useNavigate();
  const userMenu = useUserMenu();
  return (
    <MenuItem
      ref={ref}
      {...props}
      onClick={() => {
        navigate('/profile');
        userMenu?.onClose();
      }}
    >
      <ListItemIcon>
        <PersonIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText>My Profile</ListItemText>
    </MenuItem>
  );
});
ProfileMenuItem.displayName = 'ProfileMenuItem';

/**
 * Toggle for "show text labels on heading-bar action buttons". Keeps the
 * popover open so the user sees the switch flip; the preference syncs to the
 * server via RaStore.
 */
const ShowLabelsMenuItem = forwardRef<HTMLLIElement>((props, ref) => {
  const [showLabels, setShowLabels] = useActionLabels();
  return (
    <MenuItem
      ref={ref}
      {...props}
      onClick={() => setShowLabels(!showLabels)}
    >
      <ListItemIcon>
        <LabelIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText>Show button labels</ListItemText>
      <Switch edge="end" size="small" checked={showLabels} tabIndex={-1} />
    </MenuItem>
  );
});
ShowLabelsMenuItem.displayName = 'ShowLabelsMenuItem';

/** App-bar avatar menu: My Profile, button-label toggle, Logout. */
const ProfileMenu = () => (
  <UserMenu>
    <ProfileMenuItem />
    <ShowLabelsMenuItem />
    <Logout />
  </UserMenu>
);

export default ProfileMenu;
