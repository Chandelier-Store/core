import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { UserDto } from './dto/user.dto'
import { Role } from '@prisma/client'

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}
	async getList() {
		const items = await this.prisma.user.findMany()
		const count = await this.prisma.user.count()
		return {
			data: items,
			meta: { count }
		}
	}
  async getById(id: string) {
		return this.prisma.user.findUnique({
			where: { id }
		})
	}
	async update(id: string, data: UserDto) {
    const isSameUser = await this.prisma.user.findUnique({
			where: { email: data.email }
		})
    if (isSameUser && isSameUser.id !== id) {
			throw new Error('User already exists')
		}
    const user = await this.getById(id)
		if (!user) {
			throw new Error('User not found')
		}
		return this.prisma.user.update({
			where: { id },
			data: {
				email: data.email,
				password: data.password,
				name: data.name,
				phone: data.phone,
				role: data.role ? { set: data.role as Role } : undefined
			}
		})
	}
}
