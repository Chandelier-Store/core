import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma, Product } from '@prisma/client'
import { generateSlug } from 'src/helpers/slug.helper'
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
			}),
			...(query.category && {
				category: {
					slug: query.category
				}
			})
		}

		const limit = query.limit ?? 20
		const page = query.page ?? 1
		const offset = (page - 1) * limit

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
				take: limit,
				skip: offset
			}),
			this.prisma.product.count({ where })
		])

		return {
			data: items,
			meta: {
				total: count,
				limit,
				page,
				pageCount: Math.ceil(count / limit)
			}
		}
	}
	async getBySlug(slug: string) {
		const product = await this.prisma.product.findUnique({
			where: { slug },
			include: {
				category: true,
				variants: true
			}
		})
		if (!product)
			throw new NotFoundException(`Product with slug ${slug} not found`)
		return product
	}
	async create(dto: ProductDto, image?: Express.Multer.File) {
		const imageUrl = await this.storageService.uploadImageByFolderName(
			'products',
			image
		)
		const categoryId =
			dto.categoryId && dto.categoryId !== 'undefined'
				? dto.categoryId
				: undefined
		return this.prisma.product.create({
			data: {
				name: dto.name,
				slug: generateSlug(dto.name),
				description: dto.description,
				...(imageUrl ? { image: imageUrl } : {}),
				...(categoryId ? { categoryId } : {}),
				variants: {
					create: dto.variants.map(variant => ({
						size: variant.size,
						price: variant.price,
						inStock: variant.inStock
					}))
				}
			} as Prisma.ProductCreateInput,
			include: {
				variants: true
			}
		})
	}
	async update(id: string, dto: ProductDto, image?: Express.Multer.File) {
		const product = await this.prisma.product.findUnique({ where: { id } })
		if (!product) throw new NotFoundException(`Product with id ${id} not found`)

		let imageUrl: string | undefined
		if (image) {
			imageUrl = await this.storageService.uploadImageByFolderName(
				'products',
				image
			)
			if (product.image) {
				await this.storageService.deleteFileByUrl(product.image)
			}
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
				slug: generateSlug(dto.name),
				description: dto.description,
				...(imageUrl ? { image: imageUrl } : {}),
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
		const product = await this.prisma.product.findUnique({ where: { id } })
		if (!product) throw new NotFoundException(`Product with id ${id} not found`)
		if (product.image) {
			await this.storageService.deleteFileByUrl(product.image)
		}
		return this.prisma.product.delete({ where: { id } })
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
