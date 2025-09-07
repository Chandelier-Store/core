import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { StorageService } from 'src/storage/storage.service'
import { BannerDto } from './dto/banner.dto'

@Injectable()
export class BannerService {
	constructor(
		private prisma: PrismaService,
		private storageService: StorageService
	) {}
	async getList() {
		const items = await this.prisma.banner.findMany()
		const count = await this.prisma.banner.count()
		return {
			data: items,
			meta: { count }
		}
	}
	async create(dto: BannerDto, image: Express.Multer.File) {
		let imageUrl: string | undefined
		if (image) {
			imageUrl = await this.storageService.uploadFile(
				'images',
				`content/${Date.now()}-${image.originalname}`,
				image.buffer,
				image.mimetype
			)
		}
		return this.prisma.banner.create({
			data: {
				link: dto.link,
        isActive: dto.isActive,
				...(imageUrl ? { image: imageUrl } : {})
			}
		})
	}
	async update(id: string, dto: BannerDto, image: Express.Multer.File) {
		let imageUrl: string | undefined
		if (image) {
			imageUrl = await this.storageService.uploadFile(
				'images',
				`content/${Date.now()}-${image.originalname}`,
				image.buffer,
				image.mimetype
			)
		}
		return this.prisma.banner.update({
			where: { id },
			data: {
				link: dto.link,
        isActive: dto.isActive,
				...(imageUrl ? { image: imageUrl } : {})
			}
		})
	}
	async delete(id: string) {
		return this.prisma.banner.delete({
			where: { id }
		})
	}
}
