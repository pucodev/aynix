import Api from '../api'
import { urls } from '../api/urls'
import UserModel from './user.model'

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
    const response = await Api.request<{ data: { token: string } }>(
      'post',
      urls.SIGN.SIGNUP,
      data,
    )
    return response.data.data
  }
}
