import { Prisma } from '@prisma/client'
import { database } from '../../database'

export class UserService {
    createUser(data: Prisma.UserCreateInput) {
        return database.user.create({
            data,
        })
    }

    findSingleUser(id: string) {
        return database.user.findFirst({
            where: {
                id,
                deletedAt: null,
            },
        })
    }

    findManyUsers() {
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
            where: {
                deletedAt: null,
            },
        })
    }

    deleteUser(id: string) {
        return database.user.update({
            where: {
                id,
            },
            data: {
                deletedAt: new Date(),
            },
        })
    }

    updateUser(id: string, data: Prisma.UserUpdateInput) {
        return database.user.update({
            where: {
                id,
            },
            data: {
                ...data,
                updatedAt: new Date(),
            },
        })
    }
}
