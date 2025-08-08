import {
  DeleteObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { Injectable, NotFoundException } from '@nestjs/common'

@Injectable()
export class StorageService {
  private s3Client: S3Client

  constructor() {
    const isSSL = process.env.MINIO_USE_SSL === 'true'
    const protocol = isSSL ? 'https' : 'http'
    const endpoint = `${protocol}://${process.env.MINIO_HOST}:${process.env.MINIO_PORT}`

    this.s3Client = new S3Client({
      region: process.env.MINIO_REGION || 'us-east-1',
      endpoint,
      forcePathStyle: true,
      credentials: {
        accessKeyId: process.env.MINIO_ACCESS_KEY || 'minio_admin',
        secretAccessKey: process.env.MINIO_SECRET_KEY || '14022004',
      },
    })
  }

  async uploadFile(bucket: string, fileName: string, fileBuffer: Buffer, mimeType: string) {
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: fileName,
        Body: fileBuffer,
        ContentType: mimeType,
      }),
    )
    return `${process.env.MINIO_HOST}:${process.env.MINIO_PORT}/${bucket}/${fileName}`
  }
  async deleteFile(bucket: string, fileName: string) {
    try {
      await this.s3Client.send(
        new HeadObjectCommand({
          Bucket: bucket,
          Key: fileName,
        }),
      )
    } catch (error) {
      if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
        throw new NotFoundException(`File ${fileName} not found in bucket ${bucket}`)
      }
      throw error
    }
    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: fileName,
      }),
    )
  }
}
