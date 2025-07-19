import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { MainController } from './main.controller'
import { EstimateService } from '../services/estimate.service'

export class EstimateController extends MainController {
  /** fetch estimatios for home view */
  static async summary(
    fastify: FastifyInstance,
    request: FastifyRequest<{ Querystring: Record<string, string> }>,
    reply: FastifyReply,
  ) {
    try {
      const service = new EstimateService(fastify)
      if (request.auth_user?.user_id) {
        const data = await service.summary(request.auth_user?.user_id)
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

  /** Create empty estimation */
  static async createEmpty(
    fastify: FastifyInstance,
    request: FastifyRequest<{ Querystring: Record<string, string> }>,
    reply: FastifyReply,
  ) {
    try {
      const service = new EstimateService(fastify)
      if (request.auth_user?.user_id) {
        const data = await service.createEmpty(request.auth_user?.user_id)
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
