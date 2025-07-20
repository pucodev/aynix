import { Icon } from '@iconify/react/dist/iconify.js'
import type MaterialModel from '../../js/models/material.model'
import { useState } from 'react'

interface Props {
  material: MaterialModel
  onDelete?: Function
}

export default function MaterialRow({ material, onDelete }: Props) {
  const [isShowDelete, setIsShowDelete] = useState(false)

  function confirmDelete() {
    if (typeof onDelete === 'function') {
      onDelete()
    }
    setIsShowDelete(false)
  }

  return (
    <>
      <tr>
        <td>{material.node.name}</td>
        <td>{material.node.qty}</td>
        <td>{material.priceLabeled}</td>
        <td>{material.totalPrice}</td>
        <td>
          <div className="is-flex is-gap-3">
            <button
              className="btn is-tonal is-error is-rounded"
              onClick={() => setIsShowDelete(true)}
            >
              <Icon className="icon" icon="mdi:trash"></Icon>
            </button>
            <button className="btn is-tonal is-muted is-rounded" disabled>
              <Icon className="icon" icon="mdi:pencil"></Icon>
            </button>

            {/* DELETE DIALOG */}
            {isShowDelete ? (
              <div className="dialog is-active">
                <div className="dialog-bg"></div>
                <div className="dialog-card is-outlined">
                  <header className="dialog-header">
                    <div className="dialog-title">Delete material</div>
                    <button
                      className="btn is-close"
                      onClick={() => setIsShowDelete(false)}
                    >
                      <Icon className="icon" icon="mdi:close"></Icon>
                    </button>
                  </header>
                  <section className="dialog-body">
                    Are you sure to delete material "{material.node.name}"?
                  </section>
                  <footer className="dialog-footer">
                    <button
                      className="btn is-outlined"
                      onClick={() => setIsShowDelete(false)}
                    >
                      Cancel
                    </button>
                    <button className="btn is-error" onClick={confirmDelete}>
                      Delete
                    </button>
                  </footer>
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
        </td>
      </tr>
    </>
  )
}
