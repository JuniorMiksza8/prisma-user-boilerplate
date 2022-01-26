import { Router } from 'express'
import signInRouter from '../domain/authentication/auth.controller'
import UserRouter from '../domain/user/user.controller'

const routes = Router()

routes.use(UserRouter)
routes.use(signInRouter)

export default routes
