import { FastifyInstance } from 'fastify'
import { MainService } from './main.service'
import { UserNode } from '../models/user.model'
import format from 'pg-format'

export class EstimateService extends MainService<UserNode> {
  static TABLE_NAME = 'estimates'

  constructor(fastify: FastifyInstance) {
    super(fastify, EstimateService.TABLE_NAME, [
      'description',
      'labor_cost',
      'materials',
      'materials_total',
      'total_cost',
    ])
  }

  /**
   * List estimates for dashboard page
   */
  async summary(userId: number) {
    const client = await this.connect()
    const clientTableName = 'clients'
    const clientPrefix = 'client'

    const estimateFields = ['id', 'total_cost'].map(
      field => `${this._tableName}.${field}`,
    )
    const clientFields = ['id'].map(
      field => `${clientTableName}.${field} as ${clientPrefix}__${field}`,
    )

    let sql = `
      SELECT
        ${[...estimateFields, ...clientFields].join(', ')}
      FROM
        ${this._tableName}
      LEFT JOIN ${clientTableName} ON
        ${clientTableName}.id = ${this._tableName}.client_id
      WHERE
        ${this._tableName}.user_id = $1
    `

    const { rows } = await client.query(sql, [userId])

    return rows
  }
}
