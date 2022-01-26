import 'express-async-errors'
import 'reflect-metadata'
import { createExpressServer } from 'routing-controllers'

const app = createExpressServer({
    controllers: [__dirname + '/domain/*/*.controller.{ts,js}'],
})

export default app
