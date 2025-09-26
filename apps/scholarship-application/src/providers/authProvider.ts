import Cookies from "../helpers/Cookies"

export interface IUserIdentity {
  role: string
  token: string
}

export const authProvider = {

  getIdentity: async (): Promise<IUserIdentity> => {
    try {
      return await Promise.resolve({
        id: Cookies.getCookie('email') as string,
        role: Cookies.getCookie('role') as string,
        // fullName: Cookies.getCookie('fullName') as string,
        token: Cookies.getCookie('token') as string,
      })
    } catch (error) {
      return await Promise.reject(error)
    }
  },
  login: ({ username, password } : {
    username: string
    password: string
  }) => {

    const identifier = username
    const request = new Request(`${import.meta.env.VITE_API_ENDPOINT}/auth/local`, {
      method: 'POST',
      body: JSON.stringify({ identifier, password }),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    })

    return fetch(request)
      .then((response) => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error(response.statusText)
        }
        return response.json()
      })
      .then((userData) => {

        const userDataRequest = new Request(`${import.meta.env.VITE_API_ENDPOINT}/users/me?populate=role`, {
          method: 'GET',
          headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + userData.jwt,
          }),
        })

        return fetch(userDataRequest)
          .then((response) => {
            if (response.status < 200 || response.status >= 300) {
              throw new Error(response.statusText)
            }
            return response.json()
          })
          .then((userMeta) => {
            Cookies.setCookie('token', userData.jwt, 1)
            Cookies.setCookie('role', userMeta.role.name, 1)
            Cookies.setCookie('email', userData.user.email, 1)
            // Cookies.setCookie('fullName', userData.user.email, 1)
          })
      })
  },

  logout: () => {
    Cookies.deleteCookie('token')
    Cookies.deleteCookie('role')
    Cookies.deleteCookie('email')
    return Promise.resolve()
  },

  checkAuth: () => {
    return Cookies.getCookie('token') ? Promise.resolve() : Promise.reject()
  },

checkError: (
    { status }: { status: number }
) => {
    if (status === 401 || status === 403) {
        Cookies.deleteCookie('token')
        Cookies.deleteCookie('role')
        Cookies.deleteCookie('email')
        return Promise.reject()
    }
    return Promise.resolve()
},
}

export default authProvider