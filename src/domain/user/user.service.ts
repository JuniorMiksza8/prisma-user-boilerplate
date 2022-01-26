import { Prisma } from '@prisma/client'
import { database } from '../../database'

export function createUser(data: Prisma.UserCreateInput) {
    return database.user.create({
        data,
    })
}

export function findManyUsers() {
    return database.user.findMany({
        select: {
            id: true,
            username: true,
            email: true,
            createdAt: true,
            updatedAt: true,
            password: false,
            salt: false,
        },
    })
}

export function deleteUser(id: string) {
    return database.user.delete({
        where: {
            id,
        },
    })
}

export function updateUser(id: string, data: Prisma.UserUpdateInput) {
    return database.user.update({
        where: {
            id,
        },
        data,
    })
}
