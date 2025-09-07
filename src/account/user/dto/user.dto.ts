import {
	IsEnum,
	IsOptional,
	IsString,
	Matches,
	MinLength
} from 'class-validator'

export class UserDto {
	@IsString()
	email: string

	@IsOptional()
	@IsString()
	@MinLength(6, {
		message: 'Password is too short. Minimum length is 6 characters.'
	})
	password: string

	@IsString()
	name: string

	@IsOptional()
	@IsString()
	@Matches(/^\+?[0-9]{10,15}$/, { message: 'Invalid phone number' })
	phone?: string

	@IsOptional()
	@IsString()
	@IsEnum(['ADMIN', 'MANAGER', 'USER'], { message: 'Invalid role' })
	role?: string
}
