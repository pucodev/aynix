import MainModel from './main.model'

export interface EstimateNode {
  id?: number
  labor_cost?: number
  description?: string
  total_cost?: number
}

export default class EstimateModel extends MainModel<EstimateNode> {
  get totalCost() {
    return `$ ${this.node.total_cost} USD`
  }
}
