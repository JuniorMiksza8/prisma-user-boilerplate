import 'express-async-errors'
import 'reflect-metadata'
import { createExpressServer } from 'routing-controllers'
import cors from 'cors'

const app = createExpressServer({
    controllers: [__dirname + '/domain/*/*.controller.{ts,js}'],
    cors: true,
})

export default app
