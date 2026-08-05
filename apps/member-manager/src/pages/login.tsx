import React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { TypographyProps } from '@mui/material/Typography';

import Typography from '@mui/material/Typography';

import { useNotify, useRedirect } from 'react-admin';
import Logo from './components/logo';
import AuthPageShell from './components/AuthPageShell';
import authProvider from '../authProvider';
import { ALL_MODULE_KEYS, firstAllowedPath } from '../config/modules';

function Copyright(props: TypographyProps) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {'Copyright © '}
      <Link color="inherit" target="_blank" href="https://orwa.org/">
        ORWA
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const LoginPage = () => {
  const notify = useNotify();
  const redirect = useRedirect();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    authProvider
      .login({ username: data.get('email'), password: data.get('password') })
      .then((res) => {
        if (res.error) {
          notify(res.error, {
            type: 'error',
          });
        } else {
          notify('Logged in successfully', {
            type: 'success',
          });
          // Land on the first module the role grants (admins get all modules,
          // so they land on the dashboard). A missing role never hard-fails:
          // firstAllowedPath falls back to Settings.
          const role = res?.user?.role;
          const isAdmin = role?.type === 'admin' || role?.name === 'Admin';
          redirect(firstAllowedPath(isAdmin ? ALL_MODULE_KEYS : role?.modules));
        }
      });
  };
  return (
    <AuthPageShell>
      <Box
        sx={{
          width: '100%',
          maxWidth: 420,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Logo />

        <Typography component="h1" variant="h6" sx={{ mt: 1 }}>
          ORWA Admin v2
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ mt: 1, width: '100%' }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address / Username"
            name="email"
            autoComplete="email"
            variant="outlined"
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#/forgot-password" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              {/* <Link href="#/signup" variant="body2">
                {'Don\'t have an account? Sign Up'}
              </Link> */}
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </AuthPageShell>
  );
};

export default LoginPage;
