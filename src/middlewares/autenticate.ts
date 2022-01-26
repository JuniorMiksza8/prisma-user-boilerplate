import { Response, Request, NextFunction } from 'express'
import { UserTokenPayload, verifyUserToken } from '../services/jwt'

export function autenticateUserMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['x-access-token'] as string

    if (!token) {
        return res.status(401).json({
            message: 'missing token',
        })
    }

    const payload = verifyUserToken(token) as UserTokenPayload

    if (!payload) {
        return res.status(401).json({
            message: 'invalid token',
        })
    }

    ;(req as any).user = payload.id
    next()
}
