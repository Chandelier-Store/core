import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CategoryDto } from './dto/category.dto'

@Injectable()
export class CategoryService {
	constructor(private prisma: PrismaService) {}
	async getList() {
		const items = await this.prisma.category.findMany()
		const count = await this.prisma.category.count()
		return {
			data: items,
			meta: { count }
		}
	}
	async create(dto: CategoryDto) {
		return this.prisma.category.create({
			data: {
				name: dto.name
			}
		})
	}
	async update(id: string, dto: CategoryDto) {
		return this.prisma.category.update({
			where: { id },
			data: {
				name: dto.name
			}
		})
	}
	async delete(id: string) {
		return this.prisma.category.delete({
			where: { id }
		})
	}
}
