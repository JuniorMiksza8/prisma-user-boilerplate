import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime'
import { Router } from 'express'
import { omit } from 'lodash'
import { hashPassword } from '../../helpers/hashPassword'
import { autenticateUserMiddleware } from '../../middlewares/autenticate'
import { CreateUserDTO, UpdateUserDTO } from './user.dto'
import { createUser, deleteUser, findManyUsers, updateUser } from './user.service'

const userRouter = Router()

userRouter.route('/user').get(autenticateUserMiddleware, async (req, res) => {
    try {
        const users = await findManyUsers()

        return res.json(users)
    } catch (error) {
        console.log(error)
        return res.status(500).send()
    }
})

userRouter.route('/user').post(autenticateUserMiddleware, async (req, res) => {
    try {
        let { password, username, email } = req.body as CreateUserDTO

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
})

userRouter.route(`/user/:id`).put(autenticateUserMiddleware, async (req, res) => {
    try {
        const { id } = req.params

        const { email } = req.body

        const data = {
            email,
        } as UpdateUserDTO

        const user = await updateUser(id, data)

        return res.status(200).json(omit(user, ['password', 'salt']))
    } catch (error) {
        return res.status(500).send()
    }
})

userRouter.route('/user/:id').delete(autenticateUserMiddleware, async (req, res) => {
    const { id } = req.params

    try {
        const deleted = await deleteUser(id)

        return res.status(200).json({ deleted })
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            const message = (error.meta as any).cause
            if (error.code === 'P2025') {
                return res.status(400).json({ message: 'user doest not exist' })
            }
            return res.status(400).json({ message })
        }
        return res.status(500).send()
    }
})

export default userRouter
