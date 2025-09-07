import { Injectable } from '@nestjs/common'
import { Prisma, Product } from '@prisma/client'
import { PrismaService } from 'src/prisma.service'
import { StorageService } from 'src/storage/storage.service'
import { ProductDto } from './dto/product.dto'
import { QueryDto } from './dto/query.dto'

@Injectable()
export class ProductService {
	constructor(
		private prisma: PrismaService,
		private storageService: StorageService
	) {}
	async getList(query: QueryDto) {
		const where: Prisma.ProductWhereInput = {
			...(query.search && {
				name: {
					contains: query.search,
					mode: Prisma.QueryMode.insensitive
				}
			})
		}

		const [items, count] = await this.prisma.$transaction([
			this.prisma.product.findMany({
				where,
				include: {
					category: true,
					variants: true
				},
				orderBy: {
					createdAt: 'desc'
				},
				take: query.limit ?? 20,
				skip: query.offset ?? 0
			}),
			this.prisma.product.count({ where })
		])

		return {
			data: items,
			meta: {
				count
			}
		}
	}
	async create(
		dto: ProductDto,
		image?: Express.Multer.File,
		preview?: Express.Multer.File
	) {
		let imageUrl: string | undefined
		let previewUrl: string | undefined
		if (image) {
			imageUrl = await this.storageService.uploadFile(
				'images',
				`products/${Date.now()}-${image.originalname}`,
				image.buffer,
				image.mimetype
			)
		}
		if (preview) {
			previewUrl = await this.storageService.uploadFile(
				'images',
				`products/${Date.now()}-${preview.originalname}`,
				preview.buffer,
				preview.mimetype
			)
		}
		const categoryId =
			dto.categoryId && dto.categoryId !== 'undefined'
				? dto.categoryId
				: undefined
		return this.prisma.product.create({
			data: {
				name: dto.name,
				description: dto.description,
				...(imageUrl ? { image: imageUrl } : {}),
				...(previewUrl ? { preview: previewUrl } : {}),
				...(categoryId ? { categoryId } : {}),
				variants: {
					create: dto.variants.map(variant => ({
						size: variant.size,
						price: variant.price,
						inStock: variant.inStock
					}))
				}
			},
			include: {
				variants: true
			}
		})
	}
	async update(
		id: string,
		dto: ProductDto,
		image?: Express.Multer.File,
		preview?: Express.Multer.File
	) {
		let imageUrl: string | undefined
		let previewUrl: string | undefined
		if (image) {
			imageUrl = await this.storageService.uploadFile(
				'images',
				`products/${Date.now()}-${image.originalname}`,
				image.buffer,
				image.mimetype
			)
		}
		if (preview) {
			previewUrl = await this.storageService.uploadFile(
				'images',
				`products/${Date.now()}-${preview.originalname}`,
				preview.buffer,
				preview.mimetype
			)
		}
		await this.prisma.productVariant.deleteMany({
			where: { productId: id }
		})
		const variantsCreate = dto.variants.map(variant => ({
			size: variant.size,
			price: variant.price,
			inStock: variant.inStock
		}))
		return this.prisma.product.update({
			where: { id },
			data: {
				name: dto.name,
				description: dto.description,
				...(imageUrl ? { image: imageUrl } : {}),
				...(previewUrl ? { preview: previewUrl } : {}),
				...(dto.categoryId ? { categoryId: dto.categoryId } : {}),
				variants: {
					create: variantsCreate
				}
			},
			include: {
				category: true,
				variants: true
			}
		})
	}
	async delete(id: string) {
		return this.prisma.product.delete({
			where: { id }
		})
	}
	async getWeekProducts(limit = 5) {
		const weekStart = new Date()
		weekStart.setHours(0, 0, 0, 0)
		weekStart.setDate(weekStart.getDate() - weekStart.getDay())

		const picked = await this.prisma.product.findMany({
			where: { lastPickedAt: { gte: weekStart } },
			include: { category: true, variants: true }
		})
		if (picked.length >= limit) return picked
		return this.pickNewWeekProducts(picked, limit, weekStart)
	}
	async pickNewWeekProducts(
		existing: Product[],
		limit: number,
		weekStart: Date
	) {
		const allProducts = await this.prisma.product.findMany()
		const unused = allProducts.filter(
			p => !p.lastPickedAt || p.lastPickedAt < weekStart
		)
		const toPick: Product[] = []

		while (toPick.length + existing.length < limit) {
			if (unused.length === 0) break
			const index = Math.floor(Math.random() * unused.length)
			toPick.push(unused.splice(index, 1)[0])
		}
		const updated = await Promise.all(
			toPick.map(p =>
				this.prisma.product.update({
					where: { id: p.id },
					data: { lastPickedAt: new Date() },
					include: { category: true, variants: true }
				})
			)
		)
		return [...existing, ...updated]
	}
}
