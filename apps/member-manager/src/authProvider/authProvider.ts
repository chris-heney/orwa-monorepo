import { AuthProvider } from 'react-admin';
import { config } from '../config';
import ciwsDataProvider from '../dataProvider/ciWebServices';

const authProvider: AuthProvider = {
    login: () => {  
        return new Promise<void>((resolve) => {
            const state = btoa(Math.random().toString(36).substring(2));
            sessionStorage.setItem('oauth_state', state);
            const authRedirectUrl = `${config.VITE_AUTHENTIK_AUTH_URL}?response_type=code&client_id=${config.VITE_AUTHENTIK_CLIENT_ID}&redirect_uri=${encodeURIComponent(config.VITE_REDIRECT_URI)}&state=${state}&scope=email openid profile offline_access&next=${encodeURIComponent(config.VITE_REDIRECT_URI)}`;
            window.location.href = authRedirectUrl;
        });
    },
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user_groups');
        localStorage.removeItem('activeTestRole'); // Clear role testing on logout
        return Promise.resolve();
    },
    checkError: ({ status }) => {
        if (status === 401 || status === 403) {
            localStorage.removeItem('token');
            localStorage.removeItem('user_groups');
            localStorage.removeItem('activeTestRole'); // Clear role testing on auth error
            return Promise.reject();
        }
        return Promise.resolve();
    },
    checkAuth: () => {
        return localStorage.getItem('token')
            ? Promise.resolve()
            : Promise.reject();
    },
    getPermissions: async () => {
        // Compute permissions using standard API resources (role, permission, rolePermission)
        try {
            const idToken = localStorage.getItem('id_token');
            const accessToken = localStorage.getItem('token');
            const activeTestRole = localStorage.getItem('activeTestRole');
            if (!idToken && !accessToken) return [];

            const jwtToUse = idToken || accessToken!;
            let groups: string[] = [];
            let email: string | undefined;
            let sub: string | undefined;
            try {
                const claims = JSON.parse(atob(jwtToUse.split('.')[1]));
                groups = Array.isArray(claims?.groups) ? claims.groups : [];
                email = claims?.email || claims?.preferred_username;
                sub = claims?.sub;
            } catch {
                // ignore decoding error
            }

            // Super Admin test-role override: if a test role is selected, return that role's permissions only
            const isSuperAdminToken = groups.includes('Super Admins');
            if (activeTestRole && isSuperAdminToken) {
                try {
                    const { data: roles } = await ciwsDataProvider.getList('role', {
                        pagination: { page: 1, perPage: 1 },
                        sort: { field: 'id', order: 'ASC' },
                        filter: { name: { $eq: activeTestRole } },
                        meta: { populate: 'permissions.permission', raw: true },
                    } as any);
                    const role = Array.isArray(roles) ? roles[0] : (roles as any[])?.[0];
                    if (role) {
                        const perms = (role.permissions || [])
                            .map((rp: any) => ({ resource: rp.permission?.resource, action: rp.permission?.action }))
                            .filter((p: any) => p.resource && p.action);
                        return perms;
                    }
                } catch {
                    // fall through to default resolution
                }
            }

            // Helper: union unique {resource, action}
            const addUnique = (
                acc: Array<{ resource: string; action: string }>,
                items: Array<{ resource: string; action: string }>
            ) => {
                const seen = new Set(acc.map(p => `${p.resource}:${p.action}`));
                items.forEach(p => {
                    const key = `${p.resource}:${p.action}`;
                    if (!seen.has(key)) {
                        seen.add(key);
                        acc.push(p);
                    }
                });
                return acc;
            };

            // If groups are present on the token, derive permissions from all matching roles
            if (groups.length > 0) {
                const { data: roles } = await ciwsDataProvider.getList('role', {
                    pagination: { page: 1, perPage: 100 },
                    sort: { field: 'name', order: 'ASC' },
                    filter: { name: { $in: groups } },
                    meta: { populate: 'permissions.permission', raw: true },
                } as any);

                const perms = roles.reduce(
                    (acc: Array<{ resource: string; action: string }>, r: any) => {
                        const items = (r.permissions || []).map((rp: any) => ({
                            resource: rp.permission?.resource,
                            action: rp.permission?.action,
                        }));
                        return addUnique(acc, items.filter((p: any) => p.resource && p.action));
                    },
                    []
                );
                return perms;
            }

            // Fallback: fetch current user (by id_token correlation) and derive permissions via roles
            const { data: users } = await ciwsDataProvider.getList('user', {
                pagination: { page: 1, perPage: 1 },
                sort: { field: 'id', order: 'ASC' },
                filter: idToken
                    ? { token: { $eq: idToken } }
                    : email
                        ? { contact: { email: { $eq: email } } }
                        : { authExternalId: { $eq: sub } },
                meta: { populate: 'role,role.permissions.permission', raw: true },
            } as any);

            const user = Array.isArray(users) ? users[0] : users?.[0];
            if (!user) return [];
            const perms = ((user.role || []) as any[]).reduce(
                (acc: Array<{ resource: string; action: string }>, r: any) => {
                    const items = (r.permissions || []).map((rp: any) => ({
                        resource: rp.permission?.resource,
                        action: rp.permission?.action,
                    }));
                    return addUnique(acc, items.filter((p: any) => p.resource && p.action));
                },
                []
            );
            return perms;
        } catch (e) {
            console.error('Failed to compute permissions via API', e);
            return [];
        }
    },
    getIdentity: () => {
        const token = localStorage.getItem('token');
        if (token) {
            const userInfo = JSON.parse(atob(token.split('.')[1]));
            return Promise.resolve({
                id: userInfo.sub,
                fullName: userInfo.name,
                avatar: userInfo.picture,
            });
        }
        return Promise.reject();
    },
};

