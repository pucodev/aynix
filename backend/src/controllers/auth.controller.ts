import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { UserModel, UserNode } from '../models/user.model'
import { MainController } from './main.controller'
import { AuthService, SigninNode, SignupNode } from '../services/auth.service'
import z from 'zod'
import { UserService } from '../services/user.service'
import bcrypt from 'bcrypt'

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
      return reply.status(403).send({
        status: 'Invalid code',
        error_code: 'AUTH_SIGNUP_INVALID_CODE',
      })
    }

    // Validate
    const SignupSchema = z.object({
      password: z.string().min(6, 'Password too short'),
      email: z.email('Invalid email address'),
    })

    const result = SignupSchema.safeParse(request.body)

    if (!result.success) {
      return reply.status(400).send({
        status: 'Invalid data',
        error_code: 'AUTH_SIGNUP_INVALID_DATA',
      })
    }

    // Validate user is unique
    const users = await new UserService(fastify).fetch(
      ['id'],
      [{ field: 'email', logic: '=', value: request.body.email }],
    )

    if (users.length > 0) {
      return reply.status(400).send({
        status: 'User already exist',
        error_code: 'AUTH_SIGNUP_USER_ALREADY_EXISTS',
      })
    }

    request.body.password = await UserModel.hashPassword(request.body.password)
    const data = await new AuthService(fastify).signup(request.body)

    return reply.send({
      status: 'OK',
      data: {
        email: data.email,
        tokens: new UserModel(data).getTokens(),
      },
    })
  }

  static async signin(
    fastify: FastifyInstance,
    request: FastifyRequest<{
      Body: SigninNode
    }>,
    reply: FastifyReply,
  ) {
    const users = await new UserService(fastify).fetch(
      [],
      [{ field: 'email', logic: '=', value: request.body.email }],
    )

    if (users.length <= 0) {
      return reply.status(403).send({
        status: 'Unauthorized user',
        error_code: 'AUTH_SIGNIN_UNAUTHORIZED',
      })
    }

    const user = users[0]

    const isPasswordValid = await bcrypt.compare(
      request.body.password,
      user.password || '',
    )
    if (!isPasswordValid) {
      return reply.status(403).send({
        status: 'Unauthorized user',
        error_code: 'AUTH_SIGNIN_UNAUTHORIZED',
      })
    }

    return reply.send({
      data: {
        tokens: new UserModel(user).getTokens(),
      },
    })
  }
}
