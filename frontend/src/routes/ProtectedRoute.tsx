import { Navigate, Outlet } from 'react-router-dom'
import MeModel from '../js/models/me.model'

export function ProtectedRoute() {
  const auth = MeModel.isAuthenticated()

  return auth ? (
    <div className="page-base">
      <aside className="sidebar surface is-tone-2">
        <div className="is-flex is-flex-column px-3 py-2 list-group is-hoverable is-primary is-list-pointer">
          <div className="is-rounded-1 list-item px-3 py-2">Home</div>
          <div className="is-rounded-1 list-item px-3 py-2">Clients</div>
        </div>
      </aside>
      <div className="page-content is-justify-content-center is-flex">
        <div className="page-container p-5">
          <Outlet />
        </div>
      </div>
    </div>
  ) : (
    <Navigate to="/signin" />
  )
}
