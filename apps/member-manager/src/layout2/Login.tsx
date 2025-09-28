import * as React from 'react';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import logo from '/logo-horizontal.svg';

import {
    Button,
    Box,
    Card,
    CardActions,
    CircularProgress,
    CardMedia,
    Divider,
} from '@mui/material';
import {
    Form,
    required,
    TextInput,
    useTranslate,
    useLogin,
    useNotify,
} from 'react-admin';
import { handleOAuthCallback, default as oauthProvider } from '../authProvider/authProvider';

const Login = () => {
    const code = new URLSearchParams(window.location.search).get('code');
    const [oAuthLoading] = useState(!!code);

    useEffect(() => {
        if (code) {
            handleOAuthCallback();
        }
    }, [code]);

    const [loading, setLoading] = useState(false);
    const translate = useTranslate();

    const notify = useNotify();
    const login = useLogin();
    const location = useLocation();

    const handleSubmit = (auth: FormValues) => {
        setLoading(true);
        login(
            auth,
            location.state ? (location.state as any).nextPathname : '/'
        ).catch((error: Error) => {
            setLoading(false);
            notify(
                typeof error === 'string'
                    ? error
                    : typeof error === 'undefined' || !error.message
                    ? 'ra.auth.sign_in_error'
                    : error.message,
                {
                    type: 'warning',
                    messageArgs: {
                        _:
                            typeof error === 'string'
                                ? error
                                : error && error.message
                                ? error.message
                                : undefined,
                    },
                }
            );
        });
    };

    if (oAuthLoading) {
        return (
            <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
            }}
        >
            <CircularProgress size={50} />
        </Box>
        );
    }

    return (
        <Form onSubmit={handleSubmit} noValidate>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '100vh',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    background:
                        'url(https://source.unsplash.com/featured/1600x900)',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                }}
            >
                <Card sx={{ minWidth: 300, marginTop: '6em' }}>
                    <CardMedia
                        component="img"
                        image={logo}
                        alt="Logo"
                        sx={{ height: 'auto', mx: 'auto', my: 2, px: 2 }}
                    />
                    
                    <Box sx={{ padding: '0 1em 1em 1em', justifyContent: 'center' }}>
                        <Box sx={{ marginTop: '1em' }}>
                            <TextInput
                                // eslint-disable-next-line jsx-a11y/no-autofocus
                                autoFocus
                                source="username"
                                label={translate('ra.auth.username')}
                                disabled={loading}
                                validate={required()}
                            />
                        </Box>
                        <Box sx={{ marginTop: '1em' }}>
                            <TextInput
                                source="password"
                                label={translate('ra.auth.password')}
                                type="password"
                                disabled={loading}
                                validate={required()}
                            />
                        </Box>
                        
                    </Box>
                    <CardActions sx={{ padding: '0 1em 1em 1em' }}>
                        <Button
                            variant="contained"
                            type="submit"
                            color="primary"
                            disabled={loading}
                            fullWidth
                        >
                            {loading && (
                                <CircularProgress size={25} thickness={2} />
                            )}
                            {translate('ra.auth.sign_in')}
                        </Button>
                    </CardActions>
                    <Divider sx={{ my: 2 }} />
                    <CardActions sx={{ padding: '0 1em 1em 1em', justifyContent: 'center' }}>
                        <Button
                            variant="contained"
                            fullWidth
                            color="secondary"
                            onClick={() => oauthProvider.login({})}
                        >
                            Login with CI Connect
                        </Button>
                    </CardActions>
                </Card>
            </Box>
        </Form>
    );
};

export default Login;

interface FormValues {
    username?: string;
    password?: string;
}
