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
          // Data fetches ran (and were skipped) before auth existed; reload so
          // the session-wide dataset loads with the new JWT (mirrors logout).
          window.location.reload()
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
        <p className="modal-eyebrow">Rural Infrastructure Grant</p>
        <h1 className="modal-title">Grant Map</h1>
        <input type="text" onChange={handleEmailChange} placeholder="Email" />
        <input type="password" onChange={handlePasswordChange} placeholder="Password" />
        {authFail ? <p style={{color: '#F16A5D', fontWeight: 700, margin: 0}}>Authentication failed</p> : null}
        <button onClick={handleLogin}>Sign In</button>
      </div>}
    </div>
  );
}

export default LoginModal