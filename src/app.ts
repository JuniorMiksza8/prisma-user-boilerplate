import 'express-async-errors'
import express, { NextFunction, Request, Response } from 'express'
import routes from './routes'

const app = express()

app.use(express.json())

app.use(routes)

app.use((error: Error, request: Request, response: Response, next: NextFunction) => {
    return response.status(500).json({
        message: error.message,
    })
})

export default app
