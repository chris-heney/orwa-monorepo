import Cookies from './helpers/Cookies'
import { AuthProvider, Identifier, UserIdentity } from 'react-admin'
import RoleController, { TRole } from './config/Roles'



export interface IUserIdentity extends UserIdentity {
  role: string
  token: string
}

const getRoleName = (user: any) => user?.role?.name ?? user?.role?.attributes?.name

const fetchUserWithRole = async (apiEndpoint: string, userId: Identifier, token: string) => {
  const response = await fetch(`${apiEndpoint}/api/users/${userId}?populate=role`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData?.message || "Failed to fetch user role")
  }

  return response.json()
}

const authProvider: AuthProvider = {

  getIdentity: async (): Promise<IUserIdentity> => {
    try {
      return await Promise.resolve({
        email: Cookies.getCookie('email') as string,
        role: Cookies.getCookie('role') as string,
        id: Cookies.getCookie('id') as Identifier,
        // fullName: Cookies.getCookie('fullName') as string,
        token: Cookies.getCookie('token') as string,
      })
    } catch (error) {
      return await Promise.reject(error)
    }
  },

  login: async ({ username, password }) => {
    const identifier = username;
    const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;
  
    try {
      // 🔹 Step 1: Authenticate user
      const authResponse = await fetch(`${apiEndpoint}/api/auth/local`, {
        method: 'POST',
        body: JSON.stringify({ identifier, password }),
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (!authResponse.ok) {
        const errorData = await authResponse.json();
        throw new Error(errorData?.message || "Login failed");
      }
  
      const userData = await authResponse.json();  
      // 🔹 Step 2: Resolve the user's role. Credentials are already verified,
      // so a failure here must never block the login — fall back through
      // /users/me -> /users/:id -> the auth response -> least-privilege Guest.
      let userWithRole = userData.user;
      try {
        const userMetaResponse = await fetch(`${apiEndpoint}/api/users/me?populate=role`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userData.jwt}`,
          },
        });

        if (userMetaResponse.ok) {
          const userMeta = await userMetaResponse.json();
          if (getRoleName(userMeta)) {
            userWithRole = userMeta;
          }
        }

        if (!getRoleName(userWithRole)) {
          userWithRole = await fetchUserWithRole(apiEndpoint, userData.user.id, userData.jwt);
        }
      } catch (metaError) {
        console.error("Could not fetch user role; continuing login with fallback role.", metaError);
        userWithRole = userData.user;
      }

      const roleName = getRoleName(userWithRole) ?? 'Guest';

      // 🔹 Step 3: Store user session data
      Cookies.setCookie('token', userData.jwt, 1);
      Cookies.setCookie('role', roleName, 1);
      Cookies.setCookie('email', userData.user.email, 1);
      Cookies.setCookie('id', userData.user.id, 1);
  
      return { success: true, user: userWithRole };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },
  logout: async () => {
    try {
      const { userPreferencesStore } = await import('./helpers/userPreferencesStore')
      await userPreferencesStore.flush()
    } catch (err) {
      console.warn('[authProvider] preferences flush on logout failed', err)
    }
    Cookies.deleteCookie('token')
    Cookies.deleteCookie('role')
    Cookies.deleteCookie('email')
    Cookies.deleteCookie('id')
  },

  checkAuth: () => {
    return Cookies.getCookie('token') ? Promise.resolve() : Promise.reject()
  },

  getPermissions: () => {
    const role = new RoleController(Cookies.getCookie('role') as TRole)

    return Promise.resolve(role.permissions)
  },

  checkError: (
    { status }
  ) => {
    if (status === 401 || status === 403) {
      Cookies.deleteCookie('token')
      Cookies.deleteCookie('role')
      Cookies.deleteCookie('email')
      Cookies.deleteCookie('id')
      return Promise.reject()
    }
    return Promise.resolve()
  },
}

export default authProvider