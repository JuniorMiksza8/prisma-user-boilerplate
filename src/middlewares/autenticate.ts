import { Response, Request, NextFunction } from 'express'
import { JwtService, UserTokenPayload } from '../services/jwt'

export function autenticateUserMiddleware(req: Request, res: Response, next: NextFunction) {
    const jwtService = new JwtService()

    const token = (req.headers['x-access-token'] as string) || (req.headers['access-token'] as string)

    if (!token) {
        return res.status(401).json({
            message: 'missing token',
        })
    }

    const payload = jwtService.verifyUserToken(token) as UserTokenPayload

    if (!payload) {
        return res.status(401).json({
            message: 'invalid token',
        })
    }

    ;(req as any).user = payload.id
    next()
}
