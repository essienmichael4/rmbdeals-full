import { DeleteObjectCommand, PutObjectCommand, S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import { getSignedUrl } from '@aws-sdk/cloudfront-signer'
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

@Injectable()
export class FileService {
    private readonly s3Client = new S3Client({
        region: this.configService.getOrThrow('AWS_S3_REGION'),
        credentials: {
            accessKeyId: this.configService.getOrThrow('AWS_ACCESS_KEY_ID'),
            secretAccessKey: this.configService.getOrThrow('AWS_SECRET_ACCESS_KEY')
        }
    })

    constructor(private readonly configService: ConfigService){}
    
    async getPresignedUrl(filename:string){
        const getObjectParams = {
            Bucket: this.configService.getOrThrow('BUCKET_NAME'),
            Key: `rmb/${filename}`
        }
        const command = new GetObjectCommand(getObjectParams)
        const url = await getSignedUrl(this.s3Client, command, {expiresIn: 3600})
        return url
    }

    // async getSignedUrlCloudfront(filename:string){
    //     const date = new Date(Date.now() + 1000 * 60 * 60 * 24)
    //     const privateKey = process.env.CLOUDFRONT_PRIVATE_KEY
        // const buff = Buffer.from(privateKey).toString('base64');
        // console.log(buff);
        
    //     const key = Buffer.from(privateKey , 'base64').toString('ascii')
    //     return getSignedUrl({
    //         url: `https://dh0ursehl95lm.cloudfront.net/${filename}`,
    //         dateLessThan: String(date),
    //         keyPairId: process.env.CLOUDFRONT_KEY_PAIR_ID,
    //         privateKey: key,
    //     })
    // }

    async uploadAsset(imageBuffer: Buffer, filename:string){
        return await this.s3Client.send(
            new PutObjectCommand({
            Bucket: this.configService.getOrThrow('BUCKET_NAME'),
            Body: imageBuffer,
            Key: `rmb/${filename}`
        }))
    }

    async deleteAsset(filename:string){
        return await this.s3Client.send(
            new DeleteObjectCommand({
            Bucket: this.configService.getOrThrow('BUCKET_NAME'),
            Key: `rmb/${filename}`
        }))
    }
}
