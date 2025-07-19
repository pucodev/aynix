import { MainService } from '../services/main.service'

export class MainModel<T> {
  node: T
  /**
   * Create model
   * @param {object} node model node
   */
  constructor(node: T) {
    this.node = node
  }

  /**
   * @param {MainService} service model service
   * @returns {Promise<object>} model node
   */
  async _insert(service: MainService): Promise<any> {
    const item = await service.insert(this.node)
    return item
  }

  /**
   * @param {MainService} service model service
   * @returns {Promise<object>} model node
   */
  async _update(service: MainService): Promise<any> {
    const item = await service.update(this.node.id, this.node)
    return item
  }
}
