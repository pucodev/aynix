import { Navigate, Outlet } from 'react-router-dom'
import { isAuthenticated } from '../js/utils/utils'

export function ProtectedRoute() {
  const auth = isAuthenticated()

  return auth ? <Outlet /> : <Navigate to="/signin" />
}
