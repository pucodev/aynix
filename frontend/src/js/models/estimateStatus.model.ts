import MainModel from './main.model'

export interface EstimateStatusNode {
  id?: number
  name?: string
  color?: string
}

export default class EstimateStatusModel extends MainModel<EstimateStatusNode> {
  public static INITIALIZED_STATUS_ID = 1
  public static PENDING_STATUS_ID = 2
  public static COMPLETED_STATUS_ID = 3
}
