import MainModel from './main.model'

export interface MaterialNode {
  id?: string
  name?: string
  qty?: number
  price?: number
}

export interface EstimateNode {
  id?: number
  description?: string
  user_id?: number
  client_id?: number
  estimate_status_id?: number
  materials?: MaterialNode[]
  labor_cost?: number
  total_cost?: number
  materials_total?: number
}

export default class EstimateModel extends MainModel<EstimateNode> {
  get id() {
    return this.node.id
  }

  get totalCost() {
    if (this.node.total_cost) {
      return `$ ${this.node.total_cost || '-'} USD`
    }

    return '-'
  }
}
