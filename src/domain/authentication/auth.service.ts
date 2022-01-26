import { database } from '../../database'

export function findUserByUsername(username: string) {
    return database.user.findFirst({
        where: {
            username,
        },
    })
}

export function findRefreshToken(token: string) {
    return database.refreshToken.findFirst({
        where: {
            token,
        },
    })
}

export function findUserByID(id: string) {
    return database.user.findFirst({
        where: {
            id,
        },
    })
}
