import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { MainController } from './main.controller'
import { EstimateService } from '../services/estimate.service'
import { EstimateModel, EstimateNode } from '../models/estimate.model'
import { EstimateStatusModel } from '../models/estimateStatus.model'
import z from 'zod'

export class EstimateController extends MainController {
  /** fetch estimatios for home view */
  static async summary(
    fastify: FastifyInstance,
    request: FastifyRequest<{ Querystring: Record<string, string> }>,
    reply: FastifyReply,
  ) {
    try {
      const service = new EstimateService(fastify)
      if (request.auth_user?.user_id) {
        const data = await service.summary(request.auth_user?.user_id)
        return reply.send({ data })
      }

      return reply.status(403).send({})
    } catch (error) {
      console.error('error ', error)
      return reply.status(500).send({
        status: 'Server error',
      })
    }
  }

  /** fetch estimation from id */
  static async fetch(
    fastify: FastifyInstance,
    request: FastifyRequest<{ Params: { id: number } }>,
    reply: FastifyReply,
  ) {
    try {
      const service = new EstimateService(fastify)
      if (request.auth_user?.user_id) {
        const data = await service.fetchOne(
          request.params.id,
          request.auth_user.user_id,
        )
        return reply.send({ data })
      }

      return reply.status(403).send({})
    } catch (error) {
      console.error('error ', error)
      return reply.status(500).send({
        status: 'Server error',
      })
    }
  }

  /** Create empty estimation */
  static async createEmpty(
    fastify: FastifyInstance,
    request: FastifyRequest<{ Querystring: Record<string, string> }>,
    reply: FastifyReply,
  ) {
    try {
      const service = new EstimateService(fastify)
      if (request.auth_user?.user_id) {
        const data = await service.createEmpty(request.auth_user?.user_id)
        return reply.send({ data })
      }

      return reply.status(403).send({})
    } catch (error) {
      console.error('error ', error)
      return reply.status(500).send({
        status: 'Server error',
      })
    }
  }

  /** Create empty estimation */
  static async update(
    fastify: FastifyInstance,
    request: FastifyRequest<{ Body: EstimateNode; Params: { id: number } }>,
    reply: FastifyReply,
  ) {
    try {
      const materials = request.body.materials
      const status = request.body.estimate_status_id
      let isValid = true
      let message = ''

      // For completed status is required
      // - client
      // - materials o labor cost
      if (status === EstimateStatusModel.COMPLETED_STATUS_ID) {
        // TODO: Validate if client id is related to user
        isValid =
          typeof request.body.client_id !== 'undefined' &&
          request.body.client_id !== null &&
          ((typeof materials !== 'undefined' && materials.length > 0) ||
            (typeof request.body.labor_cost !== 'undefined' &&
              request.body.labor_cost !== null))

        message =
          'An estimate must include a client or materials before it can be completed'
      }

      // Validate material structure and parse with the valid fields
      else if (materials) {
        if (Array.isArray(materials)) {
          console.log('PREMATERIAL', materials)
          const MaterialSchema = z
            .object({
              name: z.string(),
              qty: z.number(),
              price: z.number(),
            })
            .strip()

          try {
            request.body.materials = materials?.map(material => {
              console.log('MAT = ', material)
              return MaterialSchema.parse(material)
            })
          } catch (err) {
            isValid = false
            message = 'Materials has an invalid schema'
          }
        } else {
          isValid = false
          message = 'Materials should be an array'
        }
      }

      if (!isValid) {
        return reply.status(400).send({
          message,
        })
      }

      // Compute totals
      const estimateModel = new EstimateModel(request.body)
      request.body.total_cost = estimateModel.totalCost
      request.body.materials_total = estimateModel.totalCostMaterial

      // Remove user_id
      delete request.body.user_id

      // Save to DB
      const service = new EstimateService(fastify)
      console.log('PREEE')
      await service.update(request.params.id, request.body)

      return reply.send(request.body)
    } catch (error) {
      console.error('error ', error)
      return reply.status(500).send({
        status: 'Server error',
      })
    }
  }
}
