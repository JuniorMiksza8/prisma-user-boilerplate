import { compare } from 'bcrypt'
import { Router } from 'express'
import { signUserToken } from '../../services/jwt'
import { PostSigninDTO } from './auth.dto'
import { findRefreshToken, findUserByID, findUserByUsername } from './auth.service'
import { omit } from 'lodash'
const signInRouter = Router()

signInRouter.route('/signin').post(async (req, res) => {
    const { username, password } = req.body as PostSigninDTO

    const user = await findUserByUsername(username)

    if (!user) {
        return res.status(404).json({
            message: 'username or password invalid',
        })
    }

    const isValid = await compare(password, user.password)

    if (!isValid) {
        return res.status(404).json({
            message: 'username or password invalid',
        })
    }

    const accessToken = signUserToken(user.id)

    return res.json({
        accessToken,
        user: omit(user, ['password', 'salt']),
    })
})

signInRouter.route('/renew').post(async (req, res) => {
    const { refreshToken } = req.body

    const token = await findRefreshToken(refreshToken)

    if (!token) {
        return res.status(404).json({ message: 'token not found' })
    }

    const user = await findUserByID(token.userId)

    return res.json({
        user,
        refreshToken: token,
    })
})

export default signInRouter
