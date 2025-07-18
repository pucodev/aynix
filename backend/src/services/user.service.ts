import { FastifyInstance } from 'fastify'
import { MainService } from './main.service'

export class UserService extends MainService {
  static TABLE_NAME = 'users'

  /**
   * Create service
   * @param {import("fastify").FastifyInstance} fastify  Encapsulated Fastify Instance
   */
  constructor(fastify: FastifyInstance) {
    super(fastify, UserService.TABLE_NAME, ['firstname', 'lastname', 'email'])
  }
}
