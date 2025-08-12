import { IsOptional, IsString } from 'class-validator'

export class UserDto {
	@IsString()
	email: string

	@IsString()
	password: string

	@IsString()
	name: string

	@IsOptional()
	@IsString()
	phone?: string

	@IsOptional()
	@IsString()
	role?: string
}
