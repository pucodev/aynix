import { FastifyInstance } from 'fastify'
import { MainService } from './main.service'
import { UserNode } from '../models/user.model'
import {
  EstimateStatusModel,
  EstimateStatusNode,
} from '../models/estimateStatus.model'

type NestedObject = Record<string, any>

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
    const estimateFields = ['id', 'total_cost'].map(
      field => `${this._tableName}.${field}`,
    )

    const clientTableName = 'clients'
    const clientPrefix = 'client'
    const clientFields = ['id', 'name'].map(
      field => `${clientTableName}.${field} as ${clientPrefix}__${field}`,
    )

    const estimateStatusTableName = 'estimate_status'
    const estimateStatusPrefix = 'estimate_status'
    const estimateStatusFields = ['id', 'name', 'color'].map(
      field =>
        `${estimateStatusTableName}.${field} as ${estimateStatusPrefix}__${field}`,
    )

    let sql = `
      SELECT
        ${[...estimateFields, ...clientFields, ...estimateStatusFields].join(', ')}
      FROM
        ${this._tableName}
      LEFT JOIN ${clientTableName} ON
        ${clientTableName}.id = ${this._tableName}.client_id
      LEFT JOIN ${estimateStatusTableName} ON
        ${estimateStatusTableName}.id = ${this._tableName}.estimate_status_id
      WHERE
        ${this._tableName}.user_id = $1
    `

    const client = await this.connect()
    try {
      const { rows } = await client.query(sql, [userId])

      const data: NestedObject[] = rows.map(item => {
        const pItem: NestedObject = {}

        for (const [key, value] of Object.entries(item)) {
          const split = key.split('__')
          if (split.length === 1) {
            pItem[key] = value
          } else if (split.length === 2) {
            const [parentKey, childKey] = split
            pItem[parentKey] = pItem[parentKey] || {}
            ;(pItem[parentKey] as NestedObject)[childKey] = value
          }
        }

        return pItem
      })

      return data
    } catch (error) {
      throw error
    } finally {
      client.release()
    }
  }

  /** Create empty estimatio asigned to a user */
  async createEmpty(userId: number): Promise<EstimateStatusNode> {
    const client = await this.connect()
    try {
      const sql = `
      INSERT INTO
        ${this._tableName}
      (user_id, estimate_status_id) VALUES ($1, $2)
      RETURNING *
      `
      const { rows } = await client.query(sql, [
        userId,
        EstimateStatusModel.INITIALIZED_STATUS_ID,
      ])

      return rows[0]
    } catch (error) {
      throw error
    } finally {
      client.release()
    }
  }
}
