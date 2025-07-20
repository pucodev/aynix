import { formatCurrency } from '../utils/utils'
import MainModel from './main.model'

export interface MaterialNode {
  id?: string
  name?: string
  qty?: number
  price?: number
}

export default class MaterialModel extends MainModel<MaterialNode> {
  get priceLabeled() {
    if (this.node.price) {
      return formatCurrency(this.node.price)
    }

    return '-'
  }

  get totalPrice() {
    if (this.node.price && this.node.qty) {
      return formatCurrency(this.node.price * this.node.qty)
    }

    return '-'
  }

  getApiData() {
    return {
      qty: this.node.qty,
      name: this.node.name,
      price: this.node.price,
    }
  }
}
