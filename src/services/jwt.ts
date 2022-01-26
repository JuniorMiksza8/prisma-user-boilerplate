import { User } from '@prisma/client'
import { sign, verify } from 'jsonwebtoken'

export interface UserTokenPayload {
    id: string
}

export class JwtService {
    signUserToken(id: User['id']) {
        const { JWT_PRIVATE_KEY = '' } = process.env

        return sign({ id }, JWT_PRIVATE_KEY, { expiresIn: '24h', subject: id })
    }
    verifyUserToken(token: string) {
        const { JWT_PRIVATE_KEY = '' } = process.env
        return verify(token, JWT_PRIVATE_KEY)
    }
}
