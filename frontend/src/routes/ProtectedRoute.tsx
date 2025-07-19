import { Navigate, Outlet } from 'react-router-dom'
import MeModel from '../js/models/me.model'

export function ProtectedRoute() {
  const auth = MeModel.isAuthenticated()

  return auth ? <Outlet /> : <Navigate to="/signin" />
}
