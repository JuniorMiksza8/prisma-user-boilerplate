import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime'
import { Request } from 'express'
import {
    Body,
    Get,
    JsonController,
    Post,
    Req,
    BadRequestError,
    UseBefore,
    Delete,
    Param,
    NotFoundError,
    UnauthorizedError,
    Put,
    InternalServerError,
    UploadedFile,
} from 'routing-controllers'
import { RequestSession } from '../../interfaces/RequestSession'
import { autenticateUserMiddleware } from '../../middlewares/autenticate'
import { ImageService } from '../../middlewares/uploadImage'
import { UserService } from '../user/user.service'
import { CreateCompanyDTO, UpdateCompanyDTO } from './company.dto'
import { CompanyService } from './company.service'

@JsonController('/company')
export class CompanyController {
    companyService: CompanyService = new CompanyService()
    userService: UserService = new UserService()
    imageService: ImageService = new ImageService()

    @Get()
    async find() {
        const companys = await this.companyService.find()
        return companys
    }

    @Post()
    @UseBefore(autenticateUserMiddleware)
    async create(@Body() body: CreateCompanyDTO, @Req() req: RequestSession) {
        const userId = req.user
        const user = await this.userService.findSingleUser(userId)

        if (!user) {
            throw new BadRequestError('invalid user')
        }

        const { name, phone, cnpj, email } = body

        const data = {
            name,
            phone,
            cnpj,
            email,
            ownerId: user.id,
        }

        const company = await this.companyService.create(data).catch((error) => {
            if (error instanceof PrismaClientKnownRequestError) {
                const target = (error.meta as any).target
                throw new BadRequestError(`duplicate entry on fields: ${target.join(',')}`)
            }
            if (error instanceof PrismaClientValidationError) {
                throw new BadRequestError('invalid company')
            }

            throw new InternalServerError('error creating company')
        })

        return company
    }

    @Put('/:id')
    @UseBefore(autenticateUserMiddleware)
    async update(
        @Body({ validate: true }) body: UpdateCompanyDTO,
        @Req() req: RequestSession,
        @Param('id') id: string
    ) {
        const userId = req.user
        const company = await this.companyService.findById(id)

        if (!company) {
            throw new NotFoundError('company not found')
        }

        if (company.ownerId !== userId) {
            throw new UnauthorizedError('only company owner can remove it')
        }

        const { email, name, phone, avatar } = body

        const data = {
            email,
            name,
            phone,
            id,
        }

        const updated = await this.companyService.update(data)
        return updated
    }

    @Delete('/:id')
    @UseBefore(autenticateUserMiddleware)
    async delete(@Req() req: RequestSession, @Param('id') id: string) {
        const userId = req.user
        const company = await this.companyService.findById(id)

        if (!company) {
            throw new NotFoundError('company not found')
        }

        if (company.ownerId !== userId) {
            throw new UnauthorizedError('only company owner can remove it')
        }

        const deleted = await this.companyService.delete(id)

        return deleted
    }

    @Put('/image/:id')
    async updateImage(
        @UploadedFile('avatar', { options: new ImageService().uploadImage }) file: any,
        @Param('id') id: string
    ) {
        const { location } = file

        const data = {
            id,
            avatar: location,
        }

        const company = await this.companyService.update(data)

        return company
    }
}
