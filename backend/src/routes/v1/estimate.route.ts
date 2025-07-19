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
  fastify.get('/summary', (request: FastifyRequest, reply: FastifyReply) => {
    EstimateController.summary(
      fastify,
      request as FastifyRequest<{ Querystring: Record<string, string> }>,
      reply,
    )
  })
}
