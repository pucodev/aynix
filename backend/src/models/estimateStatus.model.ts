import { MainModel } from './main.model'

export interface EstimateStatusNode {
  id?: number
  name?: string
  color?: string
}

export interface DecodedToken {
  user_id: number
}

export class EstimateStatusModel extends MainModel<EstimateStatusNode> {
  public static INITIALIZED_STATUS_ID = 1
}
