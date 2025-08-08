import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { FaqDto } from './dto/faq.dto'

@Injectable()
export class FaqService {
	constructor(private prisma: PrismaService) {}
	async getList() {
		const items = await this.prisma.faq.findMany()
		const count = await this.prisma.faq.count()
		return {
			data: items,
			meta: { count }
		}
	}
	async create(dto: FaqDto) {
		return this.prisma.faq.create({
			data: {
				question: dto.question,
				answer: dto.answer
			}
		})
	}
	async update(id: string, dto: FaqDto) {
		return this.prisma.faq.update({
			where: { id },
			data: {
				question: dto.question,
				answer: dto.answer
			}
		})
	}
}
