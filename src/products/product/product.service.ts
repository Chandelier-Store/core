import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
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
				`product/${Date.now()}-${image.originalname}`,
				image.buffer,
				image.mimetype
			)
		}
		if (preview) {
			previewUrl = await this.storageService.uploadFile(
				'images',
				`product/${Date.now()}-${preview.originalname}`,
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
	async getTodayProduct() {
		const todayStr = new Date().toISOString().split('T')[0]
		const today = new Date(todayStr)

		const picked = await this.prisma.product.findFirst({
			where: { lastPickedAt: { gte: today } },
			include: { category: true, variants: true }
		})
		if (picked) return picked
		return this.pickNewProduct(today)
	}
	async pickNewProduct(today: Date) {
		const allProducts = await this.prisma.product.findMany()
		const unusedToday = allProducts.filter(p => {
			return !p.lastPickedAt || p.lastPickedAt < today
		})

		const productToPick =
			unusedToday.length > 0
				? unusedToday[Math.floor(Math.random() * unusedToday.length)]
				: allProducts.sort(
						(a, b) =>
							(a.lastPickedAt?.getTime() ?? 0) -
							(b.lastPickedAt?.getTime() ?? 0)
					)[0]

		return this.prisma.product.update({
			where: { id: productToPick.id },
			data: { lastPickedAt: new Date() },
			include: { category: true, variants: true }
		})
	}
}
