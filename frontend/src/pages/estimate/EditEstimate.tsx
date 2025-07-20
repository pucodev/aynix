import { useEffect, useState } from 'react'
import Loader from '../../components/loader/Loader'
import Api from '../../js/api'
import { urls } from '../../js/api/urls'
import { useNavigate, useParams } from 'react-router-dom'
import type { EstimateNode } from '../../js/models/estimate.model'
import EstimateModel from '../../js/models/estimate.model'
import type { ClientNode } from '../../js/models/client.model'
import ClientModel from '../../js/models/client.model'
import { Icon } from '@iconify/react/dist/iconify.js'
import CreateClientDialog from '../../components/client/CreateClientDialog'
import SimpleLoader from '../../components/loader/SimpleLoader'
import CreateMaterialDialog from '../../components/materials/CreateMaterialDialog'
import type { MaterialNode } from '../../js/models/material.model'
import MaterialModel from '../../js/models/material.model'
import { formatCurrency, showError } from '../../js/utils/utils'
import MaterialRow from '../../components/editEstimates/MaterialRow'
import EstimateStatusModel from '../../js/models/estimateStatus.model'
import { isAxiosError } from 'axios'

export default function EditEstimate() {
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingClients, setIsLoadingClients] = useState(false)
  const [estimate, setEstimate] = useState(new EstimateModel({}))
  const [clients, setClients] = useState<ClientModel[]>([])
  const [isClientError, setIsClientError] = useState(false)
  const { id } = useParams<{ id: string }>()
  const [isCreateClient, setIsCreateClient] = useState(false)
  const [selectedClientId, setSelectedClientId] = useState<number>()
  const [description, setDescription] = useState('')
  const [isCreateMaterial, setIsCreateMaterial] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [laborCost, setLaborCost] = useState<number>()
  const navigate = useNavigate()

  const [materials, setMaterials] = useState<MaterialModel[]>([])

  async function fetchClients() {
    setIsLoadingClients(true)
    const response = await Api.request<{ data: ClientNode[] }>(
      'get',
      urls.CLIENTS.ROOT,
    )
    setClients(response.data.data.map(item => new ClientModel(item)))
    setIsLoadingClients(false)
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

  function saveClient(client: ClientNode) {
    setIsCreateClient(false)
    fetchClients()
    setSelectedClientId(client.id)
  }

  function saveMaterial(material: MaterialNode) {
    setIsCreateMaterial(false)
    setMaterials(prev => [...prev, new MaterialModel(material)])
  }

  function deleteMaterial(index: number) {
    setMaterials(prev => prev.filter((_, i) => i !== index))
  }

  function computeTotal() {
    if (materials.length > 0) {
      return formatCurrency(
        materials.reduce(
          (sum, item) => sum + (item.node.price || 0) * (item.node.qty || 0),
          0,
        ),
      )
    }
  }

  async function saveEstimate(status: number) {
    setIsSubmitting(true)
    const data: EstimateNode = {
      description,
      client_id: selectedClientId,
      materials: materials.map(material => material.getApiData()),
      labor_cost: laborCost,
      estimate_status_id: status,
    }

    try {
      await Api.request('patch', `${urls.ESTIMATES.ROOT}/${id}`, data)

      navigate('/')
    } catch (error) {
      console.log('is error ', isAxiosError(error))
      if (isAxiosError(error)) {
        showError(error.response?.data?.message || '')
      } else {
        showError('An unexpected error occurred. Please try again later')
      }
    }

    setIsSubmitting(false)
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
          <div className="is-flex is-flex-column is-gap-3 pb-5">
            <h1>Estimate #{estimate.id}</h1>
            <div className="is-flex is-flex-column is-gap-3">
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
                    {isLoadingClients ? (
                      <SimpleLoader />
                    ) : (
                      <select
                        className="select"
                        value={selectedClientId}
                        onChange={e =>
                          setSelectedClientId(Number(e.target.value))
                        }
                      >
                        <option>Select value</option>
                        {clients.map(client => (
                          <option key={client.node.id} value={client.node.id}>
                            {client.node.name}
                          </option>
                        ))}
                      </select>
                    )}
                    {isClientError ? <p className="help">Help message</p> : ''}
                  </div>

                  {/* BUTTONS */}
                  <div className="is-flex is-gap-3 is-align-items-center">
                    <button
                      className="btn is-tonal is-primary"
                      title="Add client"
                      onClick={() => {
                        setIsCreateClient(true)
                      }}
                    >
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

                {isCreateClient ? (
                  <CreateClientDialog
                    onClose={() => {
                      setIsCreateClient(false)
                    }}
                    onSave={saveClient}
                  />
                ) : (
                  <></>
                )}
              </div>

              {/* DESCRIPTION */}
              <div className="field">
                <label className="label">Description</label>
                <textarea
                  rows={4}
                  className="input"
                  placeholder="Text input"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                ></textarea>
              </div>

              {/* MATERIALS */}
              {isCreateMaterial ? (
                <CreateMaterialDialog
                  onClose={() => setIsCreateMaterial(false)}
                  onSave={saveMaterial}
                />
              ) : (
                <></>
              )}
              <div className="w-100 is-flex is-flex-column is-gap-3">
                <h4>Materials</h4>
                {materials.length > 0 ? (
                  <table className="table is-striped is-hoverable is-table-color-primary is-fullwidth">
                    <tbody>
                      <tr>
                        <th>Material</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Total price</th>
                        <th></th>
                      </tr>
                      {materials.map((material, index) => (
                        <MaterialRow
                          key={material.node.id}
                          material={material}
                          onDelete={() => deleteMaterial(index)}
                        />
                      ))}
                      <tr className="is-font-bold h5">
                        <td colSpan={3} className="is-text-right">
                          TOTAL
                        </td>
                        <td>{computeTotal()}</td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                ) : (
                  <></>
                )}
                <button
                  className="btn is-outlined"
                  style={{
                    borderStyle: 'dashed',
                    borderWidth: '2px',
                    width: '100%',
                  }}
                  onClick={() => {
                    setIsCreateMaterial(true)
                  }}
                >
                  Add material
                </button>
              </div>

              {/* LABOR COST */}
              <div className="field mt-3">
                <label className="label">Labor cost</label>
                <input
                  className="input"
                  placeholder="Insert labor cost"
                  type="number"
                  value={laborCost}
                  onChange={e =>
                    setLaborCost(Number(e.target.value) || undefined)
                  }
                />
              </div>
            </div>

            {/* SAVE */}
            <div className="is-flex is-justify-content-flex-end mt-4 is-gap-4">
              {isSubmitting ? (
                <SimpleLoader />
              ) : (
                <>
                  <button
                    className="btn"
                    onClick={() =>
                      saveEstimate(EstimateStatusModel.PENDING_STATUS_ID)
                    }
                  >
                    Save as Pending
                  </button>
                  <button
                    className="btn is-success"
                    onClick={() =>
                      saveEstimate(EstimateStatusModel.COMPLETED_STATUS_ID)
                    }
                  >
                    Save as Complete
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  )
}
