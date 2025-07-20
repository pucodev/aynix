import MainModel from './main.model'

export interface ClientNode {
  id?: number
  email?: string
  name?: string
  phone?: string
  created_at?: string
  updated_at?: string
}

export default class ClientModel extends MainModel<ClientNode> {}
