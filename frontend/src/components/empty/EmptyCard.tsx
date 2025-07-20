import { Icon } from '@iconify/react/dist/iconify.js'
import type { ReactNode } from 'react'

interface Props {
  icon: string
  title: string
  description: string
  children?: ReactNode
}

export default function EmptyCard({
  icon,
  title,
  description,
  children,
}: Props) {
  return (
    <div className="card is-outline">
      <div className="card-body">
        <div className="is-flex is-flex-column is-align-items-center py-5">
          <Icon
            className="icon"
            icon={icon}
            style={{ width: '60px', height: '60px', color: '#414651' }}
          ></Icon>

          <div className="is-text-center mt-4">
            <div className="h4 is-font-bold">{title}</div>
            <div className="mt-2" style={{ color: '#535862' }}>
              {description}
            </div>
          </div>

          {children ? <div className="mt-5">{children}</div> : <></>}
        </div>
      </div>
    </div>
  )
}
