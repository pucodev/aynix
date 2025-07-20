import { useEffect, useState } from 'react'
import Loader from '../../components/loader/Loader'
import Api from '../../js/api'
import { urls } from '../../js/api/urls'
import { useParams } from 'react-router-dom'
import type { EstimateNode } from '../../js/models/estimate.model'
import EstimateModel from '../../js/models/estimate.model'
import type { ClientNode } from '../../js/models/client.model'
import ClientModel from '../../js/models/client.model'
import { Icon } from '@iconify/react/dist/iconify.js'

export default function EditEstimate() {
  const [isLoading, setIsLoading] = useState(true)
  const [estimate, setEstimate] = useState(new EstimateModel({}))
  const [clients, setClients] = useState<ClientModel[]>([])
  const [isClientError, setIsClientError] = useState(false)
  const { id } = useParams<{ id: string }>()

  async function fetchClients() {
    const response = await Api.request<{ data: ClientNode[] }>(
      'get',
      urls.CLIENTS.ROOT,
    )
    setClients(response.data.data.map(item => new ClientModel(item)))
  }

  async function init() {
    setIsLoading(true)
    let response

    // Fetch estimate
    response = await Api.request<{ data: EstimateNode }>(
      'get',
      `${urls.ESTIMATES.ROOT}/${id}`,
    )
    setEstimate(new EstimateModel(response.data.data))

    // Fetch clients
    fetchClients()

    setIsLoading(false)
  }

  useEffect(() => {
    init()
  }, [])

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <h1>Estimate #{estimate.id}</h1>

          {/* CLIENTS */}
          <div>
            <div className="mb-1">
              <label className="label mb-2">Client: </label>
            </div>
            <div className="is-flex is-gap-5">
              {/* FIELD */}
              <div
                className={`field w-100 ${isClientError ? 'is-invalid' : ''}`}
                style={{ maxWidth: '320px' }}
              >
                <select className="select">
                  <option>Select value</option>
                  {clients.map(client => (
                    <option key={client.node.id} value={client.node.id}>
                      {client.node.name}
                    </option>
                  ))}
                </select>
                {isClientError ? <p className="help">Help message</p> : ''}
              </div>

              {/* BUTTONS */}
              <div className="is-flex is-gap-3 is-align-items-center">
                <button className="btn is-tonal is-primary" title="Add client">
                  <Icon className="icon" icon="mdi:plus-thick"></Icon>
                </button>
                <button
                  className="btn is-tonal is-primary"
                  title="Refresh clients"
                  onClick={fetchClients}
                >
                  <Icon className="icon" icon="mdi:sync"></Icon>
                </button>
              </div>
            </div>
          </div>
          <ul></ul>
        </>
      )}
    </>
  )
}
