import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyReply,
  FastifyRequest,
} from 'fastify'
import { ClientController } from '../../controllers/client.controller'

export function clientRoutes(
  fastify: FastifyInstance,
  _options: FastifyPluginOptions,
) {
  /** Fetch all clients */
  fastify.get('/', (request: FastifyRequest, reply: FastifyReply) => {
    ClientController.fetch(fastify, request, reply)
  })

  /** Create client */
  fastify.post('/', (request: FastifyRequest, reply: FastifyReply) => {
    ClientController.create(fastify, request, reply)
  })
}
