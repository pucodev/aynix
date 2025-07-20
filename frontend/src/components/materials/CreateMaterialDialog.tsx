import { Icon } from '@iconify/react/dist/iconify.js'
import { useState } from 'react'
import Validate from '../../js/utils/validate'
import { showError } from '../../js/utils/utils'
import type { MaterialNode } from '../../js/models/material.model'
import MaterialModel from '../../js/models/material.model'

interface Props {
  onClose?: Function
  onSave?: (material: MaterialNode) => void
}

export default function CreateMaterialDialog({ onClose, onSave }: Props) {
  const [name, setName] = useState('')
  const [isErrorName, setIsErrorName] = useState(false)

  const [qty, setQty] = useState<number>()
  const [isErrorQty, setIsErrorQty] = useState(false)

  const [price, setPrice] = useState<number>()
  const [isErrorPrice, setIsErrorPrice] = useState(false)

  function cleanErrors() {
    setIsErrorPrice(false)
    setIsErrorQty(false)
    setIsErrorName(false)
  }

  function validate() {
    return new Validate([
      {
        value: name,
        onFailed() {
          setIsErrorName(true)
        },
        validators: {
          required: {
            message: 'material name',
          },
        },
      },
      {
        value: qty,
        onFailed() {
          setIsErrorQty(true)
        },
        validators: {
          numeric: {
            message: 'quantity',
          },
        },
      },
      {
        value: price,
        onFailed() {
          setIsErrorPrice(true)
        },
        validators: {
          numeric: {
            message: 'price',
          },
        },
      },
    ])
  }

  function close() {
    if (typeof onClose === 'function') {
      onClose()
    }
  }

  async function save() {
    cleanErrors()

    const validator = validate()
    if (!validator.isValid()) {
      showError(
        `Please review the following fields ${validator.getRawStrErrors()}`,
      )
      return
    }

    const material: MaterialNode = {
      id: crypto.randomUUID(),
      name,
      qty,
      price,
    }

    if (typeof onSave === 'function') {
      onSave(material)
    }
  }

  return (
    <>
      <div className="dialog is-active">
        <div className="dialog-bg"></div>
        <div className="dialog-card is-outlined">
          <header className="dialog-header">
            <div className="dialog-title">Add material</div>
            <button className="btn is-close" onClick={close}>
              <Icon className="icon" icon="mdi:close"></Icon>
            </button>
          </header>
          <section className="dialog-body">
            <div className="is-flex is-gap-3 is-flex-column">
              {/* NAME */}
              <div className={`field ${isErrorName ? 'is-invalid' : ''}`}>
                <label className="label">Name</label>
                <input
                  className="input"
                  type="text"
                  placeholder="Insert material name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
                {isErrorName ? <p className="help">Invalid value</p> : ''}
              </div>

              {/* EXTRA */}
              <div className="is-flex is-gap-4">
                {/* QTY */}
                <div
                  className={`field w-100 ${isErrorQty ? 'is-invalid' : ''}`}
                >
                  <label className="label">Quantity</label>
                  <input
                    className="input"
                    type="number"
                    placeholder="Insert qty"
                    value={qty}
                    onChange={e => setQty(Number(e.target.value) || undefined)}
                  />
                  {isErrorQty ? <p className="help">Invalid value</p> : ''}
                </div>

                {/* UNIT PRICE */}
                <div
                  className={`field w-100 ${isErrorPrice ? 'is-invalid' : ''}`}
                >
                  <label className="label">Price</label>
                  <input
                    className="input"
                    type="number"
                    placeholder="Insert price"
                    value={price}
                    onChange={e =>
                      setPrice(Number(e.target.value) || undefined)
                    }
                  />
                  {isErrorPrice ? <p className="help">Invalid value</p> : ''}
                </div>
              </div>

              <hr />
              <div className="is-flex is-justify-content-flex-end">
                <div className="is-flex is-gap-3 h5">
                  <div>Total:</div>{' '}
                  <div>{new MaterialModel({ qty, price }).totalPrice}</div>
                </div>
              </div>
            </div>
          </section>
          <footer className="dialog-footer">
            <button className="btn is-outlined" onClick={close}>
              Cancelar
            </button>
            <button className="btn is-success" onClick={save}>
              Guardar
            </button>
          </footer>
        </div>
      </div>
    </>
  )
}
