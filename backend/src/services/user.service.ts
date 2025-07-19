import { FastifyInstance } from 'fastify'
import { MainService } from './main.service'
import { UserNode } from '../models/user.model'

export class UserService extends MainService<UserNode> {
  static TABLE_NAME = 'users'

  /**
   * Create service
   * @param {import("fastify").FastifyInstance} fastify  Encapsulated Fastify Instance
   */
  constructor(fastify: FastifyInstance) {
    super(fastify, UserService.TABLE_NAME, ['firstname', 'lastname', 'email'])
  }
}
