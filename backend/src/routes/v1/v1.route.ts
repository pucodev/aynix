import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { authRoutes } from './auth.route'

export function v1Routes(
  fastify: FastifyInstance,
  _options: FastifyPluginOptions,
) {
  fastify.register(authRoutes, { prefix: '/auth' })
}
