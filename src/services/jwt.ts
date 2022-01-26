import { User } from '@prisma/client'
import { sign, verify } from 'jsonwebtoken'

export interface UserTokenPayload {
    id: string
}

export function signUserToken(id: User['id']) {
    const { JWT_PRIVATE_KEY = '' } = process.env

    return sign({ id }, JWT_PRIVATE_KEY, { expiresIn: '24h' })
}

export function verifyUserToken(token: string) {
    const { JWT_PRIVATE_KEY = '' } = process.env
    return verify(token, JWT_PRIVATE_KEY)
}
