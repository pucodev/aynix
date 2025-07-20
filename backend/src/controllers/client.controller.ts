import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { MainController } from './main.controller'
import { EstimateService } from '../services/estimate.service'
import { ClientService } from '../services/client.service'
import { ClientNode } from '../models/client.model'

export class ClientController extends MainController {
  /** fetch all clients */
  static async fetch(
    fastify: FastifyInstance,
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    try {
      const service = new ClientService(fastify)
      if (request.auth_user?.user_id) {
        const data = await service.fetchMany(request.auth_user.user_id)
        return reply.send({ data })
      }

      return reply.status(403).send({})
    } catch (error) {
      console.error('error ', error)
      return reply.status(500).send({
        status: 'Server error',
      })
    }
  }

  /** Create client */
  static async create(
    fastify: FastifyInstance,
    request: FastifyRequest<{ Body: ClientNode }>,
    reply: FastifyReply,
  ) {
    try {
      const service = new ClientService(fastify)
      if (request.auth_user?.user_id) {
        const data = await service.create(
          request.auth_user.user_id,
          request.body,
        )
        console.log('data = ', data)
        return reply.send({ data })
      }

      return reply.status(403).send({})
    } catch (error) {
      console.error('error ', error)
      return reply.status(500).send({
        status: 'Server error',
      })
    }
  }
}
