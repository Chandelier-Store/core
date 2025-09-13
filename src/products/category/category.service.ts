import { Injectable, NotFoundException } from '@nestjs/common'
import { generateSlug } from 'src/helpers/slug.helper'
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
		const imageUrl = await this.storageService.uploadImageByFolderName(
			'products',
			image
		)
		return this.prisma.category.create({
			data: {
				name: dto.name,
				slug: generateSlug(dto.name),
				...(imageUrl ? { image: imageUrl } : {})
			}
		})
	}
	async update(id: string, dto: CategoryDto, image: Express.Multer.File) {
		const category = await this.prisma.category.findUnique({ where: { id } })
		if (!category) throw new NotFoundException(`Category with id ${id} not found`)

		let imageUrl: string | undefined
		if (image) {
			imageUrl = await this.storageService.uploadImageByFolderName(
				'products',
				image
			)
			if (category.image) {
				await this.storageService.deleteFileByUrl(category.image)
			}
		}
		return this.prisma.category.update({
			where: { id },
			data: {
				name: dto.name,
				slug: generateSlug(dto.name),
				...(imageUrl ? { image: imageUrl } : {})
			}
		})
	}
	async delete(id: string) {
		const category = await this.prisma.category.findUnique({ where: { id } })
		if (!category) throw new NotFoundException(`Category with id ${id} not found`)
		if (category.image) {
			await this.storageService.deleteFileByUrl(category.image)
		}
		return this.prisma.category.delete({
			where: { id }
		})
	}
}
