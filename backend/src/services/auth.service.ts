import format from 'pg-format'
import { FastifyInstance } from 'fastify'
import { PoolClient, QueryResult } from 'pg'
import { UserNode } from '../models/user.model'

export interface SignupNode {
  email: string
  password: string
}

export interface SigninNode {
  email: string
  password: string
}

export class AuthService {
  private _fastify: FastifyInstance

  constructor(fastify: FastifyInstance) {
    this._fastify = fastify
  }

  private async connect(): Promise<PoolClient> {
    return this._fastify.pg.connect()
  }

  public async signup(data: SignupNode): Promise<UserNode> {
    const client = await this.connect()

    try {
      const sql = format(
        'INSERT INTO %I (%I) VALUES (%s) RETURNING *',
        'users',
        ['email', 'password'],
        ['$1', '$2'],
      )

      const result: QueryResult<UserNode> = await client.query(sql, [
        data.email,
        data.password,
      ])

      if (Array.isArray(result.rows)) {
        return result.rows[0]
      }

      return result.rows
    } finally {
      client.release()
    }
  }
}
