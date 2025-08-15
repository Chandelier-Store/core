import {
	BadRequestException,
	ForbiddenException,
	Injectable
} from '@nestjs/common'
import { Role } from '@prisma/client'
import { hash } from 'argon2'
import { PrismaService } from 'src/prisma.service'
import { UserDto } from './dto/user.dto'

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
	async create(data: UserDto, currentUser: { id: string; role: Role }) {
		this.checkPermission(currentUser)
		const existingUser = await this.prisma.user.findUnique({
			where: { email: data.email }
		})
		if (existingUser) {
			throw new BadRequestException('User with this email already exists')
		}
		return this.prisma.user.create({
			data: {
				email: data.email,
				password: await hash(data.password),
				name: data.name,
				phone: data.phone,
				role: data.role ? (data.role as Role) : undefined
			}
		})
	}
	async update(
		id: string,
		data: UserDto,
		currentUser: { id: string; role: Role }
	) {
		this.checkPermission(currentUser)
		const existingUser = await this.prisma.user.findUnique({
			where: { email: data.email }
		})
		if (existingUser && existingUser.id !== id) {
			throw new BadRequestException('User with this email already exists')
		}
		let hashedPassword: string | undefined
		if (data.password) {
			hashedPassword = await hash(data.password)
		}
		return this.prisma.user.update({
			where: { id },
			data: {
				email: data.email,
				password: hashedPassword,
				name: data.name,
				phone: data.phone,
				role: data.role ? { set: data.role as Role } : undefined
			}
		})
	}
	async delete(id: string, currentUser: { id: string; role: Role }) {
		this.checkPermission(currentUser)
		return this.prisma.user.delete({
			where: { id }
		})
	}
	async checkPermission(currentUser) {
		if (currentUser.role !== Role.ADMIN) {
			throw new ForbiddenException(
				'You do not have permission to perform this action'
			)
		}
	}
}
