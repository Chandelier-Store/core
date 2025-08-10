import { ConfigService } from '@nestjs/config'

export const getStorageConfig = (configService: ConfigService) => {

	return {
		region: configService.get<string>('MINIO_REGION') || 'us-east-1',
		endpoint: configService.get<string>('MINIO_API'),
		forcePathStyle: true,
		credentials: {
			accessKeyId:
				configService.get<string>('MINIO_ACCESS_KEY') || 'minio_admin',
			secretAccessKey:
				configService.get<string>('MINIO_SECRET_KEY') || '14022004'
		},
		publicUrlBase: `${configService.get<string>('MINIO_API')}/${configService.get<string>('MINIO_BUCKET')}`
	}
}
