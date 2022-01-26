import { compare } from 'bcrypt'
import { Router, Request, Response } from 'express'
import { signUserToken } from '../../services/jwt'
import { PostSigninDTO } from './auth.dto'
import { findRefreshToken, findUserByID, findUserByUsername } from './auth.service'
import { omit } from 'lodash'
import { Body, JsonController, Post, Req, Res } from 'routing-controllers'

@JsonController('/auth')
export class AuthController {
    @Post('/signin')
    async SignIn(@Body() body: PostSigninDTO, @Res() res: Response) {
        const { username, password } = body

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
    }

    @Post('/renew')
    async renew(@Req() req: Request, @Res() res: Response) {
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
    }
}
