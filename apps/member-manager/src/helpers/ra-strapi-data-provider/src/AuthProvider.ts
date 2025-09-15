import CookieStore from "./CookieStore";
import { AuthProvider, UserIdentity } from "react-admin";
import RoleController, { TRole } from "../../../config/Roles";

export interface IUserIdentity extends UserIdentity {
  role: string;
  token: string;
}

const authProvider: AuthProvider = {
  getIdentity: async (): Promise<IUserIdentity> => {
    try {
      return await Promise.resolve({
        id: CookieStore.getCookie("email") as string,
        role: CookieStore.getCookie("role") as string,
        // fullName: CookieStore.getCookie('fullName') as string,
        token: CookieStore.getCookie("token") as string,
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
        method: "POST",
        body: JSON.stringify({ identifier, password }),
        headers: new Headers({ "Content-Type": "application/json" }),
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
            method: "GET",
            headers: new Headers({
              "Content-Type": "application/json",
              Authorization: "Bearer " + userData.jwt,
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
          .then((userMeta) => {
            CookieStore.setCookie("token", userData.jwt, 1);
            CookieStore.setCookie("role", userMeta.role.name, 1);
            CookieStore.setCookie("email", userData.user.email, 1);
            // CookieStore.setCookie('fullName', userData.user.email, 1)
          });
      });
  },

  logout: () => {
    CookieStore.deleteCookie("token");
    CookieStore.deleteCookie("role");
    CookieStore.deleteCookie("email");
    return Promise.resolve();
  },

  checkAuth: () => {
    return CookieStore.getCookie("token")
      ? Promise.resolve()
      : Promise.reject();
  },

  getPermissions: () => {
    const role = new RoleController(CookieStore.getCookie("role") as TRole);
    return Promise.resolve(role.permissions);
  },

  sendResetPasswordEmail: (email: string) => {
    return fetch(
      `${import.meta.env.VITE_API_ENDPOINT}/api/auth/forgot-password`,
      {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: new Headers({"Content-Type": "application/json" ,}),  
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

  resetUserPassword: (code: string, password: string, passwordConfirmation: string) => {
    return fetch(
      `${import.meta.env.VITE_API_ENDPOINT}/api/auth/reset-password`,
      {
        method: "POST",
        body: JSON.stringify({ code, password, passwordConfirmation }),
        headers: new Headers({ "Content-Type": "application/json" }),
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
  checkError: ({ status }) => {
    if (status === 401 || status === 403) {
      CookieStore.deleteCookie("token");
      CookieStore.deleteCookie("role");
      CookieStore.deleteCookie("email");
      return Promise.reject();
    }
    return Promise.resolve();
  },
};

export default authProvider;