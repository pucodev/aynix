import { Icon } from '@iconify/react/dist/iconify.js'
import { useState } from 'react'
import Validate from '../../js/utils/validate'
import { showError } from '../../js/utils/utils'
import Api from '../../js/api'
import { urls } from '../../js/api/urls'
import type { ClientNode } from '../../js/models/client.model'

interface Props {
  onClose?: Function
  onSave?: Function
}

export default function CreateClientDialog({ onClose, onSave }: Props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [_isSubmitting, setIsSubmitting] = useState(false)

  const [isErrorName, setIsErrorName] = useState(false)
  const [isErrorEmail, setIsErrorEmail] = useState(false)
  const [isErrorPhone, setIsErrorPhone] = useState(false)

  function cleanErrors() {
    setIsErrorName(false)
    setIsErrorEmail(false)
    setIsErrorPhone(false)
  }

  function validate() {
    cleanErrors()
    return new Validate([
      {
        value: email,
        onFailed() {
          setIsErrorEmail(true)
        },
        validators: {
          email: {
            message: 'Email',
          },
        },
      },
      {
        value: name,
        onFailed() {
          setIsErrorName(true)
        },
        validators: {
          required: {
            message: 'Fullname',
          },
        },
      },
    ])
  }

  async function save() {
    const validator = validate()
    if (!validator.isValid()) {
      showError(
        `Please review the following fields ${validator.getRawStrErrors()}`,
      )
      return
    }

    setIsSubmitting(true)
    const response = await Api.request<{ data: ClientNode }>(
      'post',
      urls.CLIENTS.ROOT,
      {
        name,
        email,
        phone,
      },
    )
    if (typeof onSave === 'function') {
      onSave(response.data.data)
    }
    setIsSubmitting(false)
  }

  function close() {
    if (typeof onClose === 'function') {
      onClose()
    }
  }

  return (
    <>
      <div className="dialog is-active">
        <div className="dialog-bg"></div>
        <div className="dialog-card is-outlined">
          <header className="dialog-header">
            <div className="dialog-title">Add client</div>
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
                  placeholder="Insert fullname"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
                {isErrorName ? <p className="help">Invalid value</p> : ''}
              </div>

              {/* PHONE */}
              <div className={`field ${isErrorEmail ? 'is-invalid' : ''}`}>
                <label className="label">Email</label>
                <input
                  className="input"
                  type="text"
                  placeholder="Insert email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
                {isErrorEmail ? <p className="help">Invalid value</p> : ''}
              </div>

              {/* EMAIL */}
              <div className={`field ${isErrorPhone ? 'is-invalid' : ''}`}>
                <label className="label">Phone</label>
                <input
                  className="input"
                  type="text"
                  placeholder="Insert phone"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                />
                {isErrorPhone ? <p className="help">Invalid value</p> : ''}
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
