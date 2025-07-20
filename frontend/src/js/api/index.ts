import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
} from 'axios'
import MeModel from '../models/me.model'

interface BaseError {
  code?: string
  message?: string
  error_code?: string
}

interface ApiError extends AxiosError<BaseError> {
  api_error_code?: string
}

type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch'

export function isApiError(error: unknown): error is ApiError {
  return (
    axios.isAxiosError(error) &&
    typeof error.response?.data === 'object' &&
    error.response?.data !== null &&
    'error_code' in error.response.data
  )
}

const Api = {
  async request<
    TResponse = unknown,
    TData = unknown,
    TError extends BaseError = BaseError,
  >(
    method: HttpMethod,
    url: string,
    data?: TData,
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

      if (isApiError(err)) {
        err.api_error_code = err?.response?.data?.error_code
      }

      throw err
    }
  },
}

export default Api
