export default class MainModel<T> {
  protected _node: T

  constructor(node: T) {
    this._node = node
  }
}
