import fastifyPostgres from '@fastify/postgres'
import { FastifyInstance } from 'fastify'

export function getDbConfig() {
  console.log('Configuring database service... , PORT : ', process.env.DB_PORT)
  const config: any = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_DATABASE,
  }

  // Only for prod
  if (typeof process.env.DB_REJECT_UNAUTHORIZED_SSL === 'undefined') {
    config.ssl = {
      rejectUnauthorized: false,
    }
  }

  return config
}

/**
 * Configurar la base de datos ingresando las credenciales del env
 * @param {import("fastify").FastifyInstance} fastify  Encapsulated Fastify Instance
 */
export function configDbService(fastify: FastifyInstance) {
  fastify.register(fastifyPostgres, getDbConfig())
}
