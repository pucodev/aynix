import { FastifyReply, FastifyRequest } from 'fastify'
import jwt from 'jsonwebtoken'
import { DecodedToken } from '../models/user.model'

export default function auth(request: FastifyRequest, reply: FastifyReply) {
  const token = request.headers.authorization?.split(' ')[1]

  if (!token) {
    return reply.status(401).send({
      status: 'Invalid code',
      error_code: 'AUTH_TOKEN_UNAUTHORIZED',
    })
  }

  const key = process.env.JWT_SECRET || ''
  try {
    const data = jwt.verify(token, key) as DecodedToken
    request.auth_user = data
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'name' in error) {
      const err = error as { name: string }

      if (err.name === 'TokenExpiredError') {
        return reply.status(403).send({
          status: 'Token expired',
          error_code: 'AUTH_TOKEN_EXPIRED',
        })
      }

      if (err.name === 'JsonWebTokenError') {
        return reply.status(403).send({
          status: 'Invalid code',
          error_code: 'AUTH_TOKEN_ERROR',
        })
      }
    }

    return reply.status(500).send({
      status: 'Unkown error',
      error_code: 'AUTH_TOKEN_UNKNOWN',
    })
  }
}
