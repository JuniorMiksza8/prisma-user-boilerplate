import { S3 } from 'aws-sdk'

const { AWS_BUCKET_REGION = '', AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = process.env

export class AwsService {
    s3() {
        return new S3({
            region: AWS_BUCKET_REGION,
            accessKeyId: AWS_ACCESS_KEY_ID,
            secretAccessKey: AWS_SECRET_ACCESS_KEY,
        })
    }
}
