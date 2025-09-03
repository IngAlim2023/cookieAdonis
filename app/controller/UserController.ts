import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import env from '#start/env'

export default class UserController {
  async create({ request, response }: HttpContext) {
    try {
      const { nombre, email, password, rol } = request.body()

      const userExist = await User.query().where('email', email).first()

      if (userExist) return response.status(400).json({ message: 'El usuario existe' })

      const hash = await bcrypt.hash(password, 10)
      const newUser = await User.create({ nombre, email, password: hash, rol })

      return response.status(201).json({ message: 'Creado', data: newUser })
    } catch (e) {
      return response.status(500).json({ message: 'error', error: e.message })
    }
  }
  async read({ response }: HttpContext) {
    try {
      const users = await User.all()

      return response.status(201).json({ message: 'Exito', data: users })
    } catch (e) {
      return response.status(500).json({ message: 'error', error: e.message })
    }
  }
  async login({ request, response }: HttpContext) {
    try {
      const { email, password } = request.body()
      const userExist = await User.query().where('email', email).first()

      if (!userExist) return response.status(203).json({ message: 'El usuario no se encuentra' })

      const verifyPassword = await bcrypt.compare(password, userExist.password)

      if (!verifyPassword) return response.status(203).json({ message: 'Contraseña invalida' })

      const token = await createtoken(userExist)

      response.header('Set-Cookie', `${env.get('COOKIE_NAME')} = ${token}`)
      /**
       response.cookie('token', token, {
         secure: false,
         httpOnly: false,
       })
      */

      return response.status(200).json({ message: 'Autorizado' })
    } catch (e) {
      return response.status(500).json({ message: 'error', error: e.message })
    }
  }
  async validateLogin({ request, response }: HttpContext) {
    try {
      const usuario = (request as any).usuario

      const log = (request as any).user
      console.log(log)

      return response.status(200).json({ data:log })
    } catch (e) {
      return response.status(500).json({ message: 'error', error: e.message })
    }
  }
  async logout({ response }: HttpContext) {
    try {
      return response.header('Set-Cookie', `${env.get('COOKIE_NAME')} =`)
    } catch (e) {
      return response.status(500).json({ message: 'error', error: e.message })
    }
  }
}

const createtoken = async (data: any) => {
  const tok = jwt.sign(
    { id: data.id, nombre: data.nombre, email: data.email },
    env.get('APP_KEY'),
    { expiresIn: '1h' }
  )
  return tok
}
