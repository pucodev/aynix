import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { UserController } from '../../controllers/user.controller'
import { UserNode } from '../../models/user.model'

/**
 * Routes
 * @param {import("fastify").FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {object} _options plugin options
 */
export function userRoutes(fastify: FastifyInstance, _options: any) {
  fastify.get('/', (request: FastifyRequest, reply: FastifyReply) => {
    UserController.fetch(fastify, request as FastifyRequest<{ Querystring: Record<string, string> }>, reply)
  })

  fastify.post('/', (request: FastifyRequest, reply: FastifyReply) => {
    UserController.insert(fastify, request as FastifyRequest<{ Body: UserNode }>, reply)
  })

  fastify.patch('/:id', (request: FastifyRequest, reply: FastifyReply) => {
    UserController.update(fastify, request as FastifyRequest<{ Params: { id: number }; Body: UserNode }>, reply)
  })
}
