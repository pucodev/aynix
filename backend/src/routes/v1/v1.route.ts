import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyReply,
  FastifyRequest,
} from 'fastify'
import { authRoutes } from './auth.route'
import { estimateRoutes } from './estimate.route'
import auth from '../../hooks/authenticate'

async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  await auth(request, reply)
}

export function v1Routes(
  fastify: FastifyInstance,
  _options: FastifyPluginOptions,
) {
  fastify.register(authRoutes, { prefix: '/auth' })

  // authenticate routes
  fastify.register(async instance => {
    instance.addHook('preHandler', authenticate)
    instance.register(estimateRoutes, {
      prefix: '/estimates',
    })
  })
}
