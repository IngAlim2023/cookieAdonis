import jwt from 'jsonwebtoken'
import env from '#start/env'
import User from '#models/user'
import { type HttpContext } from '@adonisjs/core/http'

export class AuthMiddleware {
  async middle({ request, response }: HttpContext, next: () => Promise<void>) {
    try {
        const cookies = request.headers().cookie
        const tokenDirty = cookies

        const nuevaCadena = tokenDirty?.split('auth=').join('');
        console.log(nuevaCadena)
        await next();

    } catch (e) {
      return response.status(500).json({ message: 'error', error: e.message })
    }
  }
}
