import MainModel from './main.model'

export interface EstimateStatusNode {
  id?: number
  name?: string
  color?: string
}

export default class EstimateStatusModel extends MainModel<EstimateStatusNode> {}
