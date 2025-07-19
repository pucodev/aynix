import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyReply,
  FastifyRequest,
} from 'fastify'
import { EstimateController } from '../../controllers/estimate.controller'

export function estimateRoutes(
  fastify: FastifyInstance,
  _options: FastifyPluginOptions,
) {
  /** Fetch all estimates for home view */
  fastify.get('/summary', (request: FastifyRequest, reply: FastifyReply) => {
    EstimateController.summary(
      fastify,
      request as FastifyRequest<{ Querystring: Record<string, string> }>,
      reply,
    )
  })

  /** Create empty estimate */
  fastify.post('/empty', (request: FastifyRequest, reply: FastifyReply) => {
    EstimateController.createEmpty(
      fastify,
      request as FastifyRequest<{ Querystring: Record<string, string> }>,
      reply,
    )
  })
}
