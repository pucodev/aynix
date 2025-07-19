import { FastifyInstance } from 'fastify'
import { UserService } from '../services/user.service'
import { MainModel } from './main.model'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export interface UserNode {
  id?: number
  firstname?: string
  lastname?: string
  email?: string
}

export class UserModel extends MainModel<UserNode> {
  constructor(node: UserNode) {
    super(node)
  }

  public static async hashPassword(password: string) {
    return await bcrypt.hash(password, 12)
  }

  getTokens() {
    const userId = this.node.id
    const secret = process.env.JWT_SECRET || 'SECRET_KEY'

    const accessToken = jwt.sign({ userId }, secret, {
      expiresIn: '1d',
    })

    const refreshToken = jwt.sign({ userId }, secret, {
      expiresIn: '15d',
    })

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    }
  }

  /**
   * @param {import("fastify").FastifyInstance} fastify  Encapsulated Fastify Instance
   * @returns {Promise<UserModel>} update node and return model
   */
  async insert(fastify: FastifyInstance): Promise<UserModel> {
    const service = new UserService(fastify)
    const item = await super._insert(service)
    this.node = item
    return this
  }

  /**
   * @param {import("fastify").FastifyInstance} fastify  Encapsulated Fastify Instance
   * @returns {Promise<UserModel>} update node and return model
   */
  async update(fastify: FastifyInstance): Promise<UserModel> {
    const service = new UserService(fastify)
    const item = await super._update(service)
    this.node = item
    return this
  }
}
