import { compare } from 'bcrypt'
import { Router, Request, Response } from 'express'
import { JwtService } from '../../services/jwt'
import { PostRenewDTO, PostSigninDTO } from './auth.dto'
import { AuthService } from './auth.service'
import { omit } from 'lodash'
import { Body, JsonController, NotFoundError, Post, Req, Res } from 'routing-controllers'
import { isAfter } from 'date-fns'
import getUnixTime from 'date-fns/getUnixTime'

@JsonController('/auth')
export class AuthController {
    authService = new AuthService()
    jwtService = new JwtService()

    @Post('/signin')
    async SignIn(@Body() body: PostSigninDTO, @Res() res: Response) {
        const { username, password } = body

        const user = await this.authService.findUserByUsername(username)

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

        const accessToken = this.jwtService.signUserToken(user.id)
        const refreshToken = await this.authService.generateRefreshToken(user.id)

        return res.json({
            accessToken,
            refreshToken,
            user: omit(user, ['password', 'salt']),
        })
    }

    @Post('/renew')
    async renew(@Body() body: PostRenewDTO, @Res() res: Response) {
        const { refreshToken } = body

        const token = await this.authService.findRefreshToken(refreshToken)

        if (!token) {
            throw new NotFoundError('refresh token not found')
        }

        if (isAfter(getUnixTime(new Date()), token.expiresIn)) {
            return res.status(400).json({ message: 'refresh token expired' })
        }

        const accessToken = this.jwtService.signUserToken(token.userId)

        return {
            accessToken,
        }
    }
}
