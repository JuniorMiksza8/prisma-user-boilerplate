import { database } from '../../database'
import { addDays, getUnixTime } from 'date-fns'

export class AuthService {
    generateRefreshToken(userId: string) {
        const expiresIn = getUnixTime(addDays(new Date(), 1))

        return database.refreshToken.create({
            data: {
                expiresIn,
                userId,
            },
        })
    }

    findUserByUsername(username: string) {
        return database.user.findFirst({
            where: {
                username,
            },
        })
    }

    findRefreshToken(token: string) {
        return database.refreshToken.findFirst({
            where: {
                token,
            },
        })
    }

    findUserByID(id: string) {
        return database.user.findFirst({
            where: {
                id,
            },
        })
    }
}
