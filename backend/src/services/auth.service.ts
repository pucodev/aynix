import format from 'pg-format'
import fastify, { FastifyInstance } from 'fastify'
import { UserService } from './user.service'

export interface SignupNode {
  email: string
  password: string
}

export class AuthService {
  _fastify: FastifyInstance

  constructor(fastify: FastifyInstance) {
    this._fastify = fastify
  }

  async connect() {
    return await this._fastify.pg.connect()
  }

  public async signup(data: SignupNode) {
    const client = await this.connect()

    const sql = format(
      'INSERT INTO %I (%I) VALUES (%s) RETURNING *',
      'users',
      ['email', 'password'],
      ['$1', '$2'],
    )

    const { rows } = await client.query(sql, [data.email, data.password])

    if (Array.isArray(rows)) {
      return rows[0]
    }

    return rows
  }
}
