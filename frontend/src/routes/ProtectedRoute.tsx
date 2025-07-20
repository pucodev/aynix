import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import MeModel from '../js/models/me.model'
import { Link } from 'react-router-dom'
import { Icon } from '@iconify/react/dist/iconify.js'
import type { HTMLAttributes } from 'react'

interface ItemProps extends HTMLAttributes<HTMLDivElement> {
  name: string
  icon: string
}

export function ProtectedRoute() {
  const navigate = useNavigate()
  const auth = MeModel.isAuthenticated()
  const items = [
    {
      id: 1,
      path: '/',
      name: ' Home',
      icon: 'mdi:home-outline',
    },
    {
      id: 2,
      path: '/clients',
      name: 'Clients',
      icon: 'mdi:user-outline',
    },
  ]

  function logout() {
    MeModel.clearTokens()
    navigate('/')
  }

  function Item({ name, icon, ...props }: ItemProps) {
    return (
      <div
        className="is-rounded-1 list-item px-3 py-2 is-flex is-align-items-center"
        {...props}
      >
        <Icon
          className="icon"
          icon={icon}
          style={{
            color: '#a4a7ae',
            width: '1.4rem',
            height: '1.4rem',
          }}
        ></Icon>
        <span className="ml-3 is-font-bold">{name}</span>
      </div>
    )
  }

  return auth ? (
    <div className="page-base">
      <aside className="sidebar-wrapper">
        <div className="sidebar">
          <div
            className="w-100 is-flex is-flex-column"
            style={{ height: '100%' }}
          >
            <div className="w-100 pt-3 pb-4">
              <img src="/aynix logo sidebar.png" />
            </div>
            <div
              className="is-flex is-flex-column px-3 py-2 list-group is-hoverable is-primary is-list-pointer is-justify-content-space-between"
              style={{ flex: '1 0 auto' }}
            >
              <div style={{ flex: '1 0 auto' }}>
                {items.map(item => (
                  <Link to={item.path} style={{ all: 'unset' }} key={item.id}>
                    <Item icon={item.icon} name={item.name}></Item>
                  </Link>
                ))}
              </div>
              <div className="pb-4">
                <Item icon="mdi:logout" name="Logout" onClick={logout}></Item>
              </div>
            </div>
          </div>
        </div>
      </aside>
      <div
        className="page-content is-justify-content-center is-flex"
        style={{ backgroundColor: '#fafafa' }}
      >
        <div className="page-container p-5">
          <Outlet />
        </div>
      </div>
    </div>
  ) : (
    <Navigate to="/signin" />
  )
}
