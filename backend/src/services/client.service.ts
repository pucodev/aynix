import { FastifyInstance } from 'fastify'
import { MainService } from './main.service'
import { ClientNode } from '../models/client.model'
import { QueryResult } from 'pg'

export class ClientService extends MainService<ClientNode> {
  static TABLE_NAME = 'clients'

  constructor(fastify: FastifyInstance) {
    super(fastify, ClientService.TABLE_NAME, [
      'name',
      'phone',
      'user_id',
      'email',
    ])
  }

  /**
   * List clients
   */
  async fetchMany(userId: number) {
    const client = await this.connect()
    try {
      const sql = `
        SELECT *
        FROM ${this._tableName}
        WHERE ${this._tableName}.user_id = $1
      `
      const { rows }: QueryResult<ClientNode> = await client.query(sql, [
        userId,
      ])
      return rows
    } catch (error) {
      console.error(error)
    } finally {
      client.release()
    }
  }

  /** Create client */
  async create(userId: number, clientNode: ClientNode) {
    clientNode.user_id = userId
    try {
      const response = await this.insert(clientNode)
      return response
    } catch (error) {
      throw error
    } finally {
    }
  }
}
