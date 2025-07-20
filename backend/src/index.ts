import Fastify from 'fastify'
import { v1Routes } from './routes/v1/v1.route'
import { configDbService } from './services/config.service'
import fastifyFormbody from '@fastify/formbody'
import fastifyCors from '@fastify/cors'

const fastify = Fastify({
  logger: true,
})

await fastify.register(fastifyCors, {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
})

fastify.register(fastifyFormbody)
fastify.register(v1Routes, { prefix: '/api/v1' })

configDbService(fastify)

/**
 * Run the server!
 */
async function start() {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
