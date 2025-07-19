import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { UserModel, UserNode } from '../models/user.model'
import { MainController } from './main.controller'
import { AuthService, SignupNode } from '../services/auth.service'
import z from 'zod'
import { UserService } from '../services/user.service'

export interface SignupCodeNode extends SignupNode {
  code: string
}

export class AuthController extends MainController {
  /**
   * Validate the .env code, validate the body schema, and ensure the email is unique
   * finally create user with hashed password
   */
  static async signup(
    fastify: FastifyInstance,
    request: FastifyRequest<{
      Body: SignupCodeNode
    }>,
    reply: FastifyReply,
  ) {
    if (request.body.code !== process.env.SIGNUP_CODE) {
      reply.status(403).send({
        status: 'Invalid code',
      })
    }

    // Validate
    const SignupSchema = z.object({
      password: z.string().min(6, 'Password too short'),
      email: z.email('Invalid email address'),
    })

    const result = SignupSchema.safeParse(request.body)

    if (!result.success) {
      reply.status(400).send({
        status: 'Invalid data',
      })
    }

    // Validate user is unique
    const users = await new UserService(fastify).fetch(
      ['id'],
      [{ field: 'email', logic: '=', value: request.body.email }],
    )

    if (users.length > 0) {
      reply.status(400).send({
        status: 'User already exist',
      })
    }

    request.body.password = await UserModel.hashPassword(request.body.password)
    const data = await new AuthService(fastify).signup(request.body)

    reply.send({ status: 'OK', data })
  }
}
