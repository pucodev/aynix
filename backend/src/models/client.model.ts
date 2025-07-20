import { MainModel } from './main.model'

export interface ClientNode {
  id?: number
  name?: string
  phone?: string
  email?: string
}

export class ClientModel extends MainModel<ClientNode> {}
