import { Request } from 'express'

export interface RequestSession extends Request {
    user: string
}
