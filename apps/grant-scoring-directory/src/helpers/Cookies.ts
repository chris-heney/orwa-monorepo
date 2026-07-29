const Cookies = {
    getCookie: (name: string) => {
      const v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)')
      return v ? v[2] : null
    },
  
    setCookie: (name: string, value: string, days: number) => {
      const d = new Date()
      d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * days)
      document.cookie = name + '=' + value + ';path=/;expires=' + d.toUTCString()
    },
  
    deleteCookie: (name: string) => {
      Cookies.setCookie(name, '', -1)
    },
  }
  
  
  export default Cookies
  