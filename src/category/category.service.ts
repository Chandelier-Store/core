import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { StorageService } from 'src/storage/storage.service'
import { CategoryDto } from './dto/category.dto'

@Injectable()
export class CategoryService {
	constructor(
		private prisma: PrismaService,
		private storageService: StorageService
	) {}
	async getList() {
		const items = await this.prisma.category.findMany()
		const count = await this.prisma.category.count()
		return {
			data: items,
			meta: { count }
		}
	}
	async create(dto: CategoryDto, image: Express.Multer.File) {
		let imageUrl: string | undefined
		if (image) {
			imageUrl = await this.storageService.uploadFile(
				'images',
				`category/${Date.now()}-${image.originalname}`,
				image.buffer,
				image.mimetype
			)
		}
		return this.prisma.category.create({
			data: {
				name: dto.name,
				...(imageUrl ? { image: imageUrl } : {})
			}
		})
	}
	async update(id: string, dto: CategoryDto, image: Express.Multer.File) {
		let imageUrl: string | undefined
		if (image) {
			imageUrl = await this.storageService.uploadFile(
				'images',
				`products/${Date.now()}-${image.originalname}`,
				image.buffer,
				image.mimetype
			)
		}
		return this.prisma.category.update({
			where: { id },
			data: {
				name: dto.name,
				...(imageUrl ? { image: imageUrl } : {})
			}
		})
	}
	async delete(id: string) {
		return this.prisma.category.delete({
			where: { id }
		})
	}
}
