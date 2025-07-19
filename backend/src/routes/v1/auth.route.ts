import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyReply,
  FastifyRequest,
} from 'fastify'
import {
  AuthController,
  SignupCodeNode,
} from '../../controllers/auth.controller'

export function authRoutes(
  fastify: FastifyInstance,
  _options: FastifyPluginOptions,
) {
  fastify.post('/signup', (request: FastifyRequest, reply: FastifyReply) => {
    AuthController.signup(
      fastify,
      request as FastifyRequest<{ Body: SignupCodeNode }>,
      reply,
    )
  })
}
