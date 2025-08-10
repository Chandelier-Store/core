import {
	DeleteObjectCommand,
	HeadObjectCommand,
	PutObjectCommand,
	S3Client
} from '@aws-sdk/client-s3'
import { Injectable, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { getStorageConfig } from 'src/config/storage.config'

@Injectable()
export class StorageService {
	private s3Client: S3Client
	private publicUrlBase: string

	constructor(private readonly configService: ConfigService) {
		const storageConfig = getStorageConfig(this.configService)
		this.s3Client = new S3Client(storageConfig)
		this.publicUrlBase = storageConfig.publicUrlBase
	}

	async uploadFile(
		bucket: string,
		fileName: string,
		fileBuffer: Buffer,
		mimeType: string
	) {
		await this.s3Client.send(
			new PutObjectCommand({
				Bucket: bucket,
				Key: fileName,
				Body: fileBuffer,
				ContentType: mimeType
			})
		)
		return `${process.env.MINIO_API}/${bucket}/${fileName}`
	}
	async deleteFile(bucket: string, fileName: string) {
		try {
			await this.s3Client.send(
				new HeadObjectCommand({
					Bucket: bucket,
					Key: fileName
				})
			)
		} catch (error) {
			if (
				error.name === 'NotFound' ||
				error.$metadata?.httpStatusCode === 404
			) {
				throw new NotFoundException(
					`File ${fileName} not found in bucket ${bucket}`
				)
			}
			throw error
		}
		await this.s3Client.send(
			new DeleteObjectCommand({
				Bucket: bucket,
				Key: fileName
			})
		)
	}
}
