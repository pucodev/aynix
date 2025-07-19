import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios'
import MeModel from '../models/me.model'

interface BaseError {
  code?: string
  message?: string
}

type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch'

const Api = {
  async request<
    TResponse = unknown,
    TData = unknown,
    TError extends BaseError = BaseError,
  >(
    method: HttpMethod,
    url: string,
    data: TData,
  ): Promise<AxiosResponse<TResponse>> {
    const request: AxiosRequestConfig = {
      method,
      url,
      params: {},
      data: {},
    }

    if (method.toLowerCase() === 'get') {
      request.params = data
    } else {
      request.data = data
    }

    axios.defaults.headers.common['Authorization'] =
      `Bearer ${MeModel.getUserToken()}`

    try {
      const response = await axios<TResponse>(request)
      return response
    } catch (err) {
      if (axios.isAxiosError<TError>(err)) {
        // Validate error
      }

      throw err
    }
  },
}

export default Api
