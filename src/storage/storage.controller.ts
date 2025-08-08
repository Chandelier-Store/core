import {
	Body,
	Controller,
	Delete,
	NotFoundException,
	Post,
	UploadedFile,
	UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { StorageService } from './storage.service'

@Controller('storage')
export class StorageController {
	constructor(private readonly storageService: StorageService) {}

	@Post('upload')
	@UseInterceptors(FileInterceptor('file'))
	async uploadImage(@UploadedFile() file: Express.Multer.File) {
		const url = await this.storageService.uploadFile(
			process.env.MINIO_BUCKET || 'images',
			file.originalname,
			file.buffer,
			file.mimetype
		)
		return { url }
	}

	@Delete('delete')
	async deleteImage(@Body('fileName') fileName: string) {
		try {
			await this.storageService.deleteFile(
				process.env.MINIO_BUCKET || 'images',
				fileName
			)
			return { message: `File ${fileName} deleted successfully` }
		} catch (error) {
			if (error instanceof NotFoundException) {
				throw error
			}
			throw error
		}
	}
}
