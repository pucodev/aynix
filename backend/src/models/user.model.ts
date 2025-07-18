import { FastifyInstance } from 'fastify'
import { UserService } from '../services/user.service'
import { MainModel } from './main.model'

export interface UserNode {
  id?: number
  firstname?: string
  lastname?: string
  email?: string
}
export class UserModel extends MainModel {
  /** @param {UserNode} node user node  */
  constructor(node: UserNode) {
    super(node)

    /** @type {UserNode} */
    this.node = node
  }

  /**
   * @param {import("fastify").FastifyInstance} fastify  Encapsulated Fastify Instance
   * @returns {Promise<UserModel>} update node and return model
   */
  async insert(fastify: FastifyInstance): Promise<UserModel> {
    const service = new UserService(fastify)
    const item = await super._insert(service)
    this.node = item
    return this
  }

  /**
   * @param {import("fastify").FastifyInstance} fastify  Encapsulated Fastify Instance
   * @returns {Promise<UserModel>} update node and return model
   */
  async update(fastify: FastifyInstance): Promise<UserModel> {
    const service = new UserService(fastify)
    const item = await super._update(service)
    this.node = item
    return this
  }
}
