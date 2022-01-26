import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime'
import { Response, Router } from 'express'
import { omit } from 'lodash'
import { Body, Delete, Get, JsonController, Param, Post, Put, Res, UseBefore } from 'routing-controllers'
import { hashPassword } from '../../helpers/hashPassword'
import { autenticateUserMiddleware } from '../../middlewares/autenticate'
import { CreateUserDTO, UpdateUserDTO } from './user.dto'
import { createUser, deleteUser, findManyUsers, updateUser } from './user.service'

@JsonController('/user')
@UseBefore(autenticateUserMiddleware)
export class UserController {
    @Get()
    async findUsers() {
        return findManyUsers()
    }

    @Post()
    async createUser(@Body() body: CreateUserDTO, @Res() res: Response) {
        try {
            let { password, username, email } = body

            const { hash, salt } = await hashPassword(password)

            const user = {
                username,
                email,
                password: hash,
                salt,
            }

            const newUser = await createUser(user)

            return res.status(201).json(omit(newUser, ['password', 'salt']))
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                const target = (error.meta as any).target
                return res.status(400).json({ message: `duplicate entry on fields: ${target.join(',')}` })
            }
            if (error instanceof PrismaClientValidationError) {
                return res.status(400).json({ message: 'invalid user' })
            }
            return res.status(500).send()
        }
    }

    @Put(':id')
    async updateUser(@Body() body: UpdateUserDTO, @Param('id') id: string, @Res() res: Response) {
        const { email } = body

        const data = {
            email,
        }

        const user = await updateUser(id, data)

        return res.status(200).json(omit(user, ['password', 'salt']))
    }

    @Delete('id')
    async deleteUser(@Param('id') id: string, @Res() res: Response) {
        try {
            const deleted = await deleteUser(id)

            return res.status(200).json({ deleted })
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    return res.status(400).json({ message: 'user doest not exist' })
                }
                const message = (error.meta as any).cause
                return res.status(400).json({ message })
            }
            return res.status(500).send()
        }
    }
}
