import CookieStore from './CookieStore';
import { AuthProvider, UserIdentity } from 'react-admin';
import { userPreferencesStore } from '../../userPreferencesStore';
export interface IUserIdentity extends UserIdentity {
  role: string;
  token: string;
}

const getRoleName = (user: any) =>
  user?.role?.name ?? user?.role?.attributes?.name;

const fetchUserWithRole = async (userId: string | number, token: string) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_ENDPOINT}/api/users/${userId}?populate=role`,
    {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      }),
    }
  );

  if (response.status < 200 || response.status >= 300) {
    throw new Error(response.statusText);
  }

  return response.json();
};

const authProvider: AuthProvider = {
  getIdentity: async (): Promise<IUserIdentity> => {
    try {
      return await Promise.resolve({
        id: CookieStore.getCookie('email') as string,
        role: CookieStore.getCookie('role') as string,
        // fullName: CookieStore.getCookie('fullName') as string,
        token: CookieStore.getCookie('token') as string,
      });
    } catch (error) {
      return await Promise.reject(error);
    }
  },
  login: async ({ username, password }) => {
    const identifier = username;
    const endpoint = import.meta.env.VITE_API_ENDPOINT;

    const authResponse = await fetch(`${endpoint}/api/auth/local`, {
      method: 'POST',
      body: JSON.stringify({ identifier, password }),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    if (authResponse.status < 200 || authResponse.status >= 300) {
      // Real authentication failure — surface Strapi's message (e.g.
      // "Invalid identifier or password") instead of the bare statusText.
      const errorBody = await authResponse.json().catch(() => null);
      throw new Error(
        errorBody?.error?.message || authResponse.statusText || 'Login failed'
      );
    }

    const userData = await authResponse.json();

    // Credentials are verified past this point, so resolving the role must
    // NEVER fail the login. Fall back through /users/me -> /users/:id ->
    // the auth response body -> least-privilege Guest.
    let userWithRole = userData.user;
    try {
      const meResponse = await fetch(`${endpoint}/api/users/me?populate=role`, {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + userData.jwt,
        }),
      });

      if (meResponse.ok) {
        const userMeta = await meResponse.json();
        if (getRoleName(userMeta)) {
          userWithRole = userMeta;
        }
      }

      if (!getRoleName(userWithRole)) {
        userWithRole = await fetchUserWithRole(userData.user.id, userData.jwt);
      }
    } catch (metaError) {
      console.error(
        'Could not fetch user role; continuing login with fallback role.',
        metaError
      );
      userWithRole = userData.user;
    }

    const roleName = getRoleName(userWithRole) ?? 'Guest';

    CookieStore.setCookie('token', userData.jwt, 1);
    CookieStore.setCookie('role', roleName, 1);
    CookieStore.setCookie('email', userData.user.email, 1);
    const userId = userWithRole?.id ?? userData.user?.id;
    if (userId != null) {
      CookieStore.setCookie('id', String(userId), 1);
    }
    return { success: true, user: userWithRole };
  },

  logout: async () => {
    try {
      await userPreferencesStore.flush();
    } catch (err) {
      console.warn('[authProvider] preferences flush on logout failed', err);
    }
    try {
      const { clearRolePreview } = await import(
        '../../../modules/rbac-manager/rolePreview'
      );
      clearRolePreview();
    } catch {
      // ignore
    }
    CookieStore.deleteCookie('token');
    CookieStore.deleteCookie('role');
    CookieStore.deleteCookie('email');
    CookieStore.deleteCookie('id');
    return;
  },

  checkAuth: () => {
    return CookieStore.getCookie('token')
      ? Promise.resolve()
      : Promise.reject();
  },

  // Required by react-admin's AuthProvider contract, but unused: capability
  // checks read the role's real Strapi permissions via `useCan`.
  getPermissions: () => Promise.resolve(null),

  sendResetPasswordEmail: (email: string) => {
    return fetch(
      `${import.meta.env.VITE_API_ENDPOINT}/api/auth/forgot-password`,
      {
        method: 'POST',
        body: JSON.stringify({ email }),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      }
    )
      .then((response) => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        return Promise.resolve(data);
      });
  },

  resetUserPassword: (
    code: string,
    password: string,
    passwordConfirmation: string
  ) => {
    return fetch(
      `${import.meta.env.VITE_API_ENDPOINT}/api/auth/reset-password`,
      {
        method: 'POST',
        body: JSON.stringify({ code, password, passwordConfirmation }),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      }
    )
      .then((response) => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        return Promise.resolve(data);
      });
  },
  // react-admin contract: reject → logout + redirect to login; resolve → stay.
  // Only 401 (unauthenticated) ends the session. 403 means "authenticated but
  // not permitted" — non-admins routinely hit admin-only endpoints (e.g.
  // users-permissions metadata) and must NOT be logged out for it.
  checkError: ({ status }) => {
    if (status === 401) {
      CookieStore.deleteCookie('token');
      CookieStore.deleteCookie('role');
      CookieStore.deleteCookie('email');
      CookieStore.deleteCookie('id');
      return Promise.reject();
    }
    return Promise.resolve();
  },
};

export default authProvider;
