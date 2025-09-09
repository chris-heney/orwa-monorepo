import { useState } from 'react'
import Loading from './Loading'
import { useIsLoggedIn, useLogin } from '../helpers/APIService'


const LoginModal = () => {

  const login = useLogin()
  const isLoggedIn = useIsLoggedIn()

  const [loggedIn, setLoggedIn] = useState(false)
  const [authFail, setAuthFail] = useState(false)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  if (isLoggedIn()) {
    return null
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const handleLogin = () => {
    setLoading(true)
    try {
      login(email, password).then( (credentials) => {

        if (credentials.jwt) {
          setLoggedIn(true)
          return
        }

        setTimeout( () => {
          setAuthFail(false)
        }, 3000)

        setAuthFail(true)
        setLoading(false)
      } )
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  };

  return ( loggedIn ? null :
    <div id="modal-overlay">
      {loading ? <Loading /> : <div id="modal-content">
        <input type="text" onChange={handleEmailChange} placeholder="login" />
        <input type="password" onChange={handlePasswordChange} placeholder="password" />
        {authFail ? <p style={{color: 'red', fontWeight: 800}}>Authentication failed</p> : null}
        <button onClick={handleLogin}>Login</button>
      </div>}
    </div>
  );
}

export default LoginModal