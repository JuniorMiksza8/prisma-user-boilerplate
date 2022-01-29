import multer from 'multer'
import multers3 from 'multer-s3'
import AWS from 'aws-sdk'
import { CompanyService } from '../domain/company/company.service'
import { Request } from 'express'

const { AWS_S3_BUCKET = '' } = process.env

const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png']

export class ImageService {
    companyService = new CompanyService()

    uploadImage = multer({
        limits: {
            fileSize: 1024 * 1024 * 2,
        },
        fileFilter: (req, file, cb) => {
            const isAllowed = allowedMimeTypes.find((value) => value === file.mimetype)
            if (isAllowed) cb(null, true)
            else cb(new Error('file not supported'))
        },
        storage: multers3({
            s3: new AWS.S3(),
            bucket: AWS_S3_BUCKET,
            acl: 'public-read',
            metadata: (req, file, cb) => {
                cb(null, { fieldName: file.fieldname })
            },
            key: async (req: Request, file, cb) => {
                const company = await this.companyService.findById(req.params.id)
                if (!company) cb(new Error('company not found'))
                cb(null, `${company?.name}/${Date.now().toString()}-${file.originalname}`)
            },
        }),
    })
}
