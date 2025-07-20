import { MainModel } from './main.model'

export interface ClientNode {
  id?: number
  name?: string
  phone?: string
  email?: string
  user_id?: number
}

export class ClientModel extends MainModel<ClientNode> {}
