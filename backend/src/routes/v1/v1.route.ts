import { FastifyInstance } from 'fastify'
import { userRoutes } from './user.route'

/**
 * Routes
 * @param {import("fastify").FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {object} _options plugin options, refer to https://fastify.dev/docs/latest/Reference/Plugins/#plugin-options
 */
export function v1Routes(fastify: FastifyInstance, _options: any) {
  fastify.register(userRoutes, { prefix: '/users' })
}
