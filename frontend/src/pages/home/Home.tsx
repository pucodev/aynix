import { useEffect, useState } from 'react'
import EstimateModel, {
  type EstimateNode,
} from '../../js/models/estimate.model'
import SearchLoader from '../../components/loader/SearchLoader'
import Api from '../../js/api'
import { urls } from '../../js/api/urls'
import EstimateStatusModel from '../../js/models/estimateStatus.model'
import ClientModel from '../../js/models/client.model'
import AlertLoader from '../../components/loader/AlertLoader'
import { useNavigate } from 'react-router-dom'
import { Icon } from '@iconify/react/dist/iconify.js'

interface ResponseNode {
  id: number
  total_cost: number
  client: {
    id: number
    name: string
  }
  estimate_status: {
    id: number
    name: string
    color: string
  }
}

interface ListItem {
  estimate: EstimateModel
  estimateStatus: EstimateStatusModel
  client: ClientModel
}

export default function Home() {
  const [estimates, setEstimates] = useState<ListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreatingEstimate, setIsCreatingEstimate] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchEstimates()
  }, [])

  async function fetchEstimates() {
    setIsLoading(true)
    const response = await Api.request<{ data: ResponseNode[] }>(
      'get',
      urls.ESTIMATES.SUMMARY,
    )
    const items: ListItem[] = []
    response.data.data.forEach(item => {
      items.push({
        estimate: new EstimateModel({
          id: item.id,
          total_cost: item.total_cost,
        }),
        estimateStatus: new EstimateStatusModel({
          id: item.estimate_status.id,
          name: item.estimate_status.name,
          color: item.estimate_status.color,
        }),

        client: new ClientModel({
          id: item.client.id,
          name: item.client.name,
        }),
      })
    })
    setEstimates(items)
    setIsLoading(false)
  }

  async function createEstimate() {
    setIsCreatingEstimate(true)
    const response = await Api.request<{ data: EstimateNode }>(
      'post',
      urls.ESTIMATES.CREATE_EMPTY,
    )

    navigate(`/estimates/${response.data.data.id}`)

    setIsCreatingEstimate(false)
  }

  return (
    <>
      <div className="is-flex is-justify-content-flex-end">
        <button className="btn is-primary" onClick={createEstimate}>
          <Icon className="icon" icon="mdi:plus"></Icon>
          <span>Add</span>
        </button>
      </div>

      {/* CREATING ESTIMATION */}
      {isCreatingEstimate ? (
        <AlertLoader message="Creating empty estimate" />
      ) : (
        <></>
      )}

      {isLoading ? (
        <SearchLoader />
      ) : (
        <div className="is-flex is-flex-column is-gap-4 mt-5">
          {estimates.map(item => (
            <div className="card" key={item.estimate.node.id}>
              <div className="card-body">
                <div className="is-flex is-justify-content-space-between">
                  <div className="card-title">
                    Estimate #{item.estimate.node.id}
                  </div>
                  <span
                    className="badge"
                    style={
                      {
                        '--pui-badge-bg': item.estimateStatus.node.color,
                      } as React.CSSProperties
                    }
                  >
                    {item.estimateStatus.node.name}
                  </span>
                </div>
                <div className="is-flex is-justify-content-space-between mt-3">
                  <div>Cliente: {item.client.node.name || '-'}</div>
                  <div className="h5">{item.estimate.totalCost}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
