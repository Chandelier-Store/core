import {
	DeleteObjectCommand,
	PutObjectCommand,
	S3Client
} from '@aws-sdk/client-s3'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { getStorageConfig } from 'src/config/storage.config'
import { v4 as uuidv4 } from 'uuid'

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
	async uploadImageByFolderName(
		folder: string,
		image?: Express.Multer.File
	): Promise<string | undefined> {
		if (!image) return
		return this.uploadFile(
			'images',
			`${folder}/${uuidv4()}`,
			image.buffer,
			image.mimetype
		)
	}
	async deleteFile(bucket: string, fileName: string) {
		try {
			await this.s3Client.send(
				new DeleteObjectCommand({
					Bucket: bucket,
					Key: fileName
				})
			)
		} catch (error) {
			throw new Error(
				`Ошибка удаления файла ${fileName} из bucket ${bucket}: ${error}`
			)
		}
	}
	async deleteFileByUrl(fileUrl: string) {
		if (!fileUrl) return
		const base = process.env.MINIO_API + '/'
		if (!fileUrl.startsWith(base)) return
		const urlParts = fileUrl.replace(base, '').split('/')
		const bucket = urlParts.shift()
		const key = urlParts.join('/')
		if (bucket && key) {
			await this.deleteFile(bucket, key)
		}
	}
}
