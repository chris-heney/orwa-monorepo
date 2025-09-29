import Cookies from './helpers/Cookies'
import { AuthProvider, Identifier, UserIdentity } from 'react-admin'
import RoleController, { TRole } from './config/Roles'



export interface IUserIdentity extends UserIdentity {
  role: string
  token: string
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
      // 🔹 Step 2: Fetch user details
      const userMetaResponse = await fetch(`${apiEndpoint}/api/users/me?populate=role`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userData.jwt}`,
        },
      });
  
      if (!userMetaResponse.ok) {
        const errorData = await userMetaResponse.json();
        throw new Error(errorData?.message || "Failed to fetch user metadata");
      }
  
      const userMeta = await userMetaResponse.json();
  
      // 🔹 Step 3: Store user session data
      Cookies.setCookie('token', userData.jwt, 1);
      Cookies.setCookie('role', userMeta.role.name, 1);
      Cookies.setCookie('email', userData.user.email, 1);
      Cookies.setCookie('id', userData.user.id, 1);
  
      return { success: true, user: userMeta };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },
  logout: () => {
    Cookies.deleteCookie('token')
    Cookies.deleteCookie('role')
    Cookies.deleteCookie('email')
    Cookies.deleteCookie('id')
    return Promise.resolve()
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