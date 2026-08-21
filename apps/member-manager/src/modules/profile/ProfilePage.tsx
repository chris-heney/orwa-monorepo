import React from 'react';
import { Box } from '@mui/material';
import UserContextProvider from '../../context/UserContextProvider';
import SettingsContextProvider from '../setting/SettingsContextProvider';
import ProfileContactForm from '../setting/SettingsPage';
import ProfilePreferences from './ProfilePreferences';

/**
 * "My Profile" — reachable from the app-bar avatar menu (not module-gated, so
 * every signed-in user can edit their own contact + preferences). Renders the
 * user's linked contact editor followed by personal UI preferences.
 */
const ProfilePage = () => (
  <UserContextProvider>
    <SettingsContextProvider>
      <Box sx={{ p: { xs: 1, sm: 2 } }}>
        <ProfileContactForm />
        <ProfilePreferences />
      </Box>
    </SettingsContextProvider>
  </UserContextProvider>
);

export default ProfilePage;
