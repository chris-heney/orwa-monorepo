import { useEffect, useState } from 'react'
import authProvider from '../../../authProvider'

/** Resolve the signed-in user's role once (empty string while loading). */
const useUserRole = (): string => {
  const [role, setRole] = useState('')

  useEffect(() => {
    let mounted = true
    authProvider
      .getIdentity?.()
      .then((identity) => {
        if (mounted && identity?.role) setRole(identity.role)
      })
      .catch((error) => console.error('Error fetching identity', error))
    return () => {
      mounted = false
    }
  }, [])

  return role
}

export default useUserRole