export default authProvider;


export const handleOAuthCallback = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const savedState = sessionStorage.getItem('oauth_state');

    if (code && state === savedState) {
        try {
            const response = await fetch(config.VITE_AUTHENTIK_TOKEN_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    grant_type: 'authorization_code',
                    code,
                    redirect_uri: config.VITE_REDIRECT_URI,
                    client_id: config.VITE_AUTHENTIK_CLIENT_ID,
                    client_secret: config.VITE_AUTHENTIK_CLIENT_SECRET,
                }),
            });

            if (response.ok) {
                const { access_token, id_token, refresh_token, expires_in } = await response.json();
                localStorage.setItem('token', access_token);
                if (id_token) localStorage.setItem('id_token', id_token);
                localStorage.setItem('refresh_token', refresh_token);
                localStorage.setItem('token_expiry', (new Date().getTime() + expires_in * 1000).toString());
                // Sync/create user in backend and verify creation
                try {
                    const base = config.VITE_API_URL.replace('/api/v1', '');
                    // Guard: require at least one token before calling API
                    const bearer = id_token || access_token;
                    if (!bearer) {
                        console.warn('[auth] No bearer token available, skipping backend sync');
                    } else {
                        const syncRes = await fetch(`${base}/auth/oidc-login`, {
                        method: 'POST',
                        headers: {
                            // Use ID token so backend can decode claims reliably
                            Authorization: `Bearer ${bearer}`,
                            Accept: 'application/json',
                        },
                        mode: 'cors',
                        });
                        if (!syncRes.ok) {
                            const text = await syncRes.text();
                            console.error('oidc-login failed', syncRes.status, text);
                        } else {
                            // Verify user exists; retry once if needed (eventual consistency)
                            const verify = async () => {
                                const r = await fetch(`${base}/auth/me`, {
                                    headers: { Authorization: `Bearer ${bearer}` },
                                    mode: 'cors',
                                });
                                return r.ok ? r.json() : null;
                            };
                            let me = await verify();
                            if (!me) {
                                await new Promise(res => setTimeout(res, 500));
                                me = await verify();
                            }
                            if (!me) {
                                console.warn('User verification failed after oidc-login');
                            }
                        }
                    }
                } catch (e) {
                    console.error('Failed to sync user with backend', e);
                }
                window.location.href = '/';
            } else {
                console.error('Token exchange failed');
            }
        } catch (error) {
            console.error('Error during token exchange', error);
        }
    } else {
        console.error('Invalid OAuth state or missing code');
    }
};
