import { Prisma } from '@prisma/client'

export const returnProductObject: Prisma.ProductSelect = {
	id: true,
	createdAt: true,
	image: true,
	name: true,
	slug: true,
	description: true,
	discount: true,
	category: {
		select: {
			id: true,
			name: true
		}
	},
	variants: {
		select: {
			id: true,
			size: true,
			price: true,
			inStock: true
		}
	}
}
