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
  login: ({ username, password }) => {
    const identifier = username;
    const request = new Request(
      `${import.meta.env.VITE_API_ENDPOINT}/api/auth/local`,
      {
        method: 'POST',
        body: JSON.stringify({ identifier, password }),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      }
    );

    return fetch(request)
      .then((response) => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((userData) => {
        const userDataRequest = new Request(
          `${import.meta.env.VITE_API_ENDPOINT}/api/users/me?populate=role`,
          {
            method: 'GET',
            headers: new Headers({
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + userData.jwt,
            }),
          }
        );

        return fetch(userDataRequest)
          .then((response) => {
            if (response.status < 200 || response.status >= 300) {
              throw new Error(response.statusText);
            }
            return response.json();
          })
          .then(async (userMeta) => {
            const userWithRole = getRoleName(userMeta)
              ? userMeta
              : await fetchUserWithRole(userData.user.id, userData.jwt);
            const roleName = getRoleName(userWithRole);

            if (!roleName) {
              throw new Error(
                'This user does not have a role assigned. Please assign a role before logging in.'
              );
            }

            CookieStore.setCookie('token', userData.jwt, 1);
            CookieStore.setCookie('role', roleName, 1);
            CookieStore.setCookie('email', userData.user.email, 1);
            const userId = userWithRole?.id ?? userData.user?.id;
            if (userId != null) {
              CookieStore.setCookie('id', String(userId), 1);
            }
            return { success: true, user: userWithRole };
          });
      });
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
