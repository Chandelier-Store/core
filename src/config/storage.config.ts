import { ConfigService } from '@nestjs/config'

export const getStorageConfig = (configService: ConfigService) => {
	const isSSL = configService.get<string>('MINIO_USE_SSL') === 'true'
	const protocol = isSSL ? 'https' : 'http'

	return {
		region: configService.get<string>('MINIO_REGION') || 'us-east-1',
		endpoint: `${protocol}://${configService.get<string>('MINIO_HOST')}:${configService.get<string>('MINIO_PORT')}`,
		forcePathStyle: true,
		credentials: {
			accessKeyId:
				configService.get<string>('MINIO_ACCESS_KEY') || 'minio_admin',
			secretAccessKey:
				configService.get<string>('MINIO_SECRET_KEY') || '14022004'
		},
		publicUrlBase: `${configService.get<string>('MINIO_HOST')}:${configService.get<string>('MINIO_PORT')}`
	}
}
