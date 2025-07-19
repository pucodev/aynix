import { useEffect, useState } from 'react'
import Loader from '../../components/loader/Loader'
import Api from '../../js/api'
import { urls } from '../../js/api/urls'
import { useParams } from 'react-router-dom'
import type { EstimateNode } from '../../js/models/estimate.model'
import EstimateModel from '../../js/models/estimate.model'

export default function EditEstimate() {
  const [isLoading, setIsLoading] = useState(true)
  const [estimate, setEstimate] = useState(new EstimateModel({}))
  const { id } = useParams<{ id: string }>()

  async function fetch() {
    setIsLoading(true)
    const response = await Api.request<{ data: EstimateNode }>(
      'get',
      `${urls.ESTIMATES.ROOT}/${id}`,
    )
    setEstimate(new EstimateModel(response.data.data))
    setIsLoading(false)
  }

  useEffect(() => {
    fetch()
  }, [])

  return <>{isLoading ? <Loader /> : <h1>Hola {estimate.id}</h1>}</>
}
