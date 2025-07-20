import { MainModel } from './main.model'

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

export class EstimateModel extends MainModel<EstimateNode> {
  get totalCostMaterial() {
    if (Array.isArray(this.node.materials)) {
      return this.node.materials.reduce(
        (sum, item) => sum + Number(item.price || 0) * Number(item.qty || 0),
        0,
      )
    }

    return 0
  }
  get totalCost() {
    let totalCost = Number(this.node.labor_cost) || 0

    if (Array.isArray(this.node.materials)) {
      totalCost += this.totalCostMaterial
    }

    return totalCost
  }
}
