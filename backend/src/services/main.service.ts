import format from 'pg-format'
import { QueryFilter } from '../controllers/main.controller'
import { FastifyInstance } from 'fastify'

export class MainService<NodeType> {
  _fastify: FastifyInstance
  _tableName: string
  _fields: string[]
  _id: string
  _timestampFields: string[]

  /**
   * Create service
   * @param {import("fastify").FastifyInstance} fastify  Encapsulated Fastify Instance
   * @param {string} tableName table name
   * @param {string[]} fields array with all editable table fields
   */
  constructor(fastify: FastifyInstance, tableName: string, fields: string[]) {
    this._fastify = fastify
    this._tableName = tableName
    this._fields = fields
    this._id = 'id'

    this._timestampFields = ['created_at', 'updated_at']
  }

  public async connect() {
    return await this._fastify.pg.connect()
  }

  /**
   * Analiza el objeto data y devuelve un nuevo objeto solo con los parametros validos definidos en fields
   * @param {object} data Objeto a procesar
   * @returns {object} Nuevo objeto solo con parametros validos
   */
  getValidData(data: any) {
    const fields = this._fields
    const validData: any = {}
    fields.forEach(field => {
      if (typeof data[field] !== 'undefined') {
        validData[field] = data[field]
      }
    })
    return validData
  }

  /**
   * Agrega registro a la base de datos
   * @param {object} data Objeto a agregar a la base de datos
   * @returns {Promise<object>} Registro guardado
   */
  async insert(data: any): Promise<any> {
    const client = await this.connect()

    try {
      // Validate data
      const validData = this.getValidData(data)

      // Compute fields and values to insert
      const fields: string[] = []
      const values: any[] = []
      for (const key in validData) {
        fields.push(key)
        values.push(validData[key])
      }

      const sql = format(
        'INSERT INTO %I (%I) VALUES (%L) RETURNING *',
        this._tableName,
        fields,
        values,
      )
      const { rows } = await client.query(
        // Query
        sql,
        // Parameters
        [],
      )

      if (Array.isArray(rows)) {
        return rows[0]
      }

      return rows
    } finally {
      client.release()
    }
  }

  /**
   * Actualiza un registro de la base de datos segun el id
   * @param {number} id ID del item
   * @param {object} data Objeto con los parametros a actualizar
   * @returns {Promise<object>} Registro actualizado
   */
  async update(id: number, data: any): Promise<any> {
    const client = await this.connect()

    try {
      // Validate data
      const validData = this.getValidData(data)

      // Compute fields and values to insert
      const setters: string[] = []
      let index = 2
      const extraParameters = []
      for (const key in validData) {
        let value = validData[key]
        if (Array.isArray(value)) {
          value = JSON.stringify(value)
        }
        extraParameters.push(value)
        setters.push(`${key} = $${index}`)
        index++
      }

      const sql = format(
        `UPDATE %I SET ${setters.join(', ')} WHERE %I = $1 RETURNING *`,
        this._tableName,
        this._id,
      )

      const { rows } = await client.query(sql, [id, ...extraParameters])

      if (Array.isArray(rows)) {
        return rows[0]
      }

      return rows
    } finally {
      client.release()
    }
  }

  /**
   * Obtiene los registros de una tabla
   * @param {string[]} fields fields to select
   * @param {import('../controllers/main.controller').QueryFilter[]} filters params to filter
   * @returns {Promise<object>} Registro actualizado
   */
  async fetch(fields: string[], filters: QueryFilter[]): Promise<NodeType[]> {
    const client = await this.connect()

    try {
      // Agregamos a los campos disponibles, los timestamps y el id
      const allValidFields: string[] = [
        ...this._fields,
        ...this._timestampFields,
        this._id,
      ]

      // De los fields solo mostramos los campos válidos
      const validFields: string[] = []
      if (Array.isArray(fields)) {
        fields.forEach(field => {
          if (allValidFields.includes(field.trim())) {
            validFields.push(field.trim())
          }
        })
      }

      // Agregamos los filtros solo de campos válidos
      /** @type {import('../controllers/main.controller').QueryFilter[]} */
      const validFilters: QueryFilter[] = []
      if (Array.isArray(filters)) {
        filters.forEach(item => {
          if (allValidFields.includes(item.field.trim())) {
            validFilters.push(item)
          }
        })
      }

      let select = '*'
      if (validFields.length > 0) {
        select = validFields.join(', ')
      }

      let sql = format(`SELECT ${select} FROM %I`, this._tableName)

      // Agregamos los WHERE
      if (validFilters.length > 0) {
        const items = validFilters.map(
          (item, index) => `(${item.field} ${item.logic || '='} $${index + 1})`,
        )
        sql += ` WHERE ${items.join(' AND ')}`
      }

      const { rows } = await client.query(
        // Query
        sql,
        // Parameters
        validFilters.map(item => item.value),
      )

      return rows
    } finally {
      client.release()
    }
  }
}
