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
	async create(dto: UserDto, currentUser: { id: string; role: Role }) {
		await this.checkPermission(currentUser)
		const existingUser = await this.prisma.user.findUnique({
			where: { email: dto.email }
		})
		if (existingUser) {
			throw new BadRequestException('User with this email already exists')
		}
		return this.prisma.user.create({
			data: {
				email: dto.email,
				password: await hash(dto.password),
				name: dto.name,
				phone: dto.phone,
				role: dto.role ? (dto.role as Role) : undefined
			}
		})
	}
	async update(
		id: string,
		dto: UserDto,
		currentUser: { id: string; role: Role }
	) {
		await this.checkPermission(currentUser)
		const existingUser = await this.prisma.user.findUnique({
			where: { email: dto.email }
		})
		if (existingUser && existingUser.id !== id) {
			throw new BadRequestException('User with this email already exists')
		}
		let hashedPassword: string | undefined
		if (dto.password) {
			hashedPassword = await hash(dto.password)
		}
		return this.prisma.user.update({
			where: { id },
			data: {
				email: dto.email,
				password: hashedPassword,
				name: dto.name,
				phone: dto.phone,
				role: dto.role ? { set: dto.role as Role } : undefined
			}
		})
	}
	async delete(id: string, currentUser: { id: string; role: Role }) {
		await this.checkPermission(currentUser)
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
