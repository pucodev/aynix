import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyReply,
  FastifyRequest,
} from 'fastify'
import { EstimateController } from '../../controllers/estimate.controller'
import { EstimateNode } from '../../models/estimate.model'

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

  /** Fetch estimate */
  fastify.get(
    '/:id',
    (
      request: FastifyRequest<{ Params: { id: number } }>,
      reply: FastifyReply,
    ) => {
      EstimateController.fetch(fastify, request, reply)
    },
  )

  /** Create empty estimate */
  fastify.post('/empty', (request: FastifyRequest, reply: FastifyReply) => {
    EstimateController.createEmpty(
      fastify,
      request as FastifyRequest<{ Querystring: Record<string, string> }>,
      reply,
    )
  })

  /** Update estimate */
  fastify.patch(
    '/:id',
    (
      request: FastifyRequest<{ Params: { id: number }; Body: EstimateNode }>,
      reply: FastifyReply,
    ) => {
      EstimateController.update(fastify, request, reply)
    },
  )
}
