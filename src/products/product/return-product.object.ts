import { Prisma } from '@prisma/client'

export const returnProductObject: Prisma.ProductSelect = {
	id: true,
	createdAt: true,
	image: true,
	preview: true,
	name: true,
	description: true,
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
