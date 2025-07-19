import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { UserModel, UserNode } from '../models/user.model'
import { UserService } from '../services/user.service'
import { MainController } from './main.controller'

export class UserController extends MainController {
  /**
   * @param {import("fastify").FastifyInstance} fastify  Encapsulated Fastify Instance
   * @param {import('fastify').FastifyRequest<{ Querystring: Record<string, string> }>} request fastify request
   * @param {import('fastify').FastifyReply} reply fastify reply
   */
  static async fetch(
    fastify: FastifyInstance,
    request: FastifyRequest<{ Querystring: Record<string, string> }>,
    reply: FastifyReply,
  ) {
    try {
      const params = MainController.getQueryParams(request.query)

      const service = new UserService(fastify)
      const items = await service.fetch(params.fields, params.filters)
      return reply.send({
        data: items,
      })
    } catch (error) {
      console.error('error ', error)
      return reply.status(500).send({
        status: 'Server error',
      })
    }
  }

  /**
   * @param {import("fastify").FastifyInstance} fastify  Encapsulated Fastify Instance
   * @param {import('fastify').FastifyRequest<{Body: import('../models/user.model.js').UserNode}>} request fastify request
   * @param {import('fastify').FastifyReply} reply fastify reply
   */
  static async insert(
    fastify: FastifyInstance,
    request: FastifyRequest<{ Body: UserNode }>,
    reply: FastifyReply,
  ) {
    try {
      const user = new UserModel(request.body)
      await user.insert(fastify)
      return reply.send(user.node)
    } catch (error) {
      console.error('error ', error)
      return reply.status(500).send({
        status: 'Server error',
      })
    }
  }

  /**
   * @param {import("fastify").FastifyInstance} fastify  Encapsulated Fastify Instance
   * @param {import('fastify').FastifyRequest<{Params: {id: number}, Body: import('../models/user.model.js').UserNode}>} request fastify request
   * @param {import('fastify').FastifyReply} reply fastify reply
   */
  static async update(
    fastify: FastifyInstance,
    request: FastifyRequest<{ Params: { id: number }; Body: UserNode }>,
    reply: FastifyReply,
  ) {
    try {
      /** @type {import('../models/user.model.js').UserNode} */
      const data: UserNode = { ...request.body }
      data.id = request.params.id

      // Validate data if is neccesary
      // if (request.body.email) {
      //   data.email = request.body.email
      // }

      const user = new UserModel(data)
      await user.update(fastify)
      return reply.send(user.node)
    } catch (error) {
      console.error('error ', error)
      return reply.status(500).send({
        status: 'Server error',
      })
    }
  }
}
