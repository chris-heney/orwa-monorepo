import Cookies from '../helpers/Cookies'


export interface IUserIdentity {
  role: string
  token: string
}

const authProvider = {

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
  
  checkAuth: () => {
    return Cookies.getCookie('token') ? Promise.resolve() : Promise.reject()
  },

  getPermissions: () => {
    return Cookies.getCookie('token') ? Promise.resolve() : Promise.reject()
  },

}

export default authProvider