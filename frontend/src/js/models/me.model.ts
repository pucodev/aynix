import Api from '../api'
import { urls } from '../api/urls'
import UserModel from './user.model'

export interface UserTokens {
  access_token: string
  refresh_token: string
}

const USER_TOKEN_TAG = '_ut'

export default class MeModel extends UserModel {
  public static getUserToken() {
    return ''
  }

  public static getRefreshToken() {
    return ''
  }

  public static async signup(data: {
    email: string
    password: string
    code: string
  }) {
    const response = await Api.request<{
      data: { email: string; tokens: UserTokens }
    }>('post', urls.SIGN.SIGNUP, data)
    return response.data.data
  }

  public static saveTokens(tokens: UserTokens) {
    localStorage.setItem(USER_TOKEN_TAG, JSON.stringify(tokens))
  }

  public static getTokens(): UserTokens | undefined {
    const stringTokens = localStorage.getItem(USER_TOKEN_TAG) || ''
    try {
      return JSON.parse(stringTokens) as UserTokens
    } catch (error) {
      return
    }
  }

  public static isAuthenticated(): boolean {
    const tokens = this.getTokens()

    return Boolean(tokens && tokens?.access_token)
  }
}
