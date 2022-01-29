import { Response, Request, NextFunction } from 'express'
import { database } from '../database'
import { JwtService, UserTokenPayload } from '../services/jwt'

export async function autenticateUserMiddleware(req: Request, res: Response, next: NextFunction) {
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

    const user = await database.user.findFirst({
        where: {
            id: payload.id,
            deletedAt: null,
        },
    })

    if (!user) {
        return res.status(401).json({ message: 'user not found' })
    }

    ;(req as any).user = user.id
    next()
}
